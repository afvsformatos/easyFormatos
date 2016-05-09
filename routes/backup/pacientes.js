var meanCaseBase = require('../config/helpers/meanCaseBase.js');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var pacientes = mongoose.model('pacientes');
router.get('/pacientes/:id', function (req, res) {
  pacientes.findById(req.params.id, function (err, data) {
    res.json(data);
  })
})
/* GET pacientes listing. */
router.get('/pacientes', function(req, res, next) {
   pacientes.find(function(err, models){
     if(err){return next(err)}
     res.json(models)
     meanCaseBase.auditSave(req,'Query all Registers','pacientes','Query all Registers');
   })
});
/* POST - Add pacientes. */
router.post('/pacientes', function(req, res, next){
   var model = new pacientes(req.body);
   model.save(function(err, data){
     if(err){return next(err)}
     res.json(data);
     meanCaseBase.auditSave(req,'Insert Register','pacientes',data);
   })
});
/* PUT - Update pacientes. */
router.put('/pacientes/:id', function(req, res){
   pacientes.findById(req.params.id, function(err, data){
     if(typeof req.body.nombres  != "undefined"){data.nombres = req.body.nombres;}
     if(typeof req.body.edad  != "undefined"){data.edad = req.body.edad;}
     data.save(function(err){
       if(err){res.send(err)}
       res.json(data);
       meanCaseBase.auditSave(req,'Update Register','pacientes',data);
     })
   })
});
/* DELETE - pacientes. */
router.delete('/pacientes/:id', function(req, res){
   pacientes.findByIdAndRemove(req.params.id, function(err){
     if(err){res.send(err)}
     res.json({message: 'pacientes delete successful!'});
     meanCaseBase.auditSave(req,'Delete Register','pacientes','Id: '+req.params.id);
   })
});
module.exports = router;