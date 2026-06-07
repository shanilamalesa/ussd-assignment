require("dotenv").config();
const { handleUssd } = require("./src/routes/ussd");

async function runTests() {
    console.log("Running tests...\n");

    //Test 1: Welcome Screen
    const res1 = await handleUssd({ sessionId: "test-001", text:""});
    console.log("Test 1 - Welcome Screen:");
    console.log("Expected: CON Welcome\\n1. Add lead\\n2. Exit");
    console.log("Got:   ", res1);
    console.log(res1.startsWith("CON Welcome") ? "PASS" : "FAIL");
    console.log();

    //Test 2: Pick option 1
    const res2 = await handleUssd({ sessionId: "test-001", text: "1"});
    console.log("Got:  ", res2);
    console.log(res2.startsWith("CON Enter lead name") ? "PASS" : "FAIL");
    console.log();

    // Test 3: Enter name
    const res3 = await handleUssd({ sessionId: "test-001", text: "1*TestUser" });
    console.log("Test 3 - Enter name:");
    console.log("Got:   ", res3);
    console.log(res3.startsWith("CON Enter lead phone") ? "PASS" : " FAIL");
    console.log();

    // Test 4: Enter phone
    const res4 = await handleUssd({ sessionId: "test-001", text: "1*TestUser*0712345678" });
    console.log("Test 4 - Enter phone:");
    console.log("Got:   ", res4);
    console.log(res4.startsWith("CON Confirm") ? "PASS" : "FAIL");
    console.log();

    // Test 5: Confirm save
    const res5 = await handleUssd({ sessionId: "test-001", text: "1*TestUser*0712345678*1" });
    console.log("Test 5 - Confirm save:");
    console.log("Got:   ", res5);
    console.log(res5.startsWith("END Lead saved") ? "PASS" : "FAIL");
    console.log();

    // Test 6: Verify row in database
    const pool = require("./src/db/pool");
    const { rows } = await pool.query("SELECT * FROM leads WHERE wa_phone = $1", ["0712345678"]);
    console.log("Test 6 - Row in database:");
    console.log("Got:   ", rows[0]);
    console.log(rows.length > 0 ? " PASS" : " FAIL");
    console.log();

    // Cleanup
    await pool.query("DELETE FROM leads WHERE wa_phone = $1", ["0712345678"]);
    console.log("Cleanup done ");

    pool.end();
    process.exit(0);
    }

runTests().catch(console.error);