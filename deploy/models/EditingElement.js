/**
 * Frontend representation of an editing element
 * Each tab has the following params to draw
 */
class EditingElement{

    type = ''; //[TAB, SNAPSHOT]
    item = undefined; //Can be any known type    

    constructor(type, item){
        this.type = type;       
        this.item = item;
    }

}