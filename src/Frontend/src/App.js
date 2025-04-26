import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";

const App = () => {
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [username, setUsername] = useState(localStorage.getItem("username") || null);

    const handleLogin = (token, username) => {
        setToken(token);
        setUsername(username);
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={token ? <Home token = { token } username = { username } /> : <Navigate to = "/Login" />} />
                <Route path="/Login" element={<Login onLogin={handleLogin} />} />
            </Routes>
        </Router>
    );
};

export default App;
