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

        //#Aux - get Line
        scope.getLineSize = function(isVertical){
          return isVertical 
            ? { 'width': `${scope.getVisualSetting('lineSize')}px` }
            : { 'height': `${scope.getVisualSetting('lineSize')}px` };
      }

        //#Aux - get visual setting by key
        scope.getVisualSetting = function(setting){
          // get setting
          let visualSetting = scope.config.settings.find(value => value.Key === setting);
          if(visualSetting) { return visualSetting.Value; }

      }
          
      }

    }
  }
]);