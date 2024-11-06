const express = require('express');
const { $ } = require('zx');
const os = require('os');

// Initialize the express app
const app = express();
const port = process.env.PORT;

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

    const infoFromAnother = await fetchDataFromServer(`http://backend:${process.env.SERVER_PORT}`);
    
    // Send the response
    res.json({ message: infoFromAnother, status: 'success' });
  } catch (error) {
    res.json({ message:`Error: ${error.message}`, status: 'failure' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});