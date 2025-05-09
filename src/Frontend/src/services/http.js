import getBaseUrl from "../utils/getBaseUrl";

export const responseStatus = {
    Ok: 200,
    BadRequest: 400,
    UnAuthorized: 401,
    Forbidden: 403,
    NotFound: 404,
    InternalServerError: 500
};

export const httpMethods = {
    Get: "GET",
    Post: "POST",
    Put: "PUT",
    Delete: "DELETE"
};

export const callEndPoint = async (url, method, payload = null, timeout = 10000) => {
    var request = {
        method: method,
        credentials: "include" // Include the http-only authentication cookie in the request
    };

    if(method != httpMethods.Get && payload) {
        request.headers = { "Content-Type": "application/json" };
        request.body = JSON.stringify(payload);
    }

    var response;

    try {
        const fetchCaller = async () => fetch(getBaseUrl() + url, request);

        response = await invoke(fetchCaller, timeout, url, request);
    } catch (e) {}
    
    return await processResponse(response);
}

const invoke = async (func, timeout, ...args) => {
    return Promise.race([func(...args), new Promise((_, reject) =>
        setTimeout(() => reject(new Error()), timeout)
    )]);
};

const processResponse = async (response) => {
    var result = {
        status: null,
        payload: null
    };

    if(response)
    {
        result.status = response.status;
        if(response.ok)
        {
            try {
                result.payload = await response.json();
            }
            // No body in response: not necessarily bad
            catch(e) {}
        }
    }
    else {
        result.status = responseStatus.InternalServerError;
    }

    return result;
}