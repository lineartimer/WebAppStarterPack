import { apiImpl } from './server';
import { httpMethods, responseStatus } from './utils';

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
    
    describe('apiImpl', () => {
        const backendResponseTypes = {
            Ok: 'Ok',
            Nok: 'Nok',
            Null: 'Null'
        };

        test('called with GET request (dev environment)', async () => {
            await testApiImpl('localhost:3000');
        });

        test('called with GET request (prod environment)', async () => {
            await testApiImpl('frontend.blah-blah-blah.azurecontainerapps.io');
        });

        test('called with POST request (dev environment)', async () => {
            await testApiImpl('localhost:3000', httpMethods.Post);
        });

        test('called with POST request (prod environment)', async () => {
            await testApiImpl('frontend.blah-blah-blah.azurecontainerapps.io', httpMethods.Post);
        });

        test('called with GET request (dev environment), server responds with nok', async () => {
            await testApiImpl('localhost:3000', httpMethods.Get, backendResponseTypes.Nok);
        });

        test('called with GET request (prod environment), server responds with nok', async () => {
            await testApiImpl('frontend.blah-blah-blah.azurecontainerapps.io', httpMethods.Get, backendResponseTypes.Nok);
        });

        test('called with GET request (dev environment), server responds with null', async () => {
            await testApiImpl('localhost:3000', httpMethods.Get, backendResponseTypes.Null);
        });

        test('called with GET request (prod environment), server responds with null', async () => {
            await testApiImpl('frontend.blah-blah-blah.azurecontainerapps.io', httpMethods.Get, backendResponseTypes.Null);
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

            expect(global.fetch).toHaveBeenCalledWith(`http://${url.replace(3000, 5000).replace('frontend', 'backend')}${path}`, requestToBackend);
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
});