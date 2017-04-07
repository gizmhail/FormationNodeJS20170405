const Contact = require('./Contact');
const fs = require('fs');


module.exports.original = function(path, callback) {
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
