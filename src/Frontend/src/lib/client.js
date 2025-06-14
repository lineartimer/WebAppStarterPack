'use client'

import { httpMethods } from "./utils";

export const callApi = async (url, method, xcsrf = null, payload = null) => {
    const request = {
        method: method,
        // Include the http-only cookies in the request
        credentials: 'include'
    };

    if(method != httpMethods.Get && payload) {
        request.headers = { 'Content-Type': 'application/json' };
        request.body = JSON.stringify(payload);
    }
    
    if (xcsrf) {
        request.headers = { ...request.headers, 'X-CSRF': xcsrf };
    }
    
    const response = await fetch(url, request);
    const result = await response.json();

    return result;
};