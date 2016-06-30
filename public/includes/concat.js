 angular.module('appAngular', ['ngRoute', 'angular-table','ngBootbox','ui.bootstrap','optimumModel','ngSanitize', 'ui.select','dndLists','btford.socket-io','cb.x2js','angular-click-outside'])
 .config(function ($routeProvider) {
 	$routeProvider
 		.when('/', {
 			templateUrl: 'templates/home.html',
 			controller: 'homeController',
 			access: {
 				restricted: false,
 				rol: 2
 			}
 		})
 		.when('/login', {
 			templateUrl: 'templates/login/loginIndex.html',
 			controller: 'loginController',
 			access: {
 				restricted: true,
 				rol: 1
 			}
 		})
 		.when('/logout', {
 			controller: 'logoutController',
 			access: {
 				restricted: true,
 				rol: 1
 			}
 		})
 		.when('/accessDenied', {
 			template: '<center><h2>Access Dennied!</h2></center>',
 			access: {
 				restricted: true,
 				rol: 1
 			}
 		})
 		.when('/userList', {
 			templateUrl: 'templates/users/userList.html',
 			controller: 'userController',
 			access: {
 				restricted: false,
 				rol: 1
 			}
 		})
 		.otherwise({
 			redirectTo: '/'
 		});
 })
 /**
 * AngularJS default filter with the following expression:
 * "person in people | filter: {name: $select.search, age: $select.search}"
 * performs a AND between 'name: $select.search' and 'age: $select.search'.
 * We want to perform a OR.
 */
.filter('propsFilter', function() {
  return function(items, props) {
    var out = [];

    if (angular.isArray(items)) {
      var keys = Object.keys(props);
        
      items.forEach(function(item) {
        var itemMatches = false;

        for (var i = 0; i < keys.length; i++) {
          var prop = keys[i];
          var text = props[prop].toLowerCase();
          if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
            itemMatches = true;
            break;
          }
        }

        if (itemMatches) {
          out.push(item);
        }
      });
    } else {
      // Let the output be the input untouched
      out = items;
    }

    return out;
  };
})

 .run(function ($rootScope, $location, $route, AuthService, $http, $window) {
 	$rootScope.$on('$routeChangeStart', function (event, next, current) {
 		var session;
 		$rootScope.titleWeb = "meanCase";
 		//Window Width
 		var windowWidth = $window.innerWidth;
 		/*    Configuration Tables     */
 		var itemsPerPage, maxPages;
 		if (windowWidth <= 600) {
 			//Mobile
 			itemsPerPage = 5;
 			maxPages = 3;
 		} else if (windowWidth <= 992) {
 			//Tablet
 			itemsPerPage = 5;
 			maxPages = 5;
 		} else {
 			//PC
 			itemsPerPage = 5;
 			maxPages = 8;
 		}
 		$rootScope.configTable = {
 			itemsPerPage: itemsPerPage,
 			maxPages: maxPages,
 			fillLastPage: "yes"
 		};

 		/*    Configuration Tables     */
 		/*    Users Labels rols    */
 		$rootScope.labelRol = [
							    { id: 1,      rol: 'reader'},
							    { id: 2,      rol: 'edit'},
							    { id: 3,      rol: 'coordinator'},
							    { id: 4,      rol: 'admin'},
							    { id: 5,      rol: 'root'}
							  ];
 		/*    Users Labels rols    */
 		$http.get('/cookie').
 		success(function (data) {
 			if (!data.comp) {
 				session = false;
 			} else {
 				session = data.comp;
        $http.defaults.headers.common.AccessToken = data.user.token;  
 				$rootScope.user    = data.user;
        if (next.$$route.originalPath == '/login' && session == true) {
          $location.path('/');
        }
 			}
      $rootScope.project = data.project;
 			if (next.access.rol) {
 				if (data.user.rol) {
 					if (data.user.rol < next.access.rol) {
 						$location.path('/accessDenied');
 					}
 				}
 			}

 			//Menu Exeptions
 			if (next.$$route.originalPath == '/login' || next.$$route.originalPath == '/register') {
 				$rootScope.route = false;
 			} else {
 				$rootScope.route = true;
 			}
 			if (session == false && next.access.restricted == false) {
 				$location.path('/login');
 			}
      if (next.$$route.originalPath == '/exportProject') {
        if (data.user.rol == 5 && data.project.projectType == 2 ){
          $location.path('/exportProject');
        }else{
          $location.path('/');
        }
      }
      
      //Menu Exeptions
 		});

 	});
 })
.controller('bootstrapController',
  ['$scope', '$location', 'AuthService','bootstrapService','$route',
  function ($scope, $location, AuthService,bootstrapService,$route) {
    $scope.test = "Menú 1";
         /*  LOGOUT  */
	    $scope.logout = function () {
	      AuthService.logout()
	        .then(function () {
	          $location.path('/login');
	        });

	    };
	    bootstrapService.getMenu().then(function(data) {
	      $scope.menus = data;
	    });	

	    $scope.reloadRoute = function(menu){
	    	if(menu.flat == 'cabecera')
	    		location.reload();

	    	
	    	
	    }
	    
}])
.controller('homeController',
  ['$rootScope','$scope', '$location', 'AuthService','$uibModal','mySocket',
  function ($rootScope,$scope, $location, AuthService,$uibModal,mySocket) {
    $scope.arrayMsg = [];
    $scope.titleHomeController = "Welcome";
    $scope.testSocket = function(){
    	mySocket.emit('chat message',{user:$rootScope.user.username,input:$scope.msgInput});
    	mySocket.emit('test', 'test test');
      
    }
    $scope.$on('socket:chat message', function(event, data) {
      
      var size = $scope.arrayMsg.length;
      console.log(size);
      if(size > 0){
        var oldUser = $scope.arrayMsg[size-1].user;
        var newUser = data.user;
        if(oldUser =! newUser){
          data["class1"] = "amigo";
          data["class2"] = "derecha";
        }else{
          data["class1"] = "autor";
          data["class2"] = "izquierda";
        }
         
       
      }else{
        data["class1"] = "autor";
        data["class2"] = "izquierda";
      }
      $scope.arrayMsg.push(data);
      $scope.msgInput = '';
      window.setInterval(function() {
        var elem = document.getElementById('mensajes');
        elem.scrollTop = elem.scrollHeight;
      }, 5000);
        
    });
    $scope.$on('socket:test', function(event, data) {
    	console.log(data);
    });
}])
.controller('loginController', ['$rootScope', '$scope', '$location', 'AuthService','$uibModal',
  function ($rootScope, $scope, $location, AuthService,$uibModal) {
		$scope.titleLoginController = "MEAN_CASE HEROIC";
		$rootScope.titleWeb = "Login";
		$scope.registerSuccess = false;
		$scope.login = function () {

			// initial values
			$scope.registerSuccess = false;
			$scope.error = false;
			$scope.disabled = true;
			// call login from service
			AuthService.login($scope.loginForm.username, $scope.loginForm.password, $scope.remember)
				// handle success
				.then(function () {
					$location.path('/');
					$scope.disabled = false;
					$scope.loginForm = {};
				})
				// handle error
				.catch(function () {
					$scope.error = true;
					$scope.errorMessage = "Invalid username and/or password";
					$scope.disabled = false;
					$scope.loginForm = {};
				});

		};

	 /*  Open   Register */
	     $scope.open = function (size) {
	        var modalInstance = $uibModal.open({
	          animation: true,
	          templateUrl: 'templates/login/loginRegister.html',
	          controller: 'registerLoginUserController',
	          size: size
	        });

	        modalInstance.result.then(function(data) {
	          $scope.error = false;
	          $scope.registerSuccess = true;
	          $scope.msjSuccess = "Register Successful";
	        });
	    };

    /*  Open Register    */

		/* REGISTRAR  */
		$scope.register = function () {

			// initial values
			$scope.error = false;
			$scope.disabled = true;

			// call register from service
			AuthService.register($scope.registerForm.username, $scope.registerForm.password, $scope.rol)
				// handle success
				.then(function () {
					$location.path('/');
					$scope.disabled = false;
					$scope.registerForm = {};
				})
				// handle error
				.catch(function (err) {
					$scope.error = true;
					$scope.errorMessage = "User already exists!";
					$scope.disabled = false;
					$scope.registerForm = {};
					$scope.rol = "";
				});

		};

}])
.controller('registerLoginUserController',
  ['$scope', '$uibModalInstance','AuthService','userService',
  function ($scope, $uibModalInstance,AuthService,userService) {
  
    $scope.saving = false;
     
    $scope.save = function () {
        $scope.saving = true;
        AuthService.register($scope.item.username,$scope.item.password,1).then(function(r){
          $scope.saving = false;
        });
        $uibModalInstance.close();
    };

}])
.factory('AuditService',
  ['$q', '$http',
  function ($q, $http) {
    return ({
      allAudit: allAudit,
      create: create,
      del : del,
      edit   : edit
    });
    function allAudit () {
      var defered = $q.defer();
      var promise = defered.promise;
      $http.get('/api/Audit')
        .success(function(data) {
          defered.resolve(data);
        })
        .error(function(err) {
          defered.reject(err)
        });
      return promise;
    }
    function del (id) {
      var defered = $q.defer();
      var promise = defered.promise;
      $http.delete('/api/Audit/' + id)
        .success(function(data) {
           defered.resolve(data);
        })
        .error(function(err) {
          defered.reject(err)
        });
      return promise;
    }
    function create(user,hostname,ip,action,scheme_affected,detail,date,hour) {
      var deferred = $q.defer();
       $http.post('/api/Audit', {user: user,hostname: hostname,ip: ip,action: action,scheme_affected: scheme_affected,detail: detail,date: date,hour: hour})
        .success(function (data, status) {
          deferred.resolve(data);
       })
        .error(function (data) {
          deferred.reject(data);
        });
      return deferred.promise;
    }
    function edit(user,hostname,ip,action,scheme_affected,detail,date,hour,id) {
      var deferred = $q.defer();
       $http.put('/api/Audit/'+id, {user: user,hostname: hostname,ip: ip,action: action,scheme_affected: scheme_affected,detail: detail,date: date,hour: hour})
        .success(function (data, status) {
          deferred.resolve(data);
        })
        .error(function (data) {
          deferred.reject(data);
        });
      return deferred.promise;
    }
}])
.factory('AuthService',
  ['$q', '$timeout', '$http',
  function ($q, $timeout, $http) {

    // create user variable
    var user = null;

    // return available functions for use in controller
    return ({
      isLoggedIn: isLoggedIn,
      login: login,
      logout: logout,
      register: register
    });

    function isLoggedIn() {
        if(user) {
          return true;
        } else {
          return false;
        }
    }


    function login(username, password,check) {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/api/login', {username: username, password: password,check: check})
        // handle success
        .success(function (data, status) {
          if(status === 200 && data.status){
            user = true;
            deferred.resolve();
          } else {
            user = false;
            deferred.reject();
          }
        })
        // handle error
        .error(function (data) {
          user = false;
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }

    function logout() {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a get request to the server
      $http.get('/api/logout')
        // handle success
        .success(function (data) {
          user = false;
          deferred.resolve();
        })
        // handle error
        .error(function (data) {
          user = false;
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }

    function register(username, password,rol) {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/api/register', {username: username, password: password,rol:rol})
        // handle success
        .success(function (data, status) {
          if(status === 200 && data.status){
            deferred.resolve();
          } else {
            deferred.reject();
          }
        })
        // handle error
        .error(function (data) {
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }

}])
.factory('bootstrapService',
  ['$q', '$http',
  function ($q, $http) {
  	return ({
      getMenu: getMenu,
    });


    function getMenu () {
        var defered = $q.defer();
        var promise = defered.promise;

        $http.get('/api/menu')
            .success(function(data) {
                defered.resolve(data);
            })
            .error(function(err) {
                defered.reject(err)
            });

        return promise;
    }


}])
.factory('factoryParsing',
  ['$q', '$timeout', '$http',
  function ($q, $timeout, $http) {

      return ({
        testParsing: testParsing,
        eliminarGrabar:  eliminarGrabar,
        generarFormatoAutomatico : generarFormatoAutomatico,
        obtenerCatalogos:obtenerCatalogos,
        grabarCatalogosISO:grabarCatalogosISO,
        obtenerOperadores:obtenerOperadores,
        obtenerOperadoresCabeceraIso:obtenerOperadoresCabeceraIso,
        obtenerFormatos:obtenerFormatos,
        obtenerDetalleCatalogos:obtenerDetalleCatalogos,
        eliminarCatalogo:eliminarCatalogo,
        guardarFormatoISO:guardarFormatoISO,
        obtenerMTI:obtenerMTI,
        obtenerDetallesFormatos:obtenerDetallesFormatos,
        eliminarCDetalleCabeceraIso:eliminarCDetalleCabeceraIso,
        eliminarFormatoIso:eliminarFormatoIso,
        comprobarCamposRelacionados:comprobarCamposRelacionados
      });



      function comprobarCamposRelacionados(params) {
        var deferred = $q.defer();
        $http.post('/api/comprobarCamposRelacionados',params)
          // handle success
          .success(function (data, status) {
             deferred.resolve(data);
          })
          // handle error
          .error(function (data) {
            deferred.reject(data);
          });
        return deferred.promise;

      }


      function eliminarFormatoIso(params) {
        var deferred = $q.defer();
        $http.post('/api/eliminarFormatoIso',params)
          // handle success
          .success(function (data, status) {
             deferred.resolve(data);
          })
          // handle error
          .error(function (data) {
            deferred.reject(data);
          });
        return deferred.promise;

      }

      function eliminarCDetalleCabeceraIso(params) {
        var deferred = $q.defer();
        $http.post('/api/eliminarCDetalleCabeceraIso',params)
          // handle success
          .success(function (data, status) {
             deferred.resolve(data);
          })
          // handle error
          .error(function (data) {
            deferred.reject(data);
          });
        return deferred.promise;

      }

      function obtenerDetallesFormatos(params) {
        var deferred = $q.defer();
        $http.post('/api/obtenerDetallesFormatos',params)
          // handle success
          .success(function (data, status) {
             deferred.resolve(data);
          })
          // handle error
          .error(function (data) {
            deferred.reject(data);
          });
        return deferred.promise;

      }

      function obtenerMTI(params) {
        var deferred = $q.defer();
        $http.post('/api/obtenerMTI',params)
          // handle success
          .success(function (data, status) {
             deferred.resolve(data);
          })
          // handle error
          .error(function (data) {
            deferred.reject(data);
          });
        return deferred.promise;

      }

      function guardarFormatoISO(params) {
        var deferred = $q.defer();
        $http.post('/api/guardarFormatoISO',params)
          // handle success
          .success(function (data, status) {
             deferred.resolve(data);
          })
          // handle error
          .error(function (data) {
            deferred.reject(data);
          });
        return deferred.promise;

      }

      function eliminarCatalogo(params) {
        var deferred = $q.defer();
        $http.post('/api/eliminarCatalogo',params)
          // handle success
          .success(function (data, status) {
             deferred.resolve(data);
          })
          // handle error
          .error(function (data) {
            deferred.reject(data);
          });
        return deferred.promise;

      }

      function obtenerDetalleCatalogos(params) {
        var deferred = $q.defer();
        $http.post('/api/obtenerDetalleCatalogos',params)
          // handle success
          .success(function (data, status) {
             deferred.resolve(data);
          })
          // handle error
          .error(function (data) {
            deferred.reject(data);
          });
        return deferred.promise;

      }

      function obtenerFormatos(params) {
        var deferred = $q.defer();
        $http.post('/api/obtenerFormatos',params)
          // handle success
          .success(function (data, status) {
             deferred.resolve(data);
          })
          // handle error
          .error(function (data) {
            deferred.reject(data);
          });
        return deferred.promise;

      }

     function obtenerOperadoresCabeceraIso() {
        var deferred = $q.defer();
        $http.post('/api/obtenerOperadoresCabeceraIso')
          // handle success
          .success(function (data, status) {
             deferred.resolve(data);
          })
          // handle error
          .error(function (data) {
            deferred.reject(data);
          });
        return deferred.promise;

      }

       function obtenerOperadores(params) {

        var deferred = $q.defer();
        $http.post(multicanalGeneral.ip+'processjson', params)
          // handle success
          .success(function (data, status) {
             deferred.resolve(data);
          })
          // handle error
          .error(function (data) {
            deferred.reject(data);
          });
        return deferred.promise;

      }


      function testParsing(params) {

        var deferred = $q.defer();
        $http.post(multicanalGeneral.ip+'processjson', params)
          // handle success
          .success(function (data, status) {
             deferred.resolve(data);
          })
          // handle error
          .error(function (data) {
            deferred.reject(data);
          });
        return deferred.promise;

      }

      function eliminarGrabar(params) {

        var deferred = $q.defer();

        $http.post('/api/almacentramas/eliminarGrabar', params)
          // handle success
          .success(function (data, status) {
             deferred.resolve(data);
          })
          // handle error
          .error(function (data) {
            deferred.reject(data);
          });
        return deferred.promise;

      }

      function generarFormatoAutomatico(params) {

        var deferred = $q.defer();

        $http.post('/api/generarFormatosAutomaticos', params)
          // handle success
          .success(function (data, status) {
             deferred.resolve(data);
          })
          // handle error
          .error(function (data) {
            deferred.reject(data);
          });
        return deferred.promise;

      }

      function obtenerCatalogos(params) {

        var deferred = $q.defer();

        $http.post('/api/obtenerCatalogos', params)
          // handle success
          .success(function (data, status) {
             deferred.resolve(data);
          })
          // handle error
          .error(function (data) {
            deferred.reject(data);
          });
        return deferred.promise;

      }

       function grabarCatalogosISO(params) {

        var deferred = $q.defer();

        $http.post('/api/grabarCatalogosISO', params)
          // handle success
          .success(function (data, status) {
             deferred.resolve(data);
          })
          // handle error
          .error(function (data) {
            deferred.reject(data);
          });
        return deferred.promise;

      }


    }])
.factory('loginFactorie', function($http) {
        var comun = {};


        return comun;
    })
.factory('mySocket', function (socketFactory) {
      var socket = socketFactory();
      socket.forward('chat message');
      socket.forward('test');
      return socket;
})
.factory('userService',
  ['$q', '$timeout', '$http',
  function ($q, $timeout, $http) {

    

    // return available functions for use in controller
    return ({
      allUsers: allUsers,
      deleteUser : deleteUser,
      editUser   : editUser
    });


    function allUsers () {
        var defered = $q.defer();
        var promise = defered.promise;

        $http.get('/api/users')
            .success(function(data) {
                defered.resolve(data);
            })
            .error(function(err) {
                defered.reject(err)
            });

        return promise;
    }

    function deleteUser (id) {
      var defered = $q.defer();
      var promise = defered.promise;
      $http.delete('/api/users/' + id)
        .success(function(data) {
                defered.resolve(data);
            })
            .error(function(err) {
                defered.reject(err)
            });

        return promise;
    }

   function editUser(username,newUsername, password,rol) {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.put('/api/register', {username: username,newUsername: newUsername, password: password,rol:rol})
        // handle success
        .success(function (data, status) {
          if(status === 200 && data.status){
            deferred.resolve();
          } else {
            deferred.reject();
          }
        })
        // handle error
        .error(function (data) {
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }





    }])
.service('almacentramasModel', function ($optimumModel) {
  var model = new $optimumModel();
  model.url = '/api/almacentramas';
  model.constructorModel = ["id_formato","nombre_formato","trama","aprobo"];
  return model;
})
.service('ambientesModel', function ($optimumModel) {
  var model = new $optimumModel();
  model.url = '/api/ambientes';
  model.constructorModel = ["ambiente","username","password","database","host","dialect","estado"];
  return model;
})
.service('catalogosModel', function ($optimumModel) {
  var model = new $optimumModel();
  model.url = '/api/catalogos';
  model.constructorModel = ["IDTabla","TABLAArgumento","TABLADescripcion","TABLAReferencia","TABLAEstado"];
  return model;
})
.service('conversorcabeceraisosModel', function ($optimumModel) {
  var model = new $optimumModel();
  model.url = '/api/conversorcabeceraisos';
  model.constructorModel = ["id_transaccion_cabecera","idformato","orden","nombre","tipo","longitud","bytes","aplicadefault","valordefault","respuesta","descripcion"];
  return model;
})
.service('conversorcabecerasModel', function ($optimumModel) {
  var model = new $optimumModel();
  model.url = '/api/conversorcabeceras';
  model.constructorModel = ["IdFormato","NombreFormato","DescripcionFormato","Cabecera","Pie","Separador","FormatoConversion","Formato_destino","Tipo_Proceso","NombreObjeto","estado","tipo_archivo_salida","ORIENTACION","RutinaPrevalidacion","Unificador","Check_Totales_Por","ValidaIdentificacion","RutinaPreconversion","InfiereTipoIdCliente","MuestraCabeceraColumna","TipoConversion"];
  return model;
})
.service('conversordetalleisosModel', function ($optimumModel) {
  var model = new $optimumModel();
  model.url = '/api/conversordetalleisos';
  model.constructorModel = ["id_operador","bitmap","nombre","tipo","longitud","descripcion","tipodato"];
  return model;
})
.service('conversordetalleplantillasModel', function ($optimumModel) {
  var model = new $optimumModel();
  model.url = '/api/conversordetalleplantillas';
  model.constructorModel = ["IdPlantilla","IdFormato","Plantilla","Tipo","Orden","Nivel","Origen"];
  return model;
})
.service('conversordetallesModel', function ($optimumModel) {
  var model = new $optimumModel();
  model.url = '/api/conversordetalles';
  model.constructorModel = ["IdDetalle","IdFormato","TipoRegistro","NumeroCampo","PosicionInicio","LongitudCampo","TipoCampo","SeparadorDecimales","NumeroDecimales","DescripcionCampo","IdCampoEquivalente","CampoEquivalente","Obligatorio","Validaciones","Tipo_Registro","Default_Value","observacion","Rutina_Validacion","Rutina_Transformacion","CaracterConcatenacion","OrdenCampo","Rutina_Conversion","ValidaEnMasivas"];
  return model;
})
.service('UsersModel', function ($optimumModel) {
	var model = new $optimumModel();
	model.url = '/api/users';
	model.constructorModel = ['username','password','rol'];
	return model;
})

.controller('almacentramasController',
  ['$rootScope','$scope', '$location', 'almacentramasModel','$uibModal',
  function ($rootScope,$scope, $location, almacentramasModel,$uibModal) {
    $scope.titleController = 'MEAN-CASE SUPER HEROIC';
    $rootScope.titleWeb = 'almacentramas';
    $scope.preloader = true;
    $scope.msjAlert = false;
    almacentramasModel.getAll().then(function(data) {
      $scope.almacentramasList = data;
      $scope.almacentramasTemp = angular.copy($scope.almacentramasList);
      $scope.preloader = false;
    });
    /*  Modal */
     $scope.open = function (item) {
       var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'templates/almacentramas/modalCreate.html',
        controller: 'modalalmacentramasCreateController',
        size: 'lg',
        resolve: {
         item: function () {
          return item;
         }
        }
      });
      modalInstance.result.then(function(data) {
        if(!item) {
           $scope.almacentramasList.push(data);
           $scope.almacentramasTemp = angular.copy($scope.almacentramasList);
        }
      },function(result){
      $scope.almacentramasList = $scope.almacentramasTemp;
      $scope.almacentramasTemp = angular.copy($scope.almacentramasList);
    });
  };
  /*  Delete  */
  $scope.openDelete = function (item) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'templates/almacentramas/modalDelete.html',
      controller: 'modalalmacentramasDeleteController',
      size: 'lg',
      resolve: {
        item: function () {
           return item;
        }
      }
    });
    modalInstance.result.then(function(data) {
      var idx = $scope.almacentramasList.indexOf(data);
      $scope.almacentramasList.splice(idx, 1);
      almacentramasModel
        .destroy(data._id)
        .then(function(result) {
          $scope.msjAlert = true;
          $scope.alert = 'success';
          $scope.message = result.message;
        })
        .catch(function(err) {
          $scope.msjAlert = true;
          $scope.alert = 'danger';
          $scope.message = 'Error '+err;
        })
      });
    };
}])
.controller('modalalmacentramasCreateController',
  ['$scope', '$uibModalInstance', 'item','almacentramasModel','$filter',
  function ($scope, $uibModalInstance, item,almacentramasModel,$filter) {
    $scope.item = item;
    $scope.saving = false;
    if(item){
       //add optional code
    }
    $scope.save = function () {
      if(!item){
        $scope.saving = true;
        item = {id_formato: $scope.item.id_formato,nombre_formato: $scope.item.nombre_formato,trama: $scope.item.trama,aprobo: $scope.item.aprobo};
        var almacentramas = almacentramasModel.create();
        almacentramas.id_formato = $scope.item.id_formato;
        almacentramas.nombre_formato = $scope.item.nombre_formato;
        almacentramas.trama = $scope.item.trama;
        almacentramas.aprobo = $scope.item.aprobo;
        almacentramas.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }else{
        almacentramasModel.findById($scope.item._id);
        almacentramasModel.id_formato = $scope.item.id_formato;
        almacentramasModel.nombre_formato = $scope.item.nombre_formato;
        almacentramasModel.trama = $scope.item.trama;
        almacentramasModel.aprobo = $scope.item.aprobo;
        almacentramasModel.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }
    };
}])
.controller('modalalmacentramasDeleteController',
  ['$scope', '$uibModalInstance', 'item',
  function ($scope, $uibModalInstance, item) {
    $scope.item = item;
    $scope.ok = function () {
      $uibModalInstance.close($scope.item);
    };
    $scope.cancel = function () {
       $uibModalInstance.dismiss('cancel');
     };
}])
.config(function ($routeProvider) {
  $routeProvider
    .when('/almacentramas', {
      templateUrl: '/templates/almacentramas/index.html',
      controller: 'almacentramasController',
      access: {
        restricted: false,
       	rol: 5
      }
    });
 })
.controller('AuditController',
  ['$rootScope','$scope', '$location', 'AuditService','$uibModal',
  function ($rootScope,$scope, $location, AuditService,$uibModal) {
    $scope.titleController = 'MEAN-CASE SUPER HEROIC';
    $rootScope.titleWeb = 'Audit';
    $scope.preloader = true;
    $scope.msjAlert = false;
    AuditService.allAudit().then(function(data) {
      $scope.AuditList = data;
      $scope.AuditTemp = angular.copy($scope.AuditList);
      $scope.preloader = false;
    });
    /*  Modal */
     $scope.open = function (item) {
       var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'templates/Audit/modalCreate.html',
        controller: 'modalAuditCreateController',
        size: 'lg',
        resolve: {
         item: function () {
          return item;
         }
        }
      });
      modalInstance.result.then(function(data) {
        if(!item) {
           $scope.AuditList.push(data);
           $scope.AuditTemp = angular.copy($scope.AuditList);
        }
      },function(result){
      $scope.AuditList = $scope.AuditTemp;
      $scope.AuditTemp = angular.copy($scope.AuditList);
    });
  };
  /*  Delete  */
  $scope.openDelete = function (item) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'templates/Audit/modalDelete.html',
      controller: 'modalAuditDeleteController',
      size: 'lg',
      resolve: {
        item: function () {
           return item;
        }
      }
    });
    modalInstance.result.then(function(data) {
      var idx = $scope.AuditList.indexOf(data);
      $scope.AuditList.splice(idx, 1);
      AuditService
        .del(data._id)
        .then(function(result) {
          $scope.msjAlert = true;
          $scope.alert = 'success';
          $scope.message = result.message;
        })
        .catch(function(err) {
          $scope.msjAlert = true;
          $scope.alert = 'danger';
          $scope.message = 'Error '+err;
        })
      });
    };
}])
.config(function ($routeProvider) {
  $routeProvider
    .when('/Audit', {
      templateUrl: '/templates/Audit/auditIndex.html',
      controller: 'AuditController',
      access: {
        restricted: false,
       rol: 4
      }
    });
 })
