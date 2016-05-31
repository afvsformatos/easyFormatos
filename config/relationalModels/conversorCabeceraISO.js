var connectionDb = require('../../config/connectionDb.js');
//var conversorDetalleISO = require('../../config/relationalModels/conversorDetalleISO.js');
var conversorCabeceraISO = connectionDb.sequelize.define('Conversor_Cabecera_ISO8583', {
  Id_Transaccion_Cabecera: {
    type: connectionDb.Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  IdFormato: {
    type: connectionDb.Sequelize.INTEGER,
  },
  Orden: {
    type: connectionDb.Sequelize.INTEGER,
  },
  Nombre: {
    type: connectionDb.Sequelize.STRING,
  },
  Tipo: {
    type: connectionDb.Sequelize.STRING,
  },
  Longitud: {
    type: connectionDb.Sequelize.INTEGER,
  },
  Bytes: {
    type: connectionDb.Sequelize.INTEGER                     ,
  },
  AplicaDefault: {
    type: connectionDb.Sequelize.STRING,//bit
  },
  ValorDefault: {
    type: connectionDb.Sequelize.STRING,
  },
  Respuesta: {
    type: connectionDb.Sequelize.STRING,
  },
  Descripcion: {
    type: connectionDb.Sequelize.STRING,
  },
  
}, {
  freezeTableName: true, // Model tableName will be the same as the model name
   updatedAt : false,
   createdAt: false
}
);

/*conversorCabecera.hasMany(conversorDetalleISO, {
  foreignKey: 'Id_Transaccion_Cabecera',
   onDelete: "CASCADE",
});*/

module.exports = conversorCabeceraISO;