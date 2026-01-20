export class BaseError extends Error {
    statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);

        Object.setPrototypeOf(this, new.target.prototype);
        this.name = Error.name;
        this.statusCode = statusCode;
        Error.captureStackTrace(this);
    }
}

export class ErrorUnauthorized extends BaseError {
    constructor(message = "unauthorized") {
        super(401, message);

        this.name = ErrorUnauthorized.name;
    }
}

export class BadRequestError extends BaseError {
    constructor(message = "bad request") {
        super(400, message);
        this.name = BadRequestError.name;
    }
}

export class NotFoundError extends BaseError {
    constructor(message = "bad request") {
        super(404, message);
        this.name = BadRequestError.name;
    }
}