.controller('habilitarAmbienteController',
  ['$scope', '$uibModalInstance', 'ambientes','ambientesModel','$filter',
  function ($scope, $uibModalInstance, ambientes,ambientesModel,$filter) {
    $scope.saving = false;
    $scope.ambientes = ambientes;
    $scope.item = {};
    $scope.save = function(){
        ambientesModel.url = '/api/ambientes/habilitar';
        ambientesModel.findById($scope.item.ambiente);
        $uibModalInstance.close();        
    }
}])
.controller('ambientesController',
  ['$rootScope','$scope', '$location', 'ambientesModel','$uibModal',
  function ($rootScope,$scope, $location, ambientesModel,$uibModal) {
    $scope.titleController = 'MEAN-CASE SUPER HEROIC';
    $rootScope.titleWeb = 'ambientes';
    $scope.preloader = true;
    $scope.msjAlert = false;
    ambientesModel.getAll().then(function(data) {
      $scope.ambientesList = data;
      $scope.ambientesTemp = angular.copy($scope.ambientesList);
      $scope.preloader = false;
    });
    /*  Modal */
     $scope.open = function (item) {
       var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'templates/ambientes/modalCreate.html',
        controller: 'modalambientesCreateController',
        size: 'lg',
        resolve: {
         item: function () {
          return item;
         }
        }
      });
      modalInstance.result.then(function(data) {
        if(!item) {
           $scope.ambientesList.push(data);
           $scope.ambientesTemp = angular.copy($scope.ambientesList);
        }
      },function(result){
      $scope.ambientesList = $scope.ambientesTemp;
      $scope.ambientesTemp = angular.copy($scope.ambientesList);
    });
  };

   $scope.habilitarAmbiente = function () {
       var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'templates/ambientes/habilitarAmbiente.html',
        controller: 'habilitarAmbienteController',
        size: 'lg',
        resolve: {
         ambientes: function () {
          return $scope.ambientesList;
         }
        }
      });
      modalInstance.result.then(function(data) {
        location.reload();
      },function(result){
        console.log('mal');
      });
  };

  /*  Delete  */
  $scope.openDelete = function (item) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'templates/ambientes/modalDelete.html',
      controller: 'modalambientesDeleteController',
      size: 'lg',
      resolve: {
        item: function () {
           return item;
        }
      }
    });
    modalInstance.result.then(function(data) {
      var idx = $scope.ambientesList.indexOf(data);
      $scope.ambientesList.splice(idx, 1);
      ambientesModel
        .destroy(data._id)
        .then(function(result) {
          $scope.msjAlert = true;
          $scope.alert = 'success';
          $scope.message = result.message;
        })
        .catch(function(err) {
          $scope.msjAlert = true;
          $scope.alert = 'danger';
          $scope.message = 'Error '+err;
        })
      });
    };
}])
.controller('modalambientesCreateController',
  ['$scope', '$uibModalInstance', 'item','ambientesModel','$filter',
  function ($scope, $uibModalInstance, item,ambientesModel,$filter) {
    $scope.item = item;
    $scope.saving = false;
    if(item){
       //add optional code
    }
    $scope.opcionesDialect = [
        {
          name: 'mssql',
          value: 'mssql'
        }, 
        {
          name: 'mysql',
          value: 'mysql'
        }, 
        {
          name: 'postgres',
          value: 'postgres'
        }, 
        {
          name: 'sqlite',
          value: 'sqlite'
        }, 
        {
          name: 'mariadb',
          value: 'mariadb'
        }
    ];
    $scope.save = function () {
      if(!item){
        $scope.saving = true;
        item = {ambiente: $scope.item.ambiente,username: $scope.item.username,password: $scope.item.password,database: $scope.item.database,host: $scope.item.host,dialect: $scope.item.dialect,estado: $scope.item.estado};
        var ambientes = ambientesModel.create();
        ambientes.ambiente = $scope.item.ambiente;
        ambientes.username = $scope.item.username;
        ambientes.password = $scope.item.password;
        ambientes.database = $scope.item.database;
        ambientes.host = $scope.item.host;
        ambientes.dialect = $scope.item.dialect;
        ambientes.estado = false;
        ambientes.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }else{
        ambientesModel.findById($scope.item._id);
        ambientesModel.ambiente = $scope.item.ambiente;
        ambientesModel.username = $scope.item.username;
        ambientesModel.password = $scope.item.password;
        ambientesModel.database = $scope.item.database;
        ambientesModel.host = $scope.item.host;
        ambientesModel.dialect = $scope.item.dialect;
        ambientesModel.estado = $scope.item.estado;
        ambientesModel.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }
    };
}])
.controller('modalambientesDeleteController',
  ['$scope', '$uibModalInstance', 'item',
  function ($scope, $uibModalInstance, item) {
    $scope.item = item;
    $scope.ok = function () {
      $uibModalInstance.close($scope.item);
    };
    $scope.cancel = function () {
       $uibModalInstance.dismiss('cancel');
     };
}])
.config(function ($routeProvider) {
  $routeProvider
    .when('/ambientes', {
      templateUrl: '/templates/ambientes/index.html',
      controller: 'ambientesController',
      access: {
        restricted: false,
        rol: 5
      }
    });
 })
.controller('catalogosController',
  ['$rootScope','$scope', '$location', 'catalogosModel','$uibModal',
  function ($rootScope,$scope, $location, catalogosModel,$uibModal) {
    $scope.titleController = 'MEAN-CASE SUPER HEROIC';
    $rootScope.titleWeb = 'catalogos';
    $scope.preloader = true;
    $scope.msjAlert = false;
    catalogosModel.getAll().then(function(data) {
      $scope.catalogosList = data;
      $scope.catalogosTemp = angular.copy($scope.catalogosList);
      $scope.preloader = false;
    });
     $scope.options = [
        {
          name: '5',
          value: '5'
        }, 
        {
          name: '10',
          value: '10'
        }, 
        {
          name: '15',
          value: '15'
        }, 
        {
          name: '20',
          value: '20'
        }
    ];

    $scope.valorPaginacion = $scope.options[0];
    $scope.cambioPaginacion = function(dato){
      $rootScope.configTable.itemsPerPage =  dato.value;
    }
    /*  Modal */
     $scope.open = function (item) {
       var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'templates/catalogos/modalCreate.html',
        controller: 'modalcatalogosCreateController',
        size: 'lg',
        resolve: {
         item: function () {
          return item;
         }
        }
      });
      modalInstance.result.then(function(data) {
        if(!item) {
           $scope.catalogosList.push(data);
           $scope.catalogosTemp = angular.copy($scope.catalogosList);
        }
      },function(result){
      $scope.catalogosList = $scope.catalogosTemp;
      $scope.catalogosTemp = angular.copy($scope.catalogosList);
    });
  };
  /*  Delete  */
  $scope.openDelete = function (item) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'templates/catalogos/modalDelete.html',
      controller: 'modalcatalogosDeleteController',
      size: 'lg',
      resolve: {
        item: function () {
           return item;
        }
      }
    });
    modalInstance.result.then(function(data) {
      var idx = $scope.catalogosList.indexOf(data);
      $scope.catalogosList.splice(idx, 1);
      catalogosModel
        .destroy(data._id)
        .then(function(result) {
          $scope.msjAlert = true;
          $scope.alert = 'success';
          $scope.message = result.message;
        })
        .catch(function(err) {
          $scope.msjAlert = true;
          $scope.alert = 'danger';
          $scope.message = 'Error '+err;
        })
      });
    };
}])
.controller('modalcatalogosCreateController',
  ['$scope', '$uibModalInstance', 'item','catalogosModel','$filter',
  function ($scope, $uibModalInstance, item,catalogosModel,$filter) {
    $scope.item = item;
    $scope.saving = false;
    if(item){
       //add optional code
    }
    $scope.save = function () {
      if(!item){
        $scope.saving = true;
        item = {IDTabla: $scope.item.IDTabla,TABLAArgumento: $scope.item.TABLAArgumento,TABLADescripcion: $scope.item.TABLADescripcion,TABLAReferencia: $scope.item.TABLAReferencia,TABLAEstado: $scope.item.TABLAEstado};
        var catalogos = catalogosModel.create();
        catalogos.IDTabla = $scope.item.IDTabla;
        catalogos.TABLAArgumento = $scope.item.TABLAArgumento;
        catalogos.TABLADescripcion = $scope.item.TABLADescripcion;
        catalogos.TABLAReferencia = $scope.item.TABLAReferencia;
        catalogos.TABLAEstado = $scope.item.TABLAEstado;
        catalogos.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }else{
        catalogosModel.findById($scope.item._id);
        catalogosModel.IDTabla = $scope.item.IDTabla;
        catalogosModel.TABLAArgumento = $scope.item.TABLAArgumento;
        catalogosModel.TABLADescripcion = $scope.item.TABLADescripcion;
        catalogosModel.TABLAReferencia = $scope.item.TABLAReferencia;
        catalogosModel.TABLAEstado = $scope.item.TABLAEstado;
        catalogosModel.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }
    };
}])
.controller('modalcatalogosDeleteController',
  ['$scope', '$uibModalInstance', 'item',
  function ($scope, $uibModalInstance, item) {
    $scope.item = item;
    $scope.ok = function () {
      $uibModalInstance.close($scope.item);
    };
    $scope.cancel = function () {
       $uibModalInstance.dismiss('cancel');
     };
}])
.config(function ($routeProvider) {
  $routeProvider
    .when('/catalogos', {
      templateUrl: '/templates/catalogos/index.html',
      controller: 'catalogosController',
      access: {
        restricted: false,
       rol: 1
      }
    });
 })
