import "./Header.css";
import Logo from "../../components/Logo/Logo";
import Navigation from "../../components/Navigation/Navigation";
import User from "../../components/User/User";
import { isMobile } from "../../utils/utils";

const Header = () => {
    return (
        <div>
            {!isMobile() && (
                <div className="row">
                    <div className="col-4 logo-wrapper">
                        <Logo />
                    </div>
                    <div className="col-6 navigation-wrapper">
                        <Navigation />
                    </div>
                    <div className="col-2 user-wrapper">
                        <User />
                    </div>
                </div>
            )}
            {isMobile() && (
                <div className="row">
                    <div className="col-10">
                        <Logo />
                    </div>
                    <div className="col-2 user-wrapper">
                        <User />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Header;