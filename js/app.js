/* ============================================================
   SOC Dashboard — Logik utama
   ------------------------------------------------------------
   Aliran:  muat data → tapis → kira KPI → lukis carta → isi jadual
   Setiap kali penapis berubah atau event baru masuk, kita panggil
   refresh() untuk ulang langkah tapis → KPI → carta → jadual.
   ============================================================ */

/* ---------- 1. KONFIGURASI ---------- */
const DATA_URL = "data/events.json";
const LIVE_INTERVAL_MS = 2500;   // kekerapan event baru dalam mod LIVE
const TABLE_LIMIT = 100;         // bilangan baris maksimum dalam jadual

const SEVERITIES = ["Critical", "High", "Medium", "Low"];
const SEV_COLORS = {
  Critical: "#f85149",
  High: "#f0883e",
  Medium: "#d29922",
  Low: "#3fb950",
};
const TYPE_COLORS = ["#38bdf8", "#a78bfa", "#f472b6", "#facc15", "#34d399", "#fb923c", "#94a3b8"];

/* ---------- 2. STATE (data yang dikongsi seluruh aplikasi) ---------- */
const state = {
  events: [],         // semua event (sudah ditukar ke objek Date)
  filtered: [],       // event selepas ditapis
  types: [],          // senarai jenis serangan unik
  charts: {},         // rujukan kepada objek Chart.js
  liveTimer: null,
  newIds: new Set(),  // event baru (untuk animasi highlight)
  nextId: 1,
};

/* Rujukan elemen DOM */
const $ = (id) => document.getElementById(id);
const el = {
  range: $("rangeSelect"),
  severity: $("severitySelect"),
  type: $("typeSelect"),
  search: $("searchInput"),
  reset: $("resetBtn"),
  live: $("liveToggle"),
  clock: $("clock"),
  org: $("orgName"),
  tbody: $("alertBody"),
  tableCount: $("tableCount"),
  exportBtn: $("exportBtn"),
};

/* ---------- 3. MUAT DATA ---------- */
async function loadData() {
  const res = await fetch(DATA_URL);
  if (!res.ok) throw new Error(`Gagal muat ${DATA_URL} (HTTP ${res.status})`);
  const json = await res.json();

  // Data dijana pada masa tetap. Kita "anjak" semua timestamp supaya
  // event terkini jatuh pada masa sekarang — dashboard sentiasa nampak terkini.
  const offset = Date.now() - Date.parse(json.generated_at);

  state.events = json.events.map((e) => ({
    ...e,
    time: new Date(Date.parse(e.timestamp) + offset),
  }));
  state.types = [...new Set(state.events.map((e) => e.type))].sort();
  state.nextId = state.events.length + 1;
  el.org.textContent = json.organisation;
}

/* ---------- 4. PENAPIS ---------- */
function applyFilters() {
  const hours = Number(el.range.value);
  const since = Date.now() - hours * 3600 * 1000;
  const sev = el.severity.value;
  const type = el.type.value;
  const q = el.search.value.trim().toLowerCase();

  state.filtered = state.events.filter((e) =>
    e.time.getTime() >= since &&
    (sev === "all" || e.severity === sev) &&
    (type === "all" || e.type === type) &&
    (!q || `${e.source_ip} ${e.country} ${e.target}`.toLowerCase().includes(q))
  );
}

/* ---------- 5. KPI ---------- */
function setKpi(id, value) {
  const node = $(id);
  if (node.textContent !== String(value)) {
    node.textContent = value;
    node.classList.remove("bump");
    void node.offsetWidth;          // reset animasi
    node.classList.add("bump");
  }
}

function renderKpis() {
  const list = state.filtered;
  const blocked = list.filter((e) => e.action === "Blocked" || e.action === "Quarantined").length;

  setKpi("kpiTotal", list.length.toLocaleString());
  setKpi("kpiFailed", list.filter((e) => e.failed_login).length.toLocaleString());
  setKpi("kpiIps", new Set(list.map((e) => e.source_ip)).size.toLocaleString());
  setKpi("kpiBlocked", list.length ? `${Math.round((blocked / list.length) * 100)}%` : "0%");
  setKpi("kpiCritical", list.filter((e) => e.severity === "Critical").length.toLocaleString());
}

/* ---------- 6. FUNGSI BANTU ---------- */

// Kira kekerapan ikut kunci, pulangkan [[kunci, bilangan], ...] tersusun menurun
function countBy(list, keyFn, limit) {
  const map = new Map();
  for (const item of list) {
    const k = keyFn(item);
    map.set(k, (map.get(k) || 0) + 1);
  }
  const sorted = [...map.entries()].sort((a, b) => b[1] - a[1]);
  return limit ? sorted.slice(0, limit) : sorted;
}

