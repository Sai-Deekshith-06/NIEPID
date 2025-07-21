import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Header, Footer } from '../../components/components'
import { axiosInstance } from "../../libs/axios";

const EditTeachers = () => {
    const [teacherDetails, setTeacherDetails] = useState([]);
    const [editMode, setEditMode] = useState(null);
    const [editedTeacher, setEditedTeacher] = useState({
        teacherId: "",
        teacherName: "",
        email: "",
        teacherMNo: "",
        classId: [],
    });
    const navigate = useNavigate();
    const [refresh, needRefresh] = useState(0);
    const [count, setCount] = useState(-1);

    // Fetch the role from localStorage
    const role = localStorage.getItem("role");

    const fetchData = useCallback(async () => {
        try {
            const response = await axiosInstance.get(
                "/admin/pendingTeacher",
                {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                },
                {
                    withCredentials: true,
                }
            )
            console.log(response.data)
            setCount(response.data.count)
            setTeacherDetails(response.data.data.reverse());
        } catch (error) {
            console.error("Error fetching teacher details:", error.response);
        }
    }, [refresh]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        console.log(teacherDetails)
        console.log(teacherDetails.length, count)
        if (count === 0) {
            toast.info("No pending teacher registrations found.");
            navigate('/admin/viewTeachers');
        }
    }, [teacherDetails, navigate]);

    const handleEditClick = (teacher) => {
        setEditMode(teacher.teacherId);
        setEditedTeacher({ ...teacher }); // Copy teacher details to editedTeacher
    };

    const handleDeleteClick = async (teacher) => {
        try {
            await axiosInstance.post(
                `/admin/deletePendingTeacher/`,
                teacher,
                {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                },
                { withCredentials: true }
            ).then((res) => {
                console.log(res);
                toast.success(res.data.msg);
            }).catch((err) => {
                console.log(err);
                toast.error(err.response.data.msg);
            });
        } catch (err) {
            console.log(err.response);
            toast.error(err.response.data.message);
        }
        needRefresh((refresh + 1) % 2)
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

            await axiosInstance.post(
                `/admin/editPendingTeacher/`,
                { updatedTeacher },
                {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                },
                { withCredentials: true }
            )
                .then((res) => {
                    // Check for non-2xx response status
                    if (res.status < 200 || res.status >= 300) {
                        // Manually throw an error if the status is not 2xx
                        throw new Error(res.data.msg || 'An error occurred while updating the teacher');
                    }
                    console.log(res);
                    toast.success(res.data.msg);
                    fetchData(); // Refetch data to ensure it reflects changes immediately
                    setEditMode(null); // Exit edit mode after saving
                    setEditedTeacher({}); // Reset editedTeacher state
                })
                .catch((err) => {
                    setEditMode(null); // Exit edit mode after saving
                    toast.error(err.response.data.msg);
                });

            // if (response.status === 200) {
            //     // Update teacherDetails with the updated teacher
            //     const updatedDetails = teacherDetails.map((teacher) =>
            //         teacher.teacherId === id ? response.data : teacher
            //     );

            //     setTeacherDetails(updatedDetails);
            //     setEditMode(null);
            //     setEditedTeacher({}); // Reset editedTeacher state

            //     // Refetch data to ensure UI reflects changes immediately
            //     fetchData();
            // } else {
            //     console.error("Failed to update teacher details.");
            //     toast.error(response.data.message);
            // }
        } catch (error) {
            console.error("Error updating teacher details:", error.response);
            toast.error(error);
        }
        needRefresh((refresh + 1) % 2)
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

    // render the edit button
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
                <>
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
                </>
            );
        } else {
            return null;
        }
    };

    const headers = ["ID", "Name", "Email", "Mobile", "Class ID", "Error", "Actions"];

    return (
        <>
            <Header backButtonPath={'/admin'} />
            <div style={styles.container}>
                <h1 style={styles.heading}>View Upload Errors for Teacher registration</h1>
                <p style={{ color: "red", textAlign: "center" }}>NOTE: Only use one of the following values for classId: 'preprimary_1', 'preprimary_2', 'preprimary_3', 'primary1_1', 'primary1_2', 'primary1_3', 'primary2_1', 'primary2_2', 'primary2_3'
                </p>
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
                                    <input
                                        name="teacherId"
                                        type="text"
                                        value={
                                            editMode === teacher.teacherId
                                                ? editedTeacher.teacherId
                                                : teacher.teacherId
                                        }
                                        onChange={handleInputChange}
                                        style={styles.input}
                                        readOnly={editMode !== teacher.teacherId}
                                    />
                                </td>
                                <td style={styles.td}>
                                    <input
                                        name="teacherName"
                                        type="text"
                                        value={
                                            editMode === teacher.teacherId
                                                ? editedTeacher.teacherName
                                                : teacher.teacherName
                                        }
                                        onChange={handleInputChange}
                                        style={styles.input}
                                        readOnly={editMode !== teacher.teacherId}
                                    />
                                </td>
                                <td style={styles.td}>
                                    <input
                                        name="email"
                                        type="text"
                                        value={
                                            editMode === teacher.teacherId
                                                ? editedTeacher.email
                                                : teacher.email
                                        }
                                        onChange={handleInputChange}
                                        style={styles.input}
                                        readOnly={editMode !== teacher.teacherId}
                                    />
                                </td>
                                <td style={styles.td}>
                                    <input
                                        name="teacherMNo"
                                        type="text"
                                        value={
                                            editMode === teacher.teacherId
                                                ? editedTeacher.teacherMNo
                                                : teacher.teacherMNo
                                        }
                                        onChange={handleInputChange}
                                        style={styles.input}
                                        readOnly={editMode !== teacher.teacherId}
                                    />
                                </td>
                                <td style={styles.td}>
                                    <input
                                        type="text"
                                        name="classId"
                                        value={
                                            editMode === teacher.teacherId
                                                ? editedTeacher.classId
                                                : teacher.classId
                                        }
                                        onChange={handleInputChange}
                                        style={styles.input}
                                        readOnly={editMode !== teacher.teacherId}
                                    />
                                </td>
                                <td style={styles.td}>
                                    {teacher.msg}
                                </td>


                                <td style={styles.td1}>{renderActionButton(teacher)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Footer />
        </>
    );
};

const styles = {
    container: {
        padding: "20px",
        margin: "20px auto",
        maxWidth: "3000px",
        minHeight: "70vh",
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
        textAlign: "center",
        textDecoration: "none",
        display: "inline-block",
        fontSize: "14px",
        margin: "4px 2px",
        cursor: "pointer",
        borderRadius: "5px",
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

export default EditTeachers;
