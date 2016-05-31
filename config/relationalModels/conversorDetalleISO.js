var connectionDb = require('../../config/connectionDb.js');
//var conversorCabeceraISO = require('../../config/relationalModels/conversorCabeceraISO.js');
var conversorDetalleISO = connectionDb.sequelize.define('Conversor_Cabecera_Detalle_Catalogo_ISO8583', {
  Id_Operador: {
     type: connectionDb.Sequelize.INTEGER,
     autoIncrement: true,
     primaryKey: true
  },
  Bitmap: {
      type: connectionDb.Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
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
  Descripcion: {
    type: connectionDb.Sequelize.STRING,
  },
  TipoDato: {
    type: connectionDb.Sequelize.STRING,
  },
  
  
}, {
  freezeTableName: true, // Model tableName will be the same as the model name
   updatedAt : false,
   createdAt: false
}

/*,{
	    classMethods: {
		      associate: function(models) {
				    Conversor_Detalle.belongsTo(models.Conversor_Cabecera, {
				          foreignKeyConstraint: true,
                  onDelete: "CASCADE"
			        });
		      }
	    }
	}

);*/



module.exports = conversorDetalleISO;