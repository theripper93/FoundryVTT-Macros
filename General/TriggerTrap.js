/*
Macro to be used with multileveltokens on enter macro trigger. req midi-qol
Add this macro and call it something like triggerTrap.
Create an actor called "Trap" then add any spells or attack to
it that you want to use as traps.
When you create a drawing with multileveltokens enable the "on enter" macro trigger
insert the macro name (triggerTrap in this example) then in the arguments: name of the item, dc, path to sound effect
the dc will determine both the saving throw and the attack bonus, if attack: to hit = dc+2, if spell save dc = dc+10
*/

(async()=>{

if (region.data.hidden == true){
    let dc = args[1] ? parseInt(args[1])*2+10 : 10;
    const updatedc = {"data.abilities.int.value": dc, "data.abilities.dex.value": dc, "data.abilities.str.value": dc};
    let trapActor = game.actors.find(a => a.name == "Trap");
    let trapItem = trapActor.items.find(i => i.name == args[0]);
    await trapActor.update(updatedc);
    if (args[2]) AudioHelper.play({src: `${args[2]}`, volume: 0.8, autoplay: true, loop: false}, true);
    region.update({"hidden" : false});
    new MidiQOL.TrapWorkflow(trapActor, trapItem, [token], region.center);
}

})();
