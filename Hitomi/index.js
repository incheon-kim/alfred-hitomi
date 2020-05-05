const path = require("path");
const https = require("https");
const fs = require("fs");
const async = require("async");
const alfy = require("alfy");
const HitomiHelper = require("./HitomiHelper");


const removeForbiddenASCII = (str) => {
    var forbidden = ["<", ">", ":", '"', "/", "\\", "|", "?", "*"];

    forbidden.forEach((character)=>{
        str = str.split(character).join("_");
    });
    return str;
}
const getPaddedNumber = (fileNum) => {
    return "000000".substr(0, "000000".length-fileNum.length)+fileNum;
}

const sleep = (ms) => {
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

class Hitomi {
    id = "";
    title = "";

    images = new Array();
    files = [];

    filename = null;
    downloaded = 0;

    constructor(id, path){
        this.id = id;
        this.path = path;
    }

    async read(){
        let option = {
            host : "ltn.hitomi.la",
            method: "GET",
            path :  `/galleries/${this.id}.js`,
            "headers":{
                "User-Agent": "Mozilla/5.0",
                "Content-Type" : "application/javascript; charset=UTF-8"
            },
        };

        const result = await HitomiHelper.getGalleryDataRequest(option);
        this.title = result.title;
        this.files = result.files;
    }

    convertURL(){
        if(this.files.length !== 0){
            for(var i=0; i< this.files.length; i++){
                this.images.push(
                    HitomiHelper.image_url_from_image(this.id, this.files[i])
                );
            }
        }
    }

    async writeCache(){
        return new Promise(async (resolve, reject)=>{
            var cache = alfy.cache.get("downloading");
            if(cache == undefined){
                cache = [];
                cache.push({
                    "id" : this.id,
                    "pid" : process.pid,
                    "title" : this.title,
                    "downloaded" : this.downloaded,
                    "total" : this.files.length,
                    "state": "Pending",
                });
                alfy.cache.set("downloading", cache);
            }else{
                var idx = cache.length;
                cache.push({
                    "id" : this.id,
                    "pid" : process.pid,
                    "title" : this.title,
                    "downloaded" : this.downloaded,
                    "total" : this.files.length,
                    "state" : "Pending",
                });
                alfy.cache.set("downloading", cache);
                resolve(idx);
            }
        })
    }
    async download(){
        this.titleForFS = removeForbiddenASCII(this.title);
        let savePath = path.resolve(this.path + `/hitomi/${this.titleForFS} - ${this.id}`);
        fs.mkdirSync(savePath, {recursive:true});
        
        https.globalAgent.options.timeout = 8000;

        // write to alfy cache
        this.writeCache();

        // wait until queue is available
        var cache = alfy.cache.get("downloading");
        
        var running = alfy.cache.get("downloading").length;
        while(running >= 3){
            await sleep(1);
            running = alfy.cache.get("downloading").length;
        }

        cache = alfy.cache.get("downloading")
        this.queueidx = cache.findIndex(x => x.id == this.id);
        var cache = alfy.cache.get("downloading");
        cache[this.queueidx].state = "Downloading";
        alfy.cache.set("downloading", cache);
        async.eachOfLimit(this.images, 5, (image, idx, callback)=>{
            let options = {
                "host" : image.split("/")[2],
                "method" : "GET",
                "path": image.slice(image.indexOf("image")-1),
                "headers":{
                    "Referer": `https://hitomi.la/reader/${this.id}.html`,
                    "accept": "*/*",
                    "User-Agent": "Mozilla/5.0",
                },
            };

            let fileNum = ((idx)+1).toString();
            let ext = image.split('.').pop();

            let req = https.request(options, (res)=>{
                let file = fs.createWriteStream(`${savePath}/${getPaddedNumber(fileNum)}.${ext}`);

                res.on("data", (chunk)=>{
                    file.write(chunk);
                });

                res.on("end", async ()=>{
                    file.close();
                    this.downloaded++;

                    cache = alfy.cache.get("downloading")
                    this.queueidx = cache.findIndex(x => x.id == this.id);

                    cache[this.queueidx].downloaded = this.downloaded;

                    if(this.downloaded == this.images.length){
                        // when it is done delete from queue
                        cache.splice(this.queueidx, 1)
                        console.log(this.id);
                    }

                    alfy.cache.set("downloading", cache);
                    
                    callback();
                })
            }).on("error", (err)=>{});

            req.end();
        }, (msg)=>{});
    }
}

module.exports = Hitomi;