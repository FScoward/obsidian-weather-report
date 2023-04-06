export interface City {
    prefTitle: string;
    cityTitle: string;
    cityCode: string;
}

interface Weather {
    title: string;
    link: string;
    description: {
        text: string;
    };
    forecasts: {
        date: string;
        dateLabel: string;
        telop: string;
        detail: {
            weather: string;
            wind: string;
            wave: string;
        };
        temperature: {
            min: {
                celsius: string | null;
                fahrenheit: string | null;
            };
            max: {
                celsius: string | null;
                fahrenheit: string | null;
            };
        };
        chanceOfRain: {
            T00_06: string;
            T06_12: string;
            T12_18: string;
            T18_24: string;
        };
        image: {
            title: string;
            url: string;
            width: number;
            height: number;
        };
    }[];
    location: {
        area: string;
        prefecture: string;
        district: string;
        city: string;
    };
    copyright: {
        title: string;
        link: string;
        image: {
            title: string;
            link: string;
            url: string;
            width: number;
            height: number;
        };
        provider: {
            link: string;
            name: string;
            note: string;
        }[];
    };
}

export class Tsukumijima {
    private static readonly BASE_URL: string = 'https://weather.tsukumijima.net/api/forecast';
    /**
     * https://weather.tsukumijima.net/primary_area.xml を参考にして,
     * City(
     *   prefTitle = '東京都'
     *   cityTitle = '東京'
     *   cityCode = '130010'
     * )
     * の形で、cityCodeの小さい順に北海道から順に3つずつ定義する。
     * 3つなければ1つでも2つでも良い。
     */
    public static readonly CITIES: City[] = [
        { prefTitle: '北海道', cityTitle: '札幌', cityCode: '011000' },
        { prefTitle: '北海道', cityTitle: '函館', cityCode: '012010' },
        { prefTitle: '北海道', cityTitle: '旭川', cityCode: '012020' },
        { prefTitle: '青森県', cityTitle: '青森', cityCode: '020010' },
        { prefTitle: '青森県', cityTitle: 'むつ', cityCode: '020020' },
        { prefTitle: '青森県', cityTitle: '八戸', cityCode: '020030' },
        { prefTitle: '岩手県', cityTitle: '盛岡', cityCode: '030010' },
        { prefTitle: '岩手県', cityTitle: '宮古', cityCode: '030020' },
        { prefTitle: '岩手県', cityTitle: '大船渡', cityCode: '030030' },
        { prefTitle: '宮城県', cityTitle: '仙台', cityCode: '040010' },
        { prefTitle: '宮城県', cityTitle: '白石', cityCode: '040020' },
        { prefTitle: '秋田県', cityTitle: '秋田', cityCode: '050010' },
        { prefTitle: '秋田県', cityTitle: '横手', cityCode: '050020' },
        { prefTitle: '秋田県', cityTitle: '鹿角', cityCode: '050030' },
        { prefTitle: '山形県', cityTitle: '山形', cityCode: '060010' },
        { prefTitle: '山形県', cityTitle: '米沢', cityCode: '060020' },
        { prefTitle: '山形県', cityTitle: '酒田', cityCode: '060030' },
        { prefTitle: '福島県', cityTitle: '福島', cityCode: '070010' },
        { prefTitle: '福島県', cityTitle: '小名浜', cityCode: '070020' },
        { prefTitle: '福島県', cityTitle: '若松', cityCode: '070030' },
        { prefTitle: '茨城県', cityTitle: '水戸', cityCode: '080010' },
        { prefTitle: '茨城県', cityTitle: '土浦', cityCode: '080020' },
        { prefTitle: '茨城県', cityTitle: '宇都宮', cityCode: '080030' },
        { prefTitle: '栃木県', cityTitle: '宇都宮', cityCode: '090010' },
        { prefTitle: '栃木県', cityTitle: '大田原', cityCode: '090020' },
        { prefTitle: '栃木県', cityTitle: '前橋', cityCode: '090030' },
        { prefTitle: '群馬県', cityTitle: '前橋', cityCode: '100010' },
        { prefTitle: '群馬県', cityTitle: 'みなかみ', cityCode: '100020' },
        { prefTitle: '埼玉県', cityTitle: 'さいたま', cityCode: '110010' },
        { prefTitle: '埼玉県', cityTitle: '熊谷', cityCode: '110020' },
        { prefTitle: '埼玉県', cityTitle: '秩父', cityCode: '110030' },
        { prefTitle: '千葉県', cityTitle: '千葉', cityCode: '120010' },
        { prefTitle: '千葉県', cityTitle: '銚子', cityCode: '120020' },
        { prefTitle: '千葉県', cityTitle: '館山', cityCode: '120030' },
        { prefTitle: '東京都', cityTitle: '東京', cityCode: '130010' },
        { prefTitle: '東京都', cityTitle: '大島', cityCode: '130020' },
        { prefTitle: '東京都', cityTitle: '八丈島', cityCode: '130030' },
        { prefTitle: '神奈川県', cityTitle: '横浜', cityCode: '140010' },
        { prefTitle: '神奈川県', cityTitle: '小田原', cityCode: '140020' },
        { prefTitle: '神奈川県', cityTitle: '大磯', cityCode: '140030' },
        { prefTitle: '新潟県', cityTitle: '新潟', cityCode: '150010' },
        { prefTitle: '新潟県', cityTitle: '長岡', cityCode: '150020' },
        { prefTitle: '新潟県', cityTitle: '高田', cityCode: '150030' },
        { prefTitle: '富山県', cityTitle: '富山', cityCode: '160010' },
        { prefTitle: '富山県', cityTitle: '伏木', cityCode: '160020' },
        { prefTitle: '石川県', cityTitle: '金沢', cityCode: '170010' },
        { prefTitle: '石川県', cityTitle: '輪島', cityCode: '170020' },
        { prefTitle: '福井県', cityTitle: '福井', cityCode: '180010' },
        { prefTitle: '福井県', cityTitle: '敦賀', cityCode: '180020' },
        { prefTitle: '山梨県', cityTitle: '甲府', cityCode: '190010' },
        { prefTitle: '山梨県', cityTitle: '河口湖', cityCode: '190020' },
        { prefTitle: '長野県', cityTitle: '長野', cityCode: '200010' },
        { prefTitle: '長野県', cityTitle: '松本', cityCode: '200020' },
        { prefTitle: '長野県', cityTitle: '飯田', cityCode: '200030' },
        { prefTitle: '岐阜県', cityTitle: '岐阜', cityCode: '210010' },
        { prefTitle: '岐阜県', cityTitle: '高山', cityCode: '210020' },
        { prefTitle: '静岡県', cityTitle: '静岡', cityCode: '220010' },
        { prefTitle: '静岡県', cityTitle: '網代', cityCode: '220020' },
        { prefTitle: '静岡県', cityTitle: '三島', cityCode: '220030' },
        { prefTitle: '愛知県', cityTitle: '名古屋', cityCode: '230010' },
        { prefTitle: '愛知県', cityTitle: '豊橋', cityCode: '230020' },
        { prefTitle: '三重県', cityTitle: '津', cityCode: '240010' },
        { prefTitle: '三重県', cityTitle: '尾鷲', cityCode: '240020' },
        { prefTitle: '三重県', cityTitle: '伊勢', cityCode: '240030' },
        { prefTitle: '滋賀県', cityTitle: '大津', cityCode: '250010' },
        { prefTitle: '滋賀県', cityTitle: '彦根', cityCode: '250020' },
        { prefTitle: '京都府', cityTitle: '京都', cityCode: '260010' },
        { prefTitle: '京都府', cityTitle: '舞鶴', cityCode: '260020' },
        { prefTitle: '大阪府', cityTitle: '大阪', cityCode: '270000' },
        { prefTitle: '大阪府', cityTitle: '堺', cityCode: '270010' },
        { prefTitle: '大阪府', cityTitle: '岸和田', cityCode: '270020' },
        { prefTitle: '大阪府', cityTitle: '豊中', cityCode: '270030' },
        { prefTitle: '兵庫県', cityTitle: '神戸', cityCode: '280010' },
        { prefTitle: '兵庫県', cityTitle: '豊岡', cityCode: '280020' },
        { prefTitle: '兵庫県', cityTitle: '尼崎', cityCode: '280030' },
        { prefTitle: '奈良県', cityTitle: '奈良', cityCode: '290010' },
        { prefTitle: '奈良県', cityTitle: '風屋', cityCode: '290020' },
        { prefTitle: '和歌山県', cityTitle: '和歌山', cityCode: '300010' },
        { prefTitle: '和歌山県', cityTitle: '潮岬', cityCode: '300020' },
        { prefTitle: '鳥取県', cityTitle: '鳥取', cityCode: '310010' },
        { prefTitle: '鳥取県', cityTitle: '米子', cityCode: '310020' },
        { prefTitle: '鳥取県', cityTitle: '松江', cityCode: '310030' },
        { prefTitle: '岡山県', cityTitle: '岡山', cityCode: '320010' },
        { prefTitle: '岡山県', cityTitle: '津山', cityCode: '320020' },
        { prefTitle: '広島県', cityTitle: '広島', cityCode: '330010' },
        { prefTitle: '広島県', cityTitle: '呉', cityCode: '330020' },
        { prefTitle: '山口県', cityTitle: '下関', cityCode: '340010' },
        { prefTitle: '山口県', cityTitle: '山口', cityCode: '340020' },
        { prefTitle: '山口県', cityTitle: '柳井', cityCode: '340030' },
        { prefTitle: '徳島県', cityTitle: '徳島', cityCode: '350010' },
        { prefTitle: '徳島県', cityTitle: '日和佐', cityCode: '350020' },
        { prefTitle: '香川県', cityTitle: '高松', cityCode: '360010' },
        { prefTitle: '香川県', cityTitle: '丸亀', cityCode: '360020' },
        { prefTitle: '愛媛県', cityTitle: '松山', cityCode: '370010' },
        { prefTitle: '愛媛県', cityTitle: '新居浜', cityCode: '370020' },
        { prefTitle: '高知県', cityTitle: '高知', cityCode: '380010' },
        { prefTitle: '高知県', cityTitle: '室戸', cityCode: '380020' },
        { prefTitle: '福岡県', cityTitle: '福岡', cityCode: '390010' },
        { prefTitle: '福岡県', cityTitle: '八幡', cityCode: '390020' },
        { prefTitle: '福岡県', cityTitle: '飯塚', cityCode: '390030' },
        { prefTitle: '佐賀県', cityTitle: '佐賀', cityCode: '400010' },
        { prefTitle: '佐賀県', cityTitle: '伊万里', cityCode: '400020' },
        { prefTitle: '長崎県', cityTitle: '長崎', cityCode: '410010' },
        { prefTitle: '長崎県', cityTitle: '佐世保', cityCode: '410020' },
        { prefTitle: '熊本県', cityTitle: '熊本', cityCode: '420010' },
        { prefTitle: '熊本県', cityTitle: '阿蘇乙姫', cityCode: '420020' },
        { prefTitle: '大分県', cityTitle: '大分', cityCode: '430010' },
        { prefTitle: '大分県', cityTitle: '中津', cityCode: '430020' },
        { prefTitle: '宮崎県', cityTitle: '宮崎', cityCode: '440010' },
        { prefTitle: '宮崎県', cityTitle: '延岡', cityCode: '440020' },
        { prefTitle: '鹿児島県', cityTitle: '鹿児島', cityCode: '450010' },
        { prefTitle: '鹿児島県', cityTitle: '鹿屋', cityCode: '450020' },
        { prefTitle: '鹿児島県', cityTitle: '種子島', cityCode: '450030' },
        { prefTitle: '沖縄県', cityTitle: '那覇', cityCode: '460010' },
        { prefTitle: '沖縄県', cityTitle: '名護', cityCode: '460020' },
        { prefTitle: '沖縄県', cityTitle: '久米島', cityCode: '460030'}
    ];

    // リクエストurlの生成
    private requestUrl(city: City) {
        return 'https://weather.tsukumijima.net/api/forecast?city=' + city.cityCode;
    }

    private async getWeatherData(city: City): Promise<Weather> {
        const url = this.requestUrl(city);
        const response = await fetch(url);
        const json = await response.json();
        return json as Weather;
    }

    // 最高気温と最低気温を表示するテキストを返す関数
    async getTempText(city: City): Promise<string> {
        return this.getWeatherData(city).then((weatherJson) => {
            const tempText = city.cityTitle + 'の最高気温は' + weatherJson.forecasts[0].temperature.max.celsius + '度、最低気温は' + weatherJson.forecasts[0].temperature.min.celsius + '度です。';
            return tempText;
        });
    }
    
}