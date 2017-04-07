CLI node app to handle a contact list. Also include a http serve to serve contact.
Sample learning program, made during a NodeJS learning course.

Usage
=======================
CLI mode
-----------
`node index.js list [--color]`
List contacts (optionaly colorizing some part of contact info - the name mainly)

`node index.js add <firstName> <lastName> [--color]`
Add a contact

`node index.js delete <id> [--color]`
Delete a contact

`node index.js watch [--color]`
Watch for any contact changes

Server mode
-----------
`node index.js serve`
Start the web server

Development remarks
=======================

contacts.json changes
-----------------------
When working on the contacts list, the contact.json file will change.
To avoid commiting changes to it, tell git that we assume to have it unchanged all the time:
`git update-index --assume-unchanged contacts.json`

To restore the normal behavior:
`git update-index --no-assume-unchanged contacts.json`

public
--------
The learning course had a `public/`  directory containing a web client. It is not provided here, has it is not released under an OSS license.
