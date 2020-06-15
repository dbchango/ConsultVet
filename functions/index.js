const functions = require('firebase-functions');
const express = require('express');
const app = express();
const admin = require('firebase-admin');

var serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://nrc-7828-4ad7b.firebaseio.com"
});

const database = admin.database();

///========================= Variables globales ===================///
const dbClients = "clients"; //Referencia al nodo en donde se van a guardar las personas
const dbPets = "pets";

///========================= Intern Methods ===================///

///=============== Person = Methods ==================///
function createClient(client){
  database.ref(dbClients).push(client);  
}

function retrieveClient(id){
  return database.ref(dbClients).child(id).once('value');
}

function updateClient(id, client){
  database.ref(dbClients).child(id).set(client);
}

function deleteClient(id){
  database.ref(dbClients).child(id).remove();
}

function listClients(){
  return database.ref(dbClients).once('value');
}

///============== Pet = Methods ===================///
function createPet(id, pet){
  database.ref(dbClients).child(id).child(dbPets).push(pet)
}

function retrievePet(id, idPt){
  return database.ref(dbClients).child(id).child(dbPets).child(idPt).once('value');
}

function updatePet(id, idPt, pet){
  return database.ref(dbClients).child(id).child(dbPets).child(idPt).set(pet)
}

function deletePet(id, idPt){
  database.ref(dbClients).child(id).child(dbPets).child(idPt).remove();
}

function listPets(id){
  return database.ref(dbClients).child(id).child(dbPets).once('value');
}


///========================= URLs - Functions ===================///

///=================== Client - Functions =====================///

app.post('/api/clients', function (req, res) {
  var client = {
    name : req.body.name,
    ci : req.body.ci,
    direction : req.body.direction,
    phone : req.body.phone  
  };
  createClient(client);
  return res.status(201).json({ message: "Success client was added." });
});

app.get('/api/clients/:id', function(req, res){
  let varId = req.params.id;
  retrieveClient(varId).then(result => {
      return res.status(200).json(result); 
    }
  ).catch(err => console.log(err));
});

app.put('/api/clients/:id', function (req, res) {
  let varId = req.params.id;
  var client = {
    name : req.body.name,
    ci : req.body.ci,
    direction : req.body.direction,
    phone : req.body.phone  
  };
  updateClient(varId, client);
  return res.status(200).json({ message: "Success client was updated." });
});

app.delete('/api/clients/:id',function(req, res){
  let varId = req.params.id;
  deleteClient(varId);
  return res.status(200).json({ message: "Success client was deleted." });
});

app.get('/api/clients', function(req, res){
  listClients().then(result => {
      return res.status(200).json(result); 
    }
  ).catch(err => console.log(err));
});

/// ================== PETS Functions ====================///
app.post('/api/clients/:id/pets/', function (req, res){
  let varId = req.params.id;
  var pet = {
    name : req.body.name,
    color : req.body.color,
    age : req.body.age
  };
  createPet(varId, pet);
  return res.status(201).json({massage: "Succes pet was created."});
});

app.get('/api/clients/:id/pets/:idPt', function (req, res){
  let varId = req.params.id;
  let varIdpt = req.params.idPt;
  retrievePet(varId, varIdpt).then(result=>{
    return res.status(200).json(result); 
  }
  ).catch(err => console.log(err));

});

app.put('/api/clients/:id/pets/:idPt', function (req, res) {
  let varId = req.params.id;
  let varIdpt = req.params.idPt;
  var pet = {
    name : req.body.name,
    color : req.body.color,
    age : req.body.age
  };
  updatePet(varId, varIdpt, pet);
  return res.status(200).json({ message: "Success pet was updated." });
});

app.delete('/api/clients/:id/pets/:idPt',function(req, res){
  let varId = req.params.id;
  let varIdpt = req.params.idPt;
  deletePet(varId, varIdpt);
  return res.status(200).json({ message: "Success pet was deleted." });
});

app.get('/api/clients/:id/pets/', function(req, res){
  listPets(req.params).then(result => {
      return res.status(200).json(result); 
    }
  ).catch(err => console.log(err));
});


exports.app = functions.https.onRequest(app);
