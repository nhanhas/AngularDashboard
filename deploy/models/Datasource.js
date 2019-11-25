/**
 * Frontend representation of a Maneu
 * Each tab has the following params to draw
 */
class DatasourceItem{

    id = -1;
    name = '';
    type = '';
    items = []; //items of DatasetItem

    constructor(){
        this.id = Math.floor((Math.random() * 100) + 1);
    }

}