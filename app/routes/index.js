var express = require('express');
var router = express.Router();
var Registo = require('../controllers/registo');

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

function verificaAutenticacao(req, res, next){
  console.log('User (verif.): ' + JSON.stringify(req.user))
  if(req.isAuthenticated()){
  //req.isAuthenticated() will return true if user is logged in
      next();
  } else{
    res.redirect("/users/login");
  }
}

router.get('/addUser',verificaAutenticacao, function(req, res){
  if(req.user.level!='admin'){
    res.end('Permission Denied')
    return
  }
  var data = new Date().toISOString().substring(0,16)
  console.log('Na cb do GET registo...')
  console.log(req.sessionID)
  res.render('addUserForm', {d: data, admin:true})
})

// POST Student Form Data
router.post('/addUser',verificaAutenticacao, (req,res) => {
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
        }
        res.end("Username ja atribuido")
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro a obter o registo de pessoa"})
    })
})

function getPages(qp,qps){
  var pages = []
  if(qp <2){
    pages[0] = 1
    pages[1] = 2
    pages[2] = 3
    pages[3] = qps
  }else if(qp>qps-1){
    pages[0] = 1
    pages[1] = qps-2
    pages[2] = qps-1
    pages[3] = qps
  }else{
    pages[0] = qp-1
    pages[1] = qp
    pages[2] = qp+1
    pages[3] = qps
  }
  return pages
}

// router that handles query string requests such as: /registo?data=2023-06-22&_sort=nome&_order=asc
router.get('/admin', verificaAutenticacao, function(req, res){
  var data = new Date().toISOString().substring(0,16)
  var qp = (req.query._page && req.query._page!='undefined' && req.query._page!='null') ? req.query._page : 1
  var qr = (req.query._limit && req.query._limit!='undefined' && req.query._limit!='null') ? req.query._limit : 10
  var ql = (req.query.local && req.query.local!='undefined' && req.query.local!='null') ? req.query.local : null
  var qd = (req.query.data && req.query.data!='undefined' && req.query.data!='null') ? req.query.data : null
  var qs = (req.query._sort && req.query._sort!='undefined' && req.query._sort!='null') ? req.query._sort : null
  var qo = (req.query._order && req.query._order!='undefined' && req.query._order!='null') ? req.query._order : 'asc'
  var query = {'qp':qp,'qr':qr,'ql':ql,'qd':qd,'qs':qs,'qo':qo}
  console.log('query:',query)
  Registo.list(qp,qr,qs,qo,ql,qd)
    .then(d =>{
      var dados = d.docs
      var qps = d.pages
      console.log('qps:',qps)
      //qps = getPages(qp,pages)
        
      var qot='asc'
      if(qs == 'TituloProcesso' && qo =='asc')
        qot='desc'
      
      var qol='asc'
      if(qs == 'LocalizacaoFisica' && qo =='asc') 
        qol='desc'
      
      var qod='asc'
      if(qs == 'Data' && qo =='asc')
        qod='desc'
      if(req.user && req.user.level == 'admin'){
        res.render('tabela2', {registos: dados , admin: true, d: data, qps:qps, qp:qp, qr:qr, ql:ql, qd:qd, qs:qs, qot: qot, qol: qol, qod: qod});
      }else{
        res.render('tabela2', {registos: dados , admin: false, d: data, qps:qps, qp:qp, qr:qr, ql:ql, qd:qd, qs:qs, qot: qot, qol: qol, qod: qod});
      }
    })
    .catch(erro =>{
      return erro
    })
})

router.get('/registo/:id', verificaAutenticacao, function(req, res,next){
  var data = new Date().toISOString().substring(0,16)
  Registo.getRegistoTitle(req.params.id)
            .then(dados =>{
              if(req.user && req.user.level == 'admin'){
                res.render('registo', {r: dados , admin: true, d: data});
              }else{
                res.render('registo', {r: dados , admin: false, d: data});
              }
            })
            .catch(erro =>{
                return erro
            })
})

router.get('/add', verificaAutenticacao, function(req, res,next){
  var data = new Date().toISOString().substring(0,16)
  res.render('addRegForm', {d: data})
})

router.get('/admin/edit/:id', verificaAutenticacao, function(req, res, next) {
  var data = new Date().toISOString().substring(0, 16)
  Registo.getRegistoTitle(req.params.id)
    .then(registo => {
      res.render('updateRegForm', {r: registo, d: data})
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na obtenção do registo de pessoa"})
    })
});

router.get('/admin/delete/:id', verificaAutenticacao, function(req, res, next) {
  var data = new Date().toISOString().substring(0, 16)
  Registo.getRegistoTitle(req.params.id)
    .then(registo => {
      res.render('deleteRegForm', {r: registo, d: data})
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na obtenção do registo de pessoa"})
    })
});

router.get('/admin/delete/:id/confirm', verificaAutenticacao, (req,res,next)=>{
  Registo.deleteRegistoTitle(req.params.id)
    .then(resposta => {
      res.redirect('/admin')
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na obtenção do registo de pessoa"})
    })
})

// POST Student Form Data
router.post('/add', verificaAutenticacao, (req,res,next) => {
  Registo.addRegisto(req.body)
    .then(registo => {
      res.render('addRegConfirm', {r: registo})
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro no armazenamento do registo de pessoa"})
    })
})

router.post('/admin/edit/:id', verificaAutenticacao, function(req, res, next) {
  var data = new Date().toISOString().substring(0, 16)
  Registo.updateRegistoTitle(req.params.id, req.body)
    .then(registo => {
      res.render('updateRegConfirm', {r: registo, d: data})
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na obtenção do registo de pessoa"})
    })
});

router.get('/protegida', verificaAutenticacao, (req,res) => {
  var data = new Date().toISOString().substring(0,16)
  res.render('protected', {d: data, u: req.user})
})

module.exports = router;
