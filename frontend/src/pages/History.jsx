import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import image from './th.jpeg';
import 'chart.js/auto';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const styles = {
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        backgroundColor: "#007bff",
        color: "#ffffff",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    logo: {
        display: "flex",
        alignItems: "center",
    },
    logoImage: {
        width: "40px",
        height: "40px",
        marginRight: "10px",
    },
    logoLabel: {
        fontSize: "1.5rem",
        fontWeight: "bold",
    },
    footer: {
        textAlign: "center",
        padding: "1rem",
        backgroundColor: "#007bff",
        color: "#ffffff",
    },
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
    backButton: {
        padding: "0.8rem 1.5rem",
        fontSize: "1rem",
        backgroundColor: "#000000",
        color: "#ffffff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        transition: "background-color 0.3s, transform 0.3s",
        marginLeft: "1rem",
    },
};

// const Header = () => (
//     <header style={styles.header}>
//         <div style={styles.logo}>
//             <img src={image} alt="Logo" style={styles.logoImage} />
//             <span style={styles.logoLabel}>NIEPID</span>
//         </div>
//         <button onClick={() => {
//                 const role = localStorage.getItem("role");
//                 if (role === "student")
//                     navigate('/student')
//                 if (role === "teacher")
//                     navigate('/teacher')
//                 if (role === "principal")
//                     navigate('/principal/viewstudents')
//                 if (role === "admin")
//                     navigate('/admin/viewstudents')
//             }} style={styles.backButton}>Back</button>
//     </header>
// );

// const Footer = () => (
//     <footer style={styles.footer}>&copy; 2024 Student History Portal</footer>
// );

