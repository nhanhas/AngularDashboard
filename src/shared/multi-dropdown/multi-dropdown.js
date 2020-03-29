/**
 * This component will be used to draw a single multidropdown
 * For dataSets
 */
app
    .directive('multiDropdown', ['$timeout', function($timeout) {
        return {
            restrict: 'EA',
            scope: {
                datasource: '=',
                onAddItem: '&?',
                onRemoveItem: '&?' 
            },
            templateUrl: 'shared/multi-dropdown/multi-dropdown.html',

            link: function (scope, element, attrs) {
                
                //Should be of class DatasourceItem 
                scope.datasource = scope.datasource || undefined;

                if (!attrs.onAddItem) {
                    scope.onAddItem = undefined;
                }

                if (!attrs.onRemoveItem) {
                    scope.onRemoveItem = undefined;
                }
                
                scope.getSelected = function(){
                    return scope.datasource.itens.filter(dataset => dataset.selected );
                }

                scope.getTotalSelected = function(){
                    return scope.getSelected().length;
                }

                //on select item
                scope.onSelectHandler = function(itemSelected){
                    if(scope.onAddItem)
                        scope.onAddItem({itemSelected: itemSelected})
                }

                //on select item
                scope.onUnselectHandler = function(itemSelected){
                    if(scope.onRemoveItem)
                        scope.onRemoveItem({itemSelected: itemSelected})
                }


            }
        }
    }

]);