//item macro on use macro ItemMacro - requires gmExecute macro (run as gm)
let bardlevels = game.actors.get(args[0].actor._id).data.items.find(i => i.name == "Bard").data.levels;
let inspirationdie;
if(bardlevels <= 5) inspirationdie = "1d8";
else if(bardlevels <= 10) inspirationdie = "1d10";
else if(bardlevels <= 15) inspirationdie = "1d12";
let inspirationitem = {
    "name": "Inspired",
    "type": "feat",
    "data": {
      "description": {
        "value": "<div  class=\"rd__b  rd__b--3\"><p>At 10th level, your Bardic Inspiration die changes to a [[/r d10]].</p><div class=\"rd__spc-inline-post\"></div></div>",
        "chat": "",
        "unidentified": ""
      },
      "source": "PHB",
      "activation": {
        "type": "special",
        "cost": null,
        "condition": ""
      },
      "duration": {
        "value": 10,
        "units": "minute"
      },
      "target": {
        "value": null,
        "width": null,
        "units": "",
        "type": "self"
      },
      "range": {
        "value": null,
        "long": null,
        "units": "ft"
      },
      "uses": {
        "value": 1,
        "max": "1",
        "per": "Charges",
        "type": "",
        "autoDestroy": true
      },
      "consume": {
        "type": "",
        "target": "",
        "amount": null
      },
      "ability": "",
      "actionType": "util",
      "attackBonus": 0,
      "chatFlavor": "",
      "critical": null,
      "damage": {
        "parts": [
          [
            inspirationdie,
            "midi-none"
          ]
        ],
        "versatile": "",
        "value": ""
      },
      "formula": "",
      "save": {
        "ability": "",
        "dc": null,
        "scaling": "spell",
        "value": ""
      },
      "requirements": "Bard 1",
      "recharge": {
        "value": null,
        "charged": false
      },
      "featType": {
        "value": "ability",
        "_deprecated": true,
        "type": "String",
        "label": "Feat Type"
      },
      "time": {
        "value": "",
        "_deprecated": true
      },
      "damageType": {
        "value": "",
        "_deprecated": true
      },
      "flags": {
        "srd5e": {
          "dataType": "classFeature",
          "className": "Bard"
        }
      }
    },
    "sort": 4960000,
    "flags": {
      "betterRolls5e": {
        "critRange": {
          "type": "String",
          "value": null
        },
        "critDamage": {
          "type": "String",
          "value": ""
        },
        "quickDesc": {
          "type": "Boolean",
          "value": true,
          "altValue": true
        },
        "quickAttack": {
          "type": "Boolean",
          "value": true,
          "altValue": true
        },
        "quickSave": {
          "type": "Boolean",
          "value": true,
          "altValue": true
        },
        "quickDamage": {
          "type": "Array",
          "value": [],
          "altValue": [],
          "context": []
        },
        "quickProperties": {
          "type": "Boolean",
          "value": true,
          "altValue": true
        },
        "quickCharges": {
          "type": "Boolean",
          "value": {
            "use": true,
            "resource": true,
            "charge": false
          },
          "altValue": {
            "use": true,
            "resource": true,
            "charge": false
          }
        },
        "quickTemplate": {
          "type": "Boolean",
          "value": true,
          "altValue": true
        },
        "quickOther": {
          "type": "Boolean",
          "value": true,
          "altValue": true,
          "context": ""
        },
        "quickFlavor": {
          "type": "Boolean",
          "value": true,
          "altValue": true
        },
        "quickPrompt": {
          "type": "Boolean",
          "value": false,
          "altValue": false
        }
      },
      "midi-qol": {
        "onUseMacroName": ""
      }
    },
    "img": "systems/dnd5e/icons/skills/yellow_08.jpg",
    "effects": [
      {
        "_id": "0lMxLDwUXCfyflcD",
        "flags": {},
        "changes": [],
        "duration": {seconds : 600},
        "icon": "systems/dnd5e/icons/skills/yellow_08.jpg",
        "label": "Bardic Inspiration",
        "transfer": true
      }
    ],
    "newEffect": "new",
    "changes": []
  };

let target = Array.from(game.user.targets)[0].data._id;
await game.macros.getName("gmExecute").execute("createEmbeddedEntity",target,"OwnedItem",inspirationitem);
