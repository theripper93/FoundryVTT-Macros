//Item macro on use, reqires EnlargeReduce macro [execute as gm]

const enlargeEffName = "Enlarged";
const reduceEffName = "Reduced";
if(args[0].tag == "OnUse"){
    if(args[0].saves.length != 0) return;

let response = await yesNoPrompt("Enlarge/Reduce", "");
game.macros.getName("EnlargeReduce").execute(response,canvas.tokens.get(args[0].hitTargets[0]._id),args[0].tokenId,args[0].actor.actorId,args[0].item.img);


}




async function yesNoPrompt (dTitle,dContent){

    let dialog = new Promise((resolve, reject) => {
        new Dialog({
        // localize this text
        title: `${dTitle}`,
        content: `<p>${dContent}</p>`,
        buttons: {
            one: {
                icon: '<i class="fas fa-bolt"></i>',
                label: `Enlarge`,
                callback: () => {resolve(true)}
            },
            two: {
                icon: '<i class="fas fa-bolt"></i>',
                label: `Reduce`,
                callback: () => {resolve(false)}
            }
        },
        default: "two"
        }).render(true);
      });
      let result = await dialog;
      return result;

}
/*/////////////////////////EnlargeReduce Macro [Execute as GM]////////////////////////////////////
const enlargeEffName = "Enlarged";
const reduceEffName = "Reduced";

if(args[0] == "off"){

    const lastArg = args[args.length - 1];
    const ttoken = canvas.tokens.get(lastArg.tokenId);
    let mod = canvas.scene.data.grid*ttoken.data.height/2;
    const prevcenter = ttoken.center;
    const previusSize = await ttoken.getFlag("world", `previousSize`);
    await ttoken.update(previusSize);
    await ttoken.update({x : prevcenter.x-mod, y : prevcenter.y-mod});
    await ttoken.unsetFlag("world", `previousSize`);
    

}
else if(args[0] == true || args[0] == false){
    
    const ttoken = args[1];
    await ttoken.setFlag("world",`previousSize`,{width: ttoken.data.width,height: ttoken.data.height,scale: ttoken.data.scale});
    const bonusdamage = args[0] ? "+1d4" : "-1d4";
    const strabil = args[0] ? "flags.midi-qol.advantage.ability.check.str" : "flags.midi-qol.disadvantage.ability.check.str";
    const strsave = args[0] ? "flags.midi-qol.advantage.ability.save.str" : "flags.midi-qol.disadvantage.ability.save.str";
    
    const prevcenter = ttoken.center;

    if(args[0] == true){

//enlarge
        if(ttoken.actor.data.data.traits.size != "sm"){

            if(ttoken.data.scale >= 1 && ttoken.data.width >= 1){

                let mod = canvas.scene.data.grid*(ttoken.data.height+1)/2;
                await ttoken.update({width:ttoken.data.width+1,height:ttoken.data.height+1,x : prevcenter.x-mod, y : prevcenter.y-mod});

            }
            else{

                await ttoken.update({width:1,height:1,scale:1});

            }
            
            
            
        }

    }
    else
    {

//reduce
if(ttoken.actor.data.data.traits.size == "tiny") return;
if(ttoken.actor.data.data.traits.size == "sm"){

    await ttoken.update({width:1,height:1,scale:0.4});

}
else if(ttoken.actor.data.data.traits.size == "med"){

    await ttoken.update({scale:0.6});
}
else{
    let mod = canvas.scene.data.grid*ttoken.data.height/2;
    await ttoken.update({width:ttoken.data.width-1,height:ttoken.data.height-1,x : prevcenter.x-mod, y : prevcenter.y-mod});

}
        
        

    }

    await sleep(5000);
    let effId = ttoken.actor.effects.find(e => e.data.label == "Enlarge/Reduce").data._id;
//build effect
    const effectData = {
        changes: [
        {key: "macro.execute", mode: 5, value: "EnlargeReduce", priority: 20},
        {key: "data.bonuses.weapon.damage", mode: 5, value: bonusdamage, priority: 20},
        {key: strabil, mode: 5, value: 1, priority: 20},
        {key: strsave, mode: 5, value: 1, priority: 20}
                ],
        disabled: false,
        duration: {seconds: 60},
        _id: effId,
        icon: args[4],
        label: args[0] ? enlargeEffName : reduceEffName
    }
    await ttoken.actor.updateEmbeddedEntity("ActiveEffect", effectData);


}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }




  */////////////////////////////////////////////////////