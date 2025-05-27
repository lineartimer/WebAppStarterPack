import { useState, useEffect, useRef } from 'react';

import './user.css';
import Navigation from '../navigation/navigation';
import { callEndPoint, httpMethods } from '../../lib/http';
import { isMobile } from '../../lib/utils';
import { frontend } from '../../lib/config';

const User = () => {
    const [username, setUsername] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('username') || null;
        }
        return null;
    });
    const [role, setRole] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('role') || null;
        }
        return null;
    });
    const [isClient, setIsClient] = useState(false);
    const [noshow, setNoshow] = useState(false);
    const [showUserWindow, setShowUserWindow] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const userWindowRef = useRef(null);

    useEffect(() => {
        setIsClient(true);

        setUsername(localStorage.getItem('username') || null);
        setRole(localStorage.getItem('role') || null);

        setNoshow(frontend.noshow[`${Navigation.name.toLowerCase()}Component`]?.includes(window.location.pathname));

        // Make user window disappear when clicking anywhere outside it
        const handleClickOutside = (event) => {
            if (userWindowRef.current && !userWindowRef.current.contains(event.target)) {
                setShowUserWindow(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Don't render until client-side hydration is complete
    if (!isClient) {
        return null;
    }

    const onLogout = async (e) => {
        setLoggingOut(true);

        await callEndPoint('/Auth/Logout', httpMethods.Post, localStorage.getItem('xcsrf'));
        
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        localStorage.removeItem('xcsrf');

        window.location.href = frontend.urls.homePage;
    };

    const hamburgerClick = () => {
        setShowUserWindow(true);
    };

    const xClick = () => {
        setShowUserWindow(false);
    };

    return (
        <div ref={userWindowRef}>
            {loggingOut && (
                <div className="loading-overlay">
                    <div className="spinner-transparent"></div>
                </div>
            )}
            {!noshow && !isMobile() && (
                <div className="user-desktop">
                    {username && (
                        <a href="#" onClick={(e) => {
                            setShowUserWindow(!showUserWindow);
                        }}>{username}</a>
                    )}
                    {!username && (
                        <a href={frontend.urls.loginPage}>Login</a>
                    )}
                </div>
            )}
            {!noshow && isMobile() && (
                <div className="hamburger-wrapper">
                    <button className="hamburger" onClick={hamburgerClick}>☰</button>
                </div>
            )}
            {!noshow && showUserWindow && (
                <div className={isMobile() ? 'user-window-mobile' : 'user-window-desktop'}>
                    {isMobile() && (
                        <div>
                            <div className="x-wrapper">
                                <button className="x" onClick={xClick}>✖</button>
                            </div>
                            <div className="mobile-menu-item">{username}</div>
                            {!username && (
                                <a className={isMobile() ? 'mobile-menu-item login-or-out' : ''} href="/Login">Login</a>
                            )}
                        </div>
                    )}
                    {role == "Admin" && (
                        <div className={isMobile() ? 'mobile-menu-item' : 'user-role'}>
                            <div>Role: {role}</div>
                        </div>
                    )}
                    {isMobile() && (
                        <Navigation />
                    )}
                    {username && (
                        <a className={isMobile() ? 'mobile-menu-item login-or-out' : ''} href="#" onClick={onLogout}>Logout</a>
                    )}
                </div>
            )}
        </div>
    );
};

export default User;