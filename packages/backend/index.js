require("dotenv").config();
const express = require("express");
const app = express();

const ussdRouter = require("./src/routes/ussd");
app.use("/ussd", ussdRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`USSD server running on :${PORT}`);
})