// トピック定義（色とラベル）
const TOPICS = {
    politics: { label: '政治', color: '#e74c3c' },
    economy: { label: '経済', color: '#3498db' },
    society: { label: '社会', color: '#2ecc71' },
    international: { label: '国際', color: '#9b59b6' },
    technology: { label: 'テクノロジー', color: '#f39c12' },
    environment: { label: '環境', color: '#1abc9c' }
};

// モックニュース記事データ（UMAP後の2D座標をシミュレート）
const ARTICLES = [
    // 政治クラスタ
    {
        id: 1,
        title: '岸田首相、経済対策の追加策を発表',
        source: '日本経済新聞',
        topic: 'politics',
        x: 0.15,
        y: 0.25,
        url: '#'
    },
    {
        id: 2,
        title: '野党、政治資金規正法改正案を提出',
        source: '朝日新聞',
        topic: 'politics',
        x: 0.12,
        y: 0.32,
        url: '#'
    },
    {
        id: 3,
        title: '地方選挙、投票率低下の懸念広がる',
        source: '毎日新聞',
        topic: 'politics',
        x: 0.18,
        y: 0.28,
        url: '#'
    },
    {
        id: 4,
        title: '憲法改正議論、与野党で立場鮮明に',
        source: '読売新聞',
        topic: 'politics',
        x: 0.22,
        y: 0.22,
        url: '#'
    },
    {
        id: 5,
        title: '若者の政治参加促進へ新施策',
        source: 'NHK',
        topic: 'politics',
        x: 0.08,
        y: 0.35,
        url: '#'
    },

    // 経済クラスタ
    {
        id: 6,
        title: '日経平均、4万円台回復の見通し',
        source: '日本経済新聞',
        topic: 'economy',
        x: 0.75,
        y: 0.20,
        url: '#'
    },
    {
        id: 7,
        title: '円安進行、輸出企業に追い風',
        source: 'Bloomberg',
        topic: 'economy',
        x: 0.82,
        y: 0.25,
        url: '#'
    },
    {
        id: 8,
        title: 'スタートアップ投資、過去最高を更新',
        source: 'TechCrunch Japan',
        topic: 'economy',
        x: 0.70,
        y: 0.30,
        url: '#'
    },
    {
        id: 9,
        title: '物価高騰、家計への影響深刻化',
        source: '毎日新聞',
        topic: 'economy',
        x: 0.78,
        y: 0.15,
        url: '#'
    },
    {
        id: 10,
        title: '日銀、金融政策の修正を検討',
        source: 'ロイター',
        topic: 'economy',
        x: 0.85,
        y: 0.22,
        url: '#'
    },

    // 社会クラスタ
    {
        id: 11,
        title: '少子化対策、自治体の取り組み加速',
        source: '朝日新聞',
        topic: 'society',
        x: 0.45,
        y: 0.75,
        url: '#'
    },
    {
        id: 12,
        title: '働き方改革、テレワーク定着の課題',
        source: '東洋経済',
        topic: 'society',
        x: 0.50,
        y: 0.80,
        url: '#'
    },
    {
        id: 13,
        title: '高齢者の孤独死、都市部で増加傾向',
        source: 'NHK',
        topic: 'society',
        x: 0.40,
        y: 0.72,
        url: '#'
    },
    {
        id: 14,
        title: '教育格差、コロナ禍で拡大の懸念',
        source: '読売新聞',
        topic: 'society',
        x: 0.52,
        y: 0.68,
        url: '#'
    },
    {
        id: 15,
        title: 'SNS誹謗中傷、法整備の議論進む',
        source: '産経新聞',
        topic: 'society',
        x: 0.48,
        y: 0.85,
        url: '#'
    },

    // 国際クラスタ
    {
        id: 16,
        title: '米中関係、緊張緩和の兆し',
        source: 'CNN Japan',
        topic: 'international',
        x: 0.20,
        y: 0.70,
        url: '#'
    },
    {
        id: 17,
        title: 'ウクライナ情勢、停戦交渉の行方',
        source: 'BBC Japan',
        topic: 'international',
        x: 0.15,
        y: 0.78,
        url: '#'
    },
    {
        id: 18,
        title: 'G7サミット、気候変動対策で合意',
        source: '共同通信',
        topic: 'international',
        x: 0.25,
        y: 0.65,
        url: '#'
    },
    {
        id: 19,
        title: '日韓関係改善、首脳会談実現へ',
        source: '時事通信',
        topic: 'international',
        x: 0.18,
        y: 0.82,
        url: '#'
    },
    {
        id: 20,
        title: '中東情勢、人道危機への懸念高まる',
        source: 'Al Jazeera',
        topic: 'international',
        x: 0.28,
        y: 0.75,
        url: '#'
    },

    // テクノロジークラスタ
    {
        id: 21,
        title: '生成AI、ビジネス活用が本格化',
        source: 'ITmedia',
        topic: 'technology',
        x: 0.80,
        y: 0.70,
        url: '#'
    },
    {
        id: 22,
        title: '半導体不足、国内生産強化へ',
        source: '日経クロステック',
        topic: 'technology',
        x: 0.75,
        y: 0.65,
        url: '#'
    },
    {
        id: 23,
        title: '量子コンピュータ、実用化に前進',
        source: 'Wired Japan',
        topic: 'technology',
        x: 0.85,
        y: 0.75,
        url: '#'
    },
    {
        id: 24,
        title: 'サイバーセキュリティ、企業の対策急務',
        source: 'ZDNet Japan',
        topic: 'technology',
        x: 0.72,
        y: 0.72,
        url: '#'
    },
    {
        id: 25,
        title: '自動運転技術、法整備の課題浮上',
        source: 'Impress Watch',
        topic: 'technology',
        x: 0.78,
        y: 0.80,
        url: '#'
    },

    // 環境クラスタ
    {
        id: 26,
        title: 'カーボンニュートラル、企業の取り組み加速',
        source: '日本経済新聞',
        topic: 'environment',
        x: 0.50,
        y: 0.25,
        url: '#'
    },
    {
        id: 27,
        title: '再生可能エネルギー、導入拡大の課題',
        source: '朝日新聞',
        topic: 'environment',
        x: 0.55,
        y: 0.30,
        url: '#'
    },
    {
        id: 28,
        title: 'プラスチック削減、消費者意識に変化',
        source: '毎日新聞',
        topic: 'environment',
        x: 0.45,
        y: 0.32,
        url: '#'
    },
    {
        id: 29,
        title: '気候変動、農業への影響深刻化',
        source: 'NHK',
        topic: 'environment',
        x: 0.52,
        y: 0.18,
        url: '#'
    },
    {
        id: 30,
        title: 'EV普及、インフラ整備が鍵',
        source: '東洋経済',
        topic: 'environment',
        x: 0.58,
        y: 0.22,
        url: '#'
    }
];
