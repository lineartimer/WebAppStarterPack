import getBaseUrl from "../utils/getBaseUrl";

export const getData = async (token) => {
    const response = await fetch(getBaseUrl() + "/Data", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
    });

    return response;
};
