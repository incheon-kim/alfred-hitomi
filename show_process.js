const alfy = require("alfy");

const alfred_output = (outputs) => {
    console.log(JSON.stringify({
        rerun : 1,
        items: outputs
    },null,'\t'))
}
var output = [];
(async () => {
    var cache = alfy.cache.get("downloading");
    
    if(cache !== undefined && cache.length > 0){
        for(var i=0; i < cache.length; i++){
            output.push(
                {
                    title: cache[i].title,
                    subtitle: `pid: ${cache[i].pid} state : ${cache[i].state} - ${cache[i].downloaded}/${cache[i].total}`,
                    valid: false,
                }
            )
        }
        
    }else{
        output.push(
            {
                title: "No Process",
                subtitle: "Nothing is being downloaded",
                valid: false,
            }
        )
    }
    alfred_output(output);
})();