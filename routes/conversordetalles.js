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
   conversordetalles.findById(req.params.id, function(err, data){
     if(typeof req.body.iddetalle  != "undefined"){data.iddetalle = req.body.iddetalle;}
     if(typeof req.body.idformato  != "undefined"){data.idformato = req.body.idformato;}
     if(typeof req.body.tiporegistro  != "undefined"){data.tiporegistro = req.body.tiporegistro;}
     if(typeof req.body.numerocampo  != "undefined"){data.numerocampo = req.body.numerocampo;}
     if(typeof req.body.posicioninicio  != "undefined"){data.posicioninicio = req.body.posicioninicio;}
     if(typeof req.body.longitudcampo  != "undefined"){data.longitudcampo = req.body.longitudcampo;}
     if(typeof req.body.tipocampo  != "undefined"){data.tipocampo = req.body.tipocampo;}
     if(typeof req.body.separadordecimales  != "undefined"){data.separadordecimales = req.body.separadordecimales;}
     if(typeof req.body.numerodecimales  != "undefined"){data.numerodecimales = req.body.numerodecimales;}
     if(typeof req.body.descripcioncampo  != "undefined"){data.descripcioncampo = req.body.descripcioncampo;}
     if(typeof req.body.idcampoequivalente  != "undefined"){data.idcampoequivalente = req.body.idcampoequivalente;}
     if(typeof req.body.campoequivalente  != "undefined"){data.campoequivalente = req.body.campoequivalente;}
     if(typeof req.body.obligatorio  != "undefined"){data.obligatorio = req.body.obligatorio;}
     if(typeof req.body.validaciones  != "undefined"){data.validaciones = req.body.validaciones;}
     if(typeof req.body.tipo_registro  != "undefined"){data.tipo_registro = req.body.tipo_registro;}
     if(typeof req.body.default_value  != "undefined"){data.default_value = req.body.default_value;}
     if(typeof req.body.observacion  != "undefined"){data.observacion = req.body.observacion;}
     if(typeof req.body.rutina_validacion  != "undefined"){data.rutina_validacion = req.body.rutina_validacion;}
     if(typeof req.body.rutina_transformacion  != "undefined"){data.rutina_transformacion = req.body.rutina_transformacion;}
     if(typeof req.body.caracterconcatenacion  != "undefined"){data.caracterconcatenacion = req.body.caracterconcatenacion;}
     if(typeof req.body.ordencampo  != "undefined"){data.ordencampo = req.body.ordencampo;}
     if(typeof req.body.rutina_conversion  != "undefined"){data.rutina_conversion = req.body.rutina_conversion;}
     if(typeof req.body.validaenmasivas  != "undefined"){data.validaenmasivas = req.body.validaenmasivas;}
     data.save(function(err){
       if(err){res.send(err)}
       res.json(data);
       meanCaseBase.auditSave(req,'Update Register','conversordetalles',data);
     })
   })
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