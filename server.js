const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());
app.use(express.static("public"));

app.post("/save", (req, res) => {

    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    const entry = {
        time: new Date().toLocaleString(),
        ip: ip,
        latitude: req.body.location.latitude,
        longitude: req.body.location.longitude,
        timezone: req.body.timezone,
        device: req.body.device
    };

    let existing = [];

    if (fs.existsSync("data.json")) {
        existing = JSON.parse(fs.readFileSync("data.json"));
    }

    existing.push(entry);
    fs.writeFileSync("data.json", JSON.stringify(existing, null, 2));

    console.log("NEW VISITOR");
    console.log("Time:", entry.time);
    console.log("IP:", entry.ip);
    console.log("Latitude:", entry.latitude);
    console.log("Longitude:", entry.longitude);
    console.log("Timezone:", entry.timezone);
    console.log("Device:", entry.device);
    console.log("---------------------------");

    res.send("Saved");
});


app.get("/data", (req, res) => {

    if (!fs.existsSync("data.json")) {
        return res.send("No data yet.");
    }

    const data = JSON.parse(fs.readFileSync("data.json"));

    let output = "";

    data.forEach(entry => {
        output += `
NEW VISITOR
Time: ${entry.time}
IP: ${entry.ip}
Latitude: ${entry.latitude}
Longitude: ${entry.longitude}
Timezone: ${entry.timezone}
Device: ${entry.device}
---------------------------

`;
    });

    res.type("text/plain");
    res.send(output);
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server running");
});
