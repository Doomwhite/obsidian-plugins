import { type Plugin } from 'obsidian';
import LoggingImpl, { type LogLevel } from './logging';
export default class PluginUtils extends LoggingImpl {
    readonly plugin: Plugin;
    constructor(name: string, logLevel: LogLevel, plugin: Plugin);
    getVaultPath(): string;
}
