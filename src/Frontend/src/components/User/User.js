import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';

import "./User.css";
import Navigation from "../../components/Navigation/Navigation";
import { callEndPoint, httpMethods } from "../../services/http";

const User = ({isMobile}) => {
    const [username] = useState(localStorage.getItem("username") || null);
    const [role] = useState(localStorage.getItem("role") || null);
    const [showUserWindow, setShowUserWindow] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const userWindowRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Make user window disappear when clicking anywhere outside it
        const handleClickOutside = (event) => {
            if (userWindowRef.current && !userWindowRef.current.contains(event.target)) {
                setShowUserWindow(false);
            }
        };
        
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const onLogout = async () => {
        setLoggingOut(true);

        await callEndPoint("/Auth/Logout", httpMethods.Post);
        localStorage.removeItem("username");
        localStorage.removeItem("role");

        navigate("/");
        window.location.reload();
    };

    const hamburgerClick = () => {
        setShowUserWindow(true);
    };

    const xClick = () => {
        setShowUserWindow(false);
    };

    return (
        <div className={isMobile ? "" : "user-desktop"} ref={userWindowRef}>
            {loggingOut && (
                <div className="loading-overlay">
                    <div className="loading-spinner-transparent"></div>
                </div>
            )}
            {!isMobile && (
                <div>
                    {username && (
                        <a href="#" onClick={(e) => {
                            e.preventDefault();
                            setShowUserWindow(!showUserWindow);
                        }}>{username}</a>
                    )}
                    {!username && (
                        <a href="/Login">Login</a>
                    )}
                </div>
            )}
            {isMobile && (
                <button className="hamburger" onClick={hamburgerClick}>☰</button>
            )}
            {showUserWindow && (
                <div className={isMobile ? "user-window-mobile" : "user-window-desktop"}>
                    {isMobile && (
                        <div>
                            <div className="x-wrapper">
                                <button className="x" onClick={xClick}>✖</button>
                            </div>
                            <div className="mobile-menu-item">{username}</div>
                        </div>
                    )}
                    {role == "Admin" && (
                        <div className={isMobile ? "mobile-menu-item" : ""}>
                            <div className="user-role">Role: {role}</div>
                        </div>
                    )}
                    {isMobile && (
                        <Navigation isMobile={isMobile} />
                    )}
                    <a className={isMobile ? "mobile-menu-item logout" : ""} href="#" onClick={onLogout}>Logout</a>
                </div>
            )}
        </div>
    );
};

export default User;