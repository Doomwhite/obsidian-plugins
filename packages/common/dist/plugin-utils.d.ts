import { type Plugin } from 'obsidian';
import { type ILogger, type Logger, LogLevel } from './logging';
export default class PluginUtils implements ILogger {
    readonly plugin: Plugin;
    readonly name: string;
    log: Logger;
    constructor(name: string, logLevel: LogLevel, plugin: Plugin);
    createLogger(logLevel: LogLevel): void;
    getVaultPath(): string;
}
