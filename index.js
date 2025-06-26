var express = require('express');
var router = express.Router();
// Importar dotenv para manejar variables de entorno
var env = require('dotenv');
require('dotenv').config();

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.send('Hola Guapo');
});

module.exports = router;
