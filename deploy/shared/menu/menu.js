/**
 * This component will be used to draw Menu 
 */
app
    .directive('menu', ['$timeout', 'DashboardService', function($timeout, DashboardService) {
        return {
            restrict: 'EA',
            scope: true,
            templateUrl: 'shared/menu/menu.html',

            link: function (scope, element, attrs) {
                
                
                // TYPE: DATASOURCES menu handler
                scope.dataSourceHandler = function(menuId){
                    //#1 - Get datasources for toolbox
                    scope.triggerToolbox(menuId, undefined);
                    DashboardService.getDataSourcesSets().then((result) => {

                        //#2 - Show datasources in toolbox
                        scope.$apply(function(){
                            scope.triggerToolbox(menuId, result.data);
                        });
                        

                    });
                }

                // TYPE: CHART_BUILDER menu handler
                scope.chartBuilderHandler = function(menuId){
                    //#1 - Get datasources for toolbox
                    DashboardService.getChartsToBuild().then((result) => {

                        //#2 - Show datasources in toolbox
                        scope.$apply(function(){
                            scope.triggerToolbox(menuId, result.data);
                        });
                        

                    });
                }

                // Initialize variables after menu handlers
                scope.selectedMenu = undefined;

                //#1 - Init menu items
                scope.menus = [
                    new MenuItem('DATASOURCES', 'Data Sources and Data Sets', 'fa-database', scope.dataSourceHandler.bind(this)),
                    new MenuItem('CHARTS', 'Charts', 'fa-bar-chart'),               
                    new MenuItem('CHART_BUILDER', 'Graph Builder', 'fa-pie-chart', scope.chartBuilderHandler.bind(this))
                    
                ]

                scope.getMenuById = function(menuId){
                    let menu = scope.menus.find(menuItem => {
                        return menuItem.id === menuId
                    })
                    return menu;
                }

                // Home controller toolbox trigger
                scope.triggerToolbox = function(menuId, data = undefined){
                    scope.selectedMenu = scope.getMenuById(menuId)
                    let newEditingElement = new EditingElement('MENU', scope.selectedMenu, data);
                    scope.toggleToolbox(true, newEditingElement);
                }

            }
        }
    }

]);