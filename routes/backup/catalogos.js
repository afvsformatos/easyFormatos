var meanCaseBase = require('../config/helpers/meanCaseBase.js');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var catalogos = mongoose.model('catalogos');
router.get('/catalogos/:id', function (req, res) {
  catalogos.findById(req.params.id, function (err, data) {
    res.json(data);
  })
})
/* GET catalogos listing. */
router.get('/catalogos', function(req, res, next) {
   catalogos.find(function(err, models){
     if(err){return next(err)}
     res.json(models)
     meanCaseBase.auditSave(req,'Query all Registers','catalogos','Query all Registers');
   })
});
/* POST - Add catalogos. */
router.post('/catalogos', function(req, res, next){
   var model = new catalogos(req.body);
   model.save(function(err, data){
     if(err){return next(err)}
     res.json(data);
     meanCaseBase.auditSave(req,'Insert Register','catalogos',data);
   })
});
/* PUT - Update catalogos. */
router.put('/catalogos/:id', function(req, res){
   catalogos.findById(req.params.id, function(err, data){
     if(typeof req.body.id_tabla  != "undefined"){data.id_tabla = req.body.id_tabla;}
     if(typeof req.body.tabla_argumento  != "undefined"){data.tabla_argumento = req.body.tabla_argumento;}
     if(typeof req.body.tabla_descripcion  != "undefined"){data.tabla_descripcion = req.body.tabla_descripcion;}
     if(typeof req.body.tabla_referencia  != "undefined"){data.tabla_referencia = req.body.tabla_referencia;}
     if(typeof req.body.tabla_estado  != "undefined"){data.tabla_estado = req.body.tabla_estado;}
     data.save(function(err){
       if(err){res.send(err)}
       res.json(data);
       meanCaseBase.auditSave(req,'Update Register','catalogos',data);
     })
   })
});
/* DELETE - catalogos. */
router.delete('/catalogos/:id', function(req, res){
   catalogos.findByIdAndRemove(req.params.id, function(err){
     if(err){res.send(err)}
     res.json({message: 'catalogos delete successful!'});
     meanCaseBase.auditSave(req,'Delete Register','catalogos','Id: '+req.params.id);
   })
});
module.exports = router;