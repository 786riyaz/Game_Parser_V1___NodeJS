const cheerio = require("cheerio");

function clean(text = "") {
    return text
        .replace(/\s+/g, " ")
        .replace(/&#8211;/g, "–")
        .trim();
}

function parseGame(html, url) {

    const $ = cheerio.load(html);

    const result = {
        url,
        gameName: "",
        company: "",
        originalSize: "",
        repackSize: "",
        downloadMirror: ""
    };

    //-------------------------
    // GAME NAME
    //-------------------------

    const h3 = $(".entry-content h3 strong").first().text();

    if (h3) {

        result.gameName = clean(
            h3
                .replace(/GOG\/Steam.*/i, "")
                .replace(/Steam.*/i, "")
                .replace(/\+.*$/i, "")
        );
    }

    //-------------------------
    // DETAILS
    //-------------------------

    $(".entry-content p").each((i, p) => {

        const html = $(p).html();

        if (!html) return;

        const company = html.match(/Company:\s*<strong>(.*?)<\/strong>/i);

        if (company)
            result.company = clean(company[1]);

        const original = html.match(/Original Size:\s*<strong>(.*?)<\/strong>/i);

        if (original)
            result.originalSize = clean(original[1]);

        const repack = html.match(/Repack Size:\s*<strong>(.*?)<\/strong>(.*?)(<br|<\/p|$)/i);

        if (repack)
            result.repackSize = clean(repack[1] + " " + repack[2]);
    });

    //-------------------------
    // DOWNLOAD MIRROR
    //-------------------------

    let found = false;

    $(".entry-content a").each((i, a) => {

        const href = $(a).attr("href");

        if (!href) return;

        if (
            href.includes("1337x") ||
            href.includes("rutor") ||
            href.includes("magnet:") ||
            href.includes("torrent")
        ) {
            result.downloadMirror = href;
            found = true;
            return false;
        }
    });

    return result;
}

module.exports = parseGame;