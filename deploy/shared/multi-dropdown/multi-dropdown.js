/**
 * This component will be used to draw a single multidropdown
 * For dataSets
 */
app
    .directive('multiDropdown', ['$timeout', function($timeout) {
        return {
            restrict: 'EA',
            scope: {
                datasource: '=' 
            },
            templateUrl: 'shared/multi-dropdown/multi-dropdown.html',

            link: function (scope, element, attrs) {

                //Should be of class DatasourceItem 
                scope.datasource = scope.datasource || undefined;
                


            }
        }
    }

]);