var meanCaseBase = require('../config/helpers/meanCaseBase.js');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var almacentramas = mongoose.model('almacentramas');
router.get('/almacentramas/:id', function (req, res) {
  almacentramas.findById(req.params.id, function (err, data) {
    res.json(data);
  })
})
/* GET almacentramas listing. */
router.get('/almacentramas', function(req, res, next) {
   almacentramas.find(function(err, models){
     if(err){return next(err)}
     res.json(models)
     meanCaseBase.auditSave(req,'Query all Registers','almacentramas','Query all Registers');
   })
});
/* POST - Add almacentramas. */
router.post('/almacentramas', function(req, res, next){
   var model = new almacentramas(req.body);
   model.save(function(err, data){
     if(err){return next(err)}
     res.json(data);
     meanCaseBase.auditSave(req,'Insert Register','almacentramas',data);
   })
});
/* PUT - Update almacentramas. */
router.put('/almacentramas/:id', function(req, res){
   almacentramas.findById(req.params.id, function(err, data){
     if(typeof req.body.id_formato  != "undefined"){data.id_formato = req.body.id_formato;}
     if(typeof req.body.nombre_formato  != "undefined"){data.nombre_formato = req.body.nombre_formato;}
     if(typeof req.body.trama  != "undefined"){data.trama = req.body.trama;}
     if(typeof req.body.aprobo  != "undefined"){data.aprobo = req.body.aprobo;}
     data.save(function(err){
       if(err){res.send(err)}
       res.json(data);
       meanCaseBase.auditSave(req,'Update Register','almacentramas',data);
     })
   })
});
/* DELETE - almacentramas. */
router.delete('/almacentramas/:id', function(req, res){
   almacentramas.findByIdAndRemove(req.params.id, function(err){
     if(err){res.send(err)}
     res.json({message: 'almacentramas delete successful!'});
     meanCaseBase.auditSave(req,'Delete Register','almacentramas','Id: '+req.params.id);
   })
});
module.exports = router;