/**
 * Frontend representation of a Datafield
 */
class DatafieldItem{

    id = -1;
    name = '';
    type = '';

    constructor(){
        this.id = Math.floor((Math.random() * 100) + 1);
    }

}