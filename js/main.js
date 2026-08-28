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
 * name          : 氏名
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
    name: "菊地 啓太",
    enName: "Keita Kikuchi",
    role: "LUNAチャンネル代表 / AI×占い×収益化教育",
    org: "合同会社ルナマーケティング 代表",
    tags: ["AI活用", "占い×AI", "収益化教育"],
    bio: [
      "食品業界(スーパー・仲卸・輸入商社)で15年にわたり営業・バイヤーを務めたのち、2023年8月に独立。同年6月にAIと出会い、以降「AI×占い」を軸とした収益化教育を専門としている。",
      "Udemyでは占い×AIをテーマにした講座を21講座公開し、受講生は2,500名を超える。週次のZoomセミナーは開催回数47回を超え、個別コンサルティングやコミュニティ運営も行う。",
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
    id: "takatoshi-hioki",
    name: "日沖 貴年",
    enName: "Takatoshi Hioki",
    role: "月例セミナーゲスト / ITコンサルタント",
    org: "元Microsoft",
    tags: ["Claude Code", "AI活用", "ITコンサルティング"],
    bio: [
      "元Microsoftのキャリアを経て独立。企業のIT活用支援や生成AI導入コンサルティングを行う傍ら、LUNAチャンネルでは月例セミナーゲストとして登壇している。",
      "「Claude Code」をはじめとする最新の開発・業務効率化ツールを、専門知識のない人にも分かりやすく伝えるセミナーに定評がある。"
    ],
    facts: [
      { label: "登壇形式", val: "月例ゲスト" },
      { label: "専門領域", val: "生成AI導入" }
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
    name: "栗原 靖夫",
    enName: "Yasuo Kurihara",
    role: "占い×AI講師 / 鑑定士",
    org: "鑑定実績8,000件超",
    tags: ["占い", "鑑定", "AI活用"],
    bio: [
      "鑑定実績8,000件を超えるベテラン鑑定士。長年の対面鑑定で培った経験と、AIを組み合わせた新しい鑑定スタイルを提案している。",
      "LUNAチャンネルとは相互アフィリエイト・ジョイントセミナーという形で継続的に協業している。"
    ],
    facts: [
      { label: "鑑定実績", val: "8,000件+" }
    ],
    since: "2026"
  }
];

/**
 * セミナーデータ
 * id         : 一意なID
 * title      : セミナータイトル
 * speakerId  : SPEAKERS の id と対応
 * date       : "YYYY-MM-DD" (サンプル値です。実開催日に置き換えてください)
 * time       : 開催時間の表記
 * format     : 開催形式
 * status     : "upcoming"(今後) / "past"(過去) / "regular"(レギュラー開催)
 * category   : 一覧ページの絞り込みタグ
 * tags       : カード表示用タグ
 * price      : 参加費表記
 * desc       : 一覧カード用の短い概要
 * longDesc   : 詳細ページ用の紹介文(配列 = 段落ごと)
 */
