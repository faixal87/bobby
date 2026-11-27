<template>
  <div class="panel">
    <div class="panel-header">
      <span class="panel-title">Threat Distribution</span>
      <span class="chart-total">{{ total }} total</span>
    </div>
    <div class="chart-body">
      <div class="chart-wrap">
        <bar-chart :chart-data="chartData" :options="chartOptions" :height="150"></bar-chart>
      </div>
      <div class="sev-legend">
        <div v-for="item in legend" :key="item.label" class="leg-row">
          <span class="leg-bar" :style="{ background: item.color, width: item.pct + '%' }"></span>
          <span class="leg-label">{{ item.label }}</span>
          <span class="leg-val" :style="{ color: item.color }">{{ item.val }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Bar } from 'vue-chartjs'

export default {
  name: 'ThreatChart',
  components: { BarChart: Bar },
  props: {
    stats: { type: Object, required: true }
  },
  computed: {
    total() {
      return (this.stats.critical + this.stats.high + this.stats.medium + this.stats.low).toLocaleString()
    },
    legend() {
      const max = Math.max(this.stats.critical, this.stats.high, this.stats.medium, this.stats.low)
      return [
        { label: 'Critical', val: this.stats.critical, color: '#ff3d5a', pct: Math.round(this.stats.critical / max * 100) },
        { label: 'High',     val: this.stats.high,     color: '#ff7a2f', pct: Math.round(this.stats.high     / max * 100) },
        { label: 'Medium',   val: this.stats.medium,   color: '#f59e0b', pct: Math.round(this.stats.medium   / max * 100) },
        { label: 'Low',      val: this.stats.low,      color: '#00c896', pct: Math.round(this.stats.low      / max * 100) },
      ]
    },
    chartData() {
      return {
        labels: ['Critical', 'High', 'Medium', 'Low'],
        datasets: [{
          data: [this.stats.critical, this.stats.high, this.stats.medium, this.stats.low],
          backgroundColor: ['rgba(255,61,90,0.7)', 'rgba(255,122,47,0.7)', 'rgba(245,158,11,0.7)', 'rgba(0,200,150,0.7)'],
          borderColor:     ['#ff3d5a', '#ff7a2f', '#f59e0b', '#00c896'],
          borderWidth: 1,
          borderRadius: 3,
        }]
      }
    },
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        legend: { display: false },
        scales: {
          xAxes: [{
            gridLines: { display: false },
            ticks: { fontColor: '#3d5a80', fontFamily: 'JetBrains Mono, monospace', fontSize: 9 }
          }],
          yAxes: [{
            gridLines: { color: '#1a2540', zeroLineColor: '#1a2540' },
            ticks: { fontColor: '#3d5a80', fontFamily: 'JetBrains Mono, monospace', fontSize: 9, beginAtZero: true }
          }]
        },
        tooltips: {
          backgroundColor: '#0d1526', borderColor: '#1a2540', borderWidth: 1,
          titleFontFamily: 'JetBrains Mono, monospace', titleFontColor: '#00d4ff',
          bodyFontFamily: 'Inter, sans-serif', bodyFontColor: '#8aadcc', cornerRadius: 4
        },
        animation: { duration: 400 }
      }
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
.chart-total {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: #3d5a80;
}
.chart-body {
  padding: 12px 16px;
}
.chart-wrap {
  height: 150px;
  margin-bottom: 14px;
}
.sev-legend {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.leg-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.leg-bar {
  display: block;
  height: 3px;
  min-width: 4px;
  max-width: 60px;
  border-radius: 2px;
  flex-shrink: 0;
}
.leg-label {
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  color: #3d5a80;
  flex: 1;
}
.leg-val {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 700;
}
</style>
