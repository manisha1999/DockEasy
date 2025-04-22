import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FitAddon } from 'xterm-addon-fit';
import { AttachAddon } from 'xterm-addon-attach';
import { useXTerm } from 'react-xtermjs';
import 'xterm/css/xterm.css';

const TerminalComponent = () => {
  const { containerId } = useParams();
  const { instance, ref } = useXTerm();
  const fitAddon = new FitAddon();

  useEffect(() => {
    if (instance) {
      instance.loadAddon(fitAddon);
      fitAddon.fit();

      const socket = new WebSocket(`ws://localhost:3001`);

      socket.onopen = () => {
        console.log('WebSocket connection established');
        socket.send(JSON.stringify({ containerId, cmd: '/bin/bash' }));
      };

      const attachAddon = new AttachAddon(socket);
      instance.loadAddon(attachAddon);

      socket.onmessage = (event) => {
        console.log('Received:', event.data);
      
        try {
          const message = JSON.parse(event.data);
          if (message.output) {
            instance.write(message.output);
          } else if (message.error) {
            instance.write(`\x1B[31m${message.error}\x1B[0m`);
          } else if (message.message) {
            instance.write(`${message.message}\n`);
          }
        } catch (error) {
          console.error('Invalid JSON received:', event.data);
        }
      };

      let command = '';

      instance.onData((data) => {
        command += data; // Accumulate input data into the command variable

        // Check if Enter key is pressed (line feed or carriage return)
        if (data === '\r' || data === '\n') {
          instance.write(`${command}\n`); // Write the full command to the terminal
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(command); // Send the full command to the WebSocket server
          }
          command = ''; // Reset the command after sending
        }
      });
      instance.writeln('Welcome to the Docker container terminal!');
      instance.writeln(`Connected to container: ${containerId}`);

      window.addEventListener('resize', () => fitAddon.fit());

      return () => {
        socket.close();
        window.removeEventListener('resize', () => fitAddon.fit());
      };
    }
  }, [instance, containerId]);

  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
        color: 'white',
      }}
    />
  );
};

export default TerminalComponent;
