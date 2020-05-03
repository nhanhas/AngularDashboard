/**
 * This component will be used to draw a single input
 */
app
  .directive('visualItem', ['$timeout', 'FrameworkUtils', function($timeout, FrameworkUtils) {
      return {
        restrict: 'EA',
        scope: {
          config : '=' ,        //Visual config object (TextConfigItem, etc...),
          onDeleteItem: '&?',
          onTriggerToolbox: '&?'       //Triggers the edition tab
        },
        templateUrl: 'shared/visual-item/visual-item.html',

        link: function (scope, element, attrs) {
          scope.FrameworkUtils = FrameworkUtils;

          scope.isLoading = false;

          if (!attrs.onDeleteItem) {
              scope.onDeleteItem = undefined;
          }

          if (!attrs.onTriggerToolbox) {
              scope.onTriggerToolbox = undefined;
          }

        //#A - Trigger Toolbox Opening to edit item
        scope.triggerToolbox = function(){
          if(scope.onTriggerToolbox){
            scope.onTriggerToolbox({item : scope.config});
          }  
        }

        //#B - Trigger Popup to delete item
        scope.onDeleteItemHandler = function(){
          if(window.confirm("Are you sure to delete Element?")){
            if(scope.onDeleteItem){
              scope.onDeleteItem({visualConfig : scope.config});
            }  
          }
        }

        //#Aux - get backgroundColor
        scope.getBackgroundColor = function(){
          return { 'background-color': `#${scope.config.backgroundColor}` };
        }

        //#Aux - get color
        scope.getTextColor = function(){
            return { 'color': `#${scope.config.color}` };
        }

          
      }

    }
  }
]);