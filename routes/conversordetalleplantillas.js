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