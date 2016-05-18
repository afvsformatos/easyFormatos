var mongoose = require('mongoose');
var almacentramasSchema = new mongoose.Schema({
   id_formato: String,
   nombre_formato: String,
   trama: String,
   aprobo: Boolean
});
mongoose.model('almacentramas', almacentramasSchema);