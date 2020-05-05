const alfy = require("alfy");
const query = alfy.input;

const alfred_output = (outputs) => {
    console.log(JSON.stringify({
        rerun : 1,
        items: outputs
    },null,'\t'))
}

var cache = alfy.cache.get("downloading");
var output = [];
if(cache !== undefined && cache.length != 0){
    var filtered = cache.filter(x=> x.state=="Downloading");
    for(var i=0;i<filtered.length;i++){
        output.push(
            {
                title: filtered[i].title,
                subtitle:`${filtered[i].id} - ${filtered[i].downloaded} / ${filtered[i].total} Downloaded`,
                valid: false,
            }
        )
    }
    var pending = cache.filter(x=>x.state=="Pending");
    if(pending.length > 0){
        output.push(
            {
                title: `${pending.length} items are waiting for queue`,
                subtitle : `Have patience`,
                valid: false,
            }
        )
    }
}else{
    output.push(
        {
            title: "No Progress",
            subtitle: "How2Use: ht <URL>",
            valid: false,
        }
    )
}
alfred_output(output);