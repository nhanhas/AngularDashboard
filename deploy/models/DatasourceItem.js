/**
 * Frontend representation of a Datasource
 */
class DatasourceItem{

    type = 2;
    name = '';
    description = '';
    selected = false;    
    metaDataEntryId;

    itens = []; //items of DatasetItem
    
    expanded = false;

    constructor(){ }

}