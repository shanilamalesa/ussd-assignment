

## Protocol quirks log (from AT docs)

1. Every response starts with CON or END. CON means continue — every time 
the user picks an option, AT sends another POST to keep the session alive. 
END means the session is closing, like when the user clicks exit.

2. Sessions expire after 180 seconds. When the user delays filling the 
input, after 90-180 seconds the session expires and the user has to start 
over again. That is why Redis TTL is set to EX 180.

3. The text field is cumulative. When the user types inputs like 2, then 3, 
then 1, the text field would be 2*3*1. That is why we use text.split("*").pop() 
to get only the last segment — the most recent input.

4. Character budget is ~182 per screen. The interface text is plain text with 
approximately 182 characters per screen. When it exceeds that it should be 
sliced to 182. That is what the clamp function does.

5. Invalid menu options should re-render with CON, never END. If the user 
enters an invalid option the session should stay open with CON so they can 
try again without having to dial from scratch.


### What I used AI for:
- Help setting up Upstash Redis when local install wasn't possible
- Understanding what the event loop is and why appendFileSync blocks it
- Debugging code structure when handleUssd was in the wrong place
- Understanding what TTL means in Redis

### What I wrote myself:
- The state machine logic
- The clamp function
- The back option for each state
- The session timer check
- The automated tests

## Day 3 AI Usage

### What I used AI for:
- Reasoning through the structure of connecting two separate project 
  folders (USSD assignment and Postgres Assignment) into one workflow
- Debugging errors such as missing .env file, wrong file paths, 
  duplicate router.post blocks, and saveTranscript being called 
  after res.send()
- Understanding what ON CONFLICT means in PostgreSQL
- Understanding what ALTER TABLE does to an existing database
- Understanding what created_via_session_id is and why it's useful

### What I wrote myself:
- The upsertByPhone function with ON CONFLICT
- The saveTranscript function
- The source badge logic in the React dashboard
- The /api/stats/sources endpoint
- The ussd_transcripts table schema