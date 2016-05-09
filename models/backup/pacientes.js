var mongoose = require('mongoose');
var pacientesSchema = new mongoose.Schema({
   nombres: String,
   edad: String
});
mongoose.model('pacientes', pacientesSchema);