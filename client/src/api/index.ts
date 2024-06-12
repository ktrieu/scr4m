// Ancient ritual of writing the fetch wrappers...

type FetchMethod = "GET" | "POST" | "DELETE"

export class FetchError<T> extends Error {
    status: number;
    body: T;

    constructor(status: number, body: T) {
        super();
        this.status = status;
        this.body = body;
    }
}

const getResponseBody = (r: Response): unknown => {
    try {
        return r.json()
    }
    catch (err) {
        throw new FetchError(r.status, {
            code: 'SCR4M_invalid_response_json',
            error: err
        });
    }
}

const apiFetch = async <TBody>(url: string, method: FetchMethod, body?: TBody): Promise<unknown> => {
    const encodedBody = body ? JSON.stringify(body) : undefined;
    let headers: HeadersInit = {};
    if (body) {
        headers['Content-Type'] = 'application/json'
    }

    const response = await fetch(url, {
        method,
        body: encodedBody,
        headers,
    })

    const respBody = getResponseBody(response);

    if (!response.ok) {
        throw new FetchError(response.status, respBody);
    }

    return respBody;
}

export const apiGet = async (url: string) => {
    return apiFetch(url, 'GET');
}

export const apiPost = async <TBody>(url: string, body?: TBody) => {
    return apiFetch(url, "POST", body);
}

export const apiDelete = async (url: string) => {
    return apiFetch(url, "DELETE");
}