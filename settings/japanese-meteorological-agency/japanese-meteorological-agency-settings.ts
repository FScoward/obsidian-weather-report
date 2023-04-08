export interface JapaneseMeteorologicalAgencySettings {
	jmaArea: JmaArea;
}

export interface JMA_ForecastArea {
	forecastAreaCode: string;
	forecastAreaName: string;
}

export const DEFAULT_JAPANESE_METEOROLOGICAL_AGENCY_SETTINGS: JapaneseMeteorologicalAgencySettings =
	{
		jmaArea: {
			"130010": {
				name: "東京都",
				enName: "Tokyo",
				kana: "とうきょうと",
				parent: "010300",
			},
		},
	};

// 気象庁の予報区の一覧を配列で定義する
// 予報区の一覧は気象庁のホームページから取得する
// https://www.jma.go.jp/jp/yoho/319.html
// 例: forecastAreaCode: 011000, forecastAreaName: 宗谷地方
export const JMA_ForecastAreas: JMA_ForecastArea[] = [
	{ forecastAreaCode: "011000", forecastAreaName: "宗谷地方" },
	{ forecastAreaCode: "012010", forecastAreaName: "上川・留萌地方" },
	{ forecastAreaCode: "016000", forecastAreaName: "石狩・空知・後志地方" },
	{ forecastAreaCode: "013000", forecastAreaName: "網走・北見・紋別地方" },
	{ forecastAreaCode: "014100", forecastAreaName: "釧路・根室地方" },
	{ forecastAreaCode: "014030", forecastAreaName: "十勝地方地方" },
	{ forecastAreaCode: "015000", forecastAreaName: "胆振・日高地方" },
	{ forecastAreaCode: "017000", forecastAreaName: "渡島・檜山地方" },
	{ forecastAreaCode: "020000", forecastAreaName: "青森県" },
	{ forecastAreaCode: "030000", forecastAreaName: "岩手県" },
	{ forecastAreaCode: "040000", forecastAreaName: "宮城県" },
	{ forecastAreaCode: "050000", forecastAreaName: "秋田県" },
	{ forecastAreaCode: "060000", forecastAreaName: "山形県" },
	{ forecastAreaCode: "070000", forecastAreaName: "福島県" },
	{ forecastAreaCode: "080000", forecastAreaName: "茨城県" },
	{ forecastAreaCode: "090000", forecastAreaName: "栃木県" },
	{ forecastAreaCode: "100000", forecastAreaName: "群馬県" },
	{ forecastAreaCode: "110000", forecastAreaName: "埼玉県" },
	{ forecastAreaCode: "120000", forecastAreaName: "千葉県" },
	{ forecastAreaCode: "130000", forecastAreaName: "東京都" },
	{ forecastAreaCode: "140000", forecastAreaName: "神奈川県" },
	{ forecastAreaCode: "150000", forecastAreaName: "新潟県" },
	{ forecastAreaCode: "160000", forecastAreaName: "富山県" },
	{ forecastAreaCode: "170000", forecastAreaName: "石川県" },
	{ forecastAreaCode: "180000", forecastAreaName: "福井県" },
	{ forecastAreaCode: "190000", forecastAreaName: "山梨県" },
	{ forecastAreaCode: "200000", forecastAreaName: "長野県" },
	{ forecastAreaCode: "210000", forecastAreaName: "岐阜県" },
	{ forecastAreaCode: "220000", forecastAreaName: "静岡県" },
	{ forecastAreaCode: "230000", forecastAreaName: "愛知県" },
	{ forecastAreaCode: "240000", forecastAreaName: "三重県" },
	{ forecastAreaCode: "250000", forecastAreaName: "滋賀県" },
	{ forecastAreaCode: "260000", forecastAreaName: "京都府" },
	{ forecastAreaCode: "270000", forecastAreaName: "大阪府" },
	{ forecastAreaCode: "280000", forecastAreaName: "兵庫県" },
	{ forecastAreaCode: "290000", forecastAreaName: "奈良県" },
	{ forecastAreaCode: "300000", forecastAreaName: "和歌山県" },
	{ forecastAreaCode: "310000", forecastAreaName: "島根県" },
	{ forecastAreaCode: "320000", forecastAreaName: "鳥取県" },
	{ forecastAreaCode: "330000", forecastAreaName: "岡山県" },
	{ forecastAreaCode: "340000", forecastAreaName: "広島県" },
	{ forecastAreaCode: "350000", forecastAreaName: "山口県" },
	{ forecastAreaCode: "360000", forecastAreaName: "徳島県" },
	{ forecastAreaCode: "370000", forecastAreaName: "香川県" },
	{ forecastAreaCode: "380000", forecastAreaName: "愛媛県" },
	{ forecastAreaCode: "390000", forecastAreaName: "高知県" },
	{ forecastAreaCode: "400000", forecastAreaName: "福岡県" },
	{ forecastAreaCode: "410000", forecastAreaName: "佐賀県" },
	{ forecastAreaCode: "420000", forecastAreaName: "長崎県" },
	{ forecastAreaCode: "430000", forecastAreaName: "熊本県" },
	{ forecastAreaCode: "440000", forecastAreaName: "大分県" },
	{ forecastAreaCode: "450000", forecastAreaName: "宮崎県" },
	{ forecastAreaCode: "460100", forecastAreaName: "鹿児島県" },
	{ forecastAreaCode: "471000", forecastAreaName: "沖縄県" },
	{ forecastAreaCode: "472000", forecastAreaName: "大東島地方" },
	{ forecastAreaCode: "473000", forecastAreaName: "宮古島地方" },
	{ forecastAreaCode: "474000", forecastAreaName: "八重山地方" },
];

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

	private requestUrl(foreCastArea: JMA_ForecastArea): string {
		return `https://www.jma.go.jp/bosai/forecast/data/forecast/${foreCastArea.forecastAreaCode}.json`;
	}

	private async request(
		foreCastArea: JMA_ForecastArea
	): Promise<JMA_WeatherResponse[]> {
		const response = await fetch(this.requestUrl(foreCastArea));
		return (await response.json()) as JMA_WeatherResponse[];
	}

	// 最高気温と最低気温を取得し、テキストを返す関数
	public async getWeatherText(
		foreCastArea: JMA_ForecastArea
	): Promise<string> {
		const response = this.request(foreCastArea);
		return response.then((value) => {
			console.log("value", value);
			const weather = value[0];
			weather.timeSeries.forEach((timeSeries) => {
				timeSeries.areas.forEach((area) => {
					console.log("area", area);
				});
			});
			const weatherText = "";
			return weatherText;
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
