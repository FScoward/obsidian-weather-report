import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { WMO_WeatherInterpretationCodes } from 'weathercode';

// Remember to rename these classes and interfaces!

interface WeatherReportPluginSettings {
	api: string;
}

const DEFAULT_SETTINGS: WeatherReportPluginSettings = {
	api: 'OpenMeteo'
}

export default class MyPlugin extends Plugin {
	settings: WeatherReportPluginSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('This is a notice!');
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-weather-report-modal',
			name: 'Open Weather Report modal',
			callback: () => {
				new WeatherReportModal(this.app).open();
			}
		});
		
		// open meteo apiからjsonデータを取得する関数
		const getOpenMeteoData = async () => {
			const openMeteoURL = "https://api.open-meteo.com/v1/forecast?latitude=35.689&longitude=139.692&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=Asia%2FTokyo"
			// urlからjsonを取得
			const response = await fetch(openMeteoURL);
			const data = await response.json();
			return data;
		}

		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'today temperature',
			name: 'Today Temperature',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				// urlからjsonを取得
				getOpenMeteoData()
					.then(data => {
						// 取得したjsonから今日の最高気温を取得
						const todayMaxTemperature = data.daily.temperature_2m_max[0];
						// 取得したjsonから今日の最低気温を取得
						const todayMinTemperature = data.daily.temperature_2m_min[0];

						// weathercodeから天気を取得
						const weatherCode = data.daily.weathercode[0];

						// weatherCodeをWeatherCode型に変換
						const weatherCodeString = WMO_WeatherInterpretationCodes[weatherCode];

						const text = '今日の天気は' + weatherCodeString + 'です。' + '最高気温は' + todayMaxTemperature + '度です。' + '最低気温は' + todayMinTemperature + '度です。'

						// テキストを挿入
						editor.replaceSelection(text);
					});
			}
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new WeatherReportModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new WeatherReportSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
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

class WeatherReportModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class WeatherReportSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Weather API'});

		new Setting(containerEl)
			.setName('利用するAPI')
			.setDesc('利用するAPIの選択')
			.addDropdown(dropdown => dropdown
				.addOption('OpenMeteo', 'OpenMeteo API')
				.addOption('Tsukumijima', 'Tsukumijima API')
				.setValue('OpenMeteo').onChange(async (value) => {
				console.log('Secret: ' + value);
				this.plugin.settings.api = value;
				await this.plugin.saveSettings();
			}));

	}
}
