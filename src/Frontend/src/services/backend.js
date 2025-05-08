import getBaseUrl from "../utils/getBaseUrl";

export const responseStatus = {
    Ok: 200,
    UnAuthorized: 401,
    NotFound: 404,
    InternalServerError: 500
};

export const login = async (username, password) => {
    const response = await fetch(`${getBaseUrl()}/Auth/Login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include"
    });
    
    return await processResponse(response);
};

export const logout = async () => {
    await fetch(`${getBaseUrl()}/Auth/Logout`, {
        method: "POST",
        credentials: "include"
    });
};

export const getData = async () => {
    const response = await fetch(getBaseUrl() + "/Data", {
        method: "GET",
        credentials: "include"
    });
    
    return await processResponse(response);
};

const processResponse = async (response) => {
    var result = {
        status: null,
        data: null
    };

    if(response)
    {
        result.status = response.status;
        if(response.ok)
        {
            try {
                result.data = await response.json();
            }
            catch(e) { /* No body in response - not necessarily bad */ }
        }
    }
    else {
        result.status = responseStatus.InternalServerError;
    }

    return result;
}