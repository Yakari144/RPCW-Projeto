var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var data = new Date().toISOString().substring(0,16)
  console.log("Na cb da página principal...")
  console.log("Sessão: " + req.sessionID)
  if(req.user)
    res.render('index', {d: data, u: req.user});
  else
    res.render('index', {d: data});
});

router.get('/admin', function(req, res){
  res.redirect('/protegida')
})


router.get('/consumer', function(req, res){
  res.redirect('/')
})

function verificaAutenticacao(req, res, next){
  console.log('User (verif.): ' + JSON.stringify(req.user))
  if(req.isAuthenticated()){
  //req.isAuthenticated() will return true if user is logged in
      next();
  } else{
    res.redirect("/users/login");
  }
}

router.get('/protegida', verificaAutenticacao, (req,res) => {
  var data = new Date().toISOString().substring(0,16)
  res.render('protected', {d: data, u: req.user})
}
)

module.exports = router;
