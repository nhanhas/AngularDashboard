/**
 * This component will be used to draw Tabset 
 * with his own tabs
 */
app
    .directive('tabset', ['$timeout', 'FrameworkUtils', function($timeout, FrameworkUtils) {
        return {
            restrict: 'EA',
            transclude: true,                            
            scope: {
                tabCollection : '=',  //Tab collection
                onAddNew: '&?',       //Handler for add new Tab
                onTriggerToolbox: '&?',       //Triggers the edition tab
                onChangeChartPosition: '&?',       //on change chart position
                onChangeSnapshotPosition: '&?',       //on change chart position
                onDeleteChart: '&?',       //on change chart position    
                onDeleteSnapshot: '&?'       //on change Snapshot position                
            },
            templateUrl: 'shared/tabset/tabset.html',

            link: function (scope, element, attrs) {
                scope.FrameworkUtils = FrameworkUtils;

                //#1 - Initialize attrs
                scope.tabCollection = scope.tabCollection || [];
                
                if (!attrs.onAddNew) {
                    scope.onAddNew = undefined;
                }

                if (!attrs.onTriggerToolbox) {
                    scope.onTriggerToolbox = undefined;
                }

                if (!attrs.onChangeChartPosition) {
                    scope.onChangeChartPosition = undefined;
                }

                if (!attrs.onChangeSnapshotPosition) {
                    scope.onChangeSnapshotPosition = undefined;
                }                

                if (!attrs.onDeleteChart) {
                    scope.onDeleteChart = undefined;
                }

                if (!attrs.onDeleteSnapshot) {
                    scope.onDeleteSnapshot = undefined;
                }

                scope.reload = function(tab){
                    let charts = angular.copy(tab.charts);
                    charts.splice(1,1);
                    tab.charts = [];

                    $timeout(()=>{
                        tab.charts = charts
                    }, 2000)

                }

                /**
                 * #2 - Controller variables                 
                 */
                //Wich tab is active
                scope.activeTab = 1;

                // Gridstack configuration
                scope.gridStackOptions = {
                    cellHeight: 50,
                    verticalMargin: 10,
                    acceptWidgets: '.chart-config-element',
                    float: true,
                    resizable: {
                        handles: 'e, se, s, sw, w'
                      },
                };


                /**
                 * #3 - Handlers 
                 */
                //#A - Add new Tab
                scope.addNewTabHandler = function(event){                    
                    if(scope.onAddNew){
                        scope.onAddNew();
                    }                    
                }

                //#B - Trigger Toolbox Opening to edit Tab
                scope.triggerToolbox = function(type, item){
                    if(scope.onTriggerToolbox){
                        scope.onTriggerToolbox({type : type, item : item});
                    }  
                }


                /**
                 * Drag and Drop Handlers
                 * 
                 */
                // Flag this change by user mannualy
                scope.onDragStart = function(event, ui) {
                    scope.userChangedItem = true;
                };

                // Flag this change by user mannualy
                scope.onResizeStart = function(event, ui) {
                    scope.userChangedItem = true;
                };
                
                // re-position and resize chart
                scope.onChange = function(event, items) {
                    // if wasnt from user 
                    if(!scope.userChangedItem) return;

                    items.forEach(item => {
                        const {itemType, itemConfig} = JSON.parse(item.el[0].attributes['gs-item'].value);
                        
                        // Different updates for different item configs:
                        // ChartConfig
                        if(itemType === ChartConfigItem.name && itemConfig.chartConfigId !== 0){ return scope.requestChartUpdate(itemConfig) }

                        // SnapshotConfig
                        if(itemType === SnapshotConfigItem.name && itemConfig.snapshotConfigId !== 0){ return scope.requestSnapshotUpdate(itemConfig) }
                                                
                    });
                    scope.userChangedItem = false;

                };

                /**
                 * Drop from item config 
                 * from Toolbox
                 */
                scope.onDropComplete=function( data, event, tab){
                    console.log("drop success, data:", data, tab);
                    
                    // handler for chart config item
                    if(data instanceof ChartConfigItem){ return scope.addChartConfigItem(tab, data) }
                    
                    // visual items 
                    if(data instanceof TextConfigItem){ return scope.addVisualConfigItem(tab, data) }

                    // snapshot items 
                    if(data instanceof SnapshotConfigItem){ return scope.addSnapshotConfigItem(tab, data) }
                    
                }

                /**
                 * Chart config item
                 */
                scope.addChartConfigItem = function(tab, chartConfig){
                    // initiate visuals
                    chartConfig.posX = 0;
                    chartConfig.posY = 0;
                    chartConfig.width = 0;
                    chartConfig.heigth = 0;            
                    chartConfig.chartSetId = tab.id;        
                    chartConfig.backgroundColor = '#FFFFFF';

                    // push it to dashboard items
                    tab.charts.push(chartConfig);     
                    
                    // open toolbox in edit mode
                    scope.triggerToolbox('CHART', chartConfig);
                }

                // Delete chart config
                scope.onDeleteChartHandler = function(chartConfig, tab){                    
                    if(scope.onDeleteChart){
                        scope.onDeleteChart({chartConfig: chartConfig, dashboard: tab}).then(result => {
                            if(result){
                                scope.deleteChartFromTab(chartConfig, tab);                                
                            }
                        })
                    }
                }

                // delete from local chart array
                scope.deleteChartFromTab = function(chartConfig, tab){
                    let charts = angular.copy(tab.charts);
                    charts = charts.filter(chart => chart.chartConfigId !== chartConfig.chartConfigId );
                    tab.charts = [];
                    $timeout(()=>{
                        tab.charts = charts;                                
                    });
                }

                // Request homecontroller update chart on server
                scope.requestChartUpdate = function(chartConfig){
                    if(scope.onChangeChartPosition){
                        scope.onChangeChartPosition({ chartConfig: chartConfig }).then(result => {
                            console.log("tabset update chart", result);
                        });
                    }    
                }

                /**
                 * Visual config item
                 */
                scope.addVisualConfigItem = function(tab, visualConfig){
                    // initiate visuals
                    visualConfig.posX = 0;
                    visualConfig.posY = 0;
                    visualConfig.width = 0;
                    visualConfig.heigth = 0;            
                    visualConfig.chartSetId = tab.id;        
                    visualConfig.backgroundColor = '#FFFFFF';

                    // push it to dashboard items
                    tab.visuals.push(visualConfig);     

                    // open toolbox in edit mode
                    scope.triggerToolbox('VISUAL_ITEM', visualConfig);
                }

                /**
                 * Snapshot config item
                 */
                scope.addSnapshotConfigItem = function(tab, snapshotConfig){
                    // initiate visuals
                    snapshotConfig.posX = 0;
                    snapshotConfig.posY = 0;
                    snapshotConfig.width = 0;
                    snapshotConfig.heigth = 0;            
                    snapshotConfig.dashboardId = tab.id;     
                    snapshotConfig.backgroundColor = '#FFFFFF';   
                    snapshotConfig.settings.push({
                        Key: 'align',
                        Value: 'center'
                    })

                    // push it to dashboard items
                    tab.snapshots.push(snapshotConfig);     

                    // open toolbox in edit mode
                    scope.triggerToolbox('SNAPSHOT', snapshotConfig);
                }

                // Request homecontroller update snapshot on server
                scope.requestSnapshotUpdate = function(snapshotConfig){
                    if(scope.onChangeSnapshotPosition){
                        scope.onChangeSnapshotPosition({ snapshotConfig: snapshotConfig }).then(result => {
                            console.log("tabset update snapshot", result);
                        });
                    }    
                }
                
                // Delete snapshot config
                scope.onDeleteSnapshotHandler = function(snapshotConfig, tab){                    
                    if(scope.onDeleteSnapshot){
                        scope.onDeleteSnapshot({snapshotConfig: snapshotConfig, dashboard: tab}).then(result => {
                            if(result){
                                scope.deleteSnapshotFromTab(snapshotConfig, tab);                                
                            }
                        })
                    }
                }

                // delete from local snapshot array
                scope.deleteSnapshotFromTab = function(snapshotConfig, tab){
                    let snapshots = angular.copy(tab.snapshots);
                    snapshots = snapshots.filter(snapshot => snapshot.snapshotConfigId !== snapshotConfig.snapshotConfigId );
                    tab.snapshots = [];
                    $timeout(()=>{
                        tab.snapshots = snapshots;                                
                    });
                }
                

                //TEST
                scope.reloadTab = function(tab){
                    let charts = angular.copy(tab.charts);                    
                    tab.charts = [];
                    scope.$apply()
                    tab.charts = charts;
                }

                // Adds a new widget (itemConfig can be ChartItemConfig,...)
                scope.addWidget = function(tab, itemConfig) {
                    // TODO switch de itemConfig
                    var newWidget = new ChartConfigItem();
                    newWidget.x = 0;
                    newWidget.y = 0;
                    newWidget.width = 0;
                    newWidget.heigth = 0;                    

                    tab.charts.push(newWidget);
                };
                
               
                scope.onResizeStop = function(event, ui) {};

                scope.onDragStop = function(event, ui) {};
                scope.onItemAdded = function(item) {};
                scope.onItemRemoved = function(item) {};
                //TEST


                

            }
        }
    }
]);