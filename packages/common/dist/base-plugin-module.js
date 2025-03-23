"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const obsidian_1 = require("obsidian");
const logging_functions_1 = require("./logging-functions");
class BasePluginModule extends logging_functions_1.LoggingFunctions {
    plugin;
    settings;
    loaded = false;
    originalMethods = new Map();
    registeredContextMenuHandlers = [];
    registeredCommands = [];
    registers = [];
    constructor(name, logLevel, plugin) {
        super(name, logLevel);
        this.plugin = plugin;
    }
    load(settings) {
        try {
            this.settings = settings;
            if (!this.loaded) {
                this.trace(`Initializing plugin module...`, true, 500);
                this.toggleErrorWrapping(this.settings.enableErrorWrapping);
                this.loaded = true;
                this.onLoad();
            }
        }
        catch (error) {
            this.error('load', error);
        }
    }
    unload() {
        try {
            if (this.loaded) {
                this.loaded = false;
                this.onUnload();
                // Remove all registered context menu handlers
                for (const handler of this.registeredContextMenuHandlers.map((callback) => callback)) {
                    this.plugin.app.workspace.off('file-menu', handler);
                }
                this.registeredContextMenuHandlers = [];
                // Remove all registered commands
                for (const commandId of this.registeredCommands) {
                    this.plugin.removeCommand(commandId);
                }
                this.registeredCommands = [];
            }
        }
        catch (error) {
            this.error('unload', error);
        }
    }
    toggleErrorWrapping(enable) {
        try {
            this.trace(`Error wrapping ${enable ? 'enabled' : 'disabled'}.`, true, 500);
            const methodNames = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
            if (enable) {
                // Apply error wrapping
                for (const methodName of methodNames) {
                    if (methodName === 'constructor' || typeof this[methodName] !== 'function') {
                        continue;
                    }
                    // Store the original method if not already stored
                    if (!this.originalMethods.has(methodName)) {
                        this.originalMethods.set(methodName, this[methodName]);
                    }
                    const originalMethod = this.originalMethods.get(methodName);
                    this[methodName] = this.wrapWithErrorHandling(originalMethod.bind(this), methodName);
                }
            }
            else {
                // Remove error wrapping by restoring original methods
                for (const methodName of methodNames) {
                    if (this.originalMethods.has(methodName)) {
                        this[methodName] = this.originalMethods.get(methodName);
                    }
                }
            }
        }
        catch (error) {
            this.error('toggleErrorWrapping', error);
        }
    }
    getVaultPath() {
        try {
            let adapter = this.plugin.app.vault.adapter;
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
    wrapWithErrorHandling(fn, fnName) {
        return (...args) => {
            if (this.settings.enableErrorWrapping) {
                try {
                    const result = fn(...args);
                    // Handle async functions (i.e., Promises)
                    if (result instanceof Promise) {
                        return result.catch((error) => {
                            const errorMessage = this.getErrorMessage(error, fnName);
                            this.toast(logging_functions_1.LogLevel.Error, errorMessage, 0);
                            throw error; // Rethrow to propagate the error
                        });
                    }
                    // Handle sync functions
                    return result;
                }
                catch (error) {
                    const errorMessage = this.getErrorMessage(error, fnName);
                    this.toast(logging_functions_1.LogLevel.Error, errorMessage, 0);
                    throw error; // Rethrow to propagate the error
                }
            }
            return fn(...args); // If wrapping is disabled, just call the function directly
        };
    }
    // Adds a context menu item with specific conditions and actions
    addContexMenuItemToFileMenu(condition, title, icon, action) {
        try {
            const handler = (menu, file) => {
                // Ensure the plugin is loaded and the condition is met
                if (!this.loaded || !condition(file))
                    return;
                menu.addItem((item) => {
                    item.setTitle(title)
                        .setIcon(icon)
                        .onClick(() => action(file));
                });
            };
            // Register the event and store the handler reference
            this.plugin.app.workspace.on('file-menu', handler);
            this.registeredContextMenuHandlers.push(handler);
        }
        catch (error) {
            this.error('addContexMenuItemToFileMenu', error);
        }
    }
    addContexMenuItemToFilesMenu(condition, title, icon, action) {
        try {
            const handler = (menu, files) => {
                // Ensure the plugin is loaded and the condition is met
                if (!this.loaded || !condition(files))
                    return;
                menu.addItem((item) => {
                    item.setTitle(title)
                        .setIcon(icon)
                        .onClick(() => action(files));
                });
            };
            // Register the event and store the handler reference
            this.plugin.app.workspace.on('files-menu', handler);
            this.registeredContextMenuHandlers.push(handler);
        }
        catch (error) {
            this.error('addContexMenuItemToFilesMenu', error);
        }
    }
    // Adds a command to the plugin and stores the command ID for cleanup
    addCommand(id, name, callback) {
        try {
            // Register the command
            const command = this.plugin.addCommand({
                id,
                name,
                callback: this.wrapWithErrorHandling(callback, id), // Wrap the callback
            });
            // Store the command ID for cleanup
            this.registeredCommands.push(command.id);
        }
        catch (error) {
            this.error('addCommand', error);
        }
    }
    addEditorCommand(id, name, callback) {
        try {
            // Register the command
            const command = this.plugin.addCommand({
                id,
                name,
                editorCallback: this.wrapWithErrorHandling(callback, id), // Wrap the callback
            });
            // Store the command ID for cleanup
            this.registeredCommands.push(command.id);
        }
        catch (error) {
            this.error('addCommand', error);
        }
        this.plugin.registerMarkdownCodeBlockProcessor;
    }
    registerEditorSuggest(id, editorSuggest) {
        this.info(`editorSuggest ${editorSuggest}`);
        const register = `registerEditorSuggest-${id}`;
        if (this.registers.contains(register))
            return;
        this.registers.push(register);
        this.plugin.registerEditorSuggest(editorSuggest);
    }
    registerEvent(id, eventRef) {
        this.info(`eventRef ${eventRef}`);
        const register = `registerEvent-${id}`;
        if (this.registers.contains(register))
            return;
        this.registers.push(register);
        this.plugin.registerEvent(eventRef);
    }
    registerMarkdownCodeBlockProcessor(language, handler, sortOrder) {
        this.info(`language ${language} handler ${handler} sortOrder ${sortOrder}`);
        const register = `registerMarkdownCodeBlockProcessor-${language}`;
        if (this.registers.contains(register))
            return;
        this.registers.push(register);
        this.plugin.registerMarkdownCodeBlockProcessor(language, handler, sortOrder);
    }
}
exports.default = BasePluginModule;
//# sourceMappingURL=base-plugin-module.js.map