/**
 * Frontend representation of a Datasource
 */
class DatasourceItem{

    id = -1;
    name = '';
    type = '';
    datasets = []; //items of DatasetItem

    constructor(name, type, datasets = []){
        this.id = Math.floor((Math.random() * 100) + 1);
        this.name = name;
        this.type = type;
        this.datasets = datasets;
    }

}