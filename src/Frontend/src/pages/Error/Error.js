import "./Error.css";
import Logo from "../../components/Logo/Logo"
import config from "../../config/config";

const Error = () => {
    return (
        <div className="error-window">
            <div className="error-logo">
                <Logo />
            </div>
            <div className="row error">
                <div className="col-12">
                    <div className="error-description">
                        {config.errorMessages.generalError.line1}
                    </div>
                    <div className="error-description">
                        {config.errorMessages.generalError.line2}
                    </div>
                    <div className="error-description">
                        {config.errorMessages.generalError.line3}
                    </div>
                    <a href={config.frontendUrls.homePage}>Back</a>
                </div>
            </div>
        </div>
    );
};

export default Error;