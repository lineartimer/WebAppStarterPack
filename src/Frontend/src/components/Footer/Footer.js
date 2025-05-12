import "./Footer.css";
import { isMobile } from "../../utils/utils";

const Footer = () => {
    return (
        <div className={isMobile() ? "row footer-mobile" : "row footer-desktop"}>
            <div className="col-12">
                Copyright © {(new Date()).getFullYear()}, Whoever.
            </div>
        </div>
    );
};

export default Footer;