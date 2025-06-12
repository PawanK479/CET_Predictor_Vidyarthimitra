// cutoff-backend/excelImportBUMS.js
require("dotenv").config();
const mysql = require("mysql2/promise");
const xlsx = require("xlsx");
const path = require("path");

(async function importBUMSData() {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: process.env.PASSWORD,
      database: "cutoff_db",
    });

    // Update this path to wherever your BUMS Excel file lives:
    // const workbook = xlsx.readFile('/Users/amiteshnair/Downloads/BUMS-final.xlsx');
    const filePath = path.join(process.env.FILE_PATH, "BUMS-final.xlsx");
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(worksheet);

    const insertQuery = `
      INSERT INTO bums_cutoffs
      (institute_name, state, category, cap_round, \`rank\`)
      VALUES (?, ?, ?, ?, ?)
    `;

    for (let row of rows) {
      await connection.execute(insertQuery, [
        row["Institute"] || null,
        row["State"] || null,
        row["Category"] || null,
        row["Admitted Round"] || null,
        row["AIR"] || null,
      ]);
    }

    console.log("✅ BUMS data imported successfully!");
    await connection.end();
  } catch (error) {
    console.error("❌ Error importing BUMS data:", error);
  }
})();
