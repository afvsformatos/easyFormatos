var meanCaseBase = require('../config/helpers/meanCaseBase.js');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var ambientes = mongoose.model('ambientes');
var fs = require('fs-extra');
router.get('/ambientes/:id', function (req, res) {
  ambientes.findById(req.params.id, function (err, data) {
    res.json(data);
  })
})

router.get('/ambientes/habilitar/:id', function (req, res) {
    ambientes.find(function(err, models){
       if(err){return next(err)}
       for (var i = 0; i < models.length ;i++) {
            models[i].estado = false;
             models[i].save();
       }
       ambientes.findById(req.params.id, function (err, data) {
         data.estado = true;
         data.save(function(err){
           if(err){res.send(err)}
            res.json(data);
            var vRoutes = '{\n  "ambiente":{\n    "username":"'+data.username+'",\n    "password":"'+data.password+'",\n    "database":"'+data.database+'",\n    "host":"'+data.host+'",\n    "dialect":"'+data.dialect+'"\n  }\n}';
            var wsRoutes = fs.createOutputStream('config/config.json');
            wsRoutes.write(vRoutes);
            meanCaseBase.auditSave(req,'Cambio de Ambiente','ambientes',data);
         })
      })
       
    })
    
})
/* GET ambientes listing. */
router.get('/ambientes', function(req, res, next) {
   ambientes.find(function(err, models){
     if(err){return next(err)}
     res.json(models)
     meanCaseBase.auditSave(req,'Query all Registers','ambientes','Query all Registers');
   })
});
/* POST - Add ambientes. */
router.post('/ambientes', function(req, res, next){
   var model = new ambientes(req.body);
   model.save(function(err, data){
     if(err){return next(err)}
     res.json(data);
     meanCaseBase.auditSave(req,'Insert Register','ambientes',data);
   })
});
/* PUT - Update ambientes. */
router.put('/ambientes/:id', function(req, res){
   ambientes.findById(req.params.id, function(err, data){
     if(typeof req.body.ambiente  != "undefined"){data.ambiente = req.body.ambiente;}
     if(typeof req.body.username  != "undefined"){data.username = req.body.username;}
     if(typeof req.body.password  != "undefined"){data.password = req.body.password;}
     if(typeof req.body.database  != "undefined"){data.database = req.body.database;}
     if(typeof req.body.host  != "undefined"){data.host = req.body.host;}
     if(typeof req.body.dialect  != "undefined"){data.dialect = req.body.dialect;}
     if(typeof req.body.estado  != "undefined"){data.estado = req.body.estado;}
     data.save(function(err){
       if(err){res.send(err)}
       res.json(data);
       meanCaseBase.auditSave(req,'Update Register','ambientes',data);
     })
   })
});
/* DELETE - ambientes. */
router.delete('/ambientes/:id', function(req, res){
   ambientes.findByIdAndRemove(req.params.id, function(err){
     if(err){res.send(err)}
     res.json({message: 'El ambiente se elimino exitosamente!'});
     meanCaseBase.auditSave(req,'Delete Register','ambientes','Id: '+req.params.id);
   })
});
module.exports = router;