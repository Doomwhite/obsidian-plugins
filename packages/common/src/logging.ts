import { Notice, type App } from 'obsidian';

export enum LogLevel {
  Trace = 0,
  Debug = 1,
  Info = 2,
  Warn = 3,
  Error = 4,
}

// Usage example:
// import { Plugin } from 'obsidian';
// import { LoggerBuilder, LogLevel } from './logger';

// export default class MyPlugin extends Plugin {
//   async onload() {
//     const logger = new LoggerBuilder(this.app)
//       .name('MyPlugin')
//       .logLevel(LogLevel.Info)
//       .showToastDefault(LogLevel.Error, true)
//       .build();

//     // Simple log
//     logger.info('Plugin loaded');

//     // Complex log with method name and toast
//     logger.trace()
//       .method('init')
//       .values('Starting plugin', { version: '1.0.0' })
//       .showToast(true)
//       .execute();

//     // Error log with additional context
//     logger.error()
//       .method('loadData')
//       .error(new Error('Failed to load data'))
//       .execute('Additional info');
//   }
// }

export interface ILogger {
  log: Logger;
  createLogger(logLevel: LogLevel): void;
}

interface ToastStyle {
  color: string;
  fontWeight: string;
}

const toastStyles: Record<LogLevel, ToastStyle> = {
  [LogLevel.Trace]: { color: '#00BFFF', fontWeight: 'normal' },
  [LogLevel.Debug]: { color: '#FFD700', fontWeight: 'normal' },
  [LogLevel.Info]: { color: '#32CD32', fontWeight: 'normal' },
  [LogLevel.Warn]: { color: '#FFA500', fontWeight: 'bold' },
  [LogLevel.Error]: { color: '#FF6347', fontWeight: 'bold' },
};

const consoleFunctions: Record<
  LogLevel,
  'trace' | 'debug' | 'info' | 'warn' | 'error'
> = {
  [LogLevel.Trace]: 'trace',
  [LogLevel.Debug]: 'debug',
  [LogLevel.Info]: 'info',
  [LogLevel.Warn]: 'warn',
  [LogLevel.Error]: 'error',
};

export class LoggerBuilder {
  private _name = 'default';
  private _minLogLevel: LogLevel = LogLevel.Info;
  private _showToastDefaults: Partial<Record<LogLevel, boolean>> = {};
  private _app: App;

  constructor(app: App) {
    this._app = app;
  }

  name(value: string): this {
    this._name = value;
    return this;
  }

  logLevel(value: LogLevel): this {
    this._minLogLevel = value;
    return this;
  }

  showToastDefault(level: LogLevel, show: boolean): this {
    this._showToastDefaults[level] = show;
    return this;
  }

  build(): Logger {
    return new Logger(
      this._app,
      this._name,
      this._minLogLevel,
      this._showToastDefaults,
    );
  }
}

export class Logger {
  private _app: App;
  private _name: string;
  private _minLogLevel: LogLevel;
  private _showToastDefaults: Partial<Record<LogLevel, boolean>>;

  constructor(
    app: App,
    name: string,
    minLogLevel: LogLevel,
    showToastDefaults: Partial<Record<LogLevel, boolean>>,
  ) {
    this._app = app;
    this._name = name;
    this._minLogLevel = minLogLevel;
    this._showToastDefaults = showToastDefaults;
  }

  trace(message: string): void;
  trace(): LogBuilder;
  trace(message?: string) {
    const builder = new LogBuilder(
      this._app,
      this._name,
      LogLevel.Trace,
      this._minLogLevel,
      this._showToastDefaults[LogLevel.Trace],
    );
    if (message !== undefined) {
      builder.execute(message);
    } else {
      return builder;
    }
  }

  debug(message: string): void;
  debug(): LogBuilder;
  debug(message?: string) {
    const builder = new LogBuilder(
      this._app,
      this._name,
      LogLevel.Debug,
      this._minLogLevel,
      this._showToastDefaults[LogLevel.Debug],
    );
    if (message !== undefined) {
      builder.execute(message);
    } else {
      return builder;
    }
  }

  info(message: string): void;
  info(): LogBuilder;
  info(message?: string) {
    const builder = new LogBuilder(
      this._app,
      this._name,
      LogLevel.Info,
      this._minLogLevel,
      this._showToastDefaults[LogLevel.Info],
    );
    if (message !== undefined) {
      builder.execute(message);
    } else {
      return builder;
    }
  }

