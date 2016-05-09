var meanCaseBase = require('../config/helpers/meanCaseBase.js');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var controles = mongoose.model('controles');
var pacientes = mongoose.model("pacientes");
router.get('/controles/:id-:schema', function (req, res) {
  var objTmp = {};
  objTmp[req.params.schema] = req.params.id;
  controles.find(objTmp, function (err, data) {
    res.json(data);
  })
})

router.get('/controles/:id', function (req, res) {
  controles.findById(req.params.id, function (err, data) {
    res.json(data);
  })
})
/* GET controles listing. */
router.get('/controles', function(req, res, next) {
   controles.find()
   .populate("pacientes")
   .exec(function (err, results) {
     res.status(200).send(results);
     meanCaseBase.auditSave(req,'Query all Registers','controles','Query all Registers');
   });
});
/* POST - Add controles. */
router.post('/controles', function(req, res, next){
   var model = new controles(req.body);
   model.save(function(err, data){
     if(err){return next(err)}
     res.json(data);
     meanCaseBase.auditSave(req,'Insert Register','controles',data);
   })
});
/* PUT - Update controles. */
router.put('/controles/:id', function(req, res){
   controles.findById(req.params.id, function(err, data){
     if(typeof req.body.pacientes  != "undefined"){data.pacientes = req.body.pacientes;}
          if(typeof req.body.fecha  != "undefined"){data.fecha = req.body.fecha;}
     data.save(function(err){
       if(err){res.send(err)}
       res.json(data);
       meanCaseBase.auditSave(req,'Update Register','controles',data);
     })
   })
});
/* DELETE - controles. */
router.delete('/controles/:id', function(req, res){
   controles.findByIdAndRemove(req.params.id, function(err){
     if(err){res.send(err)}
     res.json({message: 'controles delete successful!'});
     meanCaseBase.auditSave(req,'Delete Register','controles','Id: '+req.params.id);
   })
});
module.exports = router;