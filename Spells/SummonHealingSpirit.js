//Ad as ItemMacro, on use macro ItemMacro - needs the companion macro RequestGmDelete found below
// Summons an actor from your actor directory named "Healing Spirit" - it need an item called "Heal" (set it to heal 1d6)
// also give "Healing Spirit" immunity to all damage and give ownership to the player
let shownumberdialog = false; //uses defaultnumber
let defaultnumber = 1; //nuber of creatures to spawn if shownumberdialog = false
let onlyonecreature = true; //set to true to skip chose creature dialog and use creatures[0] as the creature
let creatures = ["Healing Spirit"];
let usespelltemplate = true;
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
//Wildfire spirit stuff
const WFShp = parseInt(args[0].actor.data.abilities.wis.mod)+1;

//wildfirespirit.items.find(item => item.data.name == "Flame Seed").data.data.damage.parts[0] = FlameSeedFTDmg;
//wildfirespirit.items.find(item => item.data.name == "Fiery Teleportation").data.data.damage.parts[0] = FlameSeedFTDmg;
//wildfirespirit.data.data.attributes.hp.max = WFShp;
//wildfirespirit.data.data.attributes.hp.value = WFShp;

//End of wildfire spirit
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
        const healing = `${args[0].spellLevel-1}d6`;
        const updatehp = {"data.attributes.hp.max": [[WFShp]], "data.attributes.hp.value": [[WFShp]]}; 
        const updateft = {"data.damage.parts": [[`${healing}`,"healing"]]};   
        let wildfirespirit = canvas.tokens.placeables.find(t => t.actor.data.name == "Healing Spirit");
        await wildfirespirit.actor.update(updatehp);
        await wildfirespirit.actor.items.getName("Heal").update(updateft);
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
    duration: {rounds: null, seconds: 3600, startRound: null, startTime: null, startTurn: null, turns: null},
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

/*RequestGmDelete execute as GM

if (canvas.tokens.placeables.find(t => t.data._id == args[0]).actor.data.permission[args[1]] == 3){
    return await canvas.tokens.deleteMany(args[0]);
}
else{
    return{};
}

*/