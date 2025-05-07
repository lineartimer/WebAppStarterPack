import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Data from "./pages/Data/Data";
import Home from "./pages/Home/Home";
import Layout from "./pages/Layout/Layout";
import Login from "./pages/Login/Login";
import "./App.css"

const App = () => {
    const [username, setUsername] = useState(localStorage.getItem("username") || null);

    const saveLoginInfo = (username) => {
        setUsername(username);
        localStorage.setItem("username", username);
    };

    return (
        <Router>
            <Routes>
                <Route path="/Login" element={<Login loginCallBack={saveLoginInfo} />} />

                {/* Put common elements on the Layout page: full-width pages */}
                <Route path="/" element={<Layout username={username} fullWidth={true} />} >
                    <Route path="/" element={<Home />} />
                </Route>

                {/* Put common elements on the Layout page: narrower pages */}
                <Route path="/" element={<Layout username={username} fullWidth={false} />} >
                    <Route path="/Data" element={<Data />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