  warn(message: string): void;
  warn(): LogBuilder;
  warn(message?: string) {
    const builder = new LogBuilder(
      this._app,
      this._name,
      LogLevel.Warn,
      this._minLogLevel,
      this._showToastDefaults[LogLevel.Warn] ?? true,
    );
    if (message !== undefined) {
      builder.execute(message);
    } else {
      return builder;
    }
  }

  error(message: string): void;
  error(): LogBuilder;
  error(message?: string) {
    const builder = new LogBuilder(
      this._app,
      this._name,
      LogLevel.Error,
      this._minLogLevel,
      this._showToastDefaults[LogLevel.Error] ?? true,
    );
    if (message !== undefined) {
      builder.execute(message);
    } else {
      return builder;
    }
  }
}

export class LogBuilder {
  private _app: App;
  private _name: string;
  private _level: LogLevel;
  private _minLogLevel: LogLevel;
  private _methodName: string | null = null;
  private _values: unknown[] = [];
  private _error: unknown | null = null;
  private _showToast: boolean;
  private _toastStyles: ToastStyle | null = null;
  private _duration: number | null = null;
  private _formatting: string | null = null;

  constructor(
    app: App,
    name: string,
    level: LogLevel,
    minLogLevel: LogLevel,
    defaultShowToast?: boolean,
  ) {
    this._app = app;
    this._name = name;
    this._level = level;
    this._minLogLevel = minLogLevel;
    this._showToast = defaultShowToast ?? false;
  }

  method(value: string): this {
    this._methodName = value;
    return this;
  }

  values(...args: unknown[]): this {
    this._values.push(...args);
    return this;
  }

  error(err: unknown): this {
    this._error = err;
    return this;
  }

  showToast(value: boolean): this {
    this._showToast = value;
    return this;
  }

  toastStyle(toastStyle: ToastStyle): this {
    this._toastStyles = toastStyle;
    return this;
  }

  duration(value: number): this {
    this._duration = value;
    return this;
  }

  formatting(value: string): this {
    this._formatting = value;
    return this;
  }

  execute(...messages: unknown[]): void {
    if (this._level < this._minLogLevel) return;

    if (messages.length > 0) {
      this._values = messages;
    }

    let message = '';
    if (this._error) {
      const errorMessage =
        this._error instanceof Error
          ? `${this._error.message}\n${this._error.stack}`
          : String(this._error);
      message = `Error in ${this._methodName || 'unknown'}: ${errorMessage}`;
      if (this._values.length > 0) {
        message += ` - ${this.formatMessage(this._values)}`;
      }
    } else {
      message = this.formatMessage(this._values);
    }

    if (this._formatting) {
      // Placeholder for custom formatting logic, e.g., apply format string
    }

    const logPrefix = `[${this._name}] [${LogLevel[this._level]}]`;

    console[consoleFunctions[this._level]](`${logPrefix} ${message}`);

    if (this._showToast) {
      this.toast(logPrefix, message);
    }
  }

  private formatMessage(messages: unknown[]): string {
    return messages
      .map((m) => {
        if (m instanceof Error) {
          return `${m.message}\n${m.stack}`;
        }
        if (typeof m === 'object') {
          return JSON.stringify(m, null, 2);
        }
        return String(m);
      })
      .join(' ');
  }

  private toast(logPrefix: string, message: string): void {
    const fragment = this.createToastFragment(logPrefix, message);
    const duration =
      this._duration ??
      (this._level === LogLevel.Error
        ? 0
        : this._level === LogLevel.Warn
          ? 5000
          : 3000);

    new Notice(fragment, duration);
  }

  private createToastFragment(
    logPrefix: string,
    message: string,
  ): DocumentFragment {
    const fragment = document.createDocumentFragment();
    const nameElement = this.createStyledNameElement(logPrefix);
    const messageElement = this.createStyledMessageElement(message);

    fragment.appendChild(nameElement);
    fragment.appendChild(messageElement);
    return fragment;
  }

  private createStyledNameElement(logPrefix: string): HTMLSpanElement {
    const element = document.createElement('span');
    const style = this._toastStyles ?? toastStyles[this._level];
    element.style.color = style.color;
    element.style.fontWeight = style.fontWeight;
    element.textContent = `${logPrefix} `;
    return element;
  }

  private createStyledMessageElement(message: string): HTMLSpanElement {
    const element = document.createElement('span');
    const style = this._toastStyles ?? toastStyles[this._level];
    element.style.color = style.color;
    element.style.fontWeight = style.fontWeight;
    element.textContent = message;
    return element;
  }
}
