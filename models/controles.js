var mongoose = require('mongoose');
var controlesSchema = new mongoose.Schema({
   fecha: Date,
   pacientes: { type: mongoose.Schema.ObjectId, ref: "pacientes" }
});
mongoose.model('controles', controlesSchema);