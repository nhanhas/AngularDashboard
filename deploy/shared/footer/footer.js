/**
 * This component will be used to draw Footer app 
 */
app
    .directive('footer', ['$timeout', function($timeout) {
        return {
            restrict: 'EA',
            scope: {
                
            },
            templateUrl: 'shared/footer/footer.html',

            link: function (scope, element, attrs) {
            

            }
        }
    }

]);