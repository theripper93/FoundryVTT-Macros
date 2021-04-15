// Macro that lets you change the spell damage type when you cast a spell.
// Add as macro and run once, it will keep running until the client refreshes

let damageTypeDropdown = `
<div class="form-group">
        <label>Change Element</label>
        <div class="form-fields">
            <select name="damageType">
            
            </select>
        </div>
    </div>
`; 


Hooks.on("renderAbilityUseDialog",changeTitle);
Hooks.on("midi-qol.DamageRollComplete", changeDamageType);
function changeTitle(dialog,html){
    dialog.item.options.actor.unsetFlag("world",`scribeElement`);
    const spellLevelDropdown = html.find($('select[name="level"]'));
    spellLevelDropdown.change(updateDamageTypes);
    const insertPoint = html.find($('div[class="form-group"]')).eq(1);
    insertPoint.before(damageTypeDropdown);
    html.css("height","auto");
    updateDamageTypes();

    function updateDamageTypes(){
        const selectedLevel = spellLevelDropdown[0].value;
        const damageDropDown = html.find($('select[name="damageType"]'));
        const userSpells = dialog.item.options.actor.items.filter(i => i.data.data.level == selectedLevel);
        let elements = [];
        for(let spell of userSpells){
            for(let damage of spell.data.data.damage.parts){

                if(damage){
                    if(damage[1]) elements.push(damage[1]);
                }

            }
            
        }
        var uniqueElements = [];
        $.each(elements, function(i, el){
        if($.inArray(el, uniqueElements) === -1) uniqueElements.push(el);
        });
        uniqueElements.sort();
        let damageTypeUpdatedHtml = `<select name="damageType"><option value="nochange">No Change</option>`;
        for(let elem of uniqueElements){
            damageTypeUpdatedHtml += `<option value="${elem.toLowerCase()}">${elem.charAt(0).toUpperCase() + elem.slice(1)}</option>`
        }
        damageTypeUpdatedHtml += `</select>`;
        damageDropDown.replaceWith(damageTypeUpdatedHtml);
        html.find($('select[name="damageType"]')).change(flagDamage);
        function flagDamage(){
            const selectedDamage = html.find($('select[name="damageType"]'))[0].value;
            dialog.item.options.actor.setFlag("world",`scribeElement`,selectedDamage);
        }
    };

    
}

function changeDamageType(workflow){
    const elementReplace = workflow.actor.getFlag("world", `scribeElement`);
    if(elementReplace && elementReplace != "nochange"){
        workflow.damageDetail[0].type = elementReplace;
        workflow.actor.unsetFlag("world",`scribeElement`);

        let cont = `<div class="dnd5e chat-card item-card midi-qol-item-card">
    <header class="card-header flexrow">
    <img src="systems/dnd5e/icons/items/inventory/book-blue.jpg" title="Awakened Spellbook" width="36" height="36" />
    <h3 class="item-name">Awakened Spellbook</h3>
  </header></div>
  <div class="dice-roll">The damage type was changed to
    <div class="dice-result"><h4 class="dice-total">${elementReplace.charAt(0).toUpperCase() + elementReplace.slice(1)}</h4>
    </div>`;
    ChatMessage.create({speaker: {alias: workflow.actor.data.name}, content: cont,type: 5});

    } 
    else if(elementReplace == "nochange"){
        workflow.actor.unsetFlag("world",`scribeElement`);
    }

}
