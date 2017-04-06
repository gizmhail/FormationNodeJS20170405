
const Contact = require('./Contact');

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

module.exports = ContactService;
