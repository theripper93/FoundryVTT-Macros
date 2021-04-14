let template = canvas.templates.get(args[0].templateId)
const ttoken = canvas.tokens.get(args[0].tokenId);
console.log(args);
let effects = args[0].item.effects
let templateEffectData = []
for( let effect of effects){
   if(effect.changes[0]) effect.changes[0].value = effect.changes[0].value.replace('itemid' , args[0].item._id).replace('actorid', args[0].actor._id).replace('auralevel' , args[0].item.data.level);
   let data = { data: duplicate(effect), parentActorId: false, parentActorLink: false, entityType: "template", entityId:template.id,}
   templateEffectData.push(data)
}
await template.setFlag("ActiveAuras", "IsAura", templateEffectData)
ActiveAuras.CollateAuras(canvas.scene._id, true, false, "spellCast")
if(args[0].item.data.activation.condition == "attach") tokenAttacher.attachElementToToken(template, ttoken);

if(args[0].item.data.activation.condition != "attach" && args[0].item.data.activation.condition != ""){
   let noSaveTargetsIds = [];
   for(let t of args[0].hitTargets){
     let isSave = false;
     for(let ts of args[0].saves){
       if(ts._id == t._id) isSave = true;
     }
     if(isSave == false) noSaveTargetsIds.push(t._id);
   
   }
   
     for(let tid of noSaveTargetsIds){
       let cubtactor = canvas.tokens.get(tid).actor;
       await game.cub.addCondition(args[0].item.data.activation.condition, cubtactor);
     }
   
   }

return  {haltEffectsApplication: true}
