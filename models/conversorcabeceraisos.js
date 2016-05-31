var mongoose = require('mongoose');
var conversorcabeceraisosSchema = new mongoose.Schema({
   id_transaccion_cabecera: Number,
   idformato: Number,
   orden: Number,
   nombre: String,
   tipo: String,
   longitud: Number,
   bytes: Number,
   aplicadefault: Boolean,
   valordefault: String,
   respuesta: String,
   descripcion: String
});
mongoose.model('conversorcabeceraisos', conversorcabeceraisosSchema);