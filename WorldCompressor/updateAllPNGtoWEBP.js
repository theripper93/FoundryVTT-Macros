(async()=>{
// Isuue Warnings
ui.notifications.error(`WARNING! This script can potentially brick your world images MAKE SURE TO HAVE A BACKUP!`);
ui.notifications.error(`WARNING! This script can potentially brick your world images MAKE SURE TO HAVE A BACKUP!`);
ui.notifications.error(`WARNING! This script can potentially brick your world images MAKE SURE TO HAVE A BACKUP!`);
if(!(await yesNoPrompt("WARNING!WARNING!WARNING!WARNING!","Make sure you made a backup before running this script. Do you wish to proceed?"))) return;
ui.notifications.error(`WARNING! This script can potentially brick your world images MAKE SURE TO HAVE A BACKUP!`);
ui.notifications.error(`WARNING! This script can potentially brick your world images MAKE SURE TO HAVE A BACKUP!`);
ui.notifications.error(`WARNING! This script can potentially brick your world images MAKE SURE TO HAVE A BACKUP!`);
if(!(await yesNoPrompt("WARNING!WARNING!WARNING!WARNING!","ARE YOU SURE YOU MADE THE BACKUP? CLICK YES TO PROCEED"))) return;
//Replace prototype Tokens
let actorUpdates = [];
for(let actor of game.actors){
let files;
let skip = false;
if(actor.data.token.img.endsWith('.webp')) skip = true;
    try{
        files = await FilePicker.browse('user', `${actor.data.token.img}`, { extensions: ['.webp'] })
    }
    catch{
        skip = true
    }
    if(skip == true) continue
        let newimg = actor.data.token.img.replace(/\.png|\.jpeg|\.jpg|\.gif/,".webp")
        if(CheckWebp(files,newimg)){
            actorUpdates.push({_id: actor.id, "token.img" : newimg});
            console.log("Actor Token", actor, "updated");
        } 
}
if(actorUpdates.length != 0) await Actor.update(actorUpdates);
//Replace Avatars
let actorUpdatesAvatar = [];
for(let actor of game.actors){
    let files;
let skip = false;
if(actor.data.img.endsWith('.webp')) skip = true;
    try{
        files = await FilePicker.browse('user', `${actor.data.img}`, { extensions: ['.webp'] })
    }
    catch{
        skip = true
    }
    if(skip == true) continue
        let newimg = actor.data.img.replace(/\.png|\.jpeg|\.jpg|\.gif/,".webp")
        if(CheckWebp(files,newimg)){
            actorUpdatesAvatar.push({_id: actor.id, "img" : newimg});
            console.log("Actor Avatar", actor, "updated");
        } 
}
if(actorUpdatesAvatar.length != 0) await Actor.update(actorUpdatesAvatar);
//Replace Tokens on scenes
let tottokenupdates = 0;
for(let scene of game.scenes){
    let tokenUpdates = [];
    for(let token of scene.data.tokens){
        let files;
        let skip = false;
        if(token.img.endsWith('.webp')) skip = true;
            try{
                files = await FilePicker.browse('user', `${token.img}`, { extensions: ['.webp'] })
            }
            catch{
                skip = true
            }
            if(skip == true) continue
        let newimg = token.img.replace(/\.png|\.jpeg|\.jpg|\.gif/,".webp")
        if(CheckWebp(files,newimg)){
            tokenUpdates.push({_id: token._id, "img" : newimg});
            console.log("Token", token, "updated");
        }
    }
    if(tokenUpdates.length != 0) await scene.updateEmbeddedEntity("Token",tokenUpdates);
    tottokenupdates+=tokenUpdates.length
}
//Replace all tiles
let tileupdates = 0;
let backgoundupdates = 0;
for(let scene of game.scenes){
    let updates = [];
    for(let tile of scene.data.tiles){
        let files;
        let skip = false;
        if(tile.img.endsWith('.webp')) skip = true;
            try{
                files = await FilePicker.browse('user', `${tile.img}`, { extensions: ['.webp'] })
            }
            catch{
                skip = true
            }
            if(skip == true) continue
            let newimg = tile.img.replace(/\.png|\.jpeg|\.jpg|\.gif/,".webp")
        if(CheckWebp(files,newimg)){
            updates.push({_id: tile._id, img : newimg});
            console.log("Tile", tile, "updated");
        }
        
    }
    console.log("Tiles in Scene ", scene, "updated")
    await scene.updateEmbeddedEntity("Tile",updates);
    tileupdates+=updates.length
    //Replace Backgrounds
    let skip = false;
    let files;
    if(!scene.data.img) continue;
    if(scene.data.img?.endsWith('.webp')) skip = true;
            try{
                files = await FilePicker.browse('user', `${scene.data.img}`, { extensions: ['.webp'] })
            }
            catch{
                skip = true
            }
            if(skip == false){
            let newimg = scene.data.img.replace(/\.png|\.jpeg|\.jpg|\.gif/,".webp")
            if(CheckWebp(files,newimg)){
            await scene.update({img : newimg});
            console.log("Background for Scene", scene, "updated");
            backgoundupdates++;
        }
        }

}

//Replace Journal images
let journalUpdates = 0;
for(let journal of game.journal){
        let files;
        let skip = false;
        if(!journal.data.img) continue;
        if(journal.data.img.endsWith('.webp')) skip = true;
            try{
                files = await FilePicker.browse('user', `${journal.data.img}`, { extensions: ['.webp'] })
            }
            catch{
                skip = true
            }
            if(skip == true) continue
        let newimg = journal.data.img.replace(/\.png|\.jpeg|\.jpg|\.gif/,".webp")
        if(CheckWebp(files,newimg)){
            console.log("Journal", journal, "updated");
            await journal.update({"img" : newimg});
            journalUpdates++;
        }
    
}
//Replace Item directory images
let ItemDirUpdates = [];
for(let item of game.items){
        let files;
        let skip = false;
        if(item.data.img.endsWith('.webp')) skip = true;
            try{
                files = await FilePicker.browse('user', `${item.data.img}`, { extensions: ['.webp'] })
            }
            catch{
                skip = true
            }
            if(skip == true) continue
        let newimg = item.data.img.replace(/\.png|\.jpeg|\.jpg|\.gif/,".webp")
        if(CheckWebp(files,newimg)){
            console.log("Item", item, "updated");
            ItemDirUpdates.push({_id: item.id, "img" : newimg});
        }
    
}
await Item.update(ItemDirUpdates)
//Replace Actors Items images
let actorItemsUpdatesMany = 0;
for(let actor of game.actors){
    let actorItemsUpdates = []
    for(let item of actor.items){
        let files;
        let skip = false;
        if(item.data.img.endsWith('.webp')) skip = true;
            try{
                files = await FilePicker.browse('user', `${item.data.img}`, { extensions: ['.webp'] })
            }
            catch{
                skip = true
            }
            if(skip == true) continue
                let newimg = item.data.img.replace(/\.png|\.jpeg|\.jpg|\.gif/,".webp")
                if(CheckWebp(files,newimg)){
                    actorItemsUpdates.push({_id: item.id, "img" : newimg});
                    console.log("Actor Item", item, "updated");
                    actorItemsUpdatesMany++
                }
     }
     await actor.updateEmbeddedEntity("OwnedItem",actorItemsUpdates)
}
//Replace Tokens Actors Items images
let tokenItemsUpdatesMany = 0;
for(let scene of game.scenes)
{
    let updates = [];
    for(let token of scene.data.tokens){
        let actor = token.actorData;
    let actorItemsUpdates = duplicate(token.actorData);
    if(!actor.items)continue
    for(let i=0;i < actor.items.length;i++){
        let item = actor.items[i]
        let files;
        let skip = false;
        if(item.img.endsWith('.webp')) skip = true;
            try{
                files = await FilePicker.browse('user', `${item.img}`, { extensions: ['.webp'] })
            }
            catch{
                skip = true
            }
            if(skip == true) continue
                let newimg = item.img.replace(/\.png|\.jpeg|\.jpg|\.gif/,".webp")
                if(CheckWebp(files,newimg)){
                    actorItemsUpdates.items[i].img = newimg
                    updates.push({_id: token._id, actorData : actorItemsUpdates})
                    console.log("Actor Item", item, "updated");
                    tokenItemsUpdatesMany++
                }
     }
}
if(updates.length != 0) await scene.updateEmbeddedEntity("Token",updates);
}
//Replace Macro images
let macroUpdates = 0;
for(let macro of game.macros){
        let files;
        let skip = false;
        if(!macro.data.img) continue;
        if(macro.data.img.endsWith('.webp')) skip = true;
            try{
                files = await FilePicker.browse('user', `${macro.data.img}`, { extensions: ['.webp'] })
            }
            catch{
                skip = true
            }
            if(skip == true) continue
        let newimg = macro.data.img.replace(/\.png|\.jpeg|\.jpg|\.gif/,".webp")
        if(CheckWebp(files,newimg)){
            console.log("Journal", macro, "updated");
            await macro.update({"img" : newimg});
            macroUpdates++;
        }
    
}
//Run a separate check for wildcard tokens
let wildcardProtoUpdates = [];
for(let actor of game.actors){
let files;
let skip = false;
if(actor.data.token.img.endsWith(".webp") || actor.data.token.img.replace("*","").length == actor.data.token.img.length) continue;
let splitPath = actor.data.token.img.split("/")
let wildfolder = actor.data.token.img.replace(splitPath[splitPath.length-1],"");
    try{
        files = await FilePicker.browse('user', `${wildfolder}`, { extensions: ['.webp'] })
    }
    catch{
        skip = true
    }
    if(skip == true) continue
        let newimg = actor.data.token.img.replace(/\.png|\.jpeg|\.jpg|\.gif/,".webp")
        if(CheckWebpWildcard(files,newimg)){
            wildcardProtoUpdates.push({_id: actor.id, "token.img" : newimg});
            console.log("Actor Wildcard Token", actor, "updated");
        } 
}
if(wildcardProtoUpdates.length != 0) await Actor.update(wildcardProtoUpdates);
// Replace embedded html images
let journalembeddupdates = 0;
for(let journal of game.journal){
    let html = journal.data.content;
    if(!html) continue
    if(!html.match(/\.png|\.jpeg|\.jpg|\.gif/))continue
    let imagePaths = []
    let newImgPaths = []
    let imgsrcsplit = html.split(`img src="`);
    for(let split of imgsrcsplit){
        let partialSplit=split.split(`" `)
        imagePaths.push(partialSplit[0])
    }
    for(let imagepath of imagePaths){
        let files;
        let skip=false
        try{
            files = await FilePicker.browse('user', `${imagepath}`, { extensions: ['.webp'] })
        }
        catch{
            skip = true
        }
        if(skip == true) continue
            let newimg = imagepath.replace(/\.png|\.jpeg|\.jpg|\.gif/,".webp")
            if(CheckWebpWildcard(files,newimg)){
                newImgPaths.push({oldimage: imagepath, newimage: newimg});
                console.log("Journal Embeded image", newimg, "updated");
                journalembeddupdates++
            } 
    }
    for(let imagePath of newImgPaths){
        html = html.replace(imagePath.oldimage,imagePath.newimage);
    }
    journal.update({"content":html});
}

function CheckWebp(files,webpPath){
    for(let file of files.files){
            if(file === webpPath) return true;
    }
}

function CheckWebpWildcard(files,webpPath){
    let wcFileSplit = webpPath.split("/")
    let wcFileName = wcFileSplit[wcFileSplit.length-1].replace(/\.png|\.jpeg|\.jpg|\.gif/,"").replace("*","").replace(".webp","");
    for(let file of files.files){
        if(file.replace(wcFileName,"").length < file.length) return true;
        if(wcFileName == "") return true;
    }
}

async function yesNoPrompt (dTitle,dContent){

    let dialog = new Promise((resolve, reject) => {
        new Dialog({

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

console.log("=====================================COMPLETED==================================")
console.log(`============Prototype Tokens Updated: ${actorUpdates.length}==================================`)
console.log(`============Avatars Updated: ${actorUpdatesAvatar.length}==================================`)
console.log(`============Tokens Updated: ${tottokenupdates}==================================`)
console.log(`============Prototype Wildcard Tokens Updated: ${wildcardProtoUpdates}==================================`)
console.log(`============Tiles Updated: ${tileupdates}==================================`)
console.log(`============Backgrounds Updated: ${backgoundupdates}==================================`)
console.log(`============Journals Updated: ${journalUpdates}==================================`)
console.log(`============Journals Embedds Updated: ${journalembeddupdates}==================================`)
console.log(`============Actor Items Updated: ${actorItemsUpdatesMany}==================================`)
console.log(`============Token Items Updated: ${tokenItemsUpdatesMany}==================================`)
console.log(`============Directory Items Updated: ${ItemDirUpdates.length}==================================`)
console.log(`============Macros Updated: ${macroUpdates}==================================`)
console.log("================================================================================")
})();