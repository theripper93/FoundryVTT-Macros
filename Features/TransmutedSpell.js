// Macro that lets you change the spell damage type when you cast a spell.
// Add as macro and run once, it will keep running until the client refreshes

const spFeatureName = "Scorcery Points";
const damageTypeList = ["acid", "cold", "fire", "lightning", "poison", "thunder"];
let damageTypeDropdown = `
<div class="form-group">
        <label>Change Element</label>
        <div class="form-fields">
            <select name="damageType">
            <option value="nochange">No Change</option>
            <option value="acid">Acid</option>
            <option value="cold">Cold</option>
            <option value="fire">Fire</option>
            <option value="lightning">Lightning</option>
            <option value="poison">Poison</option>
            <option value="thunder">Thunder</option>
            </select>
        </div>
    </div>
`; 


Hooks.on("renderAbilityUseDialog",changeTitle);
Hooks.on("midi-qol.DamageRollComplete", changeDamageType);
function changeTitle(dialog,html){
    dialog.item.options.actor.unsetFlag("world",`transmuteElement`);
    const sorceryPointsFeature = dialog.item.options.actor.items.filter(i => i.data.name == spFeatureName)[0];
    if(sorceryPointsFeature.data.data.uses.value < 1) return;
    if(!dialog.item.data.data.damage.parts[0]) return;
    if(!damageTypeList.includes(dialog.item.data.data.damage.parts[0][1])) return;
    html.find($('button[class="dialog-button use default"]')).click(flagDamage)
    function flagDamage(){
        const selectedDamage = html.find($('select[name="damageType"]'))[0].value;
        dialog.item.options.actor.setFlag("world",`transmuteElement`,selectedDamage);
        
        
    }
    const insertPoint = html.find($('div[class="form-group"]')).eq(1);
    insertPoint.before(damageTypeDropdown);
    html.css("height","auto");
}

function changeDamageType(workflow){
    
    const elementReplace = workflow.actor.getFlag("world", `transmuteElement`);
    if(elementReplace && elementReplace != "nochange"){
        workflow.damageDetail[0].type = elementReplace;
        workflow.actor.unsetFlag("world",`transmuteElement`);
        const sorceryPointsFeature = workflow.item.options.actor.items.filter(i => i.data.name == spFeatureName)[0];
        sorceryPointsFeature.update({"data.uses.value":sorceryPointsFeature.data.data.uses.value-1});
        let cont = `<div class="dnd5e chat-card item-card midi-qol-item-card">
    <header class="card-header flexrow">
    <img src="systems/dnd5e/icons/skills/blue_20.jpg" title="Metamagic: Transmuted Spell" width="36" height="36" />
    <h3 class="item-name">Metamagic: Transmuted Spell</h3>
  </header></div>
  <div class="dice-roll">The damage type was changed to
    <div class="dice-result"><h4 class="dice-total">${elementReplace.charAt(0).toUpperCase() + elementReplace.slice(1)}</h4>
    </div>`;
    ChatMessage.create({speaker: {alias: workflow.actor.data.name}, content: cont});

    } 
    else if(elementReplace == "nochange"){
        workflow.actor.unsetFlag("world",`transmuteElement`);
    }

}
