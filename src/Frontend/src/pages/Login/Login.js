import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";

import "./Login.css";
import Logo from "../../components/Logo/Logo";
import { login, responseStatus } from "../../services/backend";
import config from "../../config/config";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleShowPassword = () => setShowPassword(true);
    const handleHidePassword = () => setShowPassword(false);

    const navigate = useNavigate();

    const onLogin = async (e) => {
        e.preventDefault();

        setUsernameError(username ? "" : config.userNameMissingError);
        setPasswordError(password ? "" : config.passwordMissingError);

        if (!username || !password) {
            return;
        }

        // Sanitize input to prevent XSS (Cross-Site Scripting attacks)
        var cleanUsername = DOMPurify.sanitize(username);
        var cleanPassword = DOMPurify.sanitize(password);

        setIsLoading(true);
        const response = await login(cleanUsername, cleanPassword);
        setIsLoading(false);

        if (response.status == responseStatus.Ok) {
            localStorage.setItem("username", username);

            var loginRedirectUrl = localStorage.getItem("loginRedirectUrl") || null;
            navigate(loginRedirectUrl ? loginRedirectUrl : "/");
        } else if (response.status == responseStatus.UnAuthorized) {
            setError(config.invalidUserNameOrPasswordError);
        }
        else {
            localStorage.removeItem("loginRedirectUrl");
            navigate("/Error");
        }
    };

    if (isLoading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner"></div>
            </div>
        );
    }
    else {
        return (
            <div>
                <div className="login-logo">
                    <Logo />
                </div>
                <div className="login-window">
                    <form className="login-form" onSubmit={onLogin}>
                        <h2>Sign in</h2>
                        <div className="login-textbox">
                            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className={usernameError ? "inputerror" : ""} />
                            {usernameError && <div className="error-message">{usernameError}</div>}
                        </div>
                        <div>
                            <div className="login-textbox">
                                <div className="pwd-textbox">
                                    <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={passwordError ? "inputerror" : ""} />
                                    <button type="button" className="show-hide-button" onMouseDown={handleShowPassword} onMouseUp={handleHidePassword} onMouseLeave={handleHidePassword}>
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                                {passwordError && <div className="error-message">{passwordError}</div>}
                            </div>
                        </div>
                        {error && <div className="error-message">{error}</div>}
                        <button type="submit" className="login-button">Sign in</button>
                    </form>
                </div>
            </div>
        );
    }
};

export default Login;