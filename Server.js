
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');


function startServer(fileContactService) {
  let app = express();
  app
  .use(express.static('./public'))
  .use(bodyParser());
  router(app, fileContactService);
  app.listen(8080);
}

function router(app, fileContactService){
  // List all contacts
  app.get('/rest/contacts', (req, res) => {
    fileContactService.read((error, contacts) => {
      if(error){
        res.status(500).send(error);
      } else {
        res.status(400).send(contacts);
      }
    });
  });

  // Return a specific contact
  app.get('/rest/contacts/:id', (req, res) => {
    fileContactService.read((error, contacts) => {
      if(error){
        console.error("Error looking for contact", req.params.id, error);
        res.status(500).send(500);
      } else {
        let matchingContacts = _.filter(contacts, contact => ( contact.id == req.params.id) );
        if(matchingContacts.length > 0 ){
          res.status(400).send(matchingContacts[0]);
        } else {
          res.status(404).send({error: "Contact not found"});
        }
      }
    });
  });


}

// Change the used fileContactService
module.exports.startServer = function(fileContactService){
  startServer(fileContactService);
}
