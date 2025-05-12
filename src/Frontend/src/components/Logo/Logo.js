import "./Logo.css";
import { isMobile } from "../../utils/utils";

const Logo = () => {
    return (
        <div className={isMobile() ? "logo logo-mobile" : "logo logo-desktop"}>
            <a href="/"><div className="logo-first">Web App</div><div className="logo-second">Starter Pack</div></a>
        </div>
    );
};

export default Logo;