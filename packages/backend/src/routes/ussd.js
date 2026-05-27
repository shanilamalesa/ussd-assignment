const express = require("express");
const fs = require("fs");
const router = express.Router();
const clamp = require("../utils/clamp");


router.post("/", express.urlencoded({ extended: false }), (req, res) => {
    const { sessionId, serviceCode, phoneNumber, text } = req.body;

    console.log({  sessionId, serviceCode, phoneNumber, text  });
    const log = `[${new Date().toISOString()}] sessionId: ${sessionId} | serviceCode: ${serviceCode} | phone: ${phoneNumber} | text: ${text}\n`;
    fs.appendFileSync("logs/ussd.log", log);

    let response = "";
    if (text === ""){
        response = "CON Welcome to Mactaba CRM\n1. My leads\n2. New lead\n3. Exit\n4. Back";
    } else if (text === "1") {
        response = "END New leads feature is coming soon.";
    } else if (text === "2") {
        response = "END New lead feature is coming soon.";
    } else if (text === "3") {
        response = "END Asante. Bye."
    } else if ( text === "4") {
        response = "CON Back\n1. My leads\n2. New lead\n3. Exit";
    } else {
        // resonse = "END Invalid option";
        response = "CON Invalid option\n1. My leads\n2. New lead\n3. Exit"
    }

    res.set("Content-Type", "text/plain");
    res.send(clamp(response));
});



module.exports = router;