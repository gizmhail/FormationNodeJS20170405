var chalk = require('chalk');

class Contact {
  constructor(id, firstName, lastName, address, phone) {
    if(arguments.length == 1){
      let contactData = arguments[0];
      this.id = contactData.id;
      this.firstName = contactData.firstName;
      this.lastName = contactData.lastName;
      this.address = contactData.address;
      this.phone = contactData.phone;
      if(this.id == undefined){
        throw "Contact creation error: missing id in " + JSON.stringify(contactData);
      }
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

module.exports = Contact;
