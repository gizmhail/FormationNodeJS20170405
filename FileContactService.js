
const Contact = require('./Contact');
const fs = require('fs');
const _ = require('lodash');

class FileContactservice {
  constructor() {
    this.path = './contacts.json';
  }

  read(callback, path) {
    path = path || this.path;
    fs.readFile(path, (error, data) => {
      if(error){
        callback(error, null);
      } else {
        try {
          let contactDescriptions = JSON.parse(data);
          let contacts = contactDescriptions.map(function (contactData){
              return new Contact(contactData);
          });
          callback(error, contacts);
        } catch(e) {
          callback(e, null);
        }
      }
    });
  }

  write(contacts, callback) {
    let contactDescriptions = JSON.stringify(contacts);
    fs.writeFile(this.path, contactDescriptions, callback);
  }

  add(firstName, lastName, callback) {
    this.read((error, contacts) => {
      if(!contacts){
        contacts = [];
      }
      let id = 1 + _.reduce(contacts, (maxId, contact) =>{ return Math.max(maxId, contact.id ) }, 0);
      contacts.push( new Contact(id, firstName, lastName, "", "") ) ;
      this.write(contacts, (error) => {
        callback(error, contacts);
      });
    });
  }

  delete(contactId, callback) {
    this.read((error, contacts) => {
      contacts = _.filter(contacts, (contact) => { return contact.id != contactId});
      this.write(contacts, (error) => {
        callback(error, contacts);
      });
    });
  }

  // Note that this method will kill the process if the contact file is renamed or deleted
  // (for instance, during a checkout to reset it)
  watch(callback) {
    this.read( (error, initialContacts) => {
      let previousContacts = initialContacts;
      fs.watch(this.path, (eventType, filename) => {
        if(eventType == 'rename') {
          // File deleted
          console.log("Unable to continue watching: file renamed");
          process.exit();
        }
        this.read( (error, newContacts) => {
          if(!error){
            let referenceContacts = _.clone(previousContacts);
            let added = _.differenceWith(newContacts, referenceContacts, _.isEqual);
            let removed = _.differenceWith(referenceContacts, newContacts, _.isEqual);
            if(added.length != 0 || removed.length != 0){
              callback(error, newContacts, referenceContacts, added, removed);
              previousContacts = newContacts;
            }
          }
        });
      });
    });
  }

  print(options) {
    this.read( (error, contacts) => {
      if(contacts.length == 0) {
        console.log("No contact.")
      }
      contacts.forEach(function(contact){
        console.log(contact.toString(options));
      });
    });
  }

  resetContactsToDefaultValue(callback) {
    // Read the archived file contacts.json.default
    this.read( (error, archivedContacts) => {
      this.write(archivedContacts, (error) => {
        if(error){
          callback(error);
        } else {
          // Read again to check that everything is fine and return the actualy stored contacts
          this.read(callback);
        }
      });
    }, './contacts.json.default')
  }
}

module.exports = FileContactservice;
