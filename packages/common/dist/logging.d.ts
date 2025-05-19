import { App } from 'obsidian';
export declare enum LogLevel {
    Trace = 0,
    Debug = 1,
    Info = 2,
    Warn = 3,
    Error = 4
}
export interface ILogger {
    log: Logger;
    createLogger(logLevel: LogLevel): void;
}
export declare class LoggerBuilder {
    private _name;
    private _minLogLevel;
    private _showToastDefaults;
    private _app;
    constructor(app: App);
    name(value: string): this;
    logLevel(value: LogLevel): this;
    showToastDefault(level: LogLevel, show: boolean): this;
    build(): Logger;
}
export declare class Logger {
    private _app;
    private _name;
    private _minLogLevel;
    private _showToastDefaults;
    constructor(app: App, name: string, minLogLevel: LogLevel, showToastDefaults: Partial<Record<LogLevel, boolean>>);
    trace(message: string): void;
    trace(): LogBuilder;
    debug(message: string): void;
    debug(): LogBuilder;
    info(message: string): void;
    info(): LogBuilder;
    warn(message: string): void;
    warn(): LogBuilder;
    error(message: string): void;
    error(): LogBuilder;
}
export declare class LogBuilder {
    private _app;
    private _name;
    private _level;
    private _minLogLevel;
    private _methodName;
    private _values;
    private _error;
    private _showToast;
    private _duration;
    private _formatting;
    constructor(app: App, name: string, level: LogLevel, minLogLevel: LogLevel, defaultShowToast?: boolean);
    method(value: string): this;
    values(...args: unknown[]): this;
    error(err: unknown): this;
    showToast(value: boolean): this;
    duration(value: number): this;
    formatting(value: string): this;
    execute(...messages: unknown[]): void;
    private formatMessage;
}
