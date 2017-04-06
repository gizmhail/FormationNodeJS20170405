var yargs = require('yargs');
// var FileContactservice = require('./FileContactservice');

// Global file contact service used by the module
var  contactService = null;
// Commands
function listCommand(argv) {
  contactService.print({color:argv.color});

}

function addContactCommand(argv) {
  contactService.add(argv.firstName, argv.lastName, function(error, contacts){
    if (error) throw error;
    contactService.print({color:argv.color});
  });
}

function deleteContactCommand(argv, contactService) {
  contactService.delete(argv.contactId, function(error, contacts){
    if (error) throw error;
    contactService.print({color:argv.color});
  });
}

function watchCommand(argv, contactService) {
  contactService.watch(function(error, contacts, previousContacts, added, removed){
    console.log("-------------\nContacts changed.");
    if(error) {
      console.log(error);
      console.log("[Error] Corrupted contact file.")
    } else {
      if(added.length > 0){
          console.log("Added contacts:")
          added.forEach((contact) => { console.log("+++", contact.toString({color:argv.color})) });
      }
      if(removed.length > 0){
          console.log("---\nRemoved contacts:")
          removed.forEach((contact) => { console.log("---", contact.toString({color:argv.color})) });
      }
    }
  });
}

// CLI interface description
function activateCLIInterface() {
  yargs
  .command('list', 'print the contacts included in contacts.json', {}, function(argv) {
    listCommand(argv, contactService);
  } )
  .command('watch', 'watch contacts.json and print its new change if changed', {}, function(argv) {
    watchCommand(argv, contactService);
  } )
  .command('add [firstName] [lastName]', 'add a contact', {
    firstName:{  },
    lastName:{  },
    }, function(argv) {
      addContactCommand(argv, contactService);
  } )
  .command('delete [contactId]', 'delete a contact', {
    contactId:{  }
    }, function(argv) {
      deleteContactCommand(argv, contactService);
  } )
  .help()
  .options({
    'color': {
      describe: 'Use this option to colorize name in command results',
      type: 'bool'
    }
  })
  .demandCommand(1)
  .strict()
  .argv;
}

// Change the used fileContactService and activate the command line interface defined with yargs
module.exports.activateForService = function(fileContactService){
  contactService = fileContactService
  activateCLIInterface();
}
