const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/downloads", express.static(path.join(__dirname, "downloads")));

const historyFile = "database/history.json";

if (!fs.existsSync("downloads")) fs.mkdirSync("downloads");
if (!fs.existsSync("database")) fs.mkdirSync("database");
if (!fs.existsSync(historyFile)) fs.writeFileSync(historyFile, "[]");

app.post("/download", async (req, res) => {

    const url = req.body.url;

    if (!url) {
        return res.status(400).json({
            success: false,
            error: "Video URL required"
        });
    }

    const id = Date.now();
    const output = `downloads/${id}.mp4`;

    const command = `yt-dlp -f mp4 -o "${output}" "${url}"`;

    exec(command, (error) => {

        if (error) {
            return res.status(500).json({
                success: false,
                error: "Download failed"
            });
        }

        let history = JSON.parse(fs.readFileSync(historyFile));

        history.unshift({
            id,
            url,
            file: output,
            time: new Date()
        });

        fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));

        return res.json({
            success: true,
            file: output
        });

    });

});

app.get("/history", (req, res) => {

    const history = JSON.parse(fs.readFileSync(historyFile));

    res.json(history);

});

app.listen(PORT, () => {
    console.log(`NovaDL AI Running On Port ${PORT}`);
});