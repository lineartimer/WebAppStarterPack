import { useState } from "react";

import "./Navigation.css";

const Navigation = () => {
    const [username] = useState(localStorage.getItem("username") || null);
    const [role] = useState(localStorage.getItem("role") || null);

    return (
        <div className="navigation">
            {role == "Admin" && (
                <a href="/Admin">Admin</a>
            )}
            {username && (
                <a href="/Data">Data</a>
            )}
        </div>
    );
};

export default Navigation;