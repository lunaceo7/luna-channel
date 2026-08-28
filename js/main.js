/* ==============================================================
   LUNAチャンネル — main.js
   -----------------------------------------------------------------
   このファイルの上部 [1. DATA] に、講師とセミナーの情報をすべて
   まとめています。今後 AI に「講師を追加して」「セミナーを追加して」
   と依頼する場合は、この SPEAKERS / SEMINARS 配列に
   オブジェクトを1件追加するだけで、トップページ・一覧・詳細ページ
   すべてに自動反映されます。

   [2. UTIL]    共通ヘルパー関数
   [3. RENDER]  カード/一覧などのHTML生成関数
   [4. PAGES]   各ページ(body[data-page])ごとの初期化処理
   [5. INIT]    起動処理(ヘッダー・年月表記など全ページ共通)
   ============================================================== */


/* ==============================================================
   1. DATA
   ============================================================== */

/**
 * 講師データ
 * id            : 他ページから参照するための一意なID(半角英数・ハイフン)
 * name          : サイト上に表示する名前(講師表記名)
 * role          : 肩書き・専門分野(1行)
 * org           : 所属・経歴の一言
 * tags          : 一覧カードに表示するタグ(3つ程度推奨)
 * bio           : 詳細ページ用の紹介文(配列 = 段落ごと)
 * facts         : 詳細ページの数字ブロック(0〜3個)
 * since         : LUNAチャンネルでの活動開始年
 */
const SPEAKERS = [
  {
    id: "keita-kikuchi",
    isHost: true,
    name: "ルナCEO",
    enName: "Luna CEO",
    role: "LUNAチャンネル代表 / AI×占い×収益化教育",
    org: "合同会社ルナマーケティング 代表",
    tags: ["AI活用", "占い×AI", "収益化教育"],
    bio: [
      "食品業界(スーパー・仲卸・輸入商社)で15年にわたり営業・バイヤーを務めたのち、2023年8月に独立。同年6月にAIと出会い、以降「AI×占い」を軸とした収益化教育を専門としている。",
      "Udemyでは占い×AIをテーマにした講座を21講座公開し、受講生は2,500名を超える。週次のZoomセミナーは開催回数47回を超え、各分野の専門家を招いたジョイントセミナーも継続的に開催している。",
      "アドラー心理学の共同体感覚や、行動経済学におけるプロスペクト理論をベースにした「非操作的な商売」を経営哲学として掲げている。"
    ],
    facts: [
      { label: "Udemy講座数", val: "21講座" },
      { label: "累計受講生", val: "2,500名+" },
      { label: "セミナー開催", val: "47回+" }
    ],
    since: "2023"
  },
  {
    id: "cakeman",
    name: "ケーキマン",
    enName: "Cakeman",
    alias: "Or Matok／オル・マトク",
    photo: "images/cakeman.jpg",
    role: "大手企業でのマネジメント経験と、AI・テクノロジーへの知見を持つ実践型ゲスト講師",
    org: "Microsoft・Toyota出身",
    tags: ["AI・テクノロジー", "ビジネス", "キャリア"],
    bio: [
      "Microsoftでマネージャーを経験し、TOYOTAではPR動画の制作にも携わった経験を持つ。",
      "LUNAチャンネルでは、AIをはじめとしたテクノロジー領域に加え、これまでのビジネス・キャリア経験を生かしたテーマで登壇。AIだけに限定せず、企業での経験とテクノロジーの知見を組み合わせた視点から、実践的なテーマを扱うゲスト講師。"
    ],
    facts: [
      { label: "登壇形式", val: "月例ゲスト" },
      { label: "経歴", val: "Microsoft・Toyota" }
    ],
    since: "2026"
  },
  {
    id: "shino-aotsuki",
    name: "蒼月 しの",
    enName: "Shino Aotsuki",
    role: "ジョイントセミナー講師",
    org: "「事実と解釈」講座主宰",
    tags: ["事実と解釈", "マインドセット", "対話"],
    bio: [
      "「事実と解釈を分けて捉える」という思考法をテーマに、セミナーや講座を展開。物事の捉え方を整理することで、感情に振り回されない意思決定を支援している。",
      "LUNAチャンネルとはジョイントセミナーという形で協業し、無料Zoomセミナーなどを共同開催している。"
    ],
    facts: [
      { label: "登壇テーマ", val: "事実と解釈" }
    ],
    since: "2026"
  },
  {
    id: "yasuo-kurihara",
    name: "栗原靖夫さん",
    enName: "Yasuo Kurihara",
    photo: "images/kurihara.jpg",
    role: "プロ占い師",
    org: "",
    tags: ["占い", "四柱推命", "九星気学", "タロットカード", "易", "占い師としての鑑定", "占い師の仕事設計", "占い師の差別化"],
    bio: [
      "累計8,000人を鑑定してきたプロ占い師。",
      "占いの実践経験をもとに、占い師の仕事・集客・鑑定のあり方について発信。"
    ],
    facts: [
      { label: "鑑定実績", val: "累計8,000人" }
    ],
    since: "2026"
  },
  {
    id: "nagataki",
    name: "ながたきさん",
    photo: "images/nagataki.jpg",
    role: "Kindle出版・副業",
    org: "",
    tags: ["Kindle出版", "副業", "コンテンツ制作", "絵本制作", "ポイ活", "転売", "税金・確定申告"],
    bio: [
      "累計23冊を出版し、累計印税654万円を達成したKindle出版の実践者。",
      "企業・インフルエンサーとのコラボ出版も手掛け、Kindle出版をはじめ、コンテンツ制作や副業について幅広く発信。",
      "副業で月10万円超えを実現する実践者として、出版を入口としたコンテンツ制作や副業についてLUNAチャンネルで登壇。"
    ],
    facts: [
      { label: "出版実績", val: "累計23冊" },
      { label: "累計印税", val: "654万円" },
      { label: "副業実績", val: "月10万円超" }
    ],
    since: "2026"
  },
  {
    id: "ryuzaki",
    name: "竜崎悠さん",
    photo: "images/ryuzaki.png",
    photoFit: "cover",
    photoPosition: "center",
    role: "Webマーケティング・広告運用",
    org: "",
    tags: ["Webマーケティング", "広告運用", "プロモーション"],
    bio: [
      "累計5,000万円規模の広告運用、Meta広告による約4万件のリスト獲得、1回のプロモーションで1,000万円以上の売上を実現。",
      "Meta広告を中心とした広告運用から、リストマーケティング、公式LINE集客、プロモーション設計まで、Webマーケティングの実践領域を幅広く扱う。"
    ],
    facts: [
      { label: "広告運用", val: "累計5,000万円規模" },
      { label: "リスト獲得", val: "約4万件" },
      { label: "プロモーション", val: "1,000万円以上" }
    ],
    since: "2026"
  },
  {
    id: "nakayama",
    name: "中山陽子さん",
    photo: "images/nakayama.jpg",
    role: "LUNA受講生 → 登壇講師",
    org: "",
    tags: ["副業", "占い"],
    bio: [
      "ルナCEOの受講生として学び・実践した経験をもとに、副業占い師としての活動を展開。",
      "LUNAチャンネルでは、自身の実践経験をもとに「最初の1万円」をテーマとしたセミナーに登壇。"
    ],
    facts: [
      { label: "登壇", val: "第48回" },
      { label: "登録実績", val: "40名" }
    ],
    since: "2026"
  },
  {
    id: "hana",
    name: "hanaさん",
    role: "西洋占星術師",
    org: "",
    tags: ["西洋占星術", "AI", "占星術"],
    bio: [
      "西洋占星術を専門とし、YouTubeなどで西洋占星術をわかりやすく解説。寄り添い丁寧な相談対応にも定評がある。",
      "LUNAチャンネルでは、2025年12月からルナCEOとのコラボレーションで「西洋占星術×AI」セミナーに登壇。LUNAチャンネル初期から関わるコラボ講師の一人。"
    ],
    facts: [
      { label: "登壇", val: "2025/12/16・17" },
      { label: "テーマ", val: "西洋占星術×AI" }
    ],
    since: "2025"
  }
];

