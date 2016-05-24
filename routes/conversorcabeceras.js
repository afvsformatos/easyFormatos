var meanCaseBase = require('../config/helpers/meanCaseBase.js');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var conversorcabeceras = mongoose.model('conversorcabeceras');
var conversorCabecera = require('../config/relationalModels/conversorCabecera.js');
var conversorDetalle = require('../config/relationalModels/conversorDetalle.js');
var conversorDetallePlantilla = require('../config/relationalModels/conversorDetallePlantilla.js');
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

/* GENERAR FORMATOS AUTOMATICOS*/
router.post('/generarFormatosAutomaticos', function(req, res, next){
      
      var nombreFormato = req.body[2].value;
      var descripcionFormato = req.body[1].value;
      var objCabecera = {
            NombreFormato: nombreFormato,
            DescripcionFormato: descripcionFormato,
            Cabecera: 0,
            Pie: 0,
            Separador: '',
            FormatoConversion: 0,
            Formato_destino: 0,
            //Tipo_Proceso: nombreFormato,
            NombreObjeto: '',
            estado: 'ACTIVO',
            //tipo_archivo_salida: nombreFormato,
            ORIENTACION: '',
            RutinaPrevalidacion: '',
            Unificador: '',
            Check_Totales_Por: '',
            ValidaIdentificacion: 1,
            RutinaPreconversion: '',
            InfiereTipoIdCliente: 0,
            MuestraCabeceraColumna: 0
            //TipoConversion: nombreFormato

        };
        var objDetalle = {
            //IdFormato: ,
            TipoRegistro: 'D',
            //NumeroCampo: ,
            PosicionInicio: 0,
            LongitudCampo: 0,
            TipoCampo: 'X',
            SeparadorDecimales: 0,
            NumeroDecimales: 0,
            //DescripcionCampo: ,
            IdCampoEquivalente: 0,
            //CampoEquivalente: ,
            Obligatorio: 0,
            Validaciones: '',
            Tipo_Registro: 'ITEM',
            Default_Value: '',
            observacion: '',
            Rutina_Validacion: '',
            Rutina_Transformacion: '',
            CaracterConcatenacion: '',
            OrdenCampo: -1,
            Rutina_Conversion: '',
            ValidaEnMasivas: 1
        };
      if(req.body[0].value == 'ENVIO'){
        var plantilla = req.body[3].value;
        req.body.shift();
        req.body.shift();
        req.body.shift();
        objCabecera.Tipo_Proceso = 'IN';
        objCabecera.tipo_archivo_salida = 'STRING';
        objCabecera.TipoConversion = 'PROCESO,PLANTILLA';
        
        conversorCabecera.create(objCabecera).then(function(data) {
          var objPlantilla = {
            IdFormato: data.IdFormato,
            Plantilla: plantilla,
            Tipo: '',
            Orden: 1,
            Nivel: 'root',
            Origen: 'root'
          };
          var i = 1;
          for (prop in req.body){
            objDetalle.IdFormato = data.IdFormato;
            objDetalle.NumeroCampo = i;
            objDetalle.DescripcionCampo = req.body[prop].descripcionCampo;
            objDetalle.CampoEquivalente = req.body[prop].campoEquivalente;
            conversorDetalle.create(objDetalle);
            i++;
          }
          conversorDetallePlantilla.create(objPlantilla).then(function(r){
               res.json(data);
          });
        });
      }else{
        req.body.shift();
        req.body.shift();
        req.body.shift();
        objCabecera.Tipo_Proceso = 'OUT';
        objCabecera.tipo_archivo_salida = 'DICCIONARIO';
        objCabecera.TipoConversion = 'PROCESO';
        conversorCabecera.create(objCabecera).then(function(data) {
          res.json(data);
        });
      }
   
});

/* Duplicar Formatos */
router.post('/duplicarFormato', function(req, res, next){
    conversorCabecera.find({ where: { IdFormato: req.body.idFormato}, include: [conversorDetalle,conversorDetallePlantilla]}).then(function(cabecera) {
          var cabeceraDetalles = cabecera.dataValues.Conversor_Detalles;
          var cabeceraPlantillas = cabecera.dataValues.Conversor_Detalle_Plantillas;
          delete cabecera.dataValues['IdFormato'];
          delete cabecera.dataValues['Conversor_Detalles'];
          cabecera.dataValues.NombreFormato = req.body.nombreFormato;
          cabecera.dataValues.DescripcionFormato =  req.body.descripcionFormato; 
          conversorCabecera.create(cabecera.dataValues).then(function(data) {
              var size = cabeceraDetalles.length;
              var sizePlantillas = cabeceraPlantillas.length;
              for (var i = 0 ; i < size; i++) { 
                 delete cabeceraDetalles[i].dataValues.IdDetalle;
                 cabeceraDetalles[i].dataValues.IdFormato = data.dataValues.IdFormato;
                 conversorDetalle.create(cabeceraDetalles[i].dataValues);

              }
              for (var i = 0 ; i < sizePlantillas; i++) { 
                 delete cabeceraPlantillas[i].dataValues.IdPlantilla;
                 cabeceraPlantillas[i].dataValues.IdFormato = data.dataValues.IdFormato;
                 conversorDetallePlantilla.create(cabeceraPlantillas[i].dataValues);

              }
              data.dataValues['message'] = "Registro Duplicado Correctamente";
              res.json(data.dataValues);
          });
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
  
           //Eliminacion Detalles Asociados
            conversorDetalle.destroy({
              where: {
                IdFormato: req.params.id
              }
            }).then(function(rowDeleted) {
                if(rowDeleted > 0){
                  //Eliminar Plantilla Asociada
                    conversorDetallePlantilla.destroy({
                      where: {
                        IdFormato: req.params.id
                      }
                    }).then(function(rowDeleted) {
                        if(rowDeleted > 0){
                           conversorCabecera.destroy({
                                where: {
                                  IdFormato: req.params.id
                                }
                            }).then(function(rowDeleted) {
                                if(rowDeleted > 0){
                                   res.json({message: 'Eliminación Exitosa!',exito:true});
                                   meanCaseBase.auditSave(req,'Delete Register','conversorcabeceras','Id: '+req.params.id); 
                                }else{
                                   res.json({message: 'Se ha Producido un Error al Eliminar el Registro!'});
                                }
                            });
                        }else{
                           res.json({message: 'Se ha Producido un Error al Eliminar el Registro!'});
                        }
                        
                    });
                  //Fin Eliminar Plantilla Asociada 
                   
                }else{
                   res.json({message: 'Se ha Producido un Error al Eliminar el Registro!'});
                }
                
            });
           //Fin Eliminacion Detalles Asociuados
      
      
  
   
});
module.exports = router;