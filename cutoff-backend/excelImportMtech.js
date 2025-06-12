// cutoff-backend/excelImportMtech.js
require("dotenv").config();
const mysql = require("mysql2/promise");
const xlsx = require("xlsx");
const path = require("path");

(async function importMtechData() {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: process.env.PASSWORD,
      database: "cutoff_db",
    });

    // Update the file path to your Mtech Excel file
    // const workbook = xlsx.readFile('/Users/amiteshnair/Downloads/mtech_cutoff.xlsx');
    const filePath = path.join(process.env.FILE_PATH, "mtech.xlsx");
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(worksheet);

    const insertQuery = `
      INSERT INTO mtech_cutoffs
      (institute_name, category, gender, quota, district, percentile, \`rank\`, \`cap_round\`, status, branch)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        row["status"] || null,
        row["course name"] || null,
      ]);
    }

    console.log("Mtech data imported successfully!");
    await connection.end();
  } catch (error) {
    console.error("Error importing Mtech data:", error);
  }
})();
