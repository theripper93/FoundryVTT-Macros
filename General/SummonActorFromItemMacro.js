//shownumbrdialog => ask for how many copies of the creature (will be spawned stacked on top of each other)
//creatures => populate with creatures names (must match actor name) ["aaa","bbb","ccc",...]
let shownumberdialog = true; //uses defaultnumber
let defaultnumber = 1; //nuber of creatures to spawn if shownumberdialog = false
let onlyonecreature = false; //set to true to skip chose creature dialog and use creatures[0] as the creature
let creatures = [/*populate with creatures names (must match actor name) ["aaa","bbb","ccc",...]*/];
let usespelltemplate = false;
let filterforfolder = false;
let folderId = "";

if (args[0].tag === "OnUse") {
async function choose(options = [], prompt = ``)
{
  let value = await new Promise((resolve) => {

    let dialog_options = (options[0] instanceof Array)
      ? options.map(o => `<option value="${o[0]}">${o[1]}</option>`).join(``)
      : options.map(o => `<option value="${o}">${o}</option>`).join(``);
  
    let content = `
    <table style="width=100%">
      <tr><th>${prompt}</th></tr>
      <tr><td><select id="choice">${dialog_options}</select></td></tr>
    </table>`;
  
    new Dialog({
      content, 
      buttons : { OK : {label : `OK`, callback : async (html) => { resolve(html.find('#choice').val()); } } }
    }).render(true);
  });
  return value;
}

let numbers = [];
for (let i=1;i<11;i++){
    numbers[i]=i;
}
let chosencreature = onlyonecreature ? creatures[0] : await choose(creatures, "Wich Creature/s do you want to summon?");
let numbercreature = shownumberdialog ? await choose(numbers, "How many Creatures do you want to summon?") : defaultnumber;




/** intended for use with Item Macro. 'item' here is the spell being cast if using outside Item Macro */
/** spawns an actor with the same name as the spell at the location of the template */
(async ()=>{
    function spawnActor(scene, template) {
       
         let protoToken = filterforfolder ? duplicate(game.actors.find( actor => actor.data.folder == folderId && actor.data.name == chosencreature).data.token) : duplicate(game.actors.getName(chosencreature).data.token);
         protoToken.x = template.x;
         protoToken.y = template.y;
         protoToken.flags.summoner = args[0].tokenId;
         // Increase this offset for larger summons
         protoToken.x -= (scene.data.grid/2+(protoToken.width-1)*scene.data.grid);
         protoToken.y -= (scene.data.grid/2+(protoToken.height-1)*scene.data.grid);
        
         return canvas.tokens.createMany(protoToken,{});
     }
    
    async function deleteTemplatesAndSpawn (scene, template) {
        for (let i=0;i<parseInt(numbercreature);i++){
        await spawnActor(scene,template);
    }
        await canvas.templates.deleteMany([template._id]);
    }
        
    
    if (usespelltemplate == false){
      Hooks.once("createMeasuredTemplate", deleteTemplatesAndSpawn);
    let template = new game.dnd5e.canvas.AbilityTemplate({
                t: "circle",
                user: game.user._id,
                distance: 3.5,
                direction: 0,
                x: 0,
                y: 0,
                fillColor: game.user.color
            });       
    let tactor = canvas.tokens.placeables.find(a => a.data._id == args[0].tokenId);
    let item = tactor.actor.items.find(i => i.data._id == args[0].item._id);         
    template.actorSheet = item.options.actor.sheet;
    template.drawPreview();
  }
  else{

    let template = canvas.templates.placeables.find(t => t.data._id == args[0].templateId).data;
    deleteTemplatesAndSpawn(canvas.scene, template);
  }
  //create flag to delete summon
  const effectData = {
    changes: [
      {key: "macro.itemMacro", mode: 0, value: `ItemMacro.${args[0].item.name}`, priority: 20},
      {key: "flags.midi-qol.concentration-data.targets", mode: 2, value: {"actorId":  args[0].actor._id, "tokenId": args[0].tokenId}, priority: 20}
    ],
    origin: args[0].uuid, //flag the effect as associated to the ability beeing applyed
    disabled: false,
    duration: args[0].item.data.duration,
    icon: args[0].item.img,
    label: args[0].item.name,
    flags: {dae: {itemData: args[0].item}}
  }
  await actor.createEmbeddedEntity("ActiveEffect", effectData);

    

})();
}
else if (args[0] === "off") {
  let summonedCreatures = canvas.tokens.placeables.filter(i => i.data.flags.summoner == args.find(t => t.tokenId != undefined).tokenId);
  for (let i=0;i<summonedCreatures.length;i++){
    await game.macros.getName("RequestGmDelete").execute(summonedCreatures[i].data._id, game.userId);
  }
}