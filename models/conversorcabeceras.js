var mongoose = require('mongoose');
var conversorcabecerasSchema = new mongoose.Schema({
   id_formato: Number,
   nombre_formato: String,
   descripcion_formato: String,
   cabecera: String,
   pie: String,
   separador: String,
   formato_conversion: Number,
   formato_destino: String,
   tipo_proceso: String,
   nombre_objeto: String,
   estado: String,
   tipo_archivo_salida: String,
   orientacion: String,
   rutina_prevalidacion: String,
   unificador: String,
   check_totales_por: String,
   validaidentificacion: String,
   rutina_preconversion: String,
   infiere_tipo_id_cliente: String,
   muestra_cabecera_columna: String,
   tipo_conversion: String
});
mongoose.model('conversorcabeceras', conversorcabecerasSchema);