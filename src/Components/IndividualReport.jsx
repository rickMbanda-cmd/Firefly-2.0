import React, { useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  getSubjectsByClass,
  getSubjectDisplayName,
  getRubric,
} from "../Utils/subjectsByClass";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const getSubjectRemark = (rubric) => {
  const remarks = {
    "Exceeds Expectations (E.E)": "Excellent",
    "Meets Expectations (M.E)": "Outstanding",
    "Approaching Expectations (A.E)": "You can do better",
    "Below Expectations (B.E)": "Needs improved study habits",
  };

  if (rubric === "E.E" || rubric === "Exceeds Expectations (E.E)") {
    return remarks["Exceeds Expectations (E.E)"];
  }
  if (rubric === "M.E" || rubric === "Meets Expectations (M.E)") {
    return remarks["Meets Expectations (M.E)"];
  }
  if (rubric === "A.E" || rubric === "Approaching Expectations (A.E)") {
    return remarks["Approaching Expectations (A.E)"];
  }
  if (rubric === "B.E" || rubric === "Below Expectations (B.E)") {
    return remarks["Below Expectations (B.E)"];
  }

  return remarks[rubric] || remarks["Below Expectations (B.E)"];
};

const getOverallRemark = (rubric) => {
  const remarks = {
    "Exceeds Expectations (E.E)":
      "An exemplary learner; continues to set the bar for others.",
    "Meets Expectations (M.E)":
      "Has a good grasp of concepts and shows steady improvement.",
    "Approaching Expectations (A.E)":
      "Beginning to understand core ideas; would benefit from targeted support.",
    "Below Expectations (B.E)":
      "Can do better with increased effort and a structured learning plan.",
  };
  return remarks[rubric] || remarks["Below Expectations (B.E)"];
};

const getTrendAnalysis = (currentStudent, historicalData) => {
  if (!historicalData || historicalData.length === 0) {
    return null;
  }

  const currentMean = currentStudent.mean;
  const previousMean = historicalData[historicalData.length - 1]?.mean;

  if (!previousMean || !currentMean) return null;

  const improvement = currentMean - previousMean;
  const percentageChange = ((improvement / previousMean) * 100).toFixed(1);

  let trend = "";
  let trendIcon = "";
  let trendColor = "";

  if (improvement > 5) {
    trend = "Significant Improvement";
    trendIcon = "📈";
    trendColor = "#10b981";
  } else if (improvement > 0) {
    trend = "Slight Improvement";
    trendIcon = "📊";
    trendColor = "#059669";
  } else if (improvement > -5) {
    trend = "Stable Performance";
    trendIcon = "📉";
    trendColor = "#f59e0b";
  } else {
    trend = "Needs Attention";
    trendIcon = "⚠️";
    trendColor = "#ef4444";
  }

  return {
    trend,
    trendIcon,
    trendColor,
    improvement: improvement.toFixed(1),
    percentageChange,
  };
};

const getPerformanceDeviation = (studentMean, classMean) => {
  if (!studentMean || !classMean) return null;

  const deviation = studentMean - classMean;
  const deviationType = deviation >= 0 ? "above" : "below";

  return {
    value: Math.abs(deviation).toFixed(1),
    type: deviationType,
    color: deviation >= 0 ? "#10b981" : "#ef4444",
  };
};

