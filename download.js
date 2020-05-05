const alfy = require("alfy")
const os = require("os");
const Hitomi = require("./Hitomi");
const query = alfy.input? alfy.input: false;


(async() => {
    if(query){
        var h = new Hitomi(query, os.homedir());
        await h.read();
        h.convertURL();
        h.download();
    }
})();

process.on('SIGINT',()=>{
    console.log("Killed")
})