//Add colossus slayer as a feature - add this as itemmacro, on use macro ItemMacro. use the feature ONCE to generate the effect
//from that point you can leave it on or enable\disable it as needed
if (args[0].tag === "OnUse") {
    let target = args[0].hitTargets[0]._id;
    let actorId = args[0].actor._id; // actor who used the ability
    actor = game.actors.get(actorId);
   
    // create a permanent active effect to apply the macro on hit   
const effectData = {
      changes: [
        {key: "flags.dnd5e.DamageBonusMacro", mode: 0, value: `ItemMacro.${args[0].item.name}`, priority: 20} // macro to apply the damage
      ],
      origin: args[0].uuid, //flag the effect as associated to the ability beeing applyed
      disabled: false,
      duration: args[0].item.data.duration,
      icon: args[0].item.img,
      label: args[0].item.name
    }
    await actor.createEmbeddedEntity("ActiveEffect", effectData);


} else if (args[0].tag === "DamageBonus") {
    let crit = 1;
    if (args[0].isCritical === true) crit = 2;
    let targetId = args[0].hitTargets[0]._id;
    // check if colossus slayer already applied
    if (args[0].actor.flags["midi-qol"].ColossusUsed === "1") return {}; 
    // only weapon attacks
    if (!["mwak","rwak"].includes(args[0].item.data.actionType)) return {};
    // only on the marked target
    // check if the creature is already damaged
    let globaltarget = game.actors._source.find(actr => actr._id == args[0].hitTargets[0].actorId);
    if (canvas.tokens.placeables.find(t => t.data._id == args[0].hitTargets[0]._id).actor.data.data.attributes.hp.value >= globaltarget.data.attributes.hp.max) return{};
    let damageType = args[0].item.data.damage.parts[0][1];
    // Set flag for colossus slayer used
    let durata = {rounds: null, seconds: 1, startRound: null, startTime: null, startTurn: null, turns: null};
    const effectData2 = {
        changes: [
        {key: "flags.midi-qol.ColossusUsed", mode: 5, value: "1", priority: 20} // mark as AlreadyUsed
        ],
        origin: args[0].uuid, //flag the effect as associated to the spell being cast
        disabled: false,
        duration: durata,
        label: "Colossus Slayer already used this round"
        }
    await actor.createEmbeddedEntity("ActiveEffect", effectData2);
    return {damageRoll: `${crit}d8[${damageType}]`, flavor: "Colossus Slayer Damage"}
}