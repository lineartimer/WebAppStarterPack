import getBaseUrl from "../utils/getBaseUrl";

export const login = async (username, password) => {
    const response = await fetch(`${getBaseUrl()}/Auth/Login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include"
    });

    return response;
};

export const logout = async () => {
    await fetch(`${getBaseUrl()}/Auth/Logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
    });
};

export const getData = async () => {
    const response = await fetch(getBaseUrl() + "/Data", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
    });

    return response;
};
