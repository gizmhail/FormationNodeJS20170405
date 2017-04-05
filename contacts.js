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
    str += options.color ? chalk.red(this.firstName):this.firstName
    str += " "
    str += options.color ? chalk.blue(this.lastName):this.lastName
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
    this.contacts = [];
  }

  read(callback) {
    fs.readFile(this.path, (error, data) => {
      if (error) throw error;
      var contactDescriptions = JSON.parse(data);
      this.contacts = contactDescriptions.map(function (contactData){
          return new Contact(contactData);
      });
      callback(this.contacts);
    });
  }

  print(options) {
    this.read((contactData) => {
      contactData.forEach(function(contact){
        console.log(contact.toString(options));
      });
    });
  }
}

// Commands
function listCommand(argv){
  let contactService = new FileContactservice();
  contactService.print({color:argv.color});

}

// CLI interface description
yargs
.command('list', 'print the contacts included in contacts.json', {}, function(argv) {
  listCommand(argv);
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
