/**
 * This component will be used to draw Menu 
 */
app
    .directive('menu', ['$timeout', function($timeout) {
        return {
            restrict: 'EA',
            scope: true,
            templateUrl: 'shared/menu/menu.html',

            link: function (scope, element, attrs) {
                
                scope.selectedMenu = undefined;

                //#1 - Init menu items
                scope.menus = [
                    (function(){ let option = new MenuItem(); option.actionName = 'Create DB'; return option })(),
                    (function(){ let option = new MenuItem(); option.actionName = 'Delete DB'; return option })(),
                    (function(){ let option = new MenuItem(); option.actionName = 'Update DB'; return option })()                  
                ]

                scope.getMenuById = function(menuId){
                    let menu = scope.menus.find(menuItem => {
                        return menuItem.id === menuId
                    })
                    return menu;
                }


                scope.triggerToolbox = function(menuId){
                    scope.selectedMenu = scope.getMenuById(menuId)
                    let newEditingElement = new EditingElement('MENU', scope.selectedMenu);
                    scope.toggleToolbox(true, newEditingElement);
                }

            }
        }
    }

]);