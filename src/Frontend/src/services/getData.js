import getBaseUrl from "../utils/getBaseUrl";

const getData = async (token) => {
    const response = await fetch(getBaseUrl() + "/Data", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
    });

    return response;
};

export default getData;