/**
 * セミナーデータ(1件 = 1回の開催記録、または「第1〜8回」のようなまとめ記録)
 * id           : 一意なID
 * episode      : 回数(数値、または "1〜8" のような範囲文字列)。回数が確認できない回は省略
 * title        : 公開用セミナータイトル
 * subtitle     : 補足コピー(任意)
 * date         : "YYYY-MM-DD"(ソート用。正確な日付が不明な期間はその範囲の開始日を入れ、dateLabelで表示を上書きする)
 * dateLabel    : 表示用の日付ラベル(任意。「2025年2月〜5月」のように単一の日付で表せない場合に使用)
 * sessionCount : このレコードが表す実際の開催回数(「第1〜8回」のようにまとめて1レコードにしている場合のみ指定。既定は1)
 * status       : "upcoming"(今後確定分) / "past"(開催済み) / "regular"(kind:"series"用)
 * category     : 分類タグ(絞り込みに使用)。実データから明確に判別できない回は "その他"
 * tags         : カード表示用の補助タグ(任意)
 * speakerId    : SPEAKERS に登録済みのプロフィールを持つ人物の場合のみ指定(カード上でリンク付きで表示される)
 * guestNote    : プロフィール未掲載のゲスト・元受講生などを紹介する場合のプレーンテキスト(リンクは作らない)
 * registration : 登録・参加人数など確認できている実績数字のみ(不明な回は省略)
 * applyUrl     : 申込ページの実URL(確認できている回のみ。詳細ページに申込ボタンとして表示)
 * desc         : 一覧カード用の短い概要。確認できていない回は省略してタイトルのみ表示する
 * longDesc     : 詳細ページ用の紹介文(配列 = 段落ごと)。確認できていない回は省略可
 *
 * 注意:このサイトは「実績を見せる」ことが目的のため、オープンチャット・
 * サブスク・コミュニティ・販売導線・クロージングに関する情報は一切
 * 記載しないこと。また、確認できていない情報(日付・人数・肩書き等)は
 * 推測で埋めず、フィールド自体を省略すること。
 */
