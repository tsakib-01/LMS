// SP23-BSE-XXX_headGraph.js
// ROUTE: GET /head/graph
// Generates visual graph of student progress over time using marks trends

const express = require("express");
const router = express.Router();
const Marks = require("../models/Marks");
const User = require("../models/User");
const Class = require("../models/Class");

router.get("/graph", async (req, res) => {
    try {
        const { studentId, classId, startDate, endDate } = req.query;
        let marksFilter = {};

        if (studentId) {
            marksFilter.studentId = studentId;
        }

        if (classId) {
            const classData = await Class.findById(classId);
            if (!classData) {
                return res.status(404).json({
                    success: false,
                    message: "Class not found"
                });
            }
            marksFilter.studentId = { $in: classData.students };
        }

        if (startDate || endDate) {
            marksFilter.createdAt = {};
            if (startDate) {
                marksFilter.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                marksFilter.createdAt.$lte = new Date(endDate);
            }
        }

        const marks = await Marks.find(marksFilter)
            .populate("studentId", "name email")
            .populate("subjectId", "classname")
            .sort({ createdAt: 1 });

        if (!marks.length) {
            return res.status(404).json({
                success: false,
                message: "No marks data found for the given criteria"
            });
        }

        const studentProgressMap = {};

        marks.forEach((mark) => {
            const studentKey = mark.studentId._id.toString();
            
            if (!studentProgressMap[studentKey]) {
                studentProgressMap[studentKey] = {
                    studentId: mark.studentId._id,
                    studentName: mark.studentId.name || "Unknown",
                    studentEmail: mark.studentId.email || "Unknown",
                    progressData: [],
                    totalMarks: 0,
                    averageMarks: 0,
                    highestMark: 0,
                    lowestMark: 100,
                    trend: "stable"
                };
            }

            studentProgressMap[studentKey].progressData.push({
                marks: mark.marks,
                subject: mark.subjectId?.classname || "Unknown Subject",
                subjectId: mark.subjectId?._id,
                date: mark.createdAt,
                formattedDate: new Date(mark.createdAt).toLocaleDateString()
            });


            studentProgressMap[studentKey].totalMarks += mark.marks;
            if (mark.marks > studentProgressMap[studentKey].highestMark) {
                studentProgressMap[studentKey].highestMark = mark.marks;
            }
            if (mark.marks < studentProgressMap[studentKey].lowestMark) {
                studentProgressMap[studentKey].lowestMark = mark.marks;
            }
        });

        const graphData = Object.values(studentProgressMap).map((student) => {
            const dataPoints = student.progressData;
            student.averageMarks = parseFloat(
                (student.totalMarks / dataPoints.length).toFixed(2)
            );

            if (dataPoints.length >= 2) {
                const midPoint = Math.floor(dataPoints.length / 2);
                const firstHalf = dataPoints.slice(0, midPoint);
                const secondHalf = dataPoints.slice(midPoint);

                const firstHalfAvg =
                    firstHalf.reduce((sum, d) => sum + d.marks, 0) / firstHalf.length;
                const secondHalfAvg =
                    secondHalf.reduce((sum, d) => sum + d.marks, 0) / secondHalf.length;

                const trendDifference = secondHalfAvg - firstHalfAvg;

                if (trendDifference > 5) {
                    student.trend = "improving";
                } else if (trendDifference < -5) {
                    student.trend = "declining";
                } else {
                    student.trend = "stable";
                }

                student.trendPercentage = parseFloat(
                    ((trendDifference / firstHalfAvg) * 100).toFixed(2)
                );
            }

            return student;
        });

        const chartData = {
            labels: [],
            datasets: []
        };

        const allDates = new Set();
        graphData.forEach((student) => {
            student.progressData.forEach((data) => {
                allDates.add(data.formattedDate);
            });
        });
        chartData.labels = Array.from(allDates).sort(
            (a, b) => new Date(a) - new Date(b)
        );

        graphData.forEach((student, index) => {
            const colors = [
                "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
                "#FF9F40", "#FF6384", "#C9CBCF", "#7BC225", "#E7E9ED"
            ];

            const datasetData = chartData.labels.map((date) => {
                const entry = student.progressData.find(
                    (d) => d.formattedDate === date
                );
                return entry ? entry.marks : null;
            });

            chartData.datasets.push({
                label: student.studentName,
                data: datasetData,
                borderColor: colors[index % colors.length],
                backgroundColor: colors[index % colors.length] + "33",
                fill: false,
                tension: 0.1
            });
        });

        const overallStats = {
            totalStudents: graphData.length,
            classAverage: parseFloat(
                (
                    graphData.reduce((sum, s) => sum + s.averageMarks, 0) /
                    graphData.length
                ).toFixed(2)
            ),
            highestOverall: Math.max(...graphData.map((s) => s.highestMark)),
            lowestOverall: Math.min(...graphData.map((s) => s.lowestMark)),
            studentsImproving: graphData.filter((s) => s.trend === "improving").length,
            studentsDeclining: graphData.filter((s) => s.trend === "declining").length,
            studentsStable: graphData.filter((s) => s.trend === "stable").length
        };

        return res.status(200).json({
            success: true,
            message: "Student progress graph data generated successfully",
            overallStats,
            chartData,
            studentDetails: graphData,
            graphConfig: {
                type: "line",
                title: "Student Progress Over Time",
                xAxisLabel: "Date",
                yAxisLabel: "Marks",
                description:
                    "This graph shows the marks trend for students over time. Use chartData with Chart.js or similar library to render the visual graph."
            }
        });
    } catch (error) {
        console.error("Error generating graph data:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while generating graph data",
            error: error.message
        });
    }
});

