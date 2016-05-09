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
