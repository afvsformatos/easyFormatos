var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var ModelGeneralConfig = mongoose.model('ModelGeneralConfig');
var settings = require('../config/settings.js');
/* GET home page. */
router.get('/', function(req, res, next) {
	ModelGeneralConfig.find(function (err, models) {
    	if(models == ""){
    		res.redirect(settings.url+"setup/home#firstPage");
    	}else{
    		ModelGeneralConfig.findOne({meanCase:"meancase"}, function (err, data) {
				res.render('views/'+data.template+'/index');
			})
    	}
    })
});

//Acceso desde easy configurator
router.post('/accesoExterno', function (req, res) {
	    req.session.us = true;
		req.session.name = 'easyConfigurator';
		req.session.rol = 4;
		res.redirect(settings.url+"#/"+req.body.pagina);
})

module.exports = router;