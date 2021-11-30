// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

var fs = require('fs-extra');
const spawn = require('child_process').spawn;
const exec = require('child_process').exec;
const ytdl = require('ytdl-core');
//const sharp = require("sharp");
var youtubedl = require('youtube-dl');
const { shell } = require('electron');
const homedir = require('os').homedir();
const { dialog } = require('electron').remote;
const fs1 = require("fs");
const path1 = require("path");

//alert(sharp.versions);

const CurrentDir=__dirname.replace(/\\/g,'/');
const waterinkLogo=CurrentDir+"/logo2.jpg";


const downloader = require('./downloadBinary');

const ffmpeg = require('@ffmpeg-installer/ffmpeg');

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;

console.log(`ffmpeg path: ${ffmpegPath}`);

const youtubeBinaryFilePath = youtubedl.getYtdlBinary();

console.log(`youtube-dl binary path: ${youtubeBinaryFilePath}`);

// create videos file if doesn't exist
var dir = `./download`;
var ffmpeg_exeFullPath = `C:/ffmpeg/bin`;
var videoDownloadFullPath = CurrentDir+`/download`;
var batchFullPath = CurrentDir+`/batch`;

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}


// select video input
var selectVideoDirectoryInput = document.getElementsByClassName(
  'selectVideoDirectoryInput'
)[0];

var playlistDownloadingDiv = document.getElementsByClassName(
  'playlistDownloadingDiv'
)[0];

var titleDiv = document.getElementsByClassName('titleDiv')[0];

var downloadPlaylistText = document.getElementsByClassName(
  'downloadPlaylistText'
)[0];

//email
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'harrison20120512@gmail.com',
    pass: 'kentxy_0123'
  }
});




const getMostRecentFile = (dir) => {
  const files = orderReccentFiles(dir);
  return files.length ? files[0].file : undefined;
};

const orderReccentFiles = (dir) => {
  return fs1.readdirSync(dir)
    .filter((file) => fs1.lstatSync(path1.join(dir, file)).isFile())
    .map((file) => ({ file, mtime: fs.lstatSync(path1.join(dir, file)).mtime }))
    .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
};


//alert(getMostRecentFile('./download/'));

//end email

// var url = 'https://www.youtube.com/watch?v=ZcAiayke00I';

//convert video to different size
function resizeVideo(video, quality) {
  const p = new Promise((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', ['-i', `${parent}/${video}.mp4`, '-codec:v', 'libx264', '-profile:v', 'main', '-preset', 'slow', '-b:v', '400k', '-maxrate', '400k', '-bufsize', '800k', '-vf', `scale=-2:${quality}`, '-threads', '0', '-b:a', '128k', `${parent}/transcoded/${video}_${quality}.mp4`]);
    ffmpeg.stderr.on('data', (data) => {
      console.log(`${data}`);
    });
    ffmpeg.on('close', (code) => {
      resolve();
    });
  });
  return p;
}

function processVideos() {
  let video = videos.pop();
  if (video) {
    resizeVideo(video, 720).then(() => {
      // 720p video all done
      resizeVideo(video, 480).then(() => {
        // 480p video all done
        resizeVideo(video, 360).then(() => {
          // 360p video all done
          console.log(`Completed Video Number - ${video}`);
          processVideos();
        });
      });
    });
  }
}

