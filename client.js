// client.js
const net = require('net');
const port = 8124;
const firstRequestStr = 'REMOTE';
const successReq = 'ASC';
const failedReq = 'DEC';


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

    }
  }else if ( (data != successReq) && (client.RequestNumber == 1) ){
    console.log(data);
    client.destroy();
  }else{
    
  }
});

client.on('close', function() {
  console.log('Connection closed');
});
