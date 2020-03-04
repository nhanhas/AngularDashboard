/**
 * Frontend representation of an editing element
 * Each tab has the following params to draw
 */
class EditingElement{

    type = ''; //[TAB, CHART, MENU]
    item = undefined; // Can be any known type  
    data = undefined; // All Required data to edit/use  

    constructor(type, item, data = undefined ){
        this.type = type;       
        this.item = item;
        this.data = data;
    }

}