//end convert video to different 


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function download(url, title, downloadAsAudio, youtubeUrl, saveAsTitleValue) {
  let arguments = [];


  // set the url for ytdl
  arguments.push(url);

  // verbose output
  arguments.push('-v');

  // arguments.push('-f', 'bestvideo+bestaudio/best');

  arguments.push('--add-metadata');

  arguments.push('--ffmpeg-location');

  arguments.push(ffmpegPath);

  arguments.push('--no-mtime');

  arguments.push('--ignore-errors');

  // select download as audio or video
  if (downloadAsAudio) {
    arguments.push('-f');

    // arguments.push('bestaudio');

    // don't want webm as audio
    arguments.push('bestaudio[ext!=webm]');

    /** conversion taking too long atm **/
    // arguments.push('--extract-audio');
    //
    // arguments.push('--audio-format');
    //
    // arguments.push('mp3');

    // can add something here later
  } else {

    // download as mp4 if it's youtube (tired of reconverting .flv files)
    const isYouTubeDownload = url.match('youtube');
    if (isYouTubeDownload) {
      console.log('downloading from youtube');

      arguments.push('-f');

      arguments.push('bestvideo[ext=mp4]+bestaudio[ext=m4a]/mp4');
    }

    //arguments.push('worse');
  }
  // // verbose output

  console.log(title);
  //alert(title);
  // replace forward slashes with underscores
  if (title) {
    title = title.replace(/\//g, '_');
    title = title.replace(/\s/g, '_');
    // alert(title);
    console.log('replacing');
  }
  else {
    var date = new Date();

    //alert( date.getFullYear() + ("0" + (date.getMonth() + 1)).slice(-2) + ("0" + date.getDate()).slice(-2) + ("0" + date.getHours() ).slice(-2) + ("0" + date.getMinutes()).slice(-2) + ("0" + date.getSeconds()).slice(-2) );

    title = date.getFullYear() + ("0" + date.getHours()).slice(-2) + ("0" + date.getMinutes()).slice(-2) + ("0" + date.getSeconds()).slice(-2);
  }

  // TODO: trim to max 255 letters

  // title is that passed or the one from youtube
  const fileName = title || '%(title)s';
  // const fileName = title ;
  //fileName = fileName.replace(/\s/g, '_');

  console.log(title);

  let inputtedUrl = selectVideoDirectoryInput.value;

  console.log(inputtedUrl);

  // create
  if (!fs.existsSync(inputtedUrl)) {
    fs.mkdirp(inputtedUrl);
  }

  console.log(__dirname);

  const filePath = inputtedUrl;

  const fileExtension = `%(ext)s`;

  //fileName = fileName.replace(/\s/g, '_');
  //alert(fileName);

  //const FinalFileName=fileName.fileName.replace(/\s/g, '_');

  let saveToFolder = `${filePath}/${fileName}.${fileExtension}`;
  // saveToFolder = saveToFolder.replace(/\//g, '_');
  // saveToFolder= saveToFolder.replace(/\s/g, '_');
  // alert(saveToFolder);
  console.log(saveToFolder);

  // save to videos directory
  arguments.push('-o', saveToFolder);

  console.log(arguments);

  // deleted for now since it requires ffmpeg
  // download as audio if needed
  // if(downloadAsAudio){
  //   console.log('Download as audio');
  //   arguments.push('-x');
  // }

  console.log(arguments);

  const ls = spawn(youtubeBinaryFilePath, arguments);

  ls.stdout.on('data', data => {
    percentage.innerText = data;

    console.log(`stdout: ${data}`);
  });

  ls.stderr.on('data', data => {
    percentage.innerText = data;

    console.log(`stderr: ${data}`);
  });

  ls.on('close', code => {
    playlistDownloadingDiv.style.display = 'none';
    titleDiv.style.display = '';

    // clear out inputs after
    youtubeUrl.value = '';
    saveAsTitleValue.value = '';

    // if it ends successfully say download completed
    if (code == 0) {
      percentage.innerText = 'Download completed';
      //sending email
      //alert("title:"+title+" ------ filename:"+saveToFolder);
      //get the latest downloaded file from the folder


      //alert('latest:'+getMostRecentFile('./download'));

      var latestFileName = getMostRecentFile('./download/');


      //  convert the video

      //ffmpeg -i s.mp4 -vf "scale=trunc(iw/4)*2:trunc(ih/4)*2" -c:v libx265 -crf 28 34half_the_frame_size.mp4

      //ffmpeg -i input.mp4 -vcodec libx264 -crf 20 output.mp4
      //ffmpeg -i input.mp4 -b 800k output.mp4
      // ffmpeg -i input.mkv -vf "scale=trunc(iw/4)*2:trunc(ih/4)*2" -c:v libx265 -crf 28 half_the_frame_size.mkv
      //save the bat file
      //  var ffmpeg_exeFullPath = `C:/ffmpeg/bin`;
      //  var videoDownloadFullPath = `C:/work/GitHub/videodownloader_james/download`;

      //ffmpeg -i input.avi -c:v libx265 -crf 28 -c:a aac -b:a 128k -tag:v hvc1 output.mp4
      //const batcontent = `${ffmpeg_exeFullPath}/ffmpeg.exe` + ' -i ' + `${videoDownloadFullPath}/` + latestFileName + ' -vf "scale=trunc(iw/4)*2:trunc(ih/4)*2" -c:v libx265 -crf 28 ' + `${videoDownloadFullPath}/h` + latestFileName;
      //const batcontent = `${ffmpeg_exeFullPath}/ffmpeg.exe`+' -i '+`${videoDownloadFullPath}/`+latestFileName+' -vcodec libx264 -crf 23 '+`${videoDownloadFullPath}/h`+latestFileName;
      //const batcontent = `${ffmpeg_exeFullPath}/ffmpeg.exe`+' -i '+`${videoDownloadFullPath}/`+latestFileName+' -b 800k '+`${videoDownloadFullPath}/h`+latestFileName;
      // const batcontent = `${ffmpeg_exeFullPath}/ffmpeg.exe`+' -i '+`${videoDownloadFullPath}/`+latestFileName+' -vf "scale=-2:240:flags=lanczos" -vcodec libx264 -profile:v main -level 3.1 -preset medium -crf 24 -x264-params ref=4 -acodec copy -movflags +faststart '+`${videoDownloadFullPath}/h`+latestFileName;
      // // C:/ffmpeg/bin/ffmpeg.exe -i C:/work/GitHub/videodownloader_james/download/20211117133205.mp4 -vf "scale=-2:720:flags=lanczos" -vcodec libx264 -profile:v main -level 3.1 -preset medium -crf 24 -x264-params ref=4 -acodec copy -movflags +faststart C:/work/GitHub/videodownloader_james/download/httt2.mp4


      // //alert (batcontent);
      // fs.writeFile(`${batchFullPath}/compress.bat`, batcontent, err => {
      //   if (err) {
      //     console.error(err)
      //     return
      //   }
      //   //file written successfully
      // })


      // //  alert('ffmpeg -i '+`${dir}/${latestFileName}`+' -vf "scale=trunc(iw/4)*2:trunc(ih/4)*2" -c:v libx265 -crf 28 half_'+`${dir}/half_${latestFileName}`);
      //  exec(`${batchFullPath}/compress.bat`, (error, stdout, stderr) => {
      //   if (error) {
      //     console.error(`exec error: ${error}`);
      //     alert(`${error}`);
      //     return;
      //   }
      //    alert(`${stdout}`);
      //    alert(`${stderr}`);
      //   console.log(`stdout: ${stdout}`);
      //   console.error(`stderr: ${stderr}`);
      // });

     
      //sleep(10000);


      //wait for 10 seconds because the file is generating
      //sleep(10000);
     

    }

    console.log(`child process exited with code ${code}`);
  });
}

// start download button
var startDownload = document.getElementsByClassName('startDownload')[0];

// open folder button
var openFolder = document.getElementsByClassName('openFolder')[0];

// percentage div
var percentage = document.getElementsByClassName('percentage')[0];

//start email button
var startEmail=document.getElementsByClassName('startEmail')[0];

//Add watermark
var Watermarklogo=document.getElementsByClassName('Watermarklogo')[0];

//compress video
var CompressVideo=document.getElementsByClassName('CompressVideo')[0];

//Image convert to video
var ImagesDownload=document.getElementsByClassName('ImagesDownload')[0];

//resize the images
var ImagesResize=document.getElementsByClassName('ImagesResize')[0];

//image gen to video
var ImagesGenVideo=document.getElementsByClassName('ImagesGenVideo')[0];

// kill all nodejs process

var RefreshNode=document.getElementsByClassName('RefreshNode')[0];

startEmail.onclick = function () {
  var emailAddress = document.getElementsByClassName('emailList')[0].value;
 
  var latestFileName = getMostRecentFile('./download/');

  alert(latestFileName);
   //begin send email
   var mailOptions =
   {
     from: 'harrison20120512@gmail.com',
     // to: 'workad_009@icloud.com,3359244988@qq.com',
     to: emailAddress,
     subject: "From Brother's love",
     text: 'For fun ONLY,enjoy your day:)',
     attachments: [
       {
         

         filename: latestFileName,
         path: __dirname + '/download/' + latestFileName,
         cid: 'uniq-' + latestFileName
       }
     ]
   };

   transporter.sendMail(mailOptions, function (error, info) {
     if (error) {
       console.log(error);
       alert('send email fail:' + error);
       percentage.innerText = 'Download completed and email sent FAIL';

     } else {
      alert('email sent SUCESS');
       percentage.innerText = 'Download completed and email sent SUCESS';
       
       console.log('Email sent: ' + info.response);

     }
   });


   //end sending email

 
};


openFolder.onclick = function () {
  var value = CurrentDir+"/download";
  shell.openItem(value);
};


startDownload.onclick = function () {
  var youtubeUrl = document.getElementsByClassName('youtubeUrl')[0];
  var downloadAsAudio = document.getElementsByClassName('downloadAsAudio')[0];
  var saveAsTitle = document.getElementsByClassName('saveAsTitle')[0];

  var youtubeUrlValue = youtubeUrl.value;
  var saveAsTitleValue = saveAsTitle.value;
  //trim the videoname without space

  saveAsTitleValue = saveAsTitleValue.replace(' ', '_');
  var downloadAsAudioValue = downloadAsAudio.checked;

  download(
    youtubeUrlValue,
    saveAsTitleValue,
    downloadAsAudioValue,
    youtubeUrl,
    saveAsTitle
  );

  percentage.scrollIntoView();
};

Watermarklogo.onclick=function()
{
//alert('water mark');
var latestFileName = getMostRecentFile('./download/');
alert(latestFileName);
//execute the watermark command

const l_water=exec(`C:/ffmpeg/bin/ffmpeg.exe  -i `+`${videoDownloadFullPath}`+'/'+`${latestFileName}`+' -i '+`${waterinkLogo}`+' -filter_complex "[1][0]scale2ref=w=oh*mdar:h=ih*0.1[logo][video];[video][logo]overlay=W-w-5:H-h-5" -c:a copy '+`${videoDownloadFullPath}/W_`+`${latestFileName}`, (error, stdout, stderr) => {
  alert(`C:/ffmpeg/bin/ffmpeg.exe  -i `+`${videoDownloadFullPath}`+'/'+`${latestFileName}`+' -i '+`${waterinkLogo}`+' -filter_complex "[1][0]scale2ref=w=oh*mdar:h=ih*0.1[logo][video];[video][logo]overlay=W-w-5:H-h-5" -c:a copy '+`${videoDownloadFullPath}/W_`+`${latestFileName}`);
  if (error) {
    console.error(`exec error: ${error}`);
    alert(`${error}`);
    return;
  }

  l_water.stdout.on('data', data => {
    percentage.innerText = data;

    console.log(`stdout: ${data}`);
  });
  l_water.stdio.on('data', data => {
    percentage.innerText = data;

    console.log(`stdio: ${data}`);
  });
  l_water.stderr.on('data', data => {
    percentage.innerText = data;

    console.log(`stderr: ${data}`);
  });

   alert(`${stdout}`);
   alert(`${stderr}`);
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});
//end watermark


};

CompressVideo.onclick=function()
{

  var latestFileName = getMostRecentFile('./download/');
alert(latestFileName);
      const batcontent = `${ffmpeg_exeFullPath}/ffmpeg.exe`+' -i '+`${videoDownloadFullPath}/`+latestFileName+' -vf "scale=-2:240:flags=lanczos" -vcodec libx264 -profile:v main -level 3.1 -preset medium -crf 24 -x264-params ref=4 -acodec copy -movflags +faststart '+`${videoDownloadFullPath}/h`+latestFileName;
      
      fs.writeFile(`${batchFullPath}/compress.bat`, batcontent, err => {
        if (err) {
          console.error(err)
          return
        }
        //file written successfully
      })
      //  alert('ffmpeg -i '+`${dir}/${latestFileName}`+' -vf "scale=trunc(iw/4)*2:trunc(ih/4)*2" -c:v libx265 -crf 28 half_'+`${dir}/half_${latestFileName}`);
       exec(`${batchFullPath}/compress.bat`, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          alert(`${error}`);
          return;
        }
         alert(`${stdout}`);
         alert(`${stderr}`);
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
      });


};

