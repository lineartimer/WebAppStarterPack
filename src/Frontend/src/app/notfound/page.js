import './notfound.css';
import { frontend } from '../../lib/config';

const NotFound = () => {
    return (
        <div className="main">
            <div className="row">
                <div className="col-12 not-found">
                    <div className="description">
                        {frontend.content.notFoundPage.notFound}
                    </div>
                    <a href={frontend.urls.homePage}>Back</a>
                </div>
            </div>
        </div>
    );
};

export default NotFound;