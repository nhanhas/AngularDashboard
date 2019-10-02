/**
 * This component will be used to draw Side panel
 * toolbox 
 * It will accept transclude
 */
app
    .directive('toolbox', ['$timeout', function($timeout) {
        return {
            restrict: 'EA',
            scope: true,
            transclude: true,
            templateUrl: 'shared/toolbox/toolbox.html',

            link: function (scope, element, attrs) {
                scope.isToolReady = false;
                
                $timeout(function(){
                    scope.isToolReady = true;
                })
            }
        }
    }
]);