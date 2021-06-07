if (args[0].tag === "OnUse") {
    if (args[0].hitTargets.length === 0) return;
    let target = args[0].hitTargets[0]._id;
    let actorId = args[0].actor._id; // actor who cast the spell
    actor = game.actors.get(actorId);
    if (!actor || !target) {
      console.error("Hex: no token/target selected");
      return;
    }
    
    // create an active effect, 
    //  one change showing the hex icon on the caster
    //  the second setting the flag for the macro to be called when damaging an opponent
    const effectData = {
      changes: [
        {key: "flags.midi-qol.Hex", mode: 5, value: target, priority: 20}, // who is marked
        {key: "flags.dnd5e.DamageBonusMacro", mode: 0, value: `ItemMacro.${args[0].item.name}`, priority: 20}, // macro to apply the damage
        {key: "flags.midi-qol.concentration-data.targets", mode: 2, value: {"actorId":  actorId, "tokenId": args[0].tokenId}, priority: 20}
      ],
      origin: args[0].uuid, //flag the effect as associated to the spell being cast
      disabled: false,
      duration: Array.from(args[0].item.effects)[0].duration,
      icon: args[0].item.img,
      label: args[0].item.name
    }
    await actor.createEmbeddedEntity("ActiveEffect", effectData);
} else if (args[0].tag === "DamageBonus") {
    let crit = 1;
    if (args[0].isCritical === true) crit = 2;
    let targetId = args[0].hitTargets[0]._id;
    if (targetId !== getProperty(args[0].actor.flags, "midi-qol.Hex")) return {};
    let damageType = args[0].item.data.damage.parts[0][1];
    return {damageRoll: `${crit}d6[necrotic]`, flavor: "Hex Damage"}
}
