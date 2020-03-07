/**
 * This component will be used to draw Chart
 */
app
    .directive('chart', ['$timeout', function($timeout) {
        return {
            restrict: 'EA',
            scope: {
                config : '=' , //ChartConfigItem object
                onTriggerToolbox: '&?'       //Triggers the edition tab
            },
            templateUrl: 'shared/chart/chart.html',

            link: function (scope, element, attrs) {
                scope.isLoading = false;

                if (!attrs.onTriggerToolbox) {
                    scope.onTriggerToolbox = undefined;
                }


                //#A - Trigger Toolbox Opening to edit chart
                scope.triggerToolbox = function(){
                    if(scope.onTriggerToolbox){
                        scope.onTriggerToolbox({item : scope.config});
                    }  
                }

                scope.onDropComplete=function(data, event){
                    console.log("drop success, data:", data);
                }
                

                // setup chart config
                scope.setupChart = function(){
                    scope.isLoading = true;
                    
                    // generic chart options
                    scope.options = {
                        responsive: true, 
                        maintainAspectRatio: false
                    }

					// run setup according chart type
					switch (scope.config.ChartType) {
						case 'line':
							scope.lineChartSetup(scope.config)
							break;
						case 'bar':
							scope.barChartSetup(scope.config)
							break;
						case 'pie':
							scope.pieChartSetup(scope.config)
							break;	

						default:
							scope.config.ChartType = 'line'; //TODO - remove 
							scope.lineChartSetup(scope.config)
							break;
					}

                    // finished setup
                    scope.isLoading = false;
                }

                /**
                 * Setups for charts
                 */
                //#1 - Line
                scope.lineChartSetup = function(chartConfig){
					scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
                    scope.series = ['Series A', 'Series B'];
                    scope.data = [
                        [65, 59, 80, 81, 56, 55, 40],
                        [28, 48, 40, 19, 86, 27, 90]
                    ];                    
                }
                //#2 - Bar
                scope.barChartSetup = function(chartConfig){
                    
                }

                //#3 - Pie / Doughnut
                scope.pieChartSetup = function(chartConfig){
                    
                }
                



                // setup chart! (change this for load chart data and then setup)
                scope.setupChart();

            }
        }
    }

]);

