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