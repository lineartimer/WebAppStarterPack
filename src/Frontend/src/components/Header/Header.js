import "./Header.css";
import Logo from "../../components/Logo/Logo";
import Navigation from "../../components/Navigation/Navigation";
import User from "../../components/User/User";

const Header = () => {
    return (
        <div className="row">
            <div className="col-4">
                <Logo />
            </div>
            <div className="col-6">
                <Navigation />
            </div>
            <div className="col-2 user-wrapper">
                <User />
            </div>
        </div>
    );
};

export default Header;