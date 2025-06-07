import { apiImpl } from './server';
import { httpMethods, responseStatus } from './utils';
import { backend, frontend } from './config';

const { headers } = require('next/headers');
jest.mock('next/headers', () => ({
    headers: jest.fn()
}));

const { NextResponse } = require('next/server');
jest.mock('next/server', () => ({
    NextResponse: {
        json: jest.fn()
    }
}));

global.fetch = jest.fn();

describe('Server component', () => {
    const backEndUrlProduction = 'backend.blah-blah-blah.azurecontainerapps.io';
    const backendResponseTypes = {
        Ok: 'Ok',
        Nok: 'Nok',
        Null: 'Null'
    };

    beforeEach(() => {
        NextResponse.json.mockImplementation((data) => {
            return {
                status: data.status,
                payload: data.payload,
                headers: {
                    set: jest.fn()
                }
            };
        });
    });
    
    describe('apiImpl (dev environment)', () => {
        beforeEach(() => {
            delete process.env.BACKEND_URL;
        });

        test('called with GET request', async () => {
            await testApiImpl('localhost:3000');
        });

        test('called with POST request', async () => {
            await testApiImpl('localhost:3000', httpMethods.Post);
        });

        test('called with GET request, server responds with nok', async () => {
            await testApiImpl('localhost:3000', httpMethods.Get, backendResponseTypes.Nok);
        });

        test('called with GET request, server responds with null', async () => {
            await testApiImpl('localhost:3000', httpMethods.Get, backendResponseTypes.Null);
        });
    });

    describe('apiImpl (prod environment)', () => {
        beforeEach(() => {
            process.env.BACKEND_URL = backEndUrlProduction;
        });

        test('called with GET request', async () => {
            await testApiImpl(backEndUrlProduction);
        });

        test('called with POST request', async () => {
            await testApiImpl(backEndUrlProduction, httpMethods.Post);
        });

        test('called with GET request, server responds with nok', async () => {
            await testApiImpl(backEndUrlProduction, httpMethods.Get, backendResponseTypes.Nok);
        });

        test('called with GET request, server responds with null', async () => {
            await testApiImpl(backEndUrlProduction, httpMethods.Get, backendResponseTypes.Null);
        });
    });

    const testApiImpl = async (url, method = httpMethods.Get, backendResponseType = backendResponseTypes.Ok) => {
        const path = '/ThisIsAUrlForTestingPurposes';
        const messageFromBackend = 'ThisIsAMessageFromBackendForTestingPurposes';
        const cookiesFromBackend = 'TheseAreCookiesFromBackendForTestingPuroses';
        const xscrf = 'ThisIsAnXcsrfTokenForTestingPuroses';
        const messageFromFrontend = 'ThisIsAMessageFromFrontendForTestingPurposes';
        const cookiesFromFrontend = 'TheseAreCookiesFromFrontendForTestingPuroses';

        headers.mockReturnValue(new Map([['host', url]]));

        const payLoadFromBackend = { message: messageFromBackend };

        let responseFromBackend = {
            ok: backendResponseType == backendResponseTypes.Nok ? false : true,
            status: 200,
            headers: {
                get: (headerName) => {
                    if (headerName === 'Set-Cookie') {
                        return cookiesFromBackend;
                    }

                    return null;
                }
            },
            json: async () => {
                return payLoadFromBackend;
            }
        };

        if(backendResponseType == backendResponseTypes.Null) {
            responseFromBackend = null;
        }

        fetch.mockResolvedValueOnce(responseFromBackend);

        const payloadFromFrontend = { message: messageFromFrontend };

        const requestToServerSide = {
            method: method,
            headers: {
                get: (key) => {
                    if (key === 'X-CSRF') {
                        return xscrf;
                    }

                    if (key === 'cookie') {
                        return cookiesFromFrontend;
                    }

                    return null;
                }
            },
            json: async () => {
                return payloadFromFrontend;
            }
        };

        const response = await apiImpl(path, requestToServerSide);

        let requestToBackend = {
            headers: {
                'Cookie': cookiesFromFrontend,
                'X-CSRF': xscrf
            },
            method: method
        };

        if(method != httpMethods.Get) {
            requestToBackend.headers['Content-Type'] = 'application/json';
            requestToBackend.body = JSON.stringify(payloadFromFrontend);
        }

        expect(global.fetch).toHaveBeenCalledWith(`${process.env.BACKEND_URL === undefined ? 'http' : 'https'}://${url.replace(frontend.portDev, backend.portDev)}${path}`, requestToBackend);
        expect(NextResponse.json).toHaveBeenCalledWith({
            status: backendResponseType == backendResponseTypes.Null ? responseStatus.InternalServerError : responseFromBackend.status,
            payload: backendResponseType == backendResponseTypes.Ok ? payLoadFromBackend : null
        });

        expect(response.status).toBe(backendResponseType == backendResponseTypes.Null ? 500 : 200);
        
        if(backendResponseType == backendResponseTypes.Ok) {
            expect(response.payload.message).toBe(messageFromBackend);
        }

        if(backendResponseType == backendResponseTypes.Nok) {
            expect(response.payload).toBe(null);
        }

        if(backendResponseType != backendResponseTypes.Null) {
            expect(response.headers.set).toHaveBeenCalledWith('Set-Cookie', cookiesFromBackend);
        }
    };
});