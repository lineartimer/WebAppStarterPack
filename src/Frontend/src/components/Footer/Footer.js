import "./Footer.css";

const Footer = () => {
    return (
        <div className="row">
            <div className="col-12">
                Copyright © {(new Date()).getFullYear()}, Whoever.
            </div>
        </div>
    );
};

export default Footer;