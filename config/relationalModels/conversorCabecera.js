var connectionDb = require('../../config/connectionDb.js');
var conversorDetalle = require('../../config/relationalModels/conversorDetalle.js');
var conversorCabecera = connectionDb.sequelize.define('Conversor_Cabecera', {
  IdFormato: {
    type: connectionDb.Sequelize.INTEGER,
    primaryKey: true
  },
  NombreFormato: {
    type: connectionDb.Sequelize.STRING,
    //field: 'nombres' // Will result in an attribute that is firstName when user facing but first_name in the database
  },
  DescripcionFormato: {
    type: connectionDb.Sequelize.STRING,
  },
  Cabecera: {
    type: connectionDb.Sequelize.STRING,//bit
  },
  Pie: {
    type: connectionDb.Sequelize.STRING,//bit
  },
  Separador: {
    type: connectionDb.Sequelize.STRING,
  },
  FormatoConversion: {
    type: connectionDb.Sequelize.INTEGER                     ,
  },
  Formato_destino: {
    type: connectionDb.Sequelize.STRING,//bit
  },
  Tipo_Proceso: {
    type: connectionDb.Sequelize.STRING,
  },
  NombreObjeto: {
    type: connectionDb.Sequelize.STRING,
  },
  estado: {
    type: connectionDb.Sequelize.STRING,
  },
  tipo_archivo_salida: {
    type: connectionDb.Sequelize.STRING,
  },
   ORIENTACION: {
    type: connectionDb.Sequelize.STRING,
  },
   RutinaPrevalidacion: {
    type: connectionDb.Sequelize.STRING,
  },
   Unificador: {
    type: connectionDb.Sequelize.STRING,
  },
  Check_Totales_Por: {
    type: connectionDb.Sequelize.STRING,
  },
  ValidaIdentificacion: {
    type: connectionDb.Sequelize.STRING,//bit
  },
  RutinaPreconversion: {
    type: connectionDb.Sequelize.STRING,
  },
  InfiereTipoIdCliente: {
    type: connectionDb.Sequelize.STRING,//bit
  },
  MuestraCabeceraColumna: {
    type: connectionDb.Sequelize.STRING,//bit
  },
  TipoConversion: {
    type: connectionDb.Sequelize.STRING,
  },
  
}, {
  freezeTableName: true, // Model tableName will be the same as the model name
   updatedAt : false,
   createdAt: false
}
);

conversorCabecera.hasMany(conversorDetalle, {
  foreignKey: 'IdFormato',
  constraints: false
 /* scope: {
    commentable: 'post'
  }*/
});

module.exports = conversorCabecera;