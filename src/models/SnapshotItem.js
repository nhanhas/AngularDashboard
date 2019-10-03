/**
 * Frontend representation of a snapshot
 * Each tab has the following params to draw
 */
class SnapshotItem{

    id = -1;
    tabId = -1;
    title = '';
    
    constructor(){
        this.id = Math.floor((Math.random() * 100) + 1);
    }

}