import { useState } from 'react';

import './Navigation.css';
import { backend, frontend } from '../../config/config';
import { isMobile } from '../../utils/utils';

const Navigation = () => {
    const [username] = useState(localStorage.getItem('username') || null);
    const [role] = useState(localStorage.getItem('role') || null);

    return (
        <div className="navigation">
            {role == backend.roles.admin && (
                <a className={isMobile() ? 'mobile-menu-item' : ''} href={frontend.urls.adminPage}>Admin</a>
            )}
            {username && (
                <a className={isMobile() ? 'mobile-menu-item' : ''} href={frontend.urls.dataPage}>Data</a>
            )}
        </div>
    );
};

export default Navigation;