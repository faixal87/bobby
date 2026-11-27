<template>
  <div class="panel attack-origins">
    <div class="panel-header">
      <span class="panel-title">Attack Origins</span>
      <span class="total-label">{{ totalAttacks }} events traced</span>
    </div>
    <div class="origins-list">
      <div v-for="(origin, i) in origins" :key="origin.code" class="origin-row">
        <span class="rank mono">{{ String(i+1).padStart(2,'0') }}</span>
        <span class="flag-code mono">{{ origin.code }}</span>
        <span class="country-name">{{ origin.country }}</span>
        <div class="origin-bar-wrap">
          <div class="origin-bar" :style="{ width: barWidth(origin.count) + '%' }"></div>
        </div>
        <span class="origin-count mono">{{ origin.count }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AttackOrigins',
  props: {
    origins: { type: Array, required: true }
  },
  computed: {
    totalAttacks() {
      return this.origins.reduce((s, o) => s + o.count, 0).toLocaleString()
    },
    maxCount() {
      return Math.max(...this.origins.map(o => o.count))
    }
  },
  methods: {
    barWidth(count) {
      return Math.round((count / this.maxCount) * 100)
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

.total-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: #3d5a80;
}

.origins-list {
  padding: 10px 0;
}

.origin-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 16px;
}

.mono {
  font-family: 'JetBrains Mono', monospace;
}

.rank {
  font-size: 10px;
  color: #3d5a80;
  width: 20px;
  flex-shrink: 0;
}

.flag-code {
  font-size: 10px;
  font-weight: 700;
  color: #00d4ff;
  width: 24px;
  flex-shrink: 0;
}

.country-name {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  color: #8aadcc;
  width: 100px;
  flex-shrink: 0;
}

.origin-bar-wrap {
  flex: 1;
  height: 4px;
  background: #1a2540;
  border-radius: 2px;
  overflow: hidden;
}

.origin-bar {
  height: 100%;
  background: linear-gradient(90deg, #00d4ff55, #00d4ff);
  border-radius: 2px;
  transition: width 1s ease;
}

.origin-count {
  font-size: 11px;
  color: #c9dff0;
  width: 36px;
  text-align: right;
  font-weight: 600;
  flex-shrink: 0;
}
</style>
