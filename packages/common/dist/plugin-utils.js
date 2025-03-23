"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const obsidian_1 = require("obsidian");
const logging_1 = __importDefault(require("./logging"));
class PluginUtils extends logging_1.default {
    plugin;
    constructor(name, logLevel, plugin) {
        super(`${name} - PluginUtils`, logLevel);
        this.plugin = plugin;
    }
    getVaultPath() {
        try {
            const adapter = this.plugin.app.vault.adapter;
            if (adapter instanceof obsidian_1.FileSystemAdapter) {
                return adapter.getBasePath();
            }
            return '';
        }
        catch (error) {
            this.error('getVaultPath', error);
            return '';
        }
    }
}
exports.default = PluginUtils;
//# sourceMappingURL=plugin-utils.js.map