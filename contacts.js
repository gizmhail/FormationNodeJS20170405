#!/usr/local/bin/node
var _ = require('lodash');
var chalk = require('chalk');

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

  toString() {
    return "[" + this.id + "] "
      + chalk.red(this.firstName) + " " + chalk.blue(this.lastName) + "\n"
      + "Address: " + this.address + "\n"
      + "Phone: " + this.phone
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

  print() {
    this.get().forEach(function(contact){
      console.log(contact.toString());
    });
  }
}

let contactService = new ContactService();
contactService.print();
