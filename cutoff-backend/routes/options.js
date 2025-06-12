// cutoff-backend/routes/options.js
require("dotenv").config();
const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");

// Create a connection pool (update credentials as needed)
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: process.env.PASSWORD, // Replace with your MySQL password
  database: "cutoff_db",
});

router.get("/", async (req, res) => {
  try {
    const { course } = req.query;
    let tableName = "";
    if (course === "Josaa") {
      tableName = "josaa_cutoffs";
    } else if (course === "FYJC") {
      tableName = "fyjc_cutoffs";
    } else if (course === "BDesign") {
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
      // New Addition
      tableName = "mca_cutoffs";
    } else if (course === "HMCT") {
      tableName = "hmct_cutoffs";
    } else if (course === "DYSE") {
      tableName = "dyse_cutoffs";
    } else if (course === "DTE") {
      tableName = "dte_cutoffs";
    } else if (course === "BTech") {
      // New addition
      tableName = "btech_cutoffs";
    } else if (course === "Mtech") {
      tableName = "mtech_cutoffs";
    } else if (course === "March") {
      tableName = "march_cutoffs";
    } else if (course === "MPharm") {
      tableName = "mpharm_cutoffs";
    } else if (course === "BAMS") {
      tableName = "bams_cutoffs";
    } else if (course === "BUMS") {
      tableName = "bums_cutoffs";
    } else if (course === "BHMS") {
      tableName = "bhms_cutoffs";
    } else if (course === "BSMS") {
      tableName = "bsms_cutoffs";
    } else if (course === "DYSER") {
      tableName = "dyser_cutoffs";
    } else if (course === "DYSP") {
      tableName = "dysp_cutoffs";
    } else if (course === "VCI") {
      tableName = "VCI_cutoffs";
    } else if (course === "MBBS") {
      tableName = "mbbs_cutoffs";
    } else if (course === "BDS") {
      tableName = "bds_cutoffs";
    } else if (course === "BSC") {
      tableName = "bsc_cutoffs";
    } else {
      return res.status(400).json({ error: "Invalid course" });
    }

    // Build WHERE clauses from any filtering params
    const clauses = [];
    const params = [];

    // -- common & other‐courses filters --
    if (req.query.district && req.query.district !== "All") {
      clauses.push("district = ?");
      params.push(req.query.district);
    }
    if (req.query.category && req.query.category !== "All") {
      // both Josaa and others use "category"
      clauses.push("category = ?");
      params.push(req.query.category);
    }
    if (req.query.gender && req.query.gender !== "All") {
      clauses.push("gender = ?");
      params.push(req.query.gender);
    }
    if (req.query.cap_round && req.query.cap_round !== "All") {
      clauses.push("cap_round = ?");
      params.push(parseInt(req.query.cap_round.replace(/\D/g, ""), 10));
    }

    // -- Josaa‐specific filters --
    if (course === "Josaa") {
      if (req.query.institute && req.query.institute !== "All") {
        clauses.push("institute = ?");
        params.push(req.query.institute);
      }
      if (req.query.josaa_course && req.query.josaa_course !== "All") {
        clauses.push("course = ?");
        params.push(req.query.josaa_course);
      }
      if (req.query.year && req.query.year !== "All") {
        clauses.push("exam_year = ?");
        params.push(req.query.year);
      }
      if (req.query.quota && req.query.quota !== "All") {
        clauses.push("quota = ?");
        params.push(req.query.quota);
      }
    }

    // -- FYJC‐specific filters --
    if (course === "FYJC") {
      if (req.query.branch_stream && req.query.branch_stream !== "All") {
        clauses.push("branch_stream = ?");
        params.push(req.query.branch_stream);
      }
      if (req.query.institute_type && req.query.institute_type !== "All") {
        clauses.push("institute_type = ?");
        params.push(req.query.institute_type);
      }
      if (
        req.query.reservation_details &&
        req.query.reservation_details !== "All"
      ) {
        clauses.push("reservation_details = ?");
        params.push(req.query.reservation_details);
      }
      if (req.query.status && req.query.status !== "All") {
        clauses.push("status = ?");
        params.push(req.query.status);
      }
      if (req.query.medium && req.query.medium !== "All") {
        clauses.push("medium = ?");
        params.push(req.query.medium);
      }
    }

    if (
      ["BAMS", "BUMS", "BHMS", "BSMS", "VCI", "MBBS", "BDS", "BSC"].includes(
        course
      )
    ) {
      if (req.query.state && req.query.state !== "All") {
        clauses.push("state = ?");
        params.push(req.query.state);
      }
      if (req.query.institute_name && req.query.institute_name !== "All") {
        clauses.push("institute_name = ?");
        params.push(req.query.institute_name);
      }
      if (req.query.category && req.query.category !== "All") {
        clauses.push("category = ?");
        params.push(req.query.category);
      }
      if (req.query.cap_round && req.query.cap_round !== "All") {
        clauses.push("cap_round = ?");
        params.push(parseInt(req.query.cap_round.replace(/\D/g, ""), 10));
      }
      if (req.query.quota && req.query.quota !== "All") {
        clauses.push("quota = ?");
        params.push(req.query.quota);
      }
      // AIR is just “rank” in the table; not needed for options endpoint
    }

    // -- “other courses” filters: institute_name, status, branch, percentile …
    if (course !== "Josaa" && course !== "FYJC") {
      if (req.query.institute_name && req.query.institute_name !== "All") {
        clauses.push("institute_name = ?");
        params.push(req.query.institute_name);
      }
      if (
        course !== "DYSER" &&
        req.query.status &&
        req.query.status !== "All"
      ) {
        clauses.push("status = ?");
        params.push(req.query.status);
      }
      if (course !== "DYSP" && req.query.branch && req.query.branch !== "All") {
        clauses.push("branch = ?");
        params.push(req.query.branch);
      }
      if (req.query.quota && req.query.quota !== "All") {
        clauses.push("quota = ?");
        params.push(req.query.quota);
      }
      if (
        course != "BDesign" &&
        course != "DYSER" &&
        course != "MPharm" &&
        req.query.quota &&
        req.query.quota !== "All"
      ) {
        clauses.push("quota = ?");
        params.push(req.query.quota);
      }
    }

    // assemble final WHERE
    const where = clauses.length > 0 ? "WHERE " + clauses.join(" AND ") : "";

    const noUniCourses = [
      "Josaa",
      "FYJC",
      "DTE",
      "Mtech",
      "March",
      "MPharm",
      "DYSER",
      "DYSP",
    ];
    const includeUniversity = !noUniCourses.includes(course);

    const noQuotaCourses = ["DYSER", "Mpharm", "BDesign"];
    const includeQuota = !noQuotaCourses.includes(course);

    // now run your distinct‐selects
    if (course === "Josaa") {
      const [
        [instituteRows],
        [courseRows],
        [categoryRows],
        [genderRows],
        [capRows],
        [yearRows],
        [quotaRows],
      ] = await Promise.all([
        pool.query(
          `SELECT DISTINCT institute    FROM ${tableName} ${where}`,
          params
        ),
        pool.query(
          `SELECT DISTINCT course       FROM ${tableName} ${where}`,
          params
        ),
        pool.query(
          `SELECT DISTINCT category     FROM ${tableName} ${where}`,
          params
        ),
        pool.query(
          `SELECT DISTINCT gender       FROM ${tableName} ${where}`,
          params
        ),
        pool.query(
          `SELECT DISTINCT cap_round    FROM ${tableName} ${where}`,
          params
        ),
        pool.query(
          `SELECT DISTINCT exam_year    FROM ${tableName} ${where}`,
          params
        ),
        pool.query(
          `SELECT DISTINCT quota     FROM ${tableName} ${where}`,
          params
        ),
      ]);

      return res.json({
        institutes: instituteRows.map((r) => r.institute),
        josaaCourses: courseRows.map((r) => r.course),
        categories: categoryRows.map((r) => r.category),
        genders: genderRows.map((r) => r.gender),
        capRounds: capRows.map((r) => r.cap_round),
        years: yearRows.map((r) => r.exam_year),
        quota: quotaRows.map((r) => r.quota),
      });
    }

    if (course === "FYJC") {
      const [
        [branchRows],
        [instTypeRows],
        [resRows],
        [catRows],
        [distRows],
        [capRows],
        [instituteRows],
        [statusRows],
        [mediumRows],
      ] = await Promise.all([
        pool.query(
          `SELECT DISTINCT branch_stream      FROM ${tableName} ${where}`,
          params
        ),
        pool.query(
          `SELECT DISTINCT institute_type     FROM ${tableName} ${where}`,
          params
        ),
        pool.query(
          `SELECT DISTINCT reservation_details FROM ${tableName} ${where}`,
          params
        ),
        pool.query(
          `SELECT DISTINCT category         FROM ${tableName} ${where}`,
          params
        ),
        pool.query(
          `SELECT DISTINCT district         FROM ${tableName} ${where}`,
          params
        ),
        pool.query(
          `SELECT DISTINCT cap_round        FROM ${tableName} ${where}`,
          params
        ),
        pool.query(
          `SELECT DISTINCT institute_name   FROM ${tableName} ${where}`,
          params
        ),
        pool.query(`SELECT DISTINCT status FROM ${tableName} ${where}`, params),
        pool.query(`SELECT DISTINCT medium FROM ${tableName} ${where}`, params),
      ]);

      return res.json({
        branchStreams: branchRows.map((r) => r.branch_stream),
        instituteTypes: instTypeRows.map((r) => r.institute_type),
        reservationDetails: resRows.map((r) => r.reservation_details),
        categories: catRows.map((r) => r.category),
        districts: distRows.map((r) => r.district),
        capRounds: capRows.map((r) => r.cap_round),
        institutes: instituteRows.map((r) => r.institute_name),
        statusOptionsF: statusRows.map((r) => r.status),
        mediumOptions: mediumRows.map((r) => r.medium),
      });
    }

    // ─── “BM‐type” courses ───
    if (
      ["BAMS", "BUMS", "BHMS", "BSMS", "VCI", "MBBS", "BDS", "BSC"].includes(
        course
      )
    ) {
      const [
        [stateRows],
        [instituteRows],
        [categoryRows],
        [capRows],
        [quotaRows],
      ] = await Promise.all([
        pool.query(
          `SELECT DISTINCT state          FROM ${tableName} ${where}`,
          params
        ),
        pool.query(
          `SELECT DISTINCT institute_name FROM ${tableName} ${where}`,
          params
        ),
        pool.query(
          /^(BAMS|BUMS|BHMS|BSMS|VCI)$/.test(course)
            ? `SELECT DISTINCT category  FROM ${tableName} ${where}`
            : `SELECT NULL LIMIT 0`,
          params
        ),
        pool.query(
          `SELECT DISTINCT cap_round     FROM ${tableName} ${where}`,
          params
        ),
        pool.query(
          /^(MBBS|BDS|BSC)$/.test(course)
            ? `SELECT DISTINCT quota  FROM ${tableName} ${where}`
            : `SELECT NULL LIMIT 0`,
          params
        ),
      ]);

      return res.json({
        states: stateRows.map((r) => r.state),
        institutes: instituteRows.map((r) => r.institute_name),
        categories: categoryRows.map((r) => r.category),
        capRounds: capRows.map((r) => r.cap_round),
        quota: quotaRows.map((r) => r.quota),
      });
    }

    // all other courses:
    const [
      [instRows],
      [catRows],
      [genRows],
      [distRows],
      [uniRows],
      [capRows],
      [statusRows],
      [branchRows],
      [quotaRows],
    ] = await Promise.all([
      pool.query(
        `SELECT DISTINCT institute_name FROM ${tableName} ${where}`,
        params
      ),
      pool.query(
        `SELECT DISTINCT category       FROM ${tableName} ${where}`,
        params
      ),
      pool.query(
        `SELECT DISTINCT gender         FROM ${tableName} ${where}`,
        params
      ),
      pool.query(
        `SELECT DISTINCT district       FROM ${tableName} ${where}`,
        params
      ),

      // <-- university only if the table actually has that column
      includeUniversity
        ? pool.query(
            `SELECT DISTINCT university FROM ${tableName} ${where}`,
            params
          )
        : Promise.resolve([[], []]),

      pool.query(
        `SELECT DISTINCT cap_round      FROM ${tableName} ${where}`,
        params
      ),

      pool.query(
        /^(BTech|Mtech|DYSP)$/.test(course)
          ? `SELECT DISTINCT status  FROM ${tableName} ${where}`
          : `SELECT NULL LIMIT 0`,
        params
      ),
      pool.query(
        /^(BTech|Mtech|DTE|DYSER)$/.test(course)
          ? `SELECT DISTINCT branch  FROM ${tableName} ${where}`
          : `SELECT NULL LIMIT 0`,
        params
      ),
      includeQuota
        ? pool.query(`SELECT DISTINCT quota FROM ${tableName} ${where}`, params)
        : Promise.resolve([[], []]),
      // pool.query(
      //   /^(BBA)$/.test(course)
      //     ? `SELECT DISTINCT quota  FROM ${tableName} ${where}`
      //     : `SELECT NULL LIMIT 0`,
      //   params
      // ),
    ]);

    return res.json({
      institutes: instRows.map((r) => r.institute_name),
      categories: catRows.map((r) => r.category),
      genders: genRows.map((r) => r.gender),
      districts: distRows.map((r) => r.district),
      universities: uniRows.map((r) => r.university),
      capRounds: capRows.map((r) => r.cap_round),
      statusOptions: statusRows.map((r) => r.status),
      branchOptions: branchRows.map((r) => r.branch),
      quotaOptions: quotaRows.map((r) => r.quota),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
