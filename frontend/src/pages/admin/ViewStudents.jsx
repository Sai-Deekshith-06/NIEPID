import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { Footer, Header } from '../../components/components';
import Loading from '../../components/loading';
import { axiosInstance } from '../../libs/axios';
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";


// Add the icons to the library
library.add(faSearch);

const SearchInput = ({ name, value, onChange }) => {
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    return (
        <input
            type="text"
            ref={inputRef}
            name={name}
            value={value || ''}
            onChange={onChange}
            placeholder={`Search ${name}`}
            style={styles.searchInput}
        />
    );
};

const ViewStudents = () => {
    const navigate = useNavigate();
    const [studentDetails, setStudentDetails] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [teacherDetails, setTeacherDetails] = useState({});
    const [showSearch, setShowSearch] = useState({
        regNo: false,
        name: false,
        currYear: false,
        currTerm: false,
        classId: false,
    });

    const [searchValues, setSearchValues] = useState({
        regno: '',
        name: '',
        curryear: '',
        currterm: '',
        classid: '',
    });

    const fetchStudentDetails = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/admin/viewstudents', {//'http://localhost:4000/principal/student1'
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },

            });

            setStudentDetails(response.data.data);
            setFilteredStudents(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setError('Error fetching student details. Please try again later.');
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStudentDetails();
    }, [fetchStudentDetails]);

    const fetchTeacherDetails = async (classId) => {
        try {
            console.log("Hello")
            const response = await axiosInstance.get(`/admin/teacher/${classId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
            });
            //console.log(classId)
            setTeacherDetails(prevState => ({ ...prevState, [classId]: response.data.teacher }));
        } catch (error) {
            console.error('Error fetching teacher details:', error.response);
        }
    };

    useEffect(() => {
        studentDetails.forEach(student => {
            if (student.classId && !teacherDetails[student.classId]) {
                fetchTeacherDetails(student.classId);
            }
        });
    }, [studentDetails, teacherDetails, fetchStudentDetails]);

    const filterStudents = useCallback((searchvals) => {
        let filtered = studentDetails;

        Object.keys(searchvals).forEach(key => {
            if (searchvals[key]) {

                filtered = filtered.filter(student =>
                    student[key] && student[key].toString().toLowerCase().includes(searchvals[key].toLowerCase())
                );
            }
        });

        setFilteredStudents(filtered);
    }, [studentDetails]);

    useEffect(() => {
        filterStudents(searchValues);
    }, [searchValues, filterStudents]);

    const toggleSearch = (column) => {

        setShowSearch(prevState => {
            let newShowSearch = { ...prevState };
            Object.keys(newShowSearch).forEach(key => {
                newShowSearch[key] = key === column ? !prevState[column] : false;
            });
            return newShowSearch;
        });
    };

    const replacePrimaryLabels = (text) => {
        // console.log(text)
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

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchValues(searchValues => ({ ...searchValues, [name]: value }));
    };

    const showHistory = (studentId) => {
        console.log(studentId)
        localStorage.setItem("studentId", studentId)

        navigate(`/admin/viewstudents/history/${studentId}`);
    };

    const showDetails = (studentId) => {
        localStorage.setItem("regNo", studentId)
        navigate(`/admin/viewstudents/details/${studentId}`);
    }
    const DeleteModalStyles = {
        overlay: {
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        },
        modal: {
            backgroundColor: '#ffffff',
            padding: '2.5rem',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.25)',
            width: '100%',
            maxWidth: '450px',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        },
        closeBtn: {
            position: 'absolute',
            top: '15px',
            right: '15px',
            fontSize: '1.5rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#666',
            transition: 'color 0.2s ease',
            padding: '5px'
        },
        closeBtnHover: {
            color: '#333'
        },
        title: {
            fontSize: '2rem',
            fontWeight: '600',
            color: '#333',
            marginBottom: '1.8rem',
            textAlign: 'center'
        },
        userInfo: {
            // marginBottom: '1.2rem',
            fontSize: '1rem',
            color: '#555',
            textAlign: 'center',
            width: '100%',
            padding: '0 1rem',
        },
        passwordInputContainer: { // New style for input container to hold input and icon
            position: 'relative',
            width: '100%',
            marginBottom: '1.2rem',
            display: 'flex',
            alignItems: 'center'
        },
        passwordInputField: { // Style for the password input field itself
            width: '100%',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: '1rem',
            outline: 'none',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            boxSizing: 'border-box',
            paddingRight: '3.5rem', // Space for the eye icon
        },
        passwordInputFieldFocus: {
            borderColor: '#007bff',
            boxShadow: '0 0 0 3px rgba(0, 123, 255, 0.2)'
        },
        passwordToggle: {
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#666',
            fontSize: '1.2rem',
            padding: '5px',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        passwordToggleHover: {
            color: '#333',
        },
        button: {
            width: '100%',
            padding: '1rem',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            transition: 'background-color 0.2s ease, transform 0.1s ease',
            marginTop: '0.8rem'
        },
        buttonHover: {
            backgroundColor: '#0056b3',
            transform: 'translateY(-1px)'
        },
        buttonActive: {
            transform: 'translateY(0)',
            backgroundColor: '#004085'
        },
        error: {
            color: '#dc3545',
            fontSize: '0.95rem',
            marginBottom: '1rem',
            textAlign: 'center',
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            borderRadius: '5px',
            padding: '0.75rem 1rem',
            width: '100%',
            boxSizing: 'border-box'
        },
        success: {
            color: '#28a745',
            fontSize: '0.95rem',
            marginBottom: '1rem',
            textAlign: 'center',
            backgroundColor: '#d4edda',
            border: '1px solid #c3e6cb',
            borderRadius: '5px',
            padding: '0.75rem 1rem',
            width: '100%',
            boxSizing: 'border-box'
        },
        form: {
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        },
        message: {
            margin: '0',
            /*marginBottom: '1rem',*/
            textAlign: 'center',
            color: 'red'
        }
    };
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const ConfirmDelete = ({ isOpen = true, onClose, regNo, name }) => {
        const [password, setPassword] = useState('');
        const [error, setError] = useState('');
        const [success, setSuccess] = useState('');
        const [showPassword, setShowPassword] = useState(false);
        const adminID = localStorage.getItem('userId');

        const deleteStudent = async (e) => {
            e.preventDefault();
            setError('');
            setSuccess('');

            if (!password) {
                setError('Please enter your password to confirm deletion.');
                return;
            }

            try {
                const res = await axiosInstance.post(
                    "/admin/deleteStudent",
                    { regNo, adminID, confirmationPassword: password },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                );

                if (res.data.success) {
                    setSuccess("Student deleted successfully!");
                    toast.success(`${name}'s account has been deleted successfully!`);
                    setPassword('');
                    onClose();
                    // Refresh the student list after successful deletion
                    fetchStudentDetails();
                } else {
                    setError(res.data.message || "Failed to delete student account.");
                }
            } catch (err) {
                console.log(err);
                setError(err.response?.data?.message || "Error deleting student account.");
            }
        };

        if (!isOpen) return null;

        return (
            <div style={DeleteModalStyles.overlay}>
                <div style={DeleteModalStyles.modal}>
                    <button
                        onClick={() => {
                            onClose();
                            setPassword('');
                            setError('');
                            setSuccess('');
                        }}
                        style={DeleteModalStyles.closeBtn}
                        onMouseEnter={e => e.currentTarget.style.color = DeleteModalStyles.closeBtnHover.color}
                        onMouseLeave={e => e.currentTarget.style.color = DeleteModalStyles.closeBtn.color}
                    >
                        &times;
                    </button>
                    <h2 style={DeleteModalStyles.title}>Confirm Deletion</h2>

                    <form onSubmit={deleteStudent} style={DeleteModalStyles.form}>
                        <p style={DeleteModalStyles.message}>
                            Enter your password to confirm the account deletion for:
                        </p>
                        <div style={DeleteModalStyles.userInfo}>
                            <p>ID: {regNo}</p>
                            <p>Name: {name}</p>
                        </div>
                        <div style={DeleteModalStyles.passwordInputContainer}>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                style={DeleteModalStyles.passwordInputField}
                                onFocus={e => {
                                    e.target.style.borderColor = DeleteModalStyles.passwordInputFieldFocus.borderColor;
                                    e.target.style.boxShadow = DeleteModalStyles.passwordInputFieldFocus.boxShadow;
                                }}
                                onBlur={e => {
                                    e.target.style.borderColor = DeleteModalStyles.passwordInputField.border;
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                            <button
                                type="button"
                                style={DeleteModalStyles.passwordToggle}
                                onClick={() => setShowPassword(!showPassword)}
                                onMouseEnter={e => e.currentTarget.style.color = DeleteModalStyles.passwordToggleHover.color}
                                onMouseLeave={e => e.currentTarget.style.color = DeleteModalStyles.passwordToggle.color}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {error && <div style={DeleteModalStyles.error}>{error}</div>}
                        {success && <div style={DeleteModalStyles.success}>{success}</div>}
                        <button
                            type="submit"
                            style={DeleteModalStyles.button}
                            onMouseEnter={e => {
                                e.currentTarget.style.backgroundColor = DeleteModalStyles.buttonHover.backgroundColor;
                                e.currentTarget.style.transform = DeleteModalStyles.buttonHover.transform;
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.backgroundColor = DeleteModalStyles.button.background;
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                            onMouseDown={e => {
                                e.currentTarget.style.transform = DeleteModalStyles.buttonActive.transform;
                                e.currentTarget.style.backgroundColor = DeleteModalStyles.buttonActive.backgroundColor;
                            }}
                            onMouseUp={e => {
                                e.currentTarget.style.transform = DeleteModalStyles.buttonHover.transform;
                                e.currentTarget.style.backgroundColor = DeleteModalStyles.buttonHover.backgroundColor;
                            }}
                        >
                            Delete
                        </button>
                    </form>
                </div>
            </div>
        );
    };
    if (error) return <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.5rem',
        fontWeight: '500'
    }}>
        Error: {error}
    </div>;

    return (loading ? <Loading /> :
        <>
            <Header backButtonPath={'/admin'} />
            <div style={styles.container}>
                <h1 style={styles.heading}>Student Details</h1>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            {['regNo', 'name', 'currYear', 'currTerm', 'classId'].map((header, index) => (
                                <th style={styles.th} key={header}>
                                    <div style={styles.thContent}>
                                        <span>{header}</span>
                                        {header !== 'Actions' && (
                                            <FontAwesomeIcon
                                                style={styles.icon}
                                                icon={faSearch}
                                                onClick={() => toggleSearch(header.replace(' ', ''))}
                                            />
                                        )}
                                    </div>
                                    {header !== 'Actions' && showSearch[header.replace(' ', '')] && (
                                        <SearchInput
                                            name={header.replace(' ', '')}
                                            value={searchValues[header.replace(' ', '')]}
                                            onChange={handleSearchChange}
                                        />
                                    )}
                                </th>
                            ))}
                            <th style={styles.th}>
                                <div style={styles.thContent}>
                                    <span>Allocated Teacher</span>
                                </div>
                            </th>
                            <th style={styles.th}>
                                <div style={styles.thContent}>
                                    <span>Actions</span>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map((student, index) => (
                            <tr key={student._id} style={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
                                <td style={styles.td}>{student.regNo}</td>
                                <td style={styles.td}>{student.name}</td>
                                <td style={styles.td}>{student.currYear}</td>
                                <td style={styles.td}>{student.currTerm}</td>
                                <td style={styles.td}>{replacePrimaryLabels(student.classId)}</td>
                                <td style={styles.td}>
                                    {teacherDetails[student.classId] ? teacherDetails[student.classId] : 'Loading...'}
                                </td>
                                <td style={styles.td}>
                                    <div style={styles.div}>
                                        <button style={styles.button} onClick={() => showHistory(student.regNo)}>
                                            Show History
                                        </button>
                                        <button style={styles.button} onClick={() => showDetails(student.regNo)}>
                                            Show Details
                                        </button>
                                        <button
                                            style={styles.delete}
                                            onClick={() => {
                                                setSelectedStudent(student);
                                                setShowDeleteModal(true);
                                            }}
                                        >
                                            Delete
                                        </button>

                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {showDeleteModal && selectedStudent && (
                    <ConfirmDelete
                        isOpen={showDeleteModal}
                        onClose={() => setShowDeleteModal(false)}
                        regNo={selectedStudent.regNo}
                        name={selectedStudent.name}
                    />
                )}
            </div>
            <Footer />
        </>
    );
};

const styles = {
    div: {
        display: 'flex',
    },
    container: {
        padding: '20px',
        margin: '20px auto',
        width: '96%',
        minHeight: '60vh',
        // maxWidth: '3004px',
        backgroundColor: '#ffffff',
        border: '1px solid #ddd',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    icon: {
        marginLeft: '8px',
        cursor: 'pointer'
    },
    thContent: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    heading: {
        fontSize: '28px',
        marginBottom: '20px',
        color: '#333',
        textAlign: 'center',
        fontFamily: "'Roboto', sans-serif"
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '10px'
    },
    th: {
        border: '1px solid #ddd',
        padding: '12px',
        textAlign: 'left',
        backgroundImage: 'linear-gradient(to right, #0066cc, #0099ff)',
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: '16px',
        // position: 'sticky',
        top: '0',
        zIndex: '1',
    },
    searchInput: {
        width: '100%',
        padding: '8px',
        margin: '5px 0',
        border: '1px solid #ddd',
        borderRadius: '4px',
        boxSizing: 'border-box'
    },
    td: {
        border: '1px solid #ddd',
        padding: '12px',
        textAlign: 'center',
        color: '#555',
        fontSize: '14px',
        transition: 'background-color 0.3s'
    },
    button: {
        padding: '8px 12px',
        border: 'none',
        backgroundColor: '#0066cc',
        color: '#fff',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        margin: '5px',
        '&:hover': {
            backgroundColor: '#005bb5'
        }
    },
    delete: {
        padding: '8px 12px',
        border: 'none',
        color: '#fff',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        margin: '5px',
        backgroundColor: '#f83e3e',
    },
    evenRow: {
        backgroundColor: '#f9f9f9',
        transition: 'background-color 0.3s',
    },
    oddRow: {
        backgroundColor: '#ffffff',
        transition: 'background-color 0.3s',
    },
    rowHover: {
        cursor: 'pointer',
        ':hover': {
            backgroundColor: '#e9ecef'
        }
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        backgroundColor: '#007bff',
        color: '#ffffff',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        marginBottom: '1rem'
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
    },
    logoImage: {
        width: '40px',
        height: '40px',
        marginRight: '0.5rem',
    },
    logoLabel: {
        fontSize: '1.5rem',
    },
    backButton: {
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
        },
    },
};

export default ViewStudents;