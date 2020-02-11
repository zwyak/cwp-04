// server.js
const net = require('net');
const stream = require('stream');
const fs = require('fs');
const path = require('path');

const port = 8124;
const firstRequestStr = 'REMOTE';
const successReq = 'ASC';
const failedReq = 'DEC';
const copyReq = 'COPY';
const encodeReq = 'ENCODE';

let seed = 3106;

const server = net.createServer((client) => {
  console.log('Client connected');

  client.setEncoding('utf8');
  client.ID = Date.now() + seed++;
  client.RequestNumber = 0;

  client.on('data', (data) => {
    client.RequestNumber = client.RequestNumber + 1;
    let params = data.split(' ');

    if ( (params[0] == firstRequestStr) && (client.RequestNumber == 1) ){
      console.log(data);
      client.write(successReq);
    }else if ( (params[0] != firstRequestStr) && (client.RequestNumber == 1) ){
      console.log(data);
      client.write(failedReq);
      client.destroy();
    }else if ( (params[0] == copyReq) && (client.RequestNumber > 1) ){
      console.log(data);
      copyFile(params[1], params[2], `${Date.now()}.dat`);
      client.write(copyReq);
    }else if ( (params[0] == encodeReq) && (client.RequestNumber > 1) ){
    console.log(data);
    copyFileEncode(params[1], params[2], `${Date.now()}.dat`, params[3]);
    client.write(encodeReq);
  }
  });

  client.on('end', () => console.log('Client disconnected'));
});

server.listen(port, () => {
  console.log(`Server listening on localhost:${port}`);
});

function copyFile(filename, src, newfilename){
  let readStream = fs.createReadStream(filename);
  let res;

  readStream.on('data', function (chunk) {
    writeFile(src, newfilename, chunk);
  });

  readStream.on('error', function(err) {
    console.log('Failed readFile');
  });
}

function copyFileEncode(filename, src, newfilename, key){
  let readStream = fs.createReadStream(filename);
  let res;

  readStream.on('data', function (chunk) {
    let encode = chunk.toString('base64');
    writeFile(src, newfilename, encode);
  });

  readStream.on('error', function(err) {
    console.log('Failed readFile');
  });
}

function writeFile(src, filename, data){
  let writeStream = fs.createWriteStream( path.join(src, filename) );
  writeStream.write(data);
}
