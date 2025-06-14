import { useState, useEffect } from 'react';

import './navigation.css';
import { backend, frontend } from '../../lib/config';
import { isMobile } from '../../lib/utils';

const Navigation = () => {
    const [username, setUsername] = useState(null);
    const [role, setRole] = useState(null);
    const [noshow, setNoshow] = useState(false);

    useEffect(() => {
        // Runs only on the client-side after the component mounts
        setUsername(localStorage.getItem('username') || null);
        setRole(localStorage.getItem('role') || null);

        setNoshow(frontend.noshow[`${Navigation.name.toLowerCase()}Component`]?.includes(window.location.pathname));
    }, []);

    return (
        <div className="navigation">
            {!noshow && role == backend.roles.admin && (
                <a className={isMobile() ? 'mobile-menu-item' : ''} href={frontend.urls.pages.adminPage}>Admin</a>
            )}
            {!noshow && username && (
                <a className={isMobile() ? 'mobile-menu-item' : ''} href={frontend.urls.pages.dataPage}>Data</a>
            )}
        </div>
    );
};

export default Navigation;