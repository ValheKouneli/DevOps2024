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


// Fetch data from another server using curl
async function fetchDataFromServer(url) {
    try {
        const response = await $`curl -s ${url}`;
        return response.stdout;
    } catch (error) {
        return `Error fetching data from ${url}: ${error.message}`;
    }
}

// Display index page
app.get('/', async (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


app.get('/make_request', async (req, res) => {
  try {
    await waitIfRequestsTooFrequent();
    const infoFromAnother = await fetchDataFromServer(`http://backend:${process.env.BE_PORT}`);
    
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