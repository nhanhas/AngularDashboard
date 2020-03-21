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
                    verticalMargin: 10
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
                    scope.userChangedChart = true;
                };
                // Flag this change by user mannualy
                scope.onResizeStart = function(event, ui) {
                    scope.userChangedChart = true;
                };
                
                // re-position and resize chart
                scope.onChange = function(event, items) {
                    // if wasnt from user 
                    if(!scope.userChangedChart) return;

                    items.forEach(item => {
                        const chartConfig = JSON.parse(item.el[0].attributes['gs-item'].value);
                        scope.requestChartUpdate(chartConfig);
                    });
                    scope.userChangedChart = false;

                };

                //TEST
                scope.widgets = [{ x:0, y:0, width:1, height:1 }, { x:0, y:0, width:3, height:1 }];
                scope.addWidget = function() {
                    var newWidget = { x:0, y:0, width:1, height:1 };
                    scope.widgets.push(newWidget);
                };
                
                scope.onDragStart = function(event, ui) {
                    scope.userChangedChart = true;
                };
                scope.onResizeStart = function(event, ui) {
                    scope.userChangedChart = true;
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