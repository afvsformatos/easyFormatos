var meanCaseBase = require('../config/helpers/meanCaseBase.js');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var conversorcabeceraisos = mongoose.model('conversorcabeceraisos');
var conversorCabeceraIso = require('../config/relationalModels/conversorCabeceraISO.js');
var conversorDetalleIso = require('../config/relationalModels/conversorDetalleISO.js');
var conversorCabecera = require('../config/relationalModels/conversorCabecera.js');
var connectionDb = require('../config/connectionDb.js');

router.get('/conversorcabeceraisos/:id', function (req, res) {
  conversorcabeceraisos.findById(req.params.id, function (err, data) {
    res.json(data);
  })
})


router.post('/obtenerOperadoresCabeceraIso', function (req, res) {
  connectionDb.sequelize.query("SELECT DISTINCT Id_Operador FROM  Conversor_Cabecera_Detalle_Catalogo_ISO8583  WHERE  (Id_Operador <> 0)").then(function(data){
      /*var array = data[0];
      var flags = [], output = [], l = array.length, i;
      for( i=0; i<l; i++) {
          if( flags[array[i].ValorDefault]) continue;
          flags[array[i].ValorDefault] = true;
          output.push({ValorDefault:array[i].ValorDefault,IdFormato:array[i].IdFormato});
      }*/ 
      res.json(data[0]);
  })
})

router.post('/obtenerFormatos', function (req, res) {
  conversorCabeceraIso.findAll({ where: { ValorDefault: req.body.Id_Operador }}).then(function(idFormatos) {
          var arrayIdsFormatos = [];
          for(prop in idFormatos){
              arrayIdsFormatos.push({IdFormato:idFormatos[prop].IdFormato});
          }
          conversorCabecera.findAll({
            where: {
              $or: arrayIdsFormatos
            }
          }).then(function(cabecera) {
               res.json(cabecera);
          });
  });
})

router.post('/eliminarCatalogo', function (req, res) {
  conversorDetalleIso.destroy({
                where: {
                  Id_Operador: req.body.Id_Operador
                }
              }).then(function(data){
                  res.json(data);
              });
  
})

router.post('/obtenerDetalleCatalogos', function (req, res) {  
      var arrayIdsFormatos = [];
      for(prop in req.body){
          arrayIdsFormatos.push({Id_Operador:req.body[prop].Id_Operador});
      }
      conversorDetalleIso.findAll({
            where: {
              $or: arrayIdsFormatos
            },order: 'Id_Operador ASC'
          }).then(function(catalogos) {
               res.json(catalogos);
      });
      
})



router.post('/obtenerCatalogos', function (req, res) {
  conversorDetalleIso.findAll({ where: { Id_Operador: req.body.id }}).then(function(plantilla) {
        res.json(plantilla);
        meanCaseBase.auditSave(req,'Obtener plantilla base','Catalogo Iso','Obtener plantilla base');
  });
})

/* GET conversorcabeceraisos listing. */
router.get('/conversorcabeceraisos', function(req, res, next) {
   conversorcabeceraisos.find(function(err, models){
     if(err){return next(err)}
     res.json(models)
     meanCaseBase.auditSave(req,'Query all Registers','conversorcabeceraisos','Query all Registers');
   })
});
/* POST - Add conversorcabeceraisos. */
router.post('/conversorcabeceraisos', function(req, res, next){
   conversorDetalleIso.create(req.body).then(function(data) {
      data.dataValues['message'] = "Registro Exitoso";
      res.json(data);
      meanCaseBase.auditSave(req,'Insert Register','Conversor detalle Iso',data);
    });
});

router.post('/grabarCatalogosISO', function(req, res, next){
    for(prop in req.body){
        conversorDetalleIso.create(req.body[prop]);
    }
    res.json({msj:'Success'});
});

/* PUT - Update conversorcabeceraisos. */
router.put('/conversorcabeceraisos/:id', function(req, res){
   conversorcabeceraisos.findById(req.params.id, function(err, data){
     if(typeof req.body.id_transaccion_cabecera  != "undefined"){data.id_transaccion_cabecera = req.body.id_transaccion_cabecera;}
     if(typeof req.body.idformato  != "undefined"){data.idformato = req.body.idformato;}
     if(typeof req.body.orden  != "undefined"){data.orden = req.body.orden;}
     if(typeof req.body.nombre  != "undefined"){data.nombre = req.body.nombre;}
     if(typeof req.body.tipo  != "undefined"){data.tipo = req.body.tipo;}
     if(typeof req.body.longitud  != "undefined"){data.longitud = req.body.longitud;}
     if(typeof req.body.bytes  != "undefined"){data.bytes = req.body.bytes;}
     if(typeof req.body.aplicadefault  != "undefined"){data.aplicadefault = req.body.aplicadefault;}
     if(typeof req.body.valordefault  != "undefined"){data.valordefault = req.body.valordefault;}
     if(typeof req.body.respuesta  != "undefined"){data.respuesta = req.body.respuesta;}
     if(typeof req.body.descripcion  != "undefined"){data.descripcion = req.body.descripcion;}
     data.save(function(err){
       if(err){res.send(err)}
       res.json(data);
       meanCaseBase.auditSave(req,'Update Register','conversorcabeceraisos',data);
     })
   })
});
/* DELETE - conversorcabeceraisos. */
router.delete('/conversorcabeceraisos/:id', function(req, res){
   conversorcabeceraisos.findByIdAndRemove(req.params.id, function(err){
     if(err){res.send(err)}
     res.json({message: 'conversorcabeceraisos delete successful!'});
     meanCaseBase.auditSave(req,'Delete Register','conversorcabeceraisos','Id: '+req.params.id);
   })
});
module.exports = router;