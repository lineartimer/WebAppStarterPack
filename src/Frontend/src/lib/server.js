'use server'

import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { backend, frontend } from './config';
import { httpMethods, responseStatus } from './utils';

export const apiImpl = async (url, request) => {
    const method = request.method;
    const xcsrf = request.headers.get('X-CSRF');
    const cookies = request.headers.get('cookie');

    let response;
    if(method === httpMethods.Get) {
        response = await callEndPoint(url, method, xcsrf, cookies);
    } else {
        let payload;

        try {
            payload = await request.json();
        }
        // No body in request: possible (but strange)
        catch(e) {}

        response = await callEndPoint(url, method, xcsrf, cookies, payload);
    }

    const result = NextResponse.json({ status: response.status, payload: response.payload });
    if(response.setCookieHeader) {
        result.headers.set('Set-Cookie', response.setCookieHeader);
    }

    return result;
};

export const callEndPoint = async (url, method, xcsrf = null, cookies = null, payload = null, timeout = 30000) => {
    const request = {
        method: method
    };

    if(method != httpMethods.Get && payload) {
        request.headers = { 'Content-Type': 'application/json' };
        request.body = JSON.stringify(payload);
    }

    if (xcsrf) {
        request.headers = { ...request.headers, 'X-CSRF': xcsrf };
    }

    if (cookies) {
        request.headers = { ...request.headers, 'Cookie': cookies };
    }

    let response;

    try {
        const baseUrl = await getBaseUrl();
        const fullUrl = `${baseUrl}${url}`;

        console.log(`Backend called: ${fullUrl}`);

        const fetchCaller = async (url, request) => fetch(url, request);

        // Wrapping the fetch in an invoker to enable the request to time out
        response = await invoke(fetchCaller, timeout, fullUrl, request);
    } catch (e) {
        // If request times out
        return {
            setCookieHeader: null,
            status: responseStatus.InternalServerError,
            payload: null
        };
    }
    
    return await processResponse(response);
};

const getBaseUrl = async () => {
    if(process.env.BACKEND_URL === undefined) {
        // Development environment
        const headersList = await headers();
        const host = headersList.get('host');

        return `http://${host.replace(frontend.portDev, backend.portDev)}`;
    } else {
        // Production environment
        return process.env.BACKEND_URL;
    }
};

const invoke = async (func, timeout = 0, ...args) => {
    return Promise.race([func(...args), new Promise((_, reject) =>
        setTimeout(() => reject(new Error()), timeout)
    )]);
};

const processResponse = async (response) => {
    const result = {
        setCookieHeader: null,
        status: null,
        payload: null
    };

    if(response)
    {
        result.setCookieHeader = response.headers.get('Set-Cookie');
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
};