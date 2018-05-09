const express = require('express');
const app = express();
const http= require('http').Server(app);
const io= require('socket.io')(http);


var visitantes = 0;
var fila=[];
var jogador=false;

//sessao faz a fila
var filaespera = io.of('/filaespera');
filaespera.on('connection', function(socket){
  var usuario=socket.id;
  var posfila;
  socket.on('boas vindas', function(){
    console.log('usuario entrou');
    visitantes++;
    console.log(visitantes);
    fila.push(usuario);
    console.log(fila);
    posfila = fila.indexOf(usuario);
  });
 
  // socket.on('verifica fila', function(){
  //   
  //   socket.emit('posfila', );
  // });
   setInterval(function(){
    posfila = fila.indexOf(usuario);
    socket.emit('fila', { posfila: posfila, link: '/nana', jogador:jogador })
 }, 500);


  socket.on('disconnect', function(){
    console.log('desconectou');
    visitantes--;
    console.log(visitantes);
    fila.splice(fila.indexOf(usuario), 1);
    console.log(fila);
  })
});


//sessao jogo
var jogo = io.of('/jogo');
jogo.on('connection', function(socket){
  console.log('usuario entrou no jogo');
  jogador=true;
  socket.on('disconnect', function(){
    jogador=false;
  });

  // setTimeout(function(){
  //   socket.emit('expulsa', {link:'/'})
  // }, 6000)
});



app.get('/login', function(req, res){
  console.log("oiiiii")
  console.log(req.sessionID);
  res.sendFile(__dirname+'/login.html');
});
app.get('/fila', function(req, res){
  res.sendFile(__dirname+'/fila.html');
});

app.get('/', function(req, res){
  res.sendFile(__dirname+'/login.html');
});
app.get('/nana', function(req, res){
  res.sendFile(__dirname+'/nana.html');
});

http.listen(3000,function(){
  console.log('servidor rodando na porta 3000');
});
