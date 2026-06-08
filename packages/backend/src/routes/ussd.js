const express = require("express");
const fs = require("fs");
const router = express.Router();
const clamp = require("../utils/clamp");
const redis = require("../db/redis");
const leadsRepo = require("../repository/leadsRepo");
const { t } = require("../i18n/messages");


const KEY = (sessionId) =>`ussd:session:${sessionId}`;

async function getState(sessionId) {
    const raw = await redis.get(KEY(sessionId));
    if (!raw) return { state: "LANG_SELECT", data: {}, lang: "eng", createdAt: Date.now() };
    const session = JSON.parse(raw);
    if (!session.createdAt) session.createdAt = Date.now();
    return session;

}

async function setState(sessionId, session) {
    //EX--> expires this key after 180 seconds
    await redis.set(KEY(sessionId), JSON.stringify(session), "EX", 180);
   
}

async function saveTranscript({ sessionId, phone, state, input, response}){
    const pool = require("../db/pool");
    await pool.query(
        `INSERT INTO ussd_transcripts (session_id, phone, state, input, response)
        VALUES ($1, $2, $3, $4, $5)`,
        [sessionId, phone, state, input, response]
    );
}

async function saveDrop({ sessionId, phone, state}) {
    const pool = require("../db/pool");
    await pool.query(
        `INSERT INTO ussd_drops (session_id, phone, state)
         VALUES ($1, $2, $3)`,
        [sessionId, phone, state]
    )
}

async function handleUssd({ sessionId, text }) {
    // throw new Error("Test error");
    const session = await getState(sessionId);
    console.log("createdAt:", session.createdAt);

    if (Date.now() - session.createdAt > 10000) {
    await redis.del(KEY(sessionId));
    // return "END Session timed out. Please dial again.";
    await saveDrop({
        sessionId,
        phone: "unknown",
        state: session.state
    });
    return "END Session timed out. Please dial again.";
}
    const input = text.split("*").pop() || "";

    if (input === "4") {
    return "END For help call: +254756765435";
}

    if (session.state === "LANG_SELECT") {
        if (input === "") return "CON Choose language:\n1. English\n2.  Kiswahili\n3. Español\n4. Help" ;
        if (input === "1") {
        session.lang = "en";
        session.state = "WELCOME";
        await setState(sessionId, session);
        return `CON ${t("en", "welcome")}\n${t("en", "menu")}`;
    }

    if (input === "2") {
        session.lang = "sw";
        session.state = "WELCOME";
        await setState(sessionId, session);
        return `CON ${t("sw", "welcome")}\n${t("sw", "menu")}`;
    
    }

    if (input === "3") {
        session.lang = "es";
        session.state = "WELCOME";
        await setState(sessionId, session);
        return `CON ${t("es", "welcome")}\n${t("es", "menu")}`;
    }

    // if (input === "4") {
    //     return "END For help call: +25475467874";
    // }

        return "CON Invalid.\n1. English\n2.  Kiswahili\n3. Español\n4. Help";

    }
        
    if (session.state === "WELCOME") {
        const lang = session.lang || "en";
        if (input === "") return `CON ${t(lang, "welcome")}\n${t(lang, "menu")}`;

        if (input === "1") {
            session.state = "AWAITING_NAME";
            await setState(sessionId, session);
            return `CON ${t(lang, "enterName")}\n0. Back\n4. Help`;
        }


        if (input === "2") return `END ${t(lang, "goodbye")}`;
            return `CON ${t(lang, "invalid")}\n${t(lang, "menu")}`;
    }

    if (session.state === "AWAITING_NAME") {
        const lang = session.lang || "en";
        if (input === "") return `CON ${t(lang, "welcome")}\n${t(lang, "menu")}`;

        if (input === "0") {
            session.state = "WELCOME";
            await setState(sessionId, session);
            return `CON ${t(lang, "welcome")}\n${t(lang, "menu")}`;
        }

        session.data.name = input;
        session.state = "AWAITING_PHONE";
        await setState(sessionId, session);
       return `CON ${t(lang, "enterPhone")}\n0. Back\n4. Help`;

    }

    if (session.state === "AWAITING_PHONE") {
        const lang = session.lang || "en";
        // console.log("session data so far:", session.data);
        if (input === "0") {
            session.state = "AWAITING_NAME";
            await setState(sessionId, session);
            return `CON ${t(lang, "enterName")}\n0. Back\n4. Help`; 
        }

        if (!/^0\d{9}$/.test(input)) {
            return `CON Invalid phone. Enter leads phone (e.g 0712345678)`;
        }
        session.data.phone = input;
        session.state = "CONFIRM";
        await setState(sessionId, session);
        return `CON ${t(lang, "confirmTemplate", session.data.name, session.data.phone)}`;
    }

    if (session.state === "CONFIRM") {
        const lang = session.lang || "en";

        if (input === "0") {
            session.state = "AWAITING_PHONE";
            await setState(sessionId, session);
            // return "CON Enter lead phone:\n0. Back";
            return `CON ${t(lang, "enterPhone")}\n0. Back\n4. Help`;
        }

        if (input === "1") {
            const lang = session.lang || "en";
            console.log("Saving lead:", session.data);
            try {
                await leadsRepo.upsertByPhone({
                    wa_phone: session.data.phone,
                    name: session.data.name,
                    source: "ussd",
                    created_via_session_id: sessionId,
                });
                await redis.del(KEY(sessionId));
                // return "END Lead saved. Asante.";
                return `END ${t(lang, "saved")}`;
            } catch (err) {
                console.log("USSD save failed:", err);
                return "END Error saving. Please try again later."
            }
        }

        // if (input === "1") {
        //     await redis.del(KEY(sessionId));
        //     return "END lead saved. Asante."
        // }
        if (input === "2")
        {
            await redis.del(KEY(sessionId));
            return `END ${t(lang, "cancelled")}`;
        }
        return "CON Inavlid. 1.save 2., Cancel"

    }

    return "END session error.";
}


router.post("/", express.urlencoded({ extended: false }), async (req, res) => {
    const { sessionId, serviceCode, phoneNumber, text } = req.body;

    console.log({  sessionId, serviceCode, phoneNumber, text  });
    const log = `[${new Date().toISOString()}] sessionId: ${sessionId} | serviceCode: ${serviceCode} | phone: ${phoneNumber} | text: ${text}\n`;
    await fs.promises.appendFile("logs/ussd.log", log);
   
    try {
        const response = await handleUssd( {sessionId, text } );

        if (response.startsWith("END") && text === "") {
        await saveDrop({
            sessionId,
            phone: phoneNumber,
            state: "dropped"
        });
    }

        await saveTranscript({
        sessionId,
        phone: phoneNumber,
        state: text,
        input: text.split("*").pop() || "",
        response
    });
        res.set("Content-Type", "text/plain").send(response);
    } catch (err) {
        console.log("USSD handler error:", err);
        res.set("Content-Type", "text/plain").send("END Service temporarily unavailable. Try again soon")
    }

    // res.set("Content-Type", "text/plain");
    // res.send(clamp(response));
});

module.exports = { router, handleUssd };





