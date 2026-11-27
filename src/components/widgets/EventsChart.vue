<template>
  <div class="panel events-chart">
    <div class="panel-header">
      <span class="panel-title">Event Activity — Last 10 Hours</span>
      <div class="chart-legend">
        <span class="leg-item"><span class="leg-dot blocked"></span>Blocked</span>
        <span class="leg-item"><span class="leg-dot detected"></span>Detected</span>
        <span class="leg-item"><span class="leg-dot critical"></span>Critical</span>
      </div>
    </div>
    <div class="chart-wrap">
      <line-chart :chart-data="chartData" :options="chartOptions" :height="120"></line-chart>
    </div>
  </div>
</template>

<script>
import { Line } from 'vue-chartjs'

export default {
  name: 'EventsChart',
  components: { LineChart: Line },
  props: {
    hourly: { type: Object, required: true }
  },
  computed: {
    chartData() {
      return {
        labels: this.hourly.labels,
        datasets: [
          {
            label: 'Blocked',
            data: this.hourly.blocked,
            borderColor: '#ff3d5a',
            backgroundColor: 'rgba(255,61,90,0.08)',
            borderWidth: 2,
            pointRadius: 3,
            pointBackgroundColor: '#ff3d5a',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Detected',
            data: this.hourly.detected,
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245,158,11,0.06)',
            borderWidth: 2,
            pointRadius: 3,
            pointBackgroundColor: '#f59e0b',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Critical',
            data: this.hourly.critical,
            borderColor: '#00d4ff',
            backgroundColor: 'rgba(0,212,255,0.05)',
            borderWidth: 2,
            pointRadius: 3,
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
        scales: {
          xAxes: [{
            gridLines: { color: '#1a2540', zeroLineColor: '#1a2540' },
            ticks: {
              fontColor: '#3d5a80',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 9
            }
          }],
          yAxes: [{
            gridLines: { color: '#1a2540', zeroLineColor: '#1a2540' },
            ticks: {
              fontColor: '#3d5a80',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 9,
              beginAtZero: true
            }
          }]
        },
        tooltips: {
          backgroundColor: '#0d1526',
          borderColor: '#1a2540',
          borderWidth: 1,
          titleFontFamily: 'JetBrains Mono, monospace',
          titleFontColor: '#00d4ff',
          bodyFontFamily: 'Inter, sans-serif',
          bodyFontColor: '#8aadcc',
          cornerRadius: 4
        }
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
.leg-dot.critical { background: #00d4ff; }

.chart-wrap {
  padding: 12px 16px 8px;
  height: 160px;
}
</style>
