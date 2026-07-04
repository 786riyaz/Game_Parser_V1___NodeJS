const ExcelJS = require("exceljs");

async function saveExcel(rows) {

    const workbook = new ExcelJS.Workbook();

    const sheet = workbook.addWorksheet("Games");

    sheet.columns = [

        { header: "Game Name", key: "gameName", width: 45 },
        { header: "Company", key: "company", width: 25 },
        { header: "Original Size", key: "originalSize", width: 18 },
        { header: "Repack Size", key: "repackSize", width: 25 },
        { header: "Download Mirror", key: "downloadMirror", width: 80 },
        { header: "URL", key: "url", width: 60 }

    ];

    rows.forEach(r => sheet.addRow(r));

    await workbook.xlsx.writeFile("./output/games.xlsx");

    console.log("Excel saved.");
}

module.exports = saveExcel;