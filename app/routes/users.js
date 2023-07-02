var express = require('express');
var router = express.Router();
var passport = require('passport')
var User = require('../controllers/user')

/* GET users listing. */
router. get ('/', function (req, res, next) {
    res.send('respond with a resource');
});

router. get ('/login', function (req, res) {
    var data = new Date().toISOString().substring(0, 16)
    console.log('Na cb do GET login...')
    console.log(req.sessionID)
    res.render('login', {
        d: data
    })
})

router. get ('/logout', function (req, res) {
  req.logout(function(err) {
    if (err) 
      res.render('error', {error: err})
    else
      res.redirect('/');
  })
})

router.post('/login', passport.authenticate('local'),
function (req, res) {
    console.log('Na cb do POST login...')
    console.log('Auth: ' + JSON.stringify(req.user))
    res.redirect('/admin')
})

router.get('/register', function(req, res){
  var data = new Date().toISOString().substring(0,16)
  console.log('Na cb do GET registo...')
  console.log(req.sessionID)
  res.render('addUserForm', {d: data})
})

// POST Student Form Data
router.post('/register', (req,res,next) => {
  User.getUserName(req.body.username)
    .then(dados => {
      if(!dados){
        var data = new Date().toISOString().substring(0,16)
        req.body.dateCreated = data
        req.body.dateLastLogin = data
        User.add(req.body)
          .then(registo => {
            res.render('addRegConfirm', {r: registo})
          })
          .catch(erro => {
            res.render('error', {error: erro, message: "Erro no armazenamento do registo de pessoa"})
          }) 
        }else{
          res.end("Username ja atribuido")
        }
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro a obter o registo de pessoa"})
    })
})


module.exports = router;