app
    .controller('View2Controller', ['$scope', '$location', function($scope, $location) {

        $scope.navigate = function (path) {
            $location.path(path);
        };

    }]);


