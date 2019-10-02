/**
 * This component will be used to draw Tabset 
 * with his own tabs
 */
app
    .directive('tabset', ['$timeout', function($timeout) {
        return {
            restrict: 'EA',
            scope: {
                tabCollection : '=',  //Tab collection
                onAddNew: '&?',       //Handler for add new Tab
                onEditTab: '&?'       //Triggers the edition tab
                           
            },
            templateUrl: 'shared/tabset/tabset.html',

            link: function (scope, element, attrs) {
                
                //#1 - Initialize attrs
                scope.tabCollection = scope.tabCollection || [];
                
                if (!attrs.onAddNew) {
                    scope.onAddNew = undefined;
                }

                if (!attrs.onEditTab) {
                    scope.onEditTab = undefined;
                }

                /**
                 * #2 - Controller variables                 
                 */
                //Wich tab is active
                scope.activeTab = 1;


                /**
                 * #3 - Handlers 
                 */
                //#A - Add new Tab
                scope.addNewTabHandler = function(event){                    
                    if(scope.onAddNew){
                        scope.onAddNew();
                    }                    
                }

                //#B - Edit Tab
                scope.editTabHandler = function(tabId){
                    if(scope.onEditTab){
                        scope.onEditTab({tabId : tabId});
                    }  
                }

            }
        }
    }
]);


/**
 * Developer Doc:
 * 
 * 
 * A single Tab of tabCollection should have the following:
 * 
 * {
 *      id: <Integer>,
 *      disabled: <Boolean>,
 *      snapshots: <Object Array>
 * }
 * 
 * 
 */