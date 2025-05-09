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

export const callEndPoint = async (url, method, payload = null) => {
    var request = {
        method: method,
        credentials: "include" // Include the http-only authentication cookie in the request
    };

    if(method != httpMethods.Get && payload) {
        request.headers = { "Content-Type": "application/json" };
        request.body = JSON.stringify(payload);
    }

    const response = await fetch(getBaseUrl() + url, request);
    
    return await processResponse(response);
}

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
            catch(e) { /* No body in response: not necessarily bad */ }
        }
    }
    else {
        result.status = responseStatus.InternalServerError;
    }

    return result;
}