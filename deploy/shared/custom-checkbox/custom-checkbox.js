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
                item: '=?',
                label: '@',
                onSelect: '&?',
                onUnselect: '&?'
            },
            templateUrl: 'shared/custom-checkbox/custom-checkbox.html',

            link: function (scope, element, attrs) {

                if (!attrs.onSelect) {
                    scope.onSelect = undefined;
                }

                if (!attrs.onUnselect) {
                    scope.onUnselect = undefined;
                }

                // to prevent load datasources at beggining
                scope.$watch('model', function (newValue, oldValue, scope) {
                    if(newValue === oldValue) return;
                    if(newValue && scope.onSelect) { scope.onSelect({itemSelected: scope.item}) }

                    if(!newValue && scope.onUnselect) { scope.onUnselect({itemSelected: scope.item}) }
                        
                });
                
            }
        }
    }

]);