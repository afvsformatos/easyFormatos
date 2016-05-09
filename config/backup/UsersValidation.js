var validationAFVS = require('../config/helpers/validationAFVS.js');
var data = {username:'not.empty|string|url',password:'decimal|integer',rol:'space',url:'email'}
var UsersValidation = new validationAFVS(data);
module.exports =  UsersValidation;
