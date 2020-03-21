/**
 * This component will be used to draw a single input
 */
app
    .directive('customInput', ['$timeout', function($timeout) {
        return {
            restrict: 'EA',
            scope: {
                model: '=',
                label: '@',
                type: '@?',
                readonly: '=?'
            },
            templateUrl: 'shared/custom-input/custom-input.html',

            link: function (scope, element, attrs) {
                scope.type = scope.type || 'text';
                scope.readonly = scope.readonly || false;
            }
        }
    }

]);