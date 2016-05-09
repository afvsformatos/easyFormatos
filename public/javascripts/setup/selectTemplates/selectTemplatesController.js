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