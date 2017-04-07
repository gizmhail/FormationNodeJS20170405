const mongoose = require('mongoose');
const Contact = require('./Contact');
const util = require('util');
const FileContactService = require('./FileContactService');
const Schema = mongoose.Schema;

var contactSchema = new Schema({
  id:  Number,
  firstName: String,
  lastName:   String
});

var ContactModel = mongoose.model('Contact', contactSchema);
// Hack to avoid to duplicate/inherit common code ;)
ContactModel.prototype.toString = Contact.prototype.toString;
// TODO: Fix it, cause problems (but should be cleaner/more elegant)
// util.inherits(ContactModel, Contact);

class MongoContactService {
  constructor(callback) {
    mongoose.connect('mongodb://localhost/test', callback);
  }

  read(callback) {
    ContactModel.find({}, (error, contacts) => {
      callback(error, contacts);
    });
  }

  add(firstName, lastName, callback) {
    let args = arguments;
    ContactModel.findOne().sort('-id').exec(function(err, data){
      let id = 0;
      if(data){
        id = data.id + 1;
      }
      let contactData = null;
      if(args.length == 2) {
        contactData = {};
        for(var k in args[0]) {
          if(['id', 'firstName', 'lastName'].indexOf(k) != -1) {
            contactData[k] = args[0][k];
          }
        }
        callback = args[1];
        if(contactData.id == undefined) {
          contactData.id = id;
        }
      } else {
        contactData = {id: id, firstName: firstName, lastName: lastName};
      }
      let contact = new ContactModel(contactData);
      contact.save( (error, contactObj) => {
        callback(error, contactObj);
      });

    });
  }

  delete(contactId, callback) {
    ContactModel.find({id: contactId}).remove(()=>{
      callback(null, []);
    });
  }

  watch(callback) {
    //TODO
  }

  close(){
    mongoose.disconnect();
  }
}

// Hack to avoid to duplicate/inherit common code
MongoContactService.prototype.print = FileContactService.prototype.print;

module.exports = MongoContactService;
