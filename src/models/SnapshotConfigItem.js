/**
 * Frontend representation of a snapshot
 * Each tab has the following params to draw
 */
class SnapshotConfigItem{

  snapshotConfigId = 0;
  name = "";
  description = "";
  dashboardId = 0;
  snapshotType = 0;
  backgroundColor = "";
  color = "";
  posX = 0;
  posY = 0;
  width = 0;
  heigth = 0;
  fields = [ ];
  settings = [ ];

  toUpdateView = false;


  constructor(){ }

}