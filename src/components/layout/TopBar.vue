<template>
  <header class="topbar">
    <div class="topbar-left">
      <span class="page-title">Security Operations Center</span>
      <span class="breadcrumb">/ Overview</span>
    </div>
    <div class="topbar-right">
      <div class="time-block">
        <span class="time-label">LOCAL TIME</span>
        <span class="time-value">{{ currentTime }}</span>
      </div>
      <div class="divider"></div>
      <div class="server-info">
        <span class="si-label">HOST</span>
        <span class="si-value">SRV-PROD-01 · 192.168.1.10</span>
      </div>
      <div class="divider"></div>
      <div class="user-block">
        <div class="user-avatar">AD</div>
        <span class="user-name">admin</span>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'TopBar',
  data() {
    return {
      currentTime: ''
    }
  },
  mounted() {
    this.updateTime()
    this.timer = setInterval(this.updateTime, 1000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    updateTime() {
      const now = new Date()
      this.currentTime = now.toLocaleTimeString('en-GB', { hour12: false }) + ' UTC+8'
    }
  }
}
</script>

<style scoped>
.topbar {
  height: 52px;
  background: #070c1a;
  border-bottom: 1px solid #1a2540;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  flex-shrink: 0;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

.page-title {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #c9dff0;
}

.breadcrumb {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: #3d5a80;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 14px;
}

.time-block, .server-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.time-label, .si-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 8px;
  color: #3d5a80;
  letter-spacing: 0.1em;
}

.time-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: #00d4ff;
  font-weight: 500;
}

.si-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: #8aadcc;
}

.divider {
  width: 1px;
  height: 24px;
  background: #1a2540;
}

.user-block {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-avatar {
  width: 28px;
  height: 28px;
  background: #0d1a2e;
  border: 1px solid #1a2540;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: #00d4ff;
  font-weight: 700;
}

.user-name {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: #8aadcc;
}
</style>
