import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import 'react-toastify/dist/ReactToastify.css';
import { Header, Footer } from '../../components/components';
import ResetPasswordModal from '../../components/resetPassword';

function App() {
    // const [isAdmin, setIsAdmin] = useState(false); // This state will determine whether to show Admin or Home component
    const [selectedFile, setSelectedFile] = useState(null);
    // const [term, setTerm] = useState("");
    // const [year, setYear] = useState("");
    // const [group, setGroup] = useState("");
    const [uploadStatus, setUploadStatus] = useState("");
    const navigate = useNavigate();
    const [, , removeCookie] = useCookies([]);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        try {
            if (!selectedFile) {
                setUploadStatus('No file selected');
                return;
            }

            const formData = new FormData();
            formData.append('file', selectedFile);
            let response = await axios.post('http://localhost:4000/admin/registerTeacher', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
            })
                .catch(err => {
                    console.log(err.response)
                    setUploadStatus(`Error uploading file : ${err.response.data.msg}`);
                })

            if (response) {
                console.log(response)
                setUploadStatus('File uploaded successfully');
                toast.success('File uploaded successfully')
                navigate('/admin/editteachers');
            }
        } catch (error) {
            setUploadStatus(`Error uploading file : ${error.response}`);
            console.error(error);
        }
    };

    const handleDownloadTeachers = async () => {
        // try {
        // console.log("Attempting to download file");
        // console.log(`Bearer ${localStorage.getItem("token")}`);

        const response = await axios.get("http://localhost:4000/admin/download", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            responseType: "blob", // Important
            maxRedirects: 0, // Do not follow redirects
        });

        console.log(response);

        // Check if the response status is 200 OK
        if (response.status === 200) {
            // Create a URL for the file
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "sampleDataTeacher.xlsx"); // Change 'sampleDataTeacher.xlsx' to the name you want
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link); // Cleanup the DOM
        } else {
            console.error(`Unexpected response status: ${response.status}`);
        }
        // } catch (error) {
        //     console.error('Error downloading the file', error);
        // }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        await handleUpload(e);
    };

    const handleNavigateToStudentRegistration = () => {
        navigate('/admin/addstudents');
    };
    const handleViewTeachers = () => {
        navigate('/admin/viewteachers');
    };
    const handleViewPendingTeachers = () => {
        navigate('/admin/editteachers');
    };

    const handleViewStudents = () => {
        navigate("/admin/viewstudents");
    };

    const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
    const CustomButton = () => {
        const customButtonCss = {
            backgroundColor: 'white',
            border: '1px solid #ccc',
            padding: '8px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            color: '#007bff',
            fontWeight: 'bold',
            marginLeft: '1rem',
            '&:hover': {
                backgroundColor: '#e6e6e6',
            }
        }
        return (
            <>
                <button onClick={() => setShowResetPasswordModal(true)} style={customButtonCss}>Reset Password</button>
                <ResetPasswordModal isOpen={showResetPasswordModal} onClose={() => setShowResetPasswordModal(false)} />
            </>
        )
    };

    return (
        <div style={styles.container}>
            <Header logout={true} removeCookie={removeCookie} CustomButton={CustomButton} />
            <div style={styles.hero}>
                <h1 style={styles.heroTitle}>Welcome to Our Website</h1>
                <p style={styles.heroSubtitle}>
                    Explore our services and get to know us better.
                </p>
            </div>
            <div style={styles.adminContainer}>
                <div style={styles.halfContainer}>
                    <h1 style={styles.h1}>Teachers</h1>
                    <form onSubmit={handleRegister} style={styles.formGroup}>
                        <div style={styles.buttonContainer}>
                            <div style={styles.buttonWrapper}>
                                <button
                                    type="button"
                                    onClick={() => handleViewTeachers()}
                                    style={styles.button}
                                >
                                    View
                                </button>
                                <p style={styles.buttonDescription}>View registered teachers.</p>
                                {/* </div>
                            <div style={styles.buttonWrapper}> */}
                                <button
                                    type="button"
                                    onClick={() => handleViewPendingTeachers()}
                                    style={styles.button}
                                >
                                    View Upload Errors
                                </button>
                                <p style={styles.buttonDescription}>View unregistered teachers.</p>
                            </div>
                            <div style={styles.buttonWrapper}>
                                <button
                                    type="button"
                                    onClick={handleDownloadTeachers}
                                    style={styles.button}
                                >
                                    Download Spreadsheet
                                </button>
                                <p style={styles.buttonDescription}>Download the teacher spreadsheet.</p>
                            </div>
                            <div style={styles.buttonWrapper}>
                                <label style={styles.label}>Upload Excel File:</label>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    style={styles.input}
                                />
                            </div>
                            <div style={styles.buttonWrapper}>
                                <button onClick={handleUpload} type="submit" style={styles.button}>
                                    Register
                                </button>
                                <p style={styles.buttonDescription}>Upload and register new teachers.</p>
                            </div>
                        </div>
                        {uploadStatus && (
                            <p style={styles.uploadStatus}>{uploadStatus}</p>
                        )}
                    </form>
                </div>

                <div style={styles.halfContainer}>
                    <h1 style={styles.h1}>Students</h1>
                    <div style={styles.buttonContainer}>
                        <div style={styles.buttonWrapper}>
                            <button
                                type="button"
                                onClick={handleNavigateToStudentRegistration}
                                style={styles.button}
                            >
                                Register
                            </button>
                            <p style={styles.buttonDescription}>Navigate to student registration page.</p>
                        </div>
                        <div style={styles.buttonWrapper}>
                            <button
                                type="button"
                                onClick={() => handleViewStudents()}
                                style={styles.button}
                            >
                                View
                            </button>
                            <p style={styles.buttonDescription}>View registered students.</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            <ToastContainer />
        </div>
    );
}
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: '#f0f8ff',
    },
    navLinks: {
        display: 'flex',
        gap: '1.5rem',
    },
    navLink: {
        color: '#ffffff',
        textDecoration: 'none',
        fontSize: '1rem',
        transition: 'color 0.3s',
    },
    navLinkHover: {
        color: '#cccccc',
    },
    hero: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
        padding: '2rem',
        textAlign: 'center',
    },
    heroTitle: {
        fontSize: '3rem',
        color: '#333333',
        marginBottom: '1rem',
    },
    heroSubtitle: {
        fontSize: '1.5rem',
        color: '#666666',
        marginBottom: '2rem',
    },
    button: {
        padding: '0.8rem 1.5rem',
        fontSize: '1rem',
        backgroundColor: '#007bff',
        color: '#ffffff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s, transform 0.3s',
        margin: '0.5rem',
        width: '100%',
    },
    buttonHover: {
        backgroundColor: '#0056b3',
        transform: 'scale(1.05)',
    },
    adminContainer: {
        display: 'flex',
        justifyContent: 'space-around',
        padding: '2rem',
        backgroundColor: '#f0f8ff',
    },
    halfContainer: {
        flex: '1 1 45%',
        backgroundColor: '#ffffff',
        padding: '2rem',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        margin: '1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    h1: {
        fontSize: '2rem',
        marginBottom: '1rem',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '1rem',
        width: '100%',
    },
    label: {
        fontSize: '1rem',
        marginBottom: '0.5rem',
    },
    input: {
        padding: '0.5rem',
        fontSize: '1rem',
        borderRadius: '5px',
        border: '1px solid #ccc',
        width: '100%',
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
    },
    buttonWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '1rem',
        width: '100%',
    },
    buttonDescription: {
        fontSize: '0.9rem',
        color: '#666',
        textAlign: 'center',
        marginTop: '0.5rem',
    },
    uploadStatus: {
        color: '#ff0000',
        marginTop: '1rem',
        textAlign: 'center',
    },
    b1: {
        fontSize: '0.9rem',
        color: '#666',
        textAlign: 'center',
        marginTop: '0.5rem',

    },
};

export default App;
