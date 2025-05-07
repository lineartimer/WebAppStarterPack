import React from "react";

import "./Home.css";

const Home = () => {
    return (
        <div className="home">
            <div className="row main">
                <div className="col-12">
                    <div className="description">A starter template with a</div>
                    <div className="description">.Net backend, a React frontend and a</div>
                    <div className="description">GitHub CI/CD pipeline that deploys to Azure.</div>
                </div>
            </div>
        </div>
    );
};

export default Home;