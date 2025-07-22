import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import image from "../images/logo.jpeg";
import { toast } from "react-toastify";
import { Footer, Header } from '../components/components'
import { axiosInstance } from "../libs/axios";

const TeacherTable = () => {
  const [teacherDetails, setTeacherDetails] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [editedTeacher, setEditedTeacher] = useState({
    teacherId: "",
    teacherName: "",
    email: "",
    teacherMNo: "",
    classId: [],
  });
  const role = localStorage.getItem("role");
  let backButtonPath = ""
  switch (role) {
    case "principal": backButtonPath = '/principal'; break;
    case "admin": backButtonPath = '/admin'; break;
    default: backButtonPath = '/';
  }
  const [isOpen, setIsOpen] = useState(false);
  // Function to open the modal
  const openModal = () => {
    setIsOpen(true);
  };
  // Function to close the modal
  const closeModal = () => {
    setIsOpen(false);
  };
  // Fetch the role from localStorage
  // role === "admin" ? console.log("calling as admin") : console.log("calling as pricipal")
  const fetchData = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/${role}/viewTeacher`, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }, { withCredentials: true }
      );
      console.log(response.data.data)
      setTeacherDetails(response.data.data);
    } catch (error) {
      console.error("Error fetching teacher details:", error.response);
    }
  }, [role]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEditClick = (teacher) => {
    setEditMode(teacher.teacherId);
    setEditedTeacher({ ...teacher }); // Copy teacher details to editedTeacher
  };

  const handleDeleteClick = (teacher) => {
    localStorage.setItem("teacherId", teacher._id);
    setEditedTeacher({ ...teacher });
    //setNewTeacher({ ...teacher });
    openModal();
  };

  const replacePrimaryLabels = (text) => {
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

  const handleDelete = async () => {
    try {
      console.log(editedTeacher);
      const id = localStorage.getItem("teacherId");
      const response = await axiosInstance.put(
        `/admin/updateTeacher/${id}`,
        editedTeacher,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        // Update teacherDetails with the updated teacher
        const updatedDetails = teacherDetails.map((teacher) =>
          teacher.teacherId === id ? response.data : teacher
        );

        setTeacherDetails(updatedDetails);
        setEditMode(null);
        setEditedTeacher({}); // Reset editedTeacher state

        // Refetch data to ensure UI reflects changes immediately
        fetchData();
        toast.success("DELETE SUCCESS")
      } else {
        console.error("Failed to update teacher details.");
        toast.error(response.data.message);

      }
    } catch (err) {
      console.log(err.response);
      toast.error(err.response.data.message);
    }
  };

  const handleSaveClick = async (id) => {
    try {
      // Ensure classId is converted back to array if edited as comma-separated string
      const updatedTeacher = { ...editedTeacher };
      if (typeof editedTeacher.classId === "string") {
        updatedTeacher.classId = editedTeacher.classId
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item !== "");
      }

      const response = await axiosInstance.put(
        `/admin/updateTeacher/${id}`,
        updatedTeacher,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        // Update teacherDetails with the updated teacher
        const updatedDetails = teacherDetails.map((teacher) =>
          teacher.teacherId === id ? response.data : teacher
        );

        setTeacherDetails(updatedDetails);
        setEditMode(null);
        setEditedTeacher({}); // Reset editedTeacher state

        // Refetch data to ensure UI reflects changes immediately
        fetchData();
      } else {
        console.error("Failed to update teacher details.");
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating teacher details:", error.response);
      toast.error(error.response.data.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Handle classId specifically to convert comma-separated string to array
    if (name === "classId") {
      setEditedTeacher({ ...editedTeacher, [name]: value });
    } else {
      setEditedTeacher({ ...editedTeacher, [name]: value });
    }
  };

  // Conditionally render the edit button based on the role
  const renderActionButton = (teacher) => {
    if (editMode === teacher.teacherId) {
      return (
        <div style={{ display: "flex", flexDirection: "row", width: "200px" }}>
          <button
            style={styles.button1}
            onClick={() => handleSaveClick(teacher._id)}
          >
            Save
          </button>
          <button
            style={styles.button1}
            onClick={() => handleDeleteClick(teacher)}
            disabled={true}
          >
            Delete
          </button>
        </div>
      );
    } else if (role === "admin") {
      return (
        <div style={{ display: "flex", gap: "10px", width: "fit-content" }}>
          <button
            style={styles.button1}
            onClick={() => handleEditClick(teacher)}
          >
            Edit
          </button>
          <button
            style={styles.button1}
            onClick={() => handleDeleteClick(teacher)}
          >
            Delete
          </button>
        </div>
      );
    } else {
      return null;
    }
  };

  // Redirect non-admin users to the home page
  // if (role !== 'admin') {
  //     console.error("Not an Admin");
  //     return <Navigate to="/" replace />;
  // }
  const headers = ["ID", "Name", "Email", "Mobile", "Class ID"];
  if (role === "admin") {
    headers.push("Actions");
  }

  return (
    <>
      <Header backButtonPath={backButtonPath} print={true} />
      <div style={styles.container}>
        <h1 style={styles.heading}>Teacher Details</h1>
        <table style={styles.table}>
          <thead>
            <tr>
              {headers.map((header) => (
                <th style={styles.th} key={header}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {teacherDetails.map((teacher, index) => (
              <tr
                key={teacher.teacherId}
                style={index % 2 === 0 ? styles.evenRow : styles.oddRow}
              >
                {console.log(teacher.classId)}
                <td style={styles.td}>
                  {editMode === teacher.teacherId ? (
                    <input
                      type="text"
                      name="teacherId"
                      value={editedTeacher.teacherId}
                      onChange={handleInputChange}
                      style={styles.input}
                      readOnly={editMode !== teacher.teacherId}
                    />
                  ) : (
                    <div style={styles.display}>
                      <p> {teacher.teacherId} </p>
                    </div>
                  )}
                </td>
                <td style={styles.td}>
                  {editMode === teacher.teacherId ? (
                    <input
                      type="text"
                      name="teacherName"
                      value={editedTeacher.teacherName}
                      onChange={handleInputChange}
                      style={styles.input}
                      readOnly={editMode !== teacher.teacherId}
                    />
                  ) : (
                    <div style={styles.display}>
                      <p> {teacher.teacherName} </p>
                    </div>
                  )}
                </td>
                <td style={styles.td}>
                  {editMode === teacher.teacherId ? (
                    <input
                      type="text"
                      name="email"
                      value={editedTeacher.email}
                      onChange={handleInputChange}
                      style={styles.input}
                      readOnly={editMode !== teacher.teacherId}
                    />
                  ) : (
                    <div style={styles.display}>
                      <p> {teacher.email} </p>
                    </div>
                  )}
                </td>
                <td style={styles.td}>
                  {editMode === teacher.teacherId ?
                    (
                      <input
                        type="text"
                        name="teacherMNo"
                        value={editedTeacher.teacherMNo}
                        onChange={handleInputChange}
                        style={styles.input}
                        readOnly={editMode !== teacher.teacherId}
                      />
                    ) :
                    (
                      <div style={styles.display}>
                        <p> {teacher.teacherMNo} </p>
                      </div>
                    )
                  }
                </td>
                <td style={styles.td}>
                  {editMode === teacher.teacherId ? (<input
                    type="text"
                    name="classId"
                    value={editedTeacher.classId.map((classid) => replacePrimaryLabels(classid))}
                    onChange={handleInputChange}
                    style={styles.input}
                    readOnly={true}
                  />) : (<div style={styles.display}>
                    <p> {teacher.classId.map((classid) => replacePrimaryLabels(classid)).join(', ')} </p>
                  </div>)}
                </td>
                {role === "admin" ? (
                  <td style={styles.td1}>{renderActionButton(teacher)}</td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
      {isOpen && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <span style={styles.close} onClick={closeModal}>
              &times;
            </span>
            <h2>Enter the details of new Teacher</h2>
            <form style={styles.form}>
              <label style={styles.label}>
                ID:
                <input
                  type="text"
                  name="teacherId"
                  //value={newTeacher.teacherId}
                  style={styles.input}
                  onChange={handleInputChange}
                />
              </label>
              <label style={styles.label}>
                Name:
                <input
                  type="text"
                  name="teacherName"
                  //value={newTeacher.teacherName}
                  style={styles.input}
                  onChange={handleInputChange}
                />
              </label>
              <label style={styles.label}>
                Email:
                <input
                  type="text"
                  name="email"
                  //value={newTeacher.email}
                  style={styles.input}
                  onChange={handleInputChange}
                />
              </label>
              <label style={styles.label}>
                Mobile:
                <input
                  type="text"
                  name="teacherMNo"
                  //value={newTeacher.teacherMNo}
                  style={styles.input}
                  onChange={handleInputChange}
                />
              </label>
              <label style={styles.label}>
                Class ID:
                <input
                  type="text"
                  name="classId"
                  value={
                    editedTeacher.classId.map((classid) => replacePrimaryLabels(classid))

                  }
                  //onChange={handleInputChange}
                  style={styles.input}
                  readOnly={true}
                />
              </label>
              <button
                type="submit"
                style={styles.submitButton}
                onClick={handleDelete}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

const styles = {
  container: {
    padding: "20px",
    margin: "20px auto",
    maxWidth: "3000px",
    backgroundColor: "#ffffff",
    border: "1px solid #ddd",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  heading: {
    fontSize: "28px",
    marginBottom: "20px",
    color: "#333",
    textAlign: "center",
    fontFamily: "'Roboto', sans-serif",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px",
  },
  th: {
    border: "1px solid #ddd",
    padding: "12px",
    textAlign: "left",
    backgroundImage: "linear-gradient(to right, #0066cc, #0099ff)",
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: "16px",
    // position: 'sticky',
    top: "0",
    zIndex: "1",
  },
  td: {
    border: "1px solid #ddd",
    padding: "12px",
    textAlign: "left",
    color: "#555",
    fontSize: "14px",
    transition: "background-color 0.3s",
  },
  td1: {
    border: "1px solid #ddd",
    padding: "12px",
    textAlign: "left",
    width: "12vw",
    color: "#555",
    fontSize: "14px",
    transition: "background-color 0.3s",
  },
  evenRow: {
    backgroundColor: "#f9f9f9",
    transition: "background-color 0.3s",
  },
  oddRow: {
    backgroundColor: "#ffffff",
    transition: "background-color 0.3s",
  },
  button1: {
    backgroundColor: "#007BFF",
    color: "#ffffff",
    border: "none",
    padding: "10px 20px",
    fontSize: "14px",
    margin: "0 8px 0 0", // Adds right spacing only
    cursor: "pointer",
    borderRadius: "6px",
    boxShadow: "0 2px 6px rgba(0, 123, 255, 0.3)",
    transition: "background-color 0.3s ease, transform 0.2s ease",
    display: "inline-block",

    '&:hover': {
      backgroundColor: "#0056b3",
      transform: "translateY(-1px)",
    },

    '&:active': {
      backgroundColor: "#004a9f",
      transform: "translateY(1px)",
    },
  },
  app: {
    textAlign: "center",
    marginTop: "50px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
  },
  modal: {
    // display: "block",
    position: "fixed",
    zIndex: 1,
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Black background with opacity
    justifyContent: "center",
    alignItems: "center",
    display: "flex", // To center the modal content
  },
  modalContent: {
    backgroundColor: "white",
    padding: "20px",
    border: "1px solid #888",
    width: "300px",
    maxWidth: "100%",
    position: "relative",
    borderRadius: "8px",
  },
  close: {
    color: "#aaa",
    position: "absolute",
    top: "10px",
    right: "10px",
    fontSize: "28px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "10px",
    fontSize: "16px",
  },
  input: {
    padding: "8px",
    margin: "5px 0 15px 0",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "16px",
    width: "100%",
    boxSizing: "border-box",
  },
  display: {
    // padding: "2px",
    margin: "5px 0 15px 0",
    // borderRadius: "4px",
    // border: "1px solid #ccc",
    fontSize: "16px",
    width: "100%",
    // boxSizing: "border-box",
  },
  submitButton: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "4px",
  },
};

export default TeacherTable;
