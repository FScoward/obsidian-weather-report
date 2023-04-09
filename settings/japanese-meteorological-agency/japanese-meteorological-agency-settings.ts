export interface JapaneseMeteorologicalAgencySettings {
	jmaArea: JmaArea;
}

export const DEFAULT_JAPANESE_METEOROLOGICAL_AGENCY_SETTINGS: JapaneseMeteorologicalAgencySettings =
	{
		jmaArea: {
			"130000": {
				name: "東京都",
				enName: "Tokyo",
				kana: "とうきょうと",
				parent: "010300",
			},
		},
	};

interface JMA_WeatherResponse {
	publishingOffice: string;
	reportDatetime: string;
	timeSeries: JMA_TimeSeries[];
}

// JMA_Timeseriesのinterface定義
interface JMA_TimeSeries {
	timeDefines: JMA_TimeDefine[];
	areas: JMA_Area[];
	tempAverage: JMA_Area[];
	precipAverage: JMA_Area[];
}

interface JMA_TimeDefine {
	date: string;
}

interface JMA_Area {
	area: JMA_AreaNameCode;
	weatherCodes: string[];
	weathers: string[];
	winds: string[];
	waves: string[];
	pops: string[];
	temps: string[];
	reliabilities: string[];
	tempsMin: string[];
	tempsMinUpper: string[];
	tempsMinLower: string[];
	tempsMax: string[];
	tempsMaxUpper: string[];
	tempsMaxLower: string[];
	min: string;
	max: string;
}
interface JMA_AreaNameCode {
	name: string;
	code: string;
}

export class JapaneseMeteorologicalAgency {
	jmaAreaDefinition: JMAAreaResponse;

	constructor() {
		// fileからareaを取得
		this.jmaAreaDefinition = require("./area.json");
	}

	// areaをfetchする関数
	// fetchするurlはhttps://www.jma.go.jp/bosai/common/const/area.json
	// で取得できる
	public async getForecastArea(): Promise<JMAAreaResponse> {
		const response = await fetch(
			"https://www.jma.go.jp/bosai/common/const/area.json"
		);
		await new Promise((resolve) => setTimeout(resolve, 10000)); // 10秒待機
		return (await response.json()) as JMAAreaResponse;
	}

	private requestUrl(jmaArea: JmaArea): string {
		// インデックスシグネチャからkeyを取得
		const key = Object.keys(jmaArea)[0];
		return `https://www.jma.go.jp/bosai/forecast/data/forecast/${key}.json`;
	}

	private async request(jmaArea: JmaArea): Promise<JMA_WeatherResponse[]> {
		const response = await fetch(this.requestUrl(jmaArea));
		return (await response.json()) as JMA_WeatherResponse[];
	}

	// 最高気温と最低気温を取得し、テキストを返す関数
	public async getWeatherText(jmaArea: JmaArea): Promise<string> {
		const response = this.request(jmaArea);
		return response.then((value) => {
			const area = value[0].timeSeries[2].areas[0].area.name;
			const minTemp = value[0].timeSeries[2].areas[0].temps[0];
			const maxTemp = value[0].timeSeries[2].areas[0].temps[1];
			return (
				area +
				"の最高気温は" +
				maxTemp +
				"度、最低気温は" +
				minTemp +
				"度です。"
			);
		});
	}
}

// jma_area_jsonを参考にしてinterfaceを定義する
interface JMAAreaResponse {
	centers: JmaArea;
	offices: JmaArea;
	class10s: JmaArea;
	class15s: JmaArea;
	class20s: JmaArea;
}
interface JmaArea {
	[key: string]: {
		name: string;
		enName: string;
		kana: string;
		parent: string;
	};
}
