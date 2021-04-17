// Lighswitch macro
// Macro 1: Name : lightSwitchPlayer Content: game.macros.getName("lightSwitchGmMacro").execute(token.id);
// Macro 2: Name : lightSwitchGmMacro Content: Below
let triggerToken = canvas.tokens.get(args[0]);
const reducer = (previousLight, currentLight) => {return canvas.grid.measureDistance(currentLight.center, triggerToken.center) < canvas.grid.measureDistance(previousLight.center, triggerToken.center) ? currentLight : previousLight;};
let lightToSwitch = await canvas.lighting.placeables.reduce(reducer, canvas.lighting.placeables[0]);
lightToSwitch.update({"hidden": !lightToSwitch.data.hidden});
// Trigger Happy Setup:
// Create a token, call it lightswitchtoken (example) give it a transparent image and place it as hidden
// On your "Trigger Happy" journal entry add the following line
//  @Token[lightSwitch]@Trigger[click]
// the drag the lightSwitchPlayer macro from your hotbar to the journal. it should end up loking something like this
// but with the correct Id
// @Token[lightSwitch]@Trigger[click]@Macro[1ENFpqAKMFKgnc5q]{lightSwitchPlayer}