# Session Trace

## Step 1: User dials
Redis contains nothing yet — the session is brand new so the 
locker is empty. The server defaults to WELCOME state.
{ "state": "WELCOME", "data": {} }

## Step 2: User picks option 1 (Add lead)
Redis is no longer empty. The state changes to AWAITING_NAME 
so the server knows to ask for a name on the next request.
{ "state": "AWAITING_NAME", "data": {} }

## Step 3: User types their name
Redis notes the name the user entered. The state moves to 
AWAITING_PHONE so the server knows to ask for a phone number.
{ "state": "AWAITING_PHONE", "data": { "name": "Shanila" } }

## Step 4: User types their phone number
The phone number is validated — it must start with 0 and be 
exactly 10 digits. Redis saves the phone and moves to CONFIRM 
state so the user can review their details.
{ "state": "CONFIRM", "data": { "name": "Shanila", "phone": "0712345678" } }

## Step 5: User confirms and saves
The user confirms and the lead is saved. Redis deletes the 
session — the locker is cleared. Session complete!
Redis contains: nothing (key deleted)