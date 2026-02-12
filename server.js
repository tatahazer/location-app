const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());
app.use(express.static("public"));

app.post("/save", (req, res) => {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    const data = {
        ip: ip,
        device: req.body.device,
        location: req.body.location,
        time: new Date().toISOString()
    };

    let existing = [];

    if (fs.existsSync("data.json")) {
        existing = JSON.parse(fs.readFileSync("data.json"));
    }

    existing.push(data);
    fs.writeFileSync("data.json", JSON.stringify(existing, null, 2));

    res.send("Saved successfully");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server running");
});
