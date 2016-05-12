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
  });
})
/* GET conversorcabeceras listing. */
router.get('/conversorcabeceras', function(req, res, next) {
   conversorCabecera.findAll().then(function(cabeceras) {
        res.json(cabeceras);
         meanCaseBase.auditSave(req,'Query all Registers','conversorcabeceras','Query all Registers');
    });

   /*conversorcabeceras.find(function(err, models){
     if(err){return next(err)}
     res.json(models)
     meanCaseBase.auditSave(req,'Query all Registers','conversorcabeceras','Query all Registers');
   })*/
});
/* Obtener detalles de conversor cabecera*/

router.get('/conversorcabeceras/detalles/:id', function (req, res) {
  conversorDetalle.findAll({ where: { IdFormato: req.params.id } }).then(function(detalles) {
        res.json(detalles);
  });

});


/* POST - Add conversorcabeceras. */
router.post('/conversorcabeceras', function(req, res, next){
   /*var model = new conversorcabeceras(req.body);
   model.save(function(err, data){
     if(err){return next(err)}
     res.json(data);
     meanCaseBase.auditSave(req,'Insert Register','conversorcabeceras',data);
   })*/
   req.body.IdFormato = 9998;
   res.json(req.body);
   /*conversorCabecera.create(req.body).then(function() {
      res.json(data);
      meanCaseBase.auditSave(req,'Insert Register','conversorcabeceras',data);
    });*/
});
/* PUT - Update conversorcabeceras. */
router.put('/conversorcabeceras/:id', function(req, res){
   conversorcabeceras.findById(req.params.id, function(err, data){
     if(typeof req.body.id_formato  != "undefined"){data.id_formato = req.body.id_formato;}
     if(typeof req.body.nombre_formato  != "undefined"){data.nombre_formato = req.body.nombre_formato;}
     if(typeof req.body.descripcion_formato  != "undefined"){data.descripcion_formato = req.body.descripcion_formato;}
     if(typeof req.body.cabecera  != "undefined"){data.cabecera = req.body.cabecera;}
     if(typeof req.body.pie  != "undefined"){data.pie = req.body.pie;}
     if(typeof req.body.separador  != "undefined"){data.separador = req.body.separador;}
     if(typeof req.body.formato_conversion  != "undefined"){data.formato_conversion = req.body.formato_conversion;}
     if(typeof req.body.formato_destino  != "undefined"){data.formato_destino = req.body.formato_destino;}
     if(typeof req.body.tipo_proceso  != "undefined"){data.tipo_proceso = req.body.tipo_proceso;}
     if(typeof req.body.nombre_objeto  != "undefined"){data.nombre_objeto = req.body.nombre_objeto;}
     if(typeof req.body.estado  != "undefined"){data.estado = req.body.estado;}
     if(typeof req.body.tipo_archivo_salida  != "undefined"){data.tipo_archivo_salida = req.body.tipo_archivo_salida;}
     if(typeof req.body.orientacion  != "undefined"){data.orientacion = req.body.orientacion;}
     if(typeof req.body.rutina_prevalidacion  != "undefined"){data.rutina_prevalidacion = req.body.rutina_prevalidacion;}
     if(typeof req.body.unificador  != "undefined"){data.unificador = req.body.unificador;}
     if(typeof req.body.check_totales_por  != "undefined"){data.check_totales_por = req.body.check_totales_por;}
     if(typeof req.body.validaidentificacion  != "undefined"){data.validaidentificacion = req.body.validaidentificacion;}
     if(typeof req.body.rutina_preconversion  != "undefined"){data.rutina_preconversion = req.body.rutina_preconversion;}
     if(typeof req.body.infiere_tipo_id_cliente  != "undefined"){data.infiere_tipo_id_cliente = req.body.infiere_tipo_id_cliente;}
     if(typeof req.body.muestra_cabecera_columna  != "undefined"){data.muestra_cabecera_columna = req.body.muestra_cabecera_columna;}
     if(typeof req.body.tipo_conversion  != "undefined"){data.tipo_conversion = req.body.tipo_conversion;}
     data.save(function(err){
       if(err){res.send(err)}
       res.json(data);
       meanCaseBase.auditSave(req,'Update Register','conversorcabeceras',data);
     })
   })
});
/* DELETE - conversorcabeceras. */
router.delete('/conversorcabeceras/:id', function(req, res){
   /*conversorcabeceras.findByIdAndRemove(req.params.id, function(err){
     if(err){res.send(err)}
     res.json({message: 'conversorcabeceras delete successful!'});
     meanCaseBase.auditSave(req,'Delete Register','conversorcabeceras','Id: '+req.params.id);
   })*/
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