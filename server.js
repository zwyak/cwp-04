// server.js
const net = require('net');
const stream = require('stream');
const port = 8124;
const firstRequestStr = 'REMOTE';
const successReq = 'ASC';
const failedReq = 'DEC';

let seed = 3106;

const server = net.createServer((client) => {
  console.log('Client connected');

  client.setEncoding('utf8');
  client.ID = Date.now() + seed++;
  client.RequestNumber = 0;

  client.on('data', (data) => {
    client.RequestNumber = client.RequestNumber + 1;
    if ( (data == firstRequestStr) && (client.RequestNumber == 1) ){
      console.log(data);
      client.write(successReq);
    }else if ( (data != firstRequestStr) && (client.RequestNumber == 1) ){
      console.log(data);
      client.write(failedReq);
      client.destroy();
    }else{
      console.log(data);
    }
  });

  client.on('end', () => console.log('Client disconnected'));
});

server.listen(port, () => {
  console.log(`Server listening on localhost:${port}`);
});
