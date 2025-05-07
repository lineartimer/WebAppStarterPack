import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';

import "./User.css";
import { logout } from "../../services/backend";

const User = ({ username }) => {
    const [showUserWindow, setShowUserWindow] = useState(false);
    const navigate = useNavigate();
    const userWindowRef = useRef(null);

    // Make user window disappear when there's a click anywhere outside it
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
        await logout();
        localStorage.removeItem("username");

        navigate("/");
        window.location.reload();
    };

    return (
        <div className="user" ref={userWindowRef}>
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