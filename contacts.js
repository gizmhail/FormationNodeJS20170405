#!/usr/local/bin/node
var _ = require('lodash');
var chalk = require('chalk');
var yargs = require('yargs');
var fs = require('fs');


class Contact {
  constructor(id, firstName, lastName, address, phone) {
    if(arguments.length == 1 && Object.keys(arguments[0]).length >= 5){
      Object.assign(this, arguments[0]);
    } else {
      this.id = id;
      this.firstName = firstName;
      this.lastName = lastName;
      this.address = address;
      this.phone = phone;
    }
  }

  toString(options) {
    let str = "[" + this.id + "] "
    str += (options && options.color) ? chalk.red(this.firstName):this.firstName
    str += " "
    str += (options && options.color) ? chalk.blue(this.lastName):this.lastName
    str += "\n"
    str += "Address: " + this.address + "\n"
    str += "Phone: " + this.phone
    return str;
  }

}

class ContactService {
  constructor() {
    this.contacts = [];
  }

  loadContacts(contactDescriptions) {
    this.contacts = contactDescriptions.map(function (contactData){
        return new Contact(contactData);
    });
    this.contacts.push( new Contact(444, "Sébastien", "Poivre", "25 rue Lavoisier", "0687699431") ) ;
  }

  get() {
    return this.contacts;
  }

  print(options) {
    this.get().forEach(function(contact){
      console.log(contact.toString(options));
    });
  }
}

class FileContactservice {
  constructor() {
    this.path = './contacts.json';
  }

  read(callback) {
    fs.readFile(this.path, (error, data) => {
      try {
        let contactDescriptions = JSON.parse(data);
        let contacts = contactDescriptions.map(function (contactData){
            return new Contact(contactData);
        });
        callback(error, contacts);
      } catch(e) {
        callback(e, null);
      }
    });
  }

  write(contacts, callback) {
    let contactDescriptions = JSON.stringify(contacts);
    fs.writeFile(this.path, contactDescriptions, callback);
  }

  add(firstName, lastName, callback) {
    this.read((error, contacts) => {
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

  watch(callback) {
    this.read( (error, initialContacts) => {
      let previousContacts = initialContacts;
      fs.watch(this.path, () => {
        this.read( (error, newContacts) => {
          let referenceContacts = _.clone(previousContacts);
          let added = _.differenceWith(newContacts, referenceContacts, _.isEqual);
          let removed = _.differenceWith(referenceContacts, newContacts, _.isEqual);
          if(error || added.length != 0 || removed.length != 0){
            callback(error, newContacts, referenceContacts, added, removed);
          }
          previousContacts = newContacts;
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
}

// Commands
function listCommand(argv) {
  let contactService = new FileContactservice();
  contactService.print({color:argv.color});

}

function addContactCommand(argv) {
  let contactService = new FileContactservice();
  contactService.add(argv.firstName, argv.lastName, function(error, contacts){
    if (error) throw error;
    contactService.print({color:argv.color});
  });
}

function deleteContactCommand(argv) {
  let contactService = new FileContactservice();
  contactService.delete(argv.contactId, function(error, contacts){
    if (error) throw error;
    contactService.print({color:argv.color});
  });
}

function watchCommand(argv) {
  let contactService = new FileContactservice();
  contactService.watch(function(error, contacts, previousContacts, added, removed){
    console.log("-------------\nContacts changed.");
    if(error) {
      console.log("[Error] Corrupted contact file.")
    } else {
      if(added.length > 0){
          console.log("+++\n Added contacts:")
          added.forEach((contact) => { console.log(contact.toString({color:argv.color})) });
      }
      if(removed.length > 0){
          console.log("---\nRemoved contacts:")
          removed.forEach((contact) => { console.log(contact.toString({color:argv.color})) });
      }
    }
  });
}

// CLI interface description
yargs
.command('list', 'print the contacts included in contacts.json', {}, function(argv) {
  listCommand(argv);
} )
.command('watch', 'watch contacts.json and print its new change if changed', {}, function(argv) {
  watchCommand(argv);
} )
.command('add [firstName] [lastName]', 'add a contact', {
  firstName:{  },
  lastName:{  },
  }, function(argv) {
    addContactCommand(argv);
} )
.command('delete [contactId]', 'delete a contact', {
  contactId:{  }
  }, function(argv) {
    deleteContactCommand(argv);
} )
.help()
.options({
  'color': {
    describe: 'Use this option to colorize name in command results',
    type: 'bool'
  }
})
.demandCommand(1)
.strict()
.argv;
