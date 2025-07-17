import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import image from "./th.jpeg";

export default function Home() {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies([]);
  const [students, setStudents] = useState({});
  const [teacher, setTeacher] = useState({});
  // const teacherName = "John Doe"
  const handleChangePasswordPage = () => {
    navigate("/teacher/changepassword");
  };

  useEffect(() => {
    localStorage.removeItem("currTerm");
    localStorage.removeItem("currYear");
    localStorage.removeItem("currSection");
    localStorage.removeItem("section");
    localStorage.removeItem("year");
    localStorage.removeItem("term");
    localStorage.removeItem("studentId");

    const teacherId = localStorage.getItem("userId");
    axios
      .get(
        "http://localhost:4000/teacher/getStudents",
        {
          headers: {
            id: teacherId,
            // id:"t2",
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res.data.students);
        setStudents(res.data.students);
      })
      .catch((err) => {
        console.log(err.response);
      });

    // setStudents(groupedStudents);
    // console.log(students)

    axios
      .get(
        "http://localhost:4000/teacher/getTeacher",
        {
          headers: {
            id: teacherId,
            // id:"t2",
            "Content-type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
        { withCredentials: true }
      )
      .then((res) => {
        // console.log(res)
        setTeacher(res.data.data);
      })
      .catch((err) => {
        console.log("Error", err);
      });
  }, []);

  const logOut = () => {
    removeCookie("jwt");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    navigate("/");
  };

  const replacePrimaryLabels = (text) => {
    console.log(text);
    if (!text) return "";

    return text
      .replace(/preprimary_1/gi, "Preprimary-1")
      .replace(/preprimary_2/gi, "Preprimary-2")
      .replace(/preprimary_3/gi, "Preprimary-3")
      .replace(/primary1_1/gi, "Primary-I-1")
      .replace(/primary1_2/gi, "Primary-I-2")
      .replace(/primary1_3/gi, "Primary-I-3")
      .replace(/primary2_1/gi, "Primary-II-1")
      .replace(/primary2_2/gi, "Primary-II-2")
      .replace(/primary2_3/gi, "Primary-II-3");
  };

  const Header = () => (
    <header style={styles.header}>
      <div style={styles.logo}>
        <img src={image} alt="Logo" style={styles.logoImage} />
        <span style={styles.logoLabel}>NIEPID</span>
      </div>
      <nav style={styles.navLinks}>
        <button onClick={logOut} style={styles.button}>
          Log out
        </button>
        <button onClick={handleChangePasswordPage} style={styles.button}>
          Change Password
        </button>
      </nav>
    </header>
  );

  const Footer = () => (
    <footer style={styles.footer}>&copy; 2024 Teacher Portal</footer>
  );

  return (
    <>
      <ToastContainer />
      <div style={styles.container}>
        <Header />
        <main style={styles.hero}>
          <h2 style={styles.heroTitle}>Welcome to the Teacher Portal</h2>
          <p style={styles.heroSubtitle}>
            Manage your classes and students efficiently.
          </p>
          <h3 style={styles.teacherInfo}>Welcome, {teacher.teacherName}!</h3>
          {Object.keys(students).length > 0 ? (
            Object.keys(students).map((classId) => (
              <div key={classId} style={styles.classContainer}>
                <h3>{replacePrimaryLabels(students[classId][0].classId)}</h3>
                {students[classId].map((student) => (
                  <div key={student.id} style={styles.student}>
                    <p>
                      {student.regNo} __ {student.name}
                    </p>
                    <div>
                      <button
                        style={styles.studentButton}
                        onClick={() => {
                          localStorage.setItem("studentId", student.regNo);
                          navigate(`term/`);
                        }}
                      >
                        Eval
                      </button>
                      <button
                        style={styles.studentButton}
                        onClick={() => {
                          localStorage.setItem("studentId", student.regNo);
                          navigate(`hist/`);
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
    marginRight: "0.5rem",
  },
  logoLabel: {
    fontSize: "1.5rem",
  },
  navLinks: {
    display: "flex",
    gap: "1.5rem",
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
  button: {
    padding: "0.8rem 1.5rem",
    fontSize: "1rem",
    backgroundColor: "#ff0000",
    color: "#ffffff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s, transform 0.3s",
  },
  footer: {
    textAlign: "center",
    padding: "1rem",
    backgroundColor: "#007bff",
    color: "#ffffff",
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
