import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Login.css";
import { login } from "../../services/backend"

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleShowPassword = () => setShowPassword(true);
    const handleHidePassword = () => setShowPassword(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        var hasError = false;
        if (!username) {
            setUsernameError("Please enter your username.");
            hasError = true;
        } else {
            setUsernameError("");
        }

        if (!password) {
            setPasswordError("Please enter your password.");
            hasError = true;
        } else {
            setPasswordError("");
        }

        if (hasError) return;

        setIsLoading(true);
        
        var response = await login(username, password);

        setIsLoading(false);

        if (response.ok) {
            const result = await response.json();
            onLogin(result.token, username);
            navigate("/");
        } else {
            setError("Invalid username or password.");
        }
    };

    if (isLoading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Sign in</h2>
                <div className="textbox-container">
                    <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className={usernameError ? "error" : ""} />
                </div>
                {usernameError && <div className="error-message">{usernameError}</div>}
                <div className="textbox-container">
                    <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={passwordError ? "error" : ""} />
                    <button type="button" className="show-hide-button" onMouseDown={handleShowPassword} onMouseUp={handleHidePassword} onMouseLeave={handleHidePassword}>
                        {showPassword ? "Hide" : "Show"}
                    </button>
                </div>
                {passwordError && <div className="error-message">{passwordError}</div>}
                {error && <div className="error-message">{error}</div>}
                <button type="submit" className="login-button">Sign in</button>
            </form>
        </div>
    );
};

export default Login;