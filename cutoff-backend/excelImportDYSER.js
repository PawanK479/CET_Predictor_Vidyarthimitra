// cutoff-backend/excelImportDYSE.js
require("dotenv").config();
const mysql = require("mysql2/promise");
const xlsx = require("xlsx");
const path = require("path");

(async function importDYSEData() {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: process.env.PASSWORD,
      database: "cutoff_db",
    });

    // Update the file path to your DYSE Excel file
    // const workbook = xlsx.readFile(
    //   "C:\\Users\\HP\\Downloads\\VM_Files\\DSYE.xlsx"
    // );
    const filePath = path.join(process.env.FILE_PATH, "DSYE.xlsx");
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(worksheet);

    const insertQuery = `
      INSERT INTO dyser_cutoffs
      (institute_name, branch, category, gender, district, percentile, \`cap_round\`)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    for (let row of rows) {
      await connection.execute(insertQuery, [
        row["institute name"] || null,
        row["branch"] || null,
        row["category(1)"] || null,
        row["gender"] || null,
        row["district"] || null,
        row["percentile"] || null,
        row["cap round"] || null,
      ]);
    }

    console.log("DYSER data imported successfully!");
    await connection.end();
  } catch (error) {
    console.error("Error importing DYSER data:", error);
  }
})();
