
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , config = require('./config')()
  , Models = require('./config/models');

var app = module.exports = express.createServer();
var io = require('socket.io')(app);
var teams = [];
var players = [];

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'iama1337h4x0r' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/scoreboard', routes.scoreboard);

app.listen(config.port, function(){
  console.log("Express server listening on port %d in %s mode", config.port, config.mode);
});

function pushUpdate(data){
    if(data.type === 'all'){
      io.emit('scoreboard:scores', {
        type: 'all',
        teams: teams,
        players: players
      }, {for: 'everyone'});
    }else{
      io.emit('scoreboard:scores', {
        players: players
      }, {for: 'everyone'});
    }
}

io.on('connection', function(socket){
  socket.emit('hello', '');

  socket.on('scoreboard:scores', function(data){
    teams[0] = new Models.Team("Red", 0);
    teams[1] = new Models.Team("Magenta", 2);
    teams[1].id = 1;
    pushUpdate(data, socket);
  });

  socket.on('player:new', function(data){
    players.push(data);
    pushUpdate({});
  });
});