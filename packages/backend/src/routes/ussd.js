const express = require("express");
const fs = require("fs");
const router = express.Router();
const clamp = require("../utils/clamp");
const redis = require("../db/redis");
const leadsRepo = require("../repository/leadsRepo");


const KEY = (sessionId) =>`ussd:session:${sessionId}`;

async function getState(sessionId) {
    const raw = await redis.get(KEY(sessionId));
    if (!raw) return { state: "WELCOME", data: {}, createdAt: Date.now() };
    const session = JSON.parse(raw);
    if (!session.createdAt) session.createdAt = Date.now();
    return JSON.parse(raw);

}

async function setState(sessionId, session) {
    //EX--> expires this key after 180 seconds
    await redis.set(KEY(sessionId), JSON.stringify(session), "EX", 180);
}

async function handleUssd({ sessionId, text }) {
    const session = await getState(sessionId);
    console.log("createdAt:", session.createdAt);

    if (Date.now() - session.createdAt > 180000) {
    await redis.del(KEY(sessionId));
    return "END Session timed out. Please dial again.";
}
    const input = text.split("*").pop() || "";

    if (session.state === "WELCOME") {
        if (input === "") return "CON Welcome\n1. Add lead\n2. Exit";

        if (input === "1") {
            session.state = "AWAITING_NAME";
            await setState(sessionId, session);
            return "CON Enter lead name:\n0. Back";
        }


        if (input === "2") return "END Goodbye";
            return "CON Invalid. 1. Add lead 2. Exit";
    }

    if (session.state === "AWAITING_NAME") {
        if (input === "0") {
            session.state = "WELCOME";
            await setState(sessionId, session);
            return "CON Welcome\n1. Add lead\n2. Exit";
        }
        session.data.name = input;
        session.state = "AWAITING_PHONE";
        await setState(sessionId, session);
        return "CON Enter lead phone:\n0. Back";

    }

    if (session.state === "AWAITING_PHONE") {

           console.log("session data so far:", session.data);
        if (input === "0") {
            session.state = "AWAITING_NAME";
            await setState(sessionId, session);
            return "CON Enter lead name:\n0. Back";
        }

        if (!/^0\d{9}$/.test(input)) {
            return `CON Invalid phone. Enter leads phone (e.g 0712345678)`;
        }
        session.data.phone = input;
        session.state = "CONFIRM";
        await setState(sessionId, session);
            return `CON Confirm:\nName: ${session.data.name}\nPhone: ${session.data.phone}\n1. Save\n2. Cancel`;
    }

    if (session.state === "CONFIRM") {

        if (input === "0") {
            session.state = "AWAITING_PHONE";
            await setState(sessionId, session);
            return "CON Enter lead phone:\n0. Back";
        }

        if (input === "1") {
            console.log("Saving lead:", session.data);
            try {
                await leadsRepo.upsertByPhone({
                    wa_phone: session.data.phone,
                    name: session.data.name,
                    source: "ussd",
                });
                await redis.del(KEY(sessionId));
                return "END Lead saved. Asante.";
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
            return "END Cancelled.";
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

    const response = await handleUssd({ sessionId, text });
    res.set("Content-Type", "text/plain");
    res.send(clamp(response));
});

module.exports = { router, handleUssd };



