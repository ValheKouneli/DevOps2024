const express = require('express');
const { $ } = require('zx');
const os = require('os');

// Initialize the express app
const app = express();
const port = process.env.PORT;


const WAIT_TIME = process.env.FE_WAIT_TIME_MS // milliseconds
let timeOfLastResponse = 0;

async function waitIfRequestsTooFrequent() {
  while (1) {
    if (Date.now() - timeOfLastResponse > WAIT_TIME) {
      timeOfLastResponse = Date.now();
      break;
    }
    await new Promise(resolve => setTimeout(resolve, 100)); //wait 100ms to prevent busywaiting
  }
}

// Get IP address
function getIPAddress() {
  const interfaces = os.networkInterfaces();
  for (const iface in interfaces) {
    for (const details of interfaces[iface]) {
      if (details.family === 'IPv4' && !details.internal) {
        return details.address;
      }
    }
  }
  return 'Not found';
}


// Fetch data from another server using curl
async function fetchDataFromServer(url) {
    try {
        const response = await $`curl -s ${url}`;
        return response.stdout;
    } catch (error) {
        return `Error fetching data from ${url}: ${error.message}`;
    }
}

app.get('/info', async (req, res) => {
  try {
    await waitIfRequestsTooFrequent();
    // Get IP Address
    const ipAddress = getIPAddress();

    // Get system uptime
    const uptime = await $`uptime -p`;

    // Run the 'ps aux' command
    const processes = await $`ps aux`;
    
    // Run the 'df' command
    const diskUsage = await $`df`;

    // Combine the output
    const info = `Server IP Address: ${ipAddress}\n`+
      `System Uptime: ${uptime}\n`+
      `\nProcesses (ps aux):\n${processes}\n` +
      `\nDisk Usage (df):\n${diskUsage}`;

  

    const infoFromAnother = await fetchDataFromServer(`http://backend:${process.env.BE_PORT}/info`);
    
    // Compose response
    const result = `Service1\n\n` +
    `${info}` +
    `\n\n\n` +
    `Service2\n\n` +
    `${infoFromAnother}`

    // Send the response
    res.status(200).send({ message: result });

    sleep(10000);
  } catch (error) {
    res.status(400).send({ message:`Error: ${error.message}` });
  }
});

app.get('/stop_all', async (req, res) => {
  try {
    await waitIfRequestsTooFrequent();
    const infoFromAnother = await fetchDataFromServer(`http://backend:${process.env.BE_PORT}/stop-all`);
    
    // Send the response
    res.status(200).send({ message: infoFromAnother });

    sleep(10000);
  } catch (error) {
    res.status(400).send({ message:`Error: ${error.message}` });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});