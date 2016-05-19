var connectionDb = require('../../config/connectionDb.js');
var conversorCabecera = require('../../config/relationalModels/conversorCabecera.js');
var conversorDetallePlantilla = connectionDb.sequelize.define('Conversor_Detalle_Plantilla', {
  IdPlantilla: {
    type: connectionDb.Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  IdFormato: {
    type: connectionDb.Sequelize.INTEGER,
    //field: 'nombres' // Will result in an attribute that is firstName when user facing but first_name in the database
  },
  Plantilla: {
    type: connectionDb.Sequelize.STRING,
  },
  Tipo: {
    type: connectionDb.Sequelize.STRING,
  },
  Orden : {
    type: connectionDb.Sequelize.INTEGER,
  },
  Nivel: {
    type: connectionDb.Sequelize.STRING,
  },
  Origen: {
    type: connectionDb.Sequelize.STRING,
  }  
}, {
  freezeTableName: true, // Model tableName will be the same as the model name
   updatedAt : false,
   createdAt: false
},{
      classMethods: {
          associate: function(models) {
            Conversor_Detalle.belongsTo(models.Conversor_Cabecera, {
                  foreignKeyConstraint: true,
                  onDelete: "CASCADE"
              });
          }
      }
  }

);

/*conversorDetalle.belongsTo(conversorCabecera, {
  foreignKey: 'IdFormato',
  constraints: false
 /* scope: {
    commentable: 'post'
  }
});*/

module.exports = conversorDetallePlantilla;