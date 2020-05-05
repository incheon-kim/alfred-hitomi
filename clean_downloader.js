const alfy = require("alfy");

const alfred_output = (outputs) => {
    console.log(JSON.stringify({
        rerun : 1,
        items: outputs
    },null,'\t'))
}

(async () => {
    var cache = alfy.cache.get("downloading");
    alfy.log(cache);
    var pids = [];
    for(var i=0; i<cache.length; i++){
        pids.push(cache[i].pid);
    }
    
    for(var i=0; i<pids.length; i++){
        try{
            process.kill(pids[i], 'SIGINT');
        }catch(err){

        }
        
    }
    cache = alfy.cache.set("downloading")
    console.log("done")
})();