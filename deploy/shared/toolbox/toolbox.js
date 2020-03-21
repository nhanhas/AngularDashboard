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
                
                // save changes from toolbox                
                $timeout(function(){
                    scope.isToolReady = true;
                })


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

                    // call homecontroller update chart function
                    scope.updateChartConfig(chartConfig).then(result => {
                        scope.isLoading = false;
                        console.log("toolbox update chart", result);
                    })                  
                }

            }
        }
    }
]);