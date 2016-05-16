var meanCaseBase = require('../config/helpers/meanCaseBase.js');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var conversorcabeceras = mongoose.model('conversorcabeceras');
var conversorCabecera = require('../config/relationalModels/conversorCabecera.js');
var conversorDetalle = require('../config/relationalModels/conversorDetalle.js');
var connectionDb = require('../config/connectionDb.js');

router.get('/conversorcabeceras/:id', function (req, res) {
  conversorCabecera.findAll({ where: { IdFormato: req.params.id }}).then(function(cabecera) {
        res.json(cabecera);
        meanCaseBase.auditSave(req,'Query one item','conversorcabeceras','Query one item');
  });
})
/* GET conversorcabeceras listing. */
router.get('/conversorcabeceras', function(req, res, next) {
   conversorCabecera.findAll().then(function(cabeceras) {
        res.json(cabeceras);
         meanCaseBase.auditSave(req,'Query all Registers','conversorcabeceras','Query all Registers');
    });

});

/* Obtener detalles de conversor cabecera*/

router.get('/conversorcabeceras/detalles/:id', function (req, res) {
  conversorDetalle.findAll({ where: { IdFormato: req.params.id } }).then(function(detalles) {
        res.json(detalles);
        meanCaseBase.auditSave(req,'Query all Detalles','conversordetalles','Query all Detalles');
  });

});


/* POST - Add conversorcabeceras. */
router.post('/conversorcabeceras', function(req, res, next){
   delete req.body.url;
   delete req.body.IdFormato;
   conversorCabecera.create(req.body).then(function(data) {
      data.dataValues['message'] = "Registro Exitoso";
      res.json(data);
      meanCaseBase.auditSave(req,'Insert Register','conversorcabeceras',data);
    });
});
/* PUT - Update conversorcabeceras. */
router.put('/conversorcabeceras/:id', function(req, res){
   var datosActualizar = {};
   if(typeof req.body.NombreFormato  != "undefined"){datosActualizar.NombreFormato = req.body.NombreFormato;}
   if(typeof req.body.DescripcionFormato  != "undefined"){datosActualizar.DescripcionFormato = req.body.DescripcionFormato;}
   if(typeof req.body.Cabecera  != "undefined"){datosActualizar.Cabecera = req.body.Cabecera;}
   if(typeof req.body.Pie  != "undefined"){datosActualizar.Pie = req.body.Pie;}
   if(typeof req.body.Separador  != "undefined"){datosActualizar.Separador = req.body.Separador;}
   if(typeof req.body.FormatoConversion  != "undefined"){datosActualizar.FormatoConversion = req.body.FormatoConversion;}
   if(typeof req.body.Formato_destino  != "undefined"){datosActualizar.Formato_destino = req.body.Formato_destino;}
   if(typeof req.body.Tipo_Proceso  != "undefined"){datosActualizar.Tipo_Proceso = req.body.Tipo_Proceso;}
   if(typeof req.body.NombreObjeto  != "undefined"){datosActualizar.NombreObjeto = req.body.NombreObjeto;}
   if(typeof req.body.estado  != "undefined"){datosActualizar.estado = req.body.estado;}
   if(typeof req.body.tipo_archivo_salida  != "undefined"){datosActualizar.tipo_archivo_salida = req.body.tipo_archivo_salida;}
   if(typeof req.body.ORIENTACION  != "undefined"){datosActualizar.ORIENTACION = req.body.ORIENTACION;}
   if(typeof req.body.RutinaPrevalidacion  != "undefined"){datosActualizar.RutinaPrevalidacion = req.body.RutinaPrevalidacion;}
   if(typeof req.body.Unificador  != "undefined"){datosActualizar.Unificador = req.body.Unificador;}
   if(typeof req.body.Check_Totales_Por  != "undefined"){datosActualizar.Check_Totales_Por = req.body.Check_Totales_Por;}
   if(typeof req.body.ValidaIdentificacion  != "undefined"){datosActualizar.ValidaIdentificacion = req.body.ValidaIdentificacion;}
   if(typeof req.body.RutinaPreconversion  != "undefined"){datosActualizar.RutinaPreconversion = req.body.RutinaPreconversion;}
   if(typeof req.body.InfiereTipoIdCliente  != "undefined"){datosActualizar.InfiereTipoIdCliente = req.body.InfiereTipoIdCliente;}
   if(typeof req.body.MuestraCabeceraColumna  != "undefined"){datosActualizar.MuestraCabeceraColumna = req.body.MuestraCabeceraColumna;}
   if(typeof req.body.TipoConversion  != "undefined"){datosActualizar.TipoConversion = req.body.TipoConversion;}

  conversorCabecera.update(datosActualizar,
      {
        where: {IdFormato: req.params.id}
      })
      .then(function (result) { 
          res.json(result);
          meanCaseBase.auditSave(req,'Update Register','conversocabeceras',datosActualizar);
      }, function(rejectedPromiseError){
          res.json(rejectedPromiseError);
      });
  
   
});
/* DELETE - conversorcabeceras. */
router.delete('/conversorcabeceras/:id', function(req, res){
   conversorCabecera.destroy({
    where: {
      IdFormato: req.params.id
    }
  }).then(function() {
      res.json({message: 'conversorcabeceras delete successful!'});
      meanCaseBase.auditSave(req,'Delete Register','conversorcabeceras','Id: '+req.params.id);
  });
   
});
module.exports = router;