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