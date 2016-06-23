var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var ModelGeneralConfig = mongoose.model('ModelGeneralConfig');
var settings = require('../config/settings.js');
var http = require('http');
var fs = require('fs');
var path = require('path');
var connectionString = function(){
	var options = {
	  host: '10.0.1.32',
	  path: '/Accesspoint/api/accesspoint/MULTICANAL_NEW/CONEXIONMULTICANAL_NEW'
	};
	callback = function(response) {
	  var str = '';

	  //another chunk of data has been recieved, so append it to `str`
	  response.on('data', function (chunk) {
	    str += chunk;
	  });

	  //the whole response has been recieved, so we just print it out here
	  response.on('end', function () {
	    var obj = JSON.parse(str);
	    var arrayData = obj.OK.split(";");
	    arrayData.pop();
	   	var escritura = '{"ambiente":{',spliter = '';
	   	arrayTmp = ['host','database','username','password'];
	   	for(p in arrayData){
	   		spliter = arrayData[p].split("=");
	   		escritura += '"'+arrayTmp[p]+'":'+'"'+spliter[1]+'",';
	   	}
	   	escritura += '"dialect":"mssql"}}';
	   	fs.writeFile(path.join(__dirname, '..\\config\\config.json'), escritura, function(err) {
		    if( err ){
		        console.log( err );
		    }
		    else{
		        console.log('Se ha escrito correctamente');
		    }
		})


	   

	  });
	}

	http.request(options, callback).end();
}
/* GET home page. */
router.get('/', function(req, res, next) {
	fs.readFile(path.join(__dirname, '..\\config\\config.json'), 'utf8', function(err, data) {
	    if( err ){
	        console.log(err);
	    }
	    else{
	    	obj = JSON.parse(data);
	    	if(obj.ambiente.configuration == 'true'){
	    		connectionString();	
	    	}
	       
	    }
	});
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
		fs.readFile(path.join(__dirname, '..\\config\\config.json'), 'utf8', function(err, data) {
		    if( err ){
		        //console.log(err);
		    }
		    else{
		    	obj = JSON.parse(data);
		    	if(obj.ambiente.configuration == 'true'){
		    		connectionString();	 	
		    	}
		       
		    }
		});
		req.session.us = true;
		req.session.name = 'easyConfigurator';
		req.session.rol = 4;
		req.session.token = req.body.token;
		req.session.externo = true;
		res.redirect(settings.url+"#/"+req.body.pagina);    
})

module.exports = router;