import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";

import "./Login.css";
import Logo from "../../components/Logo/Logo";
import { callEndPoint, httpMethods, responseStatus } from "../../services/http";
import { backend, frontend } from "../../config/config";
import { isMobile } from "../../utils/utils";

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

        setUsernameError(username ? "" : frontend.errorMessages.userNameMissingError);
        setPasswordError(password ? "" : frontend.errorMessages.passwordMissingError);

        if (!username || !password) {
            return;
        }

        setIsLoading(true);
        const response = await callEndPoint(backend.urls.login, httpMethods.Post, {
            // Sanitize input to prevent XSS (Cross-Site Scripting attacks)
            username: DOMPurify.sanitize(username),
            password: DOMPurify.sanitize(password)
        })
        setIsLoading(false);

        var loginRedirectUrl = localStorage.getItem("loginRedirectUrl") || null;
        localStorage.removeItem("loginRedirectUrl");

        if (response.status == responseStatus.Ok) {
            localStorage.setItem("username", username);
            localStorage.setItem("role", response.payload.role);

            navigate(loginRedirectUrl ? loginRedirectUrl : frontend.urls.homePage);
        } else if (response.status == responseStatus.UnAuthorized) {
            setError(frontend.errorMessages.invalidUserNameOrPasswordError);
        }
        else {
            navigate(frontend.urls.errorPage);
        }
    };

    if (isLoading) {
        return (
            <div className="loading-screen">
                <div className={isMobile() ? "spinner spinner-mobile" : "spinner spinner-desktop"}></div>
            </div>
        );
    }
    else {
        return (
            <div className={isMobile() ? "mobile" : ""}>
                <div className="login-logo">
                    <Logo />
                </div>
                <div className="login-window">
                    <form className="login-form" onSubmit={onLogin}>
                        <h2>Sign in</h2>
                        <div className="login-textbox">
                            <input type="text" placeholder="Username" value={username} autoFocus onChange={(e) => setUsername(e.target.value)} className={usernameError ? "input-error" : ""} />
                            {usernameError && <div className={isMobile() ? "error-message error-message-mobile" : "error-message"}>{usernameError}</div>}
                        </div>
                        <div>
                            <div className="login-textbox">
                                <div className="pwd-textbox">
                                    <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={passwordError ? "input-error" : ""} />
                                    <button type="button" className={isMobile() ? "show-hide-button show-hide-button-mobile" : "show-hide-button"} onMouseDown={handleShowPassword} onMouseUp={handleHidePassword} onMouseLeave={handleHidePassword}>
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                                {passwordError && <div className={isMobile() ? "error-message error-message-mobile" : "error-message"}>{passwordError}</div>}
                            </div>
                        </div>
                        {error && <div className={isMobile() ? "error-message error-message-mobile" : "error-message"}>{error}</div>}
                        <button type="submit" className={isMobile() ? "login-button login-button-mobile" : "login-button"}>Sign in</button>
                    </form>
                </div>
            </div>
        );
    }
};

export default Login;