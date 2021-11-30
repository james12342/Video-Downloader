const sharp = require("sharp");
const fs = require('fs');
const args = require('minimist')(process.argv.slice(2))

console.log(args['keyword']); //joe);

//const fromFolder = 'C:/work/git/videodownloader_james/download/'+args['keyword'];
const fromFolder = __dirname.replace(/\\/g,'/')+"/download/"+args['keyword']+'/output';
const toFolder =  __dirname.replace(/\\/g,'/')+"/download/"+args['keyword']+'/output/output1';
if (!fs.existsSync(fromFolder)) {
    fs.mkdirSync(fromFolder, 0744);
}
if (!fs.existsSync(toFolder)) {
    fs.mkdirSync(toFolder, 0744);
}

//first round to get everyimage jpg
var i=1;
fs.readdir(fromFolder, (err, files) => {
   files.forEach(file => {
       if(file.includes('.jpg'))
       {
        try {
            console.log(file); // use those file and return it as a REST API
        sharp(fromFolder+"/"+file)
       .resize({ width: 1800, height: 1200 })
       .toFile(toFolder+"/img_"+i+".jpg");
       i++;
          } catch (error) {
            console.error(error); 
          }
       }
    
     // alert(file);
   });
})

//end first round to get everyimage jpg


