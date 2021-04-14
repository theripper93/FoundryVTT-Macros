/***************REQUIREMENTS*************
 * Midi-qol - Item Macro - Dinamic Active Effect
 *  For Exrtra Features
 * Active Auras - Token Attacher
 ***************************************/
/*Add this macro as a script macro and call it "EffectOverTime" (Run as GM) [GM ONLY] You only need to add this macro once as GM.
 * Arguments :(damageOverTime(bool),requireAction(bool),spellLevel(@item.level),levelScaling(int),removeOnSave(bool),halfDmgOnSave(bool),noSave(bool),isAura(bool),itemid,actorid,overrideAbility(string\no),overrideDamageType(string\no))
 * Add an active effect to a spell\item then set the duration and the correct macro repeat setting (end turn\start turn)
 * In the effects add macro execute, in the value set the macro name and arguments as in the example below
 * !!!! The item need the damage field (even if it doesent do damage on cast) so add it with the correct element and set the damage to 0
 * the damage over time is taken from the versatile or other formula field of the item
 * ****AURA SETTING***** - WARNING: If using auras this macro will only work on linked actors
 * If the spell is an aoe effect that remains on field(eg Moonbeam) you will need
 * the companion macro DotApplyAura found below [GM ONLY]- add DotApplyAura to the "On use macro" field of the spell
 * Set up the effect as aura with the appropriate settings (common settings: Effect is aura, Aura targets: All, Only apply during current combatants turn,Only apply the aura once per turn )
 * swap @item.level with auralevel if using aura
 * You can attach the template to follow your token! just set the activation condition (in the spell itself) to "attach" (no quotes)*/

//*******Example content of macro.execute**************/

//EffectOverTime false false @item.level 1 true false false false itemid actorid no no **Example for spells with a save every turn**
//EffectOverTime true false auralevel 1 false true false true itemid actorid no no **Example for aoes with damage every round**

/**************************************
 * 
 * Easy Argument Configurator -> https://forms.gle/7MeFcBrcsWsrxr75A
 * 
 **************************************/

/***************************DotApplyAura Companion macro (Run as GM)****************************************


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
return  {haltEffectsApplication: true}


*****************************You only need to add this macro once as GM.*********************************/

const isAura = args[8] == true ? true : false;
if(args[0] == "each" || (args[0] == "on" && isAura))
{
const itemId = args[9];
const originActorId = args[10];
const originToken = game.actors.get(originActorId);
const damageOverTime = args[1] == true ? true : false;
const requireAction = args[2] == true ? true : false;
const spellLevel = parseInt(args[3]);
const levelScaling = parseInt(args[4]);
const removeOnSave = args[5] == true ? true : false;
const halfDmgOnSave = args[6] == true ? true : false;
const noSave = args[7] == true ? true : false;
const lastArg = args[args.length - 1];
const CUBcondition = args[13] && args[13] != lastArg ? args[13] : "";
const tactor = lastArg.tokenId ? canvas.tokens.get(lastArg.tokenId).actor : game.actors.get(lastArg.actorId);
const target = canvas.tokens.get(lastArg.tokenId);
const originActor = isAura ? game.actors.get(originActorId) : game.actors.get(lastArg.origin.split(".")[1]);
const DAEitem = isAura ? originToken.items.get(itemId).data : lastArg.efData.flags.dae.itemData;
const DC = DAEitem.data.save.dc;
const spellName = DAEitem.name;
const sAbility = args[11] == "no" ? DAEitem.data.save.ability : args[11];
let damageType;
if(args[12] && args[12] != "no"){
    damageType = args[12];
}else{
    damageType = DAEitem.data.damage.parts[0] ? DAEitem.data.damage.parts[0][1] : "";
}
const secondaryDamage = DAEitem.data.damage.versatile == "" ? DAEitem.data.formula: DAEitem.data.damage.versatile;
let repeatDamage = secondaryDamage.toLowerCase().split("d");
let repeatDamageFormula = String(parseInt(repeatDamage[0])+(spellLevel-DAEitem.data.level)*levelScaling);
for(let i = 1;i < repeatDamage.length;i++){
    repeatDamageFormula = repeatDamageFormula + "d" + repeatDamage[i];
}
let proceed = true;
if (requireAction) proceed = await yesNoPrompt(spellName,"Use action to Save?");

if(proceed){

    let isSave = noSave ? false : await save(tactor, spellName,sAbility,"Repeating Saving Throw",CUBcondition);
    if(isSave){
        if(removeOnSave) tactor.deleteEmbeddedEntity("ActiveEffect", lastArg.effectId);
        if(halfDmgOnSave){

            let damageMulti = halfDmgOnSave ? 0.5 : 1;
            let damageRoll = damageMulti == 0.5 ? new Roll(`(${repeatDamageFormula})*${damageMulti}`).roll() : new Roll(`${repeatDamageFormula}`).roll();
            new MidiQOL.DamageOnlyWorkflow(originActor, target, damageRoll.total, damageType, [target], damageRoll, {flavor: `${spellName} - Damage Roll (${damageType.charAt(0).toUpperCase() + damageType.slice(1)})`});

        }
        
    }
    else{

        if(damageOverTime){

            let damageRoll = new Roll(`${repeatDamageFormula}`).roll();
            new MidiQOL.DamageOnlyWorkflow(originActor, target, damageRoll.total, damageType, [target], damageRoll, {flavor: `${spellName} - Damage Roll (${damageType.charAt(0).toUpperCase() + damageType.slice(1)})`});

        }

    }

}

async function save(tactor, text, abil, desc, cond){

    let flav = `${text}: ${CONFIG.DND5E.abilities[abil]} DC${DC} ${desc}`;
    let save = (await tactor.rollAbilitySave(abil, {flavor: flav})).total; 
    if (save < DC && cond != "") await game.cub.addCondition(cond, tactor);
    let succes = save < DC ? false : true;
    return succes;

}

async function yesNoPrompt (dTitle,dContent){

    let dialog = new Promise((resolve, reject) => {
        new Dialog({
        // localize this text
        title: `${dTitle}`,
        content: `<p>${dContent}</p>`,
        buttons: {
            one: {
                icon: '<i class="fas fa-check"></i>',
                label: `Yes`,
                callback: () => {resolve(true)}
            },
            two: {
                icon: '<i class="fas fa-times"></i>',
                label: `No`,
                callback: () => {resolve(false)}
            }
        },
        default: "two"
        }).render(true);
      });
      let result = await dialog;
      return result;

}
}


