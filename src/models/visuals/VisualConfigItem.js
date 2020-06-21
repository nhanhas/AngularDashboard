/**
 * Frontend representation of a visual
 * Each tab has the following params to draw
 */
class VisualConfigItem{

  visualConfigId = 0;
  name = "";
  description = "";
  dashboardId = 0;
  visualType = 0;
  backgroundColor = "";
  color = "";
  posX = 0;
  posY = 0;
  width = 0;
  heigth = 0;
  settings = [ ];

  toUpdateView = false;


  constructor(){ }

}