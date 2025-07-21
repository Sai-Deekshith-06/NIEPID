import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Footer, Header } from "../../components/components";
import { axiosInstance } from "../../libs/axios";

export default function Home() {

    const navigate = useNavigate();
    const [, , removeCookie] = useCookies([]);
    const [students, setStudents] = useState({});
    const [teacher, setTeacher] = useState({})
    const teacherId = localStorage.getItem("userId")

    useEffect(() => {
        const f = async () => {

            localStorage.removeItem("currTerm")
            localStorage.removeItem("currYear")
            localStorage.removeItem("currSection")
            localStorage.removeItem("section")
            localStorage.removeItem("year")
            localStorage.removeItem("term")
            localStorage.removeItem("studentId")
            localStorage.removeItem("studentName")

            await axiosInstance.get('/teacher/getStudents', {
                headers: {
                    id: teacherId,
                    // id:"t2",
                    "Content-Type": "application/json",
                    authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            }, { withCredentials: true })
                .then(res => {
                    console.log(res.data.students)
                    setStudents(res.data.students)

                })
                .catch(err => {
                    console.log(err.response)
                })

            await axiosInstance.get('/teacher/getTeacher', {
                headers: {
                    id: teacherId,
                    // id:"t2",
                    "Content-type": "application/json",
                    authorization: `Bearer ${localStorage.getItem("token")}`,
                }
            }, { withCredentials: true })
                .then((res) => {
                    // console.log(res)
                    setTeacher(res.data.data)
                })
                .catch(err => {
                    console.log("Error", err)
                })
        }
        f()
    }, [teacherId]);

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

    };

    return (
        <>
            <ToastContainer />
            <div style={styles.container}>
                <Header logout={true} removeCookie={removeCookie} />
                <main style={styles.hero}>
                    <h2 style={styles.heroTitle}>Welcome to the Teacher Portal</h2>
                    <p style={styles.heroSubtitle}>
                        Manage your classes and students efficiently.
                    </p>
                    <h3 style={styles.teacherInfo}>Welcome, {teacher.teacherName}!</h3>
                    {Object.keys(students).length > 0 ? (
                        Object.keys(students).map((classId) => (
                            <div key={classId} style={styles.classContainer}>
                                <h3>{replacePrimaryLabels(students[classId][0]?.classId)}</h3>
                                {students[classId].map((student) => (
                                    <div key={student.regNo} style={styles.student}>
                                        <p>{student.regNo} __ {student.name}</p>
                                        <div>
                                            <button
                                                style={styles.studentButton}
                                                onClick={() => {
                                                    localStorage.setItem("studentId", student.regNo)
                                                    localStorage.setItem("studentName", student.name)
                                                    navigate(`term/`)
                                                }}
                                            >
                                                Eval
                                            </button>
                                            <button
                                                style={styles.studentButton}
                                                onClick={() => {
                                                    localStorage.setItem("studentId", student.regNo)
                                                    navigate(`hist/`)
                                                }}
                                            >
                                                Hist
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))
                    ) : (
                        <p>No students registered under teacher</p>
                    )}
                </main>
                <Footer />
            </div>
        </>
    );
}

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#f0f8ff",
    },
    hero: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flexGrow: 1,
        padding: "2rem",
        textAlign: "center",
    },
    heroTitle: {
        fontSize: "3rem",
        color: "#333333",
        marginBottom: "1rem",
    },
    heroSubtitle: {
        fontSize: "1.5rem",
        color: "#666666",
        marginBottom: "2rem",
    },
    teacherInfo: {
        fontSize: "1.2rem",
        color: "#007bff",
        marginBottom: "1rem",
    },
    classContainer: {
        width: "100%",
        maxWidth: "800px",
        backgroundColor: "#ffffff",
        padding: "2rem",
        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
        borderRadius: "10px",
        marginBottom: "2rem",
    },
    student: {
        padding: "1rem",
        borderBottom: "1px solid #dddddd",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    studentButton: {
        padding: "0.5rem 1rem",
        fontSize: "0.9rem",
        backgroundColor: "#007bff",
        color: "#ffffff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        transition: "background-color 0.3s, transform 0.3s",
        marginLeft: "0.5rem",
    },
};
