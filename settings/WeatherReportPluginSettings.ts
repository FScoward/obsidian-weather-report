export interface WeatherReportPluginSettings {
	api: WEATHER_REPORT_API;
}

// weathrer report api の定義
export const WEATHER_REPORT_API = {
	OpenMeteo: "OpenMeteo",
	Tsukumijima: "Tsukumijima",
} as const;
export type WEATHER_REPORT_API =
	typeof WEATHER_REPORT_API[keyof typeof WEATHER_REPORT_API];

export const DEFAULT_SETTINGS: WeatherReportPluginSettings = {
	api: WEATHER_REPORT_API.OpenMeteo,
};
