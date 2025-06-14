import './not-found.css';
import { frontend } from '../lib/config';

const NotFound = () => {
    return (
        <div className="main">
            <div className="row">
                <div className="col-12 not-found">
                    <div className="description">🤷‍♂️ Nothing found here...</div>
                    <a href={frontend.urls.homePage}>Back</a>
                </div>
            </div>
        </div>
    );
};

export default NotFound;