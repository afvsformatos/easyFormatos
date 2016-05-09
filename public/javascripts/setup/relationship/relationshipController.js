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