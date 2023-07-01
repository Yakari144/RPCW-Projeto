var express = require('express');
var router = express.Router();
var Registo = require('../controllers/registo');
var User = require('../controllers/user');
var Utils = require('../utils/utils')
var Post = require('../controllers/post')
var Comentario = require('../controllers/comentario')

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

///////////////////////// USERS /////////////////////////
// USERS -> GETS //
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

// USERS -> POSTS //
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
        }else{
        res.end("Username ja atribuido")
        }
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro a obter o registo de pessoa"})
    })
})

///////////////////////// REGISTOS /////////////////////////
// REGISTOS -> GETS //
router.get('/admin', verificaAutenticacao, function(req, res){
  var data = new Date().toISOString().substring(0,16)
  var qt = (req.query.titulo && req.query.titulo!='undefined' && req.query.titulo!='null') ? req.query.titulo : null
  var qp = (req.query._page && req.query._page!='undefined' && req.query._page!='null') ? req.query._page : 1
  var qr = (req.query._limit && req.query._limit!='undefined' && req.query._limit!='null') ? req.query._limit : 10
  var ql = (req.query.local && req.query.local!='undefined' && req.query.local!='null') ? req.query.local : null
  var qd = (req.query.data && req.query.data!='undefined' && req.query.data!='null') ? req.query.data : null
  var qs = (req.query._sort && req.query._sort!='undefined' && req.query._sort!='null') ? req.query._sort : null
  var qo = (req.query._order && req.query._order!='undefined' && req.query._order!='null') ? req.query._order : 'asc'
  var query = {'qp':qp,'qr':qr,'ql':ql,'qd':qd,'qs':qs,'qo':qo,'qt':qt}
  console.log('query:',query)
  Registo.list(qp,qr,qs,qo,ql,qd,qt)
    .then(d =>{
      var dados = d.docs
      var qps = d.pages
        
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
        res.render('tabela', {registos: dados , admin: true, d: data, qps:qps, qp:qp, qr:qr, qt:qt, ql:ql, qd:qd, qs:qs, qot: qot, qol: qol, qod: qod});
      }else{
        res.render('tabela', {registos: dados , admin: false, d: data, qps:qps, qp:qp, qr:qr, qt:qt, ql:ql, qd:qd, qs:qs, qot: qot, qol: qol, qod: qod});
      }
    })
    .catch(erro =>{
      return erro
    })
})

router.get('/registo/:id', verificaAutenticacao, function(req, res,next){
  var data = new Date().toISOString().substring(0,16)
  // if (req.params.id[0] is a number)
  if(req.params.id[0] >= '0' && req.params.id[0] <= '9'){
    Registo.getRegisto(req.params.id)
            .then(dados =>{
              dados.MaterialRelacionado = Utils.handleMaterial(dados.MaterialRelacionado)
              dados.ScopeContent = Utils.handleScopeContent(dados.ScopeContent)
              if(req.user && req.user.level == 'admin'){
                res.render('registo', {r: dados , admin: true, d: data});
              }else{
                res.render('registo', {r: dados , admin: false, d: data});
              }
            })
            .catch(erro =>{
                return erro
            })
    }else
      res.redirect('/admin?titulo='+req.params.id)
})

router.get('/add', verificaAutenticacao, function(req, res,next){
  var data = new Date().toISOString().substring(0,16)
  res.render('addRegForm', {d: data})
})

router.get('/admin/edit/:id', verificaAutenticacao, function(req, res, next) {
  var data = new Date().toISOString().substring(0, 16)
  Registo.getRegisto(req.params.id)
    .then(registo => {
      res.render('updateRegForm', {r: registo, d: data})
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na obtenção do registo de pessoa"})
    })
});

router.get('/admin/delete/:id', verificaAutenticacao, function(req, res, next) {
  var data = new Date().toISOString().substring(0, 16)
  Registo.getRegisto(req.params.id)
    .then(registo => {
      res.render('deleteRegForm', {r: registo, d: data})
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na obtenção do registo de pessoa"})
    })
});

router.get('/admin/delete/:id/confirm', verificaAutenticacao, (req,res,next)=>{
  Registo.deleteRegisto(req.params.id)
    .then(resposta => {
      res.redirect('/admin')
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na obtenção do registo de pessoa"})
    })
})

// REGISTOS -> POSTS //
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
  Registo.updateRegisto(req.params.id, req.body)
    .then(registo => {
      console.log(req.params.id, req.body)
      res.render('updateRegConfirm', {r: registo, d: data})
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na obtenção do registo de pessoa"})
    })
});

///////////////////////// POSTS /////////////////////////
// POSTS -> GETS //
router.get('/posts/:id', verificaAutenticacao, (req,res,next) => {
  Post.list(req.params.id)
    .then(dados => {
      var data = new Date().toISOString().substring(0,16)
      res.render('tabelaPosts', {posts: dados, idP:req.params.id , d: data}) 
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na obtenção do registo de pessoa"})
    })
})

router.get('/post/:id', verificaAutenticacao, (req,res,next) => {
  Post.getPost(req.params.id)
    .then(dados => {
      var data = new Date().toISOString().substring(0,16)
      Comentario.list(dados._id)
        .then(dados2 => {
          res.render('post', {post: dados, comentarios: dados2, d: data})
        })
        .catch(erro => {
          res.render('error', {error: erro, message: "Erro na obtenção dos comentarios"})
        })
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na do post"})
    })
})

router.get('/posts/add/:id', verificaAutenticacao, (req,res,next) => {
  var data = new Date().toISOString().substring(0,16)
  Registo.getRegisto(req.params.id)
    .then(dados => {
      res.render('addPostForm', {idP:dados.IdProcesso, tp:dados.TituloProcesso, username: req.user.username, d:data})
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na obtenção do registo de pessoa"})
    })
})

// POSTS -> POSTS //
router.post('/posts/add', verificaAutenticacao, (req,res,next) => {
  var data = new Date().toISOString().substring(0,16)
  var post = {}
  post.title = req.body.title
  post.content = req.body.content
  post.IdProcesso = req.body.IdProcesso
  post.TituloProcesso = req.body.TituloProcesso
  post.username = req.body.username
  post.dateCreated = data
  Post.addPost(post)
    .then(dados => {
      res.render('addPostConfirm', {post: dados, d:data})
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro a postar o post"})
    })
})

///////////////////////// COMENTARIOS /////////////////////////

router.get('/comentario/add/:id', verificaAutenticacao, (req,res,next) => {
  var data = new Date().toISOString().substring(0,16)
  Post.getPost(req.params.id)
    .then(dados => {
      res.render('addComentarioForm', {idP:dados._id, username: req.user.username, d:data})
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro na obtenção do comentario"})
    })
})

// POSTS -> POSTS //
router.post('/comentario/add', verificaAutenticacao, (req,res,next) => {
  var data = new Date().toISOString().substring(0,16)
  var post = {}
  post.content = req.body.content
  post.idRef = req.body.idRef
  post.username = req.body.username
  post.dateCreated = data
  Comentario.addComentario(post)
    .then(dados => {
      res.render('addComentarioConfirm', {comentario: dados, d:data})
    })
    .catch(erro => {
      res.render('error', {error: erro, message: "Erro a postar o comentario"})
    })
})

module.exports = router;
