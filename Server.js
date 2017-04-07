
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');


function startServer(fileContactService) {
  let app = express();
  app
  .use(express.static('./public'))
  router(app, fileContactService);
  app.listen(8080);
}

function router(app, fileContactService){
  var jsonParser = bodyParser.json()

  // List all contacts
  app.get('/rest/contacts', (req, res) => {
    fileContactService.read((error, contacts) => {
      if(error){
        res.status(500).json(error);
      } else {
        res.status(200).json(contacts);
      }
    });
  });

  // Return a specific contact
  app.get('/rest/contacts/:id', (req, res) => {
    fileContactService.read((error, contacts) => {
      if(error){
        let errorMessage = "Error looking for contact " + req.params.id + ": " + error;
        res.status(500).send({error: errorMessage});
      } else {
        let matchingContacts = _.filter(contacts, contact => ( contact.id == req.params.id) );
        if(matchingContacts.length > 0 ){
          res.status(200).json(matchingContacts[0]);
        } else {
          res.status(404).json({error: "Contact not found"});
        }
      }
    });
  });

  // Create a contact
  app.post('/rest/contacts', jsonParser, (req, res) => {
    let contactData = req.body;
    fileContactService.add(contactData, function(error, contact){
      if(error){
        let errorMessage = "Error creating contact with " + JSON.stringify(req.body) + ": " + error;
        res.status(500).send({error: errorMessage});
      } else {
        res.json( {contact: contact} );
      }
    });
  });

  // Modify a contact
  app.put('/rest/contacts/:id', jsonParser, (req, res) => {
    let contactData = req.body;
    // We do not take into account any id change
    contactData.id = req.params.id;
    fileContactService.delete(req.params.id, (error, contacts) => {
      if(error){
        let errorMessage = "Error deleting contact (before update)  " + req.params.id + ": " + error;
        res.status(500).send({error: errorMessage});
      } else {
        fileContactService.add(contactData, function(error, contact){
          if(error){
            let errorMessage = "Error creating contact with " + JSON.stringify(req.body) + ": " + error;
            res.status(500).send({error: errorMessage});
          } else {
            res.json( {contact: contact} );
          }
        });
      }
    });
  });

  // Delete a contact
  app.delete('/rest/contacts/:id', (req, res) => {
    fileContactService.delete(req.params.id, (error, contacts) => {
      if(error){
        let errorMessage = "Error deleting contact " + req.params.id + ": " + error;
        res.status(500).send({error: errorMessage});
      } else {
        res.status(200).json({contacts: contacts});
      }
    });
  });
}

// Change the used fileContactService
module.exports.startServer = function(fileContactService){
  startServer(fileContactService);
}