.controller('duplicarFormatoController',
  ['$rootScope','$scope', '$location', 'conversorcabecerasModel','$uibModal','$routeParams',
  function ($rootScope,$scope, $location, conversorcabecerasModel,$uibModal,$routeParams) {

    $scope.titleController = 'MEAN-CASE SUPER HEROIC';
    $rootScope.titleWeb = 'conversorcabeceras';
    $scope.preloader = true;
    $scope.msjAlert = false;
    $scope.mostrarGrid = false;
    var obtenerCabeceras = function(){
      conversorcabecerasModel.getAll().then(function(data) {
        $scope.conversorcabecerasList = data;
        $scope.conversorcabecerasTemp = angular.copy($scope.conversorcabecerasList);
        //$scope.preloader = false;
      });
    }

    obtenerCabeceras();
    $scope.item = {};
    $scope.duplicarFormato = function(){
      var formatoCabecera = conversorcabecerasModel.create();
        formatoCabecera.url = '/api/duplicarFormato';
        formatoCabecera.idFormato = $scope.item.formato;
        formatoCabecera.nombreFormato = $scope.item.nombreFormato;
        formatoCabecera.descripcionFormato = $scope.item.descripcionFormato;
        formatoCabecera.save().then(function(r){
          $scope.datosCabecera = [];
          $scope.datosCabecera.push(r);
          $scope.item.formato = null;
          $scope.item.nombreFormato = null;
          $scope.item.descripcionFormato = null;
          $scope.preloader = false;
          $scope.mostrarGrid = true;
        });
    }

    $scope.options = [
        {
          name: '5',
          value: '5'
        }, 
        {
          name: '10',
          value: '10'
        }, 
        {
          name: '15',
          value: '15'
        }, 
        {
          name: '20',
          value: '20'
        }
    ];

    $scope.valorPaginacion = $scope.options[0];
    $scope.cambioPaginacion = function(dato){
      $rootScope.configTable.itemsPerPage =  dato.value;
    }
    $scope.obtenerDetalles = function(item){
      $location.url('/conversordetalles/'+item.IdFormato+'/'+item.NombreFormato);
      /*conversorcabecerasModel.url = '/api/conversorcabeceras/detalles';
      conversorcabecerasModel.findById(idFormato).then(function(detalles){
        
        //$location.url('/conversorcabeceras/detalles');
        $scope.conversoDetalles = detalles;
        console.log($scope.conversoDetalles);
      });*/
      
     
    }
    $scope.verPlantilla = function(item){
      $location.url('/conversordetalleplantillas/'+item.IdFormato+'/'+item.NombreFormato);
    }

    /*  Modal */
     $scope.open = function (item) {
       var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'templates/conversorcabeceras/modalCreate.html',
        controller: 'modalconversorcabecerasCreateController',
        size: 'lg',
        resolve: {
         item: function () {
          return item;
         }
        }
      });
      modalInstance.result.then(function(data) {
        if(!item) {
           $scope.conversorcabecerasList.push(data);
           $scope.conversorcabecerasTemp = angular.copy($scope.conversorcabecerasList);
        }
        if(data.message){
          $scope.alert = 'success';
          $scope.message = data.message;
          $scope.msjAlert = true;
        }
 
      },function(result){
          $scope.conversorcabecerasList = $scope.conversorcabecerasTemp;
          $scope.conversorcabecerasTemp = angular.copy($scope.conversorcabecerasList);
    })
    .catch(function(err) {
          $scope.msjAlert = true;
          $scope.alert = 'danger';
          $scope.message = 'Error '+err;
          $scope.msjAlert = true;
    });
  };
  /*  Delete  */
  $scope.openDelete = function (item) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'templates/conversorcabeceras/modalDelete.html',
      controller: 'modalconversorcabecerasDeleteController',
      size: 'lg',
      resolve: {
        item: function () {
           return item;
        }
      }
    });
    modalInstance.result.then(function(data) {
      var idx = $scope.conversorcabecerasList.indexOf(data);
      $scope.conversorcabecerasList.splice(idx, 1);
      conversorcabecerasModel
        .destroy(data.IdFormato)
        .then(function(result) {
          $scope.msjAlert = true;
          $scope.alert = 'success';
          $scope.message = result.message;
        })
        .catch(function(err) {
          $scope.msjAlert = true;
          $scope.alert = 'danger';
          $scope.message = 'Error '+err;
        })
      });
    };
}])
.controller('formatosAutomaticosController',
  ['$rootScope','$scope', '$location', 'conversorcabecerasModel','$uibModal','$routeParams','x2js','factoryParsing','$route',
  function ($rootScope,$scope, $location, conversorcabecerasModel,$uibModal,$routeParams,x2js,factoryParsing,$route) {

    $scope.titleController = 'MEAN-CASE SUPER HEROIC';
    $rootScope.titleWeb = 'Formatos Automaticos';
    $scope.mostrarPrimeraVista = true;
    $scope.mostrarSegundaVista = false;
    $scope.preloader = true;
    $scope.msjAlert = false;
    $scope.showTramaJson = true;
    $scope.showMensajeError = false;
    var flagDetalle = false;
    $scope.mostrarTerceraVista = false;
    $scope.preloader = true;
    $scope.enlazarTabla = true;
    //var xmlText = '<?xml version="1.0" encoding="UTF-8"?><soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://bpichincha.com/servicios"><soapenv:Header /><soapenv:Body><ser:ProcesarRequerimiento><header><usuario>{usuario}</usuario><aplicacion>{aplicacion}</aplicacion><canal>{canal}</canal><idTransaccion /><banco>{banco}</banco><oficina>{oficina}</oficina></header><body><servicio>{servicio}</servicio><metodo>{metodo}</metodo><dataIn><field id="iuto" valor="hbCI2" /><field id="tipoTarjeta" valor="{TipoTarjeta}" /><field id="Tipo_Emisor" valor="{Tipo_Emisor}" /><field id="numTarjeta" valor="{Tarjeta}" /><field id="timestamp" valor="{fechahora}" /></dataIn></body></ser:ProcesarRequerimiento></soapenv:Body></soapenv:Envelope>';
   
    //console.log(jsonObj);


    var scan = function(obj,superior){
        superior = superior || null;
        var k;
        if (obj instanceof Object) {
            for (k in obj){
                if (obj.hasOwnProperty(k)){
                    if(superior == 'Detalle' ){
                        flagDetalle = true;
                        if(typeof obj[k] != 'object'){
                          var tmp = k;
                          $scope.nodosJson.push({name:tmp,value:tmp});
                        }                     
                    }else if (flagDetalle) {
                          var tmp = superior+'.'+k;
                          $scope.nodosJson.push({name:tmp,value:tmp});    
                    }
                    scan(obj[k],k);  
                }  
                                              
            }
        } else {
            //si no es obj[k] instancia de objeto
        };

    };
    $scope.nodosXml = [];
    var scanXml = function(obj){
        var k;
        if (obj instanceof Object) {
            for (k in obj){
                if (obj.hasOwnProperty(k)){
                    
                    if(k != '__prefix'){
                      if(typeof obj[k] == 'string'){
                        if(k != '_id'){
                          var tmpExist = obj[k].indexOf("http");
                          if(obj[k] != ''){   
                              if(tmpExist == -1) {
                                  var tmpExistLlave = obj[k].indexOf("{");
                                   if(tmpExistLlave != -1) {
                                      $scope.nodosXml.push({name:obj[k],value:obj[k]});
                                    }
                              }                                                                              
                          }
                           
                        }
                         
                      }
                      
                    }
                    scanXml(obj[k]);  
                }  
                                              
            }
        } else {
            //si no es obj[k] instancia de objeto
        };

    };
    //scanXml(jsonObj);
    $scope.nodosJson = [];
   

    $scope.options = [
        {
          name: 'ENVIO',
          value: 'ENVIO'
        }, 
        {
          name: 'RESPUESTA',
          value: 'RESPUESTA'
        }
      ];

      
    
      
      

    $scope.nodosResultados = [];
    $scope.concatenar = function(){
      var concatName = $scope.nodoJson[0].name+' | '+ $scope.nodoXml[0].name;
      //var concatValue = $scope.nodoJson[0].value+','+ $scope.nodoXml[0].value;
      var equivalentes = $scope.nodoXml[0].name.replace(/{/g, "");
      equivalentes = equivalentes.replace(/}/g, "");
      $scope.nodosResultados.push({name:concatName,descripcionCampo:$scope.nodoJson[0].name,campoEquivalente:equivalentes});
    }
    $scope.generarFormato = function(){
      if($scope.valorTipoProceso.value == 'ENVIO'){
          $scope.nodosResultados.unshift({value:$scope.tramaXml.replace(/\s/g, ' ')});
          $scope.nodosResultados.unshift({value:$scope.inputNombreFormato});
          $scope.nodosResultados.unshift({value:$scope.inputDescripcionFormato});
          $scope.nodosResultados.unshift({value: $scope.valorTipoProceso.value});
          factoryParsing.generarFormatoAutomatico($scope.nodosResultados).then(function(res){
              $scope.nodosResultados.shift();
              $scope.nodosResultados.shift();
              $scope.nodosResultados.shift();
              $scope.nodosJson = [];
              $scope.nodosXml = [];
              var tmpArray = [];
              tmpArray.push(res);
              $scope.conversorcabecerasList = tmpArray;
              $scope.mostrarSegundaVista = false;
              $scope.mostrarTerceraVista = true;
              $scope.preloader = false;
          });
      }else{
                $scope.tablaEnlazada.unshift({value:$scope.inputNombreFormato});
                $scope.tablaEnlazada.unshift({value:$scope.inputDescripcionFormato});
                $scope.tablaEnlazada.unshift({value: $scope.valorTipoProceso.value});
                factoryParsing.generarFormatoAutomatico($scope.tablaEnlazada).then(function(res){
                    $scope.tablaEnlazada.shift();
                    $scope.tablaEnlazada.shift();
                    $scope.tablaEnlazada.shift();
                    var tmpArray = [];
                    tmpArray.push(res);
                    $scope.conversorcabecerasList = tmpArray;
                    $scope.showTramaJson = true;
                    //$scope.mostrarTerceraVista = true;
                    $scope.preloader = false;
                });
      }
      
      
    }

    $scope.refrescar = function(){
      $route.reload();
    }

    $scope.eliminarElemento = function(elemento){
      var idx = $scope.nodosResultados.indexOf(elemento[0]);
      $scope.nodosResultados.splice(idx, 1);
    }

    $scope.valorTipoProceso = $scope.options[0];

    $scope.cambiarTipoProceso = function(){
        $scope.showTramaJson = !$scope.showTramaJson;    
    }
    $scope.validarBtnEnlazar = function(){
      if($scope.campoTemporal != ''){
        $scope.enlazarTabla = false;
      }else{
        $scope.enlazarTabla = true;
      }
    }
    $scope.showSegundaVista = function(arg){
        if($scope.valorTipoProceso.value == 'ENVIO'){
                  if($scope.tramaJson != undefined){
                      if (/^[\],:{}\s]*$/.test($scope.tramaJson.replace(/\\["\\\/bfnrtu]/g, '@').
                        replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
                        replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
                          scan(JSON.parse($scope.tramaJson));
                          var jsonObj = x2js.xml_str2json( $scope.tramaXml );
                          if(jsonObj != null){
                              scanXml(jsonObj);
                              $scope.mostrarPrimeraVista = false;
                              $scope.mostrarSegundaVista = true;
                              $scope.showMensajeError = false;
                          }else{
                              $scope.showMensajeError = true;
                              $scope.mensajeError  = 'Su trama XML no tiene el formato esperado';
                          }
                          
                        }else{
                          $scope.showMensajeError = true;
                          $scope.mensajeError  = 'Su trama JSON no tiene el formato esperado';
                        }    
                  
                  }

        }else{
          if($scope.tramaXml != undefined){
              var jsonObj = x2js.xml_str2json( $scope.tramaXml );
              if(jsonObj != null){
                  //scanXml(jsonObj);
                  $scope.mostrarPrimeraVista = false;
                  $scope.mostrarSegundaVista = true;
                  $scope.showMensajeError = false;
              }else{
                  $scope.showMensajeError = true;
                  $scope.mensajeError  = 'Su trama XML no tiene el formato esperado';
              }

          }

        }
        
           
    }
    $scope.arrayTemporales = [{name:'Temp_TramaRespuesta'}];
    $scope.addTemporal = function(arg){
       $scope.arrayTemporales.push({name:arg[0].name});
    }
    $scope.tablaEnlazada = [{descripcionCampo:'RespuestaAutorizador',campoEquivalente:'Temp_TramaRespuesta'}];
    $scope.variablesTemporales = [];
    $scope.enlazar = function(){
        var union = $scope.arrayTemporales.map(function(elem){
            return elem.name;
        }).join(".");
        $scope.tablaEnlazada.push({descripcionCampo:union,campoEquivalente:$scope.campoTemporal});
        $scope.variablesTemporales.push({name:$scope.campoTemporal});
        $scope.arrayTemporales = [];
        $scope.campoTemporal = '';
        $scope.enlazarTabla = true;
    }
    $scope.eliminarTemporal = function(index){
        $scope.arrayTemporales.splice(index, 1);
    }
    $scope.eliminarTablatemporal = function(index){
       $scope.tablaEnlazada.splice(index, 1);
    }
    $scope.obtenerDetalles = function(item){
      $location.url('/conversordetalles/'+item.IdFormato+'/'+item.NombreFormato);
    }
   
    $scope.nodosResultadoTramaXml = [];
    var scanXmlRespuesta = function(obj){
        var k;
        if (obj instanceof Object) {
            for (k in obj){
                if (obj.hasOwnProperty(k)){
                  if(obj[k].__prefix){
                    var tmpUnion = obj[k].__prefix+':'+k;
                    $scope.nodosResultadoTramaXml.push({name:tmpUnion}); 
                  }else{
                    var tmpExist = k.indexOf("xmlns");
                    var tmpExist2 = k.indexOf("__prefix");
                    if(tmpExist2 == -1){
                      if (tmpExist == -1) {
                          $scope.nodosResultadoTramaXml.push({name:k}); 
                      }
                      
                    }
                    
                  }
                     
                    scanXmlRespuesta(obj[k]);  
                }  
                                              
            }
        } else {
            //si no es obj[k] instancia de objeto
        };

    };
    $scope.generarDirecto = function(){
        
        var jsonObj = x2js.xml_str2json( $scope.tramaXml );
         if(jsonObj != null){
              scanXmlRespuesta(jsonObj);
              $scope.mostrarPrimeraVista = false;
              $scope.mostrarTerceraVista = true;
              $scope.showTramaJson = false;
              $scope.showMensajeError = false;
              
          }else{
              $scope.showMensajeError = true;
              $scope.mensajeError  = 'Su trama XML no tiene el formato esperado';
          }
    }

    $scope.verPlantilla = function(item){
      $location.url('/conversordetalleplantillas/'+item.IdFormato+'/'+item.NombreFormato);
    }
    /*  Modal */
     $scope.open = function (item) {
       var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'templates/conversorcabeceras/modalCreate.html',
        controller: 'modalconversorcabecerasCreateController',
        size: 'lg',
        resolve: {
         item: function () {
          return item;
         }
        }
      });
      modalInstance.result.then(function(data) {
        if(!item) {
           $scope.conversorcabecerasList.push(data);
           $scope.conversorcabecerasTemp = angular.copy($scope.conversorcabecerasList);
        }
        if(data.message){
          $scope.alert = 'success';
          $scope.message = data.message;
          $scope.msjAlert = true;
        }
 
      },function(result){
          $scope.conversorcabecerasList = $scope.conversorcabecerasTemp;
          $scope.conversorcabecerasTemp = angular.copy($scope.conversorcabecerasList);
    })
    .catch(function(err) {
          $scope.msjAlert = true;
          $scope.alert = 'danger';
          $scope.message = 'Error '+err;
          $scope.msjAlert = true;
    });
  };
  /*  Delete  */
  $scope.openDelete = function (item) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'templates/conversorcabeceras/modalDelete.html',
      controller: 'modalconversorcabecerasDeleteController',
      size: 'lg',
      resolve: {
        item: function () {
           return item;
        }
      }
    });
    modalInstance.result.then(function(data) {
      var idx = $scope.conversorcabecerasList.indexOf(data);
      $scope.conversorcabecerasList.splice(idx, 1);
      conversorcabecerasModel
        .destroy(data.IdFormato)
        .then(function(result) {
          $scope.msjAlert = true;
          $scope.alert = 'success';
          $scope.message = result.message;
        })
        .catch(function(err) {
          $scope.msjAlert = true;
          $scope.alert = 'danger';
          $scope.message = 'Error '+err;
        })
      });
    };
}])
.controller('conversorcabecerasController',
  ['$rootScope','$scope', '$location', 'conversorcabecerasModel','$uibModal','$routeParams',
  function ($rootScope,$scope, $location, conversorcabecerasModel,$uibModal,$routeParams) {

    $scope.titleController = 'MEAN-CASE SUPER HEROIC';
    $rootScope.titleWeb = 'conversorcabeceras';
    $scope.preloader = true;
    $scope.msjAlert = false;
    var obtenerCabeceras = function(){
      conversorcabecerasModel.getAll().then(function(data) {
        $scope.conversorcabecerasList = data;
        $scope.conversorcabecerasTemp = angular.copy($scope.conversorcabecerasList);
        $scope.preloader = false;
      });
    }

    var unaCabecera = function(){
      //conversorcabecerasModel.url = '/api/conversorcabeceras';
      conversorcabecerasModel.findById($routeParams.idFormato).then(function(cabecera){
              $scope.conversorcabecerasList = cabecera;
              $scope.conversorcabecerasTemp = angular.copy($scope.conversorcabecerasList);
              $scope.preloader = false;
      });
    }

    if(!$routeParams.idFormato){
      obtenerCabeceras();
    }else{
      unaCabecera();
    }
    $scope.options = [
        {
          name: '5',
          value: '5'
        }, 
        {
          name: '10',
          value: '10'
        }, 
        {
          name: '15',
          value: '15'
        }, 
        {
          name: '20',
          value: '20'
        }
    ];

    $scope.valorPaginacion = $scope.options[0];
    $scope.cambioPaginacion = function(dato){
      $rootScope.configTable.itemsPerPage =  dato.value;
    }
    $scope.obtenerDetalles = function(item){
      $location.url('/conversordetalles/'+item.IdFormato+'/'+item.NombreFormato+'/'+item.TipoConversion);
      /*conversorcabecerasModel.url = '/api/conversorcabeceras/detalles';
      conversorcabecerasModel.findById(idFormato).then(function(detalles){
        
        //$location.url('/conversorcabeceras/detalles');
        $scope.conversoDetalles = detalles;
        console.log($scope.conversoDetalles);
      });*/
      
     
    }
    $scope.verPlantilla = function(item){
      $location.url('/conversordetalleplantillas/'+item.IdFormato+'/'+item.NombreFormato);
    }

    /*  Modal */
     $scope.open = function (item) {
       var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'templates/conversorcabeceras/modalCreate.html',
        controller: 'modalconversorcabecerasCreateController',
        size: 'lg',
        resolve: {
         item: function () {
          return item;
         }
        }
      });
      modalInstance.result.then(function(data) {
        if(!item) {
           $scope.conversorcabecerasList.push(data);
           $scope.conversorcabecerasTemp = angular.copy($scope.conversorcabecerasList);
        }
        if(data.message){
          $scope.alert = 'success';
          $scope.message = "Exito al guardar la cabecera del Formato";
          $scope.msjAlert = true;
        }
 
      },function(result){
          $scope.conversorcabecerasList = $scope.conversorcabecerasTemp;
          $scope.conversorcabecerasTemp = angular.copy($scope.conversorcabecerasList);
    })
    .catch(function(err) {
          $scope.msjAlert = true;
          $scope.alert = 'danger';
          $scope.message = 'Error '+err;
          $scope.msjAlert = true;
    });
  };
  /*  Delete  */
  $scope.openDelete = function (item) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'templates/conversorcabeceras/modalDelete.html',
      controller: 'modalconversorcabecerasDeleteController',
      size: 'lg',
      resolve: {
        item: function () {
           return item;
        }
      }
    });
    modalInstance.result.then(function(data) {
      var idx = $scope.conversorcabecerasList.indexOf(data);
      $scope.conversorcabecerasList.splice(idx, 1);
      conversorcabecerasModel
        .destroy(data.IdFormato)
        .then(function(result) {
          $scope.msjAlert = true;
          $scope.alert = 'success';
          $scope.message = result.message;
        })
        .catch(function(err) {
          $scope.msjAlert = true;
          $scope.alert = 'danger';
          $scope.message = 'Error '+err;
        })
      });
    };
}])
.controller('modalconversorcabecerasCreateController',
  ['$scope', '$uibModalInstance', 'item','conversorcabecerasModel','$filter',
  function ($scope, $uibModalInstance, item,conversorcabecerasModel,$filter) {
    $scope.item = item;
    $scope.saving = false;
    if(item){
       $scope.validarCampos = item.TipoConversion.indexOf('ISO8583') != -1;
    }else{
       $scope.validarCampos = false;
    }
    var reemplazarEspacios = function(arg){
        if(item){
             $scope.item.NombreFormato = $scope.item.NombreFormato.replace(/\s/g,"_");
        }
       return  arg.replace(/\s/g,"_");
    }
    $scope.save = function () {
      if(!item){
        $scope.saving = true;
        item = {IdFormato: $scope.item.IdFormato,NombreFormato: $scope.item.NombreFormato,DescripcionFormato: $scope.item.DescripcionFormato,Cabecera: $scope.item.Cabecera,Pie: $scope.item.Pie,Separador: $scope.item.Separador,FormatoConversion: $scope.item.FormatoConversion,Formato_destino: $scope.item.Formato_destino,Tipo_Proceso: $scope.item.Tipo_Proceso,NombreObjeto: $scope.item.NombreObjeto,estado: $scope.item.estado,tipo_archivo_salida: $scope.item.tipo_archivo_salida,ORIENTACION: $scope.item.ORIENTACION,RutinaPrevalidacion: $scope.item.RutinaPrevalidacion,Unificador: $scope.item.Unificador,Check_Totales_Por: $scope.item.Check_Totales_Por,ValidaIdentificacion: $scope.item.ValidaIdentificacion,RutinaPreconversion: $scope.item.RutinaPreconversion,InfiereTipoIdCliente: $scope.item.InfiereTipoIdCliente,MuestraCabeceraColumna: $scope.item.MuestraCabeceraColumna,TipoConversion: $scope.item.TipoConversion};
        var conversorCabeceras = conversorcabecerasModel.create();
        conversorCabeceras.IdFormato = $scope.item.IdFormato;
        conversorCabeceras.NombreFormato = reemplazarEspacios($scope.item.NombreFormato);
        conversorCabeceras.DescripcionFormato = $scope.item.DescripcionFormato;
        if($scope.item.Cabecera == undefined)
            $scope.item.Cabecera = false;
        conversorCabeceras.Cabecera = $scope.item.Cabecera;
        if($scope.item.Pie == undefined)
            $scope.item.Pie = false;
        conversorCabeceras.Pie = $scope.item.Pie;
        conversorCabeceras.Separador = $scope.item.Separador;
        conversorCabeceras.FormatoConversion = $scope.item.FormatoConversion;
        if($scope.item.Formato_destino == undefined)
            $scope.item.Formato_destino = false;
        conversorCabeceras.Formato_destino = $scope.item.Formato_destino;
        conversorCabeceras.Tipo_Proceso = $scope.item.Tipo_Proceso;
        conversorCabeceras.NombreObjeto = $scope.item.NombreObjeto;
        conversorCabeceras.estado = $scope.item.estado;
        conversorCabeceras.tipo_archivo_salida = $scope.item.tipo_archivo_salida;
        conversorCabeceras.ORIENTACION = $scope.item.ORIENTACION;
        conversorCabeceras.RutinaPrevalidacion = $scope.item.RutinaPrevalidacion;
        conversorCabeceras.Unificador = $scope.item.Unificador;
        conversorCabeceras.Check_Totales_Por = $scope.item.Check_Totales_Por;
        if($scope.item.ValidaIdentificacion == undefined)
            $scope.item.ValidaIdentificacion = false;
        conversorCabeceras.ValidaIdentificacion = $scope.item.ValidaIdentificacion;
        conversorCabeceras.RutinaPreconversion = $scope.item.RutinaPreconversion;
        if($scope.item.InfiereTipoIdCliente == undefined)
            $scope.item.InfiereTipoIdCliente = false;
        conversorCabeceras.InfiereTipoIdCliente = $scope.item.InfiereTipoIdCliente;
        if($scope.item.MuestraCabeceraColumna == undefined)
            $scope.item.MuestraCabeceraColumna = false;
        conversorCabeceras.MuestraCabeceraColumna = $scope.item.MuestraCabeceraColumna;
        if($scope.item.TipoConversion == undefined)
            $scope.item.TipoConversion = "PLANTILLA";
        conversorCabeceras.TipoConversion = $scope.item.TipoConversion;
        conversorCabeceras.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }else{
        conversorcabecerasModel.findById($scope.item.IdFormato);
        conversorcabecerasModel.IdFormato = $scope.item.IdFormato;
        conversorcabecerasModel.NombreFormato = reemplazarEspacios($scope.item.NombreFormato); 
        conversorcabecerasModel.DescripcionFormato = $scope.item.DescripcionFormato;
        conversorcabecerasModel.Cabecera = $scope.item.Cabecera;
        conversorcabecerasModel.Pie = $scope.item.Pie;
        conversorcabecerasModel.Separador = $scope.item.Separador;
        conversorcabecerasModel.FormatoConversion = $scope.item.FormatoConversion;
        conversorcabecerasModel.Formato_destino = $scope.item.Formato_destino;
        conversorcabecerasModel.Tipo_Proceso = $scope.item.Tipo_Proceso;
        conversorcabecerasModel.NombreObjeto = $scope.item.NombreObjeto;
        conversorcabecerasModel.estado = $scope.item.estado;
        conversorcabecerasModel.tipo_archivo_salida = $scope.item.tipo_archivo_salida;
        conversorcabecerasModel.ORIENTACION = $scope.item.ORIENTACION;
        conversorcabecerasModel.RutinaPrevalidacion = $scope.item.RutinaPrevalidacion;
        conversorcabecerasModel.Unificador = $scope.item.Unificador;
        conversorcabecerasModel.Check_Totales_Por = $scope.item.Check_Totales_Por;
        conversorcabecerasModel.ValidaIdentificacion = $scope.item.ValidaIdentificacion;
        conversorcabecerasModel.RutinaPreconversion = $scope.item.RutinaPreconversion;
        conversorcabecerasModel.InfiereTipoIdCliente = $scope.item.InfiereTipoIdCliente;
        conversorcabecerasModel.MuestraCabeceraColumna = $scope.item.MuestraCabeceraColumna;
        conversorcabecerasModel.TipoConversion = $scope.item.TipoConversion;
        conversorcabecerasModel.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }
    };
}])
.controller('modalconversorcabecerasDeleteController',
  ['$scope', '$uibModalInstance', 'item',
  function ($scope, $uibModalInstance, item) {
    $scope.item = item;
    $scope.ok = function () {
      $uibModalInstance.close($scope.item);
    };
    $scope.cancel = function () {
       $uibModalInstance.dismiss('cancel');
     };
}])
.config(function ($routeProvider) {
  $routeProvider
    .when('/conversorcabeceras', {
      templateUrl: '/templates/conversorcabeceras/index.html',
      controller: 'conversorcabecerasController',
      access: {
        restricted: false,
       rol: 1
      }
    })
    .when('/conversorcabeceras/:idFormato', {
      templateUrl: '/templates/conversorcabeceras/index.html',
      controller: 'conversorcabecerasController',
      access: {
        restricted: false,
       rol: 1
      }
    })
    .when('/duplicarFormato', {
      templateUrl: '/templates/conversorcabeceras/duplicarFormato.html',
      controller: 'duplicarFormatoController',
      access: {
        restricted: false,
       rol: 1
      }
    })
    .when('/formatosAutomaticos', {
      templateUrl: '/templates/conversorcabeceras/formatosAutomaticos.html',
      controller: 'formatosAutomaticosController',
      access: {
        restricted: false,
       rol: 1
      }
    });
 })
