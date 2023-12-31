var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const { v4: uuidv4 } = require('uuid')
var session = require('express-session')
var FileStore = require('session-file-store')(session)
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy

//Import the mongoose module
var mongoose = require('mongoose');
//Set up default mongoose connection
//var mongoDB = 'mongodb://mongodb/api';
var mongoDB = 'mongodb://mongodb/api';
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
//Get the default connection
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
    console.log("Conexão ao MongoDB realizada com sucesso...");
});


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var User = require('./controllers/user');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(session({
  genid: req => {
    console.log('Dentro do middleware da sessão...')
    console.log(req.sessionID)
    return uuidv4()},
  store: new FileStore(),
  secret: 'O meu segredo',
  resave: false,
  saveUninitialized: true
}))

//Configuração da estratégia local
passport.use(new LocalStrategy(
  {usernameField: 'username'}, (username, password, done) => {
    User.login(username,password)
      .then(dados => {
        const user = dados
        if(user==1) { return done(null, false, {message: 'Utilizador inexistente!\n'})}
        if(user==2) { return done(null, false, {message: 'Password inválida!\n'})}
        return done(null, user)
      })
      .catch(erro => done(erro))
    })
 ) 

 // Indica-se ao passport como serializar o utilizador
passport.serializeUser((user,done) => {
  console.log('Vou serializar o user na sessão: ' + JSON.stringify(user))
  // Serialização do utilizador. O passport grava o utilizador na sessão aqui.
  done(null, user._id)
 })

  // Desserialização: a partir do id obtem-se a informação do utilizador
 passport.deserializeUser((uid, done) => {
  console.log('Vou desserializar o user: ' + uid)
  User.getUser(uid)
    .then(dados => done(null, dados))
    .catch(erro => done(erro, false))
 })
 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Depois de configurar as sessões
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
