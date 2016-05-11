 angular.module('appAngular', ['ngRoute', 'angular-table','ngBootbox','ui.bootstrap','optimumModel','ngSanitize', 'ui.select','dndLists','btford.socket-io'])
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
 			itemsPerPage = 10;
 			maxPages = 5;
 		} else {
 			//PC
 			itemsPerPage = 20;
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
.service('controlesModel', function ($optimumModel,pacientesModel) {
  var model = new $optimumModel();
  model.url = '/api/controles';
  model.constructorModel = ["pacientes","fecha"];
 model.dependencies = {pacientes:pacientesModel.url};
  return model;
})
.service('conversorcabecerasModel', function ($optimumModel) {
  var model = new $optimumModel();
  model.url = '/api/conversorcabeceras';
  model.constructorModel = ["IdFormato","NombreFormato","DescripcionFormato","Cabecera","Pie","Separador","FormatoConversion","Formato_destino","Tipo_Proceso","NombreObjeto","estado","tipo_archivo_salida","ORIENTACION","RutinaPrevalidacion","Unificador","Check_Totales_Por","ValidaIdentificacion","RutinaPreconversion","InfiereTipoIdCliente","MuestraCabeceraColumna","TipoConversion"];
  return model;
})
.service('conversordetallesModel', function ($optimumModel) {
  var model = new $optimumModel();
  model.url = '/api/conversordetalles';
  model.constructorModel = ["IdDetalle","IdFormato","TipoRegistro","NumeroCampo","PosicionInicio","LongitudCampo","TipoCampo","SeparadorDecimales","NumeroDecimales","DescripcionCampo","IdCampoEquivalente","CampoEquivalente","Obligatorio","Validaciones","Tipo_Registro","Default_Value","observacion","Rutina_Validacion","Rutina_Transformacion","CaracterConcatenacion","OrdenCampo","Rutina_Conversion","ValidaEnMasivas"];
  return model;
})
.service('pacientesModel', function ($optimumModel) {
  var model = new $optimumModel();
  model.url = '/api/pacientes';
  model.constructorModel = ["nombres","edad"];
  return model;
})
.service('UsersModel', function ($optimumModel) {
	var model = new $optimumModel();
	model.url = '/api/users';
	model.constructorModel = ['username','password','rol'];
	return model;
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
.controller('controlesController',
  ['$rootScope','$scope', '$location', 'controlesModel','$uibModal',
  function ($rootScope,$scope, $location, controlesModel,$uibModal) {
    $scope.titleController = 'MEAN-CASE SUPER HEROIC';
    $rootScope.titleWeb = 'controles';
    $scope.preloader = true;
    $scope.msjAlert = false;
    controlesModel.getAll().then(function(data) {
      $scope.controlesList = data;
      $scope.controlesTemp = angular.copy($scope.controlesList);
      $scope.preloader = false;
    });
    /*  Modal */
     $scope.open = function (item) {
       var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'templates/controles/modalCreate.html',
        controller: 'modalcontrolesCreateController',
        size: 'lg',
        resolve: {
         item: function () {
          return item;
         }
        }
      });
      modalInstance.result.then(function(data) {
           controlesModel.getAll().then(function(d) {
             $scope.controlesList = d;
             $scope.controlesTemp = angular.copy($scope.controlesList);
           });
      },function(result){
      $scope.controlesList = $scope.controlesTemp;
      $scope.controlesTemp = angular.copy($scope.controlesList);
    });
  };
  /*  Delete  */
  $scope.openDelete = function (item) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'templates/controles/modalDelete.html',
      controller: 'modalcontrolesDeleteController',
      size: 'lg',
      resolve: {
        item: function () {
           return item;
        }
      }
    });
    modalInstance.result.then(function(data) {
      var idx = $scope.controlesList.indexOf(data);
      $scope.controlesList.splice(idx, 1);
      controlesModel
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
.controller('modalcontrolesCreateController',
  ['$scope', '$uibModalInstance', 'item','controlesModel','$filter',"pacientesModel",
  function ($scope, $uibModalInstance, item,controlesModel,$filter,pacientesModel) {
    $scope.item = item;
    $scope.saving = false;
    if(item){
      item.dateAsString1 = $filter("date")(item.fecha, "yyyy-MM-dd");
       //add optional code
    }
    $scope.save = function () {
      if(!item){
        $scope.saving = true;
        item = {fecha: $scope.item.fecha};
        var controles = controlesModel.create();
        controles.pacientes = $scope.item.pacientes;
        controles.fecha = $scope.item.fecha;
        controles.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }else{
        if($scope.item.fecha === undefined){
          $scope.item.fecha = Date.parse(item.dateAsString1);
          $scope.item.fecha = new Date($scope.item.fecha);
          $scope.item.fecha = $scope.item.fecha.setDate($scope.item.fecha.getDate() + 1);
        }
        controlesModel.findById($scope.item._id);
        controlesModel.pacientes =  $scope.item.pacientes;
        controlesModel.fecha = $scope.item.fecha;
        controlesModel.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }
    };
    pacientesModel.getAll().then(function(data) {
      $scope.pacientes = data;
    });
}])
.controller('modalcontrolesDeleteController',
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
    .when('/controles', {
      templateUrl: '/templates/controles/index.html',
      controller: 'controlesController',
      access: {
        restricted: false,
       rol: 1
      }
    });
 })
.controller('conversorcabecerasController',
  ['$rootScope','$scope', '$location', 'conversorcabecerasModel','$uibModal',
  function ($rootScope,$scope, $location, conversorcabecerasModel,$uibModal) {

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
    obtenerCabeceras();

    $scope.obtenerDetalles = function(idFormato){
      $location.url('/conversordetalles/'+idFormato);
      /*conversorcabecerasModel.url = '/api/conversorcabeceras/detalles';
      conversorcabecerasModel.findById(idFormato).then(function(detalles){
        
        //$location.url('/conversorcabeceras/detalles');
        $scope.conversoDetalles = detalles;
        console.log($scope.conversoDetalles);
      });*/
      
     
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
      },function(result){
      $scope.conversorcabecerasList = $scope.conversorcabecerasTemp;
      $scope.conversorcabecerasTemp = angular.copy($scope.conversorcabecerasList);
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
       //add optional code
    }
    $scope.save = function () {
      if(!item){
        $scope.saving = true;
        item = {IdFormato: $scope.item.IdFormato,NombreFormato: $scope.item.NombreFormato,DescripcionFormato: $scope.item.DescripcionFormato,Cabecera: $scope.item.Cabecera,Pie: $scope.item.Pie,Separador: $scope.item.Separador,FormatoConversion: $scope.item.FormatoConversion,formato_destino: $scope.item.formato_destino,Tipo_Proceso: $scope.item.Tipo_Proceso,NombreObjeto: $scope.item.NombreObjeto,estado: $scope.item.estado,tipo_archivo_salida: $scope.item.tipo_archivo_salida,ORIENTACION: $scope.item.ORIENTACION,RutinaPrevalidacion: $scope.item.RutinaPrevalidacion,Unificador: $scope.item.Unificador,Check_Totales_Por: $scope.item.Check_Totales_Por,ValidaIdentificacion: $scope.item.ValidaIdentificacion,RutinaPreconversion: $scope.item.RutinaPreconversion,InfiereTipoIdCliente: $scope.item.InfiereTipoIdCliente,MuestraCabeceraColumna: $scope.item.MuestraCabeceraColumna,TipoConversion: $scope.item.TipoConversion};
        var conversorCabeceras = conversorcabecerasModel.create();
        conversorCabeceras.IdFormato = $scope.item.IdFormato;
        conversorCabeceras.NombreFormato = $scope.item.NombreFormato;
        conversorCabeceras.DescripcionFormato = $scope.item.DescripcionFormato;
        conversorCabeceras.Cabecera = $scope.item.Cabecera;
        conversorCabeceras.Pie = $scope.item.Pie;
        conversorCabeceras.Separador = $scope.item.Separador;
        conversorCabeceras.FormatoConversion = $scope.item.FormatoConversion;
        conversorCabeceras.formato_destino = $scope.item.formato_destino;
        conversorCabeceras.Tipo_Proceso = $scope.item.Tipo_Proceso;
        conversorCabeceras.NombreObjeto = $scope.item.NombreObjeto;
        conversorCabeceras.estado = $scope.item.estado;
        conversorCabeceras.tipo_archivo_salida = $scope.item.tipo_archivo_salida;
        conversorCabeceras.ORIENTACION = $scope.item.ORIENTACION;
        conversorCabeceras.RutinaPrevalidacion = $scope.item.RutinaPrevalidacion;
        conversorCabeceras.Unificador = $scope.item.Unificador;
        conversorCabeceras.Check_Totales_Por = $scope.item.Check_Totales_Por;
        conversorCabeceras.ValidaIdentificacion = $scope.item.ValidaIdentificacion;
        conversorCabeceras.RutinaPreconversion = $scope.item.RutinaPreconversion;
        conversorCabeceras.InfiereTipoIdCliente = $scope.item.InfiereTipoIdCliente;
        conversorCabeceras.MuestraCabeceraColumna = $scope.item.MuestraCabeceraColumna;
        conversorCabeceras.TipoConversion = $scope.item.TipoConversion;
        console.log(conversorCabeceras);
        conversorCabeceras.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }else{
        conversorCabecerasModel.findById($scope.item.IdFormato);
        conversorCabecerasModel.IdFormato = $scope.item.IdFormato;
        conversorCabecerasModel.NombreFormato = $scope.item.NombreFormato;
        conversorCabecerasModel.DescripcionFormato = $scope.item.DescripcionFormato;
        conversorCabecerasModel.Cabecera = $scope.item.Cabecera;
        conversorCabecerasModel.Pie = $scope.item.Pie;
        conversorCabecerasModel.Separador = $scope.item.Separador;
        conversorCabecerasModel.FormatoConversion = $scope.item.FormatoConversion;
        conversorCabecerasModel.formato_destino = $scope.item.formato_destino;
        conversorCabecerasModel.Tipo_Proceso = $scope.item.Tipo_Proceso;
        conversorCabecerasModel.NombreObjeto = $scope.item.NombreObjeto;
        conversorCabecerasModel.estado = $scope.item.estado;
        conversorCabecerasModel.tipo_archivo_salida = $scope.item.tipo_archivo_salida;
        conversorCabecerasModel.ORIENTACION = $scope.item.ORIENTACION;
        conversorCabecerasModel.RutinaPrevalidacion = $scope.item.RutinaPrevalidacion;
        conversorCabecerasModel.Unificador = $scope.item.Unificador;
        conversorCabecerasModel.Check_Totales_Por = $scope.item.Check_Totales_Por;
        conversorCabecerasModel.ValidaIdentificacion = $scope.item.ValidaIdentificacion;
        conversorCabecerasModel.RutinaPreconversion = $scope.item.RutinaPreconversion;
        conversorCabecerasModel.InfiereTipoIdCliente = $scope.item.InfiereTipoIdCliente;
        conversorCabecerasModel.MuestraCabeceraColumna = $scope.item.MuestraCabeceraColumna;
        conversorCabecerasModel.TipoConversion = $scope.item.TipoConversion;
        conversorCabecerasModel.save().then(function(r){
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
      conversordetallesModel.url = '/api/conversordetalles';
      conversordetallesModel.findById($routeParams.idFormato).then(function(detalles){
              console.log(detalles);
              $scope.conversordetallesList = detalles;
              $scope.conversordetallesTemp = angular.copy($scope.conversordetallesList);
              $scope.preloader = false;
      });

    console.log($routeParams.idFormato);
    /*  Modal */
     $scope.open = function (item) {
       var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'templates/conversordetalles/modalCreate.html',
        controller: 'modalconversordetallesCreateController',
        size: 'lg',
        resolve: {
         item: function () {
          return item;
         }
        }
      });
      modalInstance.result.then(function(data) {
        if(!item) {
           $scope.conversordetallesList.push(data);
           $scope.conversordetallesTemp = angular.copy($scope.conversordetallesList);
        }
      },function(result){
      $scope.conversordetallesList = $scope.conversordetallesTemp;
      $scope.conversordetallesTemp = angular.copy($scope.conversordetallesList);
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
.controller('modalconversordetallesCreateController',
  ['$scope', '$uibModalInstance', 'item','conversordetallesModel','$filter',
  function ($scope, $uibModalInstance, item,conversordetallesModel,$filter) {
    $scope.item = item;
    $scope.saving = false;
    if(item){
       //add optional code
    }
    $scope.save = function () {
      if(!item){
        $scope.saving = true;
        item = {IdDetalle: $scope.item.IdDetalle,IdFormato: $scope.item.IdFormato,TipoRegistro: $scope.item.TipoRegistro,NumeroCampo: $scope.item.NumeroCampo,PosicionInicio: $scope.item.PosicionInicio,LongitudCampo: $scope.item.LongitudCampo,TipoCampo: $scope.item.TipoCampo,SeparadorDecimales: $scope.item.SeparadorDecimales,NumeroDecimales: $scope.item.NumeroDecimales,DescripcionCampo: $scope.item.DescripcionCampo,IdCampoEquivalente: $scope.item.IdCampoEquivalente,CampoEquivalente: $scope.item.CampoEquivalente,Obligatorio: $scope.item.Obligatorio,Validaciones: $scope.item.Validaciones,Tipo_Registro: $scope.item.Tipo_Registro,Default_Value: $scope.item.Default_Value,observacion: $scope.item.observacion,Rutina_Validacion: $scope.item.Rutina_Validacion,Rutina_Transformacion: $scope.item.Rutina_Transformacion,CaracterConcatenacion: $scope.item.CaracterConcatenacion,OrdenCampo: $scope.item.OrdenCampo,Rutina_Conversion: $scope.item.Rutina_Conversion,ValidaEnMasivas: $scope.item.ValidaEnMasivas};
        var conversordetalles = conversordetallesModel.create();
        conversordetalles.IdDetalle = $scope.item.IdDetalle;
        conversordetalles.IdFormato = $scope.item.IdFormato;
        conversordetalles.TipoRegistro = $scope.item.TipoRegistro;
        conversordetalles.NumeroCampo = $scope.item.NumeroCampo;
        conversordetalles.PosicionInicio = $scope.item.PosicionInicio;
        conversordetalles.LongitudCampo = $scope.item.LongitudCampo;
        conversordetalles.TipoCampo = $scope.item.TipoCampo;
        conversordetalles.SeparadorDecimales = $scope.item.SeparadorDecimales;
        conversordetalles.NumeroDecimales = $scope.item.NumeroDecimales;
        conversordetalles.DescripcionCampo = $scope.item.DescripcionCampo;
        conversordetalles.IdCampoEquivalente = $scope.item.IdCampoEquivalente;
        conversordetalles.CampoEquivalente = $scope.item.CampoEquivalente;
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
        conversordetalles.ValidaEnMasivas = $scope.item.ValidaEnMasivas;
        conversordetalles.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }else{
        conversordetallesModel.findById($scope.item._id);
        conversordetallesModel.IdDetalle = $scope.item.IdDetalle;
        conversordetallesModel.IdFormato = $scope.item.IdFormato;
        conversordetallesModel.TipoRegistro = $scope.item.TipoRegistro;
        conversordetallesModel.NumeroCampo = $scope.item.NumeroCampo;
        conversordetallesModel.PosicionInicio = $scope.item.PosicionInicio;
        conversordetallesModel.LongitudCampo = $scope.item.LongitudCampo;
        conversordetallesModel.TipoCampo = $scope.item.TipoCampo;
        conversordetallesModel.SeparadorDecimales = $scope.item.SeparadorDecimales;
        conversordetallesModel.NumeroDecimales = $scope.item.NumeroDecimales;
        conversordetallesModel.DescripcionCampo = $scope.item.DescripcionCampo;
        conversordetallesModel.IdCampoEquivalente = $scope.item.IdCampoEquivalente;
        conversordetallesModel.CampoEquivalente = $scope.item.CampoEquivalente;
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
    .when('/conversordetalles/:idFormato', {
      templateUrl: '/templates/conversordetalles/index.html',
      controller: 'conversordetallesController',
      access: {
        restricted: false,
       rol: 1
      }
    });
 })
.controller('pacientesController',
  ['$rootScope','$scope', '$location', 'pacientesModel','$uibModal',
  function ($rootScope,$scope, $location, pacientesModel,$uibModal) {
    $scope.titleController = 'MEAN-CASE SUPER HEROIC';
    $rootScope.titleWeb = 'pacientes';
    $scope.preloader = true;
    $scope.msjAlert = false;
    pacientesModel.getAll().then(function(data) {
      $scope.pacientesList = data;
      $scope.pacientesTemp = angular.copy($scope.pacientesList);
      $scope.preloader = false;
    });
    /*  Modal */
     $scope.open = function (item) {
       var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'templates/pacientes/modalCreate.html',
        controller: 'modalpacientesCreateController',
        size: 'lg',
        resolve: {
         item: function () {
          return item;
         }
        }
      });
      modalInstance.result.then(function(data) {
        if(!item) {
           $scope.pacientesList.push(data);
           $scope.pacientesTemp = angular.copy($scope.pacientesList);
        }
      },function(result){
      $scope.pacientesList = $scope.pacientesTemp;
      $scope.pacientesTemp = angular.copy($scope.pacientesList);
    });
  };
  /*  Delete  */
  $scope.openDelete = function (item) {
    var modalInstance = $uibModal.open({
      animation: true,
      templateUrl: 'templates/pacientes/modalDelete.html',
      controller: 'modalpacientesDeleteController',
      size: 'lg',
      resolve: {
        item: function () {
           return item;
        }
      }
    });
    modalInstance.result.then(function(data) {
      var idx = $scope.pacientesList.indexOf(data);
      $scope.pacientesList.splice(idx, 1);
      pacientesModel
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
.controller('modalpacientesCreateController',
  ['$scope', '$uibModalInstance', 'item','pacientesModel','$filter',
  function ($scope, $uibModalInstance, item,pacientesModel,$filter) {
    $scope.item = item;
    $scope.saving = false;
    if(item){
       //add optional code
    }
    $scope.save = function () {
      if(!item){
        $scope.saving = true;
        item = {nombres: $scope.item.nombres,edad: $scope.item.edad};
        var pacientes = pacientesModel.create();
        pacientes.nombres = $scope.item.nombres;
        pacientes.edad = $scope.item.edad;
        pacientes.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }else{
        pacientesModel.findById($scope.item._id);
        pacientesModel.nombres = $scope.item.nombres;
        pacientesModel.edad = $scope.item.edad;
        pacientesModel.save().then(function(r){
          $scope.saving = false;
          $uibModalInstance.close(r);
        });
      }
    };
}])
.controller('modalpacientesDeleteController',
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
    .when('/pacientes', {
      templateUrl: '/templates/pacientes/index.html',
      controller: 'pacientesController',
      access: {
        restricted: false,
       rol: 2
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