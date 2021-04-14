//Set as a midi qol "OnUse" macro
// change the spell damage type to "no damage"
// Set the macro as "run as GM"
// Based on the original macro by Kandashi (accounting for fey ancestry was added)
// adding an auto expiring asleep condition was added
const condition = "Asleep";
const featName = "Fey Ancestry";
const effImg = args[0].item.img;
let sleepHp = args[0].damageTotal;

if(!sleepHp) {
  ui.notifications.error("No arguments passed to Sleep macro");
  return;
}
console.log(`starting Sleep macro with sleepHp[${sleepHp}]`);

// Get Targets
let targets = args[0].targets
let newTargets = targets.map(a => canvas.tokens.get(a._id))

// Sort targets by HP ascending
newTargets = newTargets.sort(function(a, b) {
  const hpValueOfA = a.actor.data.data.attributes.hp.value;
  const HpValueOfB = b.actor.data.data.attributes.hp.value;
  return hpValueOfA - HpValueOfB;
});

let remainingSleepHp = sleepHp;

for(let target of newTargets) {
  // Skip targets already unconscious
  if(target.actor.effects.find(e => e.data.label == condition) || target.actor.items.find(i => i.data.name == featName)) {
    console.log(`${target.actor.name} is already asleep, skipping it.`);
    continue;
  }

  let targetHpValue = target.actor.data.data.attributes.hp.value;
  if(remainingSleepHp > targetHpValue) {
    remainingSleepHp -= targetHpValue;
    console.log(`${target.actor.name} with hp ${targetHpValue} falls asleep, remaining hp from dice ${remainingSleepHp}.`);
    // Apply unconscious condition to target
    //game.cub.addCondition(condition, target.actor);
    const effectData = {
        
        origin: args[0].uuid,
        disabled: false,
        duration: {seconds : 60},
        icon: effImg,
        label: condition,
        flags: {dae: {specialDuration: "isDamaged"}}
      }
      await target.actor.createEmbeddedEntity("ActiveEffect", effectData);
    //////////////////////////////////////
  } else {
    console.log(`${target.actor.name} with hp ${targetHpValue} resists asleep, skipping remaining targets.`);
    break;
  }
}
