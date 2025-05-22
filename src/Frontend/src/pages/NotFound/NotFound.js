import './NotFound.css';
import Logo from '../../components/Logo/Logo'
import { frontend } from '../../config/config';

const NotFound = () => {
    return (
        <div className="not-found-window">
            <div className="not-found-logo">
                <Logo />
            </div>
            <div className="row not-found">
                <div className="col-12">
                    <div className="not-found-description">
                        {frontend.content.notFoundPage.notFound}
                    </div>
                    <a href={frontend.urls.homePage}>Back</a>
                </div>
            </div>
        </div>
    );
};

export default NotFound;