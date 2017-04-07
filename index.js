#!/usr/local/bin/node

const FileContactservice = require('./FileContactservice');
const MongoContactService = require('./MongoContactService');
const CLI = require('./CLI');

// let contactService = new FileContactservice();
let contactService = new MongoContactService((error) => {
  if(error){
    console.error("Error: unable to start contact service. Error:\n", error);
    console.error("\nIf using MongoContactService, did you start mongod server first ?\n")
    require('process').exit(1);
  } else {
    CLI.activateForService(contactService);    
  }
});