const SEMINARS = [
  /* ---------------------------------------------------------------
     開催予定(status: "upcoming")
     タイトル・概要が確認できていない回は、推測で埋めず
     「セミナー開催予定」+ guestNote(登壇予定者)のみ表示する。
     過去実績(status:"past")とは別ブロックとして管理し、
     pastSeminars() / pastSeminarsChronological() には含まれない。
     --------------------------------------------------------------- */
  {
    id: "u2026-08-31",
    kind: "event",
    title: "セミナー開催予定",
    speakerId: "cakeman",
    guestNote: "共同登壇:YOSUGAさん",
    date: "2026-08-31",
    status: "upcoming",
    category: "その他",
  },
  {
    id: "u2026-09-03",
    kind: "event",
    title: "Kindleセミナー＋副業多数",
    speakerId: "nagataki",
    date: "2026-09-03",
    status: "upcoming",
    category: "コンテンツ制作",
    tags: ["Kindle", "絵本制作", "ポイ活", "転売ノウハウ", "税金", "確定申告"],
    desc: "Kindle出版・絵本制作・ポイ活・転売ノウハウ・税金/確定申告など、幅広いテーマを扱う予定のセミナー。",
  },
  {
    id: "u2026-09-18",
    kind: "event",
    title: "ゼロから始められる 集客・マーケティング実践講座",
    speakerId: "ryuzaki",
    date: "2026-09-18",
    status: "upcoming",
    category: "マーケティング・集客",
    desc: "集客・マーケティングをテーマに、Webマーケティングの実践について扱うセミナー。Meta広告、リストマーケティング、公式LINE集客、プロモーション設計など、竜崎悠さんの専門領域を踏まえた内容。",
    applyUrl: "https://protagonist.jp/p/r/6cnbbtIR",
  },
  {
    id: "u2026-09-24",
    kind: "event",
    title: "セミナー開催予定",
    speakerId: "cakeman",
    date: "2026-09-24",
    status: "upcoming",
    category: "その他",
  },
  {
    id: "u2026-10-01",
    kind: "event",
    title: "占い師の仕事を全部分解してみる",
    speakerId: "yasuo-kurihara",
    date: "2026-10-01",
    status: "upcoming",
    category: "その他",
  },

  /* ---------------------------------------------------------------
     過去セミナー実績(status: "past")— 第1回〜第49回、2026年7月17日・30日・31日
     --------------------------------------------------------------- */
  {
    id: "s01-08",
    kind: "event",
    episode: "1〜8",
    title: "Udemyセミナーシリーズ(計8回)",
    date: "2025-02-01",
    dateLabel: "2025年2月〜5月",
    status: "past",
    category: "コンテンツ制作",
    sessionCount: 8,
  },
  {
    id: "s09",
    kind: "event",
    episode: 9,
    title: "Udemy勉強会:自動収入と爆速講座作成",
    date: "2025-05-22",
    status: "past",
    category: "コンテンツ制作",
  },
  {
    id: "s10",
    kind: "event",
    episode: 10,
    title: "AIが講座を作る時代へ ──1時間で収益化までの仕組み公開",
    date: "2025-06-11",
    status: "past",
    category: "AI・生成AI",
  },
  {
    id: "s11",
    kind: "event",
    episode: 11,
    title: "AI×自己資源から未来を構築するセミナー",
    date: "2025-06-26",
    status: "past",
    category: "AI・生成AI",
  },
  {
    id: "s12",
    kind: "event",
    episode: 12,
    title: "LUNA CEO式:ゼロから講座を広げるAI×実践講座",
    speakerId: "keita-kikuchi",
    date: "2025-06-28",
    status: "past",
    category: "AI・生成AI",
  },
  {
    id: "s13",
    kind: "event",
    episode: 13,
    title: "AI活用セミナー",
    date: "2025-06-30",
    status: "past",
    category: "AI・生成AI",
  },
  {
    id: "s14",
    kind: "event",
    episode: 14,
    title: "AI動画作成(Vrew)＆B型作業所外注＆ストアカ活用セミナー",
    date: "2025-07-22",
    status: "past",
    category: "AI・生成AI",
  },
  {
    id: "s15",
    kind: "event",
    episode: 15,
    title: "音声収録セミナー(実演付き)",
    date: "2025-08-01",
    status: "past",
    category: "コンテンツ制作",
  },
  {
    id: "s16",
    kind: "event",
    episode: 16,
    title: "プロフィール画像＆LINE公式セットアップ講座",
    guestNote: "元受講生が登壇(副業で月20万円以上達成者)",
    date: "2025-08-15",
    status: "past",
    category: "マーケティング・集客",
    registration: "登録14名",
  },
  {
    id: "s17",
    kind: "event",
    episode: 17,
    title: "ココナラ・プラチナランク量産計画",
    date: "2025-08-19",
    status: "past",
    category: "マーケティング・集客",
  },
  {
    id: "s18",
    kind: "event",
    episode: 18,
    title: "AI動画実演",
    guestNote: "元受講生が登壇(ココナラでプラチナランク・副業で月10万円以上達成者)",
    date: "2025-08-25",
    status: "past",
    category: "AI・生成AI",
  },
  {
    id: "s19",
    kind: "event",
    episode: 19,
    title: "AIタロット講座",
    guestNote: "元受講生が登壇(占いサービスで月10万円以上達成者)",
    date: "2025-09-03",
    status: "past",
    category: "AI×占い",
    registration: "登録12名",
  },
  {
    id: "s20",
    kind: "event",
    episode: 20,
    title: "AIで創る!タロット動画ワークショップ",
    guestNote: "元受講生が登壇(AIでコンテンツ作成、SNSで集客し、月10万円以上達成者)",
    date: "2025-09-17",
    status: "past",
    category: "AI×占い",
  },
  {
    id: "s21",
    kind: "event",
    episode: 21,
    title: "音声SNS／音声収録セミナー",
    date: "2025-09-22",
    status: "past",
    category: "コンテンツ制作",
  },
  {
    id: "s22",
    kind: "event",
    episode: 22,
    title: "AI動画セミナー",
    guestNote: "元受講生が登壇(占いサービスで月10万円以上達成者)",
    date: "2025-10-08",
    status: "past",
    category: "AI・生成AI",
  },
  {
    id: "s23",
    kind: "event",
    episode: 23,
    title: "ゼロから占い師で稼げるようになるには?",
    guestNote: "元受講生が登壇(占いサービスで月20万円以上達成者)",
    date: "2025-10-16",
    status: "past",
    category: "副業・収益化",
  },
  {
    id: "s24",
    kind: "event",
    episode: 24,
    title: "最先端!sora2 AI動画ワークショップ",
    guestNote: "元受講生が登壇(副業で月10万円以上達成者)",
    date: "2025-10-20",
    status: "past",
    category: "AI・生成AI",
  },
  {
    id: "s25",
    kind: "event",
    episode: 25,
    title: "1時間で出来る!はじめてのAI手相占い講座",
    guestNote: "元受講生が登壇(占いサービスで月10万円以上達成者)",
    date: "2025-10-24",
    status: "past",
    category: "AI×占い",
  },
  {
    id: "s26",
    kind: "event",
    episode: 26,
    title: "講師デビューで集客が変わる!Udemy新戦略",
    date: "2025-11-05",
    status: "past",
    category: "マーケティング・集客",
  },
  {
    id: "s27",
    kind: "event",
    episode: 27,
    title: "副業占いで稼いだ3人の直近事例",
    guestNote: "元受講生3名が登壇(3名とも占いサービスで月10万円以上達成者)",
    date: "2025-11-13",
    status: "past",
    category: "副業・収益化",
    registration: "登録29名",
  },
  {
    id: "s28",
    kind: "event",
    episode: 28,
    title: "AI動画実演【無料】",
    guestNote: "元受講生が登壇(副業で月10万円以上達成者)",
    date: "2025-11-17",
    status: "past",
    category: "AI・生成AI",
    registration: "登録54名",
  },
  {
    id: "s29",
    kind: "event",
    episode: 29,
    title: "AI占い＋SNS集客ツール設定講座",
    guestNote: "元受講生が登壇(副業占いで月10万円以上達成者)",
    date: "2025-11-25",
    status: "past",
    category: "AI×占い",
  },
  {
    id: "s30",
    kind: "event",
    episode: 30,
    title: "Notion無料セミナー",
    date: "2025-12-03",
    status: "past",
    category: "その他",
  },
  {
    id: "s31",
    kind: "event",
    episode: 31,
    title: "西洋占星術＋AIコラボセミナー",
    speakerId: "hana",
    date: "2025-12-16",
    status: "past",
    category: "AI×占い",
    registration: "登録16名",
  },
  {
    id: "s32",
    kind: "event",
    episode: 32,
    title: "西洋占星術＋AIコラボセミナー day2",
    speakerId: "hana",
    date: "2025-12-17",
    status: "past",
    category: "AI×占い",
    registration: "登録19名",
  },
  {
    id: "s33",
    kind: "event",
    episode: 33,
    title: "ボトルネック診断セミナー",
    date: "2026-01-16",
    status: "past",
    category: "その他",
  },
  {
    id: "s34",
    kind: "event",
    episode: 34,
    title: "月20時間の無駄が消えた。Notion中心設計の威力",
    date: "2026-01-23",
    status: "past",
    category: "その他",
  },
  {
    id: "s35",
    kind: "event",
    episode: 35,
    title: "自動集客セミナー｜NotebookLM×Gemini",
    guestNote: "ゲスト講師:あらやさん(占い師の集客支援専門家・作家)",
    date: "2026-01-26",
    status: "past",
    category: "マーケティング・集客",
  },
  {
    id: "s36",
    kind: "event",
    episode: 36,
    title: "漫画AI実演セミナー｜Nano Banana Pro",
    date: "2026-01-29",
    status: "past",
    category: "AI・生成AI",
  },
  {
    id: "s37",
    kind: "event",
    episode: 37,
    title: "ノウハウコレクター卒業セミナー｜3つのステップで脱・学び沼",
    date: "2026-02-04",
    status: "past",
    category: "思考・自己成長",
  },
  {
    id: "s38",
    kind: "event",
    episode: 38,
    title: "これ、普通に売れます(AI×マヤ暦)",
    date: "2026-04-09",
    status: "past",
    category: "AI×占い",
    registration: "登録31名",
  },
  {
    id: "s39",
    kind: "event",
    episode: 39,
    title: "なぜか選ばれる人の共通点",
    date: "2026-04-16",
    status: "past",
    category: "思考・自己成長",
    registration: "登録17名",
  },
  {
    id: "s40",
    kind: "event",
    episode: 40,
    title: "オンライン資産の作り方",
    date: "2026-04-23",
    status: "past",
    category: "副業・収益化",
    registration: "登録19名",
  },
  {
    id: "s41",
    kind: "event",
    episode: 41,
    title: "Udemyで2,500人集まるまでにやったこと・やめたこと",
    date: "2026-04-30",
    status: "past",
    category: "マーケティング・集客",
    registration: "登録17名",
  },
  {
    id: "s42",
    kind: "event",
    episode: 42,
    title: "1ヶ月で50人と会ってわかったこと、全部話します",
    date: "2026-05-07",
    status: "past",
    category: "マーケティング・集客",
    registration: "登録31名",
  },
  {
    id: "s43",
    kind: "event",
    episode: 43,
    title: "5分でAI動画が作れる｜元マイクロソフトマネージャーが教えます",
    speakerId: "cakeman",
    date: "2026-05-14",
    status: "past",
    category: "AI・生成AI",
    registration: "登録30名",
  },
  {
    id: "s44",
    kind: "event",
    episode: 44,
    title: "【オンライン集客】で差がつく理由",
    date: "2026-05-21",
    status: "past",
    category: "マーケティング・集客",
    registration: "登録17名",
  },
  {
    id: "s45",
    kind: "event",
    episode: 45,
    title: "ChatGPTだけじゃ足りない理由｜Claude Code × Google I/O 2026",
    speakerId: "cakeman",
    date: "2026-06-18",
    status: "past",
    category: "AI・生成AI",
    registration: "登録57名",
  },
  {
    id: "s46",
    kind: "event",
    episode: 46,
    title: "ビジネスも人間関係も劇的に軽くなる「事実」と「解釈」の思考整理術",
    speakerId: "shino-aotsuki",
    date: "2026-06-25",
    status: "past",
    category: "思考・自己成長",
    registration: "登録19名",
  },
  {
    id: "s47",
    kind: "event",
    episode: 47,
    title: "AIには視えない『運命の裏側』を読み解く。プロ占い師とAIを使いこなして最速でオンライン起業する方法",
    speakerId: "yasuo-kurihara",
    date: "2026-06-30",
    status: "past",
    category: "AI×占い",
    registration: "登録50名",
  },
  {
    id: "s48",
    kind: "event",
    episode: 48,
    title: "副業占い師が最初の1万円を稼ぐまでにやること、全部話します",
    speakerId: "nakayama",
    date: "2026-07-09",
    status: "past",
    category: "副業・収益化",
    registration: "登録40名",
  },
  {
    id: "s49",
    kind: "event",
    episode: 49,
    title: "夢の印税生活を目指しませんか?Kindle作家デビュー入門",
    speakerId: "nagataki",
    date: "2026-07-16",
    status: "past",
    category: "コンテンツ制作",
    registration: "登録31名",
  },
  {
    id: "golden-dawn-2",
    kind: "event",
    title: "ゴールデンドーン魔術入門 第2回",
    subtitle: "138年の秘密結社の奥義を、元エリートビジネスマンが解説",
    speakerId: "cakeman",
    date: "2026-07-17",
    status: "past",
    category: "スピリチュアル・秘教",
    registration: "参加者約17名",
    longDesc: [
      "講師はYOSUGAさん、そしてOr Matok(オル・マトク)名義でも登壇するケーキマン氏(Microsoft・Toyotaでのキャリアを持つ)。",
      "ゴールデンドーンの基礎、引き寄せ、タロット、数秘術、五芒星・六芒星、天使召喚、日常に隠された暗号などを、キャリア・人間関係・資産形成・目標達成といった実生活の視点とあわせて紹介した。",
      "論理と直感の両立という観点から、138年の歴史を持つ秘密結社の奥義を現代的に解説する内容となった。",
    ],
  },
  {
    id: "ai-mayoi-graduation",
    kind: "event",
    title: "AI迷子卒業セミナー",
    subtitle: "50代・60代からのAI活用。ChatGPTを「あなたの代わりに働く部下」にする方法",
    speakerId: "cakeman",
    date: "2026-07-30",
    status: "past",
    category: "AI・生成AI",
    registration: "登録約30名・当日20名以上参加",
    longDesc: [
      "50代・60代を中心としたAI初心者に向け、ChatGPT・Gemini・Claudeといった主要AIツールの使い分け、個人情報・セキュリティの注意点、AIエージェントの基礎までを整理したセミナー。",
      "登録は約30名、当日は20名以上が参加した。",
    ],
  },
  {
    id: "golden-dawn-3",
    kind: "event",
    title: "ゴールデンドーン魔術入門 第3回",
    subtitle: "【古代引き寄せ】秘密結社の儀式を今風に転換!実践する4つのステップ",
    speakerId: "cakeman",
    date: "2026-07-31",
    status: "past",
    category: "スピリチュアル・秘教",
    longDesc: [
      "講師はYOSUGAさん、そしてOr Matok(オル・マトク)名義でも登壇するケーキマン氏。第2回で紹介したゴールデンドーンの思想・体系を、現代の日常生活でどのように活用できるかを考える実践編として開催。",
      "ニオフィト儀式を題材に、時間帯・意識・イメージ・簡略化・日常への応用を紹介したほか、4・13・11・16・24・88といった数字を日付や行動、目標設定にどう活かすかを扱った。",
      "紙とボールペンを使った自己観察の方法や、ゴールデンドーンに関する英語・ヘブライ語・象徴的資料をAIで研究・整理する「解読補助」としてのAI活用法も紹介した。",
    ],
  },
  {
    id: "weekly-zoom-regular",
    kind: "series",
    title: "週次Zoomセミナー(レギュラー開催)",
    speakerId: "keita-kikuchi",
    time: "毎週開催",
    format: "Zoomオンライン開催",
    status: "regular",
    category: "AI×占い",
    tags: ["レギュラー開催"],
    desc: "2025年2月から毎週継続してきたレギュラーセミナー。上記の第1回〜第49回、および2026年7月17日・30日・31日の特別開催は、いずれもこのレギュラー開催枠の記録です。",
    longDesc: [
      "LUNAチャンネルの中核となるレギュラーセミナー。2025年2月の開始以来、AI活用・占い・副業・マーケティング・コンテンツ制作・思考法など幅広いテーマで毎週開催している。",
    ],
  },
];

