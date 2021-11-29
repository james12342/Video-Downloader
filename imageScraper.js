var Scraper = require('images-scraper');
const imageJson=null;
var fs = require('fs'),
    request = require('request');


const google = new Scraper({
  puppeteer: {
    headless: true,
  },
});

(async () => {
  const results = await google.scrape('apple', 200);
  //console.log(results);
  var jsonParsedArray = JSON.parse(JSON.stringify(results));
  for (i=0; i<jsonParsedArray.length; i++){
    var title=jsonParsedArray[i].title;
    var url=jsonParsedArray[i].url;
    //console.log('title:'+title+'||| url:'+url); 
    console.log('downloading:'+title);
    download(url, 'C:/work/GitHub/Video-Downloader/download/google/google_'+i+'.jpg', function(){
    console.log('download done');
})
 }

})();




var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};


//using sharp to resize the images just downloaded

const sharp = require("sharp");


const testFolder = 'C:/work/GitHub/Video-Downloader/download/google/';

var i=1;
fs.readdir(testFolder, (err, files) => {
   files.forEach(file => {
       if(file.includes('.jpg'))
       {
        
        console.log(file); // use those file and return it as a REST API
        sharp(testFolder+file)
       .resize({ width: 1800, height: 1200 })
       .toFile(testFolder+"output/img_"+i+".jpg");
       i++;
       }
    
     // alert(file);
   });
})



