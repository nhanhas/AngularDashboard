/**
 * This component will be used to draw Side panel
 * toolbox 
 * It will accept transclude
 */
app
    .directive('toolbox', ['$timeout', 'DashboardService', function($timeout, DashboardService) {
        return {
            restrict: 'EA',
            scope: true,
            transclude: true,
            templateUrl: 'shared/toolbox/toolbox.html',

            link: function (scope, element, attrs) {                
                scope.isToolReady = false;
                scope.isLoading = false;
                
                /**
                 * Variables for charts
                 */
                // this will be our backup
                scope.fieldsForCharts = [];
                scope.chartXFields = [];

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
                scope.$watch('editingElement.item', function (newValue, oldValue, scope) {                    
                    if(!newValue) return;

                    if(newValue.chartConfigId !== undefined) { return scope.initializeChartView() }

                });

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
                        })  

                    }else{
                        // call homecontroller update chart function
                        scope.updateChartConfig(chartConfig).then(result => {
                            scope.isLoading = false;
                            console.log("toolbox update chart", result);
                        })  
                    }
                                    
                }

                // get fields for chart
                scope.getFieldsForCharts = function(){
                    if(scope.fieldsForCharts.length === 0){

                        return DashboardService.getDataSourcesSets().then((result) => {
                            // reset all selected fields to false
                            let dataSource = result.data;
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

                // on add field for chart
                scope.onAddFieldHandler = function(field){
                    console.log('add',scope.editingElement, field);
                    const newField = {
                        name: field.name,
                        description: field.description,
                        metaDataEntryId: field.metaDataEntryId,
                        serviceId: field.serviceId
                    }
                    //add it into chart
                    scope.editingElement.item.fields.push(newField);
                }

                // on remove field for chart
                scope.onRemoveFieldHandler = function(field){
                    console.log('remove', scope.editingElement, field);
                    const chartFields = scope.editingElement.item.fields;
                    scope.editingElement.item.fields = chartFields.filter( chartField => chartField.metaDataEntryId !== field.metaDataEntryId);
                    
                }

                // a chart config initializer
                scope.initializeChartView = function(){
                    console.log(`Toolbox: initializeChartView: ${scope.editingElement.item.chartConfigId}`);
                    scope.getFieldsForCharts().then(result => {

                        // set as selected fields if chart has it
                        const fieldsForCharts = angular.copy(result);
                        fieldsForCharts.forEach(sourceItem => {
                            sourceItem.itens.forEach(setItem => {
                                setItem.itens.forEach(fieldItem => {
                                    
                                    const fieldInChart = scope.editingElement.item.fields.find(field => field.metaDataEntryId === fieldItem.metaDataEntryId);
                                    fieldItem.selected = fieldInChart !== undefined;                                
                                })
                            })
                        });

                        //set fields for x and y fields
                        $timeout( function(){
                            scope.chartXFields = fieldsForCharts;
                        });
                        
                        
                        
                    })
                    

                }

            }
        }
    }
]);