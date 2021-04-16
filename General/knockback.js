//await knockback(canvas.tokens.controlled[0],Array.from(game.user.targets)[0],10);
//await game.macros.getName("macroname").execute(canvas.tokens.get(args[0].tokenId),game.user.targets,5);
let pusher = args[0];
let pushed = args[1];
let knockDist = parseInt(args[2]);
await knockback(pusher,pushed,knockDist);
async function knockback(ptoken,ttoken,distance){

    const x1 = ptoken.center.x;
    const x2 = ttoken.center.x;
    const y1 = ptoken.center.y;
    const y2 = ttoken.center.y;
    let angcoeff = Math.abs((y2-y1)/(x2-x1));
    if(angcoeff > 1) angcoeff = 1/angcoeff;
    const unitDistance = distance+(distance*Math.sqrt(2)-distance)*angcoeff;
    const gridUnit = canvas.scene.data.grid;
    console.log(angcoeff,unitDistance);
    distance = (distance*canvas.scene.data.grid)/canvas.scene.data.gridDistance;

    async function getXy(x){

        return (y2-y1)*(x-x1)/(x2-x1)+y1;

    }

    async function findDestination(){

        const scenew = canvas.dimensions.width;
        let coordinatesArray = [];
        for (let i = 0; i <= scenew; i+=1){
            
            let ty = await getXy(i);
            let snapCoord = await canvas.grid.getCenter(i, ty);
            let cdist = await canvas.grid.measureDistance({"x" : snapCoord[0],"y" : snapCoord[1]}, ttoken.center);
            if(await canvas.grid.measureDistance({"x" : snapCoord[0],"y" : snapCoord[1]}, ptoken.center)>await canvas.grid.measureDistance(ttoken.center, ptoken.center) && await canvas.grid.measureDistance({"x" : snapCoord[0],"y" : snapCoord[1]}, ptoken.center) > unitDistance){
                coordinatesArray.push({"x" : i,"y" : ty, "dist" : cdist});
            }
            
        }
            return coordinatesArray;

    }
    if(ptoken.center.x == ttoken.center.x){

        if(ptoken.center.y - ttoken.center.y > 0){
            await updateKB({"y": ttoken.data.y-distance,"x": ttoken.data.x},{"x": ttoken.center.x,"y": ttoken.center.y-distance})
        }
        else{
            await updateKB({"y": ttoken.data.y+distance,"x": ttoken.data.x},{"x": ttoken.center.x,"y": ttoken.center.y+distance})
        }

    }
    else if (ptoken.center.y == ttoken.center.y){

        if(ptoken.center.x - ttoken.center.x > 0){
            await updateKB({"x": ttoken.data.x-distance,"y": ttoken.data.y},{"x": ttoken.center.x-distance,"y": ttoken.center.y})
        }
        else{
            await updateKB({"x": ttoken.data.x+distance,"y": ttoken.data.y},{"x": ttoken.center.x+distance,"y": ttoken.center.y})
        }

    }
    else{

        let fdest = await findDestination();
        let coord = fdest.reduce(function(prev, curr) {
            return (Math.abs(curr.dist - unitDistance) < Math.abs(prev.dist - unitDistance) ? curr : prev);
          });
        fdest = await canvas.grid.getSnappedPosition(coord.x-gridUnit/2, coord.y-gridUnit/2, 1);
        await updateKB(fdest);
        

    }
    async function updateKB(center,originalcenter){
        if(originalcenter){
            if(await ttoken.checkCollision(originalcenter)){
                if(knockDist <= 5) return;
                knockDist-=5;
                await knockback(pusher,pushed,knockDist);
            }
            else{
            await ttoken.update(center);
            }
        }
        else{
            if(await ttoken.checkCollision(center)){
                if(knockDist <= 5) return;
                knockDist-=5;
                await knockback(pusher,pushed,knockDist);
            }
            else{
            await ttoken.update(center);
            }
        }
    }
        
}