var fs = require('fs');
eval(fs.readFileSync('jpegcodec.js').toString());

var j = new JPEG();
j.decode(new Uint8Array(fs.readFileSync('test.jpg')).buffer);
