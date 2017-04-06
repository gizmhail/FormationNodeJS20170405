const fs = require('fs');

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
