import * as NE from 'node-exceptions';
export declare class NullException extends NE.LogicalException {
}
export declare class ArgumentNullException extends NE.LogicalException {
}
export declare class InvalidOperationException extends NE.LogicalException {
}
export declare class InvalidTypeException extends NE.LogicalException {
}
export declare class BadRequestError extends NE.LogicalException {
}
export declare class UnauthorizedError extends NE.LogicalException {
}
export declare class ForbiddenError extends NE.LogicalException {
}
export declare class NotFoundError extends NE.LogicalException {
}
export declare class MethodNotAllowedError extends NE.LogicalException {
}
export declare class ConflictError extends NE.LogicalException {
}
export declare class InternalServerError extends NE.LogicalException {
}
export declare class GatewayTimeoutError extends NE.LogicalException {
}
export declare class NotImplementedError extends NE.LogicalException {
}
export declare class TooManyRequestsError extends NE.LogicalException {
}
export declare class FileNotFoundError extends NE.LogicalException {
}
export declare class FileReadError extends NE.LogicalException {
}
export declare class FileWriteError extends NE.LogicalException {
}
export declare class DirectoryNotFoundError extends NE.LogicalException {
}
export declare class PermissionDeniedError extends NE.LogicalException {
}
export declare function createError(name: string, defaultMessage: string, statusCode?: number): {
    new (message?: string): {
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
        code: string;
        status: number;
    };
};
