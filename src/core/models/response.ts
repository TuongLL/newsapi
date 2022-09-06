export enum ResponseStatus {
    INPUT_INVALID = "Invalid input",
    ERROR = "An error occurred",
    OK = "OK",
    SUCCESSFUL = "Successful",
    TOKEN_INVALID = "Token invalid",
    REQUEST_TIMEOUT = "Request timeout",
    UNAUTHORIZED = "Unauthorized",
    FORBIDDEN = "Forbiden",
}

export enum ResponseCode {
    INPUT_INVALID = 400,
    ERROR = 500,
    OK = 200,
    SUCCESSFUL = 200,
    TOKEN_INVALID = 401,
    REQUEST_TIMEOUT = 408,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403
}
export class Response<T> {
    status: ResponseStatus;
    data: T;
    constructor(){};
    static ok<T>(data: any, init?: any): Response<T> {
        return {
            status: ResponseStatus.OK,
            ...data
        }
    }
}

