/**
 * Frontend representation of a Dataset
 */
class DatasetItem{

    id = -1;
    name = '';
    type = '';
    selected = false;
    fields = []; //items of DatafieldItem

    constructor(name, type, fields = [], selected = false){
        this.id = Math.floor((Math.random() * 100) + 1);
        this.name = name;
        this.type = type;
        this.fields = fields; 
        this.selected = selected;
    }

}