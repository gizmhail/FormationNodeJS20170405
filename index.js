#!/usr/local/bin/node

// Depedancies
const FileContactservice = require('./FileContactservice');
const CLI = require('./CLI');

// Internal components
let contactService = new FileContactservice();
CLI.activateForService(contactService);
