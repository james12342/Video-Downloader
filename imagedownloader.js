var fs = require('fs'),
    request = require('request');

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

download('https://cdn.britannica.com/57/90457-050-6AD457F3/iPod-Nano-music-player-size-Apple-Computer.jpg', 'google.png', function(){
  console.log('done');
})