ImagesDownload.onclick=function()
{


var Scraper = require('images-scraper');
//const sharp = require("sharp");

var fs2 = require('fs'),
    request = require('request');


const google = new Scraper({
  puppeteer: {
    headless: true,
  },
});


const keyword=document.getElementsByClassName('ImageKeyword')[0].value;
alert('Downloading images for:'+keyword);
var savedir = __dirname + '/download/'+keyword;
if (!fs2.existsSync(savedir)) {
  fs2.mkdirSync(savedir, 0744);
}

(async () => {
  const results = await google.scrape(keyword, 200);

  
  console.log(results);
  var jsonParsedArray = JSON.parse(JSON.stringify(results));

  for (i=0; i<jsonParsedArray.length; i++)
  {
    var title=jsonParsedArray[i].title;
    var url=jsonParsedArray[i].url;
    console.log('title:'+title+'||| url:'+url); 
   
    download(url, savedir+'/google_'+i+'.jpg', function(){
      //console.log(i+'---> download completed:'+title);

    })
     
 }


})();

//alert('Images download completed');
var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    //console.log('content-type:', res.headers['content-type']);
    //console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs2.createWriteStream(filename)).on('close', callback);
  });
};
}

ImagesResize.onclick=function()
{

var imageFolderName=document.getElementsByClassName('ImageKeyword')[0].value;
imageFolderName=imageFolderName.replace(' ','#');

const l_resize=exec(`node sharpImages.js --k `+imageFolderName, (error, stdout, stderr) => {
  alert(`node sharpImages.js --k `+imageFolderName);
  if (error) {
    console.error(`exec error: ${error}`);
    alert(`${error}`);
   // return;
//    sleep(10000);
//    //now, make the video
//    alert("now images converting to video");
// var videoFolder=videoDownloadFullPath+"/"+document.getElementsByClassName('ImageKeyword')[0].value+'/output/output1';
// const l_makevideo=exec(`ffmpeg -framerate 1/1 -i `+`${videoFolder}`+`/img_%d.jpg -c:v libx264 -vf fps=25 -pix_fmt yuv420p `+`${videoFolder}`+`/output.mp4`, (error, stdout, stderr) => {
 
//   if (error) {
//     console.error(`exec error: ${error}`);
//     percentage.innerText = error;
//     alert(`${error}`);
//     return;
//   }

//   l_makevideo.stdout.on('data', data => {
//     percentage.innerText = data;

//     console.log(`stdout: ${data}`);
//   });
//   l_makevideo.stdio.on('data', data => {
//     percentage.innerText = data;

//     console.log(`stdio: ${data}`);
//   });
//   l_makevideo.stderr.on('data', data => {
//     percentage.innerText = data;

//     console.log(`stderr: ${data}`);
//   });

//    alert(`${stdout}`);
//    alert(`${stderr}`);
//   console.log(`stdout: ${stdout}`);
//   console.error(`stderr: ${stderr}`);
// })

// //end make the video


  }

  l_resize.stdout.on('data', data => {
    percentage.innerText = data;

    console.log(`stdout: ${data}`);
  });
  l_resize.stdio.on('data', data => {
    percentage.innerText = data;

    console.log(`stdio: ${data}`);
  });
  l_resize.stderr.on('data', data => {
    percentage.innerText = data;

    console.log(`stderr: ${data}`);
  });

   alert(`${stdout}`);
   alert(`${stderr}`);
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);

alert('resize images completed');


})


}

