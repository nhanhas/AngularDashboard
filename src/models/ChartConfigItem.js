/**
 * Frontend representation of a Chart
 * Each tab has the following params to draw
 */
class ChartConfigItem{

    chartConfigId = 0;
    name = "";
    description = "";
    chartSetId = 0;
    chartType = "";
    backgroundColor = "";
    color = "";
    posX = 0;
    posY = 0;
    width = 0;
    heigth = 0;
    fields = [ ];
    settings = [ ];
    XAxisMetadataEntry = 0;

    toUpdateView = false;
  

    constructor(){ }

}
