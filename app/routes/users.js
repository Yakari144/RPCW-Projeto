var express = require('express');
var router = express.Router();
var passport = require('passport')

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
    res.redirect('/protegida')
})

module.exports = router;