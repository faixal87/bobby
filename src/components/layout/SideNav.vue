<template>
  <aside class="sidenav">
    <div class="brand">
      <div class="brand-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#00d4ff" stroke-width="2" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="brand-text">
        <span class="brand-name">SENTINEL</span>
        <span class="brand-sub">SIEM v2.4</span>
      </div>
    </div>

    <div class="system-status">
      <div class="status-dot" :class="systemOnline ? 'online' : 'offline'"></div>
      <span class="status-label">{{ systemOnline ? 'SYSTEM ONLINE' : 'SYSTEM OFFLINE' }}</span>
    </div>

    <nav class="nav-links">
      <a
        v-for="item in navItems"
        :key="item.id"
        class="nav-item"
        :class="{ active: activeNav === item.id }"
        @click="activeNav = item.id"
      >
        <span class="nav-icon" v-html="item.icon"></span>
        <span class="nav-label">{{ item.label }}</span>
        <span v-if="item.badge" class="nav-badge" :class="item.badgeType">{{ item.badge }}</span>
      </a>
    </nav>

    <div class="nav-footer">
      <div class="threat-level">
        <span class="tl-label">THREAT LEVEL</span>
        <span class="tl-value" :class="threatLevelClass">{{ threatLevel }}</span>
      </div>
      <div class="tl-bar">
        <div class="tl-fill" :class="threatLevelClass" :style="{ width: threatLevelPct + '%' }"></div>
      </div>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'SideNav',
  data() {
    return {
      activeNav: 'dashboard',
      systemOnline: true,
      threatLevel: 'ELEVATED',
      threatLevelPct: 62,
      navItems: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/></svg>`,
          badge: null
        },
        {
          id: 'alerts',
          label: 'Alerts',
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2a7 7 0 017 7v4l2 3H3l2-3V9a7 7 0 017-7z" stroke="currentColor" stroke-width="2"/><path d="M9 19c0 1.7 1.3 3 3 3s3-1.3 3-3" stroke="currentColor" stroke-width="2"/></svg>`,
          badge: 15,
          badgeType: 'danger'
        },
        {
          id: 'events',
          label: 'Live Events',
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
          badge: 'LIVE',
          badgeType: 'live'
        },
        {
          id: 'network',
          label: 'Network',
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="2"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" stroke="currentColor" stroke-width="2"/></svg>`,
          badge: null
        },
        {
          id: 'servers',
          label: 'Servers',
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="8" rx="2" stroke="currentColor" stroke-width="2"/><rect x="2" y="14" width="20" height="8" rx="2" stroke="currentColor" stroke-width="2"/><line x1="6" y1="6" x2="6.01" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="6" y1="18" x2="6.01" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
          badge: 2,
          badgeType: 'warning'
        },
        {
          id: 'rules',
          label: 'Rules',
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" stroke-width="2"/><polyline points="14 2 14 8 20 8" stroke="currentColor" stroke-width="2"/><line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2"/><line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2"/><polyline points="10 9 9 9 8 9" stroke="currentColor" stroke-width="2"/></svg>`,
          badge: null
        },
        {
          id: 'reports',
          label: 'Reports',
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" stroke-width="2"/><line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" stroke-width="2"/><line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" stroke-width="2"/></svg>`,
          badge: null
        },
      ]
    }
  },
  computed: {
    threatLevelClass() {
      const map = { 'LOW': 'tl-low', 'GUARDED': 'tl-low', 'ELEVATED': 'tl-medium', 'HIGH': 'tl-high', 'SEVERE': 'tl-critical' }
      return map[this.threatLevel] || 'tl-medium'
    }
  }
}
</script>

<style scoped>
.sidenav {
  width: 220px;
  min-height: 100vh;
  background: #070c1a;
  border-right: 1px solid #1a2540;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  padding: 0;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 16px 16px;
  border-bottom: 1px solid #1a2540;
}

.brand-icon {
  width: 36px;
  height: 36px;
  background: #0d1526;
  border: 1px solid #00d4ff33;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  font-weight: 700;
  color: #e8f4ff;
  letter-spacing: 0.08em;
}

.brand-sub {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: #3d5a80;
  letter-spacing: 0.05em;
}

.system-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #0a1020;
  border-bottom: 1px solid #1a2540;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-dot.online {
  background: #00c896;
  box-shadow: 0 0 6px #00c89688;
  animation: pulse 2s infinite;
}

.status-dot.offline {
  background: #ff3d5a;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.status-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  color: #00c896;
  letter-spacing: 0.1em;
}

.nav-links {
  flex: 1;
  padding: 10px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  cursor: pointer;
  color: #4a6080;
  transition: color 0.15s, background 0.15s;
  position: relative;
  text-decoration: none;
}

.nav-item:hover {
  color: #8aadcc;
  background: #0d1526;
}

.nav-item.active {
  color: #00d4ff;
  background: #0d1a2e;
  border-left: 2px solid #00d4ff;
}

.nav-item.active .nav-icon svg {
  color: #00d4ff;
}

.nav-icon {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.nav-label {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.02em;
  flex: 1;
}

.nav-badge {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 3px;
}

.nav-badge.danger {
  background: #ff3d5a22;
  color: #ff3d5a;
  border: 1px solid #ff3d5a44;
}

.nav-badge.warning {
  background: #f59e0b22;
  color: #f59e0b;
  border: 1px solid #f59e0b44;
}

.nav-badge.live {
  background: #00c89622;
  color: #00c896;
  border: 1px solid #00c89644;
  animation: pulse 1.5s infinite;
}

.nav-footer {
  padding: 14px 16px;
  border-top: 1px solid #1a2540;
}

.threat-level {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.tl-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  color: #3d5a80;
  letter-spacing: 0.08em;
}

.tl-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.tl-bar {
  height: 3px;
  background: #1a2540;
  border-radius: 2px;
  overflow: hidden;
}

.tl-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 1s ease;
}

.tl-low    { color: #00c896; }
.tl-medium { color: #f59e0b; }
.tl-high   { color: #ff7a2f; }
.tl-critical { color: #ff3d5a; }

.tl-fill.tl-low     { background: #00c896; }
.tl-fill.tl-medium  { background: #f59e0b; }
.tl-fill.tl-high    { background: #ff7a2f; }
.tl-fill.tl-critical{ background: #ff3d5a; }
</style>
