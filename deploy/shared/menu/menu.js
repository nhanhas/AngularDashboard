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
                
                // TYPE: USER menu handler
                scope.userSettingsHandler = function(menuId){
                    //#1 - Get datasources for toolbox
                    scope.triggerToolbox(menuId, undefined);
                    
                }
                
                // TYPE: DATASOURCES menu handler
                scope.dataSourceHandler = function(menuId){
                    //#1 - Get datasources for toolbox
                    scope.triggerToolbox(menuId, undefined);
                    DashboardService.getDataSourcesSets().then((result) => {

                        //#2 - Show datasources in toolbox
                        //scope.$apply(function(){
                            scope.triggerToolbox(menuId, result.data);
                        //});
                        

                    });
                }

                // TYPE: GRAPHIC_PIE menu handler
                scope.graphicPieHandler = function(menuId){
                    //#1 - Get datasources for toolbox
                    DashboardService.getGraphicPiesToBuild().then((result) => {

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
                    new MenuItem('USER', 'User settings', '', scope.userSettingsHandler.bind(this)),
                    new MenuItem('DATASOURCES', 'Data Sources and Data Sets', 'fa-database', scope.dataSourceHandler.bind(this)),
                    new MenuItem('GRAPHIC_CHART', 'Graphic Charts', 'fa-bar-chart'),               
                    new MenuItem('GRAPHIC_PIE', 'Graphic Pie', 'fa-pie-chart', scope.graphicPieHandler.bind(this))                    
                ]
                // isolate menu user setting
                scope.userMenu = scope.menus[0];
                

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