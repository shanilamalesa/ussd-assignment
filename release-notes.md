# Release Notes

## Version 0.4.0 - Minor Bump

### Reasoning
This is a MINOR bump because new features were added without 
breaking any existing functionality:

- Added multi-language support (English, Kiswahili, Español)
- Added help command accessible from every screen
- Added session drop tracking
- Added error handling

No existing API responses were changed and no breaking changes 
were introduced, so a MAJOR bump is not needed.

A PATCH bump would not be appropriate since these are new 
features, not just bug fixes.

## Version 0.3.0 - Minor Bump

### Reasoning
MINOR bump because new features were added:
- USSD menu via Africa's Talking
- Redis state machine
- PostgreSQL CRM integration
- Source badges on dashboard


## Reflection on Changelogs and Release Notes

**Who is the audience for a changelog?**
The audience is not just developers — testers, project managers, 
clients, and even non-technical users read changelogs to understand 
what changed in the project and how it affects them.

**What does a good release note feel like to read?**
A good release note is clear, short, and easy to understand even 
for someone who is not a developer. It should explain what was added, 
changed, or fixed without using too much technical language.

**What is the difference between a commit message and a release note?**
Commit messages store the history of every small change made in 
the codebase on GitHub, like "feat: add source badges". Release notes 
summarise all those changes together into one document that explains 
what the whole release contains at a higher level.

**When would you skip a release entirely?**
I would skip a release if the changes are too small to be significant 
— like fixing a typo in a comment or renaming a variable. A release 
should only be published when there are meaningful changes that affect 
how the project works.