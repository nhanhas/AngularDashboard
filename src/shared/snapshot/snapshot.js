/**
 * This component will be used to draw Snapshot
 */
app
    .directive('snapshot', ['$timeout', 'DashboardService', function($timeout, DashboardService) {
        return {
            restrict: 'EA',
            scope: {
                config : '=' , //SnapshotConfigItem object,
                onDeleteSnapshot: '&?',
                onTriggerToolbox: '&?'       //Triggers the edition tab
            },
            templateUrl: 'shared/snapshot/snapshot.html',

            link: function (scope, element, attrs) {
                scope.isLoading = false;

                if (!attrs.onDeleteSnapshot) {
                    scope.onDeleteSnapshot = undefined;
                }

                if (!attrs.onTriggerToolbox) {
                    scope.onTriggerToolbox = undefined;
                }

                // to prevent force to re-render chart
                scope.$watch('config.toUpdateView', function (newValue, oldValue, scope) {
                    if(newValue){
                        console.log('Reloading snapshot...')
                        scope.initialize().then(result => {
                            scope.config.toUpdateView = false;
                        });
                        
                    }
                });
             
                // Dates Range
                scope.endDate = new Date();
                scope.startDate = new Date();
                scope.startDate.setMonth(scope.endDate.getMonth() - 1);



                //#A - Trigger Toolbox Opening to edit chart
                scope.triggerToolbox = function(){
                    if(scope.onTriggerToolbox){
                        scope.onTriggerToolbox({item : scope.config});
                    }  
                }

                //#B - Trigger Popup to delete Snapshot
                scope.onDeleteSnapshotHandler = function(){
                    if(window.confirm("Are you sure to delete Snapshot?")){
                        if(scope.onDeleteSnapshot){
                            scope.onDeleteSnapshot({snapshotConfig : scope.config});
                        }  
                    }
                }
                
                /**
                 * [Main] - Fetch chart result
                 */
                scope.initialize = function(){
                    scope.isLoading = true;

                    return DashboardService.fecthChartResultByIdDates(scope.startDate, scope.endDate, scope.config.snapshotConfigId).then(result => {
                        

                        // run chart setup
                        scope.setupSnapshot(result);
                    })
                                          
                }

                // setup chart config
                scope.setupSnapshot = function(chartResults){                    
                                      
                    // finished setup
                    scope.isLoading = false;
                }

                /**
                 * Setups for snapshot type
                 */
                                
               

                //#Aux - get backgroundColor
                scope.getBackgroundColor = function(){
                    return { 'background-color': `${scope.config.backgroundColor}` };
                }

                //#Aux - get color
                scope.getTextColor = function(){
                    return { 'color': `${scope.config.color}` };
                }

                
                // setup snapshot! (change this for load snapshot data and then setup)
                scope.initialize();                

            }
        }
    }

]);

