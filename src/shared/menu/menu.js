/**
 * This component will be used to draw Menu 
 */
app
    .directive('menu', ['$timeout', function($timeout) {
        return {
            restrict: 'EA',
            scope: {
                tabCollection : '=',  //Tab collection
                onAddNew: '&?',       //Handler for add new Tab
                onEditTab: '&?'       //Triggers the edition tab
                           
            },
            templateUrl: 'shared/menu/menu.html',

            link: function (scope, element, attrs) {

            }
        }
    }

]);