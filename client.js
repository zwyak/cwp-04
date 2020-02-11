// client.js
const net = require('net');
const stream = require('stream');
const fs = require('fs');
const crypto = require('crypto');

const port = 8124;
const firstRequestStr = 'REMOTE';
const successReq = 'ASC';
const failedReq = 'DEC';
const copyReq = 'COPY';

const originalAddr = process.argv[2];
const copyAddr = process.argv[3];

const client = new net.Socket();

client.setEncoding('utf8');

client.connect(port, function() {
  console.log('Connected');
  client.RequestNumber = 0;
  client.write(firstRequestStr);
});

client.on('data', function(data) {
  client.RequestNumber = client.RequestNumber + 1;
  if ( (data == successReq) && (client.RequestNumber == 1) ){
    if (fs.existsSync(originalAddr) && fs.existsSync(copyAddr)){
      console.log(data);
      client.write(`COPY ${originalAddr} ${copyAddr}`);
    }
  }else if ( (data != successReq) && (client.RequestNumber == 1) ){
    console.log(data);
    client.destroy();
  }else if ( (data == copyReq) && (client.RequestNumber > 1) ){
    console.log(data);
  }
});

client.on('close', function() {
  console.log('Connection closed');
});
