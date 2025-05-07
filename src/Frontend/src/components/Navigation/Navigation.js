import "./Navigation.css";

const Navigation = ({ username }) => {
    return (
        <div className="navigation">
            {username && (
                <a href="/Data">Data</a>
            )}
        </div>
    );
};

export default Navigation;