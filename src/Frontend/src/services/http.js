import { backend } from "../config/config";

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

export const callEndPoint = async (url, method, xcsrf = null, payload = null, timeout = 30000) => {
    var request = {
        method: method,
        // Include the http-only authentication cookie in the request
        credentials: "include"
    };

    if(method != httpMethods.Get && payload) {
        request.headers = { "Content-Type": "application/json" };
        request.body = JSON.stringify(payload);
    }

    if (xcsrf) {
        request.headers = { ...request.headers, 'X-CSRF-TOKEN': xcsrf };
    }

    var response;

    try {
        const fetchCaller = async () => fetch(getBaseUrl() + url, request);

        response = await invoke(fetchCaller, timeout, url, request);
    } catch (e) {}
    
    return await processResponse(response);
}

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

const invoke = async (func, timeout = 0, ...args) => {
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
