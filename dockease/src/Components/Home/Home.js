import React, { useState,useRef } from 'react';
import { Link } from 'react-router-dom'
import './Home.css';
// import ReactDOM from 'react-dom';
// import { createRoot } from 'react-dom/client';

import TerminalComponent from '../TerminalComponent/TerminalComponent';

function Home() {
  const [pulledImages, setPulledImages] = useState('');
  const [cpullos_image, setcpullos_image] = useState('');
  const [imageData, setImageData] = useState('');
  const [c_name, setc_name] = useState('');
  const [c_image, setc_image] = useState('');
  const [containerId, setContainerId] = useState('');
  const [show_container, setContainer] = useState([]); // Change to an array
  const [dcontainer, setdContainer] = useState('');
  const [deleteContainer, setdeleteContainer] = useState('');
  const [alldeleteContainer, setalldeleteContainer] = useState('');
  const [cmd, setCommand] = useState('');
  const newWindowRef = useRef(null);
  const [connectContainerId, setConnectContainerId] = useState(null);

  const allpulledimages = () => {
    fetch('http://localhost:3001/allpulledimages')
      .then((response) => response.text())
      .then((data) => {
        setPulledImages(data);
        
      })
      .catch((err) => {
        console.error('Error fetching images:', err);
      });


  };

  const clearpulledimages = () => {
    setPulledImages('');
  };

  const cpullos = () => {
    fetch(`http://localhost:3001/cpullos?cpullos=${cpullos_image}`)
      .then((response) => response.text())
      .then((data) => {
        setImageData(data);
      })
      .catch((err) => {
        console.error('Error fetching image pull output:', err);
      });
  };

  const clear2 = () => {
    setImageData(" ");
  };

  const run = () => {
    fetch(`http://localhost:3001/run?c_name=${c_name}&c_image=${c_image}`)
      .then(response => response.text())
      .then(data => setContainerId(data))
      .catch(err => console.error('Error running container:', err));
  };

  const cps = () => {
    fetch(`http://localhost:3001/ps`)
      .then((response) => response.json()) // Ensure the response is JSON
      .then((data) => {
        console.log('Fetched containers:', data); // Debug log
        setContainer(data); // Set the container data from response
      })
      .catch((err) => {
        console.error('Error fetching containers:', err);
      });
  };

  const del = () => {
    fetch(`http://localhost:3001/del?dcontainer=${dcontainer}`)
      .then((response) => response.text())
      .then((data) => {
        setdeleteContainer(data);
      })
      .catch((err) => {
        console.error('Error deleting container:', err);
      });
  };

  const deleteall = () => {
    fetch(`http://localhost:3001/deleteall`)
      .then((response) => response.text())
      .then((data) => {
        setalldeleteContainer(data);
      })
      .catch((err) => {
        console.error('Error deleting all containers:', err);
      });
  };

  const sendCommand = () => {
    const command = document.getElementById('eterminal-input').value;
    fetch(`http://localhost:3001/comman?cmd=${command}`)
      .then(response => response.text())
      .then(data => setCommand(data))
      .catch(err => console.error('Error executing command:', err));
  };

  

  return (
    <div>
      <div className="headtitle">
        <h1 id="title">DOCKEASE</h1>
      </div>
      <br />

      <div className="container p-6">
        <div className="card border-primary p-6">
          <div>
            <button onClick={allpulledimages} className="btn btn-primary m-1">Pulled Images</button>
            <button onClick={clearpulledimages} className="btn btn-secondary m-1">Close</button>

            <div className="form-floating">
              <textarea
                className="form-control textarea"
                id="allpulledimages"
                placeholder="Pulled images will be shown here"
                value={pulledImages}
                readOnly
              />
              <label htmlFor="floatingTextarea2"></label>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-md-6 col-12">
            <div className="mb-5 card border-primary p-3">
              <div className="mb-3">
                <label className="form-label">Enter Image Name:</label>
                <input type="text" id="cpullos" className="form-control" onChange={(e) => setcpullos_image(e.target.value)} />
              </div>
              <div>
                <button onClick={cpullos} className="btn btn-primary">Pull Image</button>
                <button onClick={clear2} className="btn btn-secondary">Clear</button>
              </div>
              <pre id="cpullosoutput">{imageData}</pre>
            </div>

            <div className="mb-5 card border-primary p-3">
              <div className="mb-3">
                <label className="form-label">Name:</label>
                <input type="text" id="cname" className="form-control" onChange={(e) => setc_name(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label">Image Name:</label>
                <input type="text" id="cimage" className="form-control" onChange={(e) => setc_image(e.target.value)} />
              </div>
              <button onClick={run} className="btn btn-primary">Launch Container</button>
              <div className="my-3">
                <label className="form-label">Container Id:</label>
                <input type="text" id="containerid" className="form-control" value={containerId} readOnly />
              </div>
            </div>

            <div className="mb-5 card border-primary p-3" style={{width:"500px"}}>
              <div className="form-floating">
                <ul className="list-group" style={{ height: "100px",overflowY: "scroll" }}>
                  {show_container.length > 0 ? (
                    show_container.map((container, index) => (
                      <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{container.Names}</strong> {/* Container Name */}
                          <div>ID: {container.ID}</div> {/* Container ID */}
                          <div>Image: {container.Image}</div> {/* Image Name */}
                        </div>
                        {/* <button 
                          className="btn btn-secondary" 
                          onClick={() => connect(container.ID)} // Fixed the connect action here
                        >
                          Connect
                        </button> */}

<button className="btn btn-secondary" ><Link className="my-2" to={`${container.ID}`}>Connect</Link><br /></button>
                      </li>
                    ))
                  ) : (
                    <li className="list-group-item">No containers found</li>
                  )}
                </ul>
                <label htmlFor="floatingTextarea2"></label>
              </div>
              <button onClick={cps} className="btn btn-primary my-2">Show Containers</button>
            </div>
          </div>

          <div className="col-md-6 col-12">
            <div className="mb-5 card border-primary p-3">
              <div className="mb-3">
                <label className="form-label">Enter Container Name:</label>
                <input type="text" id="cdname" className="form-control" onChange={(e) => setdContainer(e.target.value)} />
              </div>
              <button onClick={del} className="btn btn-danger">Stop Container</button>
              <div id="del" value={deleteContainer}></div>
            </div>

            <div className="mb-5 card border-danger p-3">
              <div className="mb-3">
                <label className="form-label">Enter Image Name:</label>
                <input type="text" id="cidelete" className="form-control border-danger" />
              </div>
              <div>
                <button onClick={deleteall} className="btn btn-danger">Delete All Images</button>
              </div>
              <div id="cido" value={alldeleteContainer}></div>
            </div>

            <div className="card text-white bg-dark text-center mb-3">
              <div className="card-header">Terminal</div>
              <div className="card-body">
                <h5 className="card-title">Execute Command</h5>
                <input type="text" id="eterminal-input" className="form-control" placeholder="Enter command" />
                <button onClick={sendCommand} className="btn btn-primary">Send Command</button>
                <pre>{cmd}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
      {connectContainerId && (
        <div className="card text-white bg-dark text-center mb-3">
          <div className="card-header">Connected Terminal for Container {connectContainerId}</div>
          <TerminalComponent containerId={connectContainerId} />
        </div>
      )}
    </div>
  );
}

export default Home;
