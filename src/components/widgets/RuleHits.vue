<template>
  <div class="panel rule-hits">
    <div class="panel-header">
      <span class="panel-title">Top Triggered Rules</span>
    </div>
    <div class="rule-list">
      <div v-for="rule in rules" :key="rule.rule" class="rule-row">
        <div class="rule-info">
          <span class="rule-name">{{ rule.rule }}</span>
          <span class="rule-action" :class="rule.action.toLowerCase()">{{ rule.action }}</span>
        </div>
        <div class="rule-bar-wrap">
          <div class="rule-bar" :style="{ width: barWidth(rule.hits) + '%' }"></div>
        </div>
        <span class="rule-hits-num mono">{{ rule.hits.toLocaleString() }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RuleHits',
  props: {
    rules: { type: Array, required: true }
  },
  computed: {
    maxHits() {
      return Math.max(...this.rules.map(r => r.hits))
    }
  },
  methods: {
    barWidth(hits) {
      return Math.round((hits / this.maxHits) * 100)
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
  padding: 12px 16px;
  border-bottom: 1px solid #1a2540;
}

.panel-title {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #c9dff0;
}

.rule-list {
  padding: 10px 0;
}

.rule-row {
  padding: 8px 16px;
  border-bottom: 1px solid #0a1020;
}

.rule-row:last-child {
  border-bottom: none;
}

.rule-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.rule-name {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  color: #8aadcc;
}

.rule-action {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 3px;
  letter-spacing: 0.05em;
}

.rule-action.block  { background: #ff3d5a22; color: #ff3d5a; border: 1px solid #ff3d5a44; }
.rule-action.alert  { background: #f59e0b22; color: #f59e0b; border: 1px solid #f59e0b44; }

.rule-bar-wrap {
  height: 3px;
  background: #1a2540;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 4px;
}

.rule-bar {
  height: 100%;
  background: #00d4ff55;
  border-radius: 2px;
}

.rule-hits-num {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: #3d5a80;
}

.mono {
  font-family: 'JetBrains Mono', monospace;
}
</style>
