/**
 * This component will be used to draw Tabset 
 * with his own tabs
 */
app
    .directive('tabset', ['$timeout', function($timeout) {
        return {
            restrict: 'EA',
            transclude: true,                            
            scope: {
                tabCollection : '=',  //Tab collection
                onAddNew: '&?',       //Handler for add new Tab
                onTriggerToolbox: '&?',       //Triggers the edition tab
                onChangeChartPosition: '&?'       //on change chart position
                
            },
            templateUrl: 'shared/tabset/tabset.html',

            link: function (scope, element, attrs) {
                
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
                

                /**
                 * #2 - Controller variables                 
                 */
                //Wich tab is active
                scope.activeTab = 1;

                // Gridstack configuration
                scope.gridStackOptions = {
                    cellHeight: 200,
                    verticalMargin: 10,
                    acceptWidgets: '.chart-config-element',
                    alwaysShowResizeHandle: true
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

                // Request homecontroller update chart on server
                scope.requestChartUpdate = function(chartConfig){
                    if(scope.onChangeChartPosition){
                        scope.onChangeChartPosition({ chartConfig: chartConfig }).then(result => {
                            console.log("tabset update chart", result);
                        });
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
                    
                }

                /**
                 * [New] Chart config item
                 */
                scope.addChartConfigItem = function(tab, chartConfig){
                    // initiate visuals
                    chartConfig.x = 0;
                    chartConfig.y = 0;
                    chartConfig.width = 0;
                    chartConfig.heigth = 0;                    

                    // push it to dashboard items
                    tab.charts.push(chartConfig);     
                    
                    // open toolbox in edit mode
                    scope.triggerToolbox('CHART', chartConfig);
                }

                //TEST

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


/**
 * Developer Doc:
 * 
 * 
 * A single Tab of tabCollection should have the following:
 * 
 * {
 *      id: <Integer>,
 *      disabled: <Boolean>,
 *      chart: <Object Array>
 * }
 * 
 * 
 */