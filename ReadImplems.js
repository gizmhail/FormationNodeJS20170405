const Contact = require('./Contact');
const fs = require('fs');
const JSONStream = require('JSONStream');
const through2 = require('through2');


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

module.exports.stream = function(path, callback) {
  let contacts = [];
  contactStream(path)
  .on('data', (contact) => {
    // contact received
    contacts.push(contact);
  })
  .on('finish', () => {
    callback(null, contacts);
  })
  .on('error', (error) => {
    callback(error, []);
  });
}

// Contact stream
function contactStream(path) {
  return fs.createReadStream(path)
    .pipe(JSONStream.parse('*'))
    .pipe(through2({ objectMode: true }, function(contactData, encoding, callback){
      try {
        let contact = new Contact(contactData);
        this.push(contact);
        callback();
      } catch (error){
        callback(error);
      }
    }));
}
