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

  const wallH = 100; // Height of the wall in pixels
  const alpha = 0; // Transparency of the wall when not visible
  const rootFolder = "isoWalls"; // Folder to dump the image files in, do not move the files (path is relative to your data folder)
  const wallTexture = ""; //Relative path to your wall texture (you can copy the path from file picker)
  const doorTexture = ""; //Relative path to your door texture (you can copy the path from file picker)

//////////////////////////////////////////////////////////////////////////////////////////////////////////
await createFolderIfMissing(".", rootFolder);
await createFolderIfMissing(rootFolder, `${rootFolder}/${canvas.scene.id}`);

const folder = `${rootFolder}/${canvas.scene.id}`;

  for (let wall of canvas.walls.controlled) {

    const isDoor = wall.data.door === 1 ? true : false;
    let c = wall.data.c;
    let drawingpts = [
      [0, 0],
      [c[2] - Math.abs(c[0]), c[3] - Math.abs(c[1])],
      [c[2] - Math.abs(c[0]) + wallH, c[3] - Math.abs(c[1]) - wallH],
      [wallH, -wallH],
      [0, 0],
    ];
    
    let wallDrawing = new Drawing({
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
      texture: isDoor ? doorTexture : wallTexture,
      textureAlpha: 1,
      points: drawingpts,
    });

    let container = new PIXI.Container();

    //Copy all drawings into a PIXI Container
    container.addChild(wallDrawing);
    await container.children[0].draw();

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
    await Tile.create({
      img: folder + "/" + filename,
      height: container.height,
      width: container.width,
      x: w - container.width,
      y: h - container.height,
      angle: container.angle,
    });
  }
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


})();
