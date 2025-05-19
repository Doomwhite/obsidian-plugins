"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const obsidian_1 = require("obsidian");
const logging_1 = require("./logging");
class PluginUtils {
    plugin;
    name;
    log;
    constructor(name, logLevel, plugin) {
        this.name = name;
        this.plugin = plugin;
        this.createLogger(logLevel);
    }
    createLogger(logLevel) {
        this.log = new logging_1.LoggerBuilder(this.plugin.app)
            .name('PluginUtils')
            .logLevel(logLevel)
            .showToastDefault(logging_1.LogLevel.Error, true)
            .build();
    }
    getVaultPath() {
        try {
            const adapter = this.plugin.app.vault.adapter;
            this.log.info()
                .method('getVaultPath')
                .values(adapter)
                .execute();
            if (adapter instanceof obsidian_1.FileSystemAdapter) {
                return adapter.getBasePath();
            }
            return '';
        }
        catch (error) {
            this.log.error()
                .method('getVaultPath')
                .values(error)
                .showToast(true)
                .execute();
            return '';
        }
    }
}
exports.default = PluginUtils;
//# sourceMappingURL=plugin-utils.js.map