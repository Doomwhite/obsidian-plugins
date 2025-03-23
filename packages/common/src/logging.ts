import { Notice } from 'obsidian';
import { NotImplementedError } from './exceptions';

export enum LogLevel {
  Trace = 0,
  Debug = 1,
  Info = 2,
  Warn = 3,
  Error = 4,
}

export interface Logger {
  toast(
    logLevel: LogLevel,
    message: unknown | unknown[],
    duration?: number,
  ): void;
  trace(
    message: unknown | unknown[],
    showToast?: boolean,
    duration?: number,
  ): void;
  info(
    message: unknown | unknown[],
    showToast?: boolean,
    duration?: number,
  ): void;
  debug(
    message: unknown | unknown[],
    showToast?: boolean,
    duration?: number,
  ): void;
  warn(methodName: string, error: unknown): void;
  error(methodName: string, error: unknown): void;
}

interface LogStyle {
  color: string;
  fontWeight: string;
}

type LogMethod = 'trace' | 'debug' | 'info' | 'warn' | 'error';

export default class LoggerImpl implements Logger {
  private readonly name: string;
  private logLevel: LogLevel;

  private static readonly STYLES: Record<LogLevel, LogStyle> = {
    [LogLevel.Trace]: { color: '#00BFFF', fontWeight: 'normal' },
    [LogLevel.Info]: { color: '#32CD32', fontWeight: 'normal' },
    [LogLevel.Debug]: { color: '#FFD700', fontWeight: 'normal' },
    [LogLevel.Warn]: { color: '#FFA500', fontWeight: 'bold' },
    [LogLevel.Error]: { color: '#FF6347', fontWeight: 'bold' },
  };

  private static readonly DEFAULT_DURATIONS: Record<LogLevel, number> = {
    [LogLevel.Trace]: 2000,
    [LogLevel.Info]: 3000,
    [LogLevel.Debug]: 2500,
    [LogLevel.Warn]: 5000,
    [LogLevel.Error]: 0,
  };

  constructor(name: string, logLevel: LogLevel) {
    this.name = name;
    this.logLevel = logLevel;
  }

  updateLogLevel(logLevel: LogLevel): void {
    this.logLevel = logLevel;
  }

  toast(logLevel: LogLevel, message: unknown | unknown[], duration = 0): void {
    const formattedMessage = this.formatMessage(message);
    const fragment = this.createToastFragment(logLevel, formattedMessage);
    new Notice(fragment, duration);
  }

  trace(
    message: unknown | unknown[],
    showToast = false,
    duration?: number,
  ): void {
    this.log(LogLevel.Trace, 'trace', message, showToast, duration);
  }

  debug(
    message: unknown | unknown[],
    showToast = false,
    duration?: number,
  ): void {
    this.log(LogLevel.Debug, 'debug', message, showToast, duration);
  }

  info(
    message: unknown | unknown[],
    showToast = false,
    duration?: number,
  ): void {
    this.log(LogLevel.Info, 'info', message, showToast, duration);
  }

  warn(methodName: string, error: unknown): void {
    this.handleError(
      LogLevel.Warn,
      methodName,
      error,
      LoggerImpl.DEFAULT_DURATIONS[LogLevel.Warn],
    );
  }

  error(methodName: string, error: unknown): void {
    this.handleError(
      LogLevel.Error,
      methodName,
      error,
      LoggerImpl.DEFAULT_DURATIONS[LogLevel.Error],
    );
  }

  private log(
    level: LogLevel,
    method: LogMethod,
    message: unknown | unknown[],
    showToast: boolean,
    duration?: number,
  ): void {
    if (this.logLevel > level) return;

    const style = this.getStyleString(level);
    this.consoleLog(method, style, message);

    if (showToast) {
      this.toast(
        level,
        message,
        duration ?? LoggerImpl.DEFAULT_DURATIONS[level],
      );
    }
  }

  private handleError(
    level: LogLevel,
    methodName: string,
    error: unknown,
    duration: number,
  ): void {
    if (this.logLevel > level) return;

    const style = this.getStyleString(level);
    const errorMessage = this.getErrorMessage(error, methodName);

    console[level === LogLevel.Warn ? 'warn' : 'error'](
      `%c[${this.name}]`,
      style,
      errorMessage,
    );
    this.toast(level, errorMessage, duration);
  }

  private consoleLog(
    method: LogMethod,
    style: string,
    message: unknown | unknown[],
  ): void {
    const consoleMethod = console[method] as (...args: unknown[]) => void;
    const prefix = `%c[${this.name}]`;

    if (!Array.isArray(message)) {
      consoleMethod(prefix, style, message);
    } else {
      consoleMethod(prefix, style, message[0], ...message.slice(1));
    }
  }

  private getStyleString(level: LogLevel): string {
    const style = LoggerImpl.STYLES[level];
    return `color: ${style.color}; font-weight: ${style.fontWeight}`;
  }

  private createToastFragment(
    level: LogLevel,
    message: string,
  ): DocumentFragment {
    const fragment = document.createDocumentFragment();
    const nameElement = this.createStyledNameElement(level);
    const messageElement = document.createElement('span');
    messageElement.textContent = ` \n${message}`;

    fragment.appendChild(nameElement);
    fragment.appendChild(messageElement);
    return fragment;
  }

  private createStyledNameElement(level: LogLevel): HTMLSpanElement {
    const element = document.createElement('span');
    const style = LoggerImpl.STYLES[level];
    element.style.color = style.color;
    element.style.fontWeight = style.fontWeight;
    element.textContent = `[${this.name}]`;
    return element;
  }

  private formatMessage(message: unknown | unknown[]): string {
    return Array.isArray(message) ? message.join(' ') : String(message);
  }

  private getErrorMessage(error: unknown, methodName: string): string {
    const errorMessage =
      error instanceof Error
        ? `${error.message}\n${error.stack}`
        : String(error);
    return `Error in ${methodName}: ${errorMessage}`;
  }
}
