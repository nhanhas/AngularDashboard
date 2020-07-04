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
                scope.data = 0;
                scope.endDate = new Date();
                scope.startDate = new Date();
                scope.startDate.setMonth(scope.endDate.getMonth() - 6);



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
                    // list and tables
                    if(scope.config.snapshotType === 1 || scope.config.snapshotType === 2){
                        return DashboardService.fecthTableResultByIdDates(scope.startDate, scope.endDate, scope.config.snapshotConfigId).then(result => {
                            // run  setup
                            scope.setupSnapshot(result);
                        })
                    }else{
                        // otherwise gauges or cards
                        return DashboardService.fecthChartResultByIdDates(scope.startDate, scope.endDate, scope.config.snapshotConfigId).then(result => {
                            // run  setup
                            scope.setupSnapshot(result);
                        })
                    }
                    
                                          
                }

                // setup chart config
                scope.setupSnapshot = function(snapshotResults){                    
                                      
                    // run setup according snapshot type
                    switch (scope.config.snapshotType) {
                        // card
                        case 0:
                            scope.cardSnapshotSetup(scope.config, snapshotResults);
                            break;
                        // table
                        case 1:
                            scope.tableSnapshotSetup(scope.config, snapshotResults);
                            break;
                        // list 
                        case 2:
                            scope.listSnapshotSetup(scope.config, snapshotResults);
                            break;                    
                        // gauge 
                        case 3:
                            scope.gaugeSnapshotSetup(scope.config, snapshotResults);
                            break;                            
                    }

                    // finished setup
                    scope.isLoading = false;
                }

                /**
                 * Setups for snapshot type
                 */
                //#1 - Card
                scope.cardSnapshotSetup = function(snapshotConfig, snapshotResults){
                    //Development test
                    /*scope.labels = "Service"
                    scope.data = "HPOASDA_12"*/

                    if(snapshotResults.datasets.length === 0) { return; }

                    const label = snapshotResults.datasets[0].label;
                    const data = snapshotResults.datasets.map(dataset => {
                        return dataset.data;
                    });
                    
                    scope.labels = label;
                    scope.data = !!data.length
                        ? data[0][0].y
                        : '';

                }
                
                //#2 - table           
                scope.tableSnapshotSetup = function(snapshotConfig, snapshotResults){
                        //Development test
                        /*snapshotResults = [
                            [
                              "NumaNodeCount",
                              "CPUSockets",
                              "IsPolyBaseInstalled",
                              "InMemorySupported",
                              "IsLocalDB",
                              "IsIntegratedSecurityOnly",
                              "IsAlwaysOnEnabled",
                              "HadrManagerStatus"
                            ],
                            [
                              0,
                              0,
                              0,
                              0,
                              0,
                              0,
                              0,
                              0
                            ],
                            [
                                1,
                                02,
                                04,
                                50,
                                60,
                                07,
                                032,
                                60
                              ]
                          ]*/

                        // headers
                        scope.columns = snapshotResults[0];
                        snapshotResults.shift();
                        
                        scope.data = snapshotResults;

                
                }

                //#3 - list
                scope.listSnapshotSetup = function(snapshotConfig, snapshotResults){
                    //Development test
                    /*snapshotResults = [
                        [
                          "NumaNodeCount",
                          "CPUSockets",
                          "IsPolyBaseInstalled",
                          "InMemorySupported",
                          "IsLocalDB",
                          "IsIntegratedSecurityOnly",
                          "IsAlwaysOnEnabled",
                          "HadrManagerStatus"
                        ],
                        [
                          0,
                          0,
                          0,
                          0,
                          0,
                          0,
                          0,
                          0
                        ],
                        [
                            1,
                            02,
                            04,
                            50,
                            60,
                            07,
                            032,
                            60
                          ]
                      ]*/

                    // headers
                    scope.columns = snapshotResults[0];
                    snapshotResults.shift();
                    
                    scope.data = snapshotResults;

            
            }

                //#4 - Gauge
                scope.gaugeSnapshotSetup = function(snapshotConfig, snapshotResults){
                    if(snapshotResults.datasets.length === 0) { return; }

                    const label = snapshotResults.datasets[0].label;
                    const data = snapshotResults.datasets.map(dataset => {
                        return dataset.data;
                    });
                    
                    scope.labels = label;
                    scope.data = !!data.length
                        ? data[0][0].y
                        : 0;
                }

                //#Aux - get backgroundColor
                scope.getBackgroundColor = function(){
                    return { 'background-color': `${scope.config.backgroundColor}` };
                }

                //#Aux - get color
                scope.getTextColor = function(){
                    return { 'color': `${scope.config.color}` };
                }

                //#Aux - get text size based on setting
                scope.getFontSize = function(){
                    return { 'font-size': `${scope.getSnapshotSetting('fontSize')}px` };
                }

                //#Aux - get snapshot setting by key
                scope.getSnapshotSetting = function(setting, isNumeric = false){
                    // get setting
                    let snapshotSetting = scope.config.settings.find(value => value.Key === setting);
                    if(snapshotSetting) { return snapshotSetting.Value; }

                    // if not found
                    return isNumeric 
                        ? 0
                        : '';

                }
                
                // setup snapshot! (change this for load snapshot data and then setup)
                scope.initialize();                

            }
        }
    }

]);

