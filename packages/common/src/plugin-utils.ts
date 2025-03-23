import { FileSystemAdapter, type Plugin } from 'obsidian';
import LoggingImpl, { type LogLevel } from './logging';

export default class PluginUtils extends LoggingImpl {
  readonly plugin: Plugin;

  constructor(name: string, logLevel: LogLevel, plugin: Plugin) {
    super(`${name} - PluginUtils`, logLevel);
    this.plugin = plugin;
  }

  getVaultPath(): string {
    try {
      const adapter = this.plugin.app.vault.adapter;
      if (adapter instanceof FileSystemAdapter) {
        return adapter.getBasePath();
      }
      return '';
    } catch (error) {
      this.error('getVaultPath', error);
      return '';
    }
  }
}
