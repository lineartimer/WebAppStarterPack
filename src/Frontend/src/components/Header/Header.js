import "./Header.css";
import Logo from "../../components/Logo/Logo";
import Navigation from "../../components/Navigation/Navigation";
import User from "../../components/User/User";

const Header = ({ username }) => {
    return (
        <div className="row">
            <div className="col-4">
                <Logo />
            </div>
            <div className="col-6">
                <Navigation username={username} />
            </div>
            <div className="col-2 user-wrapper">
                <User username={username} />
            </div>
        </div>
    );
};

export default Header;