/* ==============================================================
   2. UTIL
   ============================================================== */

const $  = (sel, scope = document) => scope.querySelector(sel);
const $$ = (sel, scope = document) => Array.from(scope.querySelectorAll(sel));

function getParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

function getSpeaker(id) {
  return SPEAKERS.find(s => s.id === id);
}

function hostSpeaker() {
  return SPEAKERS.find(s => s.isHost);
}

function guestSpeakers() {
  return SPEAKERS.filter(s => !s.isHost);
}

function formatDate(iso) {
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d)) return iso;
  const w = ["日", "月", "火", "水", "木", "金", "土"][d.getDay()];
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${w}）`;
}

function sortedSeminars() {
  return [...SEMINARS].sort((a, b) => new Date(a.date) - new Date(b.date));
}

function upcomingSeminars() {
  return sortedSeminars().filter(s => s.status === "upcoming");
}

function pastSeminars() {
  return sortedSeminars()
    .filter(s => s.status === "past")
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // 新しい順
}

function regularSeminars() {
  return SEMINARS.filter(s => s.status === "regular");
}

function latestSeminar() {
  // 直近に開催した(=最新の)個別セミナーを1件返す
  return pastSeminars()[0] || null;
}

/* ==============================================================
   3. RENDER — 部品生成
   ============================================================== */

function moonPhasesSVG(width = 220) {
  // シグネチャーモチーフ：三日月→満月→三日月 を極細ラインで表現
  return `
  <svg viewBox="0 0 220 32" width="${width}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <g fill="none" stroke="#B4903E" stroke-width="1">
      <circle cx="16" cy="16" r="8" stroke-dasharray="2 3" opacity="0.55"/>
      <path d="M44 8a8 8 0 0 1 0 16 6 6 0 0 0 0-16z" fill="#B4903E" stroke="none" opacity="0.75"/>
      <circle cx="76" cy="16" r="8" fill="#B4903E" stroke="none"/>
      <line x1="98" y1="16" x2="122" y2="16" stroke-dasharray="1 4" opacity="0.4"/>
      <circle cx="144" cy="16" r="8" fill="#B4903E" stroke="none"/>
      <path d="M176 8a8 8 0 0 0 0 16 6 6 0 0 1 0-16z" fill="#B4903E" stroke="none" opacity="0.75"/>
      <circle cx="204" cy="16" r="8" stroke-dasharray="2 3" opacity="0.55"/>
    </g>
  </svg>`;
}

function speakerInitial(name) {
  return name.replace(/\s/g, "").slice(0, 1);
}

function speakerChip(speakerId) {
  const sp = getSpeaker(speakerId);
  if (!sp) return "";
  return `
    <a href="speakers.html?id=${sp.id}" class="speaker-chip">
      <span class="avatar">${speakerInitial(sp.name)}</span>
      <span>${sp.name}</span>
    </a>`;
}

function displayDate(seminar) {
  return seminar.dateLabel || formatDate(seminar.date);
}

function episodeTag(seminar) {
  if (!seminar.episode) return "";
  return `<span class="tag navy">第${seminar.episode}回</span>`;
}

// 登壇者表示:プロフィールがある人(SPEAKERS)はリンク付きチップ、
// プロフィールのない人はプレーンテキスト(guestNote)で表示しリンクは作らない
function presenterBlock(seminar) {
  const parts = [];
  if (seminar.speakerId) parts.push(speakerChip(seminar.speakerId));
  if (seminar.guestNote) parts.push(`<span class="guest-note">${seminar.guestNote}</span>`);
  return parts.join(" ");
}

function statusTag(seminar) {
  if (seminar.status === "upcoming") return `<span class="tag gold">次回開催</span>`;
  if (seminar.status === "regular") return `<span class="tag navy">レギュラー開催</span>`;
  return `<span class="tag">開催終了</span>`;
}

function seminarCard(seminar) {
  return `
  <article class="card seminar-card">
    <div class="tag-row">
      ${statusTag(seminar)}
      ${episodeTag(seminar)}
      ${(seminar.tags || []).map(t => `<span class="tag">${t}</span>`).join("")}
    </div>
    <div class="date">${seminar.status === "regular" ? seminar.time : displayDate(seminar)}</div>
    <h3><a href="seminars.html?id=${seminar.id}">${seminar.title}</a></h3>
    ${seminar.desc ? `<p class="desc">${seminar.desc}</p>` : ""}
    ${seminar.registration ? `<div class="tag gold" style="margin-top:10px;display:inline-block;">${seminar.registration}</div>` : ""}
    <div class="meta">
      ${presenterBlock(seminar)}
      <a href="seminars.html?id=${seminar.id}" class="btn-arrow" style="color:var(--c-navy);margin-left:auto;">詳細を見る</a>
    </div>
  </article>`;
}

// 写真枠の中身:photoフィールドがあれば画像、なければイニシャル文字
// 写真枠の中身:photoフィールドがあれば画像、なければイニシャル文字
// photoFit / photoPosition で講師ごとに object-fit / object-position を指定可能
// (既定は "contain" = トリミングなし全体表示。人物写真で顔を大きく見せたい場合は
//  "cover" + photoPosition で調整する)
function speakerPhotoInner(sp) {
  if (!sp.photo) return `<span class="initial">${speakerInitial(sp.name)}</span>`;
  const fit = sp.photoFit || "contain";
  const pos = sp.photoPosition || "center";
  return `<img src="${sp.photo}" alt="${sp.name}" loading="lazy" style="object-fit:${fit};object-position:${pos};">`;
}

function speakerFeaturedCard(sp) {
  return `
  <article class="speaker-featured">
    <a href="speakers.html?id=${sp.id}"><div class="sf-photo">${speakerPhotoInner(sp)}</div></a>
    <div class="sf-body">
      <div class="sf-role">主宰 / ${sp.role}</div>
      <h3><a href="speakers.html?id=${sp.id}">${sp.name}</a></h3>
      ${sp.org ? `<p>${sp.org}</p>` : ""}
      <div class="link-row"><a href="speakers.html?id=${sp.id}" class="btn-arrow" style="color:var(--c-navy)">プロフィールを見る</a></div>
    </div>
  </article>`;
}

function speakerCard(sp) {
  return `
  <article class="card speaker-card">
    <a href="speakers.html?id=${sp.id}">
      <div class="photo">${speakerPhotoInner(sp)}</div>
    </a>
    <div class="body">
      <div class="role">${sp.role}</div>
      <h3><a href="speakers.html?id=${sp.id}">${sp.name}</a></h3>
      ${sp.org ? `<p>${sp.org}</p>` : ""}
      <div class="link-row">
        <a href="speakers.html?id=${sp.id}" class="btn-arrow">プロフィールを見る</a>
      </div>
    </div>
  </article>`;
}

/* ==============================================================
   4. PAGES — ページ別初期化
   ============================================================== */

function initIndexPage() {
  // 直近の開催実績(このサイトは実績紹介が目的のため、"申込"ではなく"直近の記録"を見せる)
  const latest = latestSeminar();
  const featuredEl = $("#featured-seminar");
  if (featuredEl) {
    if (latest) {
      const sp = getSpeaker(latest.speakerId);
      featuredEl.innerHTML = `
        <div class="fs-info">
          <div class="eyebrow">Recently Held</div>
          <div class="tag gold" style="margin-bottom:14px;display:inline-block;">${displayDate(latest)}</div>
          <h3>${latest.title}</h3>
          ${latest.desc ? `<p class="fs-desc">${latest.desc}</p>` : ""}
          <div class="fs-meta">
            ${sp ? `<div class="fs-meta-item"><div class="label">登壇</div><div class="val">${sp.name}</div></div>` : (latest.guestNote ? `<div class="fs-meta-item"><div class="label">登壇</div><div class="val">${latest.guestNote}</div></div>` : "")}
            <div class="fs-meta-item"><div class="label">形式</div><div class="val">${latest.format || "Zoomオンライン開催"}</div></div>
            ${latest.registration ? `<div class="fs-meta-item"><div class="label">参加実績</div><div class="val">${latest.registration}</div></div>` : ""}
          </div>
          <a href="seminars.html?id=${latest.id}" class="btn btn-gold btn-arrow">セミナー詳細を見る</a>
        </div>
        <div class="fs-visual">${moonPhasesSVG(200)}</div>`;
    } else {
      featuredEl.innerHTML = `<div class="empty-state">開催実績を準備中です。</div>`;
    }
  }

  // 最新セミナー(直近3件。上のfeaturedと重複しないよう2件目以降を表示)
  const latestEl = $("#latest-seminars");
  if (latestEl) {
    latestEl.innerHTML = pastSeminars().slice(1, 4).map(seminarCard).join("");
  }

  // 講師紹介:主宰を横長カードで、ゲスト講師を3カラムで表示(孤立カードを防ぐ)
  const hostEl = $("#index-speaker-host");
  if (hostEl) {
    const host = hostSpeaker();
    if (host) hostEl.innerHTML = speakerFeaturedCard(host);
  }
  const speakersEl = $("#index-speakers");
  if (speakersEl) {
    speakersEl.innerHTML = guestSpeakers().map(speakerCard).join("");
  }

  // 扱ってきたテーマ(実際のセミナーカテゴリから動的に生成)
  const themesEl = $("#theme-tags");
  if (themesEl) {
    const themes = [...new Set(pastSeminars().map(s => s.category))];
    themesEl.innerHTML = themes.map(t => `<span class="tag gold">${t}</span>`).join("");
  }

  // 実績サマリー(ヒーローは"ダイジェスト"に絞り、詳細は実績バンドに集約)
  setText("#stat-seminars", "50回以上");
  setText("#stat-since", "2025年2月〜");
}

function initSeminarsPage() {
  const detailId = getParam("id");
  const listView = $("#seminars-list-view");
  const detailView = $("#seminars-detail-view");

  if (detailId) {
    const seminar = SEMINARS.find(s => s.id === detailId);
    listView.style.display = "none";
    detailView.style.display = "block";
    renderSeminarDetail(seminar, detailView);
    return;
  }

  listView.style.display = "block";
  detailView.style.display = "none";

  const upcoming = upcomingSeminars();
  const regular = regularSeminars();
  const highlights = pastSeminars().slice(0, 6); // 代表的な実績(全件はarchive.htmlに掲載)

  const upcomingEl = $("#upcoming-seminars");
  if (upcomingEl) {
    upcomingEl.innerHTML = upcoming.length
      ? upcoming.map(seminarCard).join("")
      : `<div class="empty-state">現在、確定している開催予定はありません。</div>`;
  }

  const regularEl = $("#regular-series");
  if (regularEl) regularEl.innerHTML = regular.map(seminarCard).join("");

  const pastEl = $("#past-seminars-grid");
  if (pastEl) pastEl.innerHTML = highlights.map(seminarCard).join("");

  initFilterBar(highlights);
}

function renderSeminarDetail(seminar, container) {
  if (!seminar) {
    container.innerHTML = `<div class="container"><div class="empty-state">お探しのセミナーが見つかりませんでした。<br><a href="seminars.html" class="btn btn-small" style="margin-top:16px;">スケジュール一覧に戻る</a></div></div>`;
    return;
  }
  const sp = getSpeaker(seminar.speakerId);
  container.innerHTML = `
    <div class="container">
      <a href="seminars.html" class="back-link">スケジュール一覧に戻る</a>
      <div class="detail-hero" style="grid-template-columns: 1fr;">
        <div class="detail-info">
          <div class="detail-tags">${statusTag(seminar)}${episodeTag(seminar)}${(seminar.tags || []).map(t => `<span class="tag">${t}</span>`).join("")}</div>
          <h1>${seminar.title}</h1>
          ${seminar.subtitle ? `<p class="lead" style="color:var(--c-gold);font-family:var(--f-accent);font-style:italic;">${seminar.subtitle}</p>` : ""}
          ${seminar.desc ? `<p class="lead">${seminar.desc}</p>` : ""}
          ${(seminar.applyUrl && seminar.status === "upcoming") ? `<a href="${seminar.applyUrl}" target="_blank" rel="noopener" class="btn btn-primary btn-arrow" style="margin-bottom:28px;">お申し込みはこちら</a>` : ""}
          <div class="detail-facts">
            <div class="fact"><div class="label">開催日</div><div class="val" style="font-size:16px;">${seminar.status === "regular" ? seminar.time : displayDate(seminar)}</div></div>
            <div class="fact"><div class="label">形式</div><div class="val" style="font-size:16px;">${seminar.format || "Zoomオンライン開催"}</div></div>
            ${seminar.registration ? `<div class="fact"><div class="label">参加実績</div><div class="val" style="font-size:16px;">${seminar.registration}</div></div>` : ""}
            ${seminar.guestNote ? `<div class="fact"><div class="label">${sp ? "共同登壇" : "登壇"}</div><div class="val" style="font-size:16px;">${seminar.guestNote}</div></div>` : ""}
          </div>
        </div>
      </div>
      <div style="padding:48px 0;display:grid;grid-template-columns:1fr 300px;gap:56px;">
        ${seminar.longDesc ? `
        <div class="prose">
          <h2>セミナー概要</h2>
          ${seminar.longDesc.map(p => `<p>${p}</p>`).join("")}
        </div>` : `<div class="prose"><p style="color:var(--c-gray);">この回の詳細な記録は確認でき次第、追記します。</p></div>`}
        ${sp ? `
        <aside>
          <div class="card speaker-card">
            <div class="photo">${speakerPhotoInner(sp)}</div>
            <div class="body">
              <div class="role">登壇講師</div>
              <h3><a href="speakers.html?id=${sp.id}">${sp.name}</a></h3>
              <p>${sp.role}</p>
              <div class="link-row"><a href="speakers.html?id=${sp.id}" class="btn-arrow">プロフィールを見る</a></div>
            </div>
          </div>
        </aside>` : ""}
      </div>
    </div>`;
}

function initFilterBar(past) {
  const bar = $("#category-filter");
  if (!bar) return;
  const categories = ["すべて", ...new Set(past.map(s => s.category))];
  bar.innerHTML = categories.map((c, i) =>
    `<button class="filter-btn ${i === 0 ? "is-active" : ""}" data-cat="${c}">${c}</button>`
  ).join("");

  bar.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    $$(".filter-btn", bar).forEach(b => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    const cat = btn.dataset.cat;
    const filtered = cat === "すべて" ? past : past.filter(s => s.category === cat);
    $("#past-seminars-grid").innerHTML = filtered.length
      ? filtered.map(seminarCard).join("")
      : `<div class="empty-state">該当するセミナーがありません。</div>`;
  });
}

function initSpeakersPage() {
  const detailId = getParam("id");
  const listView = $("#speakers-list-view");
  const detailView = $("#speakers-detail-view");

  if (detailId) {
    const sp = getSpeaker(detailId);
    listView.style.display = "none";
    detailView.style.display = "block";
    renderSpeakerDetail(sp, detailView);
    return;
  }

  listView.style.display = "block";
  detailView.style.display = "none";

  const host = hostSpeaker();
  const hostEl = $("#speakers-host");
  if (hostEl && host) hostEl.innerHTML = speakerFeaturedCard(host);

  const gridEl = $("#speakers-grid");
  if (gridEl) gridEl.innerHTML = guestSpeakers().map(speakerCard).join("");
}

function renderSpeakerDetail(sp, container) {
  if (!sp) {
    container.innerHTML = `<div class="container"><div class="empty-state">お探しの講師が見つかりませんでした。<br><a href="speakers.html" class="btn btn-small" style="margin-top:16px;">講師一覧に戻る</a></div></div>`;
    return;
  }
  const talks = SEMINARS.filter(s => s.speakerId === sp.id);
  container.innerHTML = `
    <div class="container">
      <a href="speakers.html" class="back-link">講師一覧に戻る</a>
      <div class="detail-hero">
        <div class="detail-photo">${speakerPhotoInner(sp)}</div>
        <div class="detail-info">
          <div class="role">${sp.role}</div>
          <h1>${sp.name}</h1>
          ${sp.alias ? `<p style="color:var(--c-gray);font-size:13px;margin-top:-14px;margin-bottom:14px;">別名:${sp.alias}</p>` : ""}
          ${sp.org ? `<p class="lead">${sp.org}</p>` : ""}
          <div class="detail-tags">${sp.tags.map(t => `<span class="tag gold">${t}</span>`).join("")}</div>
          ${sp.facts.length ? `
          <div class="detail-facts">
            ${sp.facts.map(f => `<div class="fact"><div class="label">${f.label}</div><div class="val">${f.val}</div></div>`).join("")}
          </div>` : ""}
        </div>
      </div>
      <div style="padding:48px 0;">
        <div class="prose">
          <h2>プロフィール</h2>
          ${sp.bio.map(p => `<p>${p}</p>`).join("")}
        </div>
      </div>
      ${talks.length ? `
      <div style="padding-bottom:64px;">
        <div class="section-head"><h2>登壇セミナー</h2></div>
        <div class="grid grid-3">${talks.map(seminarCard).join("")}</div>
      </div>` : ""}
    </div>`;
}

// 全セミナー記録を開催日の昇順(古い順)に並べる(アーカイブページの「活動履歴」表示用)
function pastSeminarsChronological() {
  return [...SEMINARS]
    .filter(s => s.status === "past")
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

// 掲載セミナーの延べセッション数(第1〜8回のようにまとめて記録している回も1件として数える)
function totalSessionCount() {
  return SEMINARS
    .filter(s => s.status === "past")
    .reduce((sum, s) => sum + (s.sessionCount || 1), 0);
}

const MONTH_LABEL = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];

function timelineItemHTML(s) {
  const sp = getSpeaker(s.speakerId);
  const presenterLabel = sp ? sp.name : (s.guestNote || "");
  return `
    <div class="timeline-item">
      <div class="t-year">${episodeLabel(s)}</div>
      <div>
        <div class="t-date">${displayDate(s)}${presenterLabel ? ` ／ ${presenterLabel}` : ""}</div>
        <h3><a href="seminars.html?id=${s.id}">${s.title}</a></h3>
        ${s.subtitle ? `<p style="color:var(--c-gold);font-size:13.5px;margin-top:-4px;">${s.subtitle}</p>` : ""}
        ${s.desc ? `<p>${s.desc}</p>` : ""}
        <div class="t-tags">
          <span class="tag navy">${s.category}</span>
          ${(s.tags || []).map(t => `<span class="tag">${t}</span>`).join("")}
          ${s.registration ? `<span class="tag gold">${s.registration}</span>` : ""}
        </div>
      </div>
    </div>`;
}

function episodeLabel(s) {
  return s.episode ? `#${s.episode}` : "";
}

