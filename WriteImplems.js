const fs = require('fs');
const denodeify = require('denodeify');

const readFile = denodeify(fs.readFile);
const writeFile = denodeify(fs.writeFile);
const rename = denodeify(fs.rename);

module.exports.initialCallbacks = function(path, contacts, callback) {
  let contactDescriptions = JSON.stringify(contacts);
  fs.writeFile(path, contactDescriptions, callback);
}

module.exports.callbacks = function(path, contacts, callback) {
  let backupPath = path + ".back"
  let contactDescriptions = JSON.stringify(contacts);
  fs.readFile(path, (previousReadError, previousData) => {
    fs.writeFile(backupPath, previousData, (backupWriteError) => {
      fs.writeFile(path, contactDescriptions, (newWriteError) => {
        if(newWriteError){
          // Error writing new file: restoring backup
          fs.rename(backupPath, path, (error) => {
            callback(newWriteError);
          })
        } else {
          callback(null);
        }
      });
    });
  });
}

module.exports.promise = function(path, contacts, callback){
  let backupPath = path + ".back"
  let contactDescriptions = JSON.stringify(contacts);
  readFile(path)
  .then( (previousData) => {
    return writeFile(backupPath, previousData);
  })
  .then( () => {
    return writeFile(path, contactDescriptions);
  })
  .then( () => {
    callback(null);
  })
  .catch( (newWriteError) => {
    console.log("Error triggered");
    return rename(backupPath, path)
    .then( () => {
      console.log("Rename ok");
      callback(newWriteError);
    })
    .catch( (renameError) => {
      console.log("Rename error triggered");
      callback(renameError)
    });
  })
}