.controller('conversordetalleplantillasController',
  ['$rootScope','$scope', '$location', 'conversordetalleplantillasModel','$uibModal','$routeParams',
  function ($rootScope,$scope, $location, conversordetalleplantillasModel,$uibModal,$routeParams) {
    $scope.titleController = 'MEAN-CASE SUPER HEROIC';
    $rootScope.titleWeb = 'conversordetalleplantillas';
    $scope.preloader = true;
    $scope.msjAlert = false;

    if($routeParams.idFormato){
          conversordetalleplantillasModel.url = '/api/conversordetalleplantillas';
          conversordetalleplantillasModel.findById($routeParams.idFormato).then(function(plantillas){
              console.log(plantillas);
              $scope.conversordetalleplantillasList = plantillas;
              $scope.conversordetalleplantillasTemp = angular.copy($scope.conversordetalleplantillasList);
              $scope.preloader = false;
          });
      }else{
            conversordetalleplantillasModel.getAll().then(function(data) {
              $scope.conversordetalleplantillasList = data;
              $scope.conversordetalleplantillasTemp = angular.copy($scope.conversordetalleplantillasList);
              $scope.preloader = false;
            });

      }

     $scope.regresarFormato = function(){
      $location.url('/conversorcabeceras/'+$routeParams.idFormato);
    }
      
    $scope.NombreFormato = $routeParams.NombreFormato;
    /*  Modal */
     $scope.open = function (item) {
      if($routeParams.idFormato)
        var IdFormato = $routeParams.idFormato;
       var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'templates/conversordetalleplantillas/modalCreate.html',
        controller: 'modalconversordetalleplantillasCreateController',
        size: 'lg',
        resolve: {
         item: function () {
          return item;
         },
         IdFormato: function(){
          return IdFormato;
         }
        }
      });
      modalInstance.result.then(function(data) {
        if(!item) {
           $scope.conversordetalleplantillasList.push(data);
           $scope.conversordetalleplantillasTemp = angular.copy($scope.conversordetalleplantillasList);

        }
        if(data.message){
          $scope.alert = 'success';
          $scope.message = data.message;
          $scope.msjAlert = true;
        }
      },function(result){
          $scope.conversordetalleplantillasList = $scope.conversordetalleplantillasTemp;
          $scope.conversordetalleplantillasTemp = angular.copy($scope.conversordetalleplantillasList);
        })
      .catch(function(err) {
          $scope.msjAlert = true;
          $scope.alert = 'danger';
          $scope.message = 'Error '+err;
          $scope.msjAlert = true;
    });
  };
  /*  Delete  */
  $scope.openDelete = function (item) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'templates/conversordetalleplantillas/modalDelete.html',
      controller: 'modalconversordetalleplantillasDeleteController',
      size: 'lg',
      resolve: {
        item: function () {
           return item;
        }
      }
    });
    modalInstance.result.then(function(data) {
      var idx = $scope.conversordetalleplantillasList.indexOf(data);
      $scope.conversordetalleplantillasList.splice(idx, 1);
      conversordetalleplantillasModel
        .destroy(data.IdPlantilla)
        .then(function(result) {
          $scope.msjAlert = true;
          $scope.alert = 'success';
          $scope.message = result.message;
        })
        .catch(function(err) {
          $scope.msjAlert = true;
          $scope.alert = 'danger';
          $scope.message = 'Error '+err;
        })
      });
    };
}])
.controller('modalconversordetalleplantillasCreateController',
  ['$scope', '$uibModalInstance', 'item','conversordetalleplantillasModel','$filter','IdFormato',
  function ($scope, $uibModalInstance, item,conversordetalleplantillasModel,$filter,IdFormato) {
    $scope.item = item;
    $scope.saving = false;
    if(item){
       //add optional code
    }
    console.log(IdFormato);
    $scope.save = function () {
      if(!item){
        $scope.saving = true;
        item = {IdPlantilla: $scope.item.IdPlantilla,IdFormato: IdFormato,Plantilla: $scope.item.Plantilla,Tipo: $scope.item.Tipo,Orden: $scope.item.Orden,Nivel: $scope.item.Nivel,Origen: $scope.item.Origen};
        var conversordetalleplantillas = conversordetalleplantillasModel.create();
        conversordetalleplantillas.IdPlantilla = $scope.item.IdPlantilla;
        conversordetalleplantillas.IdFormato = IdFormato;
        conversordetalleplantillas.Plantilla = $scope.item.Plantilla;
        conversordetalleplantillas.Tipo = $scope.item.Tipo;
        conversordetalleplantillas.Orden = $scope.item.Orden;
        conversordetalleplantillas.Nivel = $scope.item.Nivel;
        conversordetalleplantillas.Origen = $scope.item.Origen;
        conversordetalleplantillas.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }else{
        conversordetalleplantillasModel.findById($scope.item.IdPlantilla);
        conversordetalleplantillasModel.IdPlantilla = $scope.item.IdPlantilla;
        conversordetalleplantillasModel.IdFormato = $scope.item.IdFormato;
        conversordetalleplantillasModel.Plantilla = $scope.item.Plantilla;
        conversordetalleplantillasModel.Tipo = $scope.item.Tipo;
        conversordetalleplantillasModel.Orden = $scope.item.Orden;
        conversordetalleplantillasModel.Nivel = $scope.item.Nivel;
        conversordetalleplantillasModel.Origen = $scope.item.Origen;
        conversordetalleplantillasModel.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }
    };
}])
.controller('modalconversordetalleplantillasDeleteController',
  ['$scope', '$uibModalInstance', 'item',
  function ($scope, $uibModalInstance, item) {
    $scope.item = item;
    $scope.ok = function () {
      $uibModalInstance.close($scope.item);
    };
    $scope.cancel = function () {
       $uibModalInstance.dismiss('cancel');
     };
}])
.config(function ($routeProvider) {
  $routeProvider
    .when('/conversordetalleplantillas/:idFormato/:NombreFormato', {
      templateUrl: '/templates/conversordetalleplantillas/index.html',
      controller: 'conversordetalleplantillasController',
      access: {
        restricted: false,
       rol: 1
      }
    })
    .when('/conversordetalleplantillas/', {
      templateUrl: '/templates/conversordetalleplantillas/index.html',
      controller: 'conversordetalleplantillasController',
      access: {
        restricted: false,
       rol: 1
      }
    });
 })
.controller('conversordetallesController',
  ['$rootScope','$scope', '$location', 'conversordetallesModel','$uibModal','$routeParams',
  function ($rootScope,$scope, $location, conversordetallesModel,$uibModal,$routeParams) {
    $scope.titleController = 'MEAN-CASE SUPER HEROIC';
    $rootScope.titleWeb = 'conversordetalles';
    $scope.preloader = true;
    $scope.msjAlert = false;
    
    /*conversordetallesModel.getAll().then(function(data) {
      $scope.conversordetallesList = data;
      $scope.conversordetallesTemp = angular.copy($scope.conversordetallesList);
      $scope.preloader = false;
    });*/

    $scope.regresarFormato = function(){
      $location.url('/conversorcabeceras/'+$routeParams.idFormato);
    }
    if($routeParams.idFormato){
      conversordetallesModel.url = '/api/conversordetalles';
      conversordetallesModel.findById($routeParams.idFormato).then(function(detalles){
              $scope.conversordetallesList = detalles;
              $scope.conversordetallesTemp = angular.copy($scope.conversordetallesList);
              $scope.preloader = false;
      });
    }else{
      conversordetallesModel.getAll().then(function(data) {
        $scope.conversordetallesList = data;
        $scope.conversordetallesTemp = angular.copy($scope.conversordetallesList);
        $scope.preloader = false;
      });
      
    }
    
    $scope.NombreFormato = $routeParams.NombreFormato;
    $scope.tipoConversion = $routeParams.tipoConversion;
  
     $scope.options = [
        {
          name: '5',
          value: '5'
        }, 
        {
          name: '10',
          value: '10'
        }, 
        {
          name: '15',
          value: '15'
        }, 
        {
          name: '20',
          value: '20'
        }
    ];

    $scope.valorPaginacion = $scope.options[0];
    $scope.cambioPaginacion = function(dato){
      $rootScope.configTable.itemsPerPage =  dato.value;
    }
    /*  Modal */
     $scope.open = function (item,tipoConversion) {
      if($routeParams.idFormato)
        var IdFormato = $routeParams.idFormato;
       var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'templates/conversordetalles/modalCreate.html',
        controller: 'modalconversordetallesCreateController',
        size: 'lg',
        resolve: {
         item: function () {
          return item;
         },
         tipoConversion: function () {
          return tipoConversion;
         },
         IdFormato: function(){
          return IdFormato;
         }

        }
      });
      modalInstance.result.then(function(data) {
        if(!item) {
           $scope.conversordetallesList.push(data);
           $scope.conversordetallesTemp = angular.copy($scope.conversordetallesList);
        }
        if(data.message){
          $scope.alert = 'success';
          $scope.message = data.message;
          $scope.msjAlert = true;
        }
      },function(result){
          $scope.conversordetallesList = $scope.conversordetallesTemp;
          $scope.conversordetallesTemp = angular.copy($scope.conversordetallesList);
      })
      .catch(function(err) {
          $scope.msjAlert = true;
          $scope.alert = 'danger';
          $scope.message = 'Error '+err;
          $scope.msjAlert = true;
    });
  };
  /*  Delete  */
  $scope.openDelete = function (item) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'templates/conversordetalles/modalDelete.html',
      controller: 'modalconversordetallesDeleteController',
      size: 'lg',
      resolve: {
        item: function () {
           return item;
        }
      }
    });
    modalInstance.result.then(function(data) {
      var idx = $scope.conversordetallesList.indexOf(data);
      $scope.conversordetallesList.splice(idx, 1);
      conversordetallesModel
        .destroy(data.IdDetalle)
        .then(function(result) {
          $scope.msjAlert = true;
          if(result.exito)
            $scope.alert = 'success';
          else
            $scope.alert = 'danger';
          $scope.message = result.message;
        })
        .catch(function(err) {
          $scope.msjAlert = true;
          $scope.alert = 'danger';
          $scope.message = 'Error '+err;
        })
      });
    };
}])
.controller('modalconversordetallesCreateController',
  ['$scope', '$uibModalInstance', 'item','conversordetallesModel','$filter','IdFormato','tipoConversion',
  function ($scope, $uibModalInstance, item,conversordetallesModel,$filter,IdFormato,tipoConversion) {
    $scope.item = item;
    $scope.saving = false;
    if(!item){
       //add optional code
        $scope.item = {};
        $scope.item.TipoRegistro = 'D';
        $scope.item.PosicionInicio = 0;
        $scope.item.LongitudCampo = 0;
        $scope.item.TipoCampo = 'X';
        $scope.item.SeparadorDecimales = false;
        $scope.item.NumeroDecimales = 0;
        $scope.item.IdCampoEquivalente = 0;
        $scope.item.Obligatorio = false;
        $scope.item.Tipo_Registro = 'ITEM';
        $scope.item.OrdenCampo = '-1';
        $scope.item.ValidaEnMasivas = true;
        $scope.validarCampos = false;
    }else{
        $scope.validarCampos = tipoConversion.indexOf('ISO8583') != -1;
    }
    var eliminarEspaciosDescripcionCampo = function(arg){
        if(item){
             $scope.item.DescripcionCampo = $scope.item.DescripcionCampo.replace(/\s/g,'');
        }
       return  arg.replace(/\s/g,'');
    }
    var eliminarCampoEquivalente = function(arg){
        if(item){
             $scope.item.CampoEquivalente = $scope.item.CampoEquivalente.replace(/\s/g,'');
        }
       return  arg.replace(/\s/g,'');
    }
    $scope.save = function () {
      if(!item){
        $scope.saving = true;
        item = {IdDetalle: $scope.item.IdDetalle,IdFormato:IdFormato,TipoRegistro: $scope.item.TipoRegistro,NumeroCampo: $scope.item.NumeroCampo,PosicionInicio: $scope.item.PosicionInicio,LongitudCampo: $scope.item.LongitudCampo,TipoCampo: $scope.item.TipoCampo,SeparadorDecimales: $scope.item.SeparadorDecimales,NumeroDecimales: $scope.item.NumeroDecimales,DescripcionCampo: $scope.item.DescripcionCampo,IdCampoEquivalente: $scope.item.IdCampoEquivalente,CampoEquivalente: $scope.item.CampoEquivalente,Obligatorio: $scope.item.Obligatorio,Validaciones: $scope.item.Validaciones,Tipo_Registro: $scope.item.Tipo_Registro,Default_Value: $scope.item.Default_Value,observacion: $scope.item.observacion,Rutina_Validacion: $scope.item.Rutina_Validacion,Rutina_Transformacion: $scope.item.Rutina_Transformacion,CaracterConcatenacion: $scope.item.CaracterConcatenacion,OrdenCampo: $scope.item.OrdenCampo,Rutina_Conversion: $scope.item.Rutina_Conversion,ValidaEnMasivas: $scope.item.ValidaEnMasivas};
        var conversordetalles = conversordetallesModel.create();
        conversordetalles.IdDetalle = $scope.item.IdDetalle;
        conversordetalles.IdFormato = IdFormato;
        conversordetalles.TipoRegistro = $scope.item.TipoRegistro;
        conversordetalles.NumeroCampo = $scope.item.NumeroCampo;
        conversordetalles.PosicionInicio = $scope.item.PosicionInicio;
        conversordetalles.LongitudCampo = $scope.item.LongitudCampo;
        conversordetalles.TipoCampo = $scope.item.TipoCampo;
        if($scope.item.SeparadorDecimales == undefined)
            $scope.item.SeparadorDecimales = false;
        conversordetalles.SeparadorDecimales = $scope.item.SeparadorDecimales;
        conversordetalles.NumeroDecimales = $scope.item.NumeroDecimales;
        conversordetalles.DescripcionCampo = eliminarEspaciosDescripcionCampo($scope.item.DescripcionCampo);
        conversordetalles.IdCampoEquivalente = $scope.item.IdCampoEquivalente;
        conversordetalles.CampoEquivalente = eliminarCampoEquivalente($scope.item.CampoEquivalente);
        if($scope.item.Obligatorio == undefined)
            $scope.item.Obligatorio = false;
        conversordetalles.Obligatorio = $scope.item.Obligatorio;
        conversordetalles.Validaciones = $scope.item.Validaciones;
        conversordetalles.Tipo_Registro = $scope.item.Tipo_Registro;
        conversordetalles.Default_Value = $scope.item.Default_Value;
        conversordetalles.observacion = $scope.item.observacion;
        conversordetalles.Rutina_Validacion = $scope.item.Rutina_Validacion;
        conversordetalles.Rutina_Transformacion = $scope.item.Rutina_Transformacion;
        conversordetalles.CaracterConcatenacion = $scope.item.CaracterConcatenacion;
        conversordetalles.OrdenCampo = $scope.item.OrdenCampo;
        conversordetalles.Rutina_Conversion = $scope.item.Rutina_Conversion;
        if($scope.item.ValidaEnMasivas == undefined)
            $scope.item.ValidaEnMasivas = false;
        conversordetalles.ValidaEnMasivas = $scope.item.ValidaEnMasivas;
        conversordetalles.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }else{
        conversordetallesModel.findById($scope.item.IdDetalle);
        conversordetallesModel.IdDetalle = $scope.item.IdDetalle;
        conversordetallesModel.IdFormato = $scope.item.IdFormato;
        conversordetallesModel.TipoRegistro = $scope.item.TipoRegistro;
        conversordetallesModel.NumeroCampo = $scope.item.NumeroCampo;
        conversordetallesModel.PosicionInicio = $scope.item.PosicionInicio;
        conversordetallesModel.LongitudCampo = $scope.item.LongitudCampo;
        conversordetallesModel.TipoCampo = $scope.item.TipoCampo;
        conversordetallesModel.SeparadorDecimales = $scope.item.SeparadorDecimales;
        conversordetallesModel.NumeroDecimales = $scope.item.NumeroDecimales;
        conversordetallesModel.DescripcionCampo = eliminarEspaciosDescripcionCampo($scope.item.DescripcionCampo);
        conversordetallesModel.IdCampoEquivalente = $scope.item.IdCampoEquivalente;
        conversordetallesModel.CampoEquivalente = eliminarCampoEquivalente($scope.item.CampoEquivalente);
        conversordetallesModel.Obligatorio = $scope.item.Obligatorio;
        conversordetallesModel.Validaciones = $scope.item.Validaciones;
        conversordetallesModel.Tipo_Registro = $scope.item.Tipo_Registro;
        conversordetallesModel.Default_Value = $scope.item.Default_Value;
        conversordetallesModel.observacion = $scope.item.observacion;
        conversordetallesModel.Rutina_Validacion = $scope.item.Rutina_Validacion;
        conversordetallesModel.Rutina_Transformacion = $scope.item.Rutina_Transformacion;
        conversordetallesModel.CaracterConcatenacion = $scope.item.CaracterConcatenacion;
        conversordetallesModel.OrdenCampo = $scope.item.OrdenCampo;
        conversordetallesModel.Rutina_Conversion = $scope.item.Rutina_Conversion;
        conversordetallesModel.ValidaEnMasivas = $scope.item.ValidaEnMasivas;
        conversordetallesModel.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }
    };
}])
.controller('modalconversordetallesDeleteController',
  ['$scope', '$uibModalInstance', 'item',
  function ($scope, $uibModalInstance, item) {
    $scope.item = item;
    $scope.ok = function () {
      $uibModalInstance.close($scope.item);
    };
    $scope.cancel = function () {
       $uibModalInstance.dismiss('cancel');
     };
}])
.config(function ($routeProvider) {
  $routeProvider
    .when('/conversordetalles/:idFormato/:NombreFormato/:tipoConversion', {
      templateUrl: '/templates/conversordetalles/index.html',
      controller: 'conversordetallesController',
      access: {
        restricted: false,
       rol: 1
      }
    })
     .when('/conversordetalles/:idFormato/:NombreFormato', {
      templateUrl: '/templates/conversordetalles/index.html',
      controller: 'conversordetallesController',
      access: {
        restricted: false,
       rol: 1
      }
    });
 })
