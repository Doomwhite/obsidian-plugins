"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogBuilder = exports.Logger = exports.LoggerBuilder = exports.LogLevel = void 0;
const obsidian_1 = require("obsidian");
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["Trace"] = 0] = "Trace";
    LogLevel[LogLevel["Debug"] = 1] = "Debug";
    LogLevel[LogLevel["Info"] = 2] = "Info";
    LogLevel[LogLevel["Warn"] = 3] = "Warn";
    LogLevel[LogLevel["Error"] = 4] = "Error";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
class LoggerBuilder {
    _name = 'default';
    _minLogLevel = LogLevel.Info;
    _showToastDefaults = {};
    _app;
    constructor(app) {
        this._app = app;
    }
    name(value) {
        this._name = value;
        return this;
    }
    logLevel(value) {
        this._minLogLevel = value;
        return this;
    }
    showToastDefault(level, show) {
        this._showToastDefaults[level] = show;
        return this;
    }
    build() {
        return new Logger(this._app, this._name, this._minLogLevel, this._showToastDefaults);
    }
}
exports.LoggerBuilder = LoggerBuilder;
class Logger {
    _app;
    _name;
    _minLogLevel;
    _showToastDefaults;
    constructor(app, name, minLogLevel, showToastDefaults) {
        this._app = app;
        this._name = name;
        this._minLogLevel = minLogLevel;
        this._showToastDefaults = showToastDefaults;
    }
    trace(message) {
        const builder = new LogBuilder(this._app, this._name, LogLevel.Trace, this._minLogLevel, this._showToastDefaults[LogLevel.Trace]);
        if (message !== undefined) {
            builder.execute(message);
        }
        else {
            return builder;
        }
    }
    debug(message) {
        const builder = new LogBuilder(this._app, this._name, LogLevel.Debug, this._minLogLevel, this._showToastDefaults[LogLevel.Debug]);
        if (message !== undefined) {
            builder.execute(message);
        }
        else {
            return builder;
        }
    }
    info(message) {
        const builder = new LogBuilder(this._app, this._name, LogLevel.Info, this._minLogLevel, this._showToastDefaults[LogLevel.Info]);
        if (message !== undefined) {
            builder.execute(message);
        }
        else {
            return builder;
        }
    }
    warn(message) {
        const builder = new LogBuilder(this._app, this._name, LogLevel.Warn, this._minLogLevel, this._showToastDefaults[LogLevel.Warn] ?? true);
        if (message !== undefined) {
            builder.execute(message);
        }
        else {
            return builder;
        }
    }
    error(message) {
        const builder = new LogBuilder(this._app, this._name, LogLevel.Error, this._minLogLevel, this._showToastDefaults[LogLevel.Error] ?? true);
        if (message !== undefined) {
            builder.execute(message);
        }
        else {
            return builder;
        }
    }
}
exports.Logger = Logger;
class LogBuilder {
    _app;
    _name;
    _level;
    _minLogLevel;
    _methodName = null;
    _values = [];
    _error = null;
    _showToast;
    _duration = null;
    _formatting = null;
    constructor(app, name, level, minLogLevel, defaultShowToast) {
        this._app = app;
        this._name = name;
        this._level = level;
        this._minLogLevel = minLogLevel;
        this._showToast = defaultShowToast ?? false;
    }
    method(value) {
        this._methodName = value;
        return this;
    }
    values(...args) {
        this._values.push(...args);
        return this;
    }
    error(err) {
        this._error = err;
        return this;
    }
    showToast(value) {
        this._showToast = value;
        return this;
    }
    duration(value) {
        this._duration = value;
        return this;
    }
    formatting(value) {
        this._formatting = value;
        return this;
    }
    execute(...messages) {
        if (this._level < this._minLogLevel)
            return;
        if (messages.length > 0) {
            this._values = messages;
        }
        let message = '';
        if (this._error) {
            const errorMessage = this._error instanceof Error ? `${this._error.message}\n${this._error.stack}` : String(this._error);
            message = `Error in ${this._methodName || 'unknown'}: ${errorMessage}`;
            if (this._values.length > 0) {
                message += ` - ${this.formatMessage(this._values)}`;
            }
        }
        else {
            message = this.formatMessage(this._values);
        }
        if (this._formatting) {
            // Placeholder for custom formatting logic, e.g., apply format string
        }
        const logPrefix = `[${this._name}] [${LogLevel[this._level]}]`;
        console[this._level === LogLevel.Warn ? 'warn' : this._level === LogLevel.Error ? 'error' : 'log'](`${logPrefix} ${message}`);
        if (this._showToast) {
            const duration = this._duration ?? (this._level === LogLevel.Error ? 0 : this._level === LogLevel.Warn ? 5000 : 3000);
            new obsidian_1.Notice(`${logPrefix} ${message}`, duration);
        }
    }
    formatMessage(messages) {
        return messages.map(m => {
            if (m instanceof Error) {
                return `${m.message}\n${m.stack}`;
            }
            else if (typeof m === 'object') {
                return JSON.stringify(m, null, 2);
            }
            else {
                return String(m);
            }
        }).join(' ');
    }
}
exports.LogBuilder = LogBuilder;
//# sourceMappingURL=logging.js.map