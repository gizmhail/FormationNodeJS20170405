#!/usr/local/bin/node
var _ = require('lodash');
var chalk = require('chalk');
var yargs = require('yargs');
var argv = yargs.argv;

let contacts = require('./contacts.json');

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
    this.loadContacts()
  }

  loadContacts() {
    this.contacts = contacts.map(function (contactData){
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

function printHelp(){
  console.log("Usage: " + argv.$0 + " <command>");
  console.log("Available commands:")
  console.log("\tprint\tPrint the contacts included in contacts.json");
}

if(argv.help) {
  printHelp();
} if(argv.list) {
  let contactService = new ContactService();
  contactService.print({color:argv.color});
} else {
  printHelp();
}
