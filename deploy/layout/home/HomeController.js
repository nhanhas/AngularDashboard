app
    .controller('HomeController', ['$rootScope', '$scope', '$controller', '$timeout', '$location', '$http','$q', 'FrameworkUtils', 'DashboardService',  function($rootScope, $scope, $controller,$timeout, $location, $http, $q, FrameworkUtils, DashboardService) {

         
        /**
         * Controller Variables
         */
        
        $scope.tabs = [
            { title:'Dynamic Title 1', content:'Dynamic content 1' },
            { title:'Dynamic Title 2', content:'Dynamic content 2', disabled: true }
          ];

        /**
         * Initialize main function
         */
        $scope.initialize = function(){
          
        }



       /**
        * Controller Functions 
        */

        
        
        //Initialize!
        $timeout( function(){
            $scope.initialize();
        },500);

    }]);