router.get("/graph/student/:studentId", async (req, res) => {
    try {
        const { studentId } = req.params;

        const student = await User.findById(studentId);
        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        const marks = await Marks.find({ studentId })
            .populate("subjectId", "classname")
            .sort({ createdAt: 1 });

        if (!marks.length) {
            return res.status(404).json({
                success: false,
                message: "No marks found for this student"
            });
        }

        const progressData = marks.map((mark) => ({
            marks: mark.marks,
            subject: mark.subjectId?.classname || "Unknown Subject",
            date: mark.createdAt,
            formattedDate: new Date(mark.createdAt).toLocaleDateString()
        }));

        const marksArray = marks.map((m) => m.marks);
        const stats = {
            totalEntries: marks.length,
            totalMarks: marksArray.reduce((a, b) => a + b, 0),
            averageMarks: parseFloat(
                (marksArray.reduce((a, b) => a + b, 0) / marksArray.length).toFixed(2)
            ),
            highestMark: Math.max(...marksArray),
            lowestMark: Math.min(...marksArray),
            standardDeviation: calculateStandardDeviation(marksArray)
        };

        let trend = "stable";
        let trendPercentage = 0;

        if (progressData.length >= 2) {
            const midPoint = Math.floor(progressData.length / 2);
            const firstHalfAvg =
                progressData
                    .slice(0, midPoint)
                    .reduce((sum, d) => sum + d.marks, 0) / midPoint;
            const secondHalfAvg =
                progressData.slice(midPoint).reduce((sum, d) => sum + d.marks, 0) /
                (progressData.length - midPoint);

            trendPercentage = parseFloat(
                (((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100).toFixed(2)
            );

            if (trendPercentage > 5) trend = "improving";
            else if (trendPercentage < -5) trend = "declining";
        }

        const chartData = {
            labels: progressData.map((d) => d.formattedDate),
            datasets: [
                {
                    label: `${student.name}'s Progress`,
                    data: progressData.map((d) => d.marks),
                    borderColor: "#36A2EB",
                    backgroundColor: "#36A2EB33",
                    fill: true,
                    tension: 0.4
                },
                {
                    label: "Average Line",
                    data: progressData.map(() => stats.averageMarks),
                    borderColor: "#FF6384",
                    borderDash: [5, 5],
                    fill: false
                }
            ]
        };

        return res.status(200).json({
            success: true,
            message: "Student progress graph generated successfully",
            student: {
                id: student._id,
                name: student.name,
                email: student.email
            },
            stats,
            trend,
            trendPercentage,
            progressData,
            chartData,
            graphConfig: {
                type: "line",
                title: `Progress Graph for ${student.name}`,
                xAxisLabel: "Date",
                yAxisLabel: "Marks"
            }
        });
    } catch (error) {
        console.error("Error generating student graph:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while generating student graph",
            error: error.message
        });
    }
});

function calculateStandardDeviation(values) {
    const n = values.length;
    if (n === 0) return 0;

    const mean = values.reduce((a, b) => a + b, 0) / n;
    const squaredDiffs = values.map((value) => Math.pow(value - mean, 2));
    const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / n;

    return parseFloat(Math.sqrt(avgSquaredDiff).toFixed(2));
}

module.exports = router;
