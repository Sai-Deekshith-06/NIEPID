import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Footer, Header, ScrollToButton } from '../components/components';
import { axiosInstance } from '../libs/axios';

const styles = {
    selector: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        gap: "1rem",
        marginBottom: "2rem",
        padding: "1rem",
        backgroundColor: "#f9f9f9",
        borderRadius: "5px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        alignItems: "center",
    },
    label: {
        display: "flex",
        flexDirection: "row",
        gap: "0.5rem",
        width: "50%",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    select: {
        width: "80%",
        padding: "0.5rem",
        borderRadius: "5px",
        border: "1px solid #ccc",
        fontSize: "1rem",
        outline: "none",
        transition: "border-color 0.2s",
    },
    selectHover: {
        borderColor: "#007bff",
    },
};

const StudentPerformance = () => {
    const navigate = useNavigate()
    const id = localStorage.getItem("studentId")
    const role = localStorage.getItem("role")
    console.log(role);
    let backButtonPath = ""
    switch (role) {
        case "student": backButtonPath = '/student'; break;
        case "teacher": backButtonPath = '/teacher'; break;
        case "principal": backButtonPath = '/principal/viewstudents'; break;
        case "admin": backButtonPath = '/admin/viewstudents'; break;
        default: backButtonPath = '/';
    }

    const replacePrimaryLabels = (text) => {
        console.log(text)
        if (!text) return '';

        return text
            .replace(/preprimary_1/gi, 'Preprimary-1')
            .replace(/preprimary_2/gi, 'Preprimary-2')
            .replace(/preprimary_3/gi, 'Preprimary-3')
            .replace(/primary1_1/gi, 'Primary-I-1')
            .replace(/primary1_2/gi, 'Primary-I-2')
            .replace(/primary1_3/gi, 'Primary-I-3')
            .replace(/primary2_1/gi, 'Primary-II-1')
            .replace(/primary2_2/gi, 'Primary-II-2')
            .replace(/primary2_3/gi, 'Primary-II-3')
            .replace(/preprimary/gi, 'Preprimary')
            .replace(/primary1/gi, 'Primary-I')
            .replace(/primary2/gi, 'Primary-II')

    };

    useEffect(() => { // Changed to async function for async/await
        const fetchData = async () => {
            console.log("hello")
            if (role === "teacher") {
                console.log("hello")
                await axiosInstance.get("/teacher/abc", {
                    headers: {
                        id: id,
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                })
                    .then(res => {
                        if (res.status !== 200) { // Corrected != to !== for strict comparison
                            toast.error("Student is still in 1st Year", {
                                position: "top-right",
                            });
                            navigate('/teacher')
                        }
                        console.log(res)
                        setStudentInfo(res.data)
                        // Initialize selectedSection and selectedYear based on fetched data
                        if (res.data.section && res.data.section.length > 0) {
                            setSelectedSection(res.data.section[0].sec);
                            if (res.data.section[0].yearReport && res.data.section[0].yearReport.length > 0) {
                                setSelectedYear(res.data.section[0].yearReport[0].year);
                            }
                        }

                    })
                    .catch(err => {
                        console.log(err)
                        console.log(err.response)
                        if (err.response && err.response.status === 404) {
                            toast.error("Student data not found or still in 1st Year", {
                                position: "top-right",
                            });
                            navigate('/teacher');
                        }
                    })
            }
            else if (role === "principal") {
                console.log(role)
                console.log(id)
                await axiosInstance.get("/principal/student/viewHistory", {
                    headers: {
                        id: id,
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                })
                    .then(res => {
                        if (res.status !== 200) {
                            toast.error("Student is still in 1st Year", {
                                position: "top-right",
                            });
                            navigate('/principal/viewStudents')
                        }
                        setStudentInfo(res.data)
                        if (res.data.section && res.data.section.length > 0) {
                            setSelectedSection(res.data.section[0].sec);
                            if (res.data.section[0].yearReport && res.data.section[0].yearReport.length > 0) {
                                setSelectedYear(res.data.section[0].yearReport[0].year);
                            }
                        }
                    })
                    .catch(err => {
                        console.log(err.response)
                        if (err.response && err.response.status === 404) {
                            toast.error("Student data not found or still in 1st Year", {
                                position: "top-right",
                            });
                            navigate('/principal/viewStudents');
                        }
                    })
            }
            else if (role === "admin") {
                await axiosInstance.get("/admin/student/viewHistory", {
                    headers: {
                        id: id,
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                })
                    .then(res => {
                        if (res.status !== 200) {
                            toast.error("Student is still in 1st Year", {
                                position: "top-right",
                            });
                            navigate('/admin/viewStudents')
                        }
                        setStudentInfo(res.data)
                        if (res.data.section && res.data.section.length > 0) {
                            setSelectedSection(res.data.section[0].sec);
                            if (res.data.section[0].yearReport && res.data.section[0].yearReport.length > 0) {
                                setSelectedYear(res.data.section[0].yearReport[0].year);
                            }
                        }
                    })
                    .catch(err => {
                        console.log(err)
                        if (err.response && err.response.status === 404) {
                            toast.error("Student data not found or still in 1st Year", {
                                position: "top-right",
                            });
                            navigate('/admin/viewStudents');
                        }
                    })
            } else if (role === "student") {
                console.log("student")
                const id1 = localStorage.getItem('regNo')
                console.log(id1)
                await axiosInstance.get("/student/viewHistory", {
                    headers: {
                        id: id1,
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                })
                    .then(res => {
                        if (res.status !== 200) {
                            toast.error("Student is still in 1st Year", {
                                position: "top-right",
                            });
                            navigate('/student')
                        }
                        setStudentInfo(res.data)
                        if (res.data.section && res.data.section.length > 0) {
                            setSelectedSection(res.data.section[0].sec);
                            if (res.data.section[0].yearReport && res.data.section[0].yearReport.length > 0) {
                                setSelectedYear(res.data.section[0].yearReport[0].year);
                            }
                        }
                    })
                    .catch(err => {
                        console.log(err.response)
                        if (err.response && err.response.status === 404) {
                            toast.error("Student data not found or still in 1st Year", {
                                position: "top-right",
                            });
                            navigate('/student');
                        }
                    })
            }
        };

        fetchData();
    }, [id, role, navigate])

    const [studentInfo, setStudentInfo] = useState({
        name: "Loading...",
        regNo: "Loading...",
        currYear: "Loading...",
        currSection: "Loading...",
        classId: "Loading...",
        section: [] // Initialize as empty array to prevent issues before data loads
    });

    // Initialize selectedSection and selectedYear with valid defaults or based on fetched data
    const [selectedSection, setSelectedSection] = useState("");
    const [selectedYear, setSelectedYear] = useState("");

    useEffect(() => {
        if (studentInfo.section && studentInfo.section.length > 0) {
            // Only set initial section and year if they haven't been set or if the fetched data is different
            if (!selectedSection || !studentInfo.section.some(sec => sec.sec === selectedSection)) {
                setSelectedSection(studentInfo.section[0].sec);
            }
            const currentSelectedSectionData = studentInfo.section.find(sec => sec.sec === (selectedSection || studentInfo.section[0].sec));
            if (currentSelectedSectionData && currentSelectedSectionData.yearReport && currentSelectedSectionData.yearReport.length > 0) {
                if (!selectedYear || !currentSelectedSectionData.yearReport.some(yr => yr.year === selectedYear)) {
                    setSelectedYear(currentSelectedSectionData.yearReport[0].year);
                }
            } else {
                setSelectedYear(""); // Reset year if no reports are available for the section
            }
        }
    }, [studentInfo, selectedSection, selectedYear]); // Depend on studentInfo and selectedSection

    const selectedSectionData = studentInfo.section.find(section => section.sec === selectedSection);
    console.log(selectedSectionData)
    // Removed the toast here, as it can be triggered on initial render when data is not yet loaded
    // if (!selectedSectionData) {
    //     toast.info("No tests are evaluated yet")
    //     // navigate('/admin/viewstudents')
    // }

    const selectedYearData = selectedSectionData?.yearReport.find(year => year.year === selectedYear);
    //console.log(studentInfo)

    // Conditional rendering for chartData to prevent error if selectedYearData or termReport is undefined
    const chartData = selectedYearData && selectedYearData.termReport ? {
        labels: ['Personal', 'Social', 'Academic', 'Occupational'],
        datasets: [
            ...selectedYearData.termReport.map(termData => ({
                label: termData.term,
                data: [
                    termData.percent.personalPercent,
                    termData.percent.socialPercent,
                    termData.percent.academicPercent,
                    termData.percent.occupationalPercent,
                ],
                backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`
            })),

            ...(selectedYearData.termReport.length >= 4
                ? [{
                    label: 'Average',
                    data: [
                        selectedYearData.termReport.reduce((acc, termData) => acc + termData.percent.personalPercent, 0) / selectedYearData.termReport.length,
                        selectedYearData.termReport.reduce((acc, termData) => acc + termData.percent.socialPercent, 0) / selectedYearData.termReport.length,
                        selectedYearData.termReport.reduce((acc, termData) => acc + termData.percent.academicPercent, 0) / selectedYearData.termReport.length,
                        selectedYearData.termReport.reduce((acc, termData) => acc + termData.percent.occupationalPercent, 0) / selectedYearData.termReport.length,
                    ],
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    borderWidth: 1
                }]
                : []
            )
        ]
    } : { labels: [], datasets: [] }; // Provide empty data if no selectedYearData or termReport

    const options = {
        scales: {
            y: {
                beginAtZero: true,
                max: 100
            }
        }
    };

    return (
        <div>
            <Header backButtonPath={backButtonPath} print={true} />
            <ScrollToButton scrollDown={true} />
            <div className="container">
                <h1>Student Information</h1>
                <div className="student-info">
                    <p><strong>Name:</strong> {studentInfo.name}</p>
                    <p><strong>Registration Number:</strong> {studentInfo.regNo}</p>
                    <p><strong>Current Year:</strong> {studentInfo.currYear}</p>
                    <p><strong>Current Section:</strong> {replacePrimaryLabels(studentInfo.currSection)}</p>
                    <p><strong>Class ID:</strong> {replacePrimaryLabels(studentInfo.classId)}</p>
                </div>
                <h2>Select Section and Year</h2>
                <div className="year-selector" style={styles.selector}>
                    <label style={styles.label}>
                        Section:
                        <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} style={styles.select}>
                            {studentInfo.section.length > 0 ? (
                                studentInfo.section.map(sec => (
                                    <option key={sec.sec} value={sec.sec}>{replacePrimaryLabels(sec.sec)}</option>
                                ))
                            ) : (
                                <option value="">No sections available</option>
                            )}
                        </select>
                    </label>
                    <label style={styles.label}>
                        Year:
                        <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} style={styles.select}>
                            {selectedSectionData && selectedSectionData.yearReport.length > 0 ? (
                                selectedSectionData.yearReport.map(year => (
                                    <option key={year.year} value={year.year}>{year.year}</option>
                                ))
                            ) : (
                                <option value="">No years available</option>
                            )}
                        </select>
                    </label>
                </div>
                {selectedYearData && selectedYearData.termReport && selectedYearData.termReport.length > 0 ? (
                    <>
                        <div className="chart-container">
                            <h2>Percentage Breakdown by Term</h2>
                            <Bar data={chartData} options={options} height={100} />
                        </div>
                        <div className="term-details">
                            <h2>Comments</h2>
                            {selectedYearData.termReport.map(termData => (
                                <div key={termData.term} className="term-row">
                                    <h3>{termData.term} Term</h3>
                                    <p><strong>Term Comment:</strong>{termData.comment.termComment}</p>
                                    <p><strong>Personal Comment:</strong>{termData.comment.personalComment}</p>
                                    <p><strong>Social Comment:</strong>{termData.comment.socialComment}</p>
                                    <p><strong>Academic Comment:</strong>{termData.comment.academicComment}</p>
                                    <p><strong>Occupational Comment:</strong>{termData.comment.occupationalComment}</p>
                                    <p><strong>Recreational Comment:</strong>{termData.comment.recreationalComment}</p>
                                </div>
                            ))}
                        </div>
                        <div className="year-details">
                            <h2>Year Summary</h2>
                            <div className="year-summary">
                                <div className="year-summary-box">
                                    <h3>Year Percentages</h3>
                                    <p><strong>Personal:</strong> {selectedYearData.percent.personalPercent}%</p>
                                    <p><strong>Social:</strong> {selectedYearData.percent.socialPercent}%</p>
                                    <p><strong>Academic:</strong> {selectedYearData.percent.academicPercent}%</p>
                                    <p><strong>Occupational:</strong> {selectedYearData.percent.occupationalPercent}%</p>
                                    <p><strong>Recreational:</strong> {selectedYearData.percent.mode}%</p> {/* This was recreationalPercent in the initial state, check model */}
                                </div>
                                <div className="year-summary-box">
                                    <h3>Year Comments</h3>
                                    {/* These year comments are not present in the initial state `studentInfo` or `student.model.js` structure for `comment` inside `yearReport`. You might need to adjust your model and fetched data to include these. For now, assuming they exist or rendering empty if not. */}
                                    <p><strong>Year Comment:</strong>{selectedYearData.comment?.yearComment}</p>
                                    <p><strong>Personal Comment:</strong>{selectedYearData.comment?.yearPersonalComment}</p>
                                    <p><strong>Social Comment:</strong>{selectedYearData.comment?.yearSocialComment}</p>
                                    <p><strong>Academic Comment:</strong>{selectedYearData.comment?.yearAcademicComment}</p>
                                    <p><strong>Occupational Comment:</strong>{selectedYearData.comment?.yearOccupationalComment}</p>
                                    <p><strong>Recreational Comment:</strong>{selectedYearData.comment?.yearRecreationalComment}</p>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <p>No data available for the selected year or term reports.</p>
                )}
            </div>
            <Footer />
            <ScrollToButton />
            <style>
                {`
                    .student-info, .year-selector {
                        margin-bottom: 20px;
                    }

                    .year-selector button {
                        margin-right: 10px;
                        padding: 5px 10px;
                        cursor: pointer;
                        background-color: #007BFF;
                        color: white;
                        border: none;
                        border-radius: 3px;
                    }

                    .year-selector button:hover {
                        background-color: #0056b3;
                    }

                    .chart-container {
                        margin-bottom: 50px;
                    }

                    .year-details, .term-details {
                        margin-bottom: 20px;
                    }

                    .term-details .term-row {
                        display: flex;
                        flex-direction: column;
                        padding: 10px;
                        background-color: #f0f0f0;
                        margin-bottom: 10px;
                        border-radius: 5px;
                    }

                    .term-details h3 {
                        margin-bottom: 10px;
                    }

                    .year-summary {
                        display: flex;
                        justify-content: space-between;
                    }

                    .year-summary-box {
                        background-color: #f0f0f0;
                        padding: 20px;
                        border-radius: 5px;
                        width: 45%;
                    }
                `}
            </style>
        </div>
    );
};

export default StudentPerformance