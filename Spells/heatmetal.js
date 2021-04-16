//On use macro, add HeatMetal (in the bottom) as a separate macro [execute as GM]
//Item: SRD heat metal, remove the saving throw
// DAE effect 1 "Heated Object" duration 60s no effects
// DAE effect 2 (3effects)"Heat Metal" duration special expiry turn start
//                          Effect 1 flags.midi-qol.disadvantage.attack.all value 1
//                          Effect 2 flags.midi-qol.disadvantage.ability.all value 1
//                          Effect 3 macro.execute value HeatMetal
if(args[0].tag == "OnUse"){
    async function save(tactor, text, abil, desc){

        let flav = `${text}: ${CONFIG.DND5E.abilities[abil]} DC${DC} ${desc}`;
        let save = (await tactor.rollAbilitySave(abil, {flavor: flav})).total; 
        let succes = save < DC ? false : true;
        return succes;
    
    }
    
    let tactor = canvas.tokens.get(args[0].tokenId).actor;
    const DC = tactor.data.data.attributes.spelldc ? tactor.data.data.attributes.spelldc : 10;
    let itemlevel = args[0].spellLevel;
    let target = canvas.tokens.get(Array.from(game.user.targets)[0].id).actor;
    if(await save(target,"Heat Metal","con","")){

      game.macros.getName("HeatMetal").execute(target);

    }
    else{

      if(await yesNoPrompt("Heat Metal","Did the target drop the Object?")) game.macros.getName("HeatMetal").execute(target);

    }
    
    const effectData = {
        changes: [
          {key: "macro.itemMacro", mode: 0, value: `ItemMacro.${args[0].item.name}`, priority: 20000}, // macro to apply the damage
          {key: "flags.midi-qol.concentration-data.targets", mode: 2, value: {"actorId":  args[0].actor._id, "tokenId": args[0].tokenId}, priority: 20}
        ],
        origin: args[0].uuid, //flag the effect as associated to the spell being cast
        disabled: false,
        duration: {seconds:60},
        icon: args[0].item.img,
        label: args[0].item.name,
        flags: {dae: {itemData: args[0].item}}
      }
      await tactor.createEmbeddedEntity("ActiveEffect", effectData);

    //create item
    let heatMetalRepeat = {
      "_id": "6b3rY4yDaH0H7C0o",
      "name": "Heat Metal Repeat",
      "type": "spell",
      "data": {
        "description": {
          "value": "<p>Choose a manufactured metal object, such as a metal weapon or a suit of heavy or medium metal armor, that you can see within range. You cause the object to glow red-hot. Any creature in physical contact with the object takes 2d8 fire damage when you cast the spell. Until the spell ends, you can use a bonus action on each of your subsequent turns to cause this damage again.</p><p>If a creature is holding or wearing the object and takes the damage from it, the creature must succeed on a Constitution saving throw or drop the object if it can. If it doesn't drop the object, it has disadvantage on attack rolls and ability checks until the start of your next turn.</p><p><strong>Higher Levels.</strong> When you cast this spell using a spell slot of 3rd level or higher, the damage increases by 1d8 for each slot level above 2nd.</p>",
          "chat": "",
          "unidentified": ""
        },
        "source": "PHB pg. 250",
        "activation": {
          "type": "bonus",
          "cost": 1,
          "condition": ""
        },
        "duration": {
          "value": 1,
          "units": "minute"
        },
        "target": {
          "value": 1,
          "width": null,
          "units": "",
          "type": "object"
        },
        "range": {
          "value": 60,
          "long": 0,
          "units": "ft"
        },
        "uses": {
          "value": 0,
          "max": "0",
          "per": ""
        },
        "consume": {
          "type": "",
          "target": "",
          "amount": null
        },
        "ability": "",
        "actionType": "other",
        "attackBonus": 0,
        "chatFlavor": "",
        "critical": null,
        "damage": {
          "parts": [
            [
              `${itemlevel}d8`,
              "fire"
            ]
          ],
          "versatile": ""
        },
        "formula": "",
        "save": {
          "ability": "",
          "dc": DC,
          "scaling": "spell"
        },
        "level": 0,
        "school": "trs",
        "components": {
          "value": "",
          "vocal": true,
          "somatic": true,
          "material": false,
          "ritual": false,
          "concentration": false
        },
        "materials": {
          "value": "A piece of iron and a flame.",
          "consumed": false,
          "cost": 0,
          "supply": 0
        },
        "preparation": {
          "mode": "atwill",
          "prepared": false
        },
        "scaling": {
          "mode": "level",
          "formula": "1d8"
        },
        "properties": {
          "fulldam": true
        }
      },
      "sort": 900000,
      "flags": {
        "midi-qol": {
          "onUseMacroName": "ItemMacro"
        },
        "exportSource": {
          "world": "test",
          "system": "dnd5e",
          "coreVersion": "0.7.9",
          "systemVersion": "1.2.4"
        },
        "itemacro": {
          "macro": {
            "_data": {
              "name": "Heat Metal Repeat",
              "type": "script",
              "scope": "global",
              "command": "//on use do the save and ask if target dropped the object (on args for macro2)\nif(args[0].tag == \"OnUse\"){\n    async function save(tactor, text, abil, desc){\n\n        let flav = `${text}: ${CONFIG.DND5E.abilities[abil]} DC${DC} ${desc}`;\n        let save = (await tactor.rollAbilitySave(abil, {flavor: flav})).total; \n        let succes = save < DC ? false : true;\n        return succes;\n    \n    }\n    const DC = args[0].item.data.save.dc ? args[0].item.data.save.dc : 10;\n    let tactor = canvas.tokens.get(args[0].tokenId).actor;\n    let itemlevel = args[0].spellLevel;\n    let target = canvas.tokens.get(Array.from(game.user.targets)[0].id).actor;\n    if(await save(target,\"Heat Metal\",\"con\",\"\")){\n\n      game.macros.getName(\"HeatMetal\").execute(target);\n\n    }\n    else{\n\n      if(await yesNoPrompt(\"Heat Metal\",\"Did the target drop the Object?\")) game.macros.getName(\"HeatMetal\").execute(target);\n\n    }\n    \n    \n\n}\n\nasync function yesNoPrompt (dTitle,dContent){\n\n  let dialog = new Promise((resolve, reject) => {\n      new Dialog({\n      // localize this text\n      title: `${dTitle}`,\n      content: `<p>${dContent}</p>`,\n      buttons: {\n          one: {\n              icon: '<i class=\"fas fa-check\"></i>',\n              label: `Yes`,\n              callback: () => {resolve(true)}\n          },\n          two: {\n              icon: '<i class=\"fas fa-times\"></i>',\n              label: `No`,\n              callback: () => {resolve(false)}\n          }\n      },\n      default: \"two\"\n      }).render(true);\n    });\n    let result = await dialog;\n    return result;\n\n}\n\n\n\n\n /* HeatMetal macro, execute as GM\n\n\n function sleep(ms) {\n    return new Promise(resolve => setTimeout(resolve, ms));\n  }\nawait sleep(1000);\nlet effId = args[0].effects.find(e => e.data.label == \"Heat Metal\").delete();\n\n*/",
              "author": "v7EXPIaymV6WYGNF"
            },
            "data": {
              "name": "Heat Metal Repeat",
              "type": "script",
              "scope": "global",
              "command": "//on use do the save and ask if target dropped the object (on args for macro2)\nif(args[0].tag == \"OnUse\"){\n    async function save(tactor, text, abil, desc){\n\n        let flav = `${text}: ${CONFIG.DND5E.abilities[abil]} DC${DC} ${desc}`;\n        let save = (await tactor.rollAbilitySave(abil, {flavor: flav})).total; \n        let succes = save < DC ? false : true;\n        return succes;\n    \n    }\n    const DC = args[0].item.data.save.dc ? args[0].item.data.save.dc : 10;\n    let tactor = canvas.tokens.get(args[0].tokenId).actor;\n    let itemlevel = args[0].spellLevel;\n    let target = canvas.tokens.get(Array.from(game.user.targets)[0].id).actor;\n    if(await save(target,\"Heat Metal\",\"con\",\"\")){\n\n      game.macros.getName(\"HeatMetal\").execute(target);\n\n    }\n    else{\n\n      if(await yesNoPrompt(\"Heat Metal\",\"Did the target drop the Object?\")) game.macros.getName(\"HeatMetal\").execute(target);\n\n    }\n    \n    \n\n}\n\nasync function yesNoPrompt (dTitle,dContent){\n\n  let dialog = new Promise((resolve, reject) => {\n      new Dialog({\n      // localize this text\n      title: `${dTitle}`,\n      content: `<p>${dContent}</p>`,\n      buttons: {\n          one: {\n              icon: '<i class=\"fas fa-check\"></i>',\n              label: `Yes`,\n              callback: () => {resolve(true)}\n          },\n          two: {\n              icon: '<i class=\"fas fa-times\"></i>',\n              label: `No`,\n              callback: () => {resolve(false)}\n          }\n      },\n      default: \"two\"\n      }).render(true);\n    });\n    let result = await dialog;\n    return result;\n\n}\n\n\n\n\n /* HeatMetal macro, execute as GM\n\n\n function sleep(ms) {\n    return new Promise(resolve => setTimeout(resolve, ms));\n  }\nawait sleep(1000);\nlet effId = args[0].effects.find(e => e.data.label == \"Heat Metal\").delete();\n\n*/",
              "author": "v7EXPIaymV6WYGNF"
            },
            "options": {},
            "apps": {},
            "compendium": null
          }
        }
      },
      "img": "systems/dnd5e/icons/spells/light-air-fire-3.jpg",
      "effects": [
        {
          "_id": "Yso3SLu2ZqwNpnxO",
          "flags": {
            "dae": {
              "stackable": false,
              "macroRepeat": "none",
              "specialDuration": [
                "None"
              ],
              "transfer": false
            },
            "ActiveAuras": {
              "isAura": false,
              "ignoreSelf": false,
              "hidden": false,
              "height": false,
              "alignment": "",
              "type": "",
              "aura": "None",
              "radius": null,
              "save": "",
              "savedc": null,
              "hostile": false,
              "onlyOnce": false,
              "time": "None"
            }
          },
          "changes": [
            {
              "key": "flags.midi-qol.disadvantage.attack.all",
              "mode": 2,
              "value": "1",
              "priority": 20
            },
            {
              "key": "flags.midi-qol.disadvantage.ability.all",
              "mode": 2,
              "value": "1",
              "priority": 20
            },
            {
              "key": "macro.execute",
              "mode": 0,
              "value": "HeatMetal",
              "priority": 20
            }
          ],
          "disabled": false,
          "duration": {
            "startTime": null,
            "seconds": null,
            "rounds": 1,
            "turns": null,
            "startRound": null,
            "startTurn": null
          },
          "icon": "systems/dnd5e/icons/spells/light-air-fire-3.jpg",
          "label": "Heat Metal",
          "tint": "",
          "transfer": false,
          "selectedKey": [
            "data.abilities.cha.dc",
            "data.abilities.cha.dc",
            "macro.execute"
          ]
        }
      ],
      "newEffect": "new",
      "changes": []
    };
      await tactor.createEmbeddedEntity("OwnedItem",heatMetalRepeat);

}
else if(args[0] == "off"){

//remove item
let tactor = canvas.tokens.get(args[args.length-1].tokenId).actor;
await tactor.items.find(i => i.data.name == "Heat Metal Repeat").delete();

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




 /* HeatMetal macro, execute as GM


if(args[0] == "on"){

  let tactor = canvas.tokens.get(args[args.length-1].tokenId).actor;
  if(tactor.getFlag("world",`HeatMetalSave`)){
    if(tactor.effects.find(e => e.data.label == "Heat Metal")){
      tactor.effects.find(e => e.data.label == "Heat Metal").delete();
      tactor.unsetFlag("world",`HeatMetalSave`);
    }
  }
}
else if(args[0] != "on" && args[0] != "off"){

  await args[0].setFlag("world",`HeatMetalSave`,true);

}

*/
