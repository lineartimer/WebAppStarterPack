'use client'

import { useState } from 'react';
import DOMPurify from 'dompurify';

import './login.css';
import { frontend } from '../../lib/config';
import { callApi } from '../../lib/client';
import { httpMethods, responseStatus, isMobile } from '../../lib/utils'

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const onLogin = async (e) => {
        e.preventDefault();

        setUsernameError(username ? '' : frontend.errorMessages.userNameMissingError);
        setPasswordError(password ? '' : frontend.errorMessages.passwordMissingError);

        if (!username || !password) {
            return;
        }

        setIsLoading(true);

        const loginResponse = await callApi(frontend.urls.api.login, httpMethods.Post, localStorage.getItem('xcsrf'), {
            // Sanitize input to prevent XSS (Cross-Site Scripting attacks)
            username: DOMPurify.sanitize(username),
            password: DOMPurify.sanitize(password)
        });
        
        // After logging in, a new X-CSRF token will be needed because now the request is coming from
        // an authenticated user as opposed to an anonymous user
        const xcsrfResponse = await callApi(frontend.urls.api.getXcsrf, httpMethods.Get);

        setIsLoading(false);

        if (xcsrfResponse.status === responseStatus.Ok) {
            localStorage.setItem('xcsrf', xcsrfResponse.payload.xcsrf);
        } else {
            window.location.href = frontend.urls.pages.errorPage;
        }
        
        const loginRedirectUrl = localStorage.getItem('loginRedirectUrl') || null;
        localStorage.removeItem('loginRedirectUrl');

        if (loginResponse.status === responseStatus.Ok) {
            localStorage.setItem('username', username);
            localStorage.setItem('role', loginResponse.payload.role);

            window.location.href = loginRedirectUrl ? loginRedirectUrl : frontend.urls.pages.homePage;
        } else if (loginResponse.status === responseStatus.UnAuthorized) {
            setError(frontend.errorMessages.invalidUserNameOrPasswordError);
        } else {
            window.location.href = frontend.urls.pages.errorPage;
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
            <div className='main login-container'>
                <form className="login-form" onSubmit={onLogin}>
                    <h2>Sign in</h2>
                    <div className="login-textbox">
                        <input type="text"
                            placeholder="Username"
                            value={username}
                            autoFocus
                            onChange={(e) => {
                                setUsername(e.target.value);
                                if (usernameError) setUsernameError('');
                            }}
                            className={usernameError ? 'input-error' : ''}
                        />
                        {usernameError && <div className="error-message">{usernameError}</div>}
                    </div>
                    <div>
                        <div className="login-textbox">
                            <div className="pwd-textbox">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (passwordError) setPasswordError('');
                                    }}
                                    className={passwordError ? 'input-error' : ''}
                                />
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
        );
    }
};

export default Login;