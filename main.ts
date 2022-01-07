import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface IPFSPluginSettings {
	pinLocally: boolean;
	pinataAPIKey: string;
	pinataSecretKey: string;
}

const DEFAULT_SETTINGS: IPFSPluginSettings = {
	pinLocally: false,
	pinataAPIKey: '',
	pinataSecretKey: ''
}

export default class IPFSPlugin extends Plugin {
	settings: IPFSPluginSettings;

	async onload() {
		await this.loadSettings();

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		// let statusBarItemEl = this.addStatusBarItem();
		// statusBarItemEl.setText('Status Bar Text');

		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'sync-current-file',
			name: 'Sync current file with codebase',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				let markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new IPFSSettingTab(this.app, this));

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		//this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		let {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		let {contentEl} = this;
		contentEl.empty();
	}
}

class IPFSSettingTab extends PluginSettingTab {
	plugin: IPFSPlugin;

	constructor(app: App, plugin: IPFSPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'IPFS Settings.'});

		new Setting(containerEl)
			.setName('Pin Locally')
			.setDesc('Only works if you have a local IPFS node running.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.pinLocally)
				.onChange(async (value) => {
					this.plugin.settings.pinLocally = value;
				    await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Pinata API Key')
			.setDesc('The public key for your Pinata account.')
			.addText(text => text
				.setPlaceholder('Enter your key')
				.setValue(this.plugin.settings.pinataAPIKey)
				.onChange(async (value) => {
					this.plugin.settings.pinataAPIKey = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Pinata Private Key')
			.setDesc('Keep it secret. Keep it safe.')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.pinataSecretKey)
				.onChange(async (value) => {
					this.plugin.settings.pinataSecretKey = value;
					await this.plugin.saveSettings();
				}));
	}
}
