// cutoff-backend/excelImportDTE.js
require("dotenv").config();
const mysql = require("mysql2/promise");
const xlsx = require("xlsx");
const path = require("path");

(async function importDTEData() {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: process.env.PASSWORD,
      database: "cutoff_db",
    });

    // Update the file path to your DTE Excel file
    // const workbook = xlsx.readFile('/Users/amiteshnair/Downloads/DTE.xlsx');
    const filePath = path.join(process.env.FILE_PATH, "DTE.xlsx");
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(worksheet);

    const insertQuery = `
      INSERT INTO dte_cutoffs
      (institute_name, category, gender, quota, district, percentile, \`rank\`, \`cap_round\`,branch)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    for (let row of rows) {
      await connection.execute(insertQuery, [
        row["institute name"] || null,
        row["category(1)"] || null,
        row["gender"] || null,
        row["quota"] || null,
        row["district"] || null,
        row["percentile"] || null,
        row["rank"] || null,
        row["cap round"] || null,
        row["branch"] || null,
      ]);
    }

    console.log("DTE data imported successfully!");
    await connection.end();
  } catch (error) {
    console.error("Error importing DTE data:", error);
  }
})();
