"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionDeniedError = exports.DirectoryNotFoundError = exports.FileWriteError = exports.FileReadError = exports.FileNotFoundError = exports.TooManyRequestsError = exports.NotImplementedError = exports.GatewayTimeoutError = exports.InternalServerError = exports.ConflictError = exports.MethodNotAllowedError = exports.NotFoundError = exports.ForbiddenError = exports.UnauthorizedError = exports.BadRequestError = exports.InvalidTypeException = exports.InvalidOperationException = exports.ArgumentNullException = exports.NullException = void 0;
exports.createError = createError;
const NE = __importStar(require("node-exceptions"));
class NullException extends NE.LogicalException {
}
exports.NullException = NullException;
class ArgumentNullException extends NE.LogicalException {
}
exports.ArgumentNullException = ArgumentNullException;
class InvalidOperationException extends NE.LogicalException {
}
exports.InvalidOperationException = InvalidOperationException;
class InvalidTypeException extends NE.LogicalException {
}
exports.InvalidTypeException = InvalidTypeException;
// HTTP Exceptions
class BadRequestError extends NE.LogicalException {
}
exports.BadRequestError = BadRequestError;
class UnauthorizedError extends NE.LogicalException {
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends NE.LogicalException {
}
exports.ForbiddenError = ForbiddenError;
class NotFoundError extends NE.LogicalException {
}
exports.NotFoundError = NotFoundError;
class MethodNotAllowedError extends NE.LogicalException {
}
exports.MethodNotAllowedError = MethodNotAllowedError;
class ConflictError extends NE.LogicalException {
}
exports.ConflictError = ConflictError;
class InternalServerError extends NE.LogicalException {
}
exports.InternalServerError = InternalServerError;
class GatewayTimeoutError extends NE.LogicalException {
}
exports.GatewayTimeoutError = GatewayTimeoutError;
class NotImplementedError extends NE.LogicalException {
}
exports.NotImplementedError = NotImplementedError;
class TooManyRequestsError extends NE.LogicalException {
}
exports.TooManyRequestsError = TooManyRequestsError;
// File and I/O Exceptions
class FileNotFoundError extends NE.LogicalException {
}
exports.FileNotFoundError = FileNotFoundError;
class FileReadError extends NE.LogicalException {
}
exports.FileReadError = FileReadError;
class FileWriteError extends NE.LogicalException {
}
exports.FileWriteError = FileWriteError;
class DirectoryNotFoundError extends NE.LogicalException {
}
exports.DirectoryNotFoundError = DirectoryNotFoundError;
class PermissionDeniedError extends NE.LogicalException {
}
exports.PermissionDeniedError = PermissionDeniedError;
function createError(name, defaultMessage, statusCode = 500) {
    return class extends NE.LogicalException {
        constructor(message = defaultMessage) {
            super(message);
            this.name = name;
            this.status = statusCode;
        }
    };
}
//# sourceMappingURL=exceptions.js.map