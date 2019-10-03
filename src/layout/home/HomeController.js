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

                newTab.snapshots = [
                    (function(){ let option = new SnapshotItem(); option.tabId = newTab.id; option.title = `Tab ${newTab.id} >> Snapshot #${option.id}`; return option })(),
                    (function(){ let option = new SnapshotItem(); option.tabId = newTab.id; option.title = `Tab ${newTab.id} >> Snapshot #${option.id}`; return option })(),
                    (function(){ let option = new SnapshotItem(); option.tabId = newTab.id; option.title = `Tab ${newTab.id} >> Snapshot #${option.id}`; return option })()
                ];

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

        $scope.getSnapshotById = function(snapId){
            let tab = $scope.tabs.find(tabItem => {
                
                //Get snap
                return snap.id === tabId
            })
            return tab;
        };

        //#C - Tabset - Edit Tab
        $scope.triggerToolboxTabEdit = function(type, item){
            //TODO - get snap
            let newEditingElement = new EditingElement(type, item);
            
            $scope.toggleToolbox(true, newEditingElement);
        };

        /**
         * Handler functions - <toolbox>
         */
        $scope.toggleTools = false;
        //#A - Closes mobile menu when opening new views
        $scope.closeToolbox = function(){   
            $scope.toggleTools = false;        
        }             
        //#B - Toogle toolbox with a specific element 
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


