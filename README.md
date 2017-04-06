CLI node app to handle a contact list
Sample learning program

Development remarks
=======================

contacts.json changes
-----------------------
When working on the contacts list, the contact.json file will change.
To avoid commiting changes to it, tell git that we assume to have it unchanged all the time
git update-index --assume-unchanged contacts.json

To restore the normal behavior:
git update-index --no-assume-unchanged contacts.json
