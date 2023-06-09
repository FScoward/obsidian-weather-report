import {
	DEFAULT_OPEN_METEO_SETTINGS,
	OpenMeteoSettings,
} from "settings/open-meteo/OpenMeteoSettings";
import {
	App,
	Editor,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";
import {
	DEFAULT_SETTINGS,
	WEATHER_REPORT_API,
	WeatherReportPluginSettings,
} from "settings/WeatherReportPluginSettings";
import {
	City,
	DEFAULT_TSUKUMIJIMA_SETTINGS,
	Tsukumijima,
	TsukumijimaSettings,
} from "settings/tsukumijima/tsukumijima-settings";
import {
	DEFAULT_JAPANESE_METEOROLOGICAL_AGENCY_SETTINGS,
	JapaneseMeteorologicalAgency,
	JapaneseMeteorologicalAgencySettings,
} from "settings/japanese-meteorological-agency/japanese-meteorological-agency-settings";

export default class MyPlugin extends Plugin {
	weatherReportPluginSettings: WeatherReportPluginSettings;
	openMeteoSettings: OpenMeteoSettings;
	tsukumijimaSettings: TsukumijimaSettings;
	japaneseMeteorologicalAgencySettings: JapaneseMeteorologicalAgencySettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon(
			"dice",
			"Sample Plugin",
			(evt: MouseEvent) => {
				// Called when the user clicks the icon.
				new Notice("This is a notice!");
			}
		);
		// Perform additional things with the ribbon
		ribbonIconEl.addClass("my-plugin-ribbon-class");

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText("Status Bar Text");

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: "open-weather-report-modal",
			name: "Open Weather Report modal",
			callback: () => {
				new WeatherReportModal(this.app).open();
			},
		});

		// open meteo apiからjsonデータを取得する関数
		const getOpenMeteoData = async () => {
			const openMeteoURL =
				"https://api.open-meteo.com/v1/forecast?latitude=35.689&longitude=139.692&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=Asia%2FTokyo";
			// urlからjsonを取得
			const response = await fetch(openMeteoURL);
			const data = await response.json();
			return data;
		};

		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: "today temperature",
			name: "Today Temperature",
			editorCallback: (editor: Editor, view: MarkdownView) => {
				// 保存された設定の読み出し
				const settings = this.weatherReportPluginSettings;

				switch (settings.api) {
					case WEATHER_REPORT_API.OpenMeteo:
						// urlからjsonを取得
						getOpenMeteoData().then((data) => {
							// 取得したjsonから今日の最高気温を取得
							const todayMaxTemperature =
								data.daily.temperature_2m_max[0];
							// 取得したjsonから今日の最低気温を取得
							const todayMinTemperature =
								data.daily.temperature_2m_min[0];

							const text =
								"今日の最高気温は" +
								todayMaxTemperature +
								"度です。" +
								"最低気温は" +
								todayMinTemperature +
								"度です。";

							// テキストを挿入
							editor.replaceSelection(text);
						});
						break;
					case WEATHER_REPORT_API.Tsukumijima: {
						const tsukumijimaAPI = new Tsukumijima();
						// 設定からcityを取得
						const city = this.tsukumijimaSettings.city;
						tsukumijimaAPI.getTempText(city).then((text) => {
							// テキストを挿入
							editor.replaceSelection(text);
						});
						break;
					}
					case WEATHER_REPORT_API.JapaneseMeteorologicalAgency: {
						const jma = new JapaneseMeteorologicalAgency();
						jma.getWeatherText(
							this.japaneseMeteorologicalAgencySettings.jmaArea
						).then((text) => {
							// テキストを挿入
							editor.replaceSelection(text);
						});
						break;
					}
				}
			},
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: "open-sample-modal-complex",
			name: "Open sample modal (complex)",
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView =
					this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new WeatherReportModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			},
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new WeatherReportSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, "click", (evt: MouseEvent) => {
			console.log("click", evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(
			window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
		);
	}

	onunload() {}

	async loadSettings() {
		this.weatherReportPluginSettings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
		this.openMeteoSettings = Object.assign(
			{},
			DEFAULT_OPEN_METEO_SETTINGS,
			await this.loadData()
		);
		this.tsukumijimaSettings = Object.assign(
			{},
			DEFAULT_TSUKUMIJIMA_SETTINGS,
			await this.loadData()
		);
		this.japaneseMeteorologicalAgencySettings = Object.assign(
			{},
			DEFAULT_JAPANESE_METEOROLOGICAL_AGENCY_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.weatherReportPluginSettings);
	}
}

class WeatherReportModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.setText("Woah!");
	}

	onClose() {
		const { contentEl } = this;
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
		const { containerEl } = this;

		// 設定の読み込み
		const weatherReportPluginSettings =
			this.plugin.weatherReportPluginSettings;
		const openMeteoSettings = this.plugin.openMeteoSettings;
		const tsukumijimaSettings = this.plugin.tsukumijimaSettings;
		const japaneseMeteorologicalAgencySettings =
			this.plugin.japaneseMeteorologicalAgencySettings;

		containerEl.empty();

		containerEl.createEl("h2", { text: "Weather API" });

		new Setting(containerEl)
			.setName("利用するAPI")
			.setDesc("利用するAPIの選択")
			.addDropdown((dropdown) =>
				dropdown
					.addOption(WEATHER_REPORT_API.OpenMeteo, "OpenMeteo API")
					.addOption(
						WEATHER_REPORT_API.Tsukumijima,
						"Tsukumijima API"
					)
					.addOption(
						WEATHER_REPORT_API.JapaneseMeteorologicalAgency,
						"気象庁 API"
					)
					.setValue(weatherReportPluginSettings.api)
					.onChange(async (value) => {
						console.log("Secret: " + value);
						// valueをWEATHER_REPORT_API型に変換
						this.plugin.weatherReportPluginSettings.api =
							WEATHER_REPORT_API[
								value as keyof typeof WEATHER_REPORT_API
							];
						await this.plugin.saveSettings();
					})
			);

		containerEl.createEl("h2", { text: "Open Meteo API" });

		// 緯度、軽度の設定
		new Setting(containerEl)
			.setName("緯度")
			.setDesc("緯度を入力してください")
			.addText((text) => {
				text.setPlaceholder("緯度")
					.setValue(openMeteoSettings.latitude.toString())
					.onChange(async (value) => {
						this.plugin.openMeteoSettings.latitude =
							parseFloat(value);
						await this.plugin.saveSettings();
					});
			});
		new Setting(containerEl)
			.setName("経度")
			.setDesc("経度を入力してください")
			.addText((text) => {
				text.setPlaceholder("経度")
					.setValue(openMeteoSettings.longitude.toString())
					.onChange(async (value) => {
						this.plugin.openMeteoSettings.longitude =
							parseFloat(value);
						await this.plugin.saveSettings();
					});
			});

		containerEl.createEl("h1", { text: "Tsukumijima APIの設定" });
		containerEl.createEl("h2", { text: "都市の設定" });

		const citiesKeyValue = Tsukumijima.CITIES
			// 都道府県名と都市名を結合して都市コードをキーにしたオブジェクトを作成
			// 例: { '130010': '東京都 - 東京' }
			.reduce((acc, city) => {
				acc[city.cityCode] = city.prefTitle + " - " + city.cityTitle;
				return acc;
			}, {} as Record<string, string>);

		new Setting(containerEl)
			.setName("都市")
			.setDesc("都市の設定")
			// Tsukumijima.CITIESをdropdownに設定
			.addDropdown((dropdown) =>
				dropdown
					.addOptions(citiesKeyValue)
					.setValue(tsukumijimaSettings.city.cityCode)
					.onChange(async (value) => {
						console.log("Secret: " + value);
						// valueを都市コード型に変換
						this.plugin.tsukumijimaSettings.city =
							Tsukumijima.CITIES.find(
								(city) => city.cityCode === value
							) as City;
						await this.plugin.saveSettings();
					})
			);

		/** === 気象庁API === */
		containerEl.createEl("h1", { text: "気象庁 APIの設定" });
		containerEl.createEl("h2", { text: "都市の設定" });

		const jma = new JapaneseMeteorologicalAgency();
		const keys = Object.keys(jma.jmaAreaDefinition.offices);
		// officesは位ンデックスシグネチャなので、
		// 以下のようにキーを取得して、
		// そのキーを使ってオブジェクトの値を取得する
		const forecastAreasKeyValueJMA = keys.reduce((acc, key) => {
			acc[key] = jma.jmaAreaDefinition.offices[key].name;
			return acc;
		}, {} as Record<string, string>);

		new Setting(containerEl)
			.setName("都市")
			.setDesc("都市の設定")
			// JMA_ForecastAreasをdropdownに設定
			.addDropdown((dropdown) =>
				dropdown
					.addOptions(forecastAreasKeyValueJMA)
					.setValue(
						Object.keys(
							japaneseMeteorologicalAgencySettings.jmaArea
						)[0]
					)
					.onChange(async (value) => {
						this.plugin.japaneseMeteorologicalAgencySettings.jmaArea =
							{ [value]: jma.jmaAreaDefinition.offices[value] };
						await this.plugin.saveSettings();
					})
			);
	}
}
