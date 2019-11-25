/**
 * Frontend representation of a Maneu
 * Each tab has the following params to draw
 */
class MenuItem{

    id = -1;
    type = ''; // This can be: ['DATASOURCE', 'CHART_BUILDER', 'CHARTS']
    actionName = '';
    icon = '';
    handler = undefined; //handler function on click

    constructor(type, actionName, icon, handler = undefined){
        this.id = Math.floor((Math.random() * 100) + 1);
        this.type = type;
        this.actionName = actionName;
        this.icon = icon; 
        this.handler = handler
    }

}