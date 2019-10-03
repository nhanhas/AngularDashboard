/**
 * This component will be used to draw Snapshot
 */
app
    .directive('snapshot', ['$timeout', function($timeout) {
        return {
            restrict: 'EA',
            scope: {
                item : '=' , //SnapshotItem object
                onTriggerToolbox: '&?'       //Triggers the edition tab
            },
            templateUrl: 'shared/snapshot/snapshot.html',

            link: function (scope, element, attrs) {
            
                if (!attrs.onTriggerToolbox) {
                    scope.onTriggerToolbox = undefined;
                }


                //#A - Trigger Toolbox Opening to edit Snapshot
                scope.triggerToolbox = function(snapId){
                    if(scope.onTriggerToolbox){
                        scope.onTriggerToolbox({snapId : snapId});
                    }  
                }
            }
        }
    }

]);