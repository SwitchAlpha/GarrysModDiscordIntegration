const express = require('express')
const app = express()
const server = require('http').createServer(app);
const WebSocket = require('ws');
require('dotenv').config()
const ngrok = require('ngrok');
(async function() {
    await ngrok.authtoken(process.env.NGROK);
    const url = await ngrok.connect();
    console.log(url);
})();

const wss = new WebSocket.Server({ server:server });

wss.on('connection', function connection(ws) {
  console.log('Client connected');
  ws.send('You have successfully connected to the server');

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });


    if(message == "test"){
        console.log("OK");
        ws.send('OK');
    }
    
    
  });
});

app.get('/', (req, res) => res.send('Waiting for response'));

server.listen(80, () => console.log(`Lisening on port :80`))
