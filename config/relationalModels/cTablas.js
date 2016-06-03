var connectionDb = require('../../config/connectionDb.js');
var cTablas = connectionDb.sequelize.define('C_TABLAS', {
  IDTabla: {
    type: connectionDb.Sequelize.STRING,
    primaryKey: true
  },
  TABLAArgumento: {
    type: connectionDb.Sequelize.STRING,
    primaryKey: true
  },
  TABLADescripcion: {
    type: connectionDb.Sequelize.STRING,
  },
  TABLAReferencia: {
    type: connectionDb.Sequelize.STRING,
  },
  TABLAEstado: {
    type: connectionDb.Sequelize.STRING,
  }
}, {
  freezeTableName: true, // Model tableName will be the same as the model name
   updatedAt : false,
   createdAt: false
}
);




module.exports = cTablas;