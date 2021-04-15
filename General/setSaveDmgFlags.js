let content = `
<!-- Form Name -->
<legend>Change the save damage flag for all items in actor directory</legend>

<!-- Text input-->
  <table><tr><td style="width:20%">
  <label class="col-md-2 control-label" for="textinput">Item Name:</label>  
  </td><td>
  <input id="textinput" name="textinput" type="text" placeholder="item name" class="form-control input-md" style="width:100%">
  </td></tr><tr><td>


<!-- Select Basic -->
  <label class="col-md-2 control-label" for="selectbasic">Select Flag:</label>
  </td><td>
    <select id="selectbasic" name="selectbasic" class="form-control" style="width:100%">
      <option value="nodam">No Damage on Save</option>
      <option value="fulldam">Full Damage on Save</option>
      <option value="halfdam">Half Damage on Save</option>
    </select>
    </td></tr></table>
`;    
let confirmed="false";    
     new Dialog({
         title: "Set save damage flag",
         content: content,      
         buttons: {
             proceed: { label: "Proceed", callback: () => confirmed = "true" },
             cancel: { label: "Cancel", callback: () => confirmed = "false" },
             clear: { label: "Clear Flags", callback: () => confirmed = "clear" }
         },
         default: "cancel",
 
         close: async (html) => {
          let flagToSet = html.find("#selectbasic")[0].value;
          let itemName = html.find("#textinput")[0].value;
          let i = 0;
          let names = "";
            if(confirmed == "false") return;
            if(confirmed == "clear"){
              for(let actor of game.actors) {
    
                let titem = actor.items.find(i => i.data.name == itemName);
                if (titem){
                    i++;
                    names += actor.data.name+", ";
                    await titem.update({"data.properties.nodam": false,"data.properties.fulldam": false,"data.properties.halfdam": false});
                }
            
            }
            ui.notifications.info(`Flagged ${i} Items on actors: ${names}`);
              return;      
            }
            
            for(let actor of game.actors) {
    
                let titem = actor.items.find(i => i.data.name == itemName);
                if (titem){
                    i++;
                    names += actor.data.name+", ";
                    await titem.update({"data.properties.nodam": false,"data.properties.fulldam": false,"data.properties.halfdam": false});
                    await titem.update({[`data.properties.${flagToSet}`]: true});
                }
            
            }
            ui.notifications.info(`Flagged ${i} Items on actors: ${names}`);

         }
     }).render(true);