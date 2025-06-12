// cutoff-backend/excelImportJosaa.js
require("dotenv").config();
const mysql = require("mysql2/promise");
const xlsx = require("xlsx");
const path = require("path");

(async function importJosaaData() {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: process.env.PASSWORD, // Your MySQL password
      database: "cutoff_db",
    });

    // Update with the correct path to your Josaa Excel file
    // const workbook = xlsx.readFile('/Users/amiteshnair/Downloads/Final_JOSAA_Data.xlsx');
    const filePath = path.join(process.env.FILE_PATH, "JOSAA.xlsx");
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(worksheet);

    // Insert query matching the columns in josaa_cutoffs
    const insertQuery = `
      INSERT INTO josaa_cutoffs
      (institute, course, category, gender, quota, cap_round, exam_year, opening_rank, closing_rank)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    for (let row of rows) {
      // Adjust the keys below to match the headers in your Excel file
      await connection.execute(insertQuery, [
        row["institute"] || null,
        row["course"] || null,
        row["category(1)"] || null,
        row["gender"] || null,
        row["quota"] || null,
        row["cap round"] || null,
        row["year"] ? parseInt(row["year"], 10) : null,
        row["opening rank"] || null,
        row["closing rank"] || null,
      ]);
    }

    console.log("Josaa data imported successfully!");
    await connection.end();
  } catch (error) {
    console.error("Error importing Josaa data:", error);
  }
})();
