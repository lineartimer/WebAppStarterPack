import "./Header.css";
import Logo from "../../components/Logo/Logo";
import Navigation from "../../components/Navigation/Navigation";
import User from "../../components/User/User";

const Header = ({isMobile}) => {
    return (
        <div>
            {!isMobile && (
                <div className="row">
                    <div className="col-5">
                        <Logo isMobile={isMobile} />
                    </div>
                    <div className="col-5">
                        <Navigation isMobile={isMobile}/>
                    </div>
                    <div className="col-2 user-wrapper">
                        <User isMobile={isMobile} />
                    </div>
                </div>
            )}
            {isMobile && (
                <div className="row">
                    <div className="col-10">
                        <Logo isMobile={isMobile} />
                    </div>
                    <div className="col-2 user-wrapper">
                        <User isMobile={isMobile} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Header;