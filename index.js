#!/usr/local/bin/node

const FileContactservice = require('./FileContactservice');
const CLI = require('./CLI');

let contactService = new FileContactservice();
CLI.activateForService(contactService);
