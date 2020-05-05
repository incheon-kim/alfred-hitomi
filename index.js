const alfy = require('alfy');
const spawn = require("child_process").spawn;
const HitomiHelper = require("./Hitomi/HitomiHelper");
const query = alfy.input? alfy.input: false;

const getURLfromBrowser = () =>{
     return new Promise((resolve, reject)=>{
          const proc = spawn('./get_browser_info.js')
          let std_out = ''
          let std_err = ''
     
          proc.stdout.on('data', (chunk) =>{
               std_out += chunk.toString();
          })
     
          proc.stderr.on('data', (chunk) =>{
               std_err += chunk;
          })
     
          proc.on('error', (err)=>{
          })
     
          proc.on('exit', (code)=>{
               if(std_err !== ''){
                    reject(std_err);
               }else{
                    var title = std_out.split("\n")[1]
                    var url = std_out.split("\n")[0]
                    var re = /https:\/\/hitomi.la\/.+\/(.*?)-?(\d+)(\.html).*/;
                    var title_re = /^(.*?)(( - Read Online.*)|( \| Hitomi.la))/;
                    title = title.match(title_re)[1];
                    var id = url.match(re)[2];
     
                    if(id == null){
                         reject("Invalid URL!");
                    }else{
                         const list = [
                              {
                              title: title,
                              subtitle: id,
                              arg: id,
                              }
                         ];
                         resolve(list);
                    }
               }
          })
     })
}
 
(async() => {
     var list = [];
     try{
          list = await getURLfromBrowser();
     } catch(err){
          list.push({
			"title": err !== "Invalid URL!"? "Unsupported Browser": "Invalid URL!",
			"subtitle": "Press ⌘L to see the full error and ⌘C to copy it.",
			"valid": false,
			"text": {
				"copy": err,
				"largetype": err,
			},
			"icon": {
				"path": "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/AlertStopIcon.icns"
			}
		})
     } finally{
          if(query){
               const id = HitomiHelper.hitomiURLtoGallery(query);
               if(id !== "false"){
                    list.unshift({
                         title : "Download from given URL",
                         subtitle : id,
                         arg : id,
                    });
               }else{
                    list.unshift({
                         title: "Invalid Input!",
                         subtitle: "It seems not from hitomi.la",
                         valid : false,
                         text:{
                              "copy" : query + " " + id,
                         },
                         "icon": {
                              "path": "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/AlertStopIcon.icns"
                         }
                    })
               }
          }
          alfy.output(list);
     }     
})();