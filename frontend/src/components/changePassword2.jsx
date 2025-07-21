import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Using react-icons as per previous request
import { axiosInstance } from "../libs/axios";

const modalStyles = {
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
    inputContainer: {
        position: 'relative',
        width: '100%',
        marginBottom: '1.2rem',
        display: 'flex', // Use flexbox for better alignment of input and icon
        alignItems: 'center' // Vertically center items in the container
    },
    input: {
        width: '100%', // Take full width of the container
        padding: '1rem',
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '1rem',
        outline: 'none',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        boxSizing: 'border-box',
        paddingRight: '3.5rem', // Increased padding to ensure text doesn't overlap the icon
    },
    inputFocus: {
        borderColor: '#007bff',
        boxShadow: '0 0 0 3px rgba(0, 123, 255, 0.2)'
    },
    passwordToggle: {
        position: 'absolute',
        right: '12px', // Adjusted right position for better visual alignment
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#666',
        fontSize: '1.2rem',
        padding: '5px',
        zIndex: 10,
        display: 'flex', // Use flex to center the icon itself if it's a component
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
    }
};

const ChangePasswordModal = ({ isOpen, onClose }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
            const userId = localStorage.getItem("userId");
            const res = await axiosInstance.post(
                "/api/changepassword",
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
                setSuccess("Password changed successfully.");
                toast.success("Password changed successfully. Please login again.");
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                // Clear cookies and local storage, then redirect
                removeCookie("jwt");
                localStorage.removeItem("role");
                localStorage.removeItem("token");
                navigate("/");
            } else {
                setError(res.data.message || "Failed to change password.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Error changing password.");
        }
    };

    if (!isOpen) return null;

    return (
        <div style={modalStyles.overlay}>
            <div style={modalStyles.modal}>
                <button
                    onClick={onClose}
                    style={modalStyles.closeBtn}
                    onMouseEnter={e => e.currentTarget.style.color = modalStyles.closeBtnHover.color}
                    onMouseLeave={e => e.currentTarget.style.color = modalStyles.closeBtn.color}
                >
                    &times;
                </button>
                <h2 style={modalStyles.title}>Change Password</h2>
                <form onSubmit={handleSubmit} style={modalStyles.form}>
                    <div style={modalStyles.inputContainer}>
                        <input
                            type="password"
                            placeholder="Current Password"
                            value={currentPassword}
                            onChange={e => setCurrentPassword(e.target.value)}
                            style={modalStyles.input}
                            onFocus={e => { e.target.style.borderColor = modalStyles.inputFocus.borderColor; e.target.style.boxShadow = modalStyles.inputFocus.boxShadow; }}
                            onBlur={e => { e.target.style.borderColor = modalStyles.input.border; e.target.style.boxShadow = 'none'; }}
                        />
                    </div>

                    <div style={modalStyles.inputContainer}>
                        <input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="New Password"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            style={modalStyles.input}
                            onFocus={e => { e.target.style.borderColor = modalStyles.inputFocus.borderColor; e.target.style.boxShadow = modalStyles.inputFocus.boxShadow; }}
                            onBlur={e => { e.target.style.borderColor = modalStyles.input.border; e.target.style.boxShadow = 'none'; }}
                        />
                        <button
                            type="button"
                            style={modalStyles.passwordToggle}
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            onMouseEnter={e => e.currentTarget.style.color = modalStyles.passwordToggleHover.color}
                            onMouseLeave={e => e.currentTarget.style.color = modalStyles.passwordToggle.color}
                        >
                            {showNewPassword ? (
                                <FaEyeSlash />
                            ) : (
                                <FaEye />
                            )}
                        </button>
                    </div>

                    <div style={modalStyles.inputContainer}>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            style={modalStyles.input}
                            onFocus={e => { e.target.style.borderColor = modalStyles.inputFocus.borderColor; e.target.style.boxShadow = modalStyles.inputFocus.boxShadow; }}
                            onBlur={e => { e.target.style.borderColor = modalStyles.input.border; e.target.style.boxShadow = 'none'; }}
                        />
                        <button
                            type="button"
                            style={modalStyles.passwordToggle}
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            onMouseEnter={e => e.currentTarget.style.color = modalStyles.passwordToggleHover.color}
                            onMouseLeave={e => e.currentTarget.style.color = modalStyles.passwordToggle.color}
                        >
                            {showConfirmPassword ? (
                                <FaEyeSlash />
                            ) : (
                                <FaEye />
                            )}
                        </button>
                    </div>

                    {error && <div style={modalStyles.error}>{error}</div>}
                    {success && <div style={modalStyles.success}>{success}</div>}
                    <button
                        type="submit"
                        style={modalStyles.button}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = modalStyles.buttonHover.backgroundColor; e.currentTarget.style.transform = modalStyles.buttonHover.transform; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = modalStyles.button.background; e.currentTarget.style.transform = 'translateY(0)'; }}
                        onMouseDown={e => { e.currentTarget.style.transform = modalStyles.buttonActive.transform; e.currentTarget.style.backgroundColor = modalStyles.buttonActive.backgroundColor; }}
                        onMouseUp={e => { e.currentTarget.style.transform = modalStyles.buttonHover.transform; e.currentTarget.style.backgroundColor = modalStyles.buttonHover.backgroundColor; }}
                    >
                        Change Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordModal;