import express from "express";
import os from "os";
import { $ } from 'zx';

const app = express();

app.get('/', async function (req, res) {
    let info = "";
    info += "<p>uptime: " + os.uptime() + "</p>\n";

    info += "<p>network " + os.networkInterfaces().lo[0].address + "</p>\n";
    const psAuxOutput = await $`ps aux`;

    function encode(e){return e.replace(/[^]/g,function(e){return"&#"+e.charCodeAt(0)+";"})}

    const infoRows = psAuxOutput.toString().split("\n");
    for (const nbr in infoRows) {
        info += "<p>" + encode(infoRows[nbr]) + "</p>\n";
    }
    const dfhOutput = await $`df -h`;
    const infoRows2 = dfhOutput.toString().split("\n");
    for (const nbr in infoRows2) {
        info += "<p>" + encode(infoRows2[nbr]) + "</p>\n";
    }
    res.send(info);
    
});

app.listen(3000, function () {
    console.log('App1 listening on port 3000!');
});