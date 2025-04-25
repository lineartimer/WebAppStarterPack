import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import HomePage from "./HomePage";

const App = () => {
    const [token, setToken] = useState(null);
    const [username, setUsername] = useState(null);

    const handleLogin = (authToken, user) => {
        setToken(authToken);
        setUsername(user);
    };

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={token ? <HomePage token={token} username={username} /> : <Navigate to="/Login" />}
                />
                <Route path="/Login" element={<LoginPage onLogin={handleLogin} />} />
            </Routes>
        </Router>
    );
};

export default App;
