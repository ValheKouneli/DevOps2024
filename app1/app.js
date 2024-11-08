const express = require('express');
const { $ } = require('zx');
const os = require('os');

// Initialize the express app
const app = express();
const PORT = process.env.PORT;
const BE_PORT = process.env.BE_PORT;


const WAIT_TIME = process.env.WAIT_TIME_MS // milliseconds
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


// Send GET request to another server using curl
async function sendGetRequest(url, ) {
  try {
    const response = await $`curl ${method} -s ${url}`;
    return response.stdout;
  } catch (error) {
    return `Error fetching data from ${url}: ${error.message}`;
  }
}

// Send POST request to another server using curl
async function sendPostRequest(url, dataSpecs) {
  try {
    console.log(`JUST ABOUT TO RUN curl -X POST ${dataSpecs} -s ${url}`);
    const response = await $`curl -X POST ${dataSpecs} -s ${url}`;
    console.log(`RESPONSE ${response.stdout}`);
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

  

    const infoFromAnother = await sendGetRequest(`http://service2:${BE_PORT}/info`);
    
    // Compose response
    const result = `Service1\n\n` +
    `${info}` +
    `\n\n\n` +
    `Service2\n\n` +
    `${infoFromAnother}`

    // Send the response
    res.status(200).send({ message: result });
  } catch (error) {
    res.status(400).send({ message:`Error: ${error.message}` });
  }
});

app.post('/stop_all', async (req, res) => {
  try {
    await waitIfRequestsTooFrequent();
    const infoFromAnother = await sendPostRequest(`http://service2:${BE_PORT}/stop-all`, "");
    
    // Send the response
    res.status(200).send({ message: infoFromAnother });

  } catch (error) {
    res.status(400).send({ message:`Error: ${error.message}` });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});