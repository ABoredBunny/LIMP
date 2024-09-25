const WebSocket = require('ws');
const EventEmitter = require('events');

class SpeedEmitter extends EventEmitter {}

const server = require('http').createServer();
const wss = new WebSocket.Server({ server });

const speedEmitter = new SpeedEmitter();

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    try {
      const parsedMessage = JSON.parse(message);
      console.log('Received:', parsedMessage);

      parsedMessage.forEach((msg) => {
        let response;

        switch (Object.keys(msg)[0]) {
          case 'RequestServerInfo':
            response = [{ ServerInfo: { Id: msg.RequestServerInfo.Id, MessageVersion: msg.RequestServerInfo.MessageVersion, MaxPingTime: 0, ServerName: 'Intiface Server' } }];
            break;
          case 'RequestDeviceList':
            response = [{ DeviceList: { Id: msg.RequestDeviceList.Id, Devices: [{ DeviceIndex: 0, DeviceName: 'Nintendo Joycon', DeviceMessages: { VibrateCmd: { FeatureCount: 1, StepCount: [1000] }, StopDeviceCmd: {} } }] } }];
            break;
          case 'StartScanning':
            response = [{ Ok: { Id: msg.StartScanning.Id } }];
            break;
          case 'VibrateCmd':
            const speed = msg.VibrateCmd.Speeds[0].Speed;
            console.log('Speed:', speed);
            speedEmitter.emit('speed', speed);
            response = [{ Ok: { Id: msg.VibrateCmd.Id } }];
            ws.send(JSON.stringify([{ VibrateCmd: { Id: msg.VibrateCmd.Id, Speeds: [{ Index: 0, Speed: speed }] } }]));
            break;
          case 'StopDeviceCmd':
            console.log('StopDeviceCmd received');
            speedEmitter.emit('stop');
            response = [{ Ok: { Id: msg.StopDeviceCmd.Id } }];
            break;
          default:
            response = [{ Error: { Id: msg.Id, Message: 'Unknown command' } }];
        }

        ws.send(JSON.stringify(response));
        console.log('Sent:', JSON.stringify(response));
      });
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  ws.send(JSON.stringify([{ ServerInfo: { Id: 1, MessageVersion: 2, MaxPingTime: 0, ServerName: 'Intiface Server' } }]));
  console.log('Sent initial handshake');
});

server.listen(8080, () => {
  console.log('Server is running on http://localhost:8080');
});

module.exports = speedEmitter;
