import { useState } from "react";

import "./Navigation.css";
import { isMobile } from "../../utils/utils";

const Navigation = () => {
    const [username] = useState(localStorage.getItem("username") || null);
    const [role] = useState(localStorage.getItem("role") || null);

    return (
        <div className="navigation">
            {role == "Admin" && (
                <a className={isMobile() ? "mobile-menu-item" : ""} href="/Admin">Admin</a>
            )}
            {username && (
                <a className={isMobile() ? "mobile-menu-item" : ""} href="/Data">Data</a>
            )}
        </div>
    );
};

export default Navigation;