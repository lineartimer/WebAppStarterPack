import './Error.css';
import Logo from '../../components/Logo/Logo'
import { frontend } from '../../config/config';

const Error = () => {
    return (
        <div className="error-window">
            <div className="error-logo">
                <Logo />
            </div>
            <div className="row error">
                <div className="col-12">
                    <div className="error-description">
                        {frontend.errorMessages.generalError.line1}
                    </div>
                    <div className="error-description">
                        {frontend.errorMessages.generalError.line2}
                    </div>
                    <div className="error-description">
                        {frontend.errorMessages.generalError.line3}
                    </div>
                    <a href={frontend.urls.homePage}>Back</a>
                </div>
            </div>
        </div>
    );
};

export default Error;