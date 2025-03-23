export declare enum LogLevel {
    Trace = 0,
    Debug = 1,
    Info = 2,
    Warn = 3,
    Error = 4
}
export interface Logger {
    toast(logLevel: LogLevel, message: unknown | unknown[], duration?: number): void;
    trace(message: unknown | unknown[], showToast?: boolean, duration?: number): void;
    info(message: unknown | unknown[], showToast?: boolean, duration?: number): void;
    debug(message: unknown | unknown[], showToast?: boolean, duration?: number): void;
    warn(methodName: string, error: unknown): void;
    error(methodName: string, error: unknown): void;
}
export default class LoggerImpl implements Logger {
    private readonly name;
    private logLevel;
    private static readonly STYLES;
    private static readonly DEFAULT_DURATIONS;
    constructor(name: string, logLevel: LogLevel);
    updateLogLevel(logLevel: LogLevel): void;
    toast(logLevel: LogLevel, message: unknown | unknown[], duration?: number): void;
    trace(message: unknown | unknown[], showToast?: boolean, duration?: number): void;
    debug(message: unknown | unknown[], showToast?: boolean, duration?: number): void;
    info(message: unknown | unknown[], showToast?: boolean, duration?: number): void;
    warn(methodName: string, error: unknown): void;
    error(methodName: string, error: unknown): void;
    private log;
    private handleError;
    private consoleLog;
    private getStyleString;
    private createToastFragment;
    private createStyledNameElement;
    private formatMessage;
    private getErrorMessage;
}
