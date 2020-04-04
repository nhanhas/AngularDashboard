/**
 * This component will be used to draw a single color picker
 */
app
    .directive('customColorPicker', ['$timeout', function($timeout) {
        return {
            restrict: 'EA',
            scope: {
                model: '=',
                label: '@',
                readonly: '=?'
            },
            templateUrl: 'shared/custom-color-picker/custom-color-picker.html',

            link: function (scope, element, attrs) {
                scope.type = scope.type || 'text';
                scope.readonly = scope.readonly || false;

                // initialize picker config
                scope.color = '#FF0000';

                scope.options = {             
                  allowEmpty: false,                  
                  format: 'hex',
                  case: 'upper',
                  inputClass: 'form-control',
                  hue: true,
                  saturation: true,
                  lightness: true,
                  alpha: true,
                  
              };
            }
        }
    }

]);