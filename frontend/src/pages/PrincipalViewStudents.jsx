import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import axios from 'axios';
import image from './th.jpeg'
import { Footer, Header } from '../components/components';


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

const PrincipalViewStudents = () => {
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

    useEffect(() => {
        fetchStudentDetails();
    }, []);

    const fetchStudentDetails = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:4000/principal/viewstudents', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            setStudentDetails(response.data.data);
            setFilteredStudents(response.data.data);
            setLoading(false);
        } catch (error) {
            console.log(error)
            console.error(error);
            setError('Error fetching student details. Please try again later.');
            setLoading(false);
        }
    };

    const fetchTeacherDetails = async (classId) => {
        try {
            console.log("Hello")
            const response = await axios.get(`http://localhost:4000/principal/teacher/${classId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
            });
            //console.log(classId)
            setTeacherDetails(prevState => ({ ...prevState, [classId]: response.data.teacher }));
        } catch (error) {
            toast.error('Error fetching teacher details')
            console.error('Error fetching teacher details:', error.response);
        }
    };

    useEffect(() => {
        studentDetails.forEach(student => {
            if (student.classId && !teacherDetails[student.classId]) {
                fetchTeacherDetails(student.classId);
            }
        });
    }, [studentDetails]);

    useEffect(() => {
        filterStudents();
    }, [searchValues]);

    const filterStudents = () => {
        let filtered = studentDetails;

        Object.keys(searchValues).forEach(key => {
            if (searchValues[key]) {

                filtered = filtered.filter(student =>
                    student[key] && student[key].toString().toLowerCase().includes(searchValues[key].toLowerCase())
                );
            }
        });

        setFilteredStudents(filtered);
    };

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

    const toggleSearch = (column) => {

        setShowSearch(prevState => {
            let newShowSearch = { ...prevState };
            Object.keys(newShowSearch).forEach(key => {
                newShowSearch[key] = key === column ? !prevState[column] : false;
            });
            return newShowSearch;
        });
    };

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchValues(searchValues => ({ ...searchValues, [name]: value }));
    };

    const showHistory = (studentId) => {
        console.log(studentId)
        localStorage.setItem("studentId", studentId)

        navigate(`/principal/viewstudents/history/${studentId}`);
    };

    const showDetails = (studentId) => {
        localStorage.setItem("regNo", studentId)
        navigate(`/principal/viewstudents/details/${studentId}`);

    }

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    // const Header = () => (
    //     <header style={styles.header}>
    //         <div style={styles.logo}>
    //             <img src={image} alt="Logo" style={styles.logoImage} />
    //             <span style={styles.logoLabel}>NIEPID</span>
    //         </div>
    //         <nav style={styles.navLinks}>
    //             <button onClick={() => navigate('/principal')} style={styles.backButton}>
    //                 Back
    //             </button>
    //         </nav>
    //     </header>
    // );

    return (
        <div>
            <Header backButtonPath={'/principal'} print={true} />
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
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Footer />
        </div>
    );
};

const styles = {
    div: {
        display: 'flex',
        justifyContent: 'space-evenly'
    },
    container: {
        padding: '20px',
        margin: '20px auto',
        width: "96%",
        minHeight: "70vh",
        // maxWidth: '3000px',
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
        margin: '5px'
    },
    buttonHover: {
        backgroundColor: '#005bb5'
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
};

export default PrincipalViewStudents;