ImagesGenVideo.onclick=function()
{

     //sleep(10000);
   //now, make the video
 
var videoFolder=videoDownloadFullPath+"/"+document.getElementsByClassName('ImageKeyword')[0].value+'/output/output1';
alert(`${videoFolder}`+`/output.mp4`);
const l_makevideo=exec(`ffmpeg -framerate 1/1 -i `+`${videoFolder}`+`/img_%d.jpg -c:v libx264 -vf fps=25 -pix_fmt yuv420p `+`${videoFolder}`+`/output.mp4`, (error, stdout, stderr) => {
 
  if (error) {
    console.error(`exec error: ${error}`);
    percentage.innerText = error;
    alert(`${error}`);
    return;
  }

  l_makevideo.stdout.on('data', data => {
    percentage.innerText = data;

    console.log(`stdout: ${data}`);
  });
  l_makevideo.stdio.on('data', data => {
    percentage.innerText = data;

    console.log(`stdio: ${data}`);
  });
  l_makevideo.stderr.on('data', data => {
    percentage.innerText = data;

    console.log(`stderr: ${data}`);
  });

   alert(`${stdout}`);
   alert(`${stderr}`);
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
})

alert("Video Generated successfully at:"+`${videoFolder}`+`/output.mp4`);
//end make the video

}


