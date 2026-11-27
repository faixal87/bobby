<template>
  <div class="panel">
    <div class="panel-header">
      <div class="panel-title">
        <span class="live-dot"></span>
        Network Traffic
      </div>
      <div class="traffic-stats">
        <span class="ts-item in">↓ {{ currentIn }} Mbps</span>
        <span class="ts-item out">↑ {{ currentOut }} Mbps</span>
      </div>
    </div>
    <div class="chart-wrap">
      <line-chart :chart-data="chartData" :options="chartOptions" :height="130"></line-chart>
    </div>
  </div>
</template>

<script>
import { Line } from 'vue-chartjs'

const MAX_POINTS = 20

function rnd(min, max) {
  return +(min + Math.random() * (max - min)).toFixed(1)
}

function initPoints(min, max) {
  return Array.from({ length: MAX_POINTS }, () => rnd(min, max))
}

function initLabels() {
  const labels = []
  const now = new Date()
  for (let i = MAX_POINTS - 1; i >= 0; i--) {
    const t = new Date(now - i * 3000)
    labels.push(t.toTimeString().slice(0, 8))
  }
  return labels
}

export default {
  name: 'NetworkTraffic',
  components: { LineChart: Line },
  data() {
    const inData  = initPoints(80, 320)
    const outData = initPoints(40, 180)
    return {
      labels:  initLabels(),
      inData,
      outData,
      currentIn:  inData[inData.length - 1],
      currentOut: outData[outData.length - 1],
    }
  },
  computed: {
    chartData() {
      return {
        labels: this.labels,
        datasets: [
          {
            label: 'Inbound',
            data: this.inData,
            borderColor: '#00d4ff',
            backgroundColor: 'rgba(0,212,255,0.07)',
            borderWidth: 1.5,
            pointRadius: 0,
            fill: true,
            tension: 0.4
          },
          {
            label: 'Outbound',
            data: this.outData,
            borderColor: '#00c896',
            backgroundColor: 'rgba(0,200,150,0.05)',
            borderWidth: 1.5,
            pointRadius: 0,
            fill: true,
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
        animation: { duration: 0 },
        scales: {
          xAxes: [{
            gridLines: { color: '#1a2540', zeroLineColor: '#1a2540' },
            ticks: {
              fontColor: '#3d5a80',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 8,
              maxTicksLimit: 6,
              maxRotation: 0
            }
          }],
          yAxes: [{
            gridLines: { color: '#1a2540', zeroLineColor: '#1a2540' },
            ticks: {
              fontColor: '#3d5a80',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 8,
              beginAtZero: true,
              callback: v => v + ' M'
            }
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
      const now = new Date().toTimeString().slice(0, 8)
      const newIn  = rnd(80, 320)
      const newOut = rnd(40, 180)

      this.labels  = [...this.labels.slice(1),  now]
      this.inData  = [...this.inData.slice(1),   newIn]
      this.outData = [...this.outData.slice(1),  newOut]
      this.currentIn  = newIn
      this.currentOut = newOut
    }, 2000)
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
  background: #00d4ff;
  box-shadow: 0 0 6px #00d4ff88;
  animation: pulse 1.5s infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
.traffic-stats {
  display: flex;
  gap: 14px;
}
.ts-item {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 600;
}
.ts-item.in  { color: #00d4ff; }
.ts-item.out { color: #00c896; }
.chart-wrap {
  padding: 10px 16px 8px;
  height: 160px;
}
</style>
