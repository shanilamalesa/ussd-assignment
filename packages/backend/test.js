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

}

runTests().catch(console.error);