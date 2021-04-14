// item: action type other, remove all damage and saving throw
// DAE 2 Effects: 1 name "Hunger of Hadar End" duration macro repeat end of each turn effects macro.execute value HungerOfHadar actorid itemid auralevel
//                2 name "Hunger of Hadar Start" duration macro repeat start of each turn effects macro.execute value HungerOfHadar actorid itemid auralevel

// active aura on both the effects, tick: Is aura, only during current combattant turn, targets All
// macro HungerOfHadar run as GM
// On use macro DotApplyAura
if(args[0] != "each") return;
const originActorId = args[1];
const originToken = game.actors.get(originActorId);
const spellLevel = parseInt(args[3]);
const lastArg = args[args.length - 1];
const tactor = lastArg.tokenId ? canvas.tokens.get(lastArg.tokenId).actor : game.actors.get(lastArg.actorId);
const target = canvas.tokens.get(lastArg.tokenId);
const originActor = game.actors.get(originActorId);
const DAEitem = originToken.items.get(args[2]).data;
const DC = DAEitem.data.save.dc;
const spellName = DAEitem.name;
const repeatDamageFormula = `${spellLevel-1}d6`;
if(args[0] == "each" && lastArg.efData.flags.dae.macroRepeat == "endEveryTurn"){

    
    let damageRoll = await save(tactor,"Hunger of Hadar","dex","Milky, otherworldly tentacles rub against you.") ? new Roll(`${repeatDamageFormula}*0.5`).roll() : new Roll(`${repeatDamageFormula}`).roll();
    new MidiQOL.DamageOnlyWorkflow(originActor, target, damageRoll.total, "acid", [target], damageRoll, {flavor: `${spellName} - Damage Roll (Acid)`});

}
if(args[0] == "each" && lastArg.efData.flags.dae.macroRepeat == "startEveryTurn"){

    
    let damageRoll = new Roll(`${repeatDamageFormula}`).roll();
    new MidiQOL.DamageOnlyWorkflow(originActor, target, damageRoll.total, "cold", [target], damageRoll, {flavor: `${spellName} - Damage Roll (Cold)`});

}
async function save(tactor, text, abil, desc, cond){

    let flav = `${text}: ${CONFIG.DND5E.abilities[abil]} DC${DC} ${desc}`;
    let save = (await tactor.rollAbilitySave(abil, {flavor: flav, fastForward: true})).total; 
    if (save < DC && cond) await game.cub.addCondition(cond, tactor);
    let succes = save < DC ? false : true;
    return succes;

}
