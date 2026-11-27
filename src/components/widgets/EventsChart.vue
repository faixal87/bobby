<template>
  <div class="panel events-chart">
    <div class="panel-header">
      <div class="panel-title">
        <span class="live-dot"></span>
        Event Activity — Live (60 min window)
      </div>
      <div class="chart-legend">
        <span class="leg-item"><span class="leg-dot blocked"></span>Blocked</span>
        <span class="leg-item"><span class="leg-dot detected"></span>Detected</span>
        <span class="leg-item"><span class="leg-dot crit"></span>Critical</span>
      </div>
    </div>
    <div class="chart-wrap">
      <line-chart :chart-data="chartData" :options="chartOptions" :height="130"></line-chart>
    </div>
  </div>
</template>

<script>
import { Line } from 'vue-chartjs'

const MAX_POINTS = 15

function rnd(min, max) { return Math.floor(min + Math.random() * (max - min)) }

function initLabels() {
  const labels = []
  const now = new Date()
  for (let i = MAX_POINTS - 1; i >= 0; i--) {
    const t = new Date(now - i * 60000 * 4)
    labels.push(t.toTimeString().slice(0, 5))
  }
  return labels
}

export default {
  name: 'EventsChart',
  components: { LineChart: Line },
  data() {
    return {
      labels:   initLabels(),
      blocked:  Array.from({ length: MAX_POINTS }, () => rnd(30, 130)),
      detected: Array.from({ length: MAX_POINTS }, () => rnd(8, 35)),
      critical: Array.from({ length: MAX_POINTS }, () => rnd(0, 5)),
    }
  },
  computed: {
    chartData() {
      return {
        labels: this.labels,
        datasets: [
          {
            label: 'Blocked',
            data: this.blocked,
            borderColor: '#ff3d5a',
            backgroundColor: 'rgba(255,61,90,0.08)',
            borderWidth: 2,
            pointRadius: 2,
            pointBackgroundColor: '#ff3d5a',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Detected',
            data: this.detected,
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245,158,11,0.06)',
            borderWidth: 2,
            pointRadius: 2,
            pointBackgroundColor: '#f59e0b',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Critical',
            data: this.critical,
            borderColor: '#00d4ff',
            backgroundColor: 'rgba(0,212,255,0.04)',
            borderWidth: 2,
            pointRadius: 2,
            pointBackgroundColor: '#00d4ff',
            fill: false,
            tension: 0.4
          }
        ]
      }
    },
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        legend: { display: false },
        animation: { duration: 400 },
        scales: {
          xAxes: [{
            gridLines: { color: '#1a2540', zeroLineColor: '#1a2540' },
            ticks: { fontColor: '#3d5a80', fontFamily: 'JetBrains Mono, monospace', fontSize: 9, maxTicksLimit: 8, maxRotation: 0 }
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
        }
      }
    }
  },
  mounted() {
    this.ticker = setInterval(() => {
      const now = new Date().toTimeString().slice(0, 5)
      this.labels   = [...this.labels.slice(1),   now]
      this.blocked  = [...this.blocked.slice(1),   rnd(30, 130)]
      this.detected = [...this.detected.slice(1),  rnd(8, 35)]
      this.critical = [...this.critical.slice(1),  rnd(0, 5)]
    }, 5000)
  },
  beforeDestroy() {
    clearInterval(this.ticker)
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
  background: #ff3d5a;
  box-shadow: 0 0 6px #ff3d5a88;
  animation: pulse 1.5s infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
.chart-legend {
  display: flex;
  gap: 14px;
}
.leg-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  color: #3d5a80;
}
.leg-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.leg-dot.blocked  { background: #ff3d5a; }
.leg-dot.detected { background: #f59e0b; }
.leg-dot.crit     { background: #00d4ff; }
.chart-wrap {
  padding: 12px 16px 8px;
  height: 160px;
}
</style>
