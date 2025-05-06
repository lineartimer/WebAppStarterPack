import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

import "./User.css";

const User = ({ username }) => {
    const [showUserWindow, setShowUserWindow] = useState(false);
    const navigate = useNavigate();

    const onLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");

        navigate("/");
        window.location.reload();
    };

    return (
        <div className="user">
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