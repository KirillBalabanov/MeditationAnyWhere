export enum FetchingMethods {
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
}

export enum FetchContentTypes {
    APPLICATION_JSON = "application/json",
    MULTIPART_FORM_DATA = "multipart/form-data",
}

interface csrfTokenI {
    parameterName: string,
    headerName: string,
    token: string
}

export const csrfFetching = (endpoint: RequestInfo, method: FetchingMethods, contentType: FetchContentTypes | null = null, body: BodyInit | null = null): Promise<Response> => {
    return fetch("/api/server/csrf").then((response) => response.json()).then((data: csrfTokenI) => {
        let request: RequestInit = {
            method: method,
            headers: {
                [data.headerName]: data.token,
            }
        };
        if (contentType !== null && body !== null) {
            request.body = body;
            switch (contentType) {
                case FetchContentTypes.APPLICATION_JSON:
                    Object.assign(request.headers, {"Content-Type": contentType})
                    break;
                case FetchContentTypes.MULTIPART_FORM_DATA:
                    break
            }
        }
        return fetch(endpoint, request);
    });
};