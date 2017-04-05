#!/usr/local/bin/node
let contacts = require('./contacts.json');

class Contact {
  constructor(id, firstName, lastName, address, phone) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.address = address;
    this.phone = phone;
  }

  toString() {
    return "[" + this.id + "] " + this.firstName + " " + this.lastName + "\n"
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
    //this.contacts.push( new Contact(1, "Sébastien", "Poivre", "25 rue Lavoisier", "0687699431") ) ;
    this.contacts = contacts.map(function (contactData){
      return new Contact(
        contactData["id"],
        contactData["firstName"],
        contactData["lastName"],
        contactData["address"] ,
        contactData["phone"]);
    });
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
