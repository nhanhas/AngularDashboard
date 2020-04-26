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
                onRemoveItem: '&?',
                single: '=?' 
            },
            templateUrl: 'shared/multi-dropdown/multi-dropdown.html',

            link: function (scope, element, attrs) {
                
                //Should be of class DatasourceItem 
                scope.datasource = scope.datasource || undefined;
                scope.single = scope.single || false;

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
                    // if [single] usage, deselect other ones
                    if(scope.single){
                        scope.datasource.itens.forEach(item => {
                            if(item !== itemSelected){
                                item.selected = false
                            }
                        });
                    }
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