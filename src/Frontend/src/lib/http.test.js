import { httpMethods, responseStatus, callEndPoint } from './http';
import { backend } from './config';

describe('httpMethods', () => {
    test('should define GET method correctly', () => {
        expect(httpMethods.Get).toBe('GET');
    });

    test('should define POST method correctly', () => {
        expect(httpMethods.Post).toBe('POST');
    });

    test('should define PUT method correctly', () => {
        expect(httpMethods.Put).toBe('PUT');
    });

    test('should define DELETE method correctly', () => {
        expect(httpMethods.Delete).toBe('DELETE');
    });
});

describe('responseStatus', () => {
    test('should define Ok status correctly', () => {
        expect(responseStatus.Ok).toBe(200);
    });

    test('should define BadRequest status correctly', () => {
        expect(responseStatus.BadRequest).toBe(400);
    });

    test('should define UnAuthorized status correctly', () => {
        expect(responseStatus.UnAuthorized).toBe(401);
    });

    test('should define Forbidden status correctly', () => {
        expect(responseStatus.Forbidden).toBe(403);
    });

    test('should define NotFound status correctly', () => {
        expect(responseStatus.NotFound).toBe(404);
    });

    test('should define InternalServerError status correctly', () => {
        expect(responseStatus.InternalServerError).toBe(500);
    });
});

describe('callEndPoint', () => {
    // Mock fetch
    global.fetch = jest.fn();

    // Mock window.location.hostname
    Object.defineProperty(window, 'location', {
        value: {
            hostname: 'localhost'
        },
        writable: true
    });

    beforeEach(() => {
        fetch.mockClear();
    });

    test('should make a GET request correctly', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({ data: 'success' }),
        });

        const result = await callEndPoint('/test', httpMethods.Get);

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(`https://localhost:${backend.portDev}/test`, {
            method: 'GET',
            credentials: 'include',
        });
        expect(result.status).toBe(200);
        expect(result.payload).toEqual({ data: 'success' });
    });

    test('should make a POST request with payload correctly', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({ data: 'created' }),
        });

        const payload = { name: 'test' };
        const result = await callEndPoint('/test', httpMethods.Post, null, payload);

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(`https://localhost:${backend.portDev}/test`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        expect(result.status).toBe(200);
        expect(result.payload).toEqual({ data: 'created' });
    });

    test('should include X-CSRF token when provided', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({}),
        });

        const xcsrfToken = 'test-token';
        await callEndPoint('/test', httpMethods.Post, xcsrfToken, { data: 'test' });

        expect(fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
            headers: expect.objectContaining({ 'X-CSRF': xcsrfToken }),
        }));
    });

    test('should handle fetch error and return InternalServerError', async () => {
        fetch.mockRejectedValueOnce(new Error('Network error'));

        const result = await callEndPoint('/test', httpMethods.Get);

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(result.status).toBe(responseStatus.InternalServerError);
        expect(result.payload).toBeNull();
    });

    test('should handle non-ok response', async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 404,
            json: async () => ({ error: 'not found' }),
        });

        const result = await callEndPoint('/test', httpMethods.Get);

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(result.status).toBe(404);
        expect(result.payload).toBeNull();
    });

    test('should handle response with no body (e.g., 204 No Content)', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            status: 204,
            json: async () => { throw new Error('No content to parse') },
        });

        const result = await callEndPoint('/test', httpMethods.Delete);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(result.status).toBe(204);
        expect(result.payload).toBeNull();
    });

    test('should use production backend URL when hostname is not localhost', async () => {
        Object.defineProperty(window, 'location', {
            value: {
                hostname: 'frontend.example.com'
            },
            writable: true
        });

        fetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({}),
        });

        await callEndPoint('/test', httpMethods.Get);

        expect(fetch).toHaveBeenCalledWith('https://backend.example.com/test', expect.any(Object));

        // Reset hostname for other tests
        Object.defineProperty(window, 'location', {
            value: {
                hostname: 'localhost'
            },
            writable: true
        });
    });

    test('should handle timeout', async () => {
        fetch.mockImplementationOnce(() => new Promise(resolve => setTimeout(() => resolve({
            ok: true,
            status: 200,
            json: async () => ({ data: 'success' }),
        }), 100))); // Simulate a delay longer than timeout

        const result = await callEndPoint('/test', httpMethods.Get, null, null, 50); // 50ms timeout

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(result.status).toBe(responseStatus.InternalServerError); // Timeout leads to catch block, then processResponse with undefined response
        expect(result.payload).toBeNull();
    });
});