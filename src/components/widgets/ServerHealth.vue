<template>
  <div class="panel server-health">
    <div class="panel-header">
      <span class="panel-title">Server Health</span>
      <span class="server-count">{{ servers.length }} nodes</span>
    </div>
    <div class="server-list">
      <div v-for="srv in liveServers" :key="srv.name" class="server-row">
        <div class="srv-status-dot" :class="srv.status"></div>
        <div class="srv-info">
          <div class="srv-name">{{ srv.name }}</div>
          <div class="srv-role">{{ srv.role }}</div>
        </div>
        <div class="srv-metrics">
          <div class="metric">
            <span class="metric-label">CPU</span>
            <div class="metric-bar">
              <div class="metric-fill" :class="barClass(srv.cpu)" :style="{ width: srv.cpu + '%' }"></div>
            </div>
            <span class="metric-val" :class="barClass(srv.cpu)">{{ srv.cpu }}%</span>
          </div>
          <div class="metric">
            <span class="metric-label">MEM</span>
            <div class="metric-bar">
              <div class="metric-fill" :class="barClass(srv.mem)" :style="{ width: srv.mem + '%' }"></div>
            </div>
            <span class="metric-val" :class="barClass(srv.mem)">{{ srv.mem }}%</span>
          </div>
        </div>
        <div class="srv-alerts" v-if="srv.alerts > 0">
          <span class="alert-count" :class="srv.status">{{ srv.alerts }}</span>
        </div>
        <div class="srv-alerts" v-else>
          <span class="alert-none">—</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
function clamp(v, min, max) { return Math.min(max, Math.max(min, v)) }
function drift(v, range, min, max) {
  return clamp(v + (Math.random() * range * 2 - range), min, max)
}
function deriveStatus(cpu, mem) {
  if (cpu >= 85 || mem >= 85) return 'critical'
  if (cpu >= 65 || mem >= 70) return 'warning'
  return 'healthy'
}

export default {
  name: 'ServerHealth',
  props: {
    servers: { type: Array, required: true }
  },
  data() {
    return {
      liveServers: this.servers.map(s => ({ ...s }))
    }
  },
  mounted() {
    this.ticker = setInterval(() => {
      this.liveServers = this.liveServers.map(s => {
        const cpu = Math.round(drift(s.cpu, 6, 5, 99))
        const mem = Math.round(drift(s.mem, 4, 20, 99))
        return { ...s, cpu, mem, status: deriveStatus(cpu, mem) }
      })
    }, 3000)
  },
  beforeDestroy() {
    clearInterval(this.ticker)
  },
  methods: {
    barClass(val) {
      if (val >= 85) return 'critical'
      if (val >= 70) return 'warning'
      return 'normal'
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
}
.server-count {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: #3d5a80;
}
.server-list { padding: 8px 0; }
.server-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  border-bottom: 1px solid #0a1020;
}
.server-row:last-child { border-bottom: none; }
.srv-status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  transition: background 0.5s;
}
.srv-status-dot.healthy  { background: #00c896; box-shadow: 0 0 5px #00c89666; }
.srv-status-dot.warning  { background: #f59e0b; box-shadow: 0 0 5px #f59e0b66; }
.srv-status-dot.critical { background: #ff3d5a; box-shadow: 0 0 5px #ff3d5a66; animation: blink 1s infinite; }
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
}
.srv-info { width: 110px; flex-shrink: 0; }
.srv-name {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: #c9dff0;
  font-weight: 500;
}
.srv-role {
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  color: #3d5a80;
  margin-top: 1px;
}
.srv-metrics { flex: 1; display: flex; flex-direction: column; gap: 4px; }
.metric { display: flex; align-items: center; gap: 6px; }
.metric-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  color: #3d5a80;
  width: 28px;
  letter-spacing: 0.05em;
}
.metric-bar {
  flex: 1;
  height: 4px;
  background: #1a2540;
  border-radius: 2px;
  overflow: hidden;
}
.metric-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.6s ease;
}
.metric-fill.normal   { background: #00c896; }
.metric-fill.warning  { background: #f59e0b; }
.metric-fill.critical { background: #ff3d5a; }
.metric-val {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  width: 36px;
  text-align: right;
  transition: color 0.3s;
}
.metric-val.normal   { color: #00c896; }
.metric-val.warning  { color: #f59e0b; }
.metric-val.critical { color: #ff3d5a; }
.srv-alerts { width: 32px; text-align: center; }
.alert-count {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 5px;
  border-radius: 3px;
}
.alert-count.critical { background: #ff3d5a22; color: #ff3d5a; }
.alert-count.warning  { background: #f59e0b22; color: #f59e0b; }
.alert-count.healthy  { background: #00c89622; color: #00c896; }
.alert-none { color: #1a2540; font-size: 12px; }
</style>
