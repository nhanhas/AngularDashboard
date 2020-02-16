app
    .controller('HomeController', ['$rootScope', '$scope', '$controller', '$timeout', '$location', '$http','$q', 'FrameworkUtils', 'DashboardService',  function($rootScope, $scope, $controller,$timeout, $location, $http, $q, FrameworkUtils, DashboardService) {

         
        /**
         * Controller Variables
         */
        
        $scope.dashboards = [];
        $scope.dataSource = {};
     

        /**
         * Initialize main function
         */
        $scope.initialize = function(){

            // #1 - get available dashboards
            DashboardService.getDashboards().then(result => {
                $scope.dashboards = result;    

                // #2 - get charts by dashboard
                $scope.dashboards.forEach(dashboard => {
                    DashboardService.getDashboardItems(dashboard.id).then(chartsResult => {
                        dashboard.charts = chartsResult;
                    })
                })

            })

        }

        

        /**
         * Handler functions - <tabset>
         */
        //#A - Tabset - Add new tab
        $scope.addNewTab = function(){
            DashboardService.createDashboard('New').then(result =>{
                // #1 - Add a new successfull dashboard
                $scope.dashboards.push(result);
            })

            /*let newTab = new DashboardItem();
            newTab.title = `Tab id: ${newTab.id}`;
            $scope.tabs.push(newTab);*/
        };

        //#B - Tabset - Edit Tab and Snapshot
        $scope.triggerToolboxTabEdit = function(type, item){
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


