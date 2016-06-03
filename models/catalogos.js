var mongoose = require('mongoose');
var catalogosSchema = new mongoose.Schema({
   id_tabla: String,
   tabla_argumento: String,
   tabla_descripcion: String,
   tabla_referencia: String,
   tabla_estado: String
});
mongoose.model('catalogos', catalogosSchema);