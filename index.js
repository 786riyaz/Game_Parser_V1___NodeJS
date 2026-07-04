const axios = require("axios");
const fs = require("fs");
const path = require("path");

const parseGame = require("./parser");
const saveExcel = require("./excel");

const URL_FILE = "./urls.txt";

async function fetchHTML(url) {
  const res = await axios.get(url, {
    timeout: 30000,

    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/137 Safari/537.36",
    },
  });

  return res.data;
}

async function main() {
  if (!fs.existsSync("./output")) fs.mkdirSync("./output");

  const urls = fs
    .readFileSync(URL_FILE, "utf8")
    .split(/\r?\n/)
    .map((x) => x.trim())
    .filter(Boolean);

  const games = [];

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];

    console.log(`[${i + 1}/${urls.length}] ${url}`);

    try {
      const html = await fetchHTML(url);
      const game = parseGame(html, url);
      games.push(game);

      console.log("✔", game.gameName);
    } catch (err) {
      console.log("✖ Failed");

      games.push({
        url,
        gameName: "",
        company: "",
        originalSize: "",
        repackSize: "",
        downloadMirror: "",
      });
    }
  }

  await saveExcel(games);

  console.log("Done");
}

main();
