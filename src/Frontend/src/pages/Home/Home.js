import './Home.css';
import { frontend } from '../../config/config';

const Home = () => {
    return (
        <div className="main">
            <div className="row">
                <div className="col-12">
                    <div className="description description-big">{frontend.content.homePage.line1}</div>
                    <div className="description">{frontend.content.homePage.line2}</div>
                    <div className="description">{frontend.content.homePage.line3}</div>
                    <div className="description">{frontend.content.homePage.line4}</div>
                    <div className="description">{frontend.content.homePage.line5}</div>
                </div>
            </div>
        </div>
    );
};

export default Home;