RefreshNode.onclick=function(){

  const l_killnode=exec(`taskkill /f /im node.exe`, (error, stdout, stderr) => {
   // alert(`C:/ffmpeg/bin/ffmpeg.exe  -i `+`${videoDownloadFullPath}`+'/'+`${latestFileName}`+' -i '+`${waterinkLogo}`+' -filter_complex "[1][0]scale2ref=w=oh*mdar:h=ih*0.1[logo][video];[video][logo]overlay=W-w-5:H-h-5" -c:a copy '+`${videoDownloadFullPath}/W_`+`${latestFileName}`);
    if (error) {
      console.error(`exec error: ${error}`);
      alert(`${error}`);
      return;
    }
  
    l_killnode.stdout.on('data', data => {
      percentage.innerText = data;
  
      console.log(`stdout: ${data}`);
    });
    l_killnode.stdio.on('data', data => {
      percentage.innerText = data;
  
      console.log(`stdio: ${data}`);
    });
    l_killnode.stderr.on('data', data => {
      percentage.innerText = data;
  
      console.log(`stderr: ${data}`);
    });
  
     alert(`${stdout}`);
     alert(`${stderr}`);
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });


}


async function getMetadata() {
  try {
    const metadata = await sharp("C:/work/git/videodownloader_james/download/test/img1.jpg").metadata();
    console.log(metadata);
  } catch (error) {
    console.log(`An error occurred during processing: ${error}`);
  }
}

