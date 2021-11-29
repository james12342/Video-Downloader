const sharp = require("sharp");
const fs = require('fs');

const testFolder = 'C:/work/git/videodownloader_james/download/test/';

var i=1;
fs.readdir(testFolder, (err, files) => {
   files.forEach(file => {
       if(file.includes('.jpg'))
       {
        
        console.log(file); // use those file and return it as a REST API
        sharp("C:/work/git/videodownloader_james/download/test/"+file)
       .resize({ width: 1800, height: 1200 })
       .toFile("C:/work/git/videodownloader_james/download/test/output/img_"+i+".jpg");
       i++;
       }
    
     // alert(file);
   });
})





