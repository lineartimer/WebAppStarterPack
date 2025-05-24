'use client'

import './error.css';
import { frontend } from '../../lib/config';

const Error = () => {
    return (
        <div className="main">
            <div className="row">
                <div className="col-12 error">
                    <div className="description">
                        {frontend.errorMessages.generalError.line1}
                    </div>
                    <div className="description">
                        {frontend.errorMessages.generalError.line2}
                    </div>
                    <div className="description">
                        {frontend.errorMessages.generalError.line3}
                    </div>
                    <a href={frontend.urls.homePage}>Back</a>
                </div>
            </div>
        </div>
    );
};

export default Error;