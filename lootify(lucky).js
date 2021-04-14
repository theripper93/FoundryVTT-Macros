//Convert all 0 HP npcs into a lootsheet giving permission too loot and removing non lootables, marks the ones with loot
//Adds a random loot from a table called "LuckyCharm" (fill it with items from compendiums)

(async()=>{  
  
    let defeatedNpcs = canvas.tokens.placeables.filter(t => t.actor && t.actor.token);
    defeatedNpcs = defeatedNpcs.filter(t => t.actor.data.type == "npc" && t.actor.token.data.actorLink == false && t.actor.data.data.attributes.hp.value == 0 && t.actor.data.flags.core?.sheetClass != "dnd5e.LootSheet5eNPC" && t.actor);
    let lootingUsers = game.users.entries.filter(user => user.data.role >= 1 && user.data.role <= 2);
    let luckycharm = true;
    for (let npc of defeatedNpcs){

        let newItems = npc.actor.items.filter(i => i.data.type != "spell" && i.data.type != "feat" && i.data.type != "class" && i.data.data.weaponType != "natural");
        let lucky = await new Roll("D20").roll();
        if(luckycharm == true && lucky.total == 20){
          
          luckycharm = false;
          AudioHelper.play({src: `SoundEffects/BOTW_Fanfares_20180509/BOTW_Fanfare_SmallItem.wav`, volume: 0.8, autoplay: true, loop: false}, true);
          let table = game.tables.find( tab => tab.data.name == "LuckyCharm").roll();
          const pack = game.packs.get(table.results[0].collection);
          await pack.getIndex();
          let entry = pack.index.find(e => e.name === table.results[0].text);
          newItems.push(await pack.getEntity(entry._id));

        }
        let permission = duplicate(npc.actor.data.permission);
        let curr = duplicate(npc.actor.data.data.currency);
        let currupdate = (curr.cp == 0 && curr.sp == 0 && curr.ep == 0 && curr.gp == 0 && curr.pp == 0) ? "" : curr;
        lootingUsers.forEach(user => {permission[user.data._id] = 2;});
        await npc.actor.update({"items": newItems,"data.currency": currupdate,permission,"name" : "Corpse","data.details.biography.value" : ""});
        await npc.actor.setFlag("core", "sheetClass", "dnd5e.LootSheet5eNPC");
        if(newItems.length > 0 || currupdate != ""){
          if (game.modules.get("combat-utility-belt")?.active) await game.cub.removeAllConditions(npc);
          await npc.update({"overlayEffect" : 'icons/svg/chest.svg'});
        }  
    }
    ui.notifications.info(`Lootified ${defeatedNpcs.length} tokens`);
})();

