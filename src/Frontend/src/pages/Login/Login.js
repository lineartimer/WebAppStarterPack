import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Login.css";
import login from "../../services/login";
import config from "../../config/config";

const Login = ({ loginCallBack: loginCallBack }) => {
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

        if(!username || !password) {
            return;
        }

        setIsLoading(true);
        const response = await login(username, password);
        setIsLoading(false);

        if (response.ok) {
            const result = await response.json();
            loginCallBack(result.token, username);
            navigate("/");
        } else {
            setError(config.invalidUserNameOrPasswordError);
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
            <div className="login-container">
                <form className="login-form" onSubmit={onLogin}>
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
    }
};

export default Login;