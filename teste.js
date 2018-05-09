// app.js
const KEY = 'express.sid'
  , SECRET = 'express';
var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , cookie = express.cookieParser(SECRET)
  , store = new express.session.MemoryStore()
  , session = express.session({secret: SECRET
                             , key: KEY
                             , store: store});
// Configurações de Cookie e Session do Express
app.configure(function(){
  app.set('view engine', 'ejs');
  app.use(cookie);
  app.use(session);
});
app.get("/", function(req, res){
  req.session.nome = "Caio";
  res.render('index');
});
server.listen(3000, function(){
  console.log("Express e Socket.IO no ar.");
});
// Configurações do Socket.IO
io.set('authorization', function(data, accept) {
  cookie(data, {}, function(err) {
    if (!err) {
      var sessionID = data.signedCookies[KEY];
      store.get(sessionID, function(err, session) {
        if (err || !session) {
          accept(null, false);
        } else {
          data.session = session;
          accept(null, true);
        }
      });
    } else {
      accept(null, false);
    }
  });
});
io.sockets.on('connection', function (client) {
  var session = client.handshake.session
    , nome = session.nome;
  client.on('toServer', function (msg) {
    msg = "<b>"+nome+":</b> "+msg+"<br>";
    client.emit('toClient', msg);
    client.broadcast.emit('toClient', msg);
  });
});
