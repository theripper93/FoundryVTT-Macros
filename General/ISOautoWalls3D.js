(async () => {

/**
 * Isometric map AUTO WALLS - Run in NON ISOMETRIC mode
 * This script will run on selected walls\doors only
 * After the script is finished enable the ISO mode on the map
 * then refresh (f5) to see the correct results
 */

// WARNING after the placing of the tiles is complete the script will start flagging
// DO NOT do anything until you see "Flagging Completed" in the console (F12)
// DO NOT do anything else while the script is running it might(tm) break
// MAKE A COPY OF YOUR MAP BEFORE RUNNING THIS
// This script was made to be run locally i have no idea if or how it works on remote hosting
// CONFIGURE the settings below

  const wallH = 200; // Height of the wall in pixels
  const wallW = 15; // Thickness of the wall
  const alpha = 0; // Transparency of the wall when not visible
  const centerWalls = false; //Center the Z position of the wall (suggested false)
  const shadeTop = true; // Darken the top side texture
  const shadeSide = false; // Slightli darken the Side texture
  const rootFolder = "isoWalls"; // Folder to dump the image files in, do not move the files (path is relative to your data folder)
  const wallTextureFace = ""; //Relative path to your wall texture (you can copy the path from file picker)
  const wallTextureTop = "";
  const wallTextureSide = ""; 
  const doorTextureFace = ""; //Relative path to your door texture (you can copy the path from file picker)
  const doorTextureTop = "";
  const doorTextureSide = "";

//////////////////////////////////////////////////////////////////////////////////////////////////////////
await createFolderIfMissing(".", rootFolder);
await createFolderIfMissing(rootFolder, `${rootFolder}/${canvas.scene.id}`);
let container = new PIXI.Container();
const folder = `${rootFolder}/${canvas.scene.id}`;
let failedTiles = [];
let sortedWalls = canvas.walls.controlled.sort(sortWallsY).sort(sortWallsX)
  for (let wall of sortedWalls) {

    $('#notifications').empty(); //clear notifications

    const isDoor = wall.data.door === 1 ? true : false; //first y > second y reverse
    let c = [];
    if(wall.data.c[2]<wall.data.c[0]){
      c = [wall.data.c[2],wall.data.c[3],wall.data.c[0],wall.data.c[1]]
    }
    else if (wall.data.c[2]>wall.data.c[0]){
      c = [wall.data.c[0],wall.data.c[1],wall.data.c[2],wall.data.c[3]]
    }
    else if(wall.data.c[2]==wall.data.c[0]){
      if(wall.data.c[1]>wall.data.c[3]){
        c = [wall.data.c[0],wall.data.c[1],wall.data.c[2],wall.data.c[3]]
      }
      else{
        c = [wall.data.c[2],wall.data.c[3],wall.data.c[0],wall.data.c[1]]
      }
    }
    const wall0 = c[0]-c[2] == 0 ? 1 : c[0]-c[2]
    const wallRad = Math.atan(Math.abs(c[1]-c[3])/Math.abs(wall0))
    const isoRad = wallRad-((90*Math.PI)/180)
    const centerx = centerWalls ? wallW*Math.cos(isoRad)/2 : 0
    const centery = centerWalls ? wallW*Math.sin(isoRad)/2 : 0
    //Draw front face
    let drawingpts = [
      [0, 0],
      [c[2] - Math.abs(c[0]), c[3] - Math.abs(c[1])],
      [c[2] - Math.abs(c[0]) + wallH, c[3] - Math.abs(c[1]) - wallH],
      [wallH, -wallH],
      [0, 0],
    ];
    
    let wallDrawingFace = new Drawing({
      type: CONST.DRAWING_TYPES.POLYGON,
      author: game.user._id,
      x: c[0],
      y: c[1],
      width: 0,
      height: 0,
      fillType: 2,
      fillColor: "",
      fillAlpha: 1,
      strokeWidth: 0,
      strokeColor: "",
      strokeAlpha: 0,
      texture: isDoor ? doorTextureFace : wallTextureFace,
      textureAlpha: 1,
      points: drawingpts,
    });
///////////////////
/////////draw side face//////////
drawingpts = [
  [0, 0],
  [wallW*Math.cos(isoRad),wallW*Math.sin(isoRad)],
  [wallH+wallW*Math.cos(isoRad),wallW*Math.sin(isoRad)-wallH],
  [wallH, -wallH],
  [0, 0],
];

let wallDrawingSide = new Drawing({
  type: CONST.DRAWING_TYPES.POLYGON,
  author: game.user._id,
  x: c[0],
  y: c[1],
  width: 0,
  height: 0,
  fillType: 2,
  fillColor: shadeSide ? "#9e9e9e" : "",
  fillAlpha: 1,
  strokeWidth: 0,
  strokeColor: "",
  strokeAlpha: 0,
  texture: isDoor ? doorTextureSide : wallTextureSide,
  textureAlpha: 1,
  points: drawingpts,
});
///////////////////
/////////draw top face//////////
drawingpts = [
  [wallH, -wallH],
  [wallH+wallW*Math.cos(isoRad),wallW*Math.sin(isoRad)-wallH],
  [c[2] - Math.abs(c[0]) + wallH+wallW*Math.cos(isoRad),wallW*Math.sin(isoRad)+c[3] - Math.abs(c[1]) - wallH],
  [c[2] - Math.abs(c[0]) + wallH, c[3] - Math.abs(c[1]) - wallH],
  [wallH, -wallH],
];

let wallDrawingTop = new Drawing({
  type: CONST.DRAWING_TYPES.POLYGON,
  author: game.user._id,
  x: c[0],
  y: c[1],
  width: 0,
  height: 0,
  fillType: 2,
  fillColor: shadeTop ? "#5c5c5c" : "",
  fillAlpha: 1,
  strokeWidth: 0,
  strokeColor: "",
  strokeAlpha: 0,
  texture: isDoor ? doorTextureTop : wallTextureTop,
  textureAlpha: 1,
  points: drawingpts,
});
///////////////////
//////////////////
    container.children = [];
    //Copy all drawings into a PIXI Container
    container.addChild(wallDrawingFace);
    container.addChild(wallDrawingSide);
    container.addChild(wallDrawingTop);
    await container.children[0].draw();
    await container.children[1].draw();
    await container.children[2].draw();

    let spritea = new PIXI.Sprite();
    spritea.isSprite = true;
    spritea.width = 0;
    spritea.height = 0;

    spritea.position.x = 0;
    spritea.position.y = 0;

    container.addChild(spritea);
    let w = container.width;
    let h = container.height;
    container.removeChild(spritea);
    let fileNameLabel = isDoor ? "DOORID" : "WALLID"
    let filename = `${fileNameLabel}.${wall.id}.webp`;
    let img = await canvas.app.renderer.extract.base64(
      container,
      "image/webp",
      0.6
    );
    let res = await fetch(img);
    let blob = await res.blob();
    let file = new File([blob], filename, { type: "image/webp" });
    await FilePicker.upload("data", folder, file, {});
    let tileData = {
      img: folder + "/" + filename,
      height: container.height,
      width: container.width,
      x: w - container.width-centerx,
      y: h - container.height-centery,
      angle: container.angle,
    };
    try{

      await Tile.create(tileData);

    }
    catch{
      debugger
      failedTiles.push(tileData)
    }
    
  }
  console.log(failedTiles);
  for(let tileData of failedTiles){
    await Tile.create(tileData);
  }
  container.destroy();
  $('#notifications').empty(); //clear notifications
  console.log("Flagging Started");
  for (let tile of canvas.tiles.placeables) {
    let pathSplit = tile.data.img.split("/");
    let pathSplit2 = pathSplit[pathSplit.length - 1];
    let wallId = pathSplit2.split(".")[1];
    if(pathSplit2.split(".")[0] == "WALLID"){
        await tile.setFlag("grape_juice-isometrics", "attach_wall_id", wallId);
        await tile.setFlag("grape_juice-isometrics", "tile_alpha", alpha);
    }
    if(pathSplit2.split(".")[0] == "DOORID"){
        await tile.setFlag("grape_juice-isometrics", "attach_wall_id", wallId);
        await tile.setFlag("grape_juice-isometrics", "hook_door_id", wallId);
        await tile.setFlag("grape_juice-isometrics", "tile_alpha", alpha);
    }
    
  }
  console.log("Flagging Completed");

  async function createFolderIfMissing(target, folderPath) {
    var source = "data";
    if (typeof ForgeVTT != "undefined" && ForgeVTT.usingTheForge) {
        source = "forgevtt";
    }
    var base = await FilePicker.browse(source, folderPath);
    console.log(base.target);
    if (base.target == target)
    {
        await FilePicker.createDirectory(source, folderPath);
    }
}

function sortWallsX(a,b){

  const xa = a.center.x//Math.max(a.data.c[0],a.data.c[2])
  const xb = b.center.x//Math.max(b.data.c[0],b.data.c[2])
  if(xa >= xb) return -1
  if(xa < xb) return 1
  return 0

}

function sortWallsY(a,b){

  const xa = a.center.y//Math.min(a.data.c[1],a.data.c[3])
  const xb = b.center.y//Math.min(b.data.c[1],b.data.c[3])
  if(xa >= xb) return -1
  if(xa < xb) return 1
  return 0

}

})();
