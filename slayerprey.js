//Add slayer's prey as innate spell with an empty Dae Effect - add this as itemmacro, on use macro ItemMacro

if (args[0].tag === "OnUse") {
    if (args[0].hitTargets.length === 0) return;
    let target = args[0].hitTargets[0]._id;
    let actorId = args[0].actor._id; // actor who cast the spell
    actor = game.actors.get(actorId);
    if (!actor || !target) {
      console.error("Favored Foe: no token/target selected");
      return;
    }
   
    // create an active effect, 
    //  one change showing the hunter's mark icon on the caster
    //  the second setting the flag for the macro to be called when damaging an opponent
    const effectData = {
      changes: [
        {key: "flags.midi-qol.slayerpray", mode: 5, value: target, priority: 20}, // who is marked
        {key: "flags.midi-qol.dmgbonus", mode: 5, value: args[0].item.data.formula, priority: 20},
        {key: "flags.dnd5e.DamageBonusMacro", mode: 0, value: `ItemMacro.${args[0].item.name}`, priority: 20}, // macro to apply the damage
        {key: "flags.midi-qol.concentration-data.targets", mode: 2, value: {"actorId":  actorId, "tokenId": args[0].tokenId}, priority: 20}
      ],
      origin: args[0].uuid, //flag the effect as associated to the spell being cast
      disabled: false,
      duration: args[0].item.effects[0].duration,
      icon: args[0].item.img,
      label: args[0].item.name
    }
    await actor.createEmbeddedEntity("ActiveEffect", effectData);


} else if (args[0].tag === "DamageBonus") {
    let crit = 1;
    if (args[0].isCritical === true) crit = 2;
    let targetId = args[0].hitTargets[0]._id;
    // check if favored foe already applied
    if (args[0].actor.flags["midi-qol"].PreyUsed === "1") return{}; 
    // only weapon attacks
    if (!["mwak","rwak"].includes(args[0].item.data.actionType)) return{};
    // only on the marked target
    if (targetId !== getProperty(args[0].actor.flags, "midi-qol.slayerpray")) return{};
    let damageType = args[0].item.data.damage.parts[0][1];
// Set flag for favored foe used
let durata = {rounds: null, seconds: 1, startRound: null, startTime: null, startTurn: null, turns: null};
const effectData2 = {
      changes: [
	{key: "flags.midi-qol.PreyUsed", mode: 5, value: "1", priority: 20} // mark as AlreadyUsed
      ],
      origin: args[0].uuid, //flag the effect as associated to the spell being cast
      disabled: false,
      duration: durata,
      //icon: args[0].item.img,
      label: "Slayer's Prey already used this round"
    }
    await actor.createEmbeddedEntity("ActiveEffect", effectData2);
let bonusdmg = args[0].actor.flags["midi-qol"].dmgbonus
return {damageRoll: `${crit}d6[${damageType}]`, flavor: "Slayer's Prey Damage"}
    
}