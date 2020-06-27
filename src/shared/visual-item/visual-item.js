/**
 * This component will be used to draw a single input
 */
app
  .directive('visualItem', ['$timeout', 'FrameworkUtils', function($timeout, FrameworkUtils) {
      return {
        restrict: 'EA',
        scope: {
          config : '=' ,        //Visual config object (TextConfigItem, etc...),
          onDeleteVisual: '&?',
          onTriggerToolbox: '&?',       //Triggers the edition tab
          tab: '=?', // used for container visual,
          onChildTriggerToolbox: '&?', // on edit element from visual container
          onChildDeleteChart: '&?', // on remove element from visual container
          onChildDeleteSnapshot: '&?', // on remove element from visual container
          onChildDeleteVisual: '&?' // on remove element from visual container
      
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

          if (!attrs.onChildTriggerToolbox) {
            scope.onChildTriggerToolbox = undefined;
          }

          if (!attrs.onChildDeleteChart) {
            scope.onChildDeleteChart = undefined;
          }

          if (!attrs.onChildDeleteSnapshot) {
            scope.onChildDeleteSnapshot = undefined;
          }

          if (!attrs.onChildDeleteVisual) {
            scope.onChildDeleteVisual = undefined;
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
            if(scope.onDeleteVisual){
              scope.onDeleteVisual({visualConfig : scope.config});
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


        /**
         * Visual container utils
         */

        // Gridstack configuration
        scope.gridStackOptions = {
          cellHeight: 50,
          verticalMargin: 10,
          acceptWidgets: '.chart-config-element',
          float: true,
          dragOut: false,
          resizable: {
              handles: 'e, se, s, sw, w'
            },
        };

        scope.getItemsByCollection = function(tab, collection){
          if(!tab) {return false;}

          return tab[collection].filter(value => {
            if(!value.settings) { return false }; // TODO - remove when chartConfig has settings field
            const container = value.settings.find(setting => setting.Key === 'visualContainer');
            return container 
              ? +container.Value === scope.config.visualConfigId
              : false;
          })
        };

        // reset setting 'viewContainer' to this element
        scope.onDropComplete=function(data, event, tab){
          // handler for chart config item
          if(data instanceof ChartConfigItem){ 
            //TODO
          }
                    
          // visual items 
          if(data instanceof VisualConfigItem){ 
            tab.visuals.forEach(visual =>{
              // re-define this new element to be on this container
              if(visual === data){
                const availableY = scope.getAvailableSlot(tab);

                visual.settings.push({
                  Key: 'visualContainer',
                  Value: String(scope.config.visualConfigId)
                });

                visual.posY = availableY;
                visual.posX = 0;
                
              }
            })
          }

          // snapshot items 
          if(data instanceof SnapshotConfigItem){ 
            tab.snapshots.forEach(snapshot =>{
              // re-define this new element to be on this container
              if(snapshot === data){
                const availableY = scope.getAvailableSlot(tab);

                snapshot.settings.push({
                  Key: 'visualContainer',
                  Value: String(scope.config.visualConfigId)
                });

                snapshot.posY = availableY;
                snapshot.posX = 0;
                
              }
            })
          }
        };

        // UTIL: get 1st available slot on container
        scope.getAvailableSlot = function(tab){
          let availableSlot = 0, max = 0;
          // max at charts
          max = Math.max.apply(Math, scope.getItemsByCollection(tab, 'charts').map(function(element) { return element.posY + element.heigth; }));
          availableSlot = max > availableSlot 
              ? max
              : availableSlot;

          // max at snapshots
          max = Math.max.apply(Math, scope.getItemsByCollection(tab, 'snapshots').map(function(element) { return element.posY + element.heigth; }));
          availableSlot = max > availableSlot 
              ? max
              : availableSlot;
          
          // max at visuals
          max = Math.max.apply(Math, scope.getItemsByCollection(tab, 'visuals').map(function(element) { return element.posY + element.heigth; }));
          availableSlot = max > availableSlot 
              ? max
              : availableSlot;

          return availableSlot
        }
        
        // any child of container that triggers toolbox
        scope.childTriggerToolbox = function(type, item){
          if(scope.onChildTriggerToolbox){
            scope.onChildTriggerToolbox({type: type, item : item});
          }  
        }


        // delete handler for chart
        scope.childDeleteChart = function(itemConfig, tab){
          if(scope.onChildDeleteChart){
            scope.onChildDeleteChart({chartConfig: itemConfig, tab : tab});
          }  
        }

        // delete handler for snapshot
        scope.childDeleteSnapshot = function(itemConfig, tab){
          if(scope.onChildDeleteSnapshot){
            scope.onChildDeleteSnapshot({snapshotConfig: itemConfig, tab : tab});
          }  
        }

        // delete handler for visual
        scope.childDeleteVisual = function(itemConfig, tab){
          if(scope.onChildDeleteVisual){
            scope.onChildDeleteVisual({visualConfig: itemConfig, tab : tab});
          }  
        }

      }

    }
  }
]);