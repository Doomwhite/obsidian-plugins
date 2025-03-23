"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogLevel = void 0;
const obsidian_1 = require("obsidian");
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Trace"] = 0] = "Trace";
    LogLevel[LogLevel["Debug"] = 1] = "Debug";
    LogLevel[LogLevel["Info"] = 2] = "Info";
    LogLevel[LogLevel["Warn"] = 3] = "Warn";
    LogLevel[LogLevel["Error"] = 4] = "Error";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
class LoggerImpl {
    name;
    logLevel;
    static STYLES = {
        [LogLevel.Trace]: { color: '#00BFFF', fontWeight: 'normal' },
        [LogLevel.Info]: { color: '#32CD32', fontWeight: 'normal' },
        [LogLevel.Debug]: { color: '#FFD700', fontWeight: 'normal' },
        [LogLevel.Warn]: { color: '#FFA500', fontWeight: 'bold' },
        [LogLevel.Error]: { color: '#FF6347', fontWeight: 'bold' },
    };
    static DEFAULT_DURATIONS = {
        [LogLevel.Trace]: 2000,
        [LogLevel.Info]: 3000,
        [LogLevel.Debug]: 2500,
        [LogLevel.Warn]: 5000,
        [LogLevel.Error]: 0,
    };
    constructor(name, logLevel) {
        this.name = name;
        this.logLevel = logLevel;
    }
    updateLogLevel(logLevel) {
        this.logLevel = logLevel;
    }
    toast(logLevel, message, duration = 0) {
        const formattedMessage = this.formatMessage(message);
        const fragment = this.createToastFragment(logLevel, formattedMessage);
        new obsidian_1.Notice(fragment, duration);
    }
    trace(message, showToast = false, duration) {
        this.log(LogLevel.Trace, 'trace', message, showToast, duration);
    }
    debug(message, showToast = false, duration) {
        this.log(LogLevel.Debug, 'debug', message, showToast, duration);
    }
    info(message, showToast = false, duration) {
        this.log(LogLevel.Info, 'info', message, showToast, duration);
    }
    warn(methodName, error) {
        this.handleError(LogLevel.Warn, methodName, error, LoggerImpl.DEFAULT_DURATIONS[LogLevel.Warn]);
    }
    error(methodName, error) {
        this.handleError(LogLevel.Error, methodName, error, LoggerImpl.DEFAULT_DURATIONS[LogLevel.Error]);
    }
    log(level, method, message, showToast, duration) {
        if (this.logLevel > level)
            return;
        const style = this.getStyleString(level);
        this.consoleLog(method, style, message);
        if (showToast) {
            this.toast(level, message, duration ?? LoggerImpl.DEFAULT_DURATIONS[level]);
        }
    }
    handleError(level, methodName, error, duration) {
        if (this.logLevel > level)
            return;
        const style = this.getStyleString(level);
        const errorMessage = this.getErrorMessage(error, methodName);
        console[level === LogLevel.Warn ? 'warn' : 'error'](`%c[${this.name}]`, style, errorMessage);
        this.toast(level, errorMessage, duration);
    }
    consoleLog(method, style, message) {
        const consoleMethod = console[method];
        const prefix = `%c[${this.name}]`;
        if (!Array.isArray(message)) {
            consoleMethod(prefix, style, message);
        }
        else {
            consoleMethod(prefix, style, message[0], ...message.slice(1));
        }
    }
    getStyleString(level) {
        const style = LoggerImpl.STYLES[level];
        return `color: ${style.color}; font-weight: ${style.fontWeight}`;
    }
    createToastFragment(level, message) {
        const fragment = document.createDocumentFragment();
        const nameElement = this.createStyledNameElement(level);
        const messageElement = document.createElement('span');
        messageElement.textContent = ` \n${message}`;
        fragment.appendChild(nameElement);
        fragment.appendChild(messageElement);
        return fragment;
    }
    createStyledNameElement(level) {
        const element = document.createElement('span');
        const style = LoggerImpl.STYLES[level];
        element.style.color = style.color;
        element.style.fontWeight = style.fontWeight;
        element.textContent = `[${this.name}]`;
        return element;
    }
    formatMessage(message) {
        return Array.isArray(message) ? message.join(' ') : String(message);
    }
    getErrorMessage(error, methodName) {
        const errorMessage = error instanceof Error
            ? `${error.message}\n${error.stack}`
            : String(error);
        return `Error in ${methodName}: ${errorMessage}`;
    }
}
exports.default = LoggerImpl;
//# sourceMappingURL=logging-functions.js.map