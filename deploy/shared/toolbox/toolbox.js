/**
 * This component will be used to draw Side panel
 * toolbox 
 * It will accept transclude
 */
app
    .directive('toolbox', ['$timeout', 'DashboardService', 'FrameworkUtils', '$q', function($timeout, DashboardService, FrameworkUtils, $q) {
        return {
            restrict: 'EA',
            scope: true,
            transclude: true,
            templateUrl: 'shared/toolbox/toolbox.html',

            link: function (scope, element, attrs) {                
                scope.isToolReady = false;
                scope.isLoading = false;

                scope.FrameworkUtils = FrameworkUtils;
                
                /**
                 * Variables for charts
                 */
                // this will be our backup
                scope.fieldsForCharts = []; // for charts and snapshots
                scope.chartXFields = [];
                scope.chartYFields = []; 
                scope.fieldsFunctions = [];

                scope.snapshotFields = []; 

                // save changes from toolbox                
                $timeout(function(){
                    scope.isToolReady = true;
                })

                // to prevent load datasources at beggining
                scope.$watch('toggleTools', function (newValue, oldValue, scope) {
                    if(newValue)
                        scope.getFieldsForCharts();
                });

                // whatch on toolbox for initializer
                scope.$watch('editingElement', function (newValue, oldValue, scope) {                  

                    if(!newValue) return;
                    // Menu in edition
                    if(newValue.item.type === 'DATASOURCES' && newValue.data && newValue.data.length > 0) { return scope.initializeDatasourcesView() }

                    // Chart in edition
                    if(newValue.item.chartConfigId !== undefined) { return scope.initializeChartView() }

                    // Snapshot in edition
                    if(newValue.item.snapshotConfigId !== undefined) { return scope.initializeSnapshotView() }

                });

                /**
                 * [TAB] - dashboard config
                 */
                scope.updateDashboardConfig = function(){
                    if(scope.editingElement.item.name === '')
                        return;
                    scope.isLoading = true;
                    const {title, id} = scope.editingElement.item;

                    // update dashboard
                    scope.updateDashboard(id, title).then(result => {
                        scope.isLoading = false;
                    });
                }

                scope.deleteDashboardConfig = function(){                    
                    scope.isLoading = true;
                    const {id} = scope.editingElement.item;

                    // update dashboard
                    scope.deleteDashboard(id).then(result => {
                        scope.isLoading = false;
                    });
                }

                /**
                 * DATASOURCES toolbox section
                 */
                // update user datasets selections
                scope.updateDataSourceSets = function(){
                    scope.isLoading = true;
                    // prepare all fields to use
                    const dataSets = scope.editingElement.data;
                    let dataSetsToUse = []
                    dataSets.forEach(dataSet => {
                        dataSetsToUse.push(...
                            dataSet.itens
                                .filter(value => value.selected)
                                .map(value => value.itens.map(field => field.metaDataEntryId))
                            )
                    });
                    // flaten field array
                    dataSetsToUse = dataSetsToUse.flat();
                    
                    // update 
                    scope.updateDataSources(dataSetsToUse).then(result => {
                        scope.isLoading = false;

                        // clear data sets for charts
                        scope.fieldsForCharts = [];
                    });

                }

                // a datasources initializer
                scope.initializeDatasourcesView = function(){
                    scope.editingElement.data.forEach(dataSet => {
                        dataSet.itens.forEach(table => {
                            table.selected = table.itens.some(field => field.selected)
                        })
                    })
                }

                /**
                 * CHART toolbox section
                 */
                // get icon depending on chart type
                scope.getChartIcon = function(){
                    const chartConfig = scope.editingElement.item;
                    switch (chartConfig.chartType.toLowerCase()) {
                        case 'line':
                            return 'fa-line-chart'                            
                        case 'bar':
                            return 'fa-bar-chart'                            
                        case 'pie':
                            return 'fa-pie-chart'  
                        case 'radar':
                            return 'fa-connectdevelop'  
                        case 'polar':
                            return 'fa-compass'                            
                    
                        default:
                            return 'fa-bar-chart';                            
                    }
                }

                // Update Chart config in server
                scope.updateChart = function(){
                    scope.isLoading = true;
                    const chartConfig = scope.editingElement.item;

                    // if no id => its a new chart
                    if(chartConfig.chartConfigId === 0){
                        delete chartConfig.chartConfigId;
                        // call homecontroller update chart function
                        scope.createChartConfig(chartConfig).then(result => {
                            scope.isLoading = false;
                            // update chartConfigId to result (id)
                            if(!isNaN(result))
                                scope.editingElement.item.chartConfigId = result;
                            else{
                                // reset chartconfigid to zero
                                scope.editingElement.item.chartConfigId = 0;
                            }

                            console.log("toolbox create chart", result);
                            // mark chartItem to update itself at chartDirective
                            scope.editingElement.item.toUpdateView = true;
                        })  

                    }else{
                        // call homecontroller update chart function
                        scope.updateChartConfig(chartConfig).then(result => {
                            scope.isLoading = false;
                            console.log("toolbox update chart", result);

                            // mark chartItem to update itself at chartDirective
                            scope.editingElement.item.toUpdateView = true;
                        })  
                    }
                          
                    
                }

                // get fields for chart
                scope.getFieldsForCharts = function(){
                    if(scope.fieldsForCharts.length === 0){

                        return DashboardService.getDataSourcesSets().then((result) => {
                            let dataSource = result.data;

                            // filter for available ones
                            dataSource.forEach(dataSet => {
                                dataSet.itens = dataSet.itens
                                .filter(table => table.itens.some(field => field.selected))                                
                            })
                            
                            dataSource = dataSource
                                .filter(dataSet => dataSet.itens
                                    .some(table => table.itens.length > 0)
                                )
                            
                            // reset all selected fields to false
                            //let dataSource = result.data;
                            dataSource.forEach(sourceItem => {
                                // datasource reset
                                sourceItem.selected = false;
                                sourceItem.itens.forEach(setItem => {
                                    // dataset reset
                                    setItem.selected = false;
                                    setItem.itens.forEach(fieldItem => {
                                        // datafield reset
                                        fieldItem.selected = false;
                                    })
                                })
                            });

                            scope.fieldsForCharts = dataSource;
                            return scope.fieldsForCharts
                        });
                    }

                    return new Promise((resolve, reject) => { resolve( scope.fieldsForCharts ); });                    
                }

                scope.getFieldsFunctions = function(){

                    if(scope.fieldsFunctions.length === 0){

                        return DashboardService.getAvailableFunctions().then((result) => {
                            scope.fieldsFunctions = result;

                            return scope.fieldsFunctions;
                        })
                    }else{
                        return scope.fieldsFunctions;
                    }
                    
                }

                // on add [xAxis] field for chart
                scope.onAddXFieldHandler = function(field){
                    scope.editingElement.item.XAxisMetadataEntry = field.metaDataEntryId;
                }

                // on remove [xAxis] field for chart
                scope.onRemoveXFieldHandler = function(field){
                    if(scope.editingElement.item.XAxisMetadataEntry === field.metaDataEntryId)
                        scope.editingElement.item.XAxisMetadataEntry = null;
                }

                // on add [yAxis] field for chart
                scope.onAddYFieldHandler = function(field){
                    console.log('add',scope.editingElement, field);
                    const newField = {
                        name: field.name,
                        description: field.description,
                        metaDataEntryId: field.metaDataEntryId,
                        serviceId: field.serviceId,
                        function: 0
                    }
                    //add it into chart
                    scope.editingElement.item.fields.push(newField);
                }

                // on remove [yAxis] field for chart
                scope.onRemoveYFieldHandler = function(field){
                    console.log('remove', scope.editingElement, field);
                    const chartFields = scope.editingElement.item.fields;
                    scope.editingElement.item.fields = chartFields.filter( chartField => chartField.metaDataEntryId !== field.metaDataEntryId);
                    
                }

                // a chart config initializer
                scope.initializeChartView = function(){
                    console.log(`Toolbox: initializeChartView: ${scope.editingElement.item.chartConfigId}`);

                    $q.all([
                        // chart fields fetch
                        scope.getFieldsForCharts().then(result => {

                            // [xAxis] - set as selected fields if chart has it
                            const XfieldsForCharts = angular.copy(result);
                            XfieldsForCharts.forEach(sourceItem => {
                                sourceItem.itens.forEach(setItem => {
                                    setItem.itens.forEach(fieldItem => {
                                        // mark selected from [yAxis]
                                        const fieldInChart = scope.editingElement.item.XAxisMetadataEntry === fieldItem.metaDataEntryId;
                                        fieldItem.selected = fieldInChart;                                
                                    })
                                })
                            });
    
                            // [yAxis] - set as selected fields if chart has it
                            const YfieldsForCharts = angular.copy(result);
                            YfieldsForCharts.forEach(sourceItem => {
                                sourceItem.itens.forEach(setItem => {
                                    setItem.itens.forEach(fieldItem => {
                                        // mark selected from [yAxis]
                                        const fieldInChart = scope.editingElement.item.fields.find(field => field.metaDataEntryId === fieldItem.metaDataEntryId);
                                        fieldItem.selected = fieldInChart !== undefined;                                
                                    })
                                })
                            });
    
                            //set fields for x and y fields
                            $timeout( function(){
                                scope.chartXFields = XfieldsForCharts;
                                scope.chartYFields = YfieldsForCharts;
                            });
                            
                            
                            
                        }),

                        // functions for fields
                        scope.getFieldsFunctions()
                    ]).then(([_, fieldFunctions]) => {
                        // setup fields 
                        scope.fieldsFunctions = fieldFunctions;
                    });
                }

                /**
                 * Visual Items
                 */


                /**
                 * Snapshot Items
                 */
                // get icon depending on chart type
                scope.getSnapshotIcon = function(){
                    const snapshotConfig = scope.editingElement.item;
                    switch (snapshotConfig.snapshotType) {
                        case 0:
                            return 'fa-sticky-note'                            
                        case 1:
                            return 'fa-table'                      
                        case 2:
                            return 'fa-list'             
                        default:
                            return 'fa-square';                            
                    }
                }

                // Update Snapshot config in server
                scope.updateSnapshot = function(){
                    scope.isLoading = true;
                    const snapshotConfig = scope.editingElement.item;

                    // if no id => its a new snapshot
                    if(snapshotConfig.snapshotConfigId === 0){
                        delete snapshotConfig.snapshotConfigId;
                        // call homecontroller update snapshot function
                        scope.createSnapshotConfig(snapshotConfig).then(result => {
                            scope.isLoading = false;
                            // update snapshotonfigId to result (id)
                            if(!isNaN(result))
                                scope.editingElement.item.snapshotConfigId = result;
                            else{
                                // reset snapshotConfigId to zero
                                scope.editingElement.item.snapshotConfigId = 0;
                            }

                            console.log("toolbox create snapshot", result);
                            // mark chartItem to update itself at snapshotDirective
                            scope.editingElement.item.toUpdateView = true;
                        })  

                    }else{
                        // call homecontroller update snapshot function
                        scope.updateSnapshotConfig(snapshotConfig).then(result => {
                            scope.isLoading = false;
                            console.log("toolbox update snapshot", result);

                            // mark snapshotItem to update itself at snapshotDirective
                            scope.editingElement.item.toUpdateView = true;
                        })  
                    }
                          
                    
                }

                // on add [yAxis] field for chart
                scope.onAddSnapshotFieldHandler = function(field){
                    console.log('add',scope.editingElement, field);
                    const newField = {
                        name: field.name,
                        description: field.description,
                        metaDataEntryId: field.metaDataEntryId,
                        serviceId: field.serviceId,
                        function: 0
                    }
                    //add it into chart
                    scope.editingElement.item.fields.push(newField);
                }

                // on remove [yAxis] field for chart
                scope.onRemoveSnapshotFieldHandler = function(field){
                    console.log('remove', scope.editingElement, field);
                    const chartFields = scope.editingElement.item.fields;
                    scope.editingElement.item.fields = chartFields.filter( chartField => chartField.metaDataEntryId !== field.metaDataEntryId);                    
                }

                // UTIL: get snapshot setting by key - TODO remove "isNumber"
                scope.getSnapshotSetting = function(setting, isNumber = false){
                    // get setting
                    let snapshotSetting = scope.editingElement.item.settings.find(value => value.Key === setting);
                    // if(snapshotSetting) { return snapshotSetting; } -  TODO - remove when fixed
                    // remove this if below
                    if(snapshotSetting) { 
                        snapshotSetting.Value = isNumber 
                            ? +snapshotSetting.Value
                            : snapshotSetting.Value;

                        return snapshotSetting; 
                    }

                    // if not exist, create it
                    scope.editingElement.item.settings.push({ Key: setting, Value: '' })

                    // return ref
                    return scope.editingElement.item.settings.find(value => value.Key === setting);
                }

                // a chart config initializer
                scope.initializeSnapshotView = function(){
                    console.log(`Toolbox: initializeSnapshotView: ${scope.editingElement.item.snapshotConfigId}`);

                    $q.all([
                        // chart fields fetch
                        scope.getFieldsForCharts().then(result => {
    
                            // set as selected fields if snapshot has it
                            const fieldsForSnapshots = angular.copy(result);
                            fieldsForSnapshots.forEach(sourceItem => {
                                sourceItem.itens.forEach(setItem => {
                                    setItem.itens.forEach(fieldItem => {
                                        // mark selected
                                        const fieldInSnapshot = scope.editingElement.item.fields.find(field => field.metaDataEntryId === fieldItem.metaDataEntryId);
                                        fieldItem.selected = fieldInSnapshot !== undefined;                                
                                    })
                                })
                            });
    
                            //set fields for snapshots
                            $timeout( function(){
                                scope.snapshotFields = fieldsForSnapshots;
                            });
                            
                            
                            
                        }),

                        // functions for fields
                        scope.getFieldsFunctions()

                    ]).then(([_, fieldFunctions]) => {
                        // setup fields 
                        scope.fieldsFunctions = fieldFunctions;
                    });
                }

            }
        }
    }
]);