import getBaseUrl from "../utils/getBaseUrl";

export const login = async (username, password) => {
    const response = await fetch(`${getBaseUrl()}/Auth/Login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    return response;
};

export const getData = async (token) => {
    const response = await fetch(getBaseUrl() + "/Data", {
        method: "GET",
        credentials: "include", // That's also an option, altough not a very safe one
        //credentials: "same-origin"
    });

    return response;
};