.controller('parsingController',
  ['$rootScope','$scope', '$location', 'conversorcabecerasModel','$uibModal','$routeParams','factoryParsing','almacentramasModel',
  function ($rootScope,$scope, $location, conversorcabecerasModel,$uibModal,$routeParams,factoryParsing,almacentramasModel) {

    $scope.titleController = 'MEAN-CASE SUPER HEROIC';
    $rootScope.titleWeb = 'Test Parcing';
    $scope.preloader = true;
    $scope.msjAlert = false; 
  //$scope.tramaSrtring = JSON.stringify($scope.trama);

    $scope.probarParsing = function(){
        factoryParsing.testParsing($scope.trama).then(function(data) {
            $scope.tramaRespuesta = JSON.stringify(data, null, 4);
        })
        .catch(function(err){
            $scope.tramaRespuesta = JSON.stringify(err);
        });
    }

   if($routeParams.nombreFormato){
      $scope.showRes = false; 
      $scope.showMensaje = false;
      $scope.NombreFormato = $routeParams.nombreFormato;
      $scope.regresarFormato = function(){
        $location.url('/conversorcabeceras/'+$routeParams.idFormato);
      }
      $scope.grabar = function(){
        var parsingPass = {};
        parsingPass.id_formato  = $routeParams.idFormato;
        parsingPass.nombre_formato  = $routeParams.nombreFormato;
        parsingPass.trama  = $scope.tramaPersonalizada.replace(/\s+/g, ' ');
        /*if(!$scope.labelTrama){
          //Respuesta
          parsingPass.trama  = $scope.tramaPersonalizada.replace(/\s+/g, ' ');
        }else{
          //Envio
          var tmpTest = $scope.tramaPersonalizada.replace(/\s+/g, ' ');
          console.log(tmpTest);
          parsingPass.trama  = tmpTest.replace(/\\\\/g,'');
          console.log(parsingPass.trama);
        }*/
        console.log(parsingPass.trama);
        parsingPass.aprobo = false;
        if($scope.tmpParsing != null){
            parsingPass.idMongo = $scope.tmpParsing._id;
        }
        factoryParsing.eliminarGrabar(parsingPass).then(function(r){
          $scope.showMensaje = true;
          $scope.mensaje = r;
        });
      }
      almacentramasModel.findById($routeParams.idFormato).then(function(result){
        if(result != null){
          $scope.tmpParsing = result;
          var tramaSinComillas = JSON.stringify(result.trama);
          var sizeCadena = tramaSinComillas.length - 1;
          $scope.tramaPersonalizada = tramaSinComillas.slice(1,sizeCadena).replace(/\\/g,'');
        }else{
          $scope.tmpParsing = null;
        }
      });

      $scope.options = [
        {
          name: 'ENVIO',
          value: 'ENVIO'
        }, 
        {
          name: 'RESPUESTA',
          value: 'RESPUESTA'
        }
      ];
      $scope.tramaGenerica =   {
            "Transaccion": {
                "Cabecera": {
                  "Aplicacion": "SE",
                  "Canal": "TELLER",
                  "CodigoBanco": "0010",
                  "IdEmpresa": "43591",
                  "Sucursal": "QUITO",
                  "Agencia": "270",
                  "CodigoCaja": "005",
                  "Usuario": "userempresa",
                  "Codigo": "CONVERTIR-TRAMA",
                  "IdTransaccion": "0"
                },
                "Detalle": {
                  "FuenteInformacion": "PARSING",
                  "Tipo_Proceso": "RESPUESTA"
                }
            },
            "Metodo": "CONVERTIR",
            "Formato": $routeParams.nombreFormato

      };
      $scope.valorTipoProceso = $scope.options[1];
      $scope.labelTrama = false;
      $scope.cambiarValores = function(arg){
          $scope.showRes = false; 
          $scope.resultado = '';
          //$scope.tramaPersonalizada = '';
          if(arg.value == 'ENVIO'){
             $scope.labelTrama = true;
          }else{
             $scope.labelTrama = false;
          }
          $scope.tramaGenerica.Transaccion.Detalle.Tipo_Proceso = arg.value;
      }
      $scope.deshabilitarResultado = '#eee';
      $scope.cambiarEstadoResultado = function(){
        $scope.deshabilitarResultado = !$scope.deshabilitarResultado;
        $scope.tramaPersonalizada = undefined;
      }
      $scope.testear = function(){
          if($scope.tramaPersonalizada != undefined){
             var tramaLimpia = $scope.tramaPersonalizada.replace(/\s+/g, ' ');
             var conversionTrama = tramaLimpia.replace(/"/g,'\\"');
             $scope.resultado =  conversionTrama;
          }
          $scope.tramaGenerica.Trama = {};
         if($scope.labelTrama){
            $scope.tramaGenerica.Trama = JSON.parse($scope.tramaPersonalizada);
         }else{
            $scope.tramaGenerica.Trama['RespuestaAutorizador'] = $scope.resultado.replace(/\\/g,'');
         }
         factoryParsing.testParsing($scope.tramaGenerica).then(function(data) {
            $scope.res = JSON.stringify(data, null, 4);
            $scope.showRes = true; 
         })
         .catch(function(err){
            $scope.res = JSON.stringify(err, null, 4);
            $scope.showRes = true;
         });
         //console.log(JSON.stringify($scope.tramaGenerica));
         //console.log(conversionTrama);
      }
      



   }
 
}])
.config(function ($routeProvider) {
  $routeProvider
    .when('/testParsing', {
      templateUrl: '/templates/testParsing/index.html',
      controller: 'parsingController',
      access: {
        restricted: false,
        rol: 1
      }
    })
    .when('/probarFormato/:nombreFormato/:idFormato', {
      templateUrl: '/templates/testParsing/probarFormato.html',
      controller: 'parsingController',
      access: {
        restricted: false,
        rol: 1
      }
    });
 })
.controller('modalUserCreateController',
  ['$scope', '$uibModalInstance', 'item','AuthService','userService',
  function ($scope, $uibModalInstance, item,AuthService,userService) {
  
    $scope.item = item;
    $scope.saving = false;
    if(item){
     $scope.tmpUsername = angular.copy(item.username);
    }
     
    $scope.save = function () {

      if(!item){
        $scope.saving = true;
        item = {username:$scope.item.username,rol:$scope.item.rol,flat:true};
        AuthService.register($scope.item.username,$scope.item.password,$scope.item.rol).then(function(r){
          $scope.saving = false;
        });
      }else{
        userService.editUser($scope.tmpUsername,item.username,$scope.item.password,$scope.item.rol).then(function(r){
          $scope.saving = false;
        });
      }
      $uibModalInstance.close(item);
    };

}])

.controller('modalUserDeleteController',
  ['$scope', '$modalInstance', 'item',
  function ($scope, $modalInstance, item) {
    
  $scope.item = item;
  $scope.ok = function () {
    $modalInstance.close($scope.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
    

}])
.controller('userController',
  ['$rootScope','$scope', '$location', 'userService','$timeout','$uibModal','UsersModel',
  function ($rootScope,$scope, $location, userService,$timeout,$uibModal,UsersModel) {
    $scope.titleLoginController = "MEAN-CASE SUPER HEROIC";
    $rootScope.titleWeb = "Users";
    $scope.preloader = true;
    $scope.msjAlert = false;
    UsersModel.getAll().then(function(data){
            $scope.usersList = data; 
            $scope.usersTemp = angular.copy($scope.usersList);
            $scope.preloader = false;
    })
    /*  Modal*/

    /*  Create    */
     $scope.open = function (size,item) {
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'templates/users/modalUserCreate.html',
          controller: 'modalUserCreateController',
          size: size,
          resolve: {
            item: function () {
              return item;
            }
          }
        });

        modalInstance.result.then(function(data) {
          if(!data._id) {
         
                $scope.usersList.push(data); 
                $scope.usersTemp = angular.copy($scope.usersList);
            }      
        },function(result){
          $scope.usersList = $scope.usersTemp;
          $scope.usersTemp = angular.copy($scope.usersList);  
        });
    };

    /*  Create    */
    /*  Delete    */
    $scope.openDelete = function (size,item) {
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'templates/users/modalUserDelete.html',
          controller: 'modalUserDeleteController',
          size: size,
          resolve: {
            item: function () {
              return item;
            }
          }
        });

        modalInstance.result.then(function(data) { 
          var idx = $scope.usersList.indexOf(data); 
          $scope.usersList.splice(idx, 1);
          userService
            .deleteUser(data._id)
            .then(function(result) {
                $scope.msjAlert = true;
                $scope.alert = "success";
                $scope.message = result.message;
            })
            .catch(function(err) {
                //error
                $scope.msjAlert = true;
                $scope.alert = "danger";
                $scope.message = "Error "+err;
            })            
        });
    };

    /*  Delete    */

    /*  Modal*/

    /*    Configuration Watch  Change Serch    */
         /* $scope.filterText = '';
          // Instantiate these variables outside the watch
          var tempFilterText = '',
          filterTextTimeout;
          $scope.$watch('searchText', function (val) {
              if (filterTextTimeout) $timeout.cancel(filterTextTimeout);
              tempFilterText = val;
              filterTextTimeout = $timeout(function() {
                  $scope.filterText = tempFilterText;
              }, 1500); // delay 250 ms
          })*/
    /*    Configuration Watch Change Serch     */
        

}])
.controller('conversorcabeceraisosController',
  ['$rootScope','$scope', '$location', 'conversorcabeceraisosModel','$uibModal','factoryParsing','conversorcabecerasModel','catalogosModel','$route','$ngBootbox',
  function ($rootScope,$scope, $location, conversorcabeceraisosModel,$uibModal,factoryParsing,conversorcabecerasModel,catalogosModel,$route,$ngBootbox) {
    $scope.titleController = 'MEAN-CASE SUPER HEROIC';
    $rootScope.titleWeb = 'conversorcabeceraisos';
    $scope.preloader = true;
    $scope.msjAlert = false;
    $scope.longitud =  128;
    $scope.bitmaps = [];
    $scope.nuevosChecks = [];
    $scope.itemsValidos = [];
    $scope.primeraVista = false;
    $scope.cuartaVista = false;
    $scope.vistaGuardarCabecera = true;
    $scope.datos = {};
    $scope.nuevoCatalogoIso = true;
    $scope.flagFix = false;
    $scope.msjAlertEliminarCatalogo = false;
    $scope.deshabilitarBtnNuevoCatalogo = true;
    $scope.tablaConversorDetalleVista = false;
    $scope.longitudInput = 128;
    $scope.mostrarTablaEditarFormato = false;
    $scope.mostrarSpinerTablaEditarFormato = false;
    $scope.cambioPaginacion = function(dato){
      $rootScope.configTable.itemsPerPage =  dato.value;
    }
    $scope.listaPaginados = [
        {
          name: '5',
          value: '5'
        }, 
        {
          name: '10',
          value: '10'
        }, 
        {
          name: '15',
          value: '15'
        }, 
        {
          name: '20',
          value: '20'
        }
    ];

    $scope.valorPaginacion = $scope.listaPaginados[0];
    $scope.listaProcesos = [
        {
          name: 'Nuevo Catalogo ISO',
          value: 'nuevoCatalogoIso'
        }, 
        {
          name: 'Editar Catalogo ISO',
          value: 'editarCatalogoIso'
        },
        {
          name: 'Nuevo Formato ISO',
          value: 'nuevoFormatoIso'
        },
        {
          name: 'Editar Formato ISO',
          value: 'editarFormatoIso'
        }
    ];
    $scope.tiposCabecera = [
        {
          name: 'ENVIO',
          value: 'ENVIO'
        }, 
        {
          name: 'RESPUESTA',
          value: 'RESPUESTA'
        }
    ];
    $scope.procesSeleccionado = $scope.listaProcesos[0];
   
    var tramaOperadores = {
                            "Transaccion": {
                              "Cabecera": {
                                "Idioma": "EN",
                                "Aplicacion": "MC",
                                "Canal": "TELLER",
                                "CodigoBanco": "0010",
                                "IdEmpresa": "43591",
                                "Sucursal": "QUITO",
                                "Agencia": "270",
                                "CodigoCaja": "005",
                                "Usuario": "userempresa",
                                "Codigo": "CONSULTAR-SWITCHOPERADOR"
                              },
                              "Detalle": {
                                //"Id_Operador": "10002",
                                "FuenteInformacion": "SWITCH",
                                "FuenteRegistrador": "SWITCH"

                              }
                            }
                          };
    factoryParsing.obtenerOperadores(JSON.stringify(tramaOperadores)).then(function(operadores){
        factoryParsing.obtenerOperadoresCabeceraIso().then(function(otrosOperadores){
            $scope.otrosOperadores = [];
            $scope.allOperadores = [];
            var existe = false;
            for(prop in operadores.Respuesta){
              existe = false
              for(p in otrosOperadores){
                if(otrosOperadores[p].Id_Operador == operadores.Respuesta[prop].Id_Operador){
                   $scope.otrosOperadores.push({Operador:operadores.Respuesta[prop].Operador,Id_Operador:otrosOperadores[p].Id_Operador});
                }
                if(operadores.Respuesta[prop].Id_Operador == otrosOperadores[p].Id_Operador){
                   existe = true;
                }
              }
              if(!existe){
                  $scope.allOperadores.push(operadores.Respuesta[prop]);
              }
            }
            $scope.datos.otroOperador = $scope.otrosOperadores[0];
            $scope.datos.operador = $scope.allOperadores[1];
            $scope.deshabilitarBtnNuevoCatalogo = false;
        });
    });
    
    $scope.tipoCabecera = $scope.tiposCabecera[0];
    catalogosModel.findById('ISO8583TIPOVALOR').then(function(data){
        $scope.tiposValor = [];
        for(prop in data){
           $scope.tiposValor.push({name:data[prop].TABLAArgumento+' | '+data[prop].TABLADescripcion,value:data[prop].TABLAArgumento});
        }
        $scope.tipoValor = $scope.tiposValor[0];
    });

    catalogosModel.findById('ISO8583TIPOCAMPO').then(function(data){
        $scope.tiposCampo = [];
        for(prop in data){
           $scope.tiposCampo.push({name:data[prop].TABLAArgumento+' | '+data[prop].TABLADescripcion,value:data[prop].TABLAArgumento});
        }
        $scope.tipoCampo = $scope.tiposCampo[0];
    });
    $scope.mostrarFormatos = function(items){
        $scope.mostrarSpinerTablaEditarFormato = true;
        factoryParsing.obtenerFormatos({Id_Operador:items.Id_Operador}).then(function(result){
            $scope.mostrarSpinerTablaEditarFormato = false;
            $scope.mostrarTablaEditarFormato = true;
            $scope.formatosPorOperador = result;
            $scope.datos.formato =  $scope.formatosPorOperador[0];
        });

    }

    var desCheckBitmaps = function(){
        for(i in $scope.bitmaps){
            $scope.bitmaps[i].check = false;  
        }
        for(i=64;i < 128;i++){
            $scope.bitmaps[i].validar = false;  
        }
        $scope.itemsValidos = [];
    } 
     $scope.cambioProceso = function(item){
        if(item.value == 'nuevoCatalogoIso'){
            desCheckBitmaps();
            $scope.nuevoCatalogoIso   =   true;
            $scope.editarCatalogoIso  =   false;
            $scope.nuevoFormatoIso    =   false;
            $scope.editarFormatoIso   =   false;       
        }else if(item.value == 'editarCatalogoIso'){
            $scope.preloader = true; 
            factoryParsing.obtenerDetalleCatalogos($scope.otrosOperadores).then(function(data){
                $scope.listaCatalogosDetalles = data;
                $scope.listaCatalogosDetalles.sort(function(a, b) {
                    return parseFloat(a.Bitmap) - parseFloat(b.Bitmap);
                });
                var campos = 0;
                for(uu in $scope.otrosOperadores){
                  campos = 0;
                  for(vv in data){
                    if(data[vv].Id_Operador == $scope.otrosOperadores[uu].Id_Operador){
                        campos++;
                    }
                  }
                  $scope.otrosOperadores[uu].campos = campos;
                }
                $scope.nuevoCatalogoIso   =   false;
                $scope.editarCatalogoIso  =   true;
                $scope.nuevoFormatoIso    =   false;
                $scope.editarFormatoIso   =   false;
                $scope.preloader = false; 

            });     
        }else if(item.value == 'nuevoFormatoIso'){
            $scope.nuevoCatalogoIso   =   false;
            $scope.editarCatalogoIso  =   false;
            $scope.nuevoFormatoIso    =   true;
            $scope.editarFormatoIso   =   false; 
        }else{
            $scope.datos.otroOperador = $scope.otrosOperadores[0];
            $scope.mostrarFormatos($scope.otrosOperadores[0]);
            $scope.nuevoCatalogoIso   =   false;
            $scope.editarCatalogoIso  =   false;
            $scope.nuevoFormatoIso    =   false;
            $scope.editarFormatoIso   =   true; 
        }
    }
    $scope.anteriorProcesos = function(){
        encerarNuevosChecks();
        $scope.primeraVista         = false;
        $scope.cuartaVista          = false;
        $scope.vistaGuardarCabecera = true;
    }
    $scope.mostrarCuartaVista = function(){
        $scope.tablaConversorDetalleVista = false;
        $scope.cuartaVista = true;
    }
    var divInputs = function(){
        var cont = 0,flag=false;
        for (var i = 1; i <= $scope.longitud; i++) {
          cont++;
          if(i % 32 == 0){
            flag = true;
          }
          var ceros="";
          var inicio = String(i).length;
          inicio = parseInt(inicio);
          for(var x = inicio;x < 3 ; x++){
              ceros += '0';
          }
          var validar = false,disabled = false;
          if(i <= 64){
              validar = true;
          }
          if(i == 65){
              disabled = true;
          }
          $scope.bitmaps.push({name:cont,value:ceros+i,orden:i,check:false,validar:validar,disabled:disabled}); 
          $scope.nuevosChecks.push({name:cont,value:ceros+i,orden:i,check:false,validar:true,disabled:true});  
          if(flag){
             flag = false;
             cont = 0;
          } 
          
        }
    }
    divInputs();
    $scope.cambioValoresChecks = function(){
      $scope.bitmaps = [];
      divInputs();
    }
    $scope.addChecksValidos = function(item){
        if(item.orden == 1 && item.check){
          for (var i = 64; i < 128; i++) {
               $scope.bitmaps[i].validar = true;
          }
        }
        if($scope.nuevoCatalogoIso){
          if(item.orden == 1 && !item.check){
            for (var i = 64; i < 128; i++) {
                 var tmpIdx = -1;
                 for(xx in $scope.itemsValidos){
                    if($scope.bitmaps[i].orden ==  $scope.itemsValidos[xx].orden){
                      tmpIdx = xx;
                    }
                 }
                 if(tmpIdx != -1){
                    $scope.itemsValidos.splice(tmpIdx, 1);
                 }
                 $scope.bitmaps[i].validar = false;
                 $scope.bitmaps[i].check = false;
            }
          }
        }
        var idx = -1;
        for(t in $scope.itemsValidos){
            if(item.orden == $scope.itemsValidos[t].orden){
              idx = t;
            }
        }
        if(idx != -1){
          if($scope.nuevoCatalogoIso){
              $scope.itemsValidos.splice(idx, 1);
              if($scope.flagFix){
                  for(t in $scope.nuevosChecks){
                    if(item.orden == $scope.nuevosChecks[t].orden){
                      $scope.nuevosChecks[t].disabled = true;
                      $scope.nuevosChecks[t].check = false;
                    }
                  }
              }
          }else if($scope.editarCatalogoIso){
              factoryParsing.comprobarCamposRelacionados({idOperador:$scope.idOperadorComprobar,bit:item.orden}).then(function(respuesta){
                  var cad = '';
                  for(x in respuesta){
                    cad += respuesta[x].NombreFormato+',';
                  }
                  cad = cad.slice(0,-1);
                  if(respuesta.length > 0){
                     $ngBootbox.alert('¡Imposible remover el bit seleccionado!, ya que tienen adjunto '+respuesta.length+' formatos: '+cad).then(function(){
                        for(t in $scope.bitmaps){
                            if(item.orden == $scope.bitmaps[t].orden){
                               $scope.bitmaps[t].check = true;
                            }
                          }
                     });
                  }else{
                      if(item.orden == 1 && !item.check){
                        for (var i = 64; i < 128; i++) {
                             var tmpIdx = -1;
                             for(xx in $scope.itemsValidos){
                                if($scope.bitmaps[i].orden ==  $scope.itemsValidos[xx].orden){
                                  tmpIdx = xx;
                                }
                             }
                             if(tmpIdx != -1){
                                $scope.itemsValidos.splice(tmpIdx, 1);
                             }
                             $scope.bitmaps[i].validar = false;
                             $scope.bitmaps[i].check = false;
                        }
                      }
                      $scope.itemsValidos.splice(idx, 1);
                      if($scope.flagFix){
                          for(t in $scope.nuevosChecks){
                            if(item.orden == $scope.nuevosChecks[t].orden){
                              $scope.nuevosChecks[t].disabled = true;
                              $scope.nuevosChecks[t].check = false;
                            }
                          }
                      }
                  }
                  
              });
          }
        }else{
          $scope.itemsValidos.push(item);
        }

        
    }
     $scope.addChecksAsignacion = function(item){
        var arrayTmp = [];
        if(item.orden == 1 && !item.check){
            for (var i = 64; i < 128; i++) {
                 for(xx in $scope.itemsParaDetalle){
                    if($scope.nuevosChecks[i].orden ==  $scope.itemsParaDetalle[xx].orden){
                      arrayTmp.push($scope.itemsParaDetalle[xx]);
                    }
                 }

                 $scope.nuevosChecks[i].check = false;
            }
            for(var q = 0;q < arrayTmp.length;q++){
                var idxPlus = $scope.itemsParaDetalle.indexOf(arrayTmp[q]);
                $scope.itemsParaDetalle.splice(idxPlus,1);
            }
        }
        var arrayIdx = [];
        for(var l = 0;l < $scope.itemsParaDetalle.length;l++){
              if(item.orden == $scope.itemsParaDetalle[l].orden){
                  arrayIdx.push($scope.itemsParaDetalle[l]);
              } 
        }
        if(arrayIdx.length > 0){
          for(var l = 0;l < arrayIdx.length;l++){
              var idx = $scope.itemsParaDetalle.indexOf(arrayIdx[l]);
              $scope.itemsParaDetalle.splice(idx, 1);
          }
        }else{
          $scope.itemsParaDetalle.push(item);
        }         
    }
    $scope.eliminarData = function(item){
      var idx = $scope.itemsValidos.indexOf(item);
      $scope.itemsValidos.splice(idx, 1);
      var idx2 = $scope.bitmaps.indexOf(item);
      $scope.bitmaps[idx2].check = false;
      for(t in $scope.nuevosChecks){
          if(item.orden == $scope.nuevosChecks[t].orden){
            $scope.nuevosChecks[t].disabled = true;
            $scope.nuevosChecks[t].check = false;
          }
      }

    }
    $scope.guardarCatalogo = function(){
        var ope = '';
        $scope.dataEnviar = [];
        if($scope.editarCatalogoIso){
           ope = $scope.datos.operador
           $scope.dataEnviar.push({eliminar:true,Id_Operador:$scope.datos.operador});
        }else if($scope.nuevoCatalogoIso){
          if($scope.datos.operador instanceof Object){
            ope = $scope.datos.operador.Id_Operador;
          }else{
            ope = $scope.datos.operador;
          }
        }
        for(prop in $scope.itemsValidos){
           $scope.dataEnviar.push({Id_Operador:ope,Bitmap:$scope.itemsValidos[prop].orden,Nombre:$scope.itemsValidos[prop].nombre,Tipo:$scope.itemsValidos[prop].tipo.value,Longitud:$scope.itemsValidos[prop].longitud,Descripcion:$scope.itemsValidos[prop].descripcion,TipoDato:$scope.itemsValidos[prop].tipoValor.value});
        }
        factoryParsing.grabarCatalogosISO($scope.dataEnviar).then(function(r){
            if(r.msj == 'Success'){
                 $ngBootbox.alert('¡El Catálogo se guardo con éxito!').then(function() {
                          $route.reload();
                 });
            }else{
                $ngBootbox.alert('¡Error indeterminado en conexión!').then(function() {
                        $route.reload();
                });
            }
        });
    }
    $scope.descripcion = true;
    $scope.habilitarEdicion = function(arg,index){
          var execute = '$scope.itemsValidos['+index+'].mostrarLabel'+arg+' = false';
          var execute2 = '$scope.itemsValidos['+index+'].mostrarText'+arg+' = true';
          eval(execute);
          eval(execute2);
    }
    $scope.bloquearEdicion = function(arg,index){
          var execute = '$scope.itemsValidos['+index+'].mostrarLabel'+arg+' = true';
          var execute2 = '$scope.itemsValidos['+index+'].mostrarText'+arg+' = false';
          eval(execute);
          eval(execute2);
          if($scope.itemsValidos[index].longitud == ''){
              $scope.itemsValidos[index].longitud = 0;
          }
    }
    $scope.siguiente = function(){
        $scope.configTableValidos = {
          itemsPerPage:  $scope.itemsValidos.length,
          fillLastPage: "yes"
        };
        $scope.flagFix = true;
        var id = 0;
        if($scope.editarCatalogoIso){
             id = $scope.datos.operador;
        }else if($scope.nuevoCatalogoIso){
             id = 0;
        }
        factoryParsing.obtenerCatalogos({id:id}).then(function(resp){
              var tipoCampo,tipoValor;
              for (var i=0; i < resp.length; i++) {
                    for (var j=0; j < $scope.itemsValidos.length; j++) {
                      if (resp[i].Bitmap == $scope.itemsValidos[j].orden) {
                          $scope.itemsValidos[j].nombre = resp[i].Nombre;
                          if($scope.editarCatalogoIso){
                              for(p in $scope.tiposCampo){
                                  if($scope.tiposCampo[p].value ==  resp[i].Tipo){
                                      tipoCampo = $scope.tiposCampo[p];
                                  }
                              }
                              for(p in $scope.tiposValor){
                                  if($scope.tiposValor[p].value ==  resp[i].TipoDato){
                                      tipoValor = $scope.tiposValor[p]; 
                                  }
                              }
                          }else if($scope.nuevoCatalogoIso){
                               tipoCampo = $scope.tipoCampo;
                               tipoValor = $scope.tipoValor;
                          }
                          $scope.itemsValidos[j].tipo = tipoCampo;
                          $scope.itemsValidos[j].tipoValor = tipoValor;
                          $scope.itemsValidos[j].longitud = resp[i].Longitud;
                          $scope.itemsValidos[j].descripcion = resp[i].Descripcion;
                          $scope.itemsValidos[j].mostrarTextLongitud = false;
                          $scope.itemsValidos[j].mostrarLabelLongitud = true;
                          $scope.itemsValidos[j].mostrarTextDescripcion = false;
                          $scope.itemsValidos[j].mostrarLabelDescripcion = true;
                          $scope.itemsValidos[j].mostrarTextNombre = false;
                          $scope.itemsValidos[j].mostrarLabelNombre = true;
                      }
                    }
              }
              if($scope.editarCatalogoIso){
                  factoryParsing.obtenerCatalogos({id:0}).then(function(resp){
                      for (var i=0; i < resp.length; i++) {
                            for (var j=0; j < $scope.itemsValidos.length; j++) {
                              if (!$scope.itemsValidos[j].longitud) {
                                  $scope.itemsValidos[j].nombre = resp[i].Nombre;
                                  $scope.itemsValidos[j].tipo = $scope.tipoCampo;
                                  $scope.itemsValidos[j].tipoValor = $scope.tipoValor;
                                  $scope.itemsValidos[j].longitud = resp[i].Longitud;
                                  $scope.itemsValidos[j].descripcion = resp[i].Descripcion;
                                  $scope.itemsValidos[j].mostrarTextLongitud = false;
                                  $scope.itemsValidos[j].mostrarLabelLongitud = true;
                                  $scope.itemsValidos[j].mostrarTextDescripcion = false;
                                  $scope.itemsValidos[j].mostrarLabelDescripcion = true;
                                  $scope.itemsValidos[j].mostrarTextNombre = false;
                                  $scope.itemsValidos[j].mostrarLabelNombre = true;
                              }
                            }
                      }

                  });
              }
              $scope.itemsValidos.sort(function(a, b) {
                  return parseFloat(a.orden) - parseFloat(b.orden);
              });
              $scope.primeraVista = false;
              $scope.terceraVista = true;
        });  
    } 
    
    var crearBitmaps = function(arrayBusqueda){
          var tmpBinario1 = '';
          var tmpBinario2 = '';
          for(p in arrayBusqueda){
            if(arrayBusqueda[p].orden <= 64){
               if(arrayBusqueda[p].check){
                  tmpBinario1 += '1';
               }else{
                  tmpBinario1 += '0';
               }
            }else{
               if(arrayBusqueda[0].check){
                  if(arrayBusqueda[p].check){
                      tmpBinario2 += '1';
                  }else{
                      tmpBinario2 += '0';
                  }
                  if(tmpBinario2 == '0000000000000000000000000000000000000000000000000000000000000000'){
                      //console.log('esta marcado pero no hay seleccion');
                      tmpBinario1 = tmpBinario1.replace('1','0'); 
                  }
               }else{
                  tmpBinario2 = '0000000000000000000000000000000000000000000000000000000000000000'
                  tmpBinario2 = '0000000000000000000000000000000000000000000000000000000000000000'
                  break;
               }
            }
          }
          /*console.log(tmpBinario1);
          console.log(tmpBinario2);
          console.log('--------------');*/
          $scope.valorHexadecimal1 = ConvertBase.binaryToHex(tmpBinario1);
          //console.log($scope.valorHexadecimal1.result);
          $scope.valorHexadecimal2 = ConvertBase.binaryToHex(tmpBinario2);
          //console.log($scope.valorHexadecimal2.result);
    }
    $scope.duplicarItemDetalle = function(item){
      $scope.arrayConversorDetalle.push({TipoRegistro: item.TipoRegistro,NumeroCampo:item.NumeroCampo,PosicionInicio: item.PosicionInicio,LongitudCampo: item.LongitudCampo,TipoCampo: item.TipoCampo,SeparadorDecimales: item.SeparadorDecimales,NumeroDecimales: item.NumeroDecimales,DescripcionCampo:item.DescripcionCampo,IdCampoEquivalente: item.IdCampoEquivalente,CampoEquivalente:item.CampoEquivalente,Obligatorio: item.Obligatorio,Validaciones: item.Validaciones,Tipo_Registro: item.Tipo_Registro,Default_Value: item.Default_Value,observacion: item.observacion,Rutina_Validacion: item.Rutina_Validacion,Rutina_Transformacion: item.Rutina_Transformacion,CaracterConcatenacion: item.CaracterConcatenacion,OrdenCampo: item.OrdenCampo,Rutina_Conversion: item.Rutina_Conversion,ValidaEnMasivas: item.ValidaEnMasivas,eliminar:true});
    }
    $scope.eliminarDuplicado = function(item){
        idx = $scope.arrayConversorDetalle.indexOf(item);
        $scope.arrayConversorDetalle.splice(idx, 1);
    }
    var creacionArrayConversorDetalle  = function(tipo){
       $scope.arrayConversorDetalle = [];
       for(prop in $scope.itemsParaDetalle){
           if($scope.tipoCabecera.value == 'ENVIO'){
              $scope.arrayConversorDetalle.push({TipoRegistro: 'D',NumeroCampo:$scope.itemsParaDetalle[prop].orden,PosicionInicio: 0,LongitudCampo: 0,TipoCampo: 'X',SeparadorDecimales: 0,NumeroDecimales: 0,DescripcionCampo:'',IdCampoEquivalente: 0,CampoEquivalente:$scope.itemsParaDetalle[prop].Nombre,Obligatorio: 0,Validaciones: '',Tipo_Registro: 'ITEM',Default_Value: '',observacion: '',Rutina_Validacion: '',Rutina_Transformacion: '',CaracterConcatenacion: '',OrdenCampo: -1,Rutina_Conversion: '',ValidaEnMasivas: 1});
           }else{
              $scope.arrayConversorDetalle.push({TipoRegistro: 'D',NumeroCampo:$scope.itemsParaDetalle[prop].orden, PosicionInicio: 0,LongitudCampo: 0,TipoCampo: 'X',SeparadorDecimales: 0,NumeroDecimales: 0,DescripcionCampo:$scope.itemsParaDetalle[prop].Nombre,IdCampoEquivalente: 0,CampoEquivalente:'',Obligatorio: 0,Validaciones: '',Tipo_Registro: 'ITEM',Default_Value: '',observacion: '',Rutina_Validacion: '',Rutina_Transformacion: '',CaracterConcatenacion: '',OrdenCampo: -1,Rutina_Conversion: '',ValidaEnMasivas: 1});
           }
           
       }
    }

    var creacionArrayConversorDetalleEditar  = function(){
       $scope.arrayConversorDetalle = [];
       for(prop in $scope.itemsParaDetalle){
            if($scope.tipoCabecera.value == 'ENVIO'){
              $scope.arrayConversorDetalle.push({IdDetalle:$scope.itemsParaDetalle[prop].IdDetalle,TipoRegistro: 'D',NumeroCampo:$scope.itemsParaDetalle[prop].orden,PosicionInicio: 0,LongitudCampo: 0,TipoCampo: 'X',SeparadorDecimales: 0,NumeroDecimales: 0,DescripcionCampo:'',IdCampoEquivalente: 0,CampoEquivalente:$scope.itemsParaDetalle[prop].Nombre,Obligatorio: 0,Validaciones: '',Tipo_Registro: 'ITEM',Default_Value: '',observacion: '',Rutina_Validacion: '',Rutina_Transformacion: '',CaracterConcatenacion: '',OrdenCampo: -1,Rutina_Conversion: '',ValidaEnMasivas: 1});
           }else{
              $scope.arrayConversorDetalle.push({IdDetalle:$scope.itemsParaDetalle[prop].IdDetalle,TipoRegistro: 'D',NumeroCampo:$scope.itemsParaDetalle[prop].orden, PosicionInicio: 0,LongitudCampo: 0,TipoCampo: 'X',SeparadorDecimales: 0,NumeroDecimales: 0,DescripcionCampo:$scope.itemsParaDetalle[prop].Nombre,IdCampoEquivalente: 0,CampoEquivalente:'',Obligatorio: 0,Validaciones: '',Tipo_Registro: 'ITEM',Default_Value: '',observacion: '',Rutina_Validacion: '',Rutina_Transformacion: '',CaracterConcatenacion: '',OrdenCampo: -1,Rutina_Conversion: '',ValidaEnMasivas: 1});
           }
       }

       for(prop in $scope.arrayConversorDetalle){
           for(p in  $scope.detallesFormatos){
             if($scope.arrayConversorDetalle[prop].IdDetalle == $scope.detallesFormatos[p].IdDetalle){
                  $scope.arrayConversorDetalle[prop].TipoRegistro = $scope.detallesFormatos[p].TipoRegistro;
                  $scope.arrayConversorDetalle[prop].NumeroCampo = $scope.detallesFormatos[p].NumeroCampo;
                  $scope.arrayConversorDetalle[prop].PosicionInicio = $scope.detallesFormatos[p].PosicionInicio;
                  $scope.arrayConversorDetalle[prop].LongitudCampo = $scope.detallesFormatos[p].LongitudCampo;
                  $scope.arrayConversorDetalle[prop].TipoCampo = $scope.detallesFormatos[p].TipoCampo;
                  $scope.arrayConversorDetalle[prop].SeparadorDecimales = $scope.detallesFormatos[p].SeparadorDecimales;
                  $scope.arrayConversorDetalle[prop].NumeroDecimales = $scope.detallesFormatos[p].NumeroDecimales;
                  $scope.arrayConversorDetalle[prop].DescripcionCampo = $scope.detallesFormatos[p].DescripcionCampo;
                  $scope.arrayConversorDetalle[prop].IdCampoEquivalente = $scope.detallesFormatos[p].IdCampoEquivalente;
                  $scope.arrayConversorDetalle[prop].CampoEquivalente = $scope.detallesFormatos[p].CampoEquivalente;
                  $scope.arrayConversorDetalle[prop].Obligatorio = $scope.detallesFormatos[p].Obligatorio;
                  $scope.arrayConversorDetalle[prop].Validaciones = $scope.detallesFormatos[p].Validaciones;
                  $scope.arrayConversorDetalle[prop].Tipo_Registro = $scope.detallesFormatos[p].Tipo_Registro;
                  $scope.arrayConversorDetalle[prop].Default_Value = $scope.detallesFormatos[p].Default_Value;
                  $scope.arrayConversorDetalle[prop].observacion = $scope.detallesFormatos[p].observacion;
                  $scope.arrayConversorDetalle[prop].Rutina_Validacion = $scope.detallesFormatos[p].Rutina_Validacion;
                  $scope.arrayConversorDetalle[prop].Rutina_Transformacion = $scope.detallesFormatos[p].Rutina_Transformacion;
                  $scope.arrayConversorDetalle[prop].CaracterConcatenacion = $scope.detallesFormatos[p].CaracterConcatenacion;
                  $scope.arrayConversorDetalle[prop].OrdenCampo = $scope.detallesFormatos[p].OrdenCampo;
                  $scope.arrayConversorDetalle[prop].Rutina_Conversion = $scope.detallesFormatos[p].Rutina_Conversion;
                  $scope.arrayConversorDetalle[prop].ValidaEnMasivas = $scope.detallesFormatos[p].ValidaEnMasivas;

              }
           } 
       }
    }

    $scope.siguienteTablaConversorDetalle = function(){
       if($scope.nuevoFormatoIso){
           creacionArrayConversorDetalle($scope.tipoCabecera.value);
       }else if($scope.editarFormatoIso){
           creacionArrayConversorDetalleEditar(); 
       }
       $scope.cuartaVista = false;
       $scope.tablaConversorDetalleVista = true;
       crearBitmaps($scope.nuevosChecks);
    }
    $scope.procesoPrimeraVista = function(item){
        $scope.muestraOper = false;
        if(item){
           $scope.idOperadorComprobar = item.Id_Operador;
           $scope.muestraOper = false;
           $scope.mostrarOperador = item.Operador;
           $scope.itemsValidos = [];
           $scope.datos.operador = item.Id_Operador;
           factoryParsing.obtenerDetalleCatalogos([{Id_Operador:item.Id_Operador}]).then(function(detalles){
                for(prop in $scope.bitmaps){
                  $scope.bitmaps[prop].check = false;
                  for(p in detalles){
                    if(detalles[p].Bitmap == 1){
                        for(i = 64;i < 128;i++){
                          $scope.bitmaps[i].validar = true;
                        }
                    }
                    if(detalles[p].Bitmap == $scope.bitmaps[prop].orden){
                       $scope.bitmaps[prop].check = true;
                       $scope.itemsValidos.push({name:$scope.bitmaps[prop].name,value:$scope.bitmaps[prop].value,orden:$scope.bitmaps[prop].orden,check:$scope.bitmaps[prop].check,validar:$scope.bitmaps[prop].validar,disabled:$scope.bitmaps[prop].disabled});
                    }
                  }
                }
               
           });
        }else{
          $scope.muestraOper = true;
          desCheckBitmaps();
        }
        $scope.primeraVista = true;
        $scope.vistaGuardarCabecera = false;
    }
    $scope.validarFormato = function(arg,index){
      if(arg <= 0 || arg > 999){
          $scope.itemsValidos[index].longitud = '';
      }
    }

    $scope.anterior = function(){
      $scope.primeraVista = true;
      $scope.terceraVista = false;
      $scope.cuartaVista = false;
    }
    $scope.anteriorCuartaVista = function(){
      $scope.terceraVista = true;
      $scope.cuartaVista = false;
    }
    /*conversorcabeceraisosModel.getAll().then(function(data) {
      $scope.conversorcabeceraisosList = data;
      $scope.conversorcabeceraisosTemp = angular.copy($scope.conversorcabeceraisosList);
      $scope.preloader = false;
    });*/
    /*  Modal */
     $scope.open = function (item) {
            var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'templates/conversorcabeceraisos/modalCreate.html',
            controller: 'modalconversorcabeceraisosCreateController',
            size: 'lg',
            resolve: {
             datos: function () {
              return $scope.listaCatalogosDetalles;
             },
             item: function () {
              return item;
             }
            }
            });
          modalInstance.result.then(function(data) {
            if(!item) {
               $scope.conversorcabeceraisosList.push(data);
               $scope.conversorcabeceraisosTemp = angular.copy($scope.conversorcabeceraisosList);
            }
          },function(result){
          $scope.conversorcabeceraisosList = $scope.conversorcabeceraisosTemp;
          $scope.conversorcabeceraisosTemp = angular.copy($scope.conversorcabeceraisosList);
        });
    };

    $scope.openFormato = function (item) {
            var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'templates/conversorcabeceraisos/modalListaDetallesForatos.html',
            controller: 'modalconversorcabeceraisosCreateController',
            size: 'lg',
            resolve: {
             datos: function () {
              return $scope.listaCatalogosDetalles;
             },
             item: function () {
              return item;
             }
            }
            });
          modalInstance.result.then(function(data) {
            if(!item) {
               $scope.conversorcabeceraisosList.push(data);
               $scope.conversorcabeceraisosTemp = angular.copy($scope.conversorcabeceraisosList);
            }
          },function(result){
          $scope.conversorcabeceraisosList = $scope.conversorcabeceraisosTemp;
          $scope.conversorcabeceraisosTemp = angular.copy($scope.conversorcabeceraisosList);
        });
    };
  var encerarNuevosChecks = function(){
      for(prop in $scope.nuevosChecks){
         $scope.nuevosChecks[prop].disabled = true; 
         $scope.nuevosChecks[prop].check    = false; 
         $scope.nuevosChecks[prop].class    = false; 
      }
      $scope.nombreCabecera = '';
      $scope.descripcionCabecera = '';
      $scope.mtiInput = '';
  }
  var obtenerDetallesVisibles  = function(idOperador){
      factoryParsing.obtenerCatalogos({id:idOperador}).then(function(resp){
            for(xx in $scope.nuevosChecks){
                $scope.nuevosChecks[xx].class = false;
                for(var x = 0; x < resp.length; x++){
                  if(resp[x].Bitmap == $scope.nuevosChecks[xx].orden){
                        $scope.nuevosChecks[xx].disabled = false;
                        $scope.nuevosChecks[xx].class = true;
                        $scope.nuevosChecks[xx].Descripcion = resp[x].Descripcion;
                        $scope.nuevosChecks[xx].Id_Operador = resp[x].Id_Operador;
                        $scope.nuevosChecks[xx].Longitud    = resp[x].Longitud;
                        $scope.nuevosChecks[xx].Nombre      = resp[x].Nombre;
                        $scope.nuevosChecks[xx].Tipo        = resp[x].Tipo;
                        $scope.nuevosChecks[xx].TipoDato    = resp[x].TipoDato;
                  }
                }
            }
         });
  };
  $scope.procesoNuevoFormato = function(){
        $scope.itemsParaDetalle = [];
        obtenerDetallesVisibles($scope.datos.otroOperador.Id_Operador);
        $scope.terceraVista  = false;
        $scope.cuartaVista  = true;
        $scope.vistaGuardarCabecera = false;
        $scope.cuartaVista  = true;      
  }

  var pintarChecksNuevos = function(IdFormato){
    factoryParsing.obtenerDetallesFormatos({IdFormato:IdFormato}).then(function(resp){
        $scope.detallesFormatos = resp;
        for(p in $scope.nuevosChecks){
            for(prop in resp){
                if(resp[prop].NumeroCampo == $scope.nuevosChecks[p].orden){
                   $scope.nuevosChecks[p].check = true;
                   $scope.itemsParaDetalle.push(Object.assign(resp[prop],$scope.nuevosChecks[p]));
                }
            }
        }
    });
  }
  $scope.procesoEditarFormato = function(item){ 
      $scope.itemIdFormato = item.IdFormato;
      $scope.itemsParaDetalle = [];
      factoryParsing.obtenerMTI({IdFormato:item.IdFormato,Nombre:'MTI'}).then(function(r){
          $scope.nombreCabecera = item.NombreFormato;
          $scope.descripcionCabecera = item.DescripcionFormato;
          if(item.Tipo_Proceso == 'IN'){
              $scope.tipoCabecera = $scope.tiposCabecera[0];
          }else{
              $scope.tipoCabecera = $scope.tiposCabecera[1];
          }
          $scope.mtiInput = parseInt(r[0].ValorDefault);
          obtenerDetallesVisibles($scope.datos.otroOperador.Id_Operador);
          pintarChecksNuevos(item.IdFormato);
          $scope.vistaGuardarCabecera = false;
          $scope.cuartaVista  = true;
      });
  }

  var agregarIdFormato = function(IdFormato){
      for(prop in $scope.arrayConversorDetalle){
          $scope.arrayConversorDetalle[prop].IdFormato = IdFormato;
      }
  }
  var crearCabeceraIso = function(IdFormato,idOperador,bitmap1,bitmap2){
      var arrayCabeceraIso = [
          {IdFormato:IdFormato,Orden:1,Nombre:'Longitud',Tipo:'H',Longitud:4,Bytes:2,AplicaDefault:false,ValorDefault:128,Respuesta:'',Descripcion:'Longitud de la trama. Constante'},
          {IdFormato:IdFormato,Orden:2,Nombre:'MTI',Tipo:'N',Longitud:4,Bytes:4,AplicaDefault:true,ValorDefault:$scope.mtiInput,Respuesta:'',Descripcion:'Codigo del tipo de mensaje'},
          {IdFormato:IdFormato,Orden:3,Nombre:'BitMap Primario',Tipo:'H',Longitud:16,Bytes:8,AplicaDefault:false,ValorDefault:bitmap1,Respuesta:'',Descripcion:'Valor hexadecimal representativo del BitMap primario con una longitud de 64 bit'},
          {IdFormato:IdFormato,Orden:4,Nombre:'BitMap Secundario',Tipo:'H',Longitud:16,Bytes:8,AplicaDefault:true,ValorDefault:bitmap2,Respuesta:'',Descripcion:'Valor hexadecimal representativo del BitMap secundario con una longitud de 64 bit. (Opcional)'},
          {IdFormato:IdFormato,Orden:5,Nombre:'Operador',Tipo:'N',Longitud:6,Bytes:6,AplicaDefault:true,ValorDefault:idOperador,Respuesta:'',Descripcion:'Identificador del operador insertado en esta tabla'}

      ]; 
      return arrayCabeceraIso;
  }
  $scope.guardarConversorDetalle = function(){
        
        if($scope.nuevoFormatoIso){
            var conversorCabeceras = conversorcabecerasModel.create();
            conversorCabeceras.NombreFormato = $scope.nombreCabecera;
            conversorCabeceras.DescripcionFormato = $scope.descripcionCabecera;
            conversorCabeceras.Cabecera = false;
            conversorCabeceras.Pie = false;
            conversorCabeceras.Separador = '';
            conversorCabeceras.FormatoConversion = 0;
            conversorCabeceras.Formato_destino = false;
            var tipoProceso = '',tipoConversion = '';
            if($scope.tipoCabecera.value == 'ENVIO'){
              tipoProceso = 'IN';
              tipoConversion = 'PROCESO,ISO8583';
            }else{
              tipoProceso = 'OUT';
              tipoConversion = 'ISO8583,PROCESO';
            }
            conversorCabeceras.Tipo_Proceso = tipoProceso;
            conversorCabeceras.NombreObjeto = '';
            conversorCabeceras.estado = 'ACTIVO';
            conversorCabeceras.tipo_archivo_salida = 'STRING';
            conversorCabeceras.ORIENTACION = '';
            conversorCabeceras.RutinaPrevalidacion = '';
            conversorCabeceras.Unificador = '|';
            conversorCabeceras.Check_Totales_Por = '';
            conversorCabeceras.ValidaIdentificacion = true;
            conversorCabeceras.RutinaPreconversion = '';
            conversorCabeceras.InfiereTipoIdCliente = false;
            conversorCabeceras.MuestraCabeceraColumna = false;
            conversorCabeceras.TipoConversion = tipoConversion;
            conversorCabeceras.save().then(function(r){
                if(r.message){
                    var arrayEnviar = [];
                    agregarIdFormato(r.IdFormato);
                    var datosCabeceraIso = crearCabeceraIso(r.IdFormato,$scope.datos.otroOperador.Id_Operador,$scope.valorHexadecimal1.result,$scope.valorHexadecimal2.result);
                    arrayEnviar.push(datosCabeceraIso);
                    arrayEnviar.push($scope.arrayConversorDetalle);
                    factoryParsing.guardarFormatoISO(arrayEnviar).then(function(resultDta){
                        if(resultDta.msj){
                          $ngBootbox.alert('¡El Formato se creo con éxito!').then(function() {
                            $route.reload();
                          });
                        }else{
                          $ngBootbox.alert('¡Error indeterminado en conexión!').then(function() {
                            $route.reload();
                          });
                        }
                    });
                } 
            });
          
        }else if($scope.editarFormatoIso){
          factoryParsing.eliminarCDetalleCabeceraIso({IdFormato:$scope.itemIdFormato}).then(function(resp){
              if(resp.msj){
                    var arrayEnviar = [];
                    agregarIdFormato($scope.itemIdFormato);
                    var datosCabeceraIso = crearCabeceraIso($scope.itemIdFormato,$scope.datos.otroOperador.Id_Operador,$scope.valorHexadecimal1.result,$scope.valorHexadecimal2.result);
                    arrayEnviar.push(datosCabeceraIso);
                    arrayEnviar.push($scope.arrayConversorDetalle);
                    factoryParsing.guardarFormatoISO(arrayEnviar).then(function(resultDta){
                        if(resultDta.msj){
                          $ngBootbox.alert('¡El Formato se edito con éxito!').then(function() {
                            $route.reload();
                          });
                        }else{
                          $ngBootbox.alert('¡Error indeterminado en conexión!').then(function() {
                            $route.reload();
                          });
                        }
                    });
              }else{
                  $ngBootbox.alert('¡Error indeterminado en conexión!').then(function() {
                            $route.reload();
                  });
              }
              
          });
        }
     
  }
  /*  Delete  */
  $scope.openDelete = function (item) {
      factoryParsing.obtenerFormatos(item).then(function(respuestaData){
            var totalFormatos = respuestaData.length;
            if(totalFormatos > 0){
               item.eliminar = false;
            }else{
               item.eliminar = true;
            }
            var modalInstance = $uibModal.open({
              animation: true,
              templateUrl: 'templates/conversorcabeceraisos/modalDelete.html',
              controller: 'modalconversorcabeceraisosDeleteController',
              size: 'lg',
              resolve: {
                item: function () {
                   return item;
                }
              }
            });
            modalInstance.result.then(function(data) {
              factoryParsing.eliminarCatalogo(data).then(function(r){
                  if(r >= 1){
                      var idx = $scope.otrosOperadores.indexOf(data); 
                      $scope.otrosOperadores.splice(idx, 1);
                      $scope.msjEliminarCatalogo = '¡El Catálogo se elimino con éxito!'
                      $scope.claseEliminarCatalogo = 'success';
                      $scope.msjAlertEliminarCatalogo = true;
                      $ngBootbox.alert('¡El Catálogo se elimino con éxito!').then(function() {
                        $route.reload();
                      });
                  }else{
                      $scope.msjEliminarCatalogo = '¡Error indeterminado en conexión!'
                      $scope.claseEliminarCatalogo = 'danger';
                      $scope.msjAlertEliminarCatalogo = true;
                      $ngBootbox.alert('¡Error indeterminado en conexión!').then(function() {
                        $route.reload();
                      });
                  }
              }); 
            });
      });
  };
  /*  Delete  Formato*/
  $scope.openDeleteFormato = function (item) {
      var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'templates/conversorcabeceraisos/modalDelete.html',
          controller: 'modalconversorcabeceraisosDeleteController',
          size: 'lg',
          resolve: {
            item: function () {
              return item;
            }
          }
        });

        modalInstance.result.then(function(data) { 
          var idx = $scope.formatosPorOperador.indexOf(data); 
          $scope.formatosPorOperador.splice(idx, 1);  
          factoryParsing.eliminarFormatoIso({IdFormato:data.IdFormato}).then(function(r){
              if(r.msj){
                  $ngBootbox.alert('¡El Formato se elimino con éxito!').then(function() {
                          $route.reload();
                  });
              }else{
                  $ngBootbox.alert('¡Error indeterminado en conexión!').then(function() {
                        $route.reload();
                  });
              }
          });   
        });
  };



}])
.controller('modalconversorcabeceraisosCreateController',
  ['$scope', '$uibModalInstance', 'datos','conversorcabeceraisosModel','$filter','item','$rootScope','conversorcabecerasModel',
  function ($scope, $uibModalInstance, datos,conversorcabeceraisosModel,$filter,item,$rootScope,conversorcabecerasModel) {
    $scope.nombreOperador = item.Operador;
    $scope.showDetalles = [];
    for (prop in datos) {
        if(item.Id_Operador == datos[prop].Id_Operador){
            $scope.showDetalles.push(datos[prop]);
        }
    }
    $rootScope.configTable.itemsPerPage =  5;
    if(item.IdFormato){
          $scope.cabecera = item;
          conversorcabecerasModel.url = '/api/conversorcabeceras/detalles';
          conversorcabecerasModel.findById(item.IdFormato).then(function(detalles){
            $scope.numeroBits = detalles.length;
            $scope.conversorDetalles = detalles;
            $scope.conversorDetalles.sort(function(a, b) {
                    return parseFloat(a.NumeroCampo) - parseFloat(b.NumeroCampo);
            });
          });
    }

}])
.controller('modalconversorcabeceraisosDeleteController',
  ['$scope', '$uibModalInstance', 'item',
  function ($scope, $uibModalInstance, item) {
    $scope.item = item;
    if($scope.item.eliminar){
    	$scope.mensaje = '¿Está seguro que desea borrar el Catálogo?';
    	$scope.eliminarDisabled = false;
    }else{
    	$scope.mensaje = 'Imposible Eliminar,Este Catálogo tiene asociado formatos';
    	$scope.eliminarDisabled = true;
    }
    $scope.ok = function () {
      $uibModalInstance.close($scope.item);
    };
    $scope.cancel = function () {
       $uibModalInstance.dismiss('cancel');
     };
     if(item.IdFormato){
          $scope.mensaje = '¿Está seguro que desea borrar el Formato?';
          $scope.eliminarDisabled = false;
     }

}])
.config(function ($routeProvider) {
  $routeProvider
    .when('/conversorcabeceraisos', {
      templateUrl: '/templates/conversorcabeceraisos/index.html',
      controller: 'conversorcabeceraisosController',
      access: {
        restricted: false,
       rol: 1
      }
    });
 })
