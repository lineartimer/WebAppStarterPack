import "./Error.css";
import config from "../../config/config"
import Logo from "../../components/Logo/Logo"

const Error = () => {
    return (
        <div className="error-window">
            <div className="error-logo">
                <Logo />
            </div>
            <div className="row error">
                <div className="col-12">
                    <div className="error-description">
                        {config.generalError.line1}
                    </div>
                    <div className="error-description">
                        {config.generalError.line2}
                    </div>
                    <div className="error-description">
                        {config.generalError.line3}
                    </div>
                    <a href="/">Back</a>
                </div>
            </div>
        </div>
    );
};

export default Error;