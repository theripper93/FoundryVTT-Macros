//DAE Macro,  MacroExecute macro name Confusion
// Item -> SRD confusion
// 
// DAE effect1 (name Confusion End): 1 -> macro.execute - value Confusion @item.save.dc | Duration - Macro repeat end of each turn
// DAE effect2 (name Confusion Start): 1 -> macro.execute - value Confusion | Duration - Macro repeat start of each turn
// Remove icon on second effect

const lastArg = args[args.length-1];
if(args[0] == "each" && lastArg.efData.flags.dae.macroRepeat == "startEveryTurn"){
    let tactor = canvas.tokens.get(lastArg.tokenId);
    let r = await new Roll(`1d10`).roll();
    let message;
    if(r._total == 1){
        message = "The creature uses all its Movement to move in a random direction. To determine the direction, roll a [[1d8]] and assign a direction to each die face. The creature doesn't take an action this turn.";
    }else if(r._total < 7 && r._total > 1){
        message = "The creature doesn't move or take Actions this turn.";
    }else if(r._total == 7 || r._total == 8){
        message = "The creature uses its action to make a melee Attack against a randomly determined creature within its reach. If there is no creature within its reach, the creature does nothing this turn."
    }else if(r._total > 8){
        message = "The creature can act and move normally.";
    }
    let cont = `<div class="dnd5e chat-card item-card midi-qol-item-card">
    <header class="card-header flexrow">
    <img src="systems/dnd5e/icons/spells/wind-magenta-3.jpg" title="Confusion" width="36" height="36" />
    <h3 class="item-name">Confusion</h3>
  </header></div>
  <div class="dice-roll">
    <div class="dice-result">${message}
      <h4 class="dice-total">${r._total}</h4>
      </div>`;
    ChatMessage.create({roll: r,speaker: {alias: tactor.name}, content: cont,type: 5});


}
else if(args[0] == "each" && lastArg.efData.flags.dae.macroRepeat == "endEveryTurn"){

    let ttoken = canvas.tokens.get(lastArg.tokenId);
    let tactor = ttoken.actor;
    const saveDC = lastArg.efData.flags.dae.itemData.data.save.dc;
    if(await save(tactor, "Confusion", "wis", "Confusion ends on a Save", saveDC)){
        let startEff = tactor.effects.find(e => e.data.label == "Confusion Start");
        let endEff = tactor.effects.find(e => e.data.label == "Confusion End");
        if(startEff) await startEff.delete();
        if(endEff) await endEff.delete();
    }
}

async function save(tactor, text, abil, desc, DC, cond){

    let flav = `${text}: ${CONFIG.DND5E.abilities[abil]} DC${DC} ${desc}`;
    let save = (await tactor.rollAbilitySave(abil, {flavor: flav})).total; 
    if (save < DC && cond) await game.cub.addCondition(cond, tactor);
    let succes = save < DC ? false : true;
    return succes;

}