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
                scope.userSettingsHandler = function(menuType){
                    //#1 - Get datasources for toolbox
                    scope.triggerToolbox(menuType, undefined);
                    
                }
                
                // TYPE: DATASOURCES menu handler
                scope.dataSourceHandler = function(menuType){
                    //#1 - Get datasources for toolbox
                    scope.triggerToolbox(menuType, undefined);
                    DashboardService.getDataSourcesSets().then((result) => {

                        //#2 - Show datasources in toolbox
                        //scope.$apply(function(){
                            scope.triggerToolbox(menuType, result.data);
                        //});
                        

                    });
                }

                // TYPE: CHART_ITEM_CONFIG menu handler
                scope.chartItemsConfigHandler = function(menuType){
                    //#1 - Get all available charts to use in toolbox
                    DashboardService.getChartItemsConfigToBuild().then((result) => {
                        //#2 - Show all available chart types to build in toolbox                        
                        scope.triggerToolbox(menuType, result.data);
                    });
                }

                // TYPE: SNAPSHOT_ITEM_CONFIG menu handler
                scope.snapshotItemsConfigHandler = function(menuType){
                    //0 - card, 1 - table, 2 - list
                    const snapshotTypes = [
                        Object.assign(new SnapshotConfigItem(), {snapshotType: 0}),
                        Object.assign(new SnapshotConfigItem(), {snapshotType: 1}),
                        Object.assign(new SnapshotConfigItem(), {snapshotType: 2})
                    ]
                    //#2 - Show all available chart types to build in toolbox                        
                    scope.triggerToolbox(menuType, snapshotTypes);
                    
                }

                // TYPE: VISUAL_ITEMS
                scope.visualItemsHandler = function(menuType){
                    //#1 - Get available visual items
                    const visualItems = [
                        new TextConfigItem()
                    ]

                    //#1 - Show all available visual elements to build in toolbox                        
                    scope.triggerToolbox(menuType, visualItems);
                }

                // Initialize variables after menu handlers
                scope.selectedMenu = undefined;

                //#1 - Init menu items                
                scope.menus = [
                    new MenuItem('USER', 'User settings', '', scope.userSettingsHandler.bind(this)),
                    new MenuItem('DATASOURCES', 'Data Sources and Data Sets', 'fa-database', scope.dataSourceHandler.bind(this)),
                    //new MenuItem('TEXT_ITEM_CONFIG', 'Text Builder', 'fa-text-height'),               
                    new MenuItem('VISUAL_ITEMS', 'Visual Builder', 'fa-puzzle-piece', scope.visualItemsHandler.bind(this)),               
                    new MenuItem('CHART_ITEM_CONFIG', 'Charts Builder', 'fa-area-chart', scope.chartItemsConfigHandler.bind(this)),
                    new MenuItem('SNAPSHOT_ITEM_CONFIG', 'Snapshot Builder', 'fa-dashboard', scope.snapshotItemsConfigHandler.bind(this))                        
                ]
                // isolate menu user setting
                scope.userMenu = scope.menus[0];
                

                scope.getMenuByType = function(menuType){
                    let menu = scope.menus.find(menuItem => {
                        return menuItem.type === menuType
                    })
                    return menu;
                }

                // Home controller toolbox trigger
                scope.triggerToolbox = function(menuType, data = undefined){
                    scope.selectedMenu = scope.getMenuByType(menuType)
                    let newEditingElement = new EditingElement('MENU', scope.selectedMenu, data);
                    scope.toggleToolbox(true, newEditingElement);
                }


                // check if a specific menu entry is selected (menu toolbox or another)
                scope.isMenuIconSelected = function(menu){
                    if(!scope.editingElement) return false;
                    
                    // if a menu is beeing edited
                    if(scope.editingElement && scope.editingElement.type === 'MENU')
                        return scope.selectedMenu.id === menu.id;
                    
                    //otherwise is another external component component
                    switch (scope.editingElement.type) {
                        case 'CHART':
                            scope.selectedMenu = scope.getMenuByType('CHART_ITEM_CONFIG')
                            break;
                        case 'TAB':                            
                            scope.selectedMenu = {} //TODO
                            break;
                        default:
                            scope.selectedMenu = {}
                            break;
                    }

                    return scope.selectedMenu.id === menu.id;
                }

            }
        }
    }

]);