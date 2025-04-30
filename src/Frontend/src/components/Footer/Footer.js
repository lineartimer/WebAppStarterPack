import "./Footer.css";

const Footer = () => {
    return (
        <div className="footer">
            Copyright © {(new Date()).getFullYear()}, Whoever.
        </div>
    );
};

export default Footer;