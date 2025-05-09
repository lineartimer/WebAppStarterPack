import { backend } from "../config/config";

const getBaseUrl = () => {
    const server = window.location.hostname;

    let baseUrl = `https://${server}`;
    if (server === "localhost") {
        // Development environment
        baseUrl += `:${backend.portDev}`;
    } else {
        // Production environment
        baseUrl = baseUrl.replace("frontend", "backend");
    }

    return baseUrl;
};

export default getBaseUrl;