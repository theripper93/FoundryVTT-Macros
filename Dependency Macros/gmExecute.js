(async()=>{
    
  switch (args[0]) {
      case "createEmbeddedEntity":
        await canvas.tokens.get(args[1]).actor.createEmbeddedEntity(args[2],args[3]);
        break;

    }
  
})();
