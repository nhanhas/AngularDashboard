/**
 * Frontend representation of a Maneu
 * Each tab has the following params to draw
 */
class MenuItem{

    id = -1;
    actionName = '';
    icon = '';

    constructor(){
        this.id = Math.floor((Math.random() * 100) + 1);
    }

}