// Saiz "baldi" masa untuk carta timeline ikut julat dipilih
function bucketConfig(hours) {
  if (hours <= 1) return { size: 5 * 60e3, count: 12 };   // 12 × 5 minit
  if (hours <= 6) return { size: 30 * 60e3, count: 12 };  // 12 × 30 minit
  return { size: 60 * 60e3, count: 24 };                  // 24 × 1 jam
}

const fmtTime = (d) => d.toLocaleTimeString("ms-MY", { hour: "2-digit", minute: "2-digit", hour12: false });
const fmtDateTime = (d) => d.toLocaleString("ms-MY", {
  day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
});

// Elak XSS: jangan masukkan teks mentah terus ke innerHTML
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/* ---------- 7. CARTA (Chart.js) ---------- */
function setupChartDefaults() {
  Chart.defaults.color = "#8b98ad";
  Chart.defaults.borderColor = "#232d42";
  Chart.defaults.font.family = getComputedStyle(document.body).fontFamily;
  Chart.defaults.plugins.legend.labels.boxWidth = 12;
  Chart.defaults.maintainAspectRatio = false;
}

function horizontalBar(canvasId, color, onClick) {
  return new Chart($(canvasId), {
    type: "bar",
    data: { labels: [], datasets: [{ data: [], backgroundColor: color, borderRadius: 4 }] },
    options: {
      indexAxis: "y",
      plugins: { legend: { display: false } },
      scales: { x: { beginAtZero: true, ticks: { precision: 0 } }, y: { grid: { display: false } } },
      onClick,
    },
  });
}

function createCharts() {
  // (a) Timeline — bar bertindan ikut severity
  state.charts.timeline = new Chart($("timelineChart"), {
    type: "bar",
    data: {
      labels: [],
      datasets: SEVERITIES.map((s) => ({ label: s, data: [], backgroundColor: SEV_COLORS[s], borderRadius: 2 })),
    },
    options: {
      plugins: { legend: { position: "top", align: "end" }, tooltip: { mode: "index", intersect: false } },
      scales: {
        x: { stacked: true, grid: { display: false } },
        y: { stacked: true, beginAtZero: true, ticks: { precision: 0 } },
      },
    },
  });

  // (b) Jenis serangan — doughnut, klik untuk tapis
  state.charts.type = new Chart($("typeChart"), {
    type: "doughnut",
    data: { labels: [], datasets: [{ data: [], backgroundColor: TYPE_COLORS, borderColor: "#121826", borderWidth: 2 }] },
    options: {
      cutout: "62%",
      plugins: { legend: { position: "right" } },
      onClick: (_evt, items) => {
        if (!items.length) return;
        const label = state.charts.type.data.labels[items[0].index];
        el.type.value = el.type.value === label ? "all" : label;   // klik sekali lagi = buang tapisan
        refresh();
      },
    },
  });

  // (c) Top IP — klik bar untuk cari IP tersebut
  state.charts.ip = horizontalBar("ipChart", "#f85149cc", (_evt, items) => {
    if (!items.length) return;
    el.search.value = state.charts.ip.data.labels[items[0].index];
    refresh();
  });

  // (d) Negara & (e) Sasaran
  state.charts.country = horizontalBar("countryChart", "#38bdf8cc");
  state.charts.target = horizontalBar("targetChart", "#a78bfacc");
}

function updateBar(chart, pairs) {
  chart.data.labels = pairs.map((p) => p[0]);
  chart.data.datasets[0].data = pairs.map((p) => p[1]);
  chart.update();
}

function renderCharts() {
  const list = state.filtered;

  // Timeline
  const { size, count } = bucketConfig(Number(el.range.value));
  const end = Math.ceil(Date.now() / size) * size;
  const start = end - size * count;
  const buckets = Object.fromEntries(SEVERITIES.map((s) => [s, new Array(count).fill(0)]));
  for (const e of list) {
    const i = Math.floor((e.time.getTime() - start) / size);
    if (i >= 0 && i < count) buckets[e.severity][i]++;
  }
  const tl = state.charts.timeline;
  tl.data.labels = Array.from({ length: count }, (_, i) => fmtTime(new Date(start + i * size)));
  tl.data.datasets.forEach((ds) => (ds.data = buckets[ds.label]));
  tl.update();

  // Jenis serangan — kekalkan warna tetap bagi setiap jenis
  const typeCounts = state.types.map((t) => [t, list.filter((e) => e.type === t).length]);
  const tc = state.charts.type;
  tc.data.labels = typeCounts.map((p) => p[0]);
  tc.data.datasets[0].data = typeCounts.map((p) => p[1]);
  tc.update();

  updateBar(state.charts.ip, countBy(list, (e) => e.source_ip, 10));
  updateBar(state.charts.country, countBy(list, (e) => e.country, 10));
  updateBar(state.charts.target, countBy(list, (e) => e.target.split(" ")[0]));
}