.controller('crudController',
    ['$scope', 'crudService',
        function ($scope, crudService) {
            $scope.spinner = false;
            $scope.disabledAccesRol = false;
            $scope.fieldName = [];
            $scope.showOnView = [];
            var stringFields = "";
            var stringDataTypes = "";
            var stringShowOnView = "";
            $scope.collection = [{
                field: '',
                dataType: '',
                showOnView: ''
            }];


            $scope.validateAccessRol = function(){
                if($scope.item.typeAccess.id == 2 )
                    $scope.disabledAccesRol = true;
                else
                    $scope.disabledAccesRol = false;
            }

            // remove the "Remove" Header and Body when only left one document
            $scope.firstRow = function () {
                if ($scope.collection[1])
                    return false;
                else
                    return true;
            };

            $scope.typesAccess = [
                {
                    id: 1,
                    name: 'Restricted'
                },
                {
                    id: 2,
                    name: 'Public'
                }

            ]

             $scope.rolsAccess = [
                {
                    id: 1,
                    name: 'Reader'
                },
                {
                    id: 2,
                    name: 'Edit'
                },
                {
                    id: 3,
                    name: 'Coordinator'
                },
                {
                    id: 4,
                    name: 'Admin'
                }

            ]


            $scope.dataTypes = [
                {
                    id: 1,
                    name: 'String'
                },
                {
                    id: 2,
                    name: 'Number'
                },

                {
                    id: 3,
                    name: 'Boolean'
                },
                {
                    id: 4,
                    name: 'Date'
                },
                {
                    id: 5,
                    name: 'Time'
                }

            ];

            // expose a function to add new (blank) rows to the model/table
            $scope.addRow = function () {
                // push a new object with some defaults
                $scope.collection.push({
                    field: $scope.fieldName[0],
                    dataType: $scope.dataTypes[0],
                    showOnView: $scope.showOnView[0]
                });
            }

            $scope.removeRow = function (index) {
                $scope.collection.splice(index, 1);
            }

            $scope.refresh = function(){
                 location.reload();
            }

            $scope.validate = function () {
                $scope.spinner = true;
                var cont = 0,show,inputsTypes='',req;
                var stringRequiered = '',fixType = '',stringHeaders = '';
                angular.forEach($scope.collection, function (value, key) {
                    if(value.showOnView){
                        show = '';
                    }else{
                        show = 'hidden'; 
                    }
                    if(value.showOnView && value.dataType.id != 3){
                        req = 'required';
                    }else{
                        req =  ''; 
                    }
                    switch (value.dataType.id) {
                        case 1:
                            inputsTypes += "text,";
                            break;
                        case 2:
                            inputsTypes += "number,";
                            break;
                        case 3:
                            inputsTypes += "checkbox,";
                            break;
                        case 4:
                            inputsTypes += "date,";
                            break;
                        case 5:
                            inputsTypes += "time,";
                            break;
                    }
                    if(value.dataType.name == 'Time'){
                        fixType = 'String';
                    }else{
                        fixType = value.dataType.name;
                    }
                    cont++;
                    if (cont != $scope.collection.length) {

                        stringFields += ((value.field).toLowerCase()).replace(/ /g, "_") + ",";
                        stringDataTypes += fixType + ",";
                        stringShowOnView += show + ",";
                        stringRequiered  += req + ","; 
                        stringHeaders    += (value.field).toUpperCase() + ",";
                    } else {
                        stringFields += ((value.field).toLowerCase()).replace(/ /g, "_");
                        stringDataTypes += fixType;
                        stringShowOnView += show;
                        stringRequiered  += req;
                        stringHeaders    += (value.field).toUpperCase();
                    }
                });
                inputsTypes = inputsTypes.slice(0,-1)
                var typeAcess;
                if($scope.item.typeAccess.id == 1){
                    typeAcess = false;
                }else{
                    typeAcess = true;  
                }
                var size = $scope.schemeName.length - 1;
                var letter = $scope.schemeName.substr(size, 1);
                if(letter != 's'){
                    $scope.schemeName   += 's';
                }
                $scope.schemeName = $scope.schemeName.toLowerCase();
                crudService.generar($scope.schemeName, stringFields, stringDataTypes, stringShowOnView,inputsTypes,typeAcess,stringRequiered,stringHeaders,$scope.item.rolAccess.id).then(function (result) {
                    $scope.spinner = false;
                    $scope.result = result;
                    $scope.schemeName = '';
                    $scope.collection = [];
                });
            }

        }])

