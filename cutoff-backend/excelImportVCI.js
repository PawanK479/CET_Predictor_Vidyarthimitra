// cutoff-backend/excelImportVCI.js
require("dotenv").config();
const mysql = require("mysql2/promise");
const xlsx = require("xlsx");
const path = require("path");

(async function importPharmacyData() {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: process.env.PASSWORD,
      database: "cutoff_db",
    });

    // Update the file path to your Pharmacy Practice Excel file
    // const workbook = xlsx.readFile('C:\\Users\\dell\\Documents\\VM_Files\\VM_Files\\vci_sheet.xlsx');
    const filePath = path.join(process.env.FILE_PATH, "VCI.xlsx");
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(worksheet);

    const insertQuery = `
      INSERT INTO vci_cutoffs
      (institute_name, category, State, \`rank\`, \`cap_round\`)
      VALUES ( ?, ?, ?, ?, ?)
    `;

    for (let row of rows) {
      await connection.execute(insertQuery, [
        row["Allotted Institute"] || null,
        row["Candidate Category"] || null,
        row["State"] || null,
        row["Rank"] || null,
        row["Round"] || null,
      ]);
    }

    console.log("VCI data imported successfully!");
    await connection.end();
  } catch (error) {
    console.error("Error importing VCI data:", error);
  }
})();
