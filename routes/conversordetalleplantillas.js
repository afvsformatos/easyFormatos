var meanCaseBase = require('../config/helpers/meanCaseBase.js');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var conversordetalleplantillas = mongoose.model('conversordetalleplantillas');
var conversorCabecera = require('../config/relationalModels/conversorCabecera.js');
var conversorDetallePlantilla = require('../config/relationalModels/conversorDetallePlantilla.js');
var connectionDb = require('../config/connectionDb.js');




router.get('/conversordetalleplantillas/:id', function (req, res) {
  conversorDetallePlantilla.findAll({ where: { IdFormato: req.params.id }}).then(function(plantillas) {
        res.json(plantillas);
  });
})
/* GET conversordetalleplantillas listing. */
router.get('/conversordetalleplantillas', function(req, res, next) {
   /*conversordetalleplantillas.find(function(err, models){
     if(err){return next(err)}
     res.json(models)
     meanCaseBase.auditSave(req,'Query all Registers','conversordetalleplantillas','Query all Registers');
   })*/
   conversorDetallePlantilla.findAll().then(function(plantillas) {
         res.json(plantillas);
         meanCaseBase.auditSave(req,'Query all Registers','conversordetalleplantillas','Query all Registers');
    });
});
/* POST - Add conversordetalleplantillas. */
router.post('/conversordetalleplantillas', function(req, res, next){
      delete req.body.url;
      conversorDetallePlantilla.create(req.body).then(function(data) {
        data.dataValues['message'] = "Registro Exitoso";
        res.json(data);
        meanCaseBase.auditSave(req,'Insert Register','conversordetalleplantillas',data);
      });
});
/* PUT - Update conversordetalleplantillas. */
router.put('/conversordetalleplantillas/:id', function(req, res){
     var datosActualizar = {};
     //if(typeof req.body.IdPlantilla  != "undefined"){datosActualizar.idplantilla = req.body.IdPlantilla;}
     if(typeof req.body.IdFormato  != "undefined"){datosActualizar.IdFormato = req.body.IdFormato;}
     if(typeof req.body.Plantilla  != "undefined"){datosActualizar.Plantilla = req.body.Plantilla;}
     if(typeof req.body.Tipo  != "undefined"){datosActualizar.Tipo = req.body.Tipo;}
     if(typeof req.body.Orden  != "undefined"){datosActualizar.Orden = req.body.Orden;}
     if(typeof req.body.Nivel  != "undefined"){datosActualizar.Nivel = req.body.Nivel;}
     if(typeof req.body.Origen  != "undefined"){datosActualizar.Origen = req.body.Origen;}
     
     conversorDetallePlantilla.update(datosActualizar,
      {
        where: {IdPlantilla: req.params.id}
      })
      .then(function (result) { 
          res.json(result);
          meanCaseBase.auditSave(req,'Update Register','conversordetalleplantillas',datosActualizar);
      }, function(rejectedPromiseError){
          res.json(rejectedPromiseError);
      });
});
/* DELETE - conversordetalleplantillas. */
router.delete('/conversordetalleplantillas/:id', function(req, res){
   conversorDetallePlantilla.destroy({
    where: {
      IdPlantilla: req.params.id
    }
    }).then(function() {
        res.json({message: 'conversordetalleplantillas delete successful!'});
        meanCaseBase.auditSave(req,'Delete Register','conversordetalleplantillas','Id: '+req.params.id);
    });
});
module.exports = router;