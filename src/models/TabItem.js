/**
 * Frontend representation of a tab panel
 * Each tab has the following params to draw
 */
class TabItem{

    id = -1;
    title = '';
    snapshots = [];
    disabled = false;

    constructor(){
        this.id = Math.floor((Math.random() * 100) + 1);
    }

}