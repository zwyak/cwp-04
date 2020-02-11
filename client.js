// client.js
const net = require('net');
const port = 8124;

const client = new net.Socket();

client.setEncoding('utf8');

client.connect(port, function() {
  console.log('Connected');
  client.write('\r\nHello, Server!\r\nLove,\r\nClient.\r\n');
});

client.on('data', function(data) {
  console.log(data);
  client.destroy();
});

client.on('close', function() {
  console.log('Connection closed');
});
