import { FileSystemAdapter, type Plugin } from 'obsidian';
import { ILogger, Logger, LoggerBuilder, LogLevel } from './logging';

export default class PluginUtils implements ILogger {
  readonly plugin: Plugin;
  readonly name: string;
  log!: Logger;

  constructor(name: string, logLevel: LogLevel, plugin: Plugin) {
    this.name = name;
    this.plugin = plugin;
    this.createLogger(logLevel);
  }

  createLogger(logLevel: LogLevel): void {
    this.log = new LoggerBuilder(this.plugin.app)
      .name('PluginUtils')
      .logLevel(logLevel)
      .showToastDefault(LogLevel.Error, true)
      .build();
  }

  getVaultPath(): string {
    try {
      const adapter = this.plugin.app.vault.adapter;
      this.log.info().method('getVaultPath').values(adapter).execute();
      if (adapter instanceof FileSystemAdapter) {
        return adapter.getBasePath();
      }
      return '';
    } catch (error) {
      this.log
        .error()
        .method('getVaultPath')
        .values(error)
        .showToast(true)
        .execute();
      return '';
    }
  }
}
