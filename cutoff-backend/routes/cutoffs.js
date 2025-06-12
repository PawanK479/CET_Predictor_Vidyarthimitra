// cutoff-backend/routes/cutoffs.js
require("dotenv").config();
const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");

// Create a connection pool (or import your pool)
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: process.env.PASSWORD,
  database: "cutoff_db",
});

router.get("/", async (req, res) => {
  try {
    const course = req.query.course;

    // Pagination: default page 1, limit 50
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    let tableName = "";
    let condition = " WHERE 1=1";
    let params = [];

    // ───────────────────────────────────────────────────────────────────
    // 1) Mtech branch
    if (course === "Mtech") {
      tableName = "mtech_cutoffs";
      const {
        institute_name,
        category,
        gender,
        cap_round,
        percentile,
        status,
        branch,
        district,
      } = req.query;

      if (institute_name && institute_name !== "All") {
        condition += " AND institute_name = ?";
        params.push(institute_name);
      }
      if (category && category !== "All") {
        condition += " AND category = ?";
        params.push(category);
      }
      if (gender && gender !== "All") {
        condition += " AND gender = ?";
        params.push(gender);
      }
      if (cap_round && cap_round !== "All") {
        const roundNum = parseInt(cap_round.replace(/[^0-9]/g, ""), 10);
        condition += " AND cap_round = ?";
        params.push(roundNum);
      }
      if (status && status !== "All") {
        condition += " AND status = ?";
        params.push(status);
      }
      if (branch && branch !== "All") {
        condition += " AND branch = ?";
        params.push(branch);
      }
      if (percentile) {
        const p = parseFloat(percentile);
        condition += " AND percentile BETWEEN ? AND ?";
        params.push(p - 10, p + 10);
      }
      if (district && district !== "All") {
        condition += " AND district = ?";
        params.push(district);
      }
    }

    // ───────────────────────────────────────────────────────────────────
    // 2) Josaa branch
    else if (course === "Josaa") {
      tableName = "josaa_cutoffs";
      const {
        institute,
        josaa_course,
        category,
        gender,
        cap_round,
        year,
        rank,
        quota,
      } = req.query;

      if (institute && institute !== "All") {
        condition += " AND institute = ?";
        params.push(institute);
      }
      if (josaa_course && josaa_course !== "All") {
        condition += " AND course = ?";
        params.push(josaa_course);
      }
      if (category && category !== "All") {
        condition += " AND category = ?";
        params.push(category);
      }
      if (gender && gender !== "All") {
        condition += " AND gender = ?";
        params.push(gender);
      }
      if (cap_round && cap_round !== "All") {
        condition += " AND cap_round = ?";
        params.push(cap_round);
      }
      if (year && year !== "All") {
        condition += " AND exam_year = ?";
        params.push(year);
      }
      if (quota && quota !== "All") {
        condition += " AND quota = ?";
        params.push(quota);
      }
      if (rank) {
        // Use backticks around `rank`
        condition += " AND ? BETWEEN opening_rank AND closing_rank";
        params.push(parseInt(rank, 10));
      }
    }

    // ───────────────────────────────────────────────────────────────────
    // 3) FYJC branch
    else if (course === "FYJC") {
      tableName = "fyjc_cutoffs";
      const {
        branch_stream,
        institute_type,
        reservation_details,
        category,
        district,
        cap_round,
        total_marks,
        status,
        medium,
      } = req.query;

      if (branch_stream && branch_stream !== "All") {
        condition += " AND branch_stream = ?";
        params.push(branch_stream);
      }
      if (institute_type && institute_type !== "All") {
        condition += " AND institute_type = ?";
        params.push(institute_type);
      }
      if (reservation_details && reservation_details !== "All") {
        condition += " AND reservation_details = ?";
        params.push(reservation_details);
      }
      if (category && category !== "All") {
        condition += " AND category = ?";
        params.push(category);
      }
      if (district && district !== "All") {
        condition += " AND district = ?";
        params.push(district);
      }
      if (cap_round && cap_round !== "All") {
        const roundNum = parseInt(cap_round.replace(/[^0-9]/g, ""), 10);
        condition += " AND cap_round = ?";
        params.push(roundNum);
      }
      if (total_marks) {
        const tm = parseInt(total_marks, 10);
        condition += " AND total_marks >= ?";
        params.push(tm);
      }
      if (status && status !== "All") {
        condition += " AND status = ?";
        params.push(status);
      }
      if (medium && medium !== "All") {
        condition += " AND medium = ?";
        params.push(medium);
      }
    }

    // ───────────────────────────────────────────────────────────────────
    // 4) BAMS, BUMS, BHMS, BSMS branch
    else if (
      ["BAMS", "BUMS", "BHMS", "BSMS", "VCI", "MBBS", "BDS", "BSC"].includes(
        course
      )
    ) {
      // table name must match your naming convention in MySQL (lowercase + suffix)
      tableName = course.toLowerCase() + "_cutoffs";

      const { state, institute_name, category, cap_round, rank, quota } =
        req.query;

      if (state && state !== "All") {
        condition += " AND state = ?";
        params.push(state);
      }
      if (institute_name && institute_name !== "All") {
        condition += " AND institute_name = ?";
        params.push(institute_name);
      }
      if (
        course !== "MBBS" &&
        course !== "BDS" &&
        course !== "BSC" &&
        category &&
        category !== "All"
      ) {
        condition += " AND category = ?";
        params.push(category);
      }
      if (cap_round && cap_round !== "All") {
        condition += " AND cap_round = ?";
        params.push(cap_round);
      }
      if (
        (course === "MBBS" || course === "BDS" || course === "BSC") &&
        quota &&
        quota !== "All"
      ) {
        condition += " AND quota = ?";
        params.push(quota);
      }
      if (rank) {
        const r = parseInt(rank, 10);
        // return all rows whose AIR is <= the entered AIR
        condition += " AND `rank` >= ?";
        params.push(r);
      }
    }

    // ───────────────────────────────────────────────────────────────────
    // 5) All other courses
    else {
      // pick the correct table based on course
      if (course === "BDesign") {
        tableName = "bdesign_cutoffs";
      } else if (course === "BArch") {
        tableName = "barch_cutoffs";
      } else if (course === "BBA/BMS/BBM") {
        tableName = "bba_bms_bbm_cutoffs";
      } else if (course === "MBA") {
        tableName = "mba_cutoffs";
      } else if (course === "M.E/M.Tech(Working Professional)") {
        tableName = "me_mtech_wp_cutoffs";
      } else if (course === "MBA_MMS(Working_Professional)") {
        tableName = "mba_mms_wp_cutoffs";
      } else if (course === "BCA_MCA Integrated") {
        tableName = "bca_mca_integrated_cutoffs";
      } else if (course === "Pharmacy Practice") {
        tableName = "pharmacy_practice_cutoffs";
      } else if (course === "BPharm") {
        tableName = "bpharm_cutoffs";
      } else if (course === "MCA") {
        tableName = "mca_cutoffs";
      } else if (course === "HMCT") {
        tableName = "hmct_cutoffs";
      } else if (course === "DYSE") {
        tableName = "dyse_cutoffs";
      } else if (course === "DTE") {
        tableName = "dte_cutoffs";
      } else if (course === "BTech") {
        tableName = "btech_cutoffs";
      } else if (course === "March") {
        tableName = "march_cutoffs";
      } else if (course === "MPharm") {
        tableName = "mpharm_cutoffs";
      } else if (course === "DYSER") {
        tableName = "dyser_cutoffs";
      } else if (course === "DYSP") {
        tableName = "dysp_cutoffs";
      } else {
        return res.status(400).json({ error: "Invalid course" });
      }

      const {
        institute_name,
        category,
        gender,
        district,
        university,
        percentile,
        cap_round,
        status,
        branch,
        quota,
      } = req.query;

      if (institute_name && institute_name !== "All") {
        condition += " AND institute_name = ?";
        params.push(institute_name);
      }
      if (category && category !== "All") {
        condition += " AND category = ?";
        params.push(category);
      }
      if (gender && gender !== "All") {
        condition += " AND gender = ?";
        params.push(gender);
      }
      if (district && district !== "All") {
        condition += " AND district = ?";
        params.push(district);
      }
      if (
        course !== "DTE" &&
        course !== "March" &&
        course !== "MPharm" &&
        university &&
        university !== "All"
      ) {
        condition += " AND university = ?";
        params.push(university);
      }
      if (cap_round && cap_round !== "All") {
        const roundNum = parseInt(cap_round.replace(/[^0-9]/g, ""), 10);
        condition += " AND cap_round = ?";
        params.push(roundNum);
      }
      if (course === "BTech") {
        if (status && status !== "All") {
          condition += " AND status = ?";
          params.push(status);
        }
        if (branch && branch !== "All") {
          condition += " AND branch = ?";
          params.push(branch);
        }
      }
      if (course === "DTE") {
        if (branch && branch !== "All") {
          condition += " AND branch = ?";
          params.push(branch);
        }
      }
      if (course === "DYSER") {
        if (branch && branch !== "All") {
          condition += " AND branch = ?";
          params.push(branch);
        }
      }
      if (course === "DYSP") {
        if (status && status !== "All") {
          condition += " AND status = ?";
          params.push(status);
        }
      }
      if (quota && quota !== "All") {
        condition += " AND quota = ?";
        params.push(quota);
      }
      if (percentile) {
        const p = parseFloat(percentile);
        condition += " AND percentile BETWEEN ? AND ?";
        params.push(p - 10, p + 10);
      }
    }

    // ───────────────────────────────────────────────────────────────────
    // 6) Determine ORDER BY clause
    let orderClause;
    if (course === "Josaa") {
      orderClause = " ORDER BY opening_rank ASC";
    } else if (course === "FYJC") {
      orderClause = " ORDER BY total_marks DESC";
    } else if (
      ["BAMS", "BUMS", "BHMS", "BSMS", "VCI", "MBBS", "BDS", "BSC"].includes(
        course
      )
    ) {
      // Always order by the column named `rank` (escaped with backticks)
      orderClause = " ORDER BY `rank` ASC";
    } else {
      orderClause = " ORDER BY percentile DESC";
    }

    // ───────────────────────────────────────────────────────────────────
    // 7) Count total records
    const countQuery = `SELECT COUNT(*) as total FROM ${tableName} ${condition}`;
    const [countRows] = await pool.query(countQuery, params);
    const total = countRows[0].total;
    const totalPages = Math.ceil(total / limit);

    // 8) Fetch paginated results
    const fetchQuery = `
      SELECT * FROM ${tableName}
      ${condition}
      ${orderClause}
      LIMIT ? OFFSET ?
    `;
    const fetchParams = [...params, limit, offset];
    const [rows] = await pool.query(fetchQuery, fetchParams);

    // 9) Send back JSON
    res.json({
      results: rows,
      total,
      page,
      totalPages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
