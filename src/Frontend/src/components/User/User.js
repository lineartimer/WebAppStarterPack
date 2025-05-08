import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';

import "./User.css";
import { logout } from "../../services/backend";

const User = () => {
    const [username] = useState(localStorage.getItem("username") || null);
    const [showUserWindow, setShowUserWindow] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const userWindowRef = useRef(null);
    const navigate = useNavigate();

    // Make user window disappear when clicking anywhere outside it
    const handleClickOutside = (event) => {
        if (userWindowRef.current && !userWindowRef.current.contains(event.target)) {
            setShowUserWindow(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const onLogout = async () => {
        setLoggingOut(true);
        await logout();
        localStorage.removeItem("username");

        navigate("/");
        window.location.reload();
    };

    return (
        <div className="user" ref={userWindowRef}>
            {loggingOut && (
                <div className="loading-overlay">
                    <div className="loading-spinner-transparent"></div>
                </div>
            )}
            {username && (
                <a href="#" onClick={(e) => {
                    e.preventDefault();
                    setShowUserWindow(!showUserWindow);
                }}>{username}</a>
            )}
            {!username && (
                <a href="/Login">Login</a>
            )}
            {showUserWindow && (
                <div className="user-window">
                    <a href="#" onClick={onLogout}>Logout</a>
                </div>
            )}
        </div>
    );
};

export default User;