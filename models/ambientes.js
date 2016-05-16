var mongoose = require('mongoose');
var ambientesSchema = new mongoose.Schema({
   ambiente: String,
   username: String,
   password: String,
   database: String,
   host: String,
   dialect: String,
   estado: Boolean
});
mongoose.model('ambientes', ambientesSchema);