// Requires Midi-qol Dinamic Active Effects and Custom Token Animations (optional)
// Add as macro "MirrorImage" [Execute as GM]
// Mirror Image item: On Use Macro "MirrorImage"
// DaE effect "Mirror Image" duration 60s effects 1: macro.execute Value "MirrorImage"
//                                        effects 2: data.attributes.ac.value Override 10+@abilities.dex.mod
// Adds CTA effects if you have the Custom-Token-Animations module
// This macro relies heavly on midi workflow
// If it doesen't work it's probably because of midi settings - figure it out
// The macro uses Hooks, if the gm refreshes the page it will stop working

const isCTA = game.modules.get("Custom-Token-Animations")?.active;
if(args[0].tag == "OnUse"){

    let tactor = canvas.tokens.get(args[0].tokenId).actor;
    let ttokenId = args[0].tokenId;
    await tactor.setFlag("world",`mirrorImage`,3);
    await tactor.setFlag("world",`mirrorImageAC`,tactor.data.data.attributes.ac.value-getBonusAc(tactor));
    let hookid = Hooks.on("midi-qol.preDamageRollComplete", mirrorImageHook);
    tactor.setFlag("world",`mirrorImageHook`,hookid);
    if(isCTA) applyCTA(canvas.tokens.get(args[0].tokenId),3);

    function mirrorImageHook(workflow){
      let interruptdamage = false;
      let actT = workflow.item.data.data.actionType;
      if(actT != "mwak" && actT != "rwak" && actT != "msak" && actT != "rsak") return;
      let indexNum;
      for(let i=0;i<workflow.hitTargets.size;i++){
        if(Array.from(workflow.hitTargets)[i].data._id == ttokenId) indexNum = i;
      } 
      if(indexNum == undefined) return;
      let mirrorImageUses = tactor.getFlag("world", `mirrorImage`);
      let mirrorImageDC;
      if(mirrorImageUses == 3){
          mirrorImageDC = 6;
      }
      else if(mirrorImageUses == 2){
          mirrorImageDC = 8;
      }
      else if(mirrorImageUses == 1){
          mirrorImageDC = 11;
      }
      let r = new Roll(`1d20`).roll();
      if(r._total >= mirrorImageDC){
      mirrorImageUses -= 1;
      if(isCTA) applyCTA(canvas.tokens.get(args[0].tokenId),mirrorImageUses);
      ///////////////Create messages///////////////////
      let cont = `<div class="dnd5e chat-card item-card midi-qol-item-card">
      <header class="card-header flexrow">
      <img src="systems/dnd5e/icons/spells/wind-grasp-magenta-2.jpg" title="Mirror Image" width="36" height="36" />
      <h3 class="item-name">Mirror Image</h3>
    </header></div>
    <div class="dice-roll">
      <div class="dice-result">One of you duplicates took the hit for you!
        <h4 class="dice-total">${r._total}</h4>
        <h4 class="item-name" text-align=center>Duplicates Remaining</h4>
        <h4 class="dice-total">${mirrorImageUses}</h4>
        </div>`;
      ChatMessage.create({roll: r,speaker: {alias: tactor.name}, content: cont,type: 5});
        interruptdamage=true;
      ///////////////////////////
      }
      else{
        let originAC = tactor.getFlag("world",`mirrorImageAC`)+getBonusAc(tactor);
        console.log("Current AC:",originAC);
        if(workflow.attackTotal < originAC) interruptdamage = true;
        let cont = `<div class="dnd5e chat-card item-card midi-qol-item-card">
        <header class="card-header flexrow">
        <img src="systems/dnd5e/icons/spells/wind-grasp-magenta-2.jpg" title="Mirror Image" width="36" height="36" />
        <h3 class="item-name">Mirror Image</h3>
      </header></div>
      <div class="dice-roll">
        <div class="dice-result">The duplicate failed to catch the attack!
          <h4 class="dice-total">${r._total}</h4>
          <h4 class="item-name" text-align=center>Duplicates Remaining</h4>
          <h4 class="dice-total">${mirrorImageUses}</h4>
          </div>`;
        ChatMessage.create({roll: r,speaker: {alias: tactor.name}, content: cont,type: 5});
      }
      tactor.setFlag("world",`mirrorImage`,mirrorImageUses);
      if(mirrorImageUses <= 0){
        
          let hookId = tactor.getFlag("world",`mirrorImageHook`);
          Hooks.off("midi-qol.preDamageRollComplete",hookId);
          tactor.unsetFlag("world",`mirrorImage`);
          tactor.unsetFlag("world",`mirrorImageHook`);
          tactor.unsetFlag("world",`mirrorImageAC`);
          if(tactor.effects.find(e => e.data.label == "Mirror Image"))tactor.effects.find(e => e.data.label == "Mirror Image").delete();
          if(isCTA) CTA.removeAnimByName(canvas.tokens.get(args[args.length-1].tokenId),"Mirror Image");
      }

    if(interruptdamage) {
      workflow.hitTargets.forEach(function(index){
        if (index.data._id == ttokenId){
          workflow.hitTargets.delete(index)
        }
      })
    }
    }



}
else if(args[0] == "off"){
  let tactor = canvas.tokens.get(args[args.length-1].tokenId).actor;
  let hookId = tactor.getFlag("world",`mirrorImageHook`);
  Hooks.off("midi-qol.preDamageRollComplete",hookId);
  tactor.unsetFlag("world",`mirrorImageHook`);
  tactor.unsetFlag("world",`mirrorImageAC`);
  if(isCTA) CTA.removeAnimByName(canvas.tokens.get(args[args.length-1].tokenId),"Mirror Image");
}

function applyCTA(token,copies){

  let textureData = {
    texturePath: token.data.img,
    scale: "0.5",
    speed: 6,
    multiple: copies,
    rotation: "rotation",
    xScale: 0.5,
    yScale: 0.5,
    belowToken: true,
    radius: 0.6,
    opacity: 1,
    tint: 16777215,
    equip: false
}
CTA.addAnimation(token, textureData, true, false, "Mirror Image", true, null)

}

function getBonusAc(tactor){

  let bonusAC = 0;  
  let effects = tactor.effects;
    for( let effect of effects){
      let d = effect.data.duration;
      if(d.seconds == null && d.rounds == null && d.turns == null && (!effect.data.flags.dae?.specialDuration || effect.data.flags.dae?.specialDuration[0] == "None") || effect.data.disabled) continue;
      for(let change of effect.data.changes){

        if(change.key == "data.attributes.ac.value" && change.mode == 2) bonusAC += parseInt(change.value);

      }
    }
  return bonusAC;

}