.directive('alpha', function ()
{
return {
require: 'ngModel',
      restrict: 'A',
      link: function(scope, elem, attr, ngModel) {

        var validator = function(value) {
          if (/^[a-zA-Z0-9 ]*$/.test(value)) {
            ngModel.$setValidity('alphanumeric', true);
            return value;
          } else {
            ngModel.$setValidity('alphanumeric', false);
            return undefined;
          }
        };
        ngModel.$parsers.unshift(validator);
        ngModel.$formatters.unshift(validator);
      }
    };
})

.factory('crudService',
  ['$q','$http',
  function ($q,$http) {

  	return ({
      generar: generar
    });

  	function generar(schemeName,fields, dataTypes,showOnView,inputsTypes,typeAcess,stringRequiered,stringHeaders,rol) {
      var defered = $q.defer();
      var promise = defered.promise;
      $http.post('/config/cruds', {schemeName: schemeName,fields: fields, dataTypes: dataTypes,showOnView:showOnView,inputsTypes: inputsTypes,typeAcess: typeAcess,stringRequiered: stringRequiered,stringHeaders : stringHeaders,rol : rol})
        .success(function (data, status) {
          defered.resolve(data);
        })
        .error(function (data) {
          defered.reject();
        });
        return promise;
    }
}])
.config(function ($routeProvider) {
 	$routeProvider
 		.when('/crud', {
 		    templateUrl: '/javascripts/setup/crud/templates/crud.html',
 			controller: 'crudController',
 			access: {
 				 restricted: false,
 				rol: 5
 			}
 		});
 })
