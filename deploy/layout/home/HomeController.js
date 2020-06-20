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

                    $q.all([
                        // Charts
                        DashboardService.getDashboardItems(dashboard.id).then(chartsResult => {
                            dashboard.charts = chartsResult;
                        }),

                        // snapshots
                        DashboardService.getSnapshotsByDashboard(dashboard.id).then(snapshotResults => {
                            dashboard.snapshots = snapshotResults;
                        }),

                    ]).then(_ => {
                        // ready to show
                        
                        // visuals - TODO service
                        dashboard.visuals = [];
                    })
                    
                })

            })
           
            //DashboardService.getAuthToken().then(result => {  });
            

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
         * DataSets server sync
         */
        $scope.updateDataSources = function(fields){
            return DashboardService.updateDataSourcesSets(fields).then(result => {                
                console.log(result);
                return result;
            })
        }

        /**
         * Dashboard config server sync
         */
        $scope.updateDashboard = function(id, name){
            return DashboardService.updateDashboard(id, name).then(result => {                
                console.log(result);
                return result;
            })
        }

        $scope.deleteDashboard = function(id){
            return DashboardService.deleteDashboard(id).then(result => {                
                console.log(result);
                
                if(result === true){
                    // delete tab and select another one
                    $scope.dashboards = $scope.dashboards.filter(dashboard => dashboard.id !== id)
                    $scope.closeToolbox();   
                }

                
                return result;
            })
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
            // remove now if is an unsaved chart
            if(chartConfig.chartConfigId === 0){ 
                return new Promise((resolve, reject) => { 
                    $scope.closeToolbox();   
                    resolve( true ); 
                }) 
            }; 

            // otherwise remove it on server
            return DashboardService.deleteChart(chartConfig.chartConfigId).then(result => {                
                if(result === true){                                       
                    $scope.closeToolbox();                                   
                }
                return result;
            })
            
        }

        /**
         * Snapshot config server sync
         */
        // create snapshot config
        $scope.createSnapshotConfig = function(snapshotConfig){
            // force all Setting to string value
            snapshotConfig.settings.forEach(value => value.Value = String(value.Value));
            
            return DashboardService.createSnapshot(snapshotConfig).then(result => {                
                console.log(result);
                return result;
            })
        };

        // update snapshot config
        $scope.updateSnapshotConfig = function(snapshotConfig){        
            // force all Setting to string value
            snapshotConfig.settings.forEach(value => value.Value = String(value.Value));

            return DashboardService.updateSnapshot(snapshotConfig).then(result => {                
                console.log(result);
                return result;
            })
        };

        // delete snapshot config
        $scope.deleteSnapshotConfig = function(snapshotConfig, dashboard){
            // remove now if is an unsaved snapshot
            if(snapshotConfig.snapshotConfigId === 0){ 
                return new Promise((resolve, reject) => { 
                    $scope.closeToolbox();   
                    resolve( true ); 
                }) 
            }; 

            // otherwise remove it on server
            return DashboardService.deleteSnapshot(snapshotConfig.snapshotConfigId).then(result => {                
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