const StudentPerformance = () => {
    const navigate = useNavigate()
    const id = localStorage.getItem("studentId")
    const role = localStorage.getItem("role")
    console.log(role);
    const Header = () => (
        <header style={styles.header}>
            <div style={styles.logo}>
                <img src={image} alt="Logo" style={styles.logoImage} />
                <span style={styles.logoLabel}>NIEPID</span>
            </div>
            <div>
                <button onClick={handlePrint} style={styles.backButton}>
                    Print
                </button>
                <button onClick={() => {
                    const role = localStorage.getItem("role");
                    if (role === "student")
                        navigate('/student')
                    if (role === "teacher")
                        navigate('/teacher')
                    if (role === "principal")
                        navigate('/principal/viewstudents')
                    if (role === "admin")
                        navigate('/admin/viewstudents')
                }} style={styles.backButton}>Back</button>
            </div>
        </header>
    );

    const handlePrint = (e) => {
        window.print()
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

    const Footer = () => (
        <footer style={styles.footer}>&copy; 2024 Student History Portal</footer>
    );
    useEffect(async () => {
        console.log("hello")
        if (role === "teacher") {
            console.log("hello")
            await axios.get("http://localhost:4000/teacher/abc", {
                headers: {
                    id: id,
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
                .then(res => {
                    // console.log(res)
                    if (res.status != 200) {
                        toast.error("Student is still in 1st Year", {
                            position: "top-right",
                        });
                        navigate('/teacher')
                    }
                    console.log(res)
                    setStudentInfo(res.data)

                })
                .catch(err => {
                    console.log(err)
                    console.log(err.response)
                })
        }
        else if (role === "principal") {
            console.log(role)
            console.log(id)
            axios.get("http://localhost:4000/principal/student/viewHistory", {
                headers: {
                    id: id,
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
                .then(res => {
                    // console.log(res)
                    if (res.status != 200) {
                        toast.error("Student is still in 1st Year", {
                            position: "top-right",
                        });
                        navigate('/principal/viewStudents')
                    }
                    setStudentInfo(res.data)

                })
                .catch(err => {
                    console.log(err.response)
                })
        }
        else if (role === "admin") {
            axios.get("http://localhost:4000/admin/student/viewHistory", {
                headers: {
                    id: id,
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
                .then(res => {
                    // console.log(res)
                    if (res.status != 200) {
                        toast.error("Student is still in 1st Year", {
                            position: "top-right",
                        });
                        navigate('/admin/viewStudents')
                    }
                    setStudentInfo(res.data)
                })
                .catch(err => {
                    //console.log(err.response)
                })
        } else if (role === "student") {
            console.log("student")
            const id1 = localStorage.getItem('regNo')
            console.log(id1)
            axios.get("http://localhost:4000/student/viewHistory", {
                headers: {
                    id: id1,
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
                .then(res => {
                    // console.log(res)
                    if (res.status != 200) {
                        toast.error("Student is still in 1st Year", {
                            position: "top-right",
                        });
                        navigate('/student')
                    }
                    setStudentInfo(res.data)

                })
                .catch(err => {
                    console.log(err.response)
                })
        }
    }, [])

    const [studentInfo, setStudentInfo] = useState({
        name: "rohanKrishna",
        regNo: "22B81A6599",
        currYear: "3",
        currSection: "primary",
        classId: "primary_3",
        section: [
            {
                sec: "preprimary",
                yearReport: [
                    {
                        year: "1",
                        termReport: [
                            {
                                term: "Entry",
                                percent: {
                                    personalPercent: 75,
                                    socialPercent: 60,
                                    academicPercent: 85,
                                    occupationalPercent: 70,
                                    recreationalPercent: 80,
                                    mode: "A"
                                },
                                comment: {
                                    termComment: "Good progress overall.",
                                    personalComment: "Needs improvement in behavior.",
                                    occupationalComment: "Not interested in occupational activities.",
                                    recreationalComment: "Active participation in recreational activities.",
                                    academicComment: "Shows potential in academics.",
                                    socialComment: "Could improve social interaction."
                                }
                            },
                            {
                                term: "I",
                                percent: {
                                    personalPercent: 70,
                                    socialPercent: 70,
                                    academicPercent: 90,
                                    occupationalPercent: 60,
                                    recreationalPercent: 85,
                                    mode: "B"
                                },
                                comment: {
                                    termComment: "Steady progress observed.",
                                    personalComment: "Showing improvement in behavior.",
                                    occupationalComment: "Not interested in occupational activities.",
                                    recreationalComment: "Enjoying recreational activities.",
                                    academicComment: "Consistent performance in academics.",
                                    socialComment: "Good interaction with peers."
                                }
                            },
                            {
                                term: "II",
                                percent: {
                                    personalPercent: 80,
                                    socialPercent: 75,
                                    academicPercent: 88,
                                    occupationalPercent: 80,
                                    recreationalPercent: 70,
                                    mode: "C"
                                },
                                comment: {
                                    termComment: "Excellent start to the year.",
                                    personalComment: "Behavior has improved significantly.",
                                    occupationalComment: "Not interested in occupational activities.",
                                    recreationalComment: "Engaging in recreational activities.",
                                    academicComment: "Improving consistently in academics.",
                                    socialComment: "Good interaction with peers."
                                }
                            },
                            {
                                term: "III",
                                percent: {
                                    personalPercent: 85,
                                    socialPercent: 80,
                                    academicPercent: 90,
                                    occupationalPercent: 90,
                                    recreationalPercent: 65,
                                    mode: "D"
                                },
                                comment: {
                                    termComment: "Strong finish to the year.",
                                    personalComment: "Consistently good behavior.",
                                    occupationalComment: "Not interested in occupational activities.",
                                    recreationalComment: "Participating in recreational activities.",
                                    academicComment: "Excellent performance in academics.",
                                    socialComment: "Excellent interaction with peers."
                                }
                            }
                        ],
                        percent: {
                            personalPercent: 75,
                            socialPercent: 60,
                            academicPercent: 85,
                            occupationalPercent: 80,
                            recreationalPercent: 80,
                            mode: "A"
                        },
                        comment: {
                            termComment: "Good progress overall.",
                            personalComment: "Needs improvement in behavior.",
                            occupationalComment: "Not interested in occupational activities.",
                            recreationalComment: "Active participation in recreational activities.",
                            academicComment: "Shows potential in academics.",
                            socialComment: "Could improve social interaction."
                        }
                    },
                ]
            },
            {
                sec: "primary",
                yearReport: [
                    {
                        year: "1",
                        termReport: [
                            {
                                term: "Entry",
                                percent: {
                                    personalPercent: 82,
                                    socialPercent: 78,
                                    academicPercent: 89,
                                    occupationalPercent: 40,
                                    recreationalPercent: 75,
                                    mode: "A"
                                },
                                comment: {
                                    termComment: "Strong start to the year.",
                                    personalComment: "Consistently good behavior.",
                                    occupationalComment: "Not interested in occupational activities.",
                                    recreationalComment: "Active participation in recreational activities.",
                                    academicComment: "Excellent performance in academics.",
                                    socialComment: "Excellent interaction with peers."
                                }
                            },
                            {
                                term: "I",
                                percent: {
                                    personalPercent: 85,
                                    socialPercent: 80,
                                    academicPercent: 92,
                                    occupationalPercent: 60,
                                    recreationalPercent: 80,
                                    mode: "B"
                                },
                                comment: {
                                    termComment: "Consistently strong performance.",
                                    personalComment: "Excellent behavior throughout the term.",
                                    occupationalComment: "Not interested in occupational activities.",
                                    recreationalComment: "Enjoying recreational activities.",
                                    academicComment: "Outstanding academic achievements.",
                                    socialComment: "Excellent interaction with peers."
                                }
                            },
                            {
                                term: "II",
                                percent: {
                                    personalPercent: 88,
                                    socialPercent: 82,
                                    academicPercent: 95,
                                    occupationalPercent: 90,
                                    recreationalPercent: 85,
                                    mode: "C"
                                },
                                comment: {
                                    termComment: "Exceptional progress this term.",
                                    personalComment: "Excellent behavior and attitude.",
                                    occupationalComment: "Not interested in occupational activities.",
                                    recreationalComment: "Participating actively in recreational activities.",
                                    academicComment: "Consistently outstanding academic performance.",
                                    socialComment: "Excellent interaction with peers."
                                }
                            },
                            {
                                term: "III",
                                percent: {
                                    personalPercent: 90,
                                    socialPercent: 85,
                                    academicPercent: 98,
                                    occupationalPercent: 80,
                                    recreationalPercent: 90,
                                    mode: "D"
                                },
                                comment: {
                                    termComment: "Outstanding end to the year.",
                                    personalComment: "Exemplary behavior and dedication.",
                                    occupationalComment: "Not interested in occupational activities.",
                                    recreationalComment: "Actively participates in recreational activities.",
                                    academicComment: "Outstanding academic achievements.",
                                    socialComment: "Exceptional interaction with peers."
                                }
                            }
                        ],
                        percent: {
                            personalPercent: 75,
                            socialPercent: 60,
                            academicPercent: 85,
                            occupationalPercent: 70,
                            recreationalPercent: 80,
                            mode: "A"
                        },
                        comment: {
                            termComment: "Good progress overall.",
                            personalComment: "Needs improvement in behavior.",
                            occupationalComment: "Not interested in occupational activities.",
                            recreationalComment: "Active participation in recreational activities.",
                            academicComment: "Shows potential in academics.",
                            socialComment: "Could improve social interaction."
                        }
                    },
                ]
            }
        ]
    });

    const [selectedSection, setSelectedSection] = useState(studentInfo.section[0].sec);
    const [selectedYear, setSelectedYear] = useState("1");

    const selectedSectionData = studentInfo.section.find(section => section.sec === selectedSection);
    const selectedYearData = selectedSectionData.yearReport.find(year => year.year === selectedYear);
    //console.log(studentInfo)

    const chartData = {
        labels: ['Personal', 'Social', 'Academic', 'Occupational'],
        datasets: [
            ...selectedYearData.termReport.map(termData => ({
                label: termData.term,
                data: [
                    termData.percent.personalPercent,
                    termData.percent.socialPercent,
                    termData.percent.academicPercent,
                    termData.percent.occupationalPercent,
                    //termData.percent.recreationalPercent
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
                        //selectedYearData.termReport.reduce((acc, termData) => acc + termData.percent.recreationalPercent, 0) / selectedYearData.termReport.length
                    ],
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    borderWidth: 1
                }]
                : []
            )
        ]
    };

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
            <Header />
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
                            {studentInfo.section.map(sec => (
                                <option key={sec.sec} value={sec.sec}>{replacePrimaryLabels(sec.sec)}</option>
                            ))}
                        </select>
                    </label>
                    <label style={styles.label}>
                        Year:
                        <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} style={styles.select}>
                            {selectedSectionData.yearReport.map(year => (
                                <option key={year.year} value={year.year}>{year.year}</option>
                            ))}
                        </select>
                    </label>
                </div>
                {selectedYearData ? (
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
                                    <p><strong>Recreational:</strong> {selectedYearData.percent.mode}%</p>
                                </div>
                                <div className="year-summary-box">
                                    <h3>Year Comments</h3>
                                    <p><strong>Year Comment:</strong>{selectedYearData.comment.yearComment}</p>
                                    <p><strong>Personal Comment:</strong>{selectedYearData.comment.yearPersonalComment}</p>
                                    <p><strong>Social Comment:</strong>{selectedYearData.comment.yearSocialComment}</p>
                                    <p><strong>Academic Comment:</strong>{selectedYearData.comment.yearAcademicComment}</p>
                                    <p><strong>Occupational Comment:</strong>{selectedYearData.comment.yearOccupationalComment}</p>
                                    <p><strong>Recreational Comment:</strong>{selectedYearData.comment.yearRecreationalComment}</p>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <p>No data available for the selected year.</p>
                )}
            </div>
            <Footer />
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