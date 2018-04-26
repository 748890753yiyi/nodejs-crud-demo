function List ($scope, $http) {
$http.get('/groups/all').
    success(
    function(data, status, headers, config) {
       $scope.groups = data;
    });

 }

function CreateController($scope, $http,$location) {
    var group =
    {
       class_id: "",
       name: "",
        age:""
    };
    $scope.group = group;
    $scope.action = "Add" ;
    $scope.save = function() 
    {
          $http.post('/groups/add', $scope.group).
          success(
            function(data) {
                console.log(data.msg);
            $location.path('/');
        });
    }

}

function EditController($scope, $http,$location,$routeParams) {
    var  group=
    {
        class_id: "",
        name: "",
        age:""
    }

    $scope.group = group;
    $scope.action = "Edit" ;

    $http.get('/groups/' + $routeParams.id).
    success(
    function(data, status, headers, config) {
       $scope.group = data;

    });

    $scope.save = function() 
    {
          $http.put('/groups/edit/' + $routeParams.id, $scope.group).
          success(
            function(data) {
            console.log(data.msg);
            $location.path('/');
        });
    }
}

function DeleteController($scope, $http,$location,$routeParams){
    $scope.action = "Delete" ;
    $http.put('/groups/delete/' + $routeParams.id).
        success(
        function(data) {
            console.log(data.msg);
            $location.path('/');
        });
}


