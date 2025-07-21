import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Footer, Header } from "./components";

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        background: 'linear-gradient(135deg, #e0e7ff 0%, #f0f8ff 100%)',
    },
    formWrapper: {
        backgroundColor: '#ffffff',
        padding: '2.5rem 2rem',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        margin: '3rem auto',
        maxWidth: '420px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    formTitle: {
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '# rgba(0, 0, 0, 0.12)',
        marginBottom: '1.5rem',
        textAlign: 'center',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '1.25rem',
        width: '100%',
    },
    label: {
        fontSize: '1.1rem',
        marginBottom: '0.5rem',
        color: '#333',
        fontWeight: '500',
    },
    input: {
        padding: '0.75rem',
        fontSize: '1rem',
        borderRadius: '8px',
        border: '1px solid #b3c2e0',
        width: '100%',
        marginBottom: '0.25rem',
        backgroundColor: '#f7faff',
        transition: 'border-color 0.2s',
    },
    button: {
        padding: '0.9rem 1.5rem',
        fontSize: '1.1rem',
        background: 'linear-gradient(90deg, #007bff 60%, #0099ff 100%)',
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        transition: 'background 0.3s, transform 0.2s',
        marginTop: '1rem',
        width: '100%',
    },
    buttonHover: {
        background: 'linear-gradient(90deg, #0056b3 60%, #007bff 100%)',
        transform: 'scale(1.03)',
    },
    error: {
        color: '#ff4d4f',
        marginTop: 8,
        textAlign: 'center',
        fontWeight: '500',
        fontSize: '1rem',
    },
    success: {
        color: '#52c41a',
        marginTop: 8,
        textAlign: 'center',
        fontWeight: '500',
        fontSize: '1rem',
    },
};

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [buttonHover, setButtonHover] = useState(false);
    const [, , removeCookie] = useCookies([]);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!currentPassword || !newPassword || !confirmPassword) {
            setError('All fields are required.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('New passwords do not match.');
            return;
        }
        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        try {
            // Get userId from localStorage or context
            const userId = localStorage.getItem("userId");
            const res = await axios.post(
                "http://localhost:4000/api/changepassword",
                { userId, currentPassword, newPassword },
                {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    withCredentials: true,
                }
            );
            if (res.data.success) {
                setSuccess(res.data.message);
                toast.success("Password changed successfully. Please login again.");
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                removeCookie("jwt");
                localStorage.removeItem("role");
                localStorage.removeItem("token");
                navigate("/");

            } else {
                setError(res.data.message || "Failed to change password.");
            }
        } catch (err) {
            console.log(err)
            setError(
                err.response?.data?.message ||
                "Failed to change password. Please try again."
            );
        }
    };

    return (
        <div style={styles.container}>
            <Header backButtonPath={"/"} />
            <div style={styles.formWrapper}>
                <div style={styles.formTitle}>Change Password</div>
                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Current Password</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={e => setCurrentPassword(e.target.value)}
                            required
                            style={styles.input}
                            placeholder="Enter your current password"
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            required
                            style={styles.input}
                            placeholder="Enter new password"
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            required
                            style={styles.input}
                            placeholder="Confirm new password"
                        />
                    </div>
                    {error && <div style={styles.error}>{error}</div>}
                    {success && <div style={styles.success}>{success}</div>}
                    <button
                        type="submit"
                        style={buttonHover ? { ...styles.button, ...styles.buttonHover } : styles.button}
                        onMouseEnter={() => setButtonHover(true)}
                        onMouseLeave={() => setButtonHover(false)}
                    >
                        Change Password
                    </button>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default ChangePassword;