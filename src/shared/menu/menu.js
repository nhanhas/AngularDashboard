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
                
                scope.menus = [
                    { id: 1, actionName: 'Create DB' },
                    { id: 2, actionName: 'Delete DB' }, 
                    { id: 3, actionName: 'Update DB' }                    
                ]

                scope.getMenuById = function(menuId){
                    let menu = scope.menus.find(menuItem => {
                        return menuItem.id === menuId
                    })
                    return menu;
                }


                scope.triggerToolbox = function(menuId){
                    let newEditingElement = new EditingElement('MENU', scope.getMenuById(menuId));
                    scope.toggleToolbox(true, newEditingElement);
                }

            }
        }
    }

]);