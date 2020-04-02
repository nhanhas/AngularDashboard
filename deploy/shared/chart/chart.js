/**
 * This component will be used to draw Chart
 */
app
    .directive('chart', ['$timeout', 'DashboardService', function($timeout, DashboardService) {
        return {
            restrict: 'EA',
            scope: {
                config : '=' , //ChartConfigItem object,
                onDeleteChart: '&?',
                onTriggerToolbox: '&?'       //Triggers the edition tab
            },
            templateUrl: 'shared/chart/chart.html',

            link: function (scope, element, attrs) {
                scope.isLoading = false;

                if (!attrs.onDeleteChart) {
                    scope.onDeleteChart = undefined;
                }

                if (!attrs.onTriggerToolbox) {
                    scope.onTriggerToolbox = undefined;
                }

                // Dates Range
                scope.startDate = new Date('2020-01-16');
                scope.endDate = new Date('2020-01-17');

                //#A - Trigger Toolbox Opening to edit chart
                scope.triggerToolbox = function(){
                    if(scope.onTriggerToolbox){
                        scope.onTriggerToolbox({item : scope.config});
                    }  
                }

                //#B - Trigger Popup to delete chart
                scope.onDeleteChartHandler = function(){
                    if(window.confirm("Are you sure to delete chart?")){
                        if(scope.onDeleteChart){
                            scope.onDeleteChart({chartConfig : scope.config});
                        }  
                    }
                }
                
                /**
                 * [Main] - Fetch chart result
                 */
                scope.initialize = function(){
                    scope.isLoading = true;

                    const fieldsID = scope.config.fields.map(field => field.metaDataEntryId);

                    DashboardService.fecthChartResultByDates(scope.startDate, scope.endDate, fieldsID).then(result => {
                        scope.isLoading = false;

                        // run chart setup
                        scope.setupChart(result);
                    })
                        
                }

                // setup chart config
                scope.setupChart = function(chartResults){                    
                    
                    // generic chart options
                    scope.options = {
                        responsive: true, 
                        maintainAspectRatio: false
                    }
                    //scope.colors = [scope.config.backgroundColor] // TODO - fix
                    

					// run setup according chart type
					switch (scope.config.chartType) {
						case 'line':
							scope.lineChartSetup(scope.config, chartResults)
							break;
						case 'bar':
							scope.barChartSetup(scope.config, chartResults)
							break;
						case 'pie':
							scope.pieChartSetup(scope.config, chartResults)
                            break;	
                        case 'polar':
                            scope.polarChartSetup(scope.config, chartResults)
                            break;	
                        case 'radar':
                            scope.radarChartSetup(scope.config, chartResults)
                            break;
                            

						default:
							scope.config.chartType = 'line'; //TODO - remove 
							scope.lineChartSetup(scope.config, chartResults)
							break;
					}

                    // finished setup
                    scope.isLoading = false;
                }

                /**
                 * Setups for charts
                 */
                //#1 - Line
                scope.lineChartSetup = function(chartConfig, chartResults){
                    /* Development test
                    scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
                    scope.series = ['Series A', 'Series B'];
                    scope.data = [
                        [65, 59, 80, 81, 56, 55, 40],
                        [28, 48, 40, 19, 86, 27, 90]
                    ];*/

                    /*const results = scope.processResult(chartResults);

                    scope.labels = results.labels;
                    scope.data = results.data;*/

                    scope.labels = chartResults.Labels;
                    scope.data = chartResults.DataEntries;
                }
                //#2 - Bar
                scope.barChartSetup = function(chartConfig, chartResults){
                    /* Development test
                    scope.labels = ["2020-01-15T12:00:00+00:00","2020-01-15T12:00:00+00:00","2020-01-15T12:00:00+00:00","2020-01-15T12:00:00+00:00","2020-01-15T12:00:00+00:00","2020-01-15T12:00:00+00:00","2020-01-15T12:00:00+00:00","2020-01-15T12:00:00+00:00","2020-01-15T12:00:00+00:00","2020-01-15T12:00:00+00:00","2020-01-15T12:00:00+00:00","2020-01-15T12:00:00+00:00","2020-01-15T07:00:00+00:00","2020-01-15T07:00:00+00:00","2020-01-15T07:00:00+00:00","2020-01-15T07:00:00+00:00","2020-01-15T07:00:00+00:00","2020-01-15T07:00:00+00:00","2020-01-15T07:00:00+00:00","2020-01-15T07:00:00+00:00","2020-01-15T07:00:00+00:00","2020-01-15T07:00:00+00:00","2020-01-15T07:00:00+00:00","2020-01-15T07:00:00+00:00","2020-01-15T07:00:00+00:00","2020-01-15T07:00:00+00:00","2020-01-15T07:00:00+00:00","2020-01-15T07:00:00+00:00","2020-01-15T07:00:00+00:00","2020-01-15T07:00:00+00:00","2020-01-15T07:00:00+00:00","2020-01-15T07:00:00+00:00"];
                  
                    scope.data = [
                        ["250000","250000","250000","250000","250000","250000","250000","250000","250000","250000","250000","250000","250000","250000","250000","250000","250000","250000","250000","250000","250000","250000","250000","250000","250000","250000","250000","250000","250000","250000","250000","250000"],
                        ["168561","224580","244407","228866","236665","215694","34011","180208","58740","251856","82202","226187","158494","229436","36656","236833","20340","42692","60899","203328","226815","200695","235912","170599","153916","28653","219873","235912","170599","153916","28653","219873"]
                    ];*/
                    
                    /*const results = scope.processResult(chartResults);

                    scope.labels = results.labels;
                    scope.data = results.data;*/

                    scope.labels = chartResults.Labels;
                    scope.data = chartResults.DataEntries;
                                        
                    
                }

                //#3 - Pie / Doughnut
                scope.pieChartSetup = function(chartConfig, chartResults){
                    /*const results = scope.processResult(chartResults);

                    scope.labels = results.labels;
                    scope.data = results.data;*/

                    scope.labels = chartResults.Labels;
                    scope.data = chartResults.DataEntries;
                }
                
                //#4 - polar
                scope.polarChartSetup = function(chartConfig, chartResults){               

                    scope.labels = chartResults.Labels;
                    scope.data = chartResults.DataEntries;
                }

                //#5 - radar
                scope.radarChartSetup = function(chartConfig, chartResults){               

                    scope.labels = chartResults.Labels;
                    scope.data = chartResults.DataEntries;
                }
                

                //#Aux - Process result (x,y) to (label,data)
                scope.processResult = function(chartResults){
                    let result = { labels: [], data: [] };
                    
                    chartResults.forEach(resultSet => {
                        let labelsReady = false;
                        let groupData = [];
                        resultSet.forEach(point => {
                            if(!labelsReady) result.labels.push(point.x);

                            groupData.push(point.y);
                        })
                        labelsReady = true;

                        result.data.push(groupData);
                    })

                    return result;
                }

                // setup chart! (change this for load chart data and then setup)
                scope.initialize();                

            }
        }
    }

]);