const IndividualReport = ({ student, classData, historicalData = [] }) => {
  const [teacherComment, setTeacherComment] = useState("");
  const [principalStamp, setPrincipalStamp] = useState(false);

  // Class teacher mapping
  const classTeachers = {
    Playgroup: "Tr Fridah",
    PP1: "Tr Jane",
    PP2: "Tr Clarice",
    "Grade 1": "Tr Margaret",
    "Grade 2": "Tr Emily",
    "Grade 3": "Tr Angel",
    "Grade 4": "Tr Erick",
    "Grade 5": "Tr Webster",
    "Grade 6": "Tr Njeri",
    "Grade 7": "Tr David",
    "Grade 8": "Tr Ndichu",
    "Grade 9": "Tr Clinton",
  };

  const classTeacher = classTeachers[student.class] || "Not Assigned";

  const subjects = getSubjectsByClass(student.class);

  const subjectMarks = {};
  let totalMarks = 0;
  subjects.forEach((subject) => {
    subjectMarks[subject] = student[subject];
    const score = parseFloat(student[subject]);
    if (!isNaN(score)) {
      totalMarks += score;
    }
  });

  const classStats = useMemo(() => {
    if (!classData || classData.length === 0) return null;

    const validMeans = classData
      .map((s) => s.mean)
      .filter((mean) => typeof mean === "number" && !isNaN(mean));

    if (validMeans.length === 0) return null;

    const sum = validMeans.reduce((a, b) => a + b, 0);
    const average = sum / validMeans.length;
    const highest = Math.max(...validMeans);
    const lowest = Math.min(...validMeans);

    const subjectAverages = {};
    subjects.forEach((subject) => {
      const subjectScores = classData
        .map((s) => parseFloat(s[subject]))
        .filter((score) => !isNaN(score));

      subjectAverages[subject] =
        subjectScores.length > 0
          ? subjectScores.reduce((a, b) => a + b, 0) / subjectScores.length
          : 0;
    });

    return { average, highest, lowest, subjectAverages };
  }, [classData, subjects]);

  const chartData = useMemo(() => {
    if (!classStats || !classStats.subjectAverages) return null;

    const studentScores = subjects.map(
      (subject) => parseFloat(student[subject]) || 0,
    );
    const classAverages = subjects.map(
      (subject) => classStats.subjectAverages[subject] || 0,
    );
    const subjectLabels = subjects.map((subject) =>
      getSubjectDisplayName(subject),
    );

    return {
      labels: subjectLabels,
      datasets: [
        {
          label: `${student.name} (Individual)`,
          data: studentScores,
          backgroundColor: "rgba(99, 102, 241, 0.8)",
          borderColor: "rgba(99, 102, 241, 1)",
          borderWidth: 2,
          borderRadius: 6,
          borderSkipped: false,
        },
        {
          label: "Class Average",
          data: classAverages,
          backgroundColor: "rgba(239, 68, 68, 0.8)",
          borderColor: "rgba(239, 68, 68, 1)",
          borderWidth: 2,
          borderRadius: 6,
          borderSkipped: false,
        },
      ],
    };
  }, [student, classStats, subjects]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(99, 102, 241, 0.5)",
        borderWidth: 1,
        cornerRadius: 6,
        displayColors: true,
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: "Marks",
          font: {
            size: 11,
            weight: "bold",
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 10,
          },
        },
      },
      x: {
        title: {
          display: false,
        },
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 30,
          minRotation: 0,
          font: {
            size: 9,
          },
        },
      },
    },
  };

  // Calculate student position
  const totalStudents = classData ? classData.length : 0;
  const studentPosition = student.position || null;
  const positionText = studentPosition
    ? `Position ${studentPosition} out of ${totalStudents}`
    : "-";

  // Get trend analysis
  const trendAnalysis = getTrendAnalysis(student, historicalData);

  // Get performance deviation
  const deviation = getPerformanceDeviation(student.mean, classStats?.average);

  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const examType = student.examType;
  const displayExamType =
    examType === "opener"
      ? "Opener"
      : examType === "midterm"
        ? "Midterm"
        : examType === "endterm"
          ? "Endterm"
          : examType;

  const overallRubric = student.rubric || getRubric(student.mean);

  const shouldShowTrend = !(
    student.examType === "opener" && student.term === "Term 1"
  );
  const shouldShowDeviation = !(
    student.examType === "opener" && student.term === "Term 1"
  );

  const styles = {
    container: {
      fontFamily: "Arial, sans-serif",
      maxWidth: "800px",
      margin: "0 auto",
      padding: "20px",
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      "@media print": {
        boxShadow: "none",
        margin: "0",
        padding: "10px",
        maxWidth: "none",
      },
    },
    letterheadContainer: {
      textAlign: "center",
      marginBottom: "20px",
    },
    letterheadImage: {
      width: "100%",
      maxWidth: "600px",
      height: "auto",
    },
    titleSection: {
      textAlign: "center",
      marginBottom: "20px",
    },
    reportTitle: {
      color: "#2c3e50",
      fontSize: "20px",
      fontWeight: "bold",
      marginBottom: "8px",
    },
    subtitle: {
      color: "#777",
      fontSize: "16px",
    },
    topSection: {
      display: "flex",
      gap: "20px",
      marginBottom: "25px",
      "@media (max-width: 768px)": {
        flexDirection: "column",
      },
    },
    studentInfoCompact: {
      flex: "0 0 300px",
      padding: "20px",
      backgroundColor: "#f8f9fa",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      border: "1px solid #e9ecef",
    },
    chartContainer: {
      flex: "1",
      padding: "20px",
      backgroundColor: "#fff",
      borderRadius: "12px",
      boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
      border: "2px solid #e9ecef",
      minHeight: "300px",
    },
    chartTitle: {
      color: "#2c3e50",
      fontSize: "16px",
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: "15px",
      borderBottom: "2px solid #3498db",
      paddingBottom: "8px",
    },
    chartWrapper: {
      height: "220px",
      marginBottom: "10px",
    },
    chartLegend: {
      fontSize: "12px",
      color: "#1565c0",
      textAlign: "center",
      fontStyle: "italic",
      padding: "8px",
      backgroundColor: "#f0f8ff",
      borderRadius: "6px",
    },
    infoRow: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "8px",
    },
    label: {
      fontWeight: "bold",
      color: "#495057",
    },
    value: {
      color: "#6c757d",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "20px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
    },
    tableHeader: {
      backgroundColor: "#3498db",
      color: "#fff",
      fontWeight: "bold",
      padding: "12px",
      textAlign: "left",
      borderBottom: "2px solid #2980b9",
    },
    tableCell: {
      padding: "12px",
      borderBottom: "1px solid #ecf0f1",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    tableRowEven: {
      backgroundColor: "#f8f9fa",
    },
    tableRowOdd: {
      backgroundColor: "#fff",
    },
    trendSection: {
      padding: "15px",
      background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
      borderRadius: "12px",
      marginBottom: "20px",
      border: "2px solid #2196f3",
    },
    remarksSection: {
      padding: "15px",
      backgroundColor: "#fff3cd",
      borderRadius: "6px",
      border: "1px solid #ffeaa7",
    },
    overallRemark: {
      fontSize: "16px",
      lineHeight: "1.5",
      color: "#495057",
    },
    teacherSection: {
      marginTop: "20px",
      padding: "15px",
      backgroundColor: "#f0f8ff",
      borderRadius: "8px",
      border: "1px solid #b3d9ff",
    },
    textarea: {
      width: "100%",
      minHeight: "80px",
      padding: "10px",
      border: "1px solid #ddd",
      borderRadius: "6px",
      fontSize: "14px",
      resize: "vertical",
    },
    principalSection: {
      marginTop: "20px",
      padding: "15px",
      backgroundColor: "#fff5f5",
      borderRadius: "8px",
      border: "1px solid #fecaca",
      textAlign: "center",
    },
    stampBox: {
      width: "150px",
      height: "80px",
      border: "2px dashed #ef4444",
      margin: "10px auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "8px",
      backgroundColor: principalStamp ? "#fee2e2" : "transparent",
    },
  };

  return (
    <div style={styles.container} className="print-container">
      <div style={styles.letterheadContainer}>
        <img
          src="Letterhead.png"
          alt="School Letterhead"
          style={styles.letterheadImage}
        />
      </div>

      <div style={styles.titleSection}>
        <h2 style={styles.reportTitle}>INDIVIDUAL ACADEMIC REPORT</h2>
        <p style={styles.subtitle}>
          {student.term} - {displayExamType} Examination - {currentDate}
        </p>
      </div>

      <div style={styles.topSection}>
        <div style={styles.studentInfoCompact}>
          <div style={styles.infoRow}>
            <span style={styles.label}>Student Name:</span>
            <span style={styles.value}>{student.name}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.label}>Class:</span>
            <span style={styles.value}>{student.class}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.label}>Term:</span>
            <span style={styles.value}>{student.term}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.label}>Position:</span>
            <span style={styles.value}>{positionText}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.label}>Total Marks:</span>
            <span style={styles.value}>{totalMarks.toFixed(0)}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.label}>Overall Mean:</span>
            <span style={styles.value}>
              {typeof student.mean === "number" ? student.mean.toFixed(1) : "-"}
            </span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.label}>Overall Rubric:</span>
            <span style={styles.value}>{overallRubric}</span>
          </div>
          {shouldShowDeviation && deviation && (
            <div style={styles.infoRow}>
              <span style={styles.label}>Deviation:</span>
              <span style={{ ...styles.value, color: deviation.color }}>
                {deviation.value} points {deviation.type} class average
              </span>
            </div>
          )}
        </div>

        {chartData && (
          <div style={styles.chartContainer}>
            <h3 style={styles.chartTitle}>📊 Performance vs Class Average</h3>
            <div style={styles.chartWrapper}>
              <Bar data={chartData} options={chartOptions} />
            </div>
            <div style={styles.chartLegend}>
              🔵 {student.name} | 🔴 Class Average
            </div>
          </div>
        )}
      </div>

      {shouldShowTrend && trendAnalysis && (
        <div style={styles.trendSection}>
          <h3
            style={{
              color: "#1565c0",
              marginBottom: "15px",
              fontSize: "18px",
              textAlign: "center",
            }}
          >
            📈 Performance Trend Analysis
          </h3>
          <div style={{ textAlign: "center" }}>
            <span
              style={{
                fontSize: "24px",
                marginRight: "10px",
              }}
            >
              {trendAnalysis.trendIcon}
            </span>
            <span
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                color: trendAnalysis.trendColor,
              }}
            >
              {trendAnalysis.trend}
            </span>
          </div>
          <p
            style={{
              textAlign: "center",
              marginTop: "10px",
              fontSize: "14px",
              color: "#555",
            }}
          >
            Performance change: {trendAnalysis.improvement > 0 ? "+" : ""}
            {trendAnalysis.improvement} points ({trendAnalysis.percentageChange}
            % {trendAnalysis.improvement >= 0 ? "improvement" : "decline"})
          </p>
        </div>
      )}

      <h3 style={{ color: "#2c3e50", marginBottom: "15px", fontSize: "18px" }}>
        Subject Performance
      </h3>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>Subject</th>
            <th style={styles.tableHeader}>Marks</th>
            <th style={styles.tableHeader}>Rubric</th>
            <th style={styles.tableHeader}>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject, index) => {
            const score = subjectMarks[subject];
            const subjectRubric =
              typeof score === "number" ? getRubric(score) : "-";
            const remark =
              typeof score === "number" ? getSubjectRemark(subjectRubric) : "-";

            return (
              <tr
                key={subject}
                style={
                  index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
                }
              >
                <td style={styles.tableCell}>
                  <strong>{getSubjectDisplayName(subject)}</strong>
                </td>
                <td style={styles.tableCell}>
                  {typeof score === "number" ? score.toFixed(1) : "-"}
                </td>
                <td style={styles.tableCell}>{subjectRubric}</td>
                <td style={styles.tableCell}>{remark}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div
        style={{
          ...styles.remarksSection,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "#fff",
          border: "none",
          boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
          padding: "12px",
          marginBottom: "15px",
        }}
      >
        <h3
          style={{
            color: "#fff",
            marginBottom: "12px",
            fontSize: "16px",
            textAlign: "center",
            textShadow: "0 2px 4px rgba(0,0,0,0.3)",
          }}
        >
          🎯 Overall Performance Summary
        </h3>
        <div
          style={{
            marginBottom: "10px",
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              color: "#fff",
            }}
          >
            Student's Overall Rubric:
          </span>
          <span
            style={{
              padding: "6px 12px",
              borderRadius: "20px",
              background: "rgba(255, 255, 255, 0.2)",
              color: "#fff",
              fontWeight: "700",
              fontSize: "14px",
              marginLeft: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              backdropFilter: "blur(10px)",
            }}
          >
            {overallRubric}
          </span>
        </div>
        <div
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            padding: "10px",
            borderRadius: "8px",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <p
            style={{
              ...styles.overallRemark,
              color: "#fff",
              fontSize: "13px",
              lineHeight: "1.4",
              textAlign: "center",
              margin: "0",
            }}
          >
            <strong>Performance Remarks: </strong>
            {getOverallRemark(overallRubric)}
          </p>
        </div>
      </div>

      {/* Class Teacher's Comments - Blank for manual writing */}
      <div
        style={{
          marginTop: "25px",
          padding: "20px",
          backgroundColor: "#f8fafc",
          borderRadius: "12px",
          border: "2px solid #e2e8f0",
          minHeight: "120px",
        }}
      >
        <h3
          style={{ color: "#1565c0", marginBottom: "15px", fontSize: "16px" }}
        >
          📝 Class Teacher's Comments
        </h3>
        <div
          style={{
            border: "1px solid #cbd5e1",
            borderRadius: "8px",
            minHeight: "80px",
            backgroundColor: "#fff",
            padding: "10px",
            fontSize: "14px",
            color: "#94a3b8",
            fontStyle: "italic",
          }}
        >
          [Space for class teacher's handwritten comments]
        </div>
      </div>

      {/* Principal's Stamp - Blank space for physical stamp */}
      <div
        style={{
          marginTop: "25px",
          padding: "20px",
          backgroundColor: "#fef2f2",
          borderRadius: "12px",
          border: "2px solid #fecaca",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h3
            style={{ color: "#dc2626", marginBottom: "5px", fontSize: "16px" }}
          >
            🎯 Principal's Stamp
          </h3>
          <div
            style={{
              width: "150px",
              height: "80px",
              border: "2px dashed #ef4444",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#fff",
              color: "#94a3b8",
              fontSize: "12px",
              fontStyle: "italic",
            }}
          >
            [Principal's Stamp]
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <p
            style={{
              margin: "0",
              fontSize: "14px",
              color: "#6b7280",
              fontWeight: "600",
            }}
          >
            Class Teacher: {classTeacher}
          </p>
        </div>
      </div>
    </div>
  );
};

export default IndividualReport;