const SEMINARS = [
  {
    id: "next-seminar-sample",
    title: "［次回セミナータイトルをここに入力］",
    speakerId: "keita-kikuchi",
    date: "2026-09-15",
    time: "20:00〜21:30",
    format: "Zoomオンライン開催",
    status: "upcoming",
    category: "AI活用",
    tags: ["次回開催"],
    price: "参加費：無料",
    desc: "次回セミナーの概要をここに入力してください。日時・登壇者・内容を確定後、このカードを更新するだけでトップページとスケジュールページに反映されます。",
    longDesc: [
      "次回セミナーの詳細な紹介文をここに入力してください。",
      "対象者・得られること・当日の流れなどを記載すると、初めて訪れた方にも安心感を持って申し込んでもらえます。"
    ]
  },
  {
    id: "weekly-zoom-regular",
    title: "週次Zoomセミナー(レギュラー開催)",
    speakerId: "keita-kikuchi",
    date: "2026-06-01",
    time: "毎週開催・詳細は個別告知",
    format: "Zoomオンライン開催",
    status: "regular",
    category: "AI活用",
    tags: ["レギュラー開催", "占い×AI"],
    price: "参加費：回により異なる",
    desc: "AI×占いをテーマに毎週開催してきたレギュラーセミナー。これまでの開催回数は47回を超え、継続的な学びの場として運営している。",
    longDesc: [
      "LUNAチャンネルの中核となるレギュラーセミナー。AIと占いを掛け合わせた収益化のノウハウを、実践形式で毎週伝えている。",
      "2026年時点で開催回数は47回を超え、初めての方でも参加しやすいテーマ設計を心がけている。"
    ]
  },
  {
    id: "fortune-ai-style",
    title: "占い×AIで拓く、新しい鑑定スタイル",
    speakerId: "yasuo-kurihara",
    date: "2026-06-25",
    time: "20:00〜21:30",
    format: "Zoomオンライン開催・無料",
    status: "past",
    category: "占い",
    tags: ["占い", "AI活用"],
    price: "参加費：無料",
    desc: "鑑定実績8,000件超の栗原靖夫氏を迎え、対面鑑定の経験とAIを組み合わせた新しい鑑定スタイルを紹介した無料セミナー。",
    longDesc: [
      "長年の鑑定経験を持つ栗原靖夫氏とのジョイントセミナー。AIを鑑定にどう取り入れるかを、実例を交えて解説した。",
      "参加者からは「経験とAIの掛け合わせ方が具体的で分かりやすかった」との声が多く寄せられた。"
    ]
  },
  {
    id: "fact-and-interpretation",
    title: "事実と解釈",
    speakerId: "shino-aotsuki",
    date: "2026-06-11",
    time: "20:00〜21:30",
    format: "Zoomオンライン開催・無料",
    status: "past",
    category: "マインドセット",
    tags: ["マインドセット", "対話"],
    price: "参加費：無料",
    desc: "「事実」と「解釈」を切り分けて捉える思考法をテーマにした、蒼月しの氏とのジョイント無料セミナー。",
    longDesc: [
      "起きた出来事そのものと、それに対する自分の解釈を切り分けて考えることで、感情に振り回されない意思決定ができるようになる——という視点を、具体的なワークを交えて紹介した。"
    ]
  },
  {
    id: "claude-code-business",
    title: "Claude Codeで変わる仕事術",
    speakerId: "takatoshi-hioki",
    date: "2026-06-18",
    time: "20:00〜21:30",
    format: "Zoomオンライン開催・無料",
    status: "past",
    category: "AI活用",
    tags: ["Claude Code", "AI活用"],
    price: "参加費：無料",
    desc: "元Microsoftの日沖貴年氏を迎え、「Claude Code」を業務にどう取り入れるかを解説した無料セミナー。",
    longDesc: [
      "生成AIを日々の業務にどう組み込むかを、実際の操作画面を見せながら解説。専門知識がない参加者にも分かりやすいと好評だった。"
    ]
  }
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

function isDraftSeminar(seminar) {
  // タイトルに全角ブラケットが含まれる = 未入力プレースホルダーとみなす
  return seminar.title.includes("［");
}

function statusTag(seminar) {
  if (isDraftSeminar(seminar)) return `<span class="tag">内容準備中</span>`;
  if (seminar.status === "upcoming") return `<span class="tag gold">次回開催</span>`;
  if (seminar.status === "regular") return `<span class="tag navy">レギュラー開催</span>`;
  return `<span class="tag">開催終了</span>`;
}

function seminarCard(seminar) {
  const draft = isDraftSeminar(seminar);
  return `
  <article class="card seminar-card${draft ? " is-draft" : ""}">
    <div class="tag-row">
      ${statusTag(seminar)}
      ${draft ? "" : seminar.tags.map(t => `<span class="tag">${t}</span>`).join("")}
    </div>
    <div class="date">${seminar.status === "regular" ? seminar.time : formatDate(seminar.date)}</div>
    <h3>${draft ? seminar.title : `<a href="seminars.html?id=${seminar.id}">${seminar.title}</a>`}</h3>
    <p class="desc">${seminar.desc}</p>
    <div class="meta">
      ${speakerChip(seminar.speakerId)}
      ${draft ? "" : `<a href="seminars.html?id=${seminar.id}" class="btn-arrow" style="color:var(--c-navy)">詳細を見る</a>`}
    </div>
  </article>`;
}

function speakerFeaturedCard(sp) {
  return `
  <article class="speaker-featured">
    <a href="speakers.html?id=${sp.id}"><div class="sf-photo"><span class="initial">${speakerInitial(sp.name)}</span></div></a>
    <div class="sf-body">
      <div class="sf-role">主宰 / ${sp.role}</div>
      <h3><a href="speakers.html?id=${sp.id}">${sp.name}</a></h3>
      <p>${sp.org}</p>
      <div class="link-row"><a href="speakers.html?id=${sp.id}" class="btn-arrow" style="color:var(--c-navy)">プロフィールを見る</a></div>
    </div>
  </article>`;
}

function speakerCard(sp) {
  return `
  <article class="card speaker-card">
    <a href="speakers.html?id=${sp.id}">
      <div class="photo"><span class="initial">${speakerInitial(sp.name)}</span></div>
    </a>
    <div class="body">
      <div class="role">${sp.role}</div>
      <h3><a href="speakers.html?id=${sp.id}">${sp.name}</a></h3>
      <p>${sp.org}</p>
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
  // 次回開催セミナー
  const next = upcomingSeminars()[0];
  const featuredEl = $("#featured-seminar");
  if (featuredEl) {
    if (next) {
      const sp = getSpeaker(next.speakerId);
      featuredEl.innerHTML = `
        <div class="fs-info">
          <div class="eyebrow">Next Session</div>
          <div class="tag gold" style="margin-bottom:14px;display:inline-block;">${formatDate(next.date)}</div>
          <h3>${next.title}</h3>
          <p class="fs-desc">${next.desc}</p>
          <div class="fs-meta">
            <div class="fs-meta-item"><div class="label">登壇</div><div class="val">${sp ? sp.name : ""}</div></div>
            <div class="fs-meta-item"><div class="label">時間</div><div class="val">${next.time}</div></div>
            <div class="fs-meta-item"><div class="label">形式</div><div class="val">${next.format}</div></div>
          </div>
          <a href="seminars.html?id=${next.id}" class="btn btn-gold btn-arrow">セミナー詳細を見る</a>
        </div>
        <div class="fs-visual">${moonPhasesSVG(200)}</div>`;
    } else {
      featuredEl.innerHTML = `<div class="empty-state">次回開催セミナーは近日公開予定です。</div>`;
    }
  }

  // 最新セミナー(直近の過去セミナーを3件)
  const latestEl = $("#latest-seminars");
  if (latestEl) {
    latestEl.innerHTML = pastSeminars().slice(0, 3).map(seminarCard).join("");
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

  // 実績サマリー(ヒーローは"ダイジェスト"に絞り、詳細は実績バンドに集約)
  setText("#stat-seminars", "47回+");
  setText("#stat-since", "2023年〜");
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
  const past = pastSeminars();

  const upcomingEl = $("#upcoming-seminars");
  if (upcomingEl) {
    const items = [...upcoming, ...regular];
    upcomingEl.innerHTML = items.length
      ? items.map(seminarCard).join("")
      : `<div class="empty-state">現在、募集中のセミナーはありません。次回情報をお待ちください。</div>`;
  }

  const pastEl = $("#past-seminars-grid");
  if (pastEl) pastEl.innerHTML = past.map(seminarCard).join("");

  initFilterBar(past);
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
          <div class="detail-tags">${statusTag(seminar)}${seminar.tags.map(t => `<span class="tag">${t}</span>`).join("")}</div>
          <h1>${seminar.title}</h1>
          <p class="lead">${seminar.desc}</p>
          <div class="detail-facts">
            <div class="fact"><div class="label">開催日</div><div class="val" style="font-size:16px;">${seminar.status === "regular" ? seminar.time : formatDate(seminar.date)}</div></div>
            <div class="fact"><div class="label">時間</div><div class="val" style="font-size:16px;">${seminar.time}</div></div>
            <div class="fact"><div class="label">形式</div><div class="val" style="font-size:16px;">${seminar.format}</div></div>
            <div class="fact"><div class="label">参加費</div><div class="val" style="font-size:16px;">${seminar.price}</div></div>
          </div>
        </div>
      </div>
      <div style="padding:48px 0;display:grid;grid-template-columns:1fr 300px;gap:56px;">
        <div class="prose">
          <h2>セミナー概要</h2>
          ${seminar.longDesc.map(p => `<p>${p}</p>`).join("")}
        </div>
        ${sp ? `
        <aside>
          <div class="card speaker-card">
            <div class="photo"><span class="initial">${speakerInitial(sp.name)}</span></div>
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
        <div class="detail-photo"><span class="initial">${speakerInitial(sp.name)}</span></div>
        <div class="detail-info">
          <div class="role">${sp.role}</div>
          <h1>${sp.name}</h1>
          <p class="lead">${sp.org}</p>
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

function initArchivePage() {
  const past = pastSeminars();
  const timelineEl = $("#archive-timeline");
  if (timelineEl) {
    timelineEl.innerHTML = past.map(s => {
      const sp = getSpeaker(s.speakerId);
      const d = new Date(s.date + "T00:00:00");
      return `
      <div class="timeline-item">
        <div class="t-year">${d.getFullYear()}</div>
        <div>
          <div class="t-date">${formatDate(s.date)} ／ ${sp ? sp.name : ""}</div>
          <h3><a href="seminars.html?id=${s.id}">${s.title}</a></h3>
          <p>${s.desc}</p>
          <div class="t-tags">${s.tags.map(t => `<span class="tag">${t}</span>`).join("")}</div>
        </div>
      </div>`;
    }).join("");
  }
  setText("#archive-count", `${past.length}本`);
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
