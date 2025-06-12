// backend/excelImportBDesign.js
require("dotenv").config();
const mysql = require("mysql2/promise");
const xlsx = require("xlsx");
const path = require("path");

(async function importBBAData() {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: process.env.PASSWORD,
      database: "cutoff_db",
    });

    // Update the file path to your BDesign Excel file
    // const workbook = xlsx.readFile('/Users/amiteshnair/Downloads/BBA_BMS_BBM_MBA.xlsx');
    const filePath = path.join(process.env.FILE_PATH, "BBA_BMS_BBM_MBA.xlsx");
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(worksheet);

    const insertQuery = `
      INSERT INTO bba_bms_bbm_cutoffs
      (institute_name, category, gender, district, university, percentile, quota, \`rank\`, \`cap_round\`)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    for (let row of rows) {
      await connection.execute(insertQuery, [
        row["institute name"] || null,
        row["category(1)"] || null,
        row["gender"] || null,
        row["district"] || null,
        row["university"] || null,
        row["percentile"] || null,
        row["quota"] || null,
        row["rank"] || null,
        row["cap round"] || null,
      ]);
    }

    console.log("BBA data imported successfully!");
    await connection.end();
  } catch (error) {
    console.error("Error importing BBA data:", error);
  }
})();
