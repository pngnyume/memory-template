//Install Command:
//npm init -y
//npm i express express-handlebars body-parser mongoose

const express = require('express');
const server = express();

const bodyParser = require('body-parser');
server.use(express.json()); 
server.use(express.urlencoded({ extended: true }));

const handlebars = require('express-handlebars');
server.set('view engine', 'hbs');
server.engine('hbs', handlebars.engine({
    extname: 'hbs',
}));

server.use(express.static('public'));

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/memory');

const fs = require('fs'); // For reading JSON files
const path = require('path'); // For resolving file paths

const saSchema = new mongoose.Schema({
  first: { type: Number },  //refers to the cell number of the first card selected
  second: { type: Number }, //refers to the cell number of the second card selected
  board: { type: String },  //refers to the board number of the action
},{ versionKey: false });

const saModel = mongoose.model('select_action', saSchema);

//For the map, this will accept a list of strings. Creating
//an entry will look like the following:
//  const array = ["1","2","3"];
//  const instance = bcModel({
//      map: array
//  });
const bcSchema = new mongoose.Schema({
  map: { type: [ String ] }  //refers to the map info populated by symbols
},{ versionKey: false });

const bcModel = mongoose.model('board_cards', bcSchema);

const cardSchema = new mongoose.Schema({
  symbol: { type: String },  //refers to the symbol of a specific card
  image: { type: String }    //refers to the image path of a specific card
},{ versionKey: false });

const cardModel = mongoose.model('card', cardSchema);

function errorFn(err){
    console.log('Error fond. Please trace!');
    console.error(err);
}

//No need to modify this route. It should be working
server.get('/', function(req, resp){
  bcModel.find({}).lean().then(function(boards){
    resp.render('create',{
      layout: 'index',
      title: 'Create page',
      boards: boards
    });
  }).catch(errorFn);
});

//No need to modify this route. It should be working
server.get('/board/:id', function(req, resp){
  resp.render('game',{
    layout: 'index2',
    title: 'Game page',
    id: String(req.params.id)
 });
});

//Hint: It is suggested to tackle the problems in this order: 
//  create_new > move > reload.

//Note: There is no need to modify app.js. However, some solutions can
//cache certain information to avoid extra database fetches. In those
//cases, some processing can be done in app.js.

//Modifyable area start ---- ---- ---- ---- ----
    await cardModel.insertMany(cards);
    console.log('Cards data loaded successfully');

  } catch (err) {
    console.error('Error loading JSON data:', err);
  }
}

mongoose.connection.once('open', loadJSONData);


let app_data = {
  'saModel'   : saModel,
  'bcModel'   : bcModel,
  'cardModel' : cardModel
};

const mod_c = require('./routes/create_new');
mod_c.add(server, app_data);

const mod_r = require('./routes/reload');
mod_r.add(server, app_data);

const mod_m = require('./routes/move');
mod_m.add(server, app_data);

//Modifyable area end ---- ---- ---- ---- ----

function finalClose(){
    console.log('Close connection at the end!');
    mongoose.connection.close();
    process.exit();
}

process.on('SIGTERM',finalClose);
process.on('SIGINT',finalClose);
process.on('SIGQUIT', finalClose);

const port = process.env.PORT || 1234;
server.listen(port, function(){
    console.log('Listening at port '+port);
});
