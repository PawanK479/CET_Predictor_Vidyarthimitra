// cutoff-backend/excelImportMarch.js
require("dotenv").config();
const mysql = require("mysql2/promise");
const xlsx = require("xlsx");
const path = require("path");

(async function importMarchData() {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: process.env.PASSWORD,
      database: "cutoff_db",
    });

    // Update the file path to your March Excel file
    // const workbook = xlsx.readFile('/Users/amiteshnair/Downloads/March.xlsx');
    const filePath = path.join(process.env.FILE_PATH, "MArch.xlsx");
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(worksheet);

    const insertQuery = `
      INSERT INTO march_cutoffs
      (institute_name, category, gender, quota, district, percentile, \`rank\`, \`cap_round\`)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
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
      ]);
    }

    console.log("March data imported successfully!");
    await connection.end();
  } catch (error) {
    console.error("Error importing March data:", error);
  }
})();
