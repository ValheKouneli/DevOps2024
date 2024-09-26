const express = require('express');
const { $ } = require('zx');
const os = require('os');

// Initialize the express app
const app = express();
const port = 3000;

// Get system uptime
function getUptime() {
  const uptimeSeconds = os.uptime();
  const uptimeHours = (uptimeSeconds / 3600).toFixed(0);
  const uptimeMinutes = ((uptimeSeconds % 3600) / 60).toFixed(0)
  return `System Uptime: up ${uptimeHours} hours, ${uptimeMinutes} minutes\n`;
}

// Get IP address
function getIPAddress() {
  const interfaces = os.networkInterfaces();
  for (const iface in interfaces) {
    for (const details of interfaces[iface]) {
      if (details.family === 'IPv4' && !details.internal) {
        return `Server IP Address: ${details.address}\n`;
      }
    }
  }
  return 'IP Address: Not found\n';
}

function encode(e){return e.replace(/[^]/g,function(e){return"&#"+e.charCodeAt(0)+";"})}

// Handle the root request
app.get('/', async (req, res) => {
  try {
    // Get IP Address
    const ipAddress = getIPAddress();

    // Get system uptime
    const uptime = getUptime();

    // Run the 'ps aux' command
    const processes = await $`ps aux`;
    
    // Run the 'df -h' command
    const diskUsage = await $`df -h`;

    // Combine the output
    
    const info = `${ipAddress}${uptime}\nProcesses (ps aux):\n${processes}\n\nDisk Usage (df -h):\n${diskUsage}`;

    // Wrap the result in pre tags and sanitize innards

    const result = `<pre style="word-wrap: break-word; white-space: pre-wrap;">${encode(info)}</pre>`
    
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