//getMetadata();

async function resizeImage() {
  try {
    await sharp("C:/work/git/videodownloader_james/download/test/img1.jpg")
      .resize({
        width: 150,
        height: 97
      })
      .toFile("sammy-resized.png");
  } catch (error) {
    console.log(error);
  }
}

//resizeImage();


Images2Video.onclick=function()
{
  alert("resize image");
  //window.open('https://github.com', '_blank', 'top=500,left=200,frame=false,nodeIntegration=no');
  // renderer process (mainWindow)
const childWindow = window.open('', 'modal')
childWindow.loadFile('index.html');
  
};

function youtubeDlInfoAsync(url, options) {
  return new Promise(function (resolve, reject) {
    youtubedl.getInfo(url, options, function (err, data) {
      if (err !== null) reject(err);
      else resolve(data);
    });
  });
}

async function populateTitle() {

  // get save as title div
  var saveAsTitle = document.getElementsByClassName('saveAsTitle')[0];
  // get text from youtube url div value
  let text = document.getElementsByClassName('youtubeUrl')[0].value;

  const isBrighteonDownload = text.match('brighteon');

  let options;
  if (isBrighteonDownload) {
    //options = ['-f bestvideo'];
    options = ['-f worstvideo'];


  } else {
    //options = ['-j', '--flat-playlist', '--dump-single-json'];
    options = ['-f worstvideo'];

  }

  const info = await youtubeDlInfoAsync(text, options);

  // if its a playlist or channel
  if (info.length > 2) {
    console.log(info);

    const playlistinfo = info[info.length - 1];

    const uploader = playlistinfo.uploader;
    const amountOfUploads = playlistinfo.entries.length;

    console.log(uploader, amountOfUploads);

    downloadPlaylistText.innerHTML = `${amountOfUploads} Item Playlist or Channel To Be Downloaded`;
    playlistDownloadingDiv.style.display = '';
    titleDiv.style.display = 'none';

    selectVideoDirectoryInput.value =
      selectVideoDirectoryInput.value + '/' + uploader;

    console.log('an array');
  } else if (info.length == 2) {

    // TODO: trim here

    const trimmedTitle = info[0].title.substring(0, 200);

    saveAsTitle.value = trimmedTitle;

    playlistDownloadingDiv.style.display = 'none';
    titleDiv.style.display = '';

    playlistDownloadingDiv.style.display = 'none';
    titleDiv.style.display = '';

    console.log('single item');
  } else if (info && info.title) {

    const trimmedTitle = info.title.substring(0, 200);

    // TODO: trim here
    saveAsTitle.value = trimmedTitle;

    playlistDownloadingDiv.style.display = 'none';
    titleDiv.style.display = '';

    console.log('single item');
  } else {
    console.log('ERROR');
  }

  console.log(info);
}

