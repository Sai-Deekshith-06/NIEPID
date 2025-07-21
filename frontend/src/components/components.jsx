import React, { useState } from 'react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { createUseStyles } from 'react-jss';
import image from './th.jpeg';
import { useNavigate } from 'react-router-dom';
import ChangePasswordModal from './changePassword2';

const useStyles = createUseStyles({
    // for header 
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        backgroundColor: '#007bff',
        color: '#ffffff',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        marginBottom: '1vh',
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
    navLinks: {
        display: 'flex',
        alignItems: 'center',
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
    logoutButton: {
        padding: '10px 15px',
        backgroundColor: '#f83e3e',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        marginLeft: '1rem',
    },
    // for footer
    footer: {
        backgroundColor: '#007bff',
        color: '#ffffff',
        textAlign: 'center',
        padding: '0.5rem 1rem',
        borderTop: '1px solid #e0e0e0',
        fontSize: '0.95rem',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        boxShadow: '0 -1px 4px rgba(0, 0, 0, 0.05)',
        marginTop: '1vh',
    },
    // for ScrollToButton 
    scrollTopButton: {
        position: 'fixed',
        bottom: '20px',
        right: '10px',
        backgroundColor: 'transparent',
        color: 'black',
        padding: 10,
        borderRadius: 30,
        border: '1px solid #ccc',
        fontSize: 14,
        cursor: 'pointer',
        width: 'fit-content',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'background-color 0.3s, transform 0.3s',

        '&:hover': {
            backgroundColor: '#e0e0e0',
            transform: 'translateY(2px)',
        },
    },
    scrollDownButton: {
        position: 'fixed',
        top: '4rem',
        right: '10px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        color: 'black',
        padding: 10,
        borderRadius: 30,
        border: '1px solid #ccc',
        fontSize: 14,
        cursor: 'pointer',
        width: 'fit-content',
        transition: 'background-color 0.3s, transform 0.3s',

        '&:hover': {
            backgroundColor: '#e0e0e0',
            transform: 'translateY(2px)',
        },
    },
});
/**
* @param {string} id - The unique identifier for the header component or user.
* @param {string} name - The name of the user to be displayed in the header.
* @param {string} backButtonPath - A string representing the URL path to navigate when the back button is clicked.
* @param {boolean} logout - Displays a logout button
* @param {function} removeCookie - A function to remove the user's authentication cookie, typically called during logout.
* @param {function} CustomButton - A function to render a customized button
* @param {boolean} print - Displays a print button
* 
* @returns {JSX.Element} The rendered Header component.
*/
const Header = ({ id, name, backButtonPath, logout, removeCookie, CustomButton, print }) => {
    if (backButtonPath && (logout || removeCookie)) {
        console.warn("Haeder: Cannot use both logout and back button")
    }
    const classes = useStyles();
    const navigateTo = useNavigate();
    let handleLogout
    const [showModal, setShowModal] = useState(false);
    if (removeCookie) {
        handleLogout = () => {
            removeCookie('jwt');
            localStorage.removeItem("role");
            localStorage.removeItem("token");
            localStorage.clear()
            navigateTo('/');
        };
    }

    return (
        <header className={classes.header}>
            <div className={classes.logo}>
                <img src={image} alt="Logo" className={classes.logoImage} />
                <span className={classes.logoLabel}>NIEPID</span>
            </div>
            {id && name && (
                <div>
                    <b>{id} - {name}</b>
                </div>
            )}
            <nav className={classes.navLinks}>
                {print && (
                    <button onClick={(e) => window.print()} className={classes.backButton}>
                        Print
                    </button>
                )}
                {backButtonPath && (
                    <button onClick={() => navigateTo(backButtonPath)} className={classes.backButton}>
                        Back
                    </button>
                )}
                {CustomButton && <CustomButton />}
                {logout && removeCookie && (
                    <div className='home'>
                        <>
                            <button onClick={() => setShowModal(true)} className={classes.backButton}>Change Password</button>
                            <ChangePasswordModal isOpen={showModal} onClose={() => setShowModal(false)} />
                        </>
                        {/* <button onClick={() => navigateTo('/changepassword')} className={classes.backButton}>
                            Change Password
                        </button> */}
                        <button onClick={handleLogout} className={classes.logoutButton}>
                            Logout
                        </button>
                    </div>
                )}
            </nav>
        </header>
    );
};

/**
* @returns {JSX.Element} The rendered Header component.
*/
const Footer = () => {
    const classes = useStyles();
    return (
        <footer className={classes.footer}>
            <p>&copy; 2023 Our Website. All rights reserved.</p>
        </footer>
    )
}

/**
 * A button component that scrolls the window to a specific vertical position when clicked.
 *
 * @param {boolean} [scrollDown=false] - If true, scrolls down to the target position; if false, scrolls up.
 * @param {number} [scrollTarget=0] - The vertical scroll position in pixels to scroll down; if 0(zero), scrolls to end 
 *
 * @returns {JSX.Element} The rendered ScrollToButton component.
 */
const ScrollToButton = ({ scrollDown = false, scrollTarget = 0 }) => {
    const classes = useStyles();
    if (scrollDown && scrollTarget === 0)
        scrollTarget = document.documentElement.scrollHeight
    const handleClick = () => {
        window.scrollTo({
            top: scrollDown ? scrollTarget : 0,
            behavior: 'smooth',
        });
    };

    const buttonClass = scrollDown ? classes.scrollDownButton : classes.scrollTopButton;

    return (
        <button
            className={buttonClass}
            onClick={handleClick}
            title={scrollDown ? 'Scroll down' : 'Back to top'}
            aria-label={scrollDown ? 'Scroll down' : 'Back to top'}
        >
            {!scrollDown ? <FaArrowUp size={20} color="black" /> : <FaArrowDown size={20} color="black" />}
        </button>
    );
};


export { ScrollToButton, Header, Footer };