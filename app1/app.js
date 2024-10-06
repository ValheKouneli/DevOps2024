const express = require('express');
const { $ } = require('zx');
const os = require('os');

// Initialize the express app
const app = express();
const port = 3000;

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

// Handle the root request
app.get('/', async (req, res) => {
  try {
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
      `Processes (ps aux):\n${processes}\n\n` +
      `Disk Usage (df -h):\n${diskUsage}`;

    const infoFromAnother = await fetchDataFromServer("http://backend:8080");

    // Wrap the result in pre tags and sanitize innards
    const result = `${info}\n\n\n${infoFromAnother}`
    
    // Send the response
    res.send(result);
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});