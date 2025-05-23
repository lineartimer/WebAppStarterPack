import { useState } from 'react';
import { useNavigate } from 'react-router';
import DOMPurify from 'dompurify';

import './Login.css';
import Logo from '../../components/Logo/Logo';
import { callEndPoint, httpMethods, responseStatus } from '../../services/http';
import { backend, frontend } from '../../config/config';
import { isMobile } from '../../utils/utils';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const onLogin = async (e) => {
        e.preventDefault();

        setUsernameError(username ? '' : frontend.errorMessages.userNameMissingError);
        setPasswordError(password ? '' : frontend.errorMessages.passwordMissingError);

        if (!username || !password) {
            return;
        }

        setIsLoading(true);
        
        const loginResponse = await callEndPoint(backend.urls.login, httpMethods.Post, localStorage.getItem('xcsrf'), {
            // Sanitize input to prevent XSS (Cross-Site Scripting attacks)
            username: DOMPurify.sanitize(username),
            password: DOMPurify.sanitize(password)
        })

        // After logging in, a new X-CSRF token will be needed because now the request is coming from
        // an authenticated user as opposed to an anonymous user
        const xcsrfResponse = await callEndPoint('/Auth/GetXcsrfToken', httpMethods.Get);
        
        setIsLoading(false);

        if(xcsrfResponse.status === responseStatus.Ok) {
            localStorage.setItem('xcsrf', xcsrfResponse.payload.xcsrf);
        } else {
            navigate(frontend.urls.errorPage);
        }

        const loginRedirectUrl = localStorage.getItem('loginRedirectUrl') || null;
        localStorage.removeItem('loginRedirectUrl');

        if (loginResponse.status === responseStatus.Ok) {
            localStorage.setItem('username', username);
            localStorage.setItem('role', loginResponse.payload.role);

            navigate(loginRedirectUrl ? loginRedirectUrl : frontend.urls.homePage);
        } else if (loginResponse.status === responseStatus.UnAuthorized) {
            setError(frontend.errorMessages.invalidUserNameOrPasswordError);
        } else {
            navigate(frontend.urls.errorPage);
        }
    };

    if (isLoading) {
        return (
            <div className="loading-screen">
                <div className="spinner"></div>
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
                            <input type="text" placeholder="Username" value={username} autoFocus onChange={(e) => setUsername(e.target.value)} className={usernameError ? 'input-error' : ''} />
                            {usernameError && <div className="error-message">{usernameError}</div>}
                        </div>
                        <div>
                            <div className="login-textbox">
                                <div className="pwd-textbox">
                                    <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={passwordError ? 'input-error' : ''} />
                                    {!isMobile() && <button type="button" className="show-hide-button" onMouseDown={() => setShowPassword(true)} onMouseUp={() => setShowPassword(false)} onMouseLeave={() => setShowPassword(false)}>
                                        {showPassword ? 'Hide' : 'Show'}
                                    </button>}
                                    {isMobile() && <button type="button" className="show-hide-button" onClick={() => showPassword ? setShowPassword(false) : setShowPassword(true)}>
                                        {showPassword ? 'Hide' : 'Show'}
                                    </button>}
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