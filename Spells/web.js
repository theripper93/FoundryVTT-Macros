//Macro web run as GM
// item: action type other, remove all damage and saving throw
// DAE 2 Effects: 1 duration macro repeat start of each turn effects macro.execute value web actorid itemid auralevel
// active aura on the effect, tick: Is aura, only during current combattant turn, only apply once per turn, targets All
// On use macro DotApplyAura
if(!(args[0] != "each" || args[0] != "on")) return;
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
const cond = "Restrained";
if((args[0] == "each" && lastArg.efData.flags.dae.macroRepeat == "startEveryTurn") || args[0] == "on"){

    let isCondition = tactor.effects.find(e => e.data.label == cond);
    //let isCondition = await game.cub.getCondition(cond, target);
    if(isCondition){
        let doSave = await yesNoPrompt(spellName,"Use action to Remove Restrained?");
        if(doSave){
            let isSave  = await savecheck(tactor,"Web","str","Webs restrain you.");
            if(isSave) await game.cub.removeCondition(cond, tactor);
        }

    }
    else{
        let isSave  = await save(tactor,"Web","dex","Webs restrain you.",cond);
        if(!isSave){
            let doSave = await yesNoPrompt(spellName,"Use action to Remove Restrained?");
            if(doSave){
                let isSave  = await savecheck(tactor,"Web","str","Webs restrain you.");
                if(isSave) await game.cub.removeCondition(cond, tactor);
            } 
        }
        
    }
    

}
async function save(tactor, text, abil, desc, cond){

    let flav = `${text}: ${CONFIG.DND5E.abilities[abil]} DC${DC} ${desc}`;
    let save = (await tactor.rollAbilitySave(abil, {flavor: flav, fastForward: true})).total; 
    if (save < DC && cond) await game.cub.addCondition(cond, tactor);
    let succes = save < DC ? false : true;
    return succes;

}
async function savecheck(tactor, text, abil, desc, cond){

    let flav = `${text}: ${CONFIG.DND5E.abilities[abil]} DC${DC} ${desc}`;
    let save = (await tactor.rollAbilityTest(abil, {flavor: flav, fastForward: true})).total; 
    if (save < DC && cond) await game.cub.addCondition(cond, tactor);
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
