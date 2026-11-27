<template>
  <div class="threat-overview">
    <div class="stat-card critical">
      <div class="stat-header">
        <span class="stat-label">CRITICAL</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#ff3d5a" stroke-width="2"/><line x1="12" y1="9" x2="12" y2="13" stroke="#ff3d5a" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="17" x2="12.01" y2="17" stroke="#ff3d5a" stroke-width="2" stroke-linecap="round"/></svg>
      </div>
      <div class="stat-value critical-text">{{ stats.critical }}</div>
      <div class="stat-sub">+2 last hour</div>
    </div>

    <div class="stat-card high">
      <div class="stat-header">
        <span class="stat-label">HIGH</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#ff7a2f" stroke-width="2"/><line x1="12" y1="8" x2="12" y2="12" stroke="#ff7a2f" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="16" x2="12.01" y2="16" stroke="#ff7a2f" stroke-width="2" stroke-linecap="round"/></svg>
      </div>
      <div class="stat-value high-text">{{ stats.high }}</div>
      <div class="stat-sub">+5 last hour</div>
    </div>

    <div class="stat-card medium">
      <div class="stat-header">
        <span class="stat-label">MEDIUM</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#f59e0b" stroke-width="2"/><line x1="12" y1="8" x2="12" y2="12" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="16" x2="12.01" y2="16" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/></svg>
      </div>
      <div class="stat-value medium-text">{{ stats.medium }}</div>
      <div class="stat-sub">+18 last hour</div>
    </div>

    <div class="stat-card low">
      <div class="stat-header">
        <span class="stat-label">LOW</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#00c896" stroke-width="2"/><polyline points="9 12 11 14 15 10" stroke="#00c896" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <div class="stat-value low-text">{{ stats.low }}</div>
      <div class="stat-sub">+41 last hour</div>
    </div>

    <div class="stat-card blocked">
      <div class="stat-header">
        <span class="stat-label">BLOCKED</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#00d4ff" stroke-width="2"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" stroke="#00d4ff" stroke-width="2" stroke-linecap="round"/></svg>
      </div>
      <div class="stat-value blocked-text">{{ stats.blocked.toLocaleString() }}</div>
      <div class="stat-sub">Total today</div>
    </div>

    <div class="stat-card allowed">
      <div class="stat-header">
        <span class="stat-label">ALLOWED</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="#8aadcc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <div class="stat-value allowed-text">{{ stats.allowed.toLocaleString() }}</div>
      <div class="stat-sub">Total today</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ThreatOverview',
  props: {
    stats: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.threat-overview {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
}

.stat-card {
  background: #0d1526;
  border: 1px solid #1a2540;
  border-radius: 6px;
  padding: 14px 16px;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
}

.stat-card.critical::before { background: #ff3d5a; }
.stat-card.high::before     { background: #ff7a2f; }
.stat-card.medium::before   { background: #f59e0b; }
.stat-card.low::before      { background: #00c896; }
.stat-card.blocked::before  { background: #00d4ff; }
.stat-card.allowed::before  { background: #3d5a80; }

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.stat-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  color: #3d5a80;
  letter-spacing: 0.1em;
  font-weight: 500;
}

.stat-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 28px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 6px;
}

.stat-sub {
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  color: #3d5a80;
}

.critical-text { color: #ff3d5a; }
.high-text      { color: #ff7a2f; }
.medium-text    { color: #f59e0b; }
.low-text       { color: #00c896; }
.blocked-text   { color: #00d4ff; }
.allowed-text   { color: #8aadcc; }
</style>
