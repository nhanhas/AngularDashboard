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

                // to prevent force to re-render chart
                scope.$watch('config.toUpdateView', function (newValue, oldValue, scope) {
                    if(newValue){
                        console.log('Reloading chart...')
                        scope.initialize().then(result => {
                            scope.config.toUpdateView = false;
                        });
                        
                    }
                });
                // to update chart.js options to see color change right away
                scope.$watch('config.color', function (newValue, oldValue, scope) {
                    if(scope.options && scope.config)
                        scope.setupChartOptions();
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

                    return DashboardService.fecthChartResultByIdDates(scope.startDate, scope.endDate, scope.config.chartConfigId).then(result => {
                        scope.isLoading = false;

                        // run chart setup
                        scope.setupChart(result);
                    })
                    
                    /* old version
                    const fieldsID = scope.config.fields.map(field => field.metaDataEntryId);

                    
                    return DashboardService.fecthChartResultByDates(scope.startDate, scope.endDate, fieldsID).then(result => {
                        scope.isLoading = false;

                        // run chart setup
                        scope.setupChart(result);
                    })*/
                        
                }

                // setup chart config
                scope.setupChart = function(chartResults){                    
                    
                    // generic chart options
                    scope.options = {
                        legend: {
                            display: true,
                            position: 'bottom',
                            align: 'center',
                            labels: {
                                fontColor: scope.config.color
                            }
                        },
                        responsive: true, 
                        maintainAspectRatio: false,
                        plugins: {
                            zoom: {
                                // Container for pan options
                                pan: {
                                    // Boolean to enable panning
                                    enabled: true,
                
                                    // Panning directions. Remove the appropriate direction to disable 
                                    // Eg. 'y' would only allow panning in the y direction
                                    mode: 'x',
                                },
                
                                // Container for zoom options
                                zoom: {
                                    // Boolean to enable zooming
                                    enabled: true,
                                    sensitivity: 0.3,
                
                                    // Zooming directions. Remove the appropriate direction to disable 
                                    // Eg. 'y' would only allow zooming in the y direction
                                    mode: 'x',
                                }
                            }
                        }
                    }

                    // setup options for visuals only
                    scope.setupChartOptions();

                    // color pallete
                    scope.colors = [ '#FF0000', '#00FF00', '#0000FF'] 
                    

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
                        case 'bubble':
                            scope.bubbleChartSetup(scope.config, chartResults)
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
                     //Development test
                    /*scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
                    
                    scope.data = [
                        [{x: 'January', y: 65}, {x: 'February', y: 59}, {x: 'March', y: 80}, {x: 'April', y: 81}, {x: 'May', y: 56}, {x: 'June', y: 55}, {x: 'July', y: 40} ],
                        [{x: 'January', y: 28}, {x: 'February', y: 48}, {x: 'March', y: 40}, {x: 'April', y: 19}, {x: 'May', y: 86}, {x: 'June', y: 27}, {x: 'July', y:90} ]
                    ];*/

                    /*const results = scope.processResult(chartResults);

                    scope.labels = results.labels;
                    scope.data = results.data;*/

                    //scope.labels = chartResults.Labels;

                    /* old version
                        scope.labels = [
                        "01:00",
                        "02:00",
                        "03:00",
                        "04:00",
                        "05:00",
                        "06:00",
                        "07:00",
                        "08:00",
                        "09:00",
                        "10:00",
                        "11:00",
                        "12:00",
                        "13:00",
                        "14:00",
                        "15:00",
                        "16:00",
                        "17:00",
                        "18:00",
                        "19:00",
                        "20:00",
                        "21:00",
                        "22:00",
                        "23:00",
                        "00:00"
                      ]
                    scope.data = chartResults.DataEntries; 
                    */
                   $timeout(()=>{
                    scope.labels = chartResults.labels;
                    scope.data = chartResults.datasets.map(dataset => {
                        return dataset.data;
                    });

                    scope.series = chartResults.datasets.map(dataset => {
                        return dataset.label;
                    });
                   })
                    
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

                    //scope.labels = chartResults.Labels;

                    /*
                    scope.labels = [
                        "01:00",
                        "02:00",
                        "03:00",
                        "04:00",
                        "05:00",
                        "06:00",
                        "07:00",
                        "08:00",
                        "09:00",
                        "10:00",
                        "11:00",
                        "12:00",
                        "13:00",
                        "14:00",
                        "15:00",
                        "16:00",
                        "17:00",
                        "18:00",
                        "19:00",
                        "20:00",
                        "21:00",
                        "22:00",
                        "23:00",
                        "00:00"
                      ]
                    scope.data = chartResults.DataEntries;
                    */
                    $timeout(()=>{
                        scope.labels = chartResults.labels;
                        scope.data = chartResults.datasets.map(dataset => {
                            return dataset.data;
                        });
    
                        scope.series = chartResults.datasets.map(dataset => {
                            return dataset.label;
                        });    
                    })
                       
                    
                }

                //#3 - Pie / Doughnut
                scope.pieChartSetup = function(chartConfig, chartResults){
                    /*const results = scope.processResult(chartResults);

                    scope.labels = results.labels;
                    scope.data = results.data;*/

                    /*
                    scope.labels = chartResults.Labels;
                    scope.data = chartResults.DataEntries; */
                    $timeout(()=>{
                        scope.labels = chartResults.labels;
                        scope.data = chartResults.datasets.map(dataset => {
                            return dataset.data;
                        });
                        scope.data = scope.data[0];
                    })

                }
                
                //#4 - polar
                scope.polarChartSetup = function(chartConfig, chartResults){               

                    $timeout(()=>{
                        scope.labels = chartResults.labels;
                        scope.data = chartResults.datasets.map(dataset => {
                            return dataset.data;
                        });
    
                        scope.series = chartResults.datasets.map(dataset => {
                            return dataset.label;
                        });    
                    })
                }

                //#5 - radar
                scope.radarChartSetup = function(chartConfig, chartResults){               

                    $timeout(()=>{
                        scope.labels = chartResults.labels;
                        scope.data = chartResults.datasets.map(dataset => {
                            return dataset.data;
                        });
    
                        scope.series = chartResults.datasets.map(dataset => {
                            return dataset.label;
                        });    
                    })
                }

                //#5 - bubble
                scope.bubbleChartSetup = function(chartConfig, chartResults){               

                    $timeout(()=>{
                        scope.labels = chartResults.labels;
                        scope.data = chartResults.datasets.map(dataset => {
                            return dataset.data;
                        });
    
                        scope.series = chartResults.datasets.map(dataset => {
                            return dataset.label;
                        });    
                    })
                    
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

                /**
                 * Visual section
                 */
                scope.setupChartOptions = function(){
                    switch (scope.config.chartType) {
                        case 'bar':
                        case 'line':
                            scope.options.scales = {
                                xAxes: [{ 
                                    gridLines: {
                                        color: `${scope.config.color}`
                                    },
                                    ticks: {
                                      fontColor: `${scope.config.color}` ,
                                    }
                                }],
                                yAxes: [{ 
                                    gridLines: {
                                        color: `${scope.config.color}`
                                    },
                                    ticks: {
                                      fontColor: `${scope.config.color}`, 
                                    }
                                }]
                            }                
                            break;
                    
                        default:
                            break;
                    }
                }

                //#Aux - get backgroundColor
                scope.getBackgroundColor = function(){
                    return { 'background-color': `${scope.config.backgroundColor}` };
                }

                //#Aux - get color
                scope.getTextColor = function(){
                    return { 'color': `${scope.config.color}` };
                }

                
                // setup chart! (change this for load chart data and then setup)
                scope.initialize();                

            }
        }
    }

]);

