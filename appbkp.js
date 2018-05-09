const express = require('express');
const app = express();
const http= require('http').Server(app);
const io= require('socket.io')(http);

//session via express://////
var cookieParser = require('cookie-parser');
var uuid = require('node-uuid');
app.use(cookieParser());

var requestID = uuid.v4();
//////////////////////////
//criando fila de usuarios:
var visitantes = 0;
var fila=[];


//inicia o socket.io e começa a gerenciar a fila de usuarios.
io.on('connection', function(socket){
  var usuario=requestID;//da o nome do usuario para a session do express
  //verifica se ele não está na fila já. se estiver, ignora.
  if(!fila.includes(usuario)){
  console.log('usuario entrou na fila');
  visitantes++;
  fila.push(usuario);
  console.log(visitantes);
  console.log(fila);
  }
  io.of("/nana").on("disconnect", function (socket) {
    usuario=requestID;
  //if(fila.includes(usuario)){
    console.log(usuario);
    console.log('desconectou');
    visitantes--;
    console.log(visitantes);
    fila.splice(fila.indexOf(usuario), 1);
    console.log(fila);
  });
  //Atualiza a fila para o usuario. se ele for o primeiro, vai pra tela de jogo.
  setInterval(function(){
    //TODO: SEMPRE VERIFICAR QUAL POSICAO
  var posfila =fila.indexOf(usuario);//verifica a posicao do usuario na fila
  socket.emit('posfila', { posfila: fila.indexOf(usuario), nome: usuario, link: '/nana'});//emitindo infos atualizadas pro usuario
 }, 500);

  socket.on('paroujogo', function(){
    usuario=requestID;
  //if(fila.includes(usuario)){
    console.log(usuario);
    console.log('desconectou');
    visitantes--;
    console.log(visitantes);
    fila.splice(fila.indexOf(usuario), 1);
    console.log(fila);
//  }else{
  //  socket.emit('expulsa', {link:'/'});
//  }
  })
});

//SESSAO DE ROTEAMENTO:

app.get('/', function(req, res){
  requestID = uuid.v4();
  req.id = requestID;
  console.log("usuario entrou como:");
  console.log(requestID);
  res.sendFile(__dirname+'/login.html');
});

app.get('/fila', function(req, res){
  console.log("usuario continua como:");
  req.id = requestID;
  console.log(requestID);

  if(fila.indexOf(requestID)===0){
  res.sendFile(__dirname+'/nana.html');
  } else{
  res.sendFile(__dirname+'/fila.html');
  }
});

app.get('/nana', function(req, res, next){
  res.sendFile(__dirname+'/nana.html');
});

app.get('/tchau', function(req, res, next){
  res.sendFile(__dirname+'/tchau.html');
});

//inicia o servidor
http.listen(3000,function(){
  console.log('servidor rodando na porta 3000');
});
