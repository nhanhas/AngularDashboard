/**
 * This component will be used to draw a single checkbox
 * For dataSets
 */
app
    .directive('customCheckbox', ['$timeout', function($timeout) {
        return {
            restrict: 'EA',
            scope: {
                model: '=',
                label: '@'
            },
            templateUrl: 'shared/custom-checkbox/custom-checkbox.html',

            link: function (scope, element, attrs) {

                
            }
        }
    }

]);