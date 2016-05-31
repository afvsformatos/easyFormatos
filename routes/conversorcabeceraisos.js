var meanCaseBase = require('../config/helpers/meanCaseBase.js');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var conversorcabeceraisos = mongoose.model('conversorcabeceraisos');
router.get('/conversorcabeceraisos/:id', function (req, res) {
  conversorcabeceraisos.findById(req.params.id, function (err, data) {
    res.json(data);
  })
})
/* GET conversorcabeceraisos listing. */
router.get('/conversorcabeceraisos', function(req, res, next) {
   conversorcabeceraisos.find(function(err, models){
     if(err){return next(err)}
     res.json(models)
     meanCaseBase.auditSave(req,'Query all Registers','conversorcabeceraisos','Query all Registers');
   })
});
/* POST - Add conversorcabeceraisos. */
router.post('/conversorcabeceraisos', function(req, res, next){
   var model = new conversorcabeceraisos(req.body);
   model.save(function(err, data){
     if(err){return next(err)}
     res.json(data);
     meanCaseBase.auditSave(req,'Insert Register','conversorcabeceraisos',data);
   })
});
/* PUT - Update conversorcabeceraisos. */
router.put('/conversorcabeceraisos/:id', function(req, res){
   conversorcabeceraisos.findById(req.params.id, function(err, data){
     if(typeof req.body.id_transaccion_cabecera  != "undefined"){data.id_transaccion_cabecera = req.body.id_transaccion_cabecera;}
     if(typeof req.body.idformato  != "undefined"){data.idformato = req.body.idformato;}
     if(typeof req.body.orden  != "undefined"){data.orden = req.body.orden;}
     if(typeof req.body.nombre  != "undefined"){data.nombre = req.body.nombre;}
     if(typeof req.body.tipo  != "undefined"){data.tipo = req.body.tipo;}
     if(typeof req.body.longitud  != "undefined"){data.longitud = req.body.longitud;}
     if(typeof req.body.bytes  != "undefined"){data.bytes = req.body.bytes;}
     if(typeof req.body.aplicadefault  != "undefined"){data.aplicadefault = req.body.aplicadefault;}
     if(typeof req.body.valordefault  != "undefined"){data.valordefault = req.body.valordefault;}
     if(typeof req.body.respuesta  != "undefined"){data.respuesta = req.body.respuesta;}
     if(typeof req.body.descripcion  != "undefined"){data.descripcion = req.body.descripcion;}
     data.save(function(err){
       if(err){res.send(err)}
       res.json(data);
       meanCaseBase.auditSave(req,'Update Register','conversorcabeceraisos',data);
     })
   })
});
/* DELETE - conversorcabeceraisos. */
router.delete('/conversorcabeceraisos/:id', function(req, res){
   conversorcabeceraisos.findByIdAndRemove(req.params.id, function(err){
     if(err){res.send(err)}
     res.json({message: 'conversorcabeceraisos delete successful!'});
     meanCaseBase.auditSave(req,'Delete Register','conversorcabeceraisos','Id: '+req.params.id);
   })
});
module.exports = router;