/* ---------- 8. JADUAL ALERT ---------- */
function renderTable() {
  const rows = state.filtered.slice(0, TABLE_LIMIT);
  el.tableCount.textContent = `(${rows.length} daripada ${state.filtered.length})`;

  if (!rows.length) {
    el.tbody.innerHTML = `<tr><td colspan="9" class="empty">Tiada event sepadan dengan penapis.</td></tr>`;
    return;
  }

  el.tbody.innerHTML = rows.map((e) => `
    <tr class="${state.newIds.has(e.id) ? "new-row" : ""}">
      <td class="mono">${escapeHtml(e.id)}</td>
      <td>${fmtDateTime(e.time)}</td>
      <td><span class="badge ${e.severity}">${e.severity}</span></td>
      <td>${escapeHtml(e.type)}</td>
      <td class="mono">${escapeHtml(e.source_ip)}</td>
      <td>${escapeHtml(e.country)}</td>
      <td>${escapeHtml(e.target)}</td>
      <td class="mono">${e.port}</td>
      <td>${escapeHtml(e.action)}</td>
    </tr>`).join("");
  state.newIds.clear();
}

/* ---------- 9. EXPORT CSV ---------- */
function exportCsv() {
  const cols = ["id", "timestamp", "severity", "type", "source_ip", "country", "target", "port", "action"];
  const lines = [cols.join(",")];
  for (const e of state.filtered) {
    const row = { ...e, timestamp: e.time.toISOString() };
    lines.push(cols.map((c) => `"${String(row[c]).replace(/"/g, '""')}"`).join(","));
  }
  const blob = new Blob([lines.join("\n")], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `soc-events-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

/* ---------- 10. MOD LIVE (simulasi event masuk) ---------- */
function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function simulateEvent() {
  // Ambil satu event sedia ada sebagai "templat" supaya data baru nampak realistik
  const base = randomFrom(state.events);
  const id = `EVT-${String(state.nextId++).padStart(4, "0")}`;
  return { ...base, id, time: new Date(), timestamp: new Date().toISOString() };
}

function startLive() {
  state.liveTimer = setInterval(() => {
    const n = 1 + Math.floor(Math.random() * 3);   // 1–3 event setiap kali
    for (let i = 0; i < n; i++) {
      const ev = simulateEvent();
      state.events.unshift(ev);
      state.newIds.add(ev.id);
    }
    refresh();
  }, LIVE_INTERVAL_MS);
}

function stopLive() {
  clearInterval(state.liveTimer);
  state.liveTimer = null;
}

/* ---------- 11. REFRESH & INIT ---------- */
function refresh() {
  applyFilters();
  renderKpis();
  renderCharts();
  renderTable();
}

function tickClock() {
  el.clock.textContent = new Date().toLocaleTimeString("ms-MY", { hour12: false });
}

function bindEvents() {
  [el.range, el.severity, el.type].forEach((s) => s.addEventListener("change", refresh));

  let debounce;
  el.search.addEventListener("input", () => {
    clearTimeout(debounce);
    debounce = setTimeout(refresh, 250);   // tunggu pengguna berhenti menaip
  });

  el.reset.addEventListener("click", () => {
    el.range.value = "24";
    el.severity.value = "all";
    el.type.value = "all";
    el.search.value = "";
    refresh();
  });

  el.live.addEventListener("change", () => (el.live.checked ? startLive() : stopLive()));
  el.exportBtn.addEventListener("click", exportCsv);
}

async function init() {
  tickClock();
  setInterval(tickClock, 1000);

  try {
    await loadData();
  } catch (err) {
    console.error(err);
    el.org.textContent = "Ralat memuatkan data";
    el.tbody.innerHTML = `<tr><td colspan="9" class="empty">
      ${escapeHtml(err.message)}<br>
      Tip: buka melalui web server (cth. VS Code Live Server atau GitHub Pages), bukan double-click fail.
    </td></tr>`;
    return;
  }

  // Isi dropdown jenis serangan
  for (const t of state.types) el.type.add(new Option(t, t));

  setupChartDefaults();
  createCharts();
  bindEvents();
  bindTerminalEvents();
  refresh();
}

init();

/* ============================================================
   TERMINAL MODULE — tmux/screen style log viewer
   ============================================================ */

const TERM_TYPES = ["ALL", "Brute Force", "DDoS", "Malware", "Phishing", "Port Scan", "SQL Injection"];

// Pane config: setiap tab ada berapa pane dan apa yang mereka tunjukkan
const PANE_CONFIG = {
  "ALL": [
    { title: "soc@polycc:/var/log/soc# tail -f auth.log",       filter: e => ["Brute Force","Phishing"].includes(e.type) },
    { title: "soc@polycc:/var/log/soc# tail -f network.log",    filter: e => ["Port Scan","DDoS"].includes(e.type) },
    { title: "soc@polycc:/var/log/soc# tail -f malware.log",    filter: e => e.type === "Malware" },
    { title: "soc@polycc:/var/log/soc# tail -f inject.log",     filter: e => e.type === "SQL Injection" },
  ],
  "Brute Force": [
    { title: "tail -f /var/log/auth.log | grep FAILED",         filter: e => e.type === "Brute Force" && e.severity === "Critical" },
    { title: "tail -f /var/log/auth.log | grep WARNING",        filter: e => e.type === "Brute Force" && e.severity === "High" },
    { title: "tail -f /var/log/auth.log | grep -v FAILED",      filter: e => e.type === "Brute Force" && ["Medium","Low"].includes(e.severity) },
  ],
  "DDoS": [
    { title: "tail -f /var/log/ddos.log | grep -i flood",       filter: e => e.type === "DDoS" && e.severity === "Critical" },
    { title: "tail -f /var/log/ddos.log",                       filter: e => e.type === "DDoS" },
  ],
  "Malware": [
    { title: "tail -f /var/log/av/malware.log | grep DETECT",   filter: e => e.type === "Malware" && e.severity === "Critical" },
    { title: "tail -f /var/log/av/malware.log",                 filter: e => e.type === "Malware" },
  ],
  "Phishing": [
    { title: "tail -f /var/log/mail/phishing.log",              filter: e => e.type === "Phishing" },
  ],
  "Port Scan": [
    { title: "tail -f /var/log/firewall.log | grep SCAN",       filter: e => e.type === "Port Scan" && e.severity !== "Low" },
    { title: "tail -f /var/log/firewall.log | grep -i recon",   filter: e => e.type === "Port Scan" },
  ],
  "SQL Injection": [
    { title: "tail -f /var/log/apache2/sqli.log | grep ERROR",  filter: e => e.type === "SQL Injection" && e.severity === "Critical" },
    { title: "tail -f /var/log/apache2/sqli.log",               filter: e => e.type === "SQL Injection" },
  ],
};

// Simpan log lines per pane [tabKey][paneIndex]
const termState = {
  activetab: "ALL",
  panes: {},       // { "ALL": [el, el, ...], "Brute Force": [...], ... }
  built: false,
  ticker: null,
};

function termFmt(e) {
  const ts = e.time.toLocaleTimeString("ms-MY", { hour12: false });
  const target = e.target.split(" ")[0];
  const msgs = {
    "Brute Force":   `Failed login attempt from ${e.source_ip} on ${target} port ${e.port}`,
    "DDoS":          `High traffic volume from ${e.source_ip} targeting ${target}:${e.port}`,
    "Malware":       `Malicious payload detected from ${e.source_ip} on ${target}:${e.port}`,
    "Phishing":      `Suspicious email/link from ${e.source_ip} targeting ${target}`,
    "Port Scan":     `Port probe ${e.port} from ${e.source_ip} on ${target}`,
    "SQL Injection": `SQL injection pattern at ${target}:${e.port} from ${e.source_ip}`,
  };
  return { ts, target, msg: msgs[e.type] || `Event type ${e.type} from ${e.source_ip}` };
}

function appendLogLine(outputEl, event) {
  const { ts, msg } = termFmt(event);
  const line = document.createElement("div");
  line.className = "log-line";
  line.innerHTML =
    `<span class="log-ts">${ts}</span>` +
    `<span class="log-host">${event.target.split(" ")[0]}</span>` +
    `<span class="log-sev ${event.severity}">[${event.severity.toUpperCase().slice(0,4)}]</span>` +
    `<span class="log-ip">${event.source_ip}</span>` +
    `<span class="log-msg">${msg}</span>` +
    `<span class="log-action ${event.action}">${event.action}</span>`;
  outputEl.appendChild(line);
  // Keep max 200 lines per pane
  while (outputEl.children.length > 200) outputEl.removeChild(outputEl.firstChild);
  outputEl.scrollTop = outputEl.scrollHeight;
}

function buildTerminal() {
  if (termState.built) return;
  const tabsEl  = document.getElementById("termTabs");
  const bodyEl  = document.getElementById("termBody");
  tabsEl.innerHTML = "";
  bodyEl.innerHTML = "";
  termState.panes = {};

  TERM_TYPES.forEach((type, i) => {
    const paneConf = PANE_CONFIG[type];
    const count = state.events.filter(e => type === "ALL" || e.type === type).length;

    // --- TAB ---
    const tab = document.createElement("button");
    tab.className = "term-tab" + (type === "ALL" ? " active" : "");
    tab.dataset.tab = type;
    const badgeClass = type === "ALL" ? "all" : (type === "Brute Force" ? "High" : type === "DDoS" ? "Critical" : "Medium");
    tab.innerHTML = `${type}<span class="tab-badge ${badgeClass}">${count}</span>`;
    tab.addEventListener("click", () => switchTermTab(type));
    tabsEl.appendChild(tab);

    // --- PANE GRID ---
    const grid = document.createElement("div");
    grid.className = `term-pane-grid panes-${paneConf.length}` + (type === "ALL" ? " active" : "");
    grid.dataset.tab = type;
    termState.panes[type] = [];

    paneConf.forEach((conf, pi) => {
      const pane = document.createElement("div");
      pane.className = "term-pane";

      const header = document.createElement("div");
      header.className = "term-pane-header";
      header.innerHTML =
        `<span class="term-pane-title">pane ${pi + 1}</span>` +
        `<span class="term-pane-cmd">${conf.title.replace(/</g,"&lt;")}</span>` +
        `<span class="term-pane-status">● running</span>`;

      const output = document.createElement("div");
      output.className = "term-output";

      const prompt = document.createElement("div");
      prompt.className = "term-prompt";
      prompt.innerHTML =
        `<span class="ps1-user">soc</span><span style="color:#3d4a5a">@</span>` +
        `<span class="ps1-host">polycc-srv</span><span style="color:#3d4a5a">:</span>` +
        `<span class="ps1-path">/var/log/soc</span><span style="color:#3d4a5a">$</span>` +
        `<span class="ps1-cursor"></span>`;

      pane.appendChild(header);
      pane.appendChild(output);
      pane.appendChild(prompt);
      grid.appendChild(pane);
      termState.panes[type].push({ output, filter: conf.filter });
    });

    bodyEl.appendChild(grid);
  });

  // Seed panes dengan log historik (50 event terakhir)
  const history = state.events.slice(0, 80);
  history.reverse().forEach(ev => pushEventToTerminal(ev));

  termState.built = true;
}

function pushEventToTerminal(ev) {
  TERM_TYPES.forEach(type => {
    const panes = termState.panes[type];
    if (!panes) return;
    panes.forEach(({ output, filter }) => {
      if (filter(ev)) appendLogLine(output, ev);
    });
  });
  // Update tab badges
  updateTermBadges();
}

function updateTermBadges() {
  document.querySelectorAll(".term-tab").forEach(tab => {
    const type = tab.dataset.tab;
    const badge = tab.querySelector(".tab-badge");
    if (!badge) return;
    const count = type === "ALL"
      ? state.events.length
      : state.events.filter(e => e.type === type).length;
    badge.textContent = count;
  });
}

function switchTermTab(type) {
  termState.activetab = type;
  document.querySelectorAll(".term-tab").forEach(t => t.classList.toggle("active", t.dataset.tab === type));
  document.querySelectorAll(".term-pane-grid").forEach(g => g.classList.toggle("active", g.dataset.tab === type));
}

function openTerminal() {
  buildTerminal();
  document.getElementById("terminalOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
  // Start terminal live ticker (faster than main dashboard)
  if (!termState.ticker) {
    termState.ticker = setInterval(() => {
      const ev = simulateEvent();
      state.events.unshift(ev);
      state.newIds.add(ev.id);
      pushEventToTerminal(ev);
    }, 1200);
  }
}

function closeTerminal() {
  document.getElementById("terminalOverlay").classList.remove("open");
  document.body.style.overflow = "";
  if (termState.ticker) { clearInterval(termState.ticker); termState.ticker = null; }
}

function bindTerminalEvents() {
  document.getElementById("terminalBtn").addEventListener("click", openTerminal);
  document.getElementById("termClose").addEventListener("click", closeTerminal);
  document.getElementById("termCloseBtn").addEventListener("click", closeTerminal);
  // Tekan Escape untuk tutup
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeTerminal(); });
  // Klik luar modal tutup
  document.getElementById("terminalOverlay").addEventListener("click", function(e) {
    if (e.target === this) closeTerminal();
  });
}
