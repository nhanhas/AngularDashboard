app
    .controller('HomeController', ['$rootScope', '$scope', '$controller', '$timeout', '$location', '$http','$q', 'FrameworkUtils', 'DashboardService',  function($rootScope, $scope, $controller,$timeout, $location, $http, $q, FrameworkUtils, DashboardService) {

         
        /**
         * Controller Variables
         */
        
        $scope.dashboards = [];
        $scope.dataSource = undefined;
        $scope.userInfo = {};
        $scope.toolboxOpened = false;

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

            // #2 - user info
            $scope.userInfo = {
                username: 'Manuel Vaz',
                surname: 'Silva',
                address: 'Av. da Liberdade, 2655-300 Lisboa',
                company: 'Singular Data',
                password: '',
                newpw: ''
            }

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

        //#B - Tabset - Edit Tab and Chart
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
            $scope.toolboxOpened = false;
            $scope.toggleTools = false;        
        }             
        //#B - Toogle toolbox with a specific element 
        $scope.toggleToolbox = function(forceOpen = false, editingElement = undefined){
            $scope.toolboxOpened = true;

            if(editingElement)
                $scope.editingElement = editingElement //update editing element from directives
            $scope.toggleTools = !$scope.toggleTools || forceOpen;        
        } 

        //#C - Is toolbox opened
        $scope.isToolboxOpened = function(){
            return $scope.toolboxOpened;
        }
        
        /**
         * Chart configs server sync
         */
        // create chart config
        $scope.createChartConfig = function(chartConfig){
            return DashboardService.createChart(chartConfig).then(result => {                
                console.log(result);
                return result;
            })
        };

        // update chart config
        $scope.updateChartConfig = function(chartConfig){            
            return DashboardService.updateChart(chartConfig).then(result => {                
                console.log(result);
                return result;
            })
        };

        // delete chart config
        $scope.deleteChartConfig = function(chartConfig, dashboard){
            //return new Promise((resolve, reject) => { resolve( true ); }); 
            return DashboardService.deleteChart(chartConfig.chartConfigId).then(result => {                
                if(result === true){                                       
                    $scope.closeToolbox();                                   
                }
                return result;
            })
            
        }

        //Initialize!
        $timeout( function(){
            $scope.initialize();
        },500);




    }]);