document.getElementsByClassName('youtubeUrl')[0].onblur = async function () {
  await populateTitle();
};

// frontend code
function myFunction() {
  /** WHEN PASTED **/

  // get the copied text off the clipboard
  navigator.clipboard
    .readText()
    .then(async text => {

      // update frontend to reflect text from clipboard
      document.getElementsByClassName('youtubeUrl')[0].value = text;

      //
      await populateTitle();
    })
    .catch(err => {
      console.log(err);
    });
}

/** SELECT DIRECTORY **/

const saveToDirectory = dir;

selectVideoDirectoryInput.value = saveToDirectory;

const selectVideoDirectoryButton = document.getElementsByClassName(
  'selectVideoDirectory'
)[0];

const selectVideoDirectory = (selectVideoDirectoryButton.onclick = function () {
  // get path from electron and load it as selectedPath
  var selectedPath = dialog.showOpenDialog({
    defaultPath: './videos',
    properties: ['openDirectory']
  });

  console.log(selectedPath[0]);

  // test if it's a shorter url because its within contained
  var newThing = selectedPath[0].split(__dirname)[1];

  let adjustedUrlWithCurrentDirectory;
  if (newThing) {
    adjustedUrlWithCurrentDirectory = `.${newThing}`;
  } else {
    adjustedUrlWithCurrentDirectory = selectedPath[0];
  }
  console.log(newThing);

  // console.log(newThing);

  selectVideoDirectoryInput.value = adjustedUrlWithCurrentDirectory;

  if (!fs.existsSync(adjustedUrlWithCurrentDirectory)) {
    fs.mkdirSync(adjustedUrlWithCurrentDirectory);
  }

});

// remove youtubedl from pathname to give containing folder
const youtubeBinaryContainingFolder = youtubeBinaryFilePath.substr(0, youtubeBinaryFilePath.lastIndexOf("\/"));

console.log(`youtubeBinaryContainingFolder: ${youtubeBinaryContainingFolder}`);

// update binary on boot
downloader(youtubeBinaryContainingFolder, function error(err, done) {
  if (err) { return console.log(err.stack); }
  console.log(done);
});


//images to video



const promises = [];

promises.push(
  sharpStream
    .clone()
    .jpeg({ quality: 100 })
    .toFile("originalFile.jpg")
);

promises.push(
  sharpStream
    .clone()
    .resize({ width: 500 })
    .jpeg({ quality: 80 })
    .toFile("optimized-500.jpg")
);

promises.push(
  sharpStream
    .clone()
    .resize({ width: 500 })
    .webp({ quality: 80 })
    .toFile("optimized-500.webp")
);

// https://github.com/sindresorhus/got#gotstreamurl-options
got.stream("https://media.istockphoto.com/photos/happy-thanksgiving-day-greeting-text-with-pumpkins-squash-and-leaves-picture-id1181113921?s=612x612").pipe(sharpStream);
alert("download image");
Promise.all(promises)
  .then(res => { console.log("Done!", res); })
  .catch(err => {
    console.error("Error processing files, let's clean it up", err);
    try {
      fs.unlinkSync("originalFile.jpg");
      fs.unlinkSync("optimized-500.jpg");
      fs.unlinkSync("optimized-500.webp");
    } catch (e) {}
  });

//end images to video