function renderArchiveTimeline(list) {
  const timelineEl = $("#archive-timeline");
  if (!timelineEl) return;
  if (!list.length) {
    timelineEl.innerHTML = `<div class="empty-state">該当するセミナーがありません。</div>`;
    return;
  }
  let html = "";
  let currentYear = null;
  const seenMonths = {};

  list.forEach(s => {
    const d = new Date(s.date + "T00:00:00");
    const year = d.getFullYear();
    const monthKey = `${year}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const monthLabel = `${year}年${MONTH_LABEL[d.getMonth()]}`;

    if (year !== currentYear) {
      if (currentYear !== null) html += `</div></div>`;
      html += `<div class="archive-year"><div class="archive-year-label">${year}年</div><div class="archive-year-body">`;
      currentYear = year;
    }
    if (!seenMonths[monthKey]) {
      seenMonths[monthKey] = true;
      html += `<div class="archive-month-label">${s.dateLabel ? s.dateLabel : monthLabel}</div>`;
    }
    html += timelineItemHTML(s);
  });
  if (currentYear !== null) html += `</div></div>`;
  timelineEl.innerHTML = html;
}

function initArchivePage() {
  const chronological = pastSeminarsChronological();
  renderArchiveTimeline(chronological);

  // カテゴリフィルター(該当するテーマのみタイムラインを絞り込む)
  const bar = $("#category-filter");
  if (bar) {
    const categories = ["すべて", ...new Set(chronological.map(s => s.category))];
    bar.innerHTML = categories.map((c, i) =>
      `<button class="filter-btn ${i === 0 ? "is-active" : ""}" data-cat="${c}">${c}</button>`
    ).join("");
    bar.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;
      $$(".filter-btn", bar).forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const cat = btn.dataset.cat;
      renderArchiveTimeline(cat === "すべて" ? chronological : chronological.filter(s => s.category === cat));
    });
  }

  setText("#archive-count", `${totalSessionCount()}回`);
}

function setText(sel, text) {
  const el = $(sel);
  if (el) el.textContent = text;
}

/* ==============================================================
   5. INIT — 全ページ共通
   ============================================================== */

function initHeader() {
  const toggle = $(".nav-toggle");
  const mobile = $(".nav-mobile");
  if (toggle && mobile) {
    toggle.addEventListener("click", () => {
      toggle.classList.toggle("is-open");
      mobile.classList.toggle("is-open");
    });
    $$(".nav-mobile a").forEach(a => a.addEventListener("click", () => {
      toggle.classList.remove("is-open");
      mobile.classList.remove("is-open");
    }));
  }

  // カレントページのナビをハイライト
  const page = document.body.dataset.page;
  $$(".nav-desktop a, .nav-mobile a").forEach(a => {
    if (a.dataset.nav === page) a.classList.add("is-active");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initHeader();

  const page = document.body.dataset.page;
  if (page === "index") initIndexPage();
  if (page === "seminars") initSeminarsPage();
  if (page === "speakers") initSpeakersPage();
  if (page === "archive") initArchivePage();

  $$(".moon-divider").forEach(el => { el.innerHTML = moonPhasesSVG(220); });

  const yearEl = $("#current-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
