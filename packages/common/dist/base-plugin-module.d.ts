import { Editor, EditorSuggest, EventRef, MarkdownFileInfo, MarkdownPostProcessorContext, MarkdownView, Plugin, TAbstractFile } from 'obsidian';
import { LoggingFunctions, LogLevel } from './logging-functions';
export interface ErrorWrappingSettings {
    enableErrorWrapping: boolean;
}
export default abstract class BasePluginModule<T extends ErrorWrappingSettings> extends LoggingFunctions {
    readonly plugin: Plugin;
    settings: T;
    loaded: boolean;
    private readonly originalMethods;
    private registeredContextMenuHandlers;
    private registeredCommands;
    private registers;
    protected constructor(name: string, logLevel: LogLevel, plugin: Plugin);
    abstract onLoad(): void;
    abstract onUnload(): void;
    load(settings: T): void;
    unload(): void;
    toggleErrorWrapping(enable: boolean): void;
    getVaultPath(): string;
    wrapWithErrorHandling<TArgs extends unknown[], TResult>(fn: (...args: TArgs) => TResult | Promise<TResult>, fnName: string): (...args: TArgs) => TResult | Promise<TResult>;
    addContexMenuItemToFileMenu(condition: (file: TAbstractFile) => boolean, title: string, icon: string, action: (file: TAbstractFile) => void): void;
    addContexMenuItemToFilesMenu(condition: (files: TAbstractFile[]) => boolean, title: string, icon: string, action: (files: TAbstractFile[]) => void): void;
    addCommand(id: string, name: string, callback: () => void | Promise<void>): void;
    addEditorCommand(id: string, name: string, callback: (editor: Editor, ctx: MarkdownView | MarkdownFileInfo) => any): void;
    registerEditorSuggest(id: string, editorSuggest: EditorSuggest<any>): void;
    registerEvent(id: string, eventRef: EventRef): void;
    registerMarkdownCodeBlockProcessor(language: string, handler: (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => Promise<any> | void, sortOrder?: number): void;
}
