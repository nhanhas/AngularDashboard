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
         * Handler functions - <tabset>
         */
        //#A - Tabset - Add new tab
        $scope.addNewTab = function(){
            let newTab = new TabItem();
            newTab.title = `Tab id: ${newTab.id}`;
            $scope.tabs.push(newTab);
        };

        //#B - Tabset - Get tab by id
        $scope.getTabById = function(tabId){
            let tab = $scope.tabs.find(tabItem => {
                return tabItem.id === tabId
            })
            return tab;
        };

        //#B - Tabset - Edit Tab
        $scope.triggerToolboxTabEdit = function(tabId){
            let newEditingElement = new EditingElement('TAB', $scope.getTabById(tabId));
            $scope.toggleToolbox(true, newEditingElement);
        };

        /**
         * Handler functions - <toolbox>
         */
        $scope.toggleTools = false;
        //Closes mobile menu when opening new views
        $scope.closeToolbox = function(){   
            $scope.toggleTools = false;        
        }             

        $scope.toggleToolbox = function(forceOpen = false, editingElement = undefined){
            if(editingElement)
                $scope.editingElement = editingElement //update editing element from directives
            $scope.toggleTools = !$scope.toggleTools || forceOpen;        
        } 

        
        
        //Initialize!
        $timeout( function(){
            $scope.initialize();
        },500);




    }]);


