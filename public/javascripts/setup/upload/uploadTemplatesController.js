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