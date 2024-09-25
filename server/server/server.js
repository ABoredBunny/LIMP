const express = require('express');
const path = require('path');
const WebSocket = require('ws');

const app = express();
const port = 3000;

let socket;
let id = 1;
let VIB = 0;
let PAT = 0;
let readyToSendCommands = false;
let ip = '';

function startServer() {
    // Serve static files from the 'public' directory
    app.use(express.static(path.join(__dirname, '../public')));

    // Serve the index.html file at the root URL
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    });

    // Start the HTTP server
    const server = app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });

    // Set up WebSocket server
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        ws.on('message', (message) => {
            try {
                const parsedMessage = JSON.parse(message);
                console.log('Received:', parsedMessage);

                // Handle different types of messages here
                if (parsedMessage[0]?.RequestServerInfo) {
                    ws.send(JSON.stringify([{ "ServerInfo": { "Id": parsedMessage[0].RequestServerInfo.Id, "MessageVersion": 3, "MaxPingTime": 0, "ServerName": "Intiface Server" } }]));
                } else if (parsedMessage[0]?.RequestDeviceList) {
                    ws.send(JSON.stringify([{ "DeviceList": { "Id": parsedMessage[0].RequestDeviceList.Id, "Devices": [{ "DeviceIndex": 0, "DeviceName": "JoyHub Moon Horn", "DeviceDisplayName": "", "DeviceMessages": { "ScalarCmd": [{ "FeatureDescriptor": "", "ActuatorType": "Vibrate", "StepCount": 255 }, { "FeatureDescriptor": "Suction", "ActuatorType": "Constrict", "StepCount": 9 }], "StopDeviceCmd": {} } }] } }]));
                } else if (parsedMessage[0]?.StartScanning) {
                    ws.send(JSON.stringify([{ "Ok": { "Id": parsedMessage[0].StartScanning.Id } }]));
                } else if (parsedMessage[0]?.ScalarCmd) {
                    ws.send(JSON.stringify([{ "Ok": { "Id": parsedMessage[0].ScalarCmd.Id } }]));
                } else if (parsedMessage[0]?.Ping) {
                    ws.send(JSON.stringify([{ "Pong": { "Id": parsedMessage[0].Ping.Id } }]));
                }
            } catch (error) {
                console.log('Non-JSON message received:', message);
            }
        });

        ws.send(JSON.stringify({ message: 'Welcome to the WebSocket server!' }));
    });
}

function connect() {
    if (!ip) {
        console.log('IP address is not set.');
        return;
    }
    console.log('Connecting to:', ip);
    socket = new WebSocket(ip);

    socket.onopen = function() {
        console.log('Connected to ' + ip);
        sendRequestServerInfo();
    };

    socket.onmessage = function(event) {
        try {
            const message = JSON.parse(event.data);
            console.log('Received:', message);

            if (message[0]?.ServerInfo) {
                sendRequestDeviceList();
            } else if (message[0]?.DeviceList) {
                sendStartScanning();
            } else if (message[0]?.Ok) {
                if (message[0].Ok.Id === 3) {
                    readyToSendCommands = true;
                    console.log('Ready to send structured commands');
                }
            } else if (message[0]?.Ping) {
                sendPong();
            }

            // Check for "Moon Horn" in the message
            if (JSON.stringify(message).includes("Moon Horn")) {
                readyToSendCommands = true;
                console.log('Ready to send structured commands');
            }
        } catch (error) {
            console.log('Non-JSON message received:', event.data);
        }
    };

    socket.onclose = function() {
        console.log('Disconnected');
    };

    socket.onerror = function(error) {
        console.log('Error:', error.message);
    };
}

function sendRequestServerInfo() {
    const message = [{ "RequestServerInfo": { "Id": id++, "ClientName": "Moonhorn", "MessageVersion": 3 } }];
    socket.send(JSON.stringify(message));
    console.log('Sent:', message);
}

function sendRequestDeviceList() {
    const message = [{ "RequestDeviceList": { "Id": id++ } }];
    socket.send(JSON.stringify(message));
    console.log('Sent:', message);
}

function sendStartScanning() {
    const message = [{ "StartScanning": { "Id": id++ } }];
    socket.send(JSON.stringify(message));
    console.log('Sent:', message);
}

function sendScalarCmd() {
    if (socket && socket.readyState === WebSocket.OPEN) {
        const message = [{
            "ScalarCmd": {
                "Id": id++,
                "DeviceIndex": 0,
                "Scalars": [
                    { "Index": 0, "Scalar": VIB, "ActuatorType": "Vibrate" },
                    { "Index": 1, "Scalar": PAT, "ActuatorType": "Constrict" }
                ]
            }
        }];
        socket.send(JSON.stringify(message));
        console.log('Sent:', message);
    } else {
        console.log('WebSocket is not open. ReadyState:', socket ? socket.readyState : 'N/A');
    }
}

function sendPong() {
    const message = [{ "Pong": { "Id": id++ } }];
    socket.send(JSON.stringify(message));
    console.log('Sent:', message);
}

function setIP(newIP) {
    ip = newIP;
    console.log(`IP set to ${ip}`);
    connect();
}

function setVIB(value) {
    VIB = parseFloat(value);
    console.log(`VIB set to ${VIB}`);
    if (readyToSendCommands) {
        sendScalarCmd();
    }
}

function setPAT(value) {
    PAT = parseFloat(value);
    console.log(`PAT set to ${PAT}`);
    if (readyToSendCommands) {
        sendScalarCmd();
    }
}

module.exports = {
    startServer,
    setIP,
    setVIB,
    setPAT
};
