var mongoose = require('mongoose');
var conversordetalleisosSchema = new mongoose.Schema({
   id_operador: Number,
   bitmap: Number,
   nombre: String,
   tipo: String,
   longitud: Number,
   descripcion: String,
   tipodato: String
});
mongoose.model('conversordetalleisos', conversordetalleisosSchema);