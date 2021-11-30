const exec = require('child_process').exec;
const sharp = require("sharp");
const fs = require('fs');
const args = require('minimist')(process.argv.slice(2))



//alert(args.k);
console.log(args.k); //joe);
const ImageFolderName=args.k.replace('#', ' ');

const fromFolder = __dirname.replace(/\\/g,'/')+'/download/'+ImageFolderName;
const toFolder = __dirname.replace(/\\/g,'/')+'/download/'+ImageFolderName+'/output';
const toFolder1 = __dirname.replace(/\\/g,'/')+'/download/'+ImageFolderName+'/output/output1';

if (!fs.existsSync(toFolder)) {
    fs.mkdirSync(toFolder, 0744);
}
if (!fs.existsSync(toFolder1)) {
    fs.mkdirSync(toFolder1, 0744);
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
       .toFile(fromFolder+"/output/img_"+i+".jpg");
       i++;
          } catch (error) {
            console.error(error); 
          }
       }
    
     // alert(file);
   });
})


//execute the watermark command
const l_sharp2=exec(`node sharpImages2.js --k `+args.k, (error, stdout, stderr) => {
    
    if (error) {
      console.error(`exec error: ${error}`);
      alert(`${error}`);
     // return;
    }
  
    l_sharp2.stdout.on('data', data => {
      percentage.innerText = data;
  
      console.log(`stdout: ${data}`);
    });
    l_sharp2.stdio.on('data', data => {
      percentage.innerText = data;
  
      console.log(`stdio: ${data}`);
    });
    l_sharp2.stderr.on('data', data => {
      percentage.innerText = data;
  
      console.log(`stderr: ${data}`);
    });
  
     alert(`${stdout}`);
     alert(`${stderr}`);
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });


//end first round to get everyimage jpg

// //second round to get everyimage jpg
// var j=1;
// fs.readdir(toFolder, (err, files1) => {
//    files1.forEach(file1 => {
//        if(file1.includes('.jpg'))
//        {
//         try {
//             console.log(file1); // use those file and return it as a REST API
//         sharp(toFolder+"/"+file1)
//        .resize({ width: 1800, height: 1200 })
//        .toFile(toFolder1+"/img_"+j+".jpg");
//        j++;
//           } catch (error) {
//             console.error(error); 
//           }
//        }
    
//      // alert(file);
//    });
// })

//end second round to get everyimage jpg



