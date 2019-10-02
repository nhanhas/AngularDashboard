app
    .controller('HomeController', ['$rootScope', '$scope', '$controller', '$timeout', '$location', '$http','$q', 'FrameworkUtils', 'DashboardService',  function($rootScope, $scope, $controller,$timeout, $location, $http, $q, FrameworkUtils, DashboardService) {

         
        /**
         * Controller Variables
         */
        
        $scope.tabs = [
            
          ];

        /**
         * Initialize main function
         */
        $scope.initialize = function(){

            //#DEVELOPMENT - generate 5 tabs
            for(var i = 0; i < 5; i++){
                let newTab = new TabItem();
                newTab.title = `Tab id: ${newTab.id}`;
                $scope.tabs.push(newTab);
            }
        }

        

        /**
         * Handler functions
         */
        //#A - Tabset - Add new tab
        $scope.addNewTab = function(){
            let newTab = new TabItem();
            newTab.title = `Tab id: ${newTab.id}`;
            $scope.tabs.push(newTab);
        };

        //#B - Tabset - Edit Tab
        $scope.editTab = function(tabId){
            alert(tabId);
        };




        
        
        //Initialize!
        $timeout( function(){
            $scope.initialize();
        },500);

//Mobile menu default = hidden
$scope.toggleNav = false;
  
//Hamburger icon default
$scope.animate = false;

//Closes mobile menu when opening new views
$scope.close = function(){
  $scope.toggleNav = false;
  $scope.animate = false;
} 


    }]);


