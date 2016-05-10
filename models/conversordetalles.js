var mongoose = require('mongoose');
var conversordetallesSchema = new mongoose.Schema({
   iddetalle: Number,
   idformato: Number,
   tiporegistro: String,
   numerocampo: Number,
   posicioninicio: Number,
   longitudcampo: Number,
   tipocampo: String,
   separadordecimales: String,
   numerodecimales: Number,
   descripcioncampo: String,
   idcampoequivalente: Number,
   campoequivalente: String,
   obligatorio: String,
   validaciones: String,
   tipo_registro: String,
   default_value: String,
   observacion: String,
   rutina_validacion: String,
   rutina_transformacion: String,
   caracterconcatenacion: String,
   ordencampo: String,
   rutina_conversion: String,
   validaenmasivas: String
});
mongoose.model('conversordetalles', conversordetallesSchema);