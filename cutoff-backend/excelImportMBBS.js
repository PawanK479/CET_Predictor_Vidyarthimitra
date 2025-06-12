// cutoff-backend/excelImportBAMS.js
require("dotenv").config();
const mysql = require("mysql2/promise");
const xlsx = require("xlsx");
const path = require("path");

(async function importBAMSData() {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: process.env.PASSWORD,
      database: "cutoff_db",
    });

    // Update this path to wherever your BAMS Excel file lives:
    // const workbook = xlsx.readFile(
    //   "/Users/amiteshnair/Downloads/BAMS-final.xlsx"
    // );
    const filePath = path.join(process.env.FILE_PATH, "Neet_UG_MBBS_AIR.xlsx");
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(worksheet);

    const insertQuery = `
      INSERT INTO mbbs_cutoffs
      (institute_name, state, quota, cap_round, \`rank\`)
      VALUES (?, ?, ?, ?, ?)
    `;

    for (let row of rows) {
      await connection.execute(insertQuery, [
        row["Institute"] || null,
        row["State"] || null,
        row["Quota"] || null,
        row["Cap Round"] || null,
        row["Rank"] || null,
      ]);
    }

    console.log("✅ MBBS data imported successfully!");
    await connection.end();
  } catch (error) {
    console.error("❌ Error importing BAMS data:", error);
  }
})();
