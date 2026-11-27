<template>
  <div class="panel live-events">
    <div class="panel-header">
      <div class="panel-title">
        <span class="live-dot"></span>
        Live Event Stream
      </div>
      <span class="event-count">{{ events.length }} recent</span>
    </div>
    <div class="events-table">
      <div class="table-head">
        <span>TIME</span>
        <span>SEV</span>
        <span>TYPE</span>
        <span>SOURCE IP</span>
        <span>TARGET</span>
        <span>STATUS</span>
      </div>
      <div
        v-for="event in events"
        :key="event.id"
        class="table-row"
        :class="event.severity"
      >
        <span class="cell mono time">{{ event.time }}</span>
        <span class="cell sev-badge" :class="event.severity">{{ event.severity.toUpperCase() }}</span>
        <span class="cell mono type">{{ event.type }}</span>
        <span class="cell mono source">{{ event.source }}</span>
        <span class="cell mono target">{{ event.target }}</span>
        <span class="cell status-badge" :class="statusClass(event.status)">{{ event.status }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LiveEvents',
  props: {
    events: { type: Array, required: true }
  },
  methods: {
    statusClass(status) {
      return { BLOCKED: 'blocked', DETECTED: 'detected', LOGGED: 'logged' }[status] || 'logged'
    }
  }
}
</script>

<style scoped>
.panel {
  background: #0d1526;
  border: 1px solid #1a2540;
  border-radius: 6px;
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #1a2540;
}

.panel-title {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #c9dff0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.live-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #00c896;
  box-shadow: 0 0 6px #00c89688;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.event-count {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: #3d5a80;
}

.events-table {
  width: 100%;
}

.table-head {
  display: grid;
  grid-template-columns: 80px 80px 160px 140px 1fr 90px;
  padding: 8px 16px;
  background: #070c1a;
  border-bottom: 1px solid #1a2540;
}

.table-head span {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  color: #3d5a80;
  letter-spacing: 0.1em;
}

.table-row {
  display: grid;
  grid-template-columns: 80px 80px 160px 140px 1fr 90px;
  padding: 8px 16px;
  border-bottom: 1px solid #0a1020;
  transition: background 0.1s;
}

.table-row:hover {
  background: #0a1020;
}

.table-row.critical { border-left: 2px solid #ff3d5a; }
.table-row.high     { border-left: 2px solid #ff7a2f; }
.table-row.medium   { border-left: 2px solid #f59e0b; }
.table-row.low      { border-left: 2px solid #3d5a80; }

.cell {
  font-size: 11px;
  display: flex;
  align-items: center;
}

.cell.mono {
  font-family: 'JetBrains Mono', monospace;
  color: #8aadcc;
}

.cell.time { color: #3d5a80; }
.cell.type { color: #c9dff0; }

.sev-badge {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.sev-badge.critical { color: #ff3d5a; }
.sev-badge.high     { color: #ff7a2f; }
.sev-badge.medium   { color: #f59e0b; }
.sev-badge.low      { color: #00c896; }

.status-badge {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  width: fit-content;
}

.status-badge.blocked  { background: #ff3d5a22; color: #ff3d5a; border: 1px solid #ff3d5a44; }
.status-badge.detected { background: #f59e0b22; color: #f59e0b; border: 1px solid #f59e0b44; }
.status-badge.logged   { background: #3d5a8022; color: #8aadcc;  border: 1px solid #3d5a8044; }
</style>
