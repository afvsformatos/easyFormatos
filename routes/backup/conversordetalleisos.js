var meanCaseBase = require('../config/helpers/meanCaseBase.js');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var conversordetalleisos = mongoose.model('conversordetalleisos');
router.get('/conversordetalleisos/:id', function (req, res) {
  conversordetalleisos.findById(req.params.id, function (err, data) {
    res.json(data);
  })
})
/* GET conversordetalleisos listing. */
router.get('/conversordetalleisos', function(req, res, next) {
   conversordetalleisos.find(function(err, models){
     if(err){return next(err)}
     res.json(models)
     meanCaseBase.auditSave(req,'Query all Registers','conversordetalleisos','Query all Registers');
   })
});
/* POST - Add conversordetalleisos. */
router.post('/conversordetalleisos', function(req, res, next){
   var model = new conversordetalleisos(req.body);
   model.save(function(err, data){
     if(err){return next(err)}
     res.json(data);
     meanCaseBase.auditSave(req,'Insert Register','conversordetalleisos',data);
   })
});
/* PUT - Update conversordetalleisos. */
router.put('/conversordetalleisos/:id', function(req, res){
   conversordetalleisos.findById(req.params.id, function(err, data){
     if(typeof req.body.id_operador  != "undefined"){data.id_operador = req.body.id_operador;}
     if(typeof req.body.bitmap  != "undefined"){data.bitmap = req.body.bitmap;}
     if(typeof req.body.nombre  != "undefined"){data.nombre = req.body.nombre;}
     if(typeof req.body.tipo  != "undefined"){data.tipo = req.body.tipo;}
     if(typeof req.body.longitud  != "undefined"){data.longitud = req.body.longitud;}
     if(typeof req.body.descripcion  != "undefined"){data.descripcion = req.body.descripcion;}
     if(typeof req.body.tipodato  != "undefined"){data.tipodato = req.body.tipodato;}
     data.save(function(err){
       if(err){res.send(err)}
       res.json(data);
       meanCaseBase.auditSave(req,'Update Register','conversordetalleisos',data);
     })
   })
});
/* DELETE - conversordetalleisos. */
router.delete('/conversordetalleisos/:id', function(req, res){
   conversordetalleisos.findByIdAndRemove(req.params.id, function(err){
     if(err){res.send(err)}
     res.json({message: 'conversordetalleisos delete successful!'});
     meanCaseBase.auditSave(req,'Delete Register','conversordetalleisos','Id: '+req.params.id);
   })
});
module.exports = router;