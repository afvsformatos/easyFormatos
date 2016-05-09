var meanCaseBase = require('../config/helpers/meanCaseBase.js');
var path = require("path");
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var pacientes = mongoose.model('pacientes');
var conversorCabecera = require('../config/relationalModels/conversorCabecera.js');
var conversorDetalle = require('../config/relationalModels/conversorDetalle.js');
var connectionDb = require('../config/connectionDb.js');


router.get('/pacientes/afvs', function(req, res) {
    /*connectionDb.sequelize.query("select * from Easy_CS_Multicanal..Conversor_Cabecera with(nolock) where NombreFormato like '%RESPUESTA_REGISTRO_PTOMATICO_SERVICIOS%'", { type: connectionDb.sequelize.QueryTypes.SELECT})
    .then(function(users) {
        res.json(users);
    })*/
    /*conversorCabecera.findAll({
      attributes: ['IdFormato', 'NombreFormato','ValidaIdentificacion']
    }).then(function(resp){
       res.json(resp);
    });*/

    /*connectionDb.sequelize.query("select * from Easy_CS_Multicanal..Conversor_Detalle with(nolock) where IdDetalle = 41727", { type: connectionDb.sequelize.QueryTypes.SELECT})
    .then(function(users) {
        res.json(users);
    });*/
    /*
    conversorDetalle.findAll({
      attributes: ['IdDetalle', 'DescripcionCampo','SeparadorDecimales']
    }).then(function(resp){
       res.json(resp);
    });*/

    
    /*conversorCabecera.findAll({
      attributes: ['IdFormato', 'NombreFormato','detalles']
    }).then(function(resp){
       res.json(resp);
    });*/
    //conversorCabecera.hasMany(conversorDetalle, {as: 'IdFormato'})
    /*conversorCabecera.findAll({
      include: [ conversorDetalle ]
    }).then(function(users) {
      res.json(users);
    });*/

    /*conversorCabecera.findAll({
      include: [ conversorDetalle ]
    }).then(function(conversor) {
      res.json(conversor);
    });*/
     conversorCabecera.findAll().then(function(cabeceras) {
        res.json(cabeceras);
      });



});

router.get('/pacientes/afvs/insert', function(req, res) {
   conversorCabecera.create({
                dato1: 'flaco',
                dato: 'gay'
              }).then(function() {
                 res.json('exitoso');
              });
});



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