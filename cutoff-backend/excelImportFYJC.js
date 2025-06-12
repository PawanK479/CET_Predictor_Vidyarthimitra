// cutoff-backend/excelImportFYJC.js
require("dotenv").config();
const mysql = require("mysql2/promise");
const xlsx = require("xlsx");
const path = require("path");

(async function importFYJCData() {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: process.env.PASSWORD,
      database: "cutoff_db",
    });

    // Update with the correct path to your FYJC Excel file
    // const workbook = xlsx.readFile('/Users/amiteshnair/Downloads/FYJC.xlsx');
    const filePath = path.join(process.env.FILE_PATH, "FYJC.xlsx");
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(worksheet);

    const insertQuery = `
      INSERT INTO fyjc_cutoffs
      (
        udise_no,
        institute_name,
        status,
        medium,
        reservation_details,
        district,
        cap_round,
        total_marks,
        branch_stream,
        institute_type,
        category
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    for (let row of rows) {
      await connection.execute(insertQuery, [
        row["UDISE No."] || null,
        row["institute name"] || null,
        row["status"] || null,
        row["medium"] || null,
        row["reservation details"] || null,
        row["district"] || null,
        row["cap round"] ? parseInt(row["cap round"], 10) : null,
        row["marks"] ? parseInt(row["marks"], 10) : null,
        row["branch"] || null,
        row["institute type"] || null,
        row["category(1)"] || null,
      ]);
    }

    console.log("FYJC data imported successfully!");
    await connection.end();
  } catch (error) {
    console.error("Error importing FYJC data:", error);
  }
})();
