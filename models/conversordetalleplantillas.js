var mongoose = require('mongoose');
var conversordetalleplantillasSchema = new mongoose.Schema({
   idplantilla: Number,
   idformato: Number,
   plantilla: String,
   tipo: String,
   orden: Number,
   nivel: String,
   origen: String
});
mongoose.model('conversordetalleplantillas', conversordetalleplantillasSchema);