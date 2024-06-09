// Ancient ritual of writing the fetch wrappers...

type FetchMethod = "GET" | "POST" | "DELETE"

type FetchError<T> = {
    code: number
    response: T
}

const getResponseBody = (r: Response): unknown => {
    try {
        return r.json()
    }
    catch (err) {
        const fetchErr: FetchError<unknown> = {
            code: r.status,
            response: {
                code: 'SCR4M_RESPONSE_JSON_ERROR',
                error: err
            }
        }
        throw fetchErr;
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
        const fetchErr: FetchError<unknown> = {
            code: response.status,
            response: respBody,
        }
        throw fetchErr;
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