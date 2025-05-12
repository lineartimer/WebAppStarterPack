import "./Home.css";
import { isMobile } from "../../utils/utils";

const Home = () => {
    return (
        <div className="main">
            <div className="row">
                <div className="col-12">
                    <div className={isMobile() ? "description description-mobile description-big description-big-mobile" : "description description-desktop description-big description-big-desktop"}>A starter template with</div>
                    <div className={isMobile() ? "description description-mobile" : "description description-desktop"}>✅ a .Net backend,</div>
                    <div className={isMobile() ? "description description-mobile" : "description description-desktop"}>✅ a React frontend and</div>
                    <div className={isMobile() ? "description description-mobile" : "description description-desktop"}>✅ a GitHub CI/CD pipeline</div>
                    <div className={isMobile() ? "description description-mobile" : "description description-desktop"}>✅ that deploys to Azure.</div>
                </div>
            </div>
        </div>
    );
};

export default Home;