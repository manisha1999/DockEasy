const express = require('express');
const app = express();
const http = require('http');
const { spawn } = require('child_process'); // Use spawn for interactive session
const WebSocket = require('ws');
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const imageRoute = require('./routes/DockerImage');
app.use(imageRoute);
// wss.on('connection', (ws) => {
//   ws.on('message', (message) => {
//     const { containerId, cmd } = JSON.parse(message);

//     // Spawn a Docker exec command for the specified container and command
//     const dockerExec = spawn('docker', ['exec', '-i', containerId, 'sh', '-c', cmd], {
//       shell: true,
//     });

//     // Forward the output of the Docker command to the WebSocket client
//     dockerExec.stdout.on('data', (data) => {
//       if (ws.readyState === WebSocket.OPEN) {
//         ws.send(JSON.stringify({ output: data.toString() }));
//       }
//     });

//     // Handle errors and send them to the WebSocket client
//     dockerExec.stderr.on('data', (data) => {
//       if (ws.readyState === WebSocket.OPEN) {
//         ws.send(JSON.stringify({ error: data.toString() }));
//       }
//     });

//     // Notify when the command has exited
//     dockerExec.on('close', (code) => {
//       if (ws.readyState === WebSocket.OPEN) {
//         ws.send(JSON.stringify({ message: `Process exited with code ${code}` }));
//         ws.close();
//       }
//     });

//     // Close the Docker process if WebSocket disconnects
//     ws.on('close', () => {
//       dockerExec.kill();
//     });
//   });
// });
wss.on('connection', (ws) => {
  console.log('New WebSocket connection established.');

  ws.on('message', (message) => {
    const { containerId, cmd } = JSON.parse(message);

    // Spawn a Docker exec command for interactive terminal (bash shell)
    const dockerExec = spawn('docker', ['exec', '-i', containerId, cmd], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    // Forward input from WebSocket to Docker process
    ws.on('message', (data) => {
      if (dockerExec.stdin.writable) {
        dockerExec.stdin.write(data);
      }
    });

    // Forward output from Docker process to WebSocket
    dockerExec.stdout.on('data', (data) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ output: data.toString() }));
      }
    });

    dockerExec.stderr.on('data', (data) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ error: data.toString() }));
      }
    });

    dockerExec.on('close', (code) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ message: `Process exited with code ${code}` }));
        ws.close();
      }
    });

    // Cleanup when WebSocket disconnects
    ws.on('close', () => {
      dockerExec.kill();
    });
  });

  // Handle WebSocket connection closure
  ws.on('close', () => {
    console.log('WebSocket connection closed.');
  });

  // Handle WebSocket errors
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

server.listen(3001, () => {
  console.log('Server running on port 3001');
});