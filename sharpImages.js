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





const axios = require('axios');

/* ============================================================
  Function: Download Image
============================================================ */

const download_image = (url, image_path) =>
  axios({
    url,
    responseType: 'stream',
  }).then(
    response =>
      new Promise((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream(image_path))
          .on('finish', () => resolve())
          .on('error', e => reject(e));
      }),
  );

/* ============================================================
  Download Images in Order
============================================================ */

(async () => {
  let example_image_1 = await download_image('https://www.jingyanpal.com/wp-content/uploads/2020/02/%E6%B3%A2%E5%A4%9A%E9%87%8E%E7%BB%93%E8%A1%A3-Yui-Hatano-quick-intro.jpg', 'C:/work/git/videodownloader_james/download/test/example-1.png');

  console.log(example_image_1.status); // true
  console.log(example_image_1.error); // ''

  let example_image_2 = await download_image('https://www.wgi8.com/uploadfile/article/2019/10/28/360883640970611.png', 'example-2.png');

  console.log(example_image_2.status); // false
  console.log(example_image_2.error); // 'Error: Request failed with status code 404'

  let example_image_3 = await download_image('https://www.wgi8.com/uploadfile/article/2019/10/28/360883653905375.png', 'example-3.png');

  console.log(example_image_3.status); // true
  console.log(example_image_3.error); // ''
})();