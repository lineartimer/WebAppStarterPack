import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';

import "./User.css";
import { callEndPoint, httpMethods } from "../../services/http";

const User = () => {
    const [username] = useState(localStorage.getItem("username") || null);
    const [role] = useState(localStorage.getItem("role") || null);
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

        await callEndPoint("/Auth/Logout", httpMethods.Post);
        localStorage.removeItem("username");
        localStorage.removeItem("role");

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
                    {role == "Admin" && (
                        <div className="user-role">Role: {role}</div>
                    )}
                    <a href="#" onClick={onLogout}>Logout</a>
                </div>
            )}
        </div>
    );
};

export default User;