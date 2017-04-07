#!/usr/local/bin/node

const FileContactservice = require('./FileContactservice');
const MongoContactService = require('./MongoContactService');
const CLI = require('./CLI');

// let contactService = new FileContactservice();
let contactService = new MongoContactService();
CLI.activateForService(contactService);
