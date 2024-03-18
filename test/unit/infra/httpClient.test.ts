import axios, { AxiosError, AxiosHeaders } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { IHttpClient, HttpClient, httpClientFactory, defaultHttpOptions } from '../../../src/infra';

const mockAxios = new MockAdapter(axios);

describe('HttpClient Tests', () => {
    let http: IHttpClient;

    beforeEach(() => {
        mockAxios.reset();
        http = httpClientFactory();
    });

    test('should create an instance of HttpClient with default httpOptions',  async () => {
        expect(http).toBeInstanceOf(HttpClient);
        mockAxios.onAny().reply(async (config) => {
            expect(config.timeout).toBe(defaultHttpOptions.timeout);
            const headers = (config.headers as AxiosHeaders).toJSON();
            expect(headers).toEqual(defaultHttpOptions.headers);
            return [200, {}];
        });
        const { statusCode} = await http.get('/url');
        expect(statusCode).toBe(200);
    });

    test('should get proper response with statusCode 200', async () => {
        const mockData = {
            id: 1,
            obj: { a: true }
        };
        mockAxios.onGet('/url').reply(200, mockData);

        const { data, statusCode} = await http.get<typeof mockData>('/url');
        expect(statusCode).toBe(200);
        expect(data).toEqual(mockData);
        expect(data.obj.a).toBe(true);
    });

    test('should return 404 AxiosError for non-existent url', async () => {
        mockAxios.onGet('/url').reply(200, {});
        try {
            await http.get('XXX');
            throw new Error('should fail before');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            expect(err.message).toBe('Request failed with status code 404');
            expect(err).toBeInstanceOf(AxiosError);
            expect(err.response.status).toBe(404);
            expect(err.response.data).toBeUndefined();
        }
    });

    test('should fail if timeout exceeded', async () => {
        const timeout = 100;
        const httpClient = httpClientFactory({
            options: { ...defaultHttpOptions, timeout }
        });
        mockAxios.onAny().timeout();

        await expect(httpClient.get('/url'))
            .rejects.toThrow(expect.objectContaining({
                code: AxiosError.ETIMEDOUT,
                message: `timeout of ${timeout}ms exceeded`,
                name: 'Error',
            }));
    });
});
