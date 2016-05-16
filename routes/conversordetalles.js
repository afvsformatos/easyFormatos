var meanCaseBase = require('../config/helpers/meanCaseBase.js');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var conversordetalles = mongoose.model('conversordetalles');
var conversorCabecera = require('../config/relationalModels/conversorCabecera.js');
var conversorDetalle = require('../config/relationalModels/conversorDetalle.js');
var connectionDb = require('../config/connectionDb.js');


router.get('/conversordetalles/:id', function (req, res) {
 
  conversorDetalle.findAll({ where: { IdFormato: req.params.id }, order: 'NumeroCampo ASC' }).then(function(detalles) {
        res.json(detalles);
  });

})
/* GET conversordetalles listing. */
router.get('/conversordetalles', function(req, res, next) {
   conversorDetalle.findAll().then(function(detalles) {
        res.json(detalles);
         meanCaseBase.auditSave(req,'Query all Registers','conversordetalles','Query all Registers');
    });

});
/* POST - Add conversordetalles. */
router.post('/conversordetalles', function(req, res, next){
      delete req.body.url;
      delete req.body.IdDetalle;
      conversorDetalle.create(req.body).then(function(data) {
        data.dataValues['message'] = "Registro Exitoso";
        res.json(data);
        meanCaseBase.auditSave(req,'Insert Register','conversordetalles',data);
      });
});
/* PUT - Update conversordetalles. */
router.put('/conversordetalles/:id', function(req, res){
     var datosActualizar = {};
     //if(typeof req.body.IdDetalle  != "undefined"){datosActualizar.IdDetalle = req.body.IdDetalle;}
     if(typeof req.body.IdFormato  != "undefined"){datosActualizar.IdFormato = req.body.IdFormato;}
     if(typeof req.body.TipoRegistro  != "undefined"){datosActualizar.TipoRegistro = req.body.TipoRegistro;}
     if(typeof req.body.NumeroCampo  != "undefined"){datosActualizar.NumeroCampo = req.body.NumeroCampo;}
     if(typeof req.body.PosicionInicio  != "undefined"){datosActualizar.PosicionInicio = req.body.PosicionInicio;}
     if(typeof req.body.LongitudCampo  != "undefined"){datosActualizar.LongitudCampo = req.body.LongitudCampo;}
     if(typeof req.body.TipoCampo  != "undefined"){datosActualizar.TipoCampo = req.body.TipoCampo;}
     if(typeof req.body.SeparadorDecimales  != "undefined"){datosActualizar.SeparadorDecimales = req.body.SeparadorDecimales;}
     if(typeof req.body.NumeroDecimales  != "undefined"){datosActualizar.NumeroDecimales = req.body.NumeroDecimales;}
     if(typeof req.body.DescripcionCampo  != "undefined"){datosActualizar.DescripcionCampo = req.body.DescripcionCampo;}
     if(typeof req.body.IdCampoEquivalente  != "undefined"){datosActualizar.IdCampoEquivalente = req.body.IdCampoEquivalente;}
     if(typeof req.body.CampoEquivalente  != "undefined"){datosActualizar.CampoEquivalente = req.body.CampoEquivalente;}
     if(typeof req.body.Obligatorio  != "undefined"){datosActualizar.Obligatorio = req.body.Obligatorio;}
     if(typeof req.body.Validaciones  != "undefined"){datosActualizar.Validaciones = req.body.Validaciones;}
     if(typeof req.body.Tipo_Registro  != "undefined"){datosActualizar.Tipo_Registro = req.body.Tipo_Registro;}
     if(typeof req.body.Default_Value  != "undefined"){datosActualizar.Default_Value = req.body.Default_Value;}
     if(typeof req.body.observacion  != "undefined"){datosActualizar.observacion = req.body.observacion;}
     if(typeof req.body.Rutina_Validacion  != "undefined"){datosActualizar.Rutina_Validacion = req.body.Rutina_Validacion;}
     if(typeof req.body.Rutina_Transformacion  != "undefined"){datosActualizar.Rutina_Transformacion = req.body.Rutina_Transformacion;}
     if(typeof req.body.CaracterConcatenacion  != "undefined"){datosActualizar.CaracterConcatenacion = req.body.CaracterConcatenacion;}
     if(typeof req.body.OrdenCampo  != "undefined"){datosActualizar.OrdenCampo = req.body.OrdenCampo;}
     if(typeof req.body.Rutina_Conversion  != "undefined"){datosActualizar.Rutina_Conversion = req.body.Rutina_Conversion;}
     if(typeof req.body.ValidaEnMasivas  != "undefined"){datosActualizar.ValidaEnMasivas = req.body.ValidaEnMasivas;}
     
     conversorDetalle.update(datosActualizar,
      {
        where: {IdDetalle: req.params.id}
      })
      .then(function (result) { 
          res.json(result);
          meanCaseBase.auditSave(req,'Update Register','conversordetalles',datosActualizar);
      }, function(rejectedPromiseError){
          res.json(rejectedPromiseError);
      });
});
/* DELETE - conversordetalles. */
router.delete('/conversordetalles/:id', function(req, res){
     conversorDetalle.destroy({
      where: {
        IdDetalle: req.params.id
      }
    }).then(function() {
        res.json({message: 'conversordetalles delete successful!'});
        meanCaseBase.auditSave(req,'Delete Register','conversordetalles','Id: '+req.params.id);
    });
});
module.exports = router;