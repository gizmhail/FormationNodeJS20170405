const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var contactSchema = new Schema({
  id:  Number,
  firstName: String,
  lastName:   String
});

var ContactModel = mongoose.model('Contact', contactSchema);

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
}

module.exports = MongoContactService;
