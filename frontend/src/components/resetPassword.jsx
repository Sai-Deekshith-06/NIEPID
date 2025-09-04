import React, { useState } from "react";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash, FaArrowRight } from "react-icons/fa"; // Importing FaArrowRight for the arrow button
import { axiosInstance } from "../libs/axios";

const resetModalStyles = {
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
    inputGroup: { // To group username input and arrow button
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        marginBottom: '1.2rem',
        border: '1px solid #ddd', // Border around the group
        borderRadius: '8px',
        overflow: 'hidden', // Ensures inner elements don't overflow rounded corners
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    },
    inputGroupFocus: {
        borderColor: '#007bff',
        boxShadow: '0 0 0 3px rgba(0, 123, 255, 0.2)'
    },
    input: {
        flexGrow: 1, // Allows input to take up remaining space
        padding: '1rem',
        border: 'none', // No individual border
        fontSize: '1rem',
        outline: 'none',
        boxSizing: 'border-box',
    },
    arrowButton: {
        background: '#007bff',
        color: 'white',
        border: 'none',
        padding: '1rem 1.2rem',
        cursor: 'pointer',
        fontSize: '1.2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color 0.2s ease',
        height: '100%', // Match height of input
    },
    arrowButtonHover: {
        backgroundColor: '#0056b3',
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

const ResetPasswordModal = ({ isOpen, onClose }) => {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [foundUser, setFoundUser] = useState(null); // Stores { name, role } if user is found
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [step, setStep] = useState(1); // 1 for user ID input, 2 for password confirmation
    const adminID = localStorage.getItem('userId')

    const handleUserIdSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setFoundUser(null);

        if (!userId) {
            setError('Please enter a User ID.');
            return;
        } else if (userId === adminID) {
            return;
        }

        try {
            // API endpoint to check user ID and get info
            const res = await axiosInstance.post("/api/checkUserForReset",
                { userId },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );

            if (res.data.success) {
                setFoundUser({ id: userId, role: res.data.role });
                setStep(2); // Move to the next step
            } else {
                setError(res.data.message || "User not found.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Error checking user ID.");
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!password) {
            setError('Please enter your password to confirm reset.');
            return;
        }

        try {
            // Replace with your actual API endpoint to reset password
            const res = await axiosInstance.post("/api/resetPasswordConfirm",
                { userId: userId, adminID: adminID, confirmationPassword: password },
                {
                    headers: {
                        "Content-Type": "application/json",
                        // You might need an admin token here if only admins can reset passwords
                        // For a user resetting their own forgotten password, the backend logic would differ
                        // authorization: `Bearer ${localStorage.getItem("adminToken")}`,
                    },
                    withCredentials: true,
                }
            );

            if (res.data.success) {
                setSuccess("Password reset successfully!");
                toast.success(`${userId}'s password has been reset successfully!`);
                setUserId('');
                setPassword('');
                setFoundUser(null);
                setStep(1); // Reset to first step
                onClose(); // Close the modal on success
            } else {
                setError(res.data.message || "Failed to reset password.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Error resetting password.");
        }
    };

    if (!isOpen) return null;

    return (
        <div style={resetModalStyles.overlay}>
            <div style={resetModalStyles.modal}>
                <button
                    onClick={() => { onClose(); setStep(1); setUserId(''); setPassword(''); setFoundUser(null); setError(''); setSuccess(''); }} // Reset state on close
                    style={resetModalStyles.closeBtn}
                    onMouseEnter={e => e.currentTarget.style.color = resetModalStyles.closeBtnHover.color}
                    onMouseLeave={e => e.currentTarget.style.color = resetModalStyles.closeBtn.color}
                >
                    &times;
                </button>
                <h2 style={resetModalStyles.title}>Reset Password</h2>

                {step === 1 && (
                    <form onSubmit={handleUserIdSubmit} style={resetModalStyles.form}>
                        <div
                            style={resetModalStyles.inputGroup}
                            onFocus={e => { e.currentTarget.style.borderColor = resetModalStyles.inputGroupFocus.borderColor; e.currentTarget.style.boxShadow = resetModalStyles.inputGroupFocus.boxShadow; }}
                            onBlur={e => { e.currentTarget.style.borderColor = '#ddd'; e.currentTarget.style.boxShadow = 'none'; }}
                        >
                            <input
                                type="text"
                                placeholder="User ID"
                                name="UsernameToReset"
                                value={userId}
                                onChange={e => setUserId(e.target.value)}
                                style={resetModalStyles.input}
                            />
                            <button
                                type="submit"
                                style={resetModalStyles.arrowButton}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = resetModalStyles.arrowButtonHover.backgroundColor}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = resetModalStyles.arrowButton.background}
                            >
                                <FaArrowRight />
                            </button>
                        </div>
                        {error && <div style={resetModalStyles.error}>{error}</div>}
                    </form>
                )}

                {step === 2 && foundUser && (
                    <form onSubmit={handleResetPassword} style={resetModalStyles.form}>
                        <p style={resetModalStyles.message}>
                            Enter your password to confirm the reset password for:
                        </p>
                        <div style={resetModalStyles.userInfo}>
                            <p>id: {foundUser.id}</p>
                            <p>role: {foundUser.role}</p>
                        </div>
                        <div style={resetModalStyles.passwordInputContainer}>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                style={resetModalStyles.passwordInputField}
                                onFocus={e => { e.target.style.borderColor = resetModalStyles.passwordInputFieldFocus.borderColor; e.target.style.boxShadow = resetModalStyles.passwordInputFieldFocus.boxShadow; }}
                                onBlur={e => { e.target.style.borderColor = resetModalStyles.passwordInputField.border; e.target.style.boxShadow = 'none'; }}
                            />
                            <button
                                type="button"
                                style={resetModalStyles.passwordToggle}
                                onClick={() => setShowPassword(!showPassword)}
                                onMouseEnter={e => e.currentTarget.style.color = resetModalStyles.passwordToggleHover.color}
                                onMouseLeave={e => e.currentTarget.style.color = resetModalStyles.passwordToggle.color}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {error && <div style={resetModalStyles.error}>{error}</div>}
                        {success && <div style={resetModalStyles.success}>{success}</div>}
                        <button
                            type="submit"
                            style={resetModalStyles.button}
                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = resetModalStyles.buttonHover.backgroundColor; e.currentTarget.style.transform = resetModalStyles.buttonHover.transform; }}
                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = resetModalStyles.button.background; e.currentTarget.style.transform = 'translateY(0)'; }}
                            onMouseDown={e => { e.currentTarget.style.transform = resetModalStyles.buttonActive.transform; e.currentTarget.style.backgroundColor = resetModalStyles.buttonActive.backgroundColor; }}
                            onMouseUp={e => { e.currentTarget.style.transform = resetModalStyles.buttonHover.transform; e.currentTarget.style.backgroundColor = resetModalStyles.buttonHover.backgroundColor; }}
                        >
                            Reset
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPasswordModal;