var connectionDb = require('../../config/connectionDb.js');
var conversorCabecera = require('../../config/relationalModels/conversorCabecera.js');
var conversorDetalle = connectionDb.sequelize.define('Conversor_Detalle', {
  IdDetalle: {
    type: connectionDb.Sequelize.INTEGER,
     autoIncrement: true,
    primaryKey: true
  },
  IdFormato: {
    type: connectionDb.Sequelize.INTEGER,
    //field: 'nombres' // Will result in an attribute that is firstName when user facing but first_name in the database
  },
  TipoRegistro: {
    type: connectionDb.Sequelize.STRING,
  },
  NumeroCampo: {
    type: connectionDb.Sequelize.INTEGER,
  },
  PosicionInicio: {
    type: connectionDb.Sequelize.INTEGER,
  },
  LongitudCampo: {
    type: connectionDb.Sequelize.INTEGER,
  },
  TipoCampo: {
    type: connectionDb.Sequelize.STRING,
  },
  SeparadorDecimales: {
    type: connectionDb.Sequelize.STRING,//bit
  },
  NumeroDecimales: {
    type: connectionDb.Sequelize.INTEGER,
  },
  DescripcionCampo: {
    type: connectionDb.Sequelize.STRING,
  },
  IdCampoEquivalente: {
    type: connectionDb.Sequelize.INTEGER,
  },
  CampoEquivalente: {
    type: connectionDb.Sequelize.STRING,
  },
   Obligatorio: {
    type: connectionDb.Sequelize.STRING,//bit
  },
   Validaciones: {
    type: connectionDb.Sequelize.STRING,
  },
   Tipo_Registro: {
    type: connectionDb.Sequelize.STRING,
  },
  Default_Value: {
    type: connectionDb.Sequelize.STRING,
  },
  observacion: {
    type: connectionDb.Sequelize.STRING,
  },
  Rutina_Validacion: {
    type: connectionDb.Sequelize.STRING,
  },
  Rutina_Transformacion: {
    type: connectionDb.Sequelize.STRING,
  },
  CaracterConcatenacion: {
    type: connectionDb.Sequelize.STRING,
  },
  OrdenCampo: {
    type: connectionDb.Sequelize.INTEGER,
  },
  Rutina_Conversion: {
    type: connectionDb.Sequelize.STRING,
  },
  ValidaEnMasivas: {
    type: connectionDb.Sequelize.STRING,//bit
  }
  
}, {
  freezeTableName: true, // Model tableName will be the same as the model name
   updatedAt : false,
   createdAt: false
}/*, {
	    classMethods: {
		      associate: function(models) {
				    Conversor_Detalle.belongsTo(models.Conversor_Cabecera, {
				          onDelete: "CASCADE",
				          foreignKey: {
				            allowNull: false
				          }
			        });
		      }
	    }
	}*/

);

/*conversorDetalle.belongsTo(conversorCabecera, {
  foreignKey: 'IdFormato',
  constraints: false
 /* scope: {
    commentable: 'post'
  }
});*/

module.exports = conversorDetalle;