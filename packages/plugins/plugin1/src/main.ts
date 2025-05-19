import {
  type App,
  type Editor,
  MarkdownView,
  Modal,
  Notice,
  Plugin,
  PluginSettingTab,
  Setting,
} from 'obsidian';
import {
  type ILogger,
  type Logger,
  LoggerBuilder,
  LogLevel,
  NullException,
  sharedFunction,
} from '@doomwhite-obsidian-plugins/common';
import PluginUtils from '@doomwhite-obsidian-plugins/common/src/plugin-utils';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
  logLevel: LogLevel;
  mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
  logLevel: LogLevel.Trace,
  mySetting: 'default',
};

export default class MyPlugin extends Plugin implements ILogger {
  settings: MyPluginSettings;
  utils!: PluginUtils;
  log!: Logger;

  async onload() {
    await this.loadSettings();

    console.log('Loading Plugin1');
    this.log.trace().method('onload').values(true).execute();
    this.log.trace().method('onload').values(true).showToast(true).execute();
    this.log.debug().method('onload').values(true).execute();
    this.log.debug().method('onload').values(true).showToast(true).execute();
    this.log.info().method('onload').values(true).execute();
    this.log.info().method('onload').values(true).showToast(true).execute();
    this.log.warn().method('onload').values(true).execute();
    this.log.warn().method('onload').values(true).showToast(true).execute();
    this.log.error().method('onload').values(true).execute();
    this.log.error().method('onload').values(true).showToast(true).execute();
    sharedFunction();

    // This creates an icon in the left ribbon.
    const ribbonIconEl = this.addRibbonIcon(
      'dice',
      'Sample Plugin',
      (evt: MouseEvent) => {
        // Called when the user clicks the icon.
        new Notice('This is a notice!');
      },
    );
    // Perform additional things with the ribbon
    ribbonIconEl.addClass('my-plugin-ribbon-class');

    // This adds a status bar item to the bottom of the app. Does not work on mobile apps.
    const statusBarItemEl = this.addStatusBarItem();
    statusBarItemEl.setText('Status Bar Text');

    // This adds a simple command that can be triggered anywhere
    this.addCommands();

    // This adds a settings tab so the user can configure various aspects of the plugin
    this.addSettingTab(new SampleSettingTab(this.app, this));

    // If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
    // Using this function will automatically remove the event listener when this plugin is disabled.
    this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
      console.log('click', evt);
    });

    // When registering intervals, this function will automatically clear the interval when the plugin is disabled.
    this.registerInterval(
      window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000),
    );
  }

  private addCommands(): void {
    this.addCommand({
      id: 'open-sample-modal-simple',
      name: 'Open sample modal (simple)',
      callback: () => {
        new SampleModal(this.app).open();
      },
    });
    // This adds an editor command that can perform some operation on the current editor instance
    this.addCommand({
      id: 'sample-editor-command',
      name: 'Sample editor command',
      editorCallback: (editor: Editor, view: MarkdownView) => {
        console.log(editor.getSelection());
        editor.replaceSelection('Sample Editor Command');
      },
    });
    // This adds a complex command that can check whether the current state of the app allows execution of the command
    this.addCommand({
      id: 'open-sample-modal-complex',
      name: 'Open sample modal (complex)',
      checkCallback: (checking: boolean) => {
        // Conditions to check
        const markdownView =
          this.app.workspace.getActiveViewOfType(MarkdownView);
        if (markdownView) {
          // If checking is true, we're simply "checking" if the command can be run.
          // If checking is false, then we want to actually perform the operation.
          if (!checking) {
            new SampleModal(this.app).open();
          }

          // This command will only show up in Command Palette when the check function returns true
          return true;
        }
      },
    });
  }

  onunload() {}

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    this.utils = new PluginUtils(
      'PropertyEditorPlugin',
      this.settings.logLevel,
      this,
    );
    this.createLogger(this.settings.logLevel);
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  createLogger(logLevel: LogLevel): void {
    this.utils.createLogger(logLevel);
    this.log = new LoggerBuilder(this.app)
      .name('MyPlugin')
      .logLevel(logLevel)
      .showToastDefault(LogLevel.Error, true)
      .build();
  }
}

class SampleModal extends Modal {
  onOpen() {
    const { contentEl } = this;
    contentEl.setText('Woah!');
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}

class SampleSettingTab extends PluginSettingTab {
  plugin: MyPlugin;

  constructor(app: App, plugin: MyPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName('Setting #1')
      .setDesc("It's a secret")
      .addText((text) =>
        text
          .setPlaceholder('Enter your secret')
          .setValue(this.plugin.settings.mySetting)
          .onChange(async (value) => {
            this.plugin.settings.mySetting = value;
            await this.plugin.saveSettings();
          }),
      );
  }
}
