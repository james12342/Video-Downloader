var Scraper = require('images-scraper');
const sharp = require("sharp");

var fs = require('fs'),
    request = require('request');


const google = new Scraper({
  puppeteer: {
    headless: true,
  },
});

const keyword='majestic pet';
var savedir = __dirname + '/download/'+keyword;
if (!fs.existsSync(savedir)) {
    fs.mkdirSync(savedir, 0744);
}

(async () => {
  const results = await google.scrape(keyword, 200);

  
  console.log(results);
  var jsonParsedArray = JSON.parse(JSON.stringify(results));

  for (i=0; i<jsonParsedArray.length; i++)
  {
    var title=jsonParsedArray[i].title;
    var url=jsonParsedArray[i].url;
    //console.log('title:'+title+'||| url:'+url); 
   
    download(url, savedir+'/google_'+i+'.jpg', function(){
      //console.log(i+'---> download completed:'+title);

    })
   
    
 }


 //using sharp to resize the images just downloaded


// var outputdir = 'C:/work/GitHub/Video-Downloader/download/'+keyword+'/output/';
// var sharpFrom = 'C:/work/GitHub/Video-Downloader/download/'+keyword+'/';
// if (!fs.existsSync(outputdir)) {
//     fs.mkdirSync(outputdir, 0744);
// }

// console.log(outputdir);
// console.log(sharpFrom);
// var j=1;

// fs.readdir(sharpFrom, (err, files) => {
//    files.forEach(file => {
//        if(file.includes('.jpg'))
//        {
        
//         console.log(file); // use those file and return it as a REST API
//         sharp(sharpFrom+file)
//        .resize({ width: 1800, height: 1200 })
//        .toFile(outputdir+"img_"+j+".jpg");
//        j++;
//        }
    
//      //alert(file);
//    });
// })


})();









var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    //console.log('content-type:', res.headers['content-type']);
    //console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};






