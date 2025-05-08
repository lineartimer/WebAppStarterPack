import React, { useState } from "react";

import "./Navigation.css";

const Navigation = () => {
    const [username] = useState(localStorage.getItem("username") || null);

    return (
        <div className="navigation">
            {username && (
                <a href="/Data">Data</a>
            )}
        </div>
    );
};

export default Navigation;