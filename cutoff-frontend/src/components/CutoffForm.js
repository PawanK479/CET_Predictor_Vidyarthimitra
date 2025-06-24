import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Select from "react-select";
import "./Form.css";

const CutoffForm = () => {
  // Course selector (for two courses: BDesign and BArch)
  // For FYJC, these are the input fields.
  // For other courses, existing fields remain.
  // FYJC input fields:
  const [course, setCourse] = useState("BDesign");
  // At the top with your other useState calls:
  const [studentName, setStudentName] = useState("");

  // Josaa-specific input fields:
  const [josaaInstitute, setJosaaInstitute] = useState("All");
  const [josaaCourse, setJosaaCourse] = useState("All");
  const [josaaCategory, setJosaaCategory] = useState("All");
  const [josaaGender, setJosaaGender] = useState("All");
  const [josaaCapRound, setJosaaCapRound] = useState("All");
  const [josaaYear, setJosaaYear] = useState("All");
  const [josaaRank, setJosaaRank] = useState("");
  const [josaaQuota, setJosaaQuota] = useState("All");

  // Dropdown options for Josaa:
  const [josaaInstitutes, setJosaaInstitutes] = useState([]);
  const [josaaCourses, setJosaaCourses] = useState([]);
  const [josaaCategories, setJosaaCategories] = useState([]);
  const [josaaGenders, setJosaaGenders] = useState([]);
  const [josaaCapRounds, setJosaaCapRounds] = useState([]);
  const [josaaYears, setJosaaYears] = useState([]);
  const [josaaQuotas, setJosaaQuotas] = useState([]);

  // FYJC fields
  const [branchStream, setBranchStream] = useState("All");
  const [instituteType, setInstituteType] = useState("All");
  const [reservationDetails, setReservationDetails] = useState("All");
  const [fyjcInstitutesSelected, setFyjcInstitutesSelected] = useState("All");
  const [fyjcInstitutes, setFyjcInstitutes] = useState([]);
  const [statusF, setStatusF] = useState("All");
  const [medium, setMedium] = useState("All");

  // “New” courses (BAMS, BUMS, BHMS, BSMS) fields:
  const [bmState, setBmState] = useState("All");
  const [bmInstitute, setBmInstitute] = useState("All");
  const [bmCategory, setBmCategory] = useState("All");
  const [bmCapRound, setBmCapRound] = useState("All");
  const [bmAIR, setBmAIR] = useState("");
  const [quota, setQuota] = useState("All");

  // Dropdown options for new “BM‐type” courses:
  const [bmStatesOptions, setBmStatesOptions] = useState([]);
  const [bmInstitutesOptions, setBmInstitutesOptions] = useState([]);
  const [bmCategoriesOptions, setBmCategoriesOptions] = useState([]);
  const [bmCapRoundsOptions, setBmCapRoundsOptions] = useState([]);
  const [quotaOptions, setQuotaOptions] = useState([]);

  // Common fields for both FYJC and others:
  const [category, setCategory] = useState("All");
  const [district, setDistrict] = useState("All");
  const [capRound, setCapRound] = useState("All");
  const [totalMarks, setTotalMarks] = useState("");

  // For other courses, these fields:
  const [institutesSelected, setInstitutesSelected] = useState("All");
  const [gender, setGender] = useState("All");
  const [university, setUniversity] = useState("All");
  const [percentile, setPercentile] = useState(""); // not used for FYJC
  const [status, setStatus] = useState("All");
  const [branch, setBranch] = useState("All");

  // Dropdown options – for FYJC and others.
  const [branchStreams, setBranchStreams] = useState([]);
  const [instituteTypes, setInstituteTypes] = useState([]);
  const [reservationOptions, setReservationOptions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [capRounds, setCapRounds] = useState([]);
  const [statusOptionsF, setStatusOptionsF] = useState([]);
  const [mediumOptions, setMediumOptions] = useState([]);

  // Options for other courses:
  const [institutes, setInstitutes] = useState([]);
  const [genders, setGenders] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);

  // right after your other useState calls:
  // const [sortDir, setSortDir] = useState('desc');  // 'asc' or 'desc'

  // Results & pagination state
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(50); // Number of records per page
  const [totalPages, setTotalPages] = useState(1);

  // Create a reference for the table container for printing
  // const tableRef = useRef(null);
  // 1) Reset all filter inputs on course change
  useEffect(() => {
    setCategory("All");
    setDistrict("All");
    setCapRound("All");
    // inside the useEffect([course]) that resets all filters:
    // setFyjcInstitute('All');
    setFyjcInstitutesSelected("All");
    setStatusF("All");
    setMedium("All");

    setTotalMarks("");

    setJosaaInstitute("All");
    setJosaaCourse("All");
    setJosaaCategory("All");
    setJosaaGender("All");
    setJosaaCapRound("All");
    setJosaaYear("All");
    setJosaaQuota("All");
    setJosaaRank("");

    // setInstitute('All');
    setInstitutesSelected("All");
    setGender("All");
    setUniversity("All");
    setPercentile("");
    setStatus("All");
    setBranch("All");

    setBmState("All");
    setBmInstitute("All");
    setBmCategory("All");
    setBmCapRound("All");
    setBmAIR("");
    setQuota("All");

    setPage(1);
    setResults([]);
    setTotalPages(1);
  }, [course]);
  // Fetch distinct dropdown options when the course changes
  const fetchOptions = async (excludeKey = null) => {
    const params = { course };

    // FYJC & other courses filters:
    if (category !== "All" && excludeKey !== "category")
      params.category = category;
    if (district !== "All" && excludeKey !== "district")
      params.district = district;
    if (capRound !== "All" && excludeKey !== "cap_round")
      params.cap_round = capRound;
    if (statusF !== "All" && excludeKey !== "status") params.status = statusF;
    if (medium !== "All" && excludeKey !== "medium") params.medium = medium;
    if (totalMarks !== "" && excludeKey !== "total_marks")
      params.total_marks = totalMarks;

    // FYJC multi
    if (fyjcInstitutesSelected !== "All" && excludeKey !== "institute_name") {
      params.institute_name = fyjcInstitutesSelected;
    }

    // Josaa‐specific filters:
    if (josaaInstitute !== "All") params.institute = josaaInstitute;
    if (josaaCourse !== "All") params.josaa_course = josaaCourse;
    if (josaaCategory !== "All") params.category = josaaCategory;
    if (josaaGender !== "All") params.gender = josaaGender;
    if (josaaCapRound !== "All") params.cap_round = josaaCapRound;
    if (josaaYear !== "All") params.year = josaaYear;
    if (josaaQuota !== "All") params.quota = josaaQuota;
    if (josaaRank !== "") params.rank = josaaRank;

    // “Other courses” filters:
    if (institutesSelected !== "All" && excludeKey !== "institute_name") {
      params.institute_name = institutesSelected;
    }

    if (gender !== "All" && excludeKey !== "gender") params.gender = gender;
    if (university !== "All" && excludeKey !== "university")
      params.university = university;
    if (percentile !== "" && excludeKey !== "percentile")
      params.percentile = percentile;
    if (status !== "All" && excludeKey !== "status") params.status = status;
    if (branch !== "All" && excludeKey !== "branch") params.branch = branch;

    if (bmState !== "All" && excludeKey !== "state") params.state = bmState;
    if (bmInstitute !== "All" && excludeKey !== "institute_name")
      params.institute_name = bmInstitute;
    if (bmCategory !== "All" && excludeKey !== "category")
      params.category = bmCategory;
    if (bmCapRound !== "All" && excludeKey !== "cap_round")
      params.cap_round = bmCapRound;
    if (bmAIR !== "" && excludeKey !== "rank") params.rank = bmAIR;
    if (quota !== "" && excludeKey !== "quota") params.rank = quota;

    try {
      const { data } = await axios.get("http://localhost:5001/api/options", {
        params,
      });

      if (course === "Josaa") {
        // For Josaa, set Josaa-specific dropdown options
        setJosaaInstitutes(["All", ...data.institutes]);
        setJosaaCourses(["All", ...data.josaaCourses]);
        setJosaaCategories(["All", ...data.categories]);
        setJosaaGenders(["All", ...data.genders]);
        setJosaaCapRounds(["All", ...data.capRounds]);
        setJosaaYears(["All", ...data.years]);
        setJosaaQuotas(["All", ...data.quota]);
        // // Reset Josaa fields
        // setJosaaInstitute('All');
        // setJosaaCourse('All');
        // setJosaaCategory('All');
        // setJosaaGender('All');
        // setJosaaCapRound('All');
        // setJosaaYear('All');
        // setJosaaRank('');
      } else if (course === "FYJC") {
        // For FYJC, set FYJC-specific options
        setBranchStreams(["All", ...data.branchStreams]);
        setInstituteTypes(["All", ...data.instituteTypes]);
        setReservationOptions(["All", ...data.reservationDetails]);
        setCategories(["All", ...data.categories]);
        setDistricts(["All", ...data.districts]);
        setCapRounds(["All", ...data.capRounds]);
        setStatusOptionsF(["All", ...data.statusOptionsF]);
        setMediumOptions(["All", ...data.mediumOptions]);

        setFyjcInstitutes([
          "All",
          ...data.institutes.filter((i) => i !== "All"),
        ]);
        // // Reset FYJC fields
        // setBranchStream('All');
        // setInstituteType('All');
        // setReservationDetails('All');
        // setCategory('All');
        // setDistrict('All');
        // setCapRound('All');
        // setTotalMarks('');
      } else if (
        ["BAMS", "BUMS", "BHMS", "BSMS", "VCI", "MBBS", "BDS", "BSC"].includes(
          course
        )
      ) {
        setBmStatesOptions(["All", ...data.states]);
        setBmInstitutesOptions(["All", ...data.institutes]);
        setBmCategoriesOptions(["All", ...data.categories]);
        setBmCapRoundsOptions(["All", ...data.capRounds]);
        setQuotaOptions(["All", ...data.quota]);

        // ───── All other existing courses
      } else {
        setInstitutes(["All", ...data.institutes.filter((i) => i !== "All")]);
        setCategories(["All", ...data.categories]);
        setGenders(["All", ...data.genders]);
        setDistricts(["All", ...data.districts]);
        setUniversities(
          course === "DTE" ||
            course === "Mtech" ||
            course === "March" ||
            course === "MPharm" ||
            course === "DYSER" ||
            course === "DYSP"
            ? []
            : ["All", ...data.universities]
        );
        // Optionally, if your backend returns cap round options, you can set them:
        setCapRounds(["All", ...data.capRounds]);
        setStatusOptions(
          course === "BTech" || course === "Mtech" || course === "DYSP"
            ? ["All", ...data.statusOptions]
            : []
        );
        setBranchOptions(
          course === "BTech" ||
            course === "Mtech" ||
            course === "DTE" ||
            course === "DYSER"
            ? ["All", ...data.branchOptions]
            : []
        );
        // setQuotaOptions(["All", ...data.quotaOptions]);
        setQuotaOptions(
          course !== "BDesign" || course !== "DYSER" || course !== "MPharm"
            ? ["All", ...data.quotaOptions]
            : []
        );

        // setInstitute('All');
        // setCategory('All');
        // setGender('All');
        // setDistrict('All');
        // setUniversity('All');
        // setCapRound('All');
        // setStatus('All');
        // setPercentile('');
        // setBranch('All');
      }
      setPage(1);
      console.log(data);
    } catch (err) {
      console.error("Error fetching options:", err);
    }
  };
  useEffect(() => {
    fetchOptions();
  }, [
    course,

    // FYJC & common
    category,
    district,
    fyjcInstitutesSelected,
    capRound,
    totalMarks,
    statusF,
    medium,

    // Josaa
    josaaInstitute,
    josaaCourse,
    josaaCategory,
    josaaGender,
    josaaCapRound,
    josaaYear,
    josaaRank,

    // Other courses
    institutesSelected,
    gender,
    university,
    percentile,
    status,
    branch,
    // BM‐type courses
    bmState,
    bmInstitute,
    bmCategory,
    bmCapRound,
    bmAIR,
    quota,
  ]);

  // Handle form submission: fetch filtered results from the backend
  const fetchCutoffs = async (pageNumber = 1) => {
    try {
      let params = { course, page: pageNumber, limit };
      if (course === "Josaa") {
        params = {
          ...params,
          institute: josaaInstitute,
          josaa_course: josaaCourse,
          category: josaaCategory,
          gender: josaaGender,
          cap_round: josaaCapRound,
          year: josaaYear,
          rank: josaaRank,
          quota: josaaQuota,
        };
      } else if (course === "FYJC") {
        // For FYJC, send the FYJC-specific parameters
        params = {
          ...params,
          branch_stream: branchStream,
          institute_type: instituteType,
          reservation_details: reservationDetails,
          category,
          district,
          cap_round: capRound,
          total_marks: totalMarks,
          status: statusF,
          institute_name: fyjcInstitutesSelected, // ← new
          medium: medium,
        };
      } else if (
        ["BAMS", "BUMS", "BHMS", "BSMS", "VCI", "MBBS", "BDS", "BSC"].includes(
          course
        )
      ) {
        // BM‐type courses:
        params = {
          ...params,
          state: bmState,
          institute_name: bmInstitute,
          category: bmCategory,
          cap_round: bmCapRound,
          rank: bmAIR,
          quota: quota,
        };
      } else {
        params = {
          course,
          institute_name: institutesSelected,
          category,
          gender,
          district,
          cap_round: capRound,
          ...(course !== "DTE" &&
            course !== "Mtech" &&
            course !== "March" &&
            course !== "MPharm" && { university }),
          ...((course === "BTech" || course === "Mtech") && { status, branch }),
          ...(course === "DTE" && { branch }),
          ...(course === "DYSP" && { status }),
          percentile,
          quota,
          page: pageNumber,
          limit,
        };
      }
      const response = await axios.get("http://localhost:5001/api/cutoffs", {
        params,
      });
      console.log("Cutoffs response:", response.data);
      // Assuming backend returns an object with "results" and "total" keys:
      if (response.data.results) {
        setResults(response.data.results);
        setTotalPages(Math.ceil(response.data.total / limit));
        return response.data.results;
      } else {
        // Fallback if backend returns an array (then totalPages is 1)
        setResults(response.data);
        setTotalPages(1);
        return response.data;
      }
    } catch (error) {
      console.error("Error fetching cutoffs:", error);
      return [];
    }
  };

  // const displayedResults = useMemo(() => {
  //     if (!results.length) return [];

  //     // pick mainKey by course:
  //     const mainKey = course === 'Josaa'
  //         ? 'rank'
  //         : course === 'FYJC'
  //             ? 'total_marks'
  //             : 'percentile';

  //     return [...results].sort((a, b) => {
  //         const av = Number(a[mainKey] || 0);
  //         const bv = Number(b[mainKey] || 0);
  //         return sortDir === 'asc' ? av - bv : bv - av;
  //     });
  // }, [results, sortDir, course]);

  // Handle form submission: fetch filtered results from the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setPage(1); // Reset to page 1 on new search
    fetchCutoffs(1);
  };

  // Define handlePageChange function to update page and fetch data
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      fetchCutoffs(newPage);
    }
  };

  // Function to export the results table to PDF
  // Print function using jsPDF with autoTable
  const drawHeader = (doc, timestamp, pageNumber) => {
    const x = 20,
      y = 20,
      w = 525,
      h = 125;
    doc.addImage("/VM_pdf_header.png", "PNG", x, y, w, h);
    if (pageNumber === 1) {
      doc.setFontSize(9).setTextColor("#777");
      const tsY = y + h + 10;
      doc.text(
        `Generated: ${timestamp}`,
        doc.internal.pageSize.getWidth() - 20,
        tsY,
        { align: "right" }
      );
    }
    // return total header height
    return h + 15;
  };

  // // 2) On mount (or page change) fetch first page:
  // useEffect(() => {
  //     fetchCutoffs(page);
  // }, [fetchCutoffs, page]);

  // Function to print filter info. Adjusts depending on the course.
  // const printFilterInfo = (doc, currentY, studentName) => {
  //   doc.setFontSize(10);
  //   doc.setTextColor(0, 0, 0);
  //   let yPosition = currentY;

  //   if (studentName) {
  //     doc.text(`Student: ${studentName}`, 20, yPosition);
  //     yPosition += 15;
  //   }
  //   if (course === "Josaa") {
  //     doc.text(`Institute: ${josaaInstitute}`, 20, yPosition);
  //     yPosition += 15;
  //     doc.text(`Course: ${josaaCourse}`, 20, yPosition);
  //     yPosition += 15;
  //     doc.text(`Category: ${josaaCategory}`, 20, yPosition);
  //     yPosition += 15;
  //     doc.text(`Gender: ${josaaGender}`, 20, yPosition);
  //     yPosition += 15;
  //     doc.text(`CAP Round: ${josaaCapRound}`, 20, yPosition);
  //     yPosition += 15;
  //     doc.text(`Year: ${josaaYear}`, 20, yPosition);
  //     yPosition += 15;
  //     doc.text(`Entered Rank: ${josaaRank}`, 20, yPosition);
  //     yPosition += 20;
  //   } else if (course === "FYJC") {
  //     doc.text(`Branch (Stream): ${branchStream}`, 20, yPosition);
  //     yPosition += 15;
  //     doc.text(`Institute Type: ${instituteType}`, 20, yPosition);
  //     yPosition += 15;
  //     doc.text(`Medium: ${medium}`, 20, yPosition);
  //     yPosition += 15;
  //     doc.text(`Status: ${statusF}`, 20, yPosition);
  //     yPosition += 15;
  //     doc.text(`Reservation Details: ${reservationDetails}`, 20, yPosition);
  //     yPosition += 15;
  //     doc.text(`Category: ${category}`, 20, yPosition);
  //     yPosition += 15;
  //     doc.text(`District: ${district}`, 20, yPosition);
  //     yPosition += 15;
  //     doc.text(`CAP Round: ${capRound}`, 20, yPosition);
  //     yPosition += 15;
  //     doc.text(`Total Marks: ${totalMarks}`, 20, yPosition);
  //     yPosition += 20;
  //   } else if (["BAMS", "BUMS", "BHMS", "BSMS"].includes(course)) {
  //     doc.text(`State: ${bmState}`, 20, yPosition);
  //     yPosition += 15;
  //     doc.text(`Institute: ${bmInstitute}`, 20, yPosition);
  //     yPosition += 15;
  //     doc.text(`Category: ${bmCategory}`, 20, yPosition);
  //     yPosition += 15;
  //     doc.text(`CAP Round: ${bmCapRound}`, 20, yPosition);
  //     yPosition += 15;
  //     doc.text(`AIR: ${bmAIR}`, 20, yPosition);
  //     yPosition += 20;
  //   } else {
  //     doc.text(`Institute: ${institutesSelected}`, 20, yPosition);
  //     yPosition += 15;
  //     doc.text(`Category: ${category}`, 20, yPosition);
  //     yPosition += 15;
  //     doc.text(`Gender: ${gender}`, 20, yPosition);
  //     yPosition += 15;
  //     doc.text(`District: ${district}`, 20, yPosition);
  //     yPosition += 15;
  //     if (
  //       course !== "DTE" &&
  //       course !== "Mtech" &&
  //       course !== "March" &&
  //       course !== "MPharm"
  //     ) {
  //       doc.text(`University: ${university}`, 20, yPosition);
  //       yPosition += 15;
  //     }
  //     if (course === "BTech" || course === "Mtech") {
  //       doc.text(`Status: ${status}`, 20, yPosition);
  //       yPosition += 15;
  //       doc.text(`Branch: ${branch}`, 20, yPosition);
  //       yPosition += 15;
  //     }
  //     doc.text(`CAP Round: ${capRound}`, 20, yPosition);
  //     yPosition += 15;
  //     doc.text(`Percentile: ${percentile}`, 20, yPosition);
  //     yPosition += 15;
  //     yPosition += 5;
  //   }
  //   return yPosition;
  // };

  // const printFilterInfo = (doc, currentY, studentName) => {
  //   doc.setFontSize(14);
  //   doc.setTextColor(0, 0, 0);
  //   let y = currentY;
  //   let x = 50;
  //   const maxWidth = 700;
  //   const gapX = 50; //gap between text
  //   const gapY = 10;

  //   const printField = (label, value) => {
  //     const text = `${label}: ${value || "N/A"}`;
  //     doc.text(text, x, y);
  //     const textWidth = doc.getTextWidth(text);

  //     x += textWidth + gapX;

  //     // if (x > maxWidth) {
  //     //   x = 20;
  //     //   y += 10;
  //     // }
  //   };

  //   if (studentName) printField("Student", studentName);

  //   if (course === "Josaa") {
  //     printField("Institute", josaaInstitute);
  //     printField("Course", josaaCourse);
  //     printField("Category", josaaCategory);
  //     printField("Gender", josaaGender);
  //     printField("CAP Round", josaaCapRound);
  //     printField("Year", josaaYear);
  //     printField("Entered Rank", josaaRank);
  //   } else if (course === "FYJC") {
  //     printField("Branch (Stream)", branchStream);
  //     printField("Institute Type", instituteType);
  //     printField("Medium", medium);
  //     printField("Status", statusF);
  //     printField("Reservation Details", reservationDetails);
  //     printField("Category", category);
  //     printField("District", district);
  //     printField("CAP Round", capRound);
  //     printField("Total Marks", totalMarks);
  //   } else if (["BAMS", "BUMS", "BHMS", "BSMS"].includes(course)) {
  //     printField("State", bmState);
  //     printField("Institute", bmInstitute);
  //     printField("Category", bmCategory);
  //     printField("CAP Round", bmCapRound);
  //     printField("AIR", bmAIR);
  //   } else {
  //     printField("Institute", institutesSelected);
  //     printField("Category", category);
  //     printField("Gender", gender);
  //     printField("District", district);

  //     if (!["DTE", "Mtech", "March", "MPharm"].includes(course)) {
  //       printField("University", university);
  //     }

  //     if (["BTech", "Mtech"].includes(course)) {
  //       printField("Status", status);
  //       printField("Branch", branch);
  //     }

  //     printField("CAP Round", capRound);
  //     printField("Percentile", percentile);
  //   }

  //   // autoTable(doc, {
  //   //   startY: currentY,
  //   //   head: [["Field", "Value"]],
  //   //   body: tableRows,
  //   //   theme: "grid",
  //   //   styles: { fontSize: 13 },
  //   //   headStyles: { fillColor: [22, 141, 229], textColor: [255, 255, 255] },
  //   //   margin: { left: 20, right: 20 },
  //   // });

  //   // return doc.lastAutoTable.finalY + 10;
  //   return y + 15;
  // };

  const printFilterInfo = (doc, startY, studentName) => {
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);

    let x = 50;
    let y = startY + 10;
    const gapX = 50;
    const lineHeight = 20;
    const maxWidth = 500;

    const fields = [];

    if (studentName) {
      doc.setFont("helvetica", "bold");
      doc.text("Student:", x, y);
      doc.setFont("helvetica", "normal");
      doc.text(` ${studentName}`, x + doc.getTextWidth("Student: "), y);
      y += lineHeight;
    }

    if (course === "Josaa") {
      fields.push(["Institute", josaaInstitute]);
      fields.push(["Course", josaaCourse]);
      fields.push(["Category", josaaCategory]);
      fields.push(["Gender", josaaGender]);
      fields.push(["CAP Round", josaaCapRound]);
      fields.push(["Year", josaaYear]);
      fields.push(["Quota", josaaQuota]);
      fields.push(["Entered Rank", josaaRank]);
    } else if (course === "FYJC") {
      fields.push(["Branch (Stream)", branchStream]);
      fields.push(["Institute Type", instituteType]);
      fields.push(["Medium", medium]);
      fields.push(["Status", statusF]);
      fields.push(["Reservation Details", reservationDetails]);
      fields.push(["Category", category]);
      fields.push(["District", district]);
      fields.push(["CAP Round", capRound]);
      fields.push(["Total Marks", totalMarks]);
    } else if (
      ["BAMS", "BUMS", "BHMS", "BSMS", "VCI", "MBBS", "BDS", "BSC"].includes(
        course
      )
    ) {
      fields.push(["State", bmState]);
      fields.push(["Institute", bmInstitute]);
      fields.push(["Category", bmCategory]);
      fields.push(["CAP Round", bmCapRound]);
      if (["MBBS", "BDS", "BSC"].includes(course)) {
        fields.push(["Quota", quota]);
      }
      fields.push(["AIR", bmAIR]);
    } else {
      fields.push(["Institute", institutesSelected]);
      fields.push(["Category", category]);
      fields.push(["Gender", gender]);
      fields.push(["District", district]);
      if (!["DTE", "Mtech", "March", "MPharm"].includes(course)) {
        fields.push(["University", university]);
      }
      if (["BTech", "Mtech"].includes(course)) {
        fields.push(["Status", status]);
        fields.push(["Branch", branch]);
      }
      fields.push(["CAP Round", capRound]);
      fields.push(["Percentile", percentile]);
      if (!["DYSER", "BDesign", "MPharm"].includes(course)) {
        fields.push(["Quota", quota]);
      }
    }

    x = 50;
    for (let [label, value] of fields) {
      const labelText = `${label}:  `;
      const valueText = `${value ?? "N/A"}`;
      const fullText = labelText + valueText;
      // const labelWidth = doc.getTextWidth(textLabel);
      // const totalWidth = labelWidth + doc.getTextWidth(textValue) + 10;

      // if (x + totalWidth > maxWidth) {
      //   y += lineHeight;
      //   x = 50;
      // }
      const splitValue = doc.splitTextToSize(valueText, 300); // Adjust width

      if (x + doc.getTextWidth(labelText + splitValue[0]) > maxWidth) {
        y += lineHeight;
        x = 50;
      }

      doc.setFont("helvetica", "bold");
      doc.text(labelText, x, y);

      const labelWidth = doc.getTextWidth(labelText);

      doc.setFont("helvetica", "normal");
      // doc.text(textValue, x + labelWidth, y);
      for (let i = 0; i < splitValue.length; i++) {
        if (i === 0) {
          doc.text(splitValue[i], x + labelWidth, y);
        } else {
          y += lineHeight;
          doc.text(splitValue[i], x, y);
        }
      }

      x += doc.getTextWidth(labelText + splitValue[0]) + gapX;

      // x += totalWidth + gapX;
    }

    return y + lineHeight;
  };

  const fetchAllCutoffs = async () => {
    const allData = [];
    for (let p = 1; p <= totalPages; p++) {
      const pageData = await fetchCutoffs(p); // Await the Promise here
      allData.push(...pageData); // Now pageData is an array, so spreading works
    }
    return allData;
  };
  // Print function using jsPDF-AutoTable
  const handlePrint = async () => {
    const allCutoffs = await fetchAllCutoffs();
    const now = new Date();
    const timestamp = now
      .toLocaleString(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(",", "");

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "A4",
    });

    // Measure header
    const headerH = drawHeader(doc, timestamp, 1);
    // Measure filters (including studentName)
    const filterEndY = printFilterInfo(doc, headerH + 25, studentName);

    const visibleKeysByCourse = {
      FYJC: [
        { key: "udise_no", label: "Udise No." },
        { key: "institute_name", label: "Institute Name" },
        { key: "status", label: "Status" },
        { key: "medium", label: "Medium" },
        { key: "reservation_details", label: "Reservation Details" },
        { key: "district", label: "District" },
        { key: "branch_stream", label: "Branch" },
        { key: "total_marks", label: "Total Marks" },
        { key: "cap_round", label: "Cap Round" },
      ],
      Josaa: [
        { key: "institute", label: "Institute" },
        { key: "course", label: "Course" },
        { key: "category", label: "Category" },
        { key: "gender", label: "Gender" },
        { key: "exam_year", label: "Year" },
        { key: "cap_round", label: "Cap Round" },
        { key: "opening_rank", label: "Opening Rank" },
        { key: "closing_rank", label: "Closing Rank" },
      ],
      BM: [
        { key: "institute_name", label: "Institute" },
        { key: "category", label: "Category" },
        { key: "gender", label: "Gender" },
        { key: "quota", label: "quota" },
        { key: "state", label: "state" },
        { key: "university", label: "University" },
        { key: "Rank", label: "Rank" },
        { key: "capRound", label: "Cap Round" },
      ],
      Rest: [
        { key: "institute_name", label: "Institute" },
        { key: "category", label: "Category" },
        { key: "gender", label: "Gender" },
        { key: "district", label: "District" },
        { key: "university", label: "University" },
        { key: "percentile", label: "Rank" },
        { key: "rank", label: "Rank" },
        { key: "capRound", label: "Cap Round" },
      ],
    };

    const currentColumns = (
      visibleKeysByCourse[course] ||
      Object.keys(allCutoffs[0] || {})
        .filter((key) => key !== "id")
        .map((key) => ({ key, label: key }))
    ).filter((col) => col.key !== "id");

    const head = [currentColumns.map((col) => col.label)];

    const body = allCutoffs.map((item) =>
      currentColumns.map((col) => item[col.key] ?? "")
    );

    // Now draw the table below that
    autoTable(doc, {
      // html: "#resultsTable",
      head,
      body,
      margin: { top: filterEndY + 10 },
      startY: filterEndY + 10,
      headStyles: { fillColor: [22, 141, 229], textColor: [255, 255, 255] },
      styles: {
        fontSize: 9,
        cellPadding: 6,
        lineColor: [200, 200, 200],
        lineWidth: 0.5,
      },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      didDrawPage: (data) => {
        const page = data.pageNumber;
        drawHeader(doc, timestamp, page);
        // Only re-draw filters on the _first_ page:

        printFilterInfo(doc, headerH + 25, studentName, data);
      },
    });

    doc.save(`${course} VidyarthiMitra results.pdf`);
  };

  return (
    <div className="container">
      <div className="app-header">VidyarthiMitra College Predictor</div>

      {/* Course Selector */}
      <div style={{ marginBottom: "20px" }}>
        <label
          style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}
        >
          Select Admission Process:
        </label>
        <select
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            width: "100%",
            maxWidth: "400px",
            fontSize: "16px",
          }}
        >
          <option value="BDesign">Bachelor of Design (BDesign)</option>
          <option value="BAMS">
            Bachelor of Ayurvedic Medicine and Surgery (BAMS)
          </option>
          <option value="BArch">Bachelor of Architecture (BArch)</option>
          <option value="BBA/BMS/BBM">
            Bachelor of Business Administration / Management Studies /
            Management (BBA/BMS/BBM)
          </option>
          <option value="BCA_MCA Integrated">BCA-MCA Integrated</option>

          <option value="BDS">Bachelor of Dental Surgery (BDS)</option>
          <option value="BPharm">Bachelor of Pharmacy / Pharm D</option>
          <option value="BSC">Bachelor of Science (BSC)</option>
          <option value="BSMS">
            Bachelor of Siddha Medicine and Surgery (BSMS)
          </option>
          <option value="BTech">Bachelor of Technology (BTech)</option>
          <option value="BHMS">
            Bachelor of Homeopathic Medicine and Surgery (BHMS)
          </option>
          <option value="DTE">
            Diploma in Technical Education (DTE/Polytechnic)
          </option>
          <option value="DYSER">Direct Second Year Engineering (DSE)</option>
          <option value="DYSE">
            Direct Second Year Engineering (Working Professional)
          </option>
          <option value="DYSP">Direct Second Year Pharmacy (DSP)</option>
          <option value="FYJC">First Year Junior College (FYJC)</option>
          <option value="HMCT">
            Hotel Management and Catering Technology (HMCT)
          </option>
          <option value="Josaa">Joint Seat Allocation Authority (JOSAA)</option>
          <option value="MBA">Master of Business Administration (MBA)</option>
          <option value="MBA_MMS(Working_Professional)">
            MBA/MMS (Working Professional)
          </option>
          <option value="MBBS">
            Bachelor of Medicine and Bachelor of Surgery (MBBS)
          </option>
          <option value="MCA">Master of Computer Applications (MCA)</option>
          <option value="March">Master of Architecture (MArch)</option>
          <option value="MPharm">Master of Pharmacy (MPharm)</option>
          <option value="Mtech">Master of Technology (MTech)</option>
          <option value="M.E/M.Tech(Working Professional)">
            M.E / M.Tech (Working Professional)
          </option>
          <option value="Pharmacy Practice">Pharmacy Practice</option>
          <option value="VCI">Veterinary Council of India (VCI)</option>
          <option value="BUMS">
            Bachelor of Unani Medicine and Surgery (BUMS)
          </option>
          <option value="MAFSU">Maharashtra Animal and Fishery Sciences</option>
        </select>
      </div>

      {/* Filter Form */}
      <div className="form-card">
        <h2>Filter Colleges</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div>
              <label>Student Name:</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
              />
            </div>
          </div>
          {course === "Josaa" ? (
            <div className="form-row">
              <div>
                <label>Institute:</label>
                <select
                  value={josaaInstitute}
                  onChange={(e) => setJosaaInstitute(e.target.value)}
                >
                  {josaaInstitutes.map((inst, idx) => (
                    <option key={idx} value={inst}>
                      {inst}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Course:</label>
                <select
                  value={josaaCourse}
                  onChange={(e) => setJosaaCourse(e.target.value)}
                >
                  {josaaCourses.map((c, idx) => (
                    <option key={idx} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Category:</label>
                <select
                  value={josaaCategory}
                  onChange={(e) => setJosaaCategory(e.target.value)}
                >
                  {josaaCategories.map((cat, idx) => (
                    <option key={idx} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Quota:</label>
                <select
                  value={josaaQuota}
                  onChange={(e) => setJosaaQuota(e.target.value)}
                >
                  {josaaQuotas.map((cat, idx) => (
                    <option key={idx} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Gender:</label>
                <select
                  value={josaaGender}
                  onChange={(e) => setJosaaGender(e.target.value)}
                >
                  {josaaGenders.map((g, idx) => (
                    <option key={idx} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>CAP Round:</label>
                <select
                  value={josaaCapRound}
                  onChange={(e) => setJosaaCapRound(e.target.value)}
                >
                  {josaaCapRounds.map((r, idx) => (
                    <option key={idx} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Year:</label>
                <select
                  value={josaaYear}
                  onChange={(e) => setJosaaYear(e.target.value)}
                >
                  {josaaYears.map((yr, idx) => (
                    <option key={idx} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Enter Rank:</label>
                <input
                  type="number"
                  value={josaaRank}
                  onChange={(e) => setJosaaRank(e.target.value)}
                />
              </div>
            </div>
          ) : course === "FYJC" ? (
            // Render FYJC-specific filter fields
            <div className="form-row">
              <div>
                <label>District:</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                >
                  {districts.map((dist, idx) => (
                    <option key={idx} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ minWidth: 300 }}>
                <label>Institute Name:</label>
                <Select
                  options={[
                    { label: "All", value: "All" },
                    ...fyjcInstitutes
                      .filter((i) => i !== "All")
                      .map((inst) => ({ label: inst, value: inst })),
                  ]}
                  // pick out the single selected option (or default to “All”)
                  value={
                    fyjcInstitutesSelected
                      ? {
                          label: fyjcInstitutesSelected,
                          value: fyjcInstitutesSelected,
                        }
                      : { label: "All", value: "All" }
                  }
                  onChange={(option) => {
                    // option is a single {label,value}, so store it as a one-element array
                    setFyjcInstitutesSelected(option.value);
                  }}
                  placeholder="Select Institute…"
                />
              </div>
              <div>
                <label>Status:</label>
                <select
                  value={statusF}
                  onChange={(e) => setStatusF(e.target.value)}
                >
                  {statusOptionsF.map((s, i) => (
                    <option key={i} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Medium:</label>
                <select
                  value={medium}
                  onChange={(e) => setMedium(e.target.value)}
                >
                  {mediumOptions.map((m, i) => (
                    <option key={i} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Branch (Stream):</label>
                <select
                  value={branchStream}
                  onChange={(e) => setBranchStream(e.target.value)}
                >
                  {branchStreams.map((b, idx) => (
                    <option key={idx} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Institute Type:</label>
                <select
                  value={instituteType}
                  onChange={(e) => setInstituteType(e.target.value)}
                >
                  {instituteTypes.map((type, idx) => (
                    <option key={idx} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Reservation Details:</label>
                <select
                  value={reservationDetails}
                  onChange={(e) => setReservationDetails(e.target.value)}
                >
                  {reservationOptions.map((r, idx) => (
                    <option key={idx} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Category:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>CAP Round:</label>
                <select
                  value={capRound}
                  onChange={(e) => setCapRound(e.target.value)}
                >
                  {capRounds.map((round, idx) => (
                    <option key={idx} value={round}>
                      {round}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Total Marks:</label>
                <input
                  type="number"
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(e.target.value)}
                />
              </div>
            </div>
          ) : [
              "BAMS",
              "BUMS",
              "BHMS",
              "BSMS",
              "VCI",
              "MBBS",
              "BDS",
              "BSC",
            ].includes(course) ? (
            <div className="form-row">
              <div>
                <label>State:</label>
                <select
                  value={bmState}
                  onChange={(e) => setBmState(e.target.value)}
                >
                  {bmStatesOptions.map((st, idx) => (
                    <option key={idx} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ minWidth: 300 }}>
                <label>Institute Name:</label>
                <Select
                  options={[
                    // { label: "All", value: "All" },
                    ...bmInstitutesOptions.map((inst) => ({
                      label: inst,
                      value: inst,
                    })),
                  ]}
                  value={{ label: bmInstitute, value: bmInstitute }}
                  onChange={(opt) => setBmInstitute(opt.value)}
                  placeholder="Select Institute…"
                />
              </div>
              {course !== "MBBS" && course !== "BDS" && course !== "BSC" && (
                <div>
                  <label>Category:</label>
                  <select
                    value={bmCategory}
                    onChange={(e) => setBmCategory(e.target.value)}
                  >
                    {bmCategoriesOptions.map((cat, idx) => (
                      <option key={idx} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label>CAP Round:</label>
                <select
                  value={bmCapRound}
                  onChange={(e) => setBmCapRound(e.target.value)}
                >
                  {bmCapRoundsOptions.map((r, idx) => (
                    <option key={idx} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>AIR / Rank:</label>
                <input
                  type="number"
                  value={bmAIR}
                  onChange={(e) => setBmAIR(e.target.value)}
                />
              </div>
              {(course === "MBBS" || course === "BDS" || course === "BSC") && (
                <div>
                  <label>Quota:</label>
                  <select
                    value={quota}
                    onChange={(e) => setQuota(e.target.value)}
                  >
                    {quotaOptions.map((q, idx) => (
                      <option key={idx} value={q}>
                        {q}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          ) : course === "DYSER" ? (
            <div className="form-row">
              <div>
                <label>District:</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                >
                  {districts.map((d, idx) => (
                    <option key={idx} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ minWidth: 300 }}>
                <label>Institute Name:</label>
                <Select
                  options={[
                    { label: "All", value: "All" },
                    ...institutes
                      .filter((i) => i !== "All")
                      .map((inst) => ({ label: inst, value: inst })),
                  ]}
                  // single‐select mode
                  value={{
                    label: institutesSelected,
                    value: institutesSelected,
                  }}
                  onChange={(opt) => setInstitutesSelected(opt.value)}
                  placeholder="Select Institute…"
                />
              </div>
              <div>
                <label>Branch:</label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                >
                  {branchOptions.map((branch, idx) => (
                    <option key={idx} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Category:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Gender:</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  {genders.map((g, idx) => (
                    <option key={idx} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>CAP Round:</label>
                <select
                  value={capRound}
                  onChange={(e) => setCapRound(e.target.value)}
                >
                  {capRounds.map((r, idx) => (
                    <option key={idx} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Percentile:</label>
                <input
                  type="number"
                  step="0.01"
                  value={percentile}
                  onChange={(e) => setPercentile(e.target.value)}
                />
              </div>
            </div>
          ) : course === "DYSP" ? (
            <div className="form-row">
              <div>
                <label>District:</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                >
                  {districts.map((d, idx) => (
                    <option key={idx} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ minWidth: 300 }}>
                <label>Institute Name:</label>
                <Select
                  options={[
                    { label: "All", value: "All" },
                    ...institutes
                      .filter((i) => i !== "All")
                      .map((inst) => ({ label: inst, value: inst })),
                  ]}
                  // single‐select mode
                  value={{
                    label: institutesSelected,
                    value: institutesSelected,
                  }}
                  onChange={(opt) => setInstitutesSelected(opt.value)}
                  placeholder="Select Institute…"
                />
              </div>

              <div>
                <label>Quota:</label>
                <select
                  value={quota}
                  onChange={(e) => setQuota(e.target.value)}
                >
                  {quotaOptions.map((q, idx) => (
                    <option key={idx} value={q}>
                      {q}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>Status:</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {statusOptions.map((branch, idx) => (
                    <option key={idx} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Category:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Gender:</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  {genders.map((g, idx) => (
                    <option key={idx} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>CAP Round:</label>
                <select
                  value={capRound}
                  onChange={(e) => setCapRound(e.target.value)}
                >
                  {capRounds.map((r, idx) => (
                    <option key={idx} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Percentile:</label>
                <input
                  type="number"
                  step="0.01"
                  value={percentile}
                  onChange={(e) => setPercentile(e.target.value)}
                />
              </div>
            </div>
          ) : (
            // Render existing filter fields for other courses
            <div className="form-row">
              <div>
                <label>District:</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                >
                  {districts.map((dist, idx) => (
                    <option key={idx} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ minWidth: 300 }}>
                <label>Institute Name:</label>
                <Select
                  options={[
                    { label: "All", value: "All" },
                    ...institutes
                      .filter((i) => i !== "All")
                      .map((inst) => ({ label: inst, value: inst })),
                  ]}
                  // single‐select mode
                  value={{
                    label: institutesSelected,
                    value: institutesSelected,
                  }}
                  onChange={(opt) => setInstitutesSelected(opt.value)}
                  placeholder="Select Institute…"
                />
              </div>

              <div>
                <label>Category:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              {course !== "BDesign" &&
                course !== "DYSER" &&
                course !== "MPharm" && (
                  <div>
                    <label>Quota:</label>
                    <select
                      value={quota}
                      onChange={(e) => setQuota(e.target.value)}
                    >
                      {quotaOptions.map((q, idx) => (
                        <option key={idx} value={q}>
                          {q}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              <div>
                <label>Gender:</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  {genders.map((g, idx) => (
                    <option key={idx} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              {course !== "DTE" &&
                course !== "Mtech" &&
                course !== "March" &&
                course !== "MPharm" && (
                  <div>
                    <label>University:</label>
                    <select
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                    >
                      {universities.map((uni, idx) => (
                        <option key={idx} value={uni}>
                          {uni}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              <div>
                <label>CAP Round:</label>
                <select
                  value={capRound}
                  onChange={(e) => setCapRound(e.target.value)}
                >
                  {capRounds.map((round, idx) => (
                    <option key={idx} value={round}>
                      {round}
                    </option>
                  ))}
                </select>
              </div>
              {(course === "BTech" || course === "Mtech") && (
                <>
                  <div>
                    <label>Status:</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      {statusOptions.map((st, idx) => (
                        <option key={idx} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
              {(course === "BTech" ||
                course === "Mtech" ||
                course === "DTE") && (
                <>
                  <div>
                    <label>Branch:</label>
                    <select
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                    >
                      {branchOptions.map((b, idx) => (
                        <option key={idx} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div>
                <label>Percentile:</label>
                <input
                  type="number"
                  step="0.01"
                  value={percentile}
                  onChange={(e) => setPercentile(e.target.value)}
                />
              </div>
            </div>
          )}
          <button className="submit-btn" type="submit">
            Submit
          </button>
        </form>
      </div>
      {/* Pagination Controls */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>

      {/* Print Option */}
      <div className="print-btn-container">
        <button onClick={handlePrint} className="print-btn">
          Print Results to PDF
        </button>
      </div>

      {/* <div style={{ margin: '1rem 0' }}>
                <button
                    onClick={() => {
                        // flip direction
                        const next = sortDir === 'asc' ? 'desc' : 'asc';
                        setSortDir(next);

                        // reset to page 1 and fetch immediately
                        setPage(1);
                        fetchCutoffs(1);
                    }}
                >
                    Sort {sortDir === 'asc' ? '↓ Descending' : '↑ Ascending'}
                </button>
            </div>

 */}

      {/* Results Table */}
      <h2>Results</h2>
      {course === "Josaa" ? (
        <table id="resultsTable" className="results-table">
          <thead>
            <tr>
              <th>Institute</th>
              <th>Course</th>
              <th>Category</th>
              <th>Gender</th>
              <th>Year</th>
              <th>CAP Round</th>
              <th>Quota</th>
              <th>Opening Rank</th>
              <th>Closing Rank</th>
            </tr>
          </thead>
          <tbody>
            {results.length > 0 ? (
              results.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.institute}</td>
                  <td>{row.course}</td>
                  <td>{row.category}</td>
                  <td>{row.gender}</td>
                  <td>{row.exam_year}</td>
                  <td>{row.cap_round}</td>
                  <td>{row.quota}</td>
                  <td>{row.opening_rank}</td>
                  <td>{row.closing_rank}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      ) : course === "FYJC" ? (
        <table id="resultsTable" className="results-table">
          <thead>
            <tr>
              <th>Udise No.</th>
              <th>Institute Name</th>
              <th>Status</th>
              <th>Medium</th>
              <th>Institute Type</th>
              <th>Reservation Details</th>
              <th>District</th>
              <th>Branch</th>
              <th>Total Marks</th>
              <th>CAP Round</th>
            </tr>
          </thead>
          <tbody>
            {results.length > 0 ? (
              results.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.udise_no}</td>
                  <td>{row.institute_name}</td>
                  <td>{row.status}</td>
                  <td>{row.medium}</td>
                  <td>{row.institute_type}</td>
                  <td>{row.reservation_details}</td>
                  <td>{row.district}</td>
                  <td>{row.branch_stream || "—"}</td>
                  <td>{row.total_marks || "—"}</td>
                  <td>{row.cap_round}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      ) : [
          "BAMS",
          "BUMS",
          "BHMS",
          "BSMS",
          "VCI",
          "MBBS",
          "BDS",
          "BSC",
        ].includes(course) ? (
        <table id="resultsTable" className="results-table">
          <thead>
            <tr>
              <th>Institute</th>
              <th>State</th>
              {course !== "MBBS" && course !== "BDS" && course !== "BSC" && (
                <th>Category</th>
              )}
              <th>CAP Round</th>
              <th>AIR</th>
              {(course === "MBBS" || course === "BDS" || course === "BSC") && (
                <th>quota</th>
              )}
            </tr>
          </thead>
          <tbody>
            {results.length > 0 ? (
              results.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.institute_name}</td>
                  <td>{row.state}</td>
                  {course !== "MBBS" &&
                    course !== "BDS" &&
                    course !== "BSC" && <td>{row.category}</td>}
                  <td>{row.cap_round}</td>
                  <td>{row.rank}</td>
                  {(course === "MBBS" ||
                    course === "BDS" ||
                    course === "BSC") && <td>{row.quota}</td>}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      ) : (
        // Existing results table for other courses
        <table id="resultsTable" className="results-table">
          <thead>
            <tr>
              <th>Institute Name</th>
              <th>Category</th>
              <th>Gender</th>
              <th>District</th>
              {course !== "DTE" &&
                course !== "Mtech" &&
                course !== "March" &&
                course !== "MPharm" &&
                course !== "DYSER" &&
                course !== "DYSP" && <th>University</th>}
              {(course === "BTech" ||
                course === "Mtech" ||
                course === "DYSP") && <th>Status</th>}
              {(course === "BTech" ||
                course === "Mtech" ||
                course === "DTE") && <th>Branch</th>}
              <th>Percentile</th>
              {course !== "DYSER" && course !== "DYSP" && <th>Rank</th>}
              <th>CAP Round</th>
              {course !== "BDesign" &&
                course !== "DYSER" &&
                course !== "MPharm" && <th>Quota</th>}
            </tr>
          </thead>
          <tbody>
            {results.length > 0 ? (
              results.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.institute_name}</td>
                  <td>{row.category}</td>
                  <td>{row.gender}</td>
                  <td>{row.district}</td>
                  {course !== "DTE" &&
                    course !== "Mtech" &&
                    course !== "March" &&
                    course !== "MPharm" &&
                    course !== "DYSER" &&
                    course !== "DYSP" && <td>{row.university}</td>}
                  {(course === "BTech" ||
                    course === "Mtech" ||
                    course === "DYSP") && <td>{row.status}</td>}
                  {(course === "BTech" ||
                    course === "Mtech" ||
                    course === "DTE") && <td>{row.branch}</td>}
                  <td>{row.percentile}</td>
                  {course !== "DYSER" && course !== "DYSP" && (
                    <td>{row.rank}</td>
                  )}
                  <td>{row.cap_round}</td>
                  {course !== "BDesign" &&
                    course !== "DYSER" &&
                    course !== "MPharm" && <td>{row.quota}</td>}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={course !== "DTE" ? 9 : 8}
                  style={{ textAlign: "center" }}
                >
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      {/* Pagination Controls at the bottom */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
      <div className="print-btn-container">
        <button onClick={handlePrint} className="print-btn">
          Print Results to PDF
        </button>
      </div>
    </div>
  );
};

export default CutoffForm;
