import express from "express";

const app = express();

app.get('/', function (req, res) {
    res.send('TODO');
});

app.listen(3000, function () {
    console.log('App1 listening on port 3000!');
});