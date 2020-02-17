/**
 * Frontend representation of a Datasource
 */
class DatasourceItem{

    type = 1;
    name = '';
    description = '';
    selected = false;    
    metaDataEntryId;

    itens = []; //items of DatasetItem
    
    expanded = false;

    constructor(){ }

}