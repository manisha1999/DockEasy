const express = require('express');
const { exec } = require('child_process');

const router = express.Router();

router.get('/allpulledimages', (req, res) => {
  exec('docker images', (err, stdout) => {
    if (err) return res.status(500).send(`Error fetching images: ${err}`);
    res.send(stdout);
  });
  console.log(res)
});

router.get('/cpullos', (req, res) => {
  const cpullos = req.query.cpullos;
  if (!cpullos) return res.status(400).send("Image name is required");

  exec(`docker pull ${cpullos}`, (err, stdout) => {
    if (err) return res.status(500).send(`Error pulling image: ${err}`);
    res.send(stdout);
  });
});

router.get('/run', (req, res) => {

  const cname = req.query.c_name;
  const cimage = req.query.c_image;
 
  exec(`docker run -dit --name ${cname} ${cimage}`, (err, stdout) => {
    if (err) return res.status(500).send(`Error: ${err}`);
    res.send(stdout,cname,cimage);
  });
});

// router.get("/ps", (req, res) => {
//   exec("docker ps | tail -n +2 ", (err, stdout, stderr) => {
//     res.send(stdout);
//   });
// });

router.get('/ps', (req, res) => {
  exec('docker ps --format "{{json .}}"', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${stderr}`);
      return res.status(500).json({ error: 'Failed to fetch containers' });
    }

    // Parse the output into an array of objects
    const containers = stdout.split('\n')
      .filter(line => line) // Filter out empty lines
      .map(line => JSON.parse(line)); // Parse each line as JSON

    res.json(containers); // Return the array of container objects
  });
});

router.get('/del', (req, res) => {
  const cdname = req.query.cdname;
  exec(`docker stop ${cdname}`, (err, stdout) => {
    if (err) return res.status(500).send(`Error stopping container: ${err}`);
    res.send(stdout);
  });
});

router.get('/deleteall', (req, res) => {
  exec('docker rm -f $(docker ps -a -q)', (err, stdout) => {
    if (err) return res.status(500).send(`Error deleting containers: ${err}`);
    res.send(stdout);
  });
});

router.get('/cidelete', (req, res) => {
  const cidelete = req.query.cidelete;
  exec(`docker rmi -f ${cidelete}`, (err, stdout) => {
    if (err) return res.status(500).send(`Error deleting image: ${err}`);
    res.send(stdout);
  });
});

router.get('/comman', (req, res) => {
  const cmd = req.query.cmd;
  console.log(cmd)
  exec(cmd, (err, stdout) => {
    if (err) return res.status(500).send(`Error executing command: ${err}`);
    res.send(stdout);
  });
});



router.post('/docker-login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Run the docker login command
    const loginCommand = `echo ${password} | docker login -u ${username} --password-stdin`;
    
    exec(loginCommand, (error, stdout, stderr) => {
        if (error) {
            console.error("Docker login error:", stderr);
            return res.status(500).json({ message: `Login failed: ${stderr}` });
        }
        console.log("Docker login successful:", stdout);
        res.json({ message: "Docker login successful" });
    });
});

router.post('/connect', (req, res) => {
  const containerId = req.query.id;
  
  // Here you can just acknowledge the connection attempt
  exec(`docker exec -it ${containerId} /bin/sh`, (err, stdout, stderr) => {
    if (err) {
      return res.status(500).send(`Error connecting to container: ${err}`);
    }
    
    // Returning the output or just a success message
    res.send(`Connected to container ${containerId} successfully.`);
  });
});


module.exports = router;
