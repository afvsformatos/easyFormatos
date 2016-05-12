var meanCaseBase = require('../config/helpers/meanCaseBase.js');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var conversordetalleplantillas = mongoose.model('conversordetalleplantillas');
router.get('/conversordetalleplantillas/:id', function (req, res) {
  conversordetalleplantillas.findById(req.params.id, function (err, data) {
    res.json(data);
  })
})
/* GET conversordetalleplantillas listing. */
router.get('/conversordetalleplantillas', function(req, res, next) {
   conversordetalleplantillas.find(function(err, models){
     if(err){return next(err)}
     res.json(models)
     meanCaseBase.auditSave(req,'Query all Registers','conversordetalleplantillas','Query all Registers');
   })
});
/* POST - Add conversordetalleplantillas. */
router.post('/conversordetalleplantillas', function(req, res, next){
   var model = new conversordetalleplantillas(req.body);
   model.save(function(err, data){
     if(err){return next(err)}
     res.json(data);
     meanCaseBase.auditSave(req,'Insert Register','conversordetalleplantillas',data);
   })
});
/* PUT - Update conversordetalleplantillas. */
router.put('/conversordetalleplantillas/:id', function(req, res){
   conversordetalleplantillas.findById(req.params.id, function(err, data){
     if(typeof req.body.idplantilla  != "undefined"){data.idplantilla = req.body.idplantilla;}
     if(typeof req.body.idformato  != "undefined"){data.idformato = req.body.idformato;}
     if(typeof req.body.plantilla  != "undefined"){data.plantilla = req.body.plantilla;}
     if(typeof req.body.tipo  != "undefined"){data.tipo = req.body.tipo;}
     if(typeof req.body.orden  != "undefined"){data.orden = req.body.orden;}
     if(typeof req.body.nivel  != "undefined"){data.nivel = req.body.nivel;}
     if(typeof req.body.origen  != "undefined"){data.origen = req.body.origen;}
     data.save(function(err){
       if(err){res.send(err)}
       res.json(data);
       meanCaseBase.auditSave(req,'Update Register','conversordetalleplantillas',data);
     })
   })
});
/* DELETE - conversordetalleplantillas. */
router.delete('/conversordetalleplantillas/:id', function(req, res){
   conversordetalleplantillas.findByIdAndRemove(req.params.id, function(err){
     if(err){res.send(err)}
     res.json({message: 'conversordetalleplantillas delete successful!'});
     meanCaseBase.auditSave(req,'Delete Register','conversordetalleplantillas','Id: '+req.params.id);
   })
});
module.exports = router;