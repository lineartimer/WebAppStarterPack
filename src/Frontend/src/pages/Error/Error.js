import "./Error.css";
import Logo from "../../components/Logo/Logo"
import { frontend } from "../../config/config";
import { isMobile } from "../../utils/utils";

const Error = () => {
    return (
        <div className="error-window">
            <div className="error-logo">
                <Logo />
            </div>
            <div className="row error">
                <div className="col-12">
                    <div className={isMobile() ? "description description-mobile" : "description description-desktop"}>
                        {frontend.errorMessages.generalError.line1}
                    </div>
                    <div className={isMobile() ? "description description-mobile" : "description description-desktop"}>
                        {frontend.errorMessages.generalError.line2}
                    </div>
                    <div className={isMobile() ? "description description-mobile" : "description description-desktop"}>
                        {frontend.errorMessages.generalError.line3}
                    </div>
                    <a href={frontend.urls.homePage}>Back</a>
                </div>
            </div>
        </div>
    );
};

export default Error;