.controller('listSchemasController',
    ['$scope', 'schemaModel','$uibModal',
        function ($scope, schemaModel,$uibModal) {
        $scope.preloader = true;
        schemaModel.getAll().then(function(data){
        	 $scope.schemas = data;
        	 $scope.preloader = false;
        });

}])
.config(function ($routeProvider) {
 	$routeProvider
 		.when('/listSchemas', {
 		    templateUrl: '/javascripts/setup/listSchemas/templates/listSchemas.html',
 			controller: 'listSchemasController',
 			access: {
 				 restricted: false,
 				 rol: 5
 			}
 		});
 })
.controller('exportProjectController',
    ['$rootScope','$scope','$uibModal','exportProjectService','$ngBootbox',
        function ($rootScope,$scope,$uibModal,exportProjectService,$ngBootbox) {
        $scope.preloader 	    = true;
        $scope.projectName    = $rootScope.project.name;
        $scope.authorName  	  = $rootScope.project.authorName;
        $scope.email 		      = $rootScope.project.email;
        $scope.license 		    = 'MIT';
        $scope.template 	    = $rootScope.project.template;
        $scope.models         = $rootScope.project.schemas;
        $scope.models         = String($scope.models);

        exportProjectService.allLayouts().then(function (data) {
	        $scope.layouts = data;
	    });

	    $scope.setTemplate = function(arg){
	    	 $scope.template = arg;
	    }

      $scope.validate = function () {
          if(!$scope.projectName || !$scope.authorName || !$scope.email  || !$scope.template || !$scope.license || !$scope.models){
              $scope.submitBtn = true;
          }else{
              $scope.submitBtn = false;
          }
      };
      $scope.validate();
     /*  Create    */
     $scope.open = function () {
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: '/javascripts/setup/exportProject/templates/preview.html',
          controller: 'previewExportProjectController',
          size: 'lg',
          resolve: {
            layout: function () {
              return $scope.template;
            }
          }
        });
    };
    
    /*  Create    */
    var exportProject = function(){
      exportProjectService.setValues($scope.projectName,$scope.authorName,$scope.email,$scope.license,$scope.models,$scope.template).then(function(r){
          if(r.valid){
            $scope.preloader  = false;
            $ngBootbox.alert('The project was successful generecion please constructs the project from the console. * gulp exportProject!');
          }else{
            $scope.preloader  = true;
            $ngBootbox.alert('Ups Something went wrong Please check your modules and rebuilds!');
          }
      });
    }

    $scope.submit = function(){
      $scope.projectName = $scope.projectName.replace(/\s+/g, '-');
      $ngBootbox.alert('Please Stop the service gulp watch-front and continue!').then(function() {
        exportProject();
      });
    }

}])
.factory('exportProjectService',
    ['$q', '$http',
        function ($q, $http) {
            return ({
                allLayouts: allLayouts,
                setValues : setValues
            });

            function allLayouts() {
                var defered = $q.defer();
                var promise = defered.promise;

                $http.get('/setup/layouts')
                    .success(function (data) {
                        defered.resolve(data);
                    })
                    .error(function (err) {
                        defered.reject(err)
                    });

                return promise;
            }

            function setValues(projectName,authorName,email,license,models,template) {
              var deferred = $q.defer();
              $http.post('/exportProject/projectProduction', {projectName: projectName,authorName: authorName, email: email,license:license,models:models,template:template})
                .success(function (data, status) {
                    deferred.resolve(data);
                })
                .error(function (data) {
                  deferred.reject();
                });
                return deferred.promise;
            }

}])
.controller('previewExportProjectController',
  ['$scope', '$uibModalInstance', 'layout',
  function ($scope, $uibModalInstance, layout) {
  
    $scope.layout = layout;


}])
.config(function ($routeProvider) {
 	$routeProvider
 		.when('/exportProject', {
 		    templateUrl: '/javascripts/setup/exportProject/templates/exportProject.html',
 			controller: 'exportProjectController',
 			access: {
 				 restricted: false,
 				 rol: 5
 			}
 		});
 })
.controller('modalRelationshipDeleteController',
  ['$scope', '$uibModalInstance', 'item',
  function ($scope, $uibModalInstance, item) {
    $scope.item = item;
    $scope.ok = function () {
      $uibModalInstance.close($scope.item);
    };
    $scope.cancel = function () {
       $uibModalInstance.dismiss('cancel');
     };
}])
.controller('relationshipController',
    ['$scope', 'schemaModel','relationshipService','relationshipModel','$uibModal','$ngBootbox',
        function ($scope, schemaModel,relationshipService,relationshipModel,$uibModal,$ngBootbox) {
            $scope.showScheme = true;
            $scope.validateDisabled = true;
            $scope.generateDisabled = true;
            $scope.cardinalities = [
                {
                    id: 1,
                    name: 'one-to-one'
                },
                {
                    id: 2,
                    name: 'one-to-many'
                },

                {
                    id: 3,
                    name: 'many-to-many'
                }
            ];

            $scope.models = {
                selected: null,
                lists: {"Schemas": [], "A": [], "B": []}
            };

            $scope.fieldSelect = {
                selected: null,
                lists: {"C": [], "D": []}
            };

            $scope.multipleField = {
                selected: null,
                lists: {"E": [], "F": []}
            };

            /*  Delete  */
              $scope.openDelete = function (item) {
                var modalInstance = $uibModal.open({
                  animation: true,
                  templateUrl: '/javascripts/setup/relationship/templates/modalDelete.html',
                  controller: 'modalRelationshipDeleteController',
                  size: 'lg',
                  resolve: {
                    item: function () {
                       return item;
                    }
                  }
                });
                modalInstance.result.then(function(data) {
                  var idx = $scope.modelAsJson.indexOf(data);
                  $scope.modelAsJson.splice(idx, 1);
                  relationshipService.existRelation(data.modelA,data.modelB).then(function(r){
                    if(r.relationship.length > 1){
                        console.log("mas de Una recuperar relaciones q tiene y volver a relacionar")
                        var manyModels = '',manyModelB = '',manyIdRelationships = '';
                        angular.forEach(r.relationship, function(value) {
                          if(data._id != value._id){
                            manyModels            += value.modelA+',';
                            manyModelB            =  value.modelB; 
                            manyIdRelationships   += value._id+',';
                          }
                        });
                        manyModels = manyModels.slice(0,-1);
                        manyIdRelationships = manyIdRelationships.slice(0,-1);
                        console.log('models: '+manyModels+'modelB: '+manyModelB+'relationship: '+manyIdRelationships);
                        relationshipService.backupCrud(manyModelB,2,manyModels,manyIdRelationships).then(function(resp){
                            console.log(resp);
                            if(resp){
                                relationshipModel.destroy(data._id);
                            }else{
                                $ngBootbox.alert('Error in internal process, perform the transaction again');
                            }
                        });
                       
                    }else{
                       
                        relationshipModel.destroy(data._id).then(function(response){
                            if(response){
                                console.log("Solo tiene Una");
                                console.log(r.relationship);
                                relationshipService.backupCrud(r.relationship[0].modelB,1).then(function(res){
                                    if(!res)
                                      $ngBootbox.alert('Error in internal process, perform the transaction again');  
                                });
                            }else{
                                $ngBootbox.alert('Error in internal process, perform the transaction again'); 
                            }
                        });
                    }
                    
                  });
                });
            };
            /*  Delete  */

            var getModelFields = function(Model1,Model2){
               relationshipService.allFields(Model1,Model2).then(function (data) {
                   var model2 = [];
                   var model1 = [];
                   var mModel2 = [];
                   var allModel2 = [];
                   angular.forEach(data, function(value, key) {
                        if(value.model == "Model1"){
                            this.push(value);
                            allModel2.push(value);
                            mModel2.push(value);
                        }else{
                            model1.push(value);
                        }
                   }, model2);
                   $scope.fieldsModel1 = allModel2;
                   $scope.fieldSelect.lists.C = model2;
                   $scope.multipleField.lists.E = mModel2;
                   $scope.fieldsModel2 = model1;
                }); 
               
            }
            
            schemaModel.getAll().then(function (data) {
                $scope.models.lists.Schemas = data;
            });

            $scope.relationValidate = function () {
                relationshipService.existRelation($scope.models.lists.A[0].name,$scope.models.lists.B[0].name).then(function(data){
                    
                    if(data.cont == 0){
                        $scope.showScheme = false;
                        getModelFields($scope.models.lists.A[0].name,$scope.models.lists.B[0].name); 
                    }else{
                        var card = '';
                        if(data.existRelation[0].cardinalitie == 1)
                            card = ' one-to-one ';
                        else if (data.existRelation[0].cardinalitie == 2)
                            card = ' one-to-many ';
                        else
                            card = ' many-to-many ';
                        console.log(data.relationship);
                         $ngBootbox.alert("Relationship already exists, delete it first and try again\n"+"*"+data.existRelation[0].modelA+card+data.existRelation[0].modelB);
                    }
                });

            }

            $scope.changeCardinality = function(arg){
                $scope.passCardinality = arg;
            }

            $scope.relationGenerate = function(){
                console.log("Field Select");
                console.log($scope.fieldSelect.lists.D);
                console.log("Multi Field Select");
                console.log($scope.multipleField.lists.F);
                console.log("All Fields Model1");
                console.log($scope.fieldsModel1);
                console.log("All Fields Model2");
                console.log($scope.fieldsModel2);
                console.log("Cardinalitie");
                if(!$scope.passCardinality){
                    $scope.passCardinality = 1;
                }
                console.log($scope.passCardinality);
                console.log("Modelo A"+$scope.models.lists.A[0].name);
                console.log("Modelo B"+$scope.models.lists.B[0].name);

                relationshipModel.getAll().then(function (data){
                    relationshipService.flagMany($scope.models.lists.B[0].name).then(function(flagMany){
                        var createFields = '',indexFields = '';
                        angular.forEach($scope.fieldSelect.lists.D, function(value, key) {
                          createFields += value.name + ',';
                        });
                        createFields = createFields.slice(0,-1);
                        angular.forEach($scope.multipleField.lists.F, function(value, key) {
                          indexFields += value.name + ',';;
                        });
                        indexFields = indexFields.slice(0,-1);
                        var relationship = relationshipModel.create();
                        relationship.modelA = $scope.models.lists.A[0].name;
                        relationship.cardinalitie = $scope.passCardinality;
                        relationship.modelB = $scope.models.lists.B[0].name;
                        relationship.createFields = createFields;
                        relationship.indexFields = indexFields;
                        relationship.save();
                        if(data.length == 0 || flagMany == 0){

                             relationshipService.existRelation($scope.models.lists.A[0].name,$scope.models.lists.B[0].name).then(function(r){
                                console.log("lo nuevo");
                                 var idds = '';
                                 angular.forEach(r.relationship, function(value) {
                                   idds      += value._id +',';
                                 });
                                 idds = idds.slice(0,-1);
                                 console.log(idds);
                                 relationshipService.generateRelationship(1,$scope.models.lists.A[0].name,$scope.models.lists.B[0].name,idds,$scope.passCardinality).then(function(data){
                                     console.log("response");
                                     console.log(data);
                                 });
                             });
                             $ngBootbox.alert('Relationship Was Successfully Created')
                              .then(function() {
                                  console.log('Alert closed');
                                  location.reload();
                              });
                             console.log("Sobreescribir y ADD Anotaciones a la nueva relacion creada en la tabla donde lleva el muchos para asi hacer append");
                        }else{
                             relationshipService.existRelation($scope.models.lists.A[0].name,$scope.models.lists.B[0].name).then(function(r){
                                console.log("lo nuevo");
                                 var molesPass = '',idds = '';
                                 angular.forEach(r.relationship, function(value) {
                                   molesPass += value.modelA +',';
                                   idds      += value._id +',';
                                 });
                                 molesPass = molesPass.slice(0,-1);
                                 idds = idds.slice(0,-1);
                                 console.log(idds);
                                 relationshipService.generateRelationship(2,molesPass,$scope.models.lists.B[0].name,idds,$scope.passCardinality).then(function(data){
                                     console.log("response muchos");
                                     console.log(data);
                                 });

                             });
                             $ngBootbox.alert('Relationship Was Successfully Created')
                              .then(function() {
                                  console.log('Alert closed');
                                  location.reload();
                              });
                            console.log("ADD Relaciones sin borrar codigo anterior");
                            
                        }
                    });
                });


            }

            relationshipModel.getAll().then(function (data){    
                 $scope.modelAsJson =  data;
            });
            

            // Model to JSON for demo purpose
            $scope.$watch('models', function (model) {
                if(model.lists.A.length == 1 && model.lists.B.length == 1)
                    $scope.validateDisabled = false;
                else
                    $scope.validateDisabled = true;

            }, true);

            $scope.$watch('fieldSelect', function (model) {
                $scope.fieldSelectAsJson = angular.toJson(model, true);
                if($scope.fieldSelect.lists.D.length >= 1 && $scope.multipleField.lists.F.length)
                    $scope.generateDisabled = false;
                else
                    $scope.generateDisabled = true;
            }, true);

            $scope.$watch('multipleField', function (model) {
                $scope.multipleFieldAsJson = angular.toJson(model, true);
                if($scope.multipleField.lists.F.length >= 1 && $scope.fieldSelect.lists.D.length >= 1)
                    $scope.generateDisabled = false;
                else
                    $scope.generateDisabled = true;

            }, true);

        }])
.service('relationshipModel', function ($optimumModel) {
	var model = new $optimumModel();
	model.url = '/api/relationship';
	model.constructorModel = ['modelA','cardinalitie','modelB','createFields','indexFields'];
	return model;
})
.factory('relationshipService',
  ['$q', '$timeout', '$http',
  function ($q, $timeout, $http) {
    // return available functions for use in controller
    return ({
      allFields             : allFields,
      flagMany              : flagMany,
      existRelation         : existRelation,
      backupCrud            :   backupCrud,
      generateRelationship  : generateRelationship
    });
    function allFields (model1,model2) {
        var defered = $q.defer();
        var promise = defered.promise;
        $http({
          url: '/api/schema/fields', 
          method: "POST",
          data: {model1: model1,model2 : model2}
       })
          .success(function(data) {
                defered.resolve(data);
          })
          .error(function(err) {
                defered.reject(err)
          });
        return promise;
    }
    function flagMany (arg) {
        var defered = $q.defer();
        var promise = defered.promise;
        $http({
          url: '/api/countOneToMany', 
          method: "POST",
          data: {arg: arg}
       })
          .success(function(data) {
                defered.resolve(data);
          })
          .error(function(err) {
                defered.reject(err)
          });
        return promise;
    }
    function existRelation (arg,arg2) {
        var defered = $q.defer();
        var promise = defered.promise;
        $http({
          url: '/api/existRelation', 
          method: "POST",
          data: {arg: arg,arg2:arg2}
       })
          .success(function(data) {
                defered.resolve(data);
          })
          .error(function(err) {
                defered.reject(err)
          });
        return promise;
    }
    function backupCrud (arg,arg2,manyModels,manyIdRelationships) {
        var defered = $q.defer();
        var promise = defered.promise;
        $http({
          url: '/config/backupCrud', 
          method: "POST",
          data: {arg: arg,arg2:arg2,manyModels:manyModels,manyIdRelationships:manyIdRelationships}
       })
          .success(function(data) {
                defered.resolve(data);
          })
          .error(function(err) {
                defered.reject(err)
          });
        return promise;
    }

    function generateRelationship (opt,models,modelB,idRelationships,cardinalitie) {
        var defered = $q.defer();
        var promise = defered.promise;
        $http({
          url: '/config/generateRelationship', 
          method: "POST",
          data: {opt: opt,models: models,modelB: modelB,idRelationships: idRelationships,cardinalitie:cardinalitie}
       })
          .success(function(data) {
                defered.resolve(data);
          })
          .error(function(err) {
                defered.reject(err)
          });
        return promise;
    }



}])
.service('schemaModel', function ($optimumModel) {
	var model = new $optimumModel();
	model.url = '/api/schema';
	model.constructorModel = ['name'];
	return model;
})

.config(function ($routeProvider) {
 	$routeProvider
 		.when('/relationship', {
 		    templateUrl: '/javascripts/setup/relationship/templates/relationshipFrame.html',
 			controller: 'relationshipController',
 			access: {
 				 restricted: false,
 				 rol: 5
 			}
 		});
 })
.controller('selectTemplatesController', ['$scope', 'templateFactory','$ngBootbox','$location','$route', function ($scope, templateFactory,$location,$route) {
    templateFactory.allLayouts().then(function (data) {
        $scope.layouts = data;
    });
    $scope.selectTemplate = function (layout, index) {
        $scope.template = layout;
        $scope.index = index;
        templateFactory.setValue(layout.label).then(function(result){
            if(result == true){
                location.reload();
            }
        });
    };
}])
    .factory('templateFactory', ['$q', '$http', function ($q, $http) {
        return ({
            allLayouts: allLayouts,
            setValue: setValue
        });

        function allLayouts() {
            var defered = $q.defer();
            var promise = defered.promise;

            $http.get('/setup/layouts')
                .success(function (data) {
                    defered.resolve(data);
                })
                .error(function (err) {
                    defered.reject(err)
                });

            return promise;
        }

        function setValue(template) {
            var deferred = $q.defer();
            $http.put('/config/updateTemplate', {
                template: template
            })
                .success(function (data, status) {
                    deferred.resolve(data);
                })
                .error(function (data) {
                    deferred.reject();
                });
            return deferred.promise;

        }
    }])
.config(function ($routeProvider) {
 	$routeProvider
 		.when('/selectTemplates', {
 			templateUrl: '/javascripts/setup/selectTemplates/templates/selectTemplates.html',
 			controller: 'selectTemplatesController',
 			access: {
 				restricted: false,
 				rol: 5
 			}
 		});
 })


.controller('uploadTemplatesController',
    ['$scope','uploadTemplatesService',
        function ($scope,uploadTemplatesService) {
            $scope.spinner = false;
            $scope.save = function(){
                $scope.spinner = true;
                var edit = (($scope.file.name).toLowerCase()).replace(/ /g,"-");
                edit = edit.replace(/.zip/g,"");
                console.log(edit);
                uploadTemplatesService.save($scope.file,edit).then(function(data){
                    $scope.spinner = false;
                    $scope.result = data;
                });
              
            };

}])
.directive('uploaderModel', ["$parse", function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, iElement, iAttrs) 
        {
            iElement.on("change", function(e)
            {
                $parse(iAttrs.uploaderModel).assign(scope, iElement[0].files[0]);
            });
        }
    };
}])
.factory('uploadTemplatesService',
  ['$q','$http',
  function ($q,$http) {

  	return ({
      save: save
    });

    
  	function save(file,name) {
      var defered = $q.defer();
      var promise = defered.promise;
      var formData = new FormData();
      formData.append("file", file);
      formData.append("name", name);
      $http.post('/config/upload',formData, {
      headers: {
        "Content-type": undefined
      },
      transformRequest: angular.identity
    })
        .success(function (data, status) {
          defered.resolve(data);
        })
        .error(function (data) {
          defered.reject();
        });
        return promise;
    }
}])
.config(function ($routeProvider) {
 	$routeProvider
 		.when('/uploadTemplates', {
 			templateUrl: '/javascripts/setup/upload/templates/uploadTemplates.html',
 			controller: 'uploadTemplatesController',
 			access: {
 				restricted: false,
 				rol: 5
 			}
 		});
 })