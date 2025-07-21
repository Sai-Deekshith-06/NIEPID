import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { Footer, Header } from '../../components/components';
import { axiosInstance } from '../../libs/axios';

function Student() {
    console.log("hi 1")
    const navigate = useNavigate()
    const [, , removeCookie] = useCookies([]);
    const regNo = localStorage.getItem("userId")
    const [formData, setFormData] = useState({
        regNo: '',
        regDate: "",
        dob: '',
        name: '',
        sex: '',
        informant: '',
        education: '',
        referredBy: '',
        occupation: '',
        aadhar: '',
        paymentType: '',
        mobile: '',
    });
    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                console.log("hello")
                const res = await axiosInstance.get("/student/viewStudentDetails", {
                    headers: {
                        regNo: regNo,
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    }
                }, { withCredentials: true });
                const details = res.data;
                console.log(res)
                localStorage.setItem('regNo', res.data.info.regNo)
                setFormData({
                    regNo: details.info.regNo,
                    regDate: (details.info.regDate).toString().slice(0, 10),
                    dob: (details.info.dob).toString().slice(0, 10),
                    name: details.info.name,
                    sex: details.info.sex,
                    informant: details.info.information,
                    education: details.info.education,
                    referredBy: details.info.refBy,
                    occupation: details.info.occupation,
                    aadhar: (details.info.aadharNo).toString(),
                    paymentType: details.info.paymentType,
                    mobile: details.info.mobileNo,
                })
                console.log(details)
            } catch (err) {
                console.log(err)
                console.error("Error fetching student data", err.response);
            }
        };
        fetchStudentData();
    }, [regNo]);

    return (
        <div style={styles.studentContainer}>
            <Header logout={true} removeCookie={removeCookie} />
            <div style={styles.contentContainer}>
                <h3 style={styles.formTitle}>Welcome, {formData.name}</h3>
                <div style={styles.formContainer}>
                    <form style={styles.studentForm}>
                        {Object.entries(formData).map(([key, value]) => (
                            <div style={styles.formRow} key={key}>
                                <span style={styles.formLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                                <span style={styles.formValue}>{value}</span>
                            </div>
                        ))}
                        <div style={styles.buttonsContainer}>
                            <button style={styles.button} onClick={() => { navigate("/student/details") }}>Details</button>
                            <button style={styles.button} onClick={() => { navigate("/student/history") }}>History</button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}

const styles = {
    studentContainer: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#f0f4f8',
        fontFamily: 'Arial, sans-serif',
    },
    contentContainer: {
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '30px',
    },
    formTitle: {
        marginBottom: '25px',
        color: '#333',
        textAlign: 'center',
        fontSize: '2rem',
        fontWeight: '600',
    },
    formContainer: {
        width: '100%',
        maxWidth: '700px',
        padding: '25px',
        borderRadius: '10px',
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    },
    studentForm: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    formRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },
    formLabel: {
        fontWeight: 'bold',
        color: '#333',
        marginRight: '15px',
        minWidth: '180px',
        textAlign: 'left',
    },
    formValue: {
        color: '#333',
        flex: '1',
        textAlign: 'left',
        paddingLeft: '15px',
    },
    buttonsContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '25px',
    },
    button: {
        padding: '12px 25px',
        margin: '0 15px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
    buttonHover: {
        backgroundColor: '#0056b3',
    },
};

export default Student;
