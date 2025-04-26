import getBaseUrl from "../utils/getBaseUrl";

const login = async (username, password) => {
    const response = await fetch(`${getBaseUrl()}/Auth/Login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    return response;
};

export default login;
