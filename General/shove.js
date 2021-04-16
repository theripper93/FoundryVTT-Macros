// Shove Macro add as "Shove" execute as GM
// Knockback Macro add as "Knockback" execute as GM (knockback macro in the repository unde general)
// Item : on use macro ItemMacro
// Content of itemmacro -> await game.macros.getName("Shove").execute(canvas.tokens.get(args[0].tokenId),Array.from(game.user.targets)[0]);
    let pusher = args[0];
    let target = args[1]; 
    let tokenRoll = await pusher.actor.rollSkill("ath");
    let skill = target.actor.data.data.skills.ath.total < Target.actor.data.data.skills.acr.total ? "acr" : "ath";
    let tactorRoll = await target.actor.rollSkill(Skill);

    if (tokenRoll.total > tactorRoll.total) {
    if(await yesNoPrompt("title","content")){
        await game.macros.getName("Knockback").execute(pusher,target,5);
    }
    else{
        await game.cub.addCondition("Prone", Target.actor);
    }
    
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
                    label: `Knockback`,
                    callback: () => {resolve(true)}
                },
                two: {
                    icon: '<i class="fas fa-times"></i>',
                    label: `Prone`,
                    callback: () => {resolve(false)}
                }
            },
            default: "two"
            }).render(true);
          });
          let result = await dialog;
          return result;
    
    }
