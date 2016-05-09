var mongoose = require('mongoose');
var controlesSchema = new mongoose.Schema({
   fecha: Date
});
mongoose.model('controles', controlesSchema);