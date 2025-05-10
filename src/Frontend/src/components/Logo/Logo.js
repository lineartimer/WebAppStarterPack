import "./Logo.css";

const Logo = ({isMobile}) => {
    return (
        <div className={isMobile ? "logo logo-mobile" : "logo"}>
            <a href="/"><div className="logo-first">Web App</div><div className="logo-second">Starter Pack</div></a>
        </div>
    );
};

export default Logo;