import config from "../config/config";

const getBaseUrl = () => {
    const protocol = window.location.protocol;
    const server = window.location.hostname;

    let baseUrl = `${protocol}//${server}`;
    if (server === "localhost") {
        baseUrl += `:${config.backEndPortDev}`;
    } else {
        baseUrl = baseUrl.replace("frontend", "backend");
    }

    return baseUrl;
};

export default getBaseUrl;