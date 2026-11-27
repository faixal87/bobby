<template>
  <div class="dashboard-view">
    <ThreatOverview :stats="threatSummary" />

    <div class="row-charts">
      <EventsChart class="chart-events" />
      <NetworkTraffic class="chart-network" />
      <ThreatChart :stats="threatSummary" class="chart-dist" />
    </div>

    <div class="main-grid">
      <div class="col-left">
        <LiveEvents :events="liveEvents" />
      </div>
      <div class="col-right">
        <ServerHealth :servers="servers" />
        <AttackOrigins :origins="attackOrigins" />
        <RuleHits :rules="ruleHits" />
      </div>
    </div>
  </div>
</template>

<script>
import ThreatOverview from '@/components/widgets/ThreatOverview.vue'
import LiveEvents     from '@/components/widgets/LiveEvents.vue'
import ServerHealth   from '@/components/widgets/ServerHealth.vue'
import EventsChart    from '@/components/widgets/EventsChart.vue'
import NetworkTraffic from '@/components/widgets/NetworkTraffic.vue'
import ThreatChart    from '@/components/widgets/ThreatChart.vue'
import AttackOrigins  from '@/components/widgets/AttackOrigins.vue'
import RuleHits       from '@/components/widgets/RuleHits.vue'

import {
  threatSummary,
  liveEvents,
  servers,
  attackOrigins,
  ruleHits
} from '@/data/mockData.js'

const SEVERITIES = ['critical', 'high', 'medium', 'low']
const TYPES      = ['Brute Force', 'SQL Injection', 'Port Scan', 'XSS Attempt', 'Dir Traversal', 'Failed Auth', 'Recon Activity', 'C2 Callback', 'DDoS Probe', 'LDAP Injection']
const STATUSES   = ['BLOCKED', 'BLOCKED', 'BLOCKED', 'DETECTED', 'LOGGED']
const IPS        = ['185.220.101.42', '91.108.4.11', '45.33.32.156', '103.21.244.0', '198.41.0.4', '172.16.0.5', '104.21.0.9', '62.210.180.0', '37.19.221.0']
const TARGETS    = ['SRV-PROD-01', 'DB-01', 'SRV-WEB-02', 'APP-01', 'FIREWALL', 'SRV-MAIL-01']

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }

export default {
  name: 'DashboardView',
  components: {
    ThreatOverview,
    LiveEvents,
    ServerHealth,
    EventsChart,
    NetworkTraffic,
    ThreatChart,
    AttackOrigins,
    RuleHits
  },
  data() {
    return {
      threatSummary: { ...threatSummary },
      servers:       servers.map(s => ({ ...s })),
      attackOrigins,
      ruleHits,
      liveEvents:    [...liveEvents],
    }
  },
  mounted() {
    // New security event every 2 seconds
    this.eventTicker = setInterval(() => {
      const now = new Date().toTimeString().slice(0, 8)
      const sev = pick(SEVERITIES)
      const status = pick(STATUSES)

      const newEvent = {
        id: Date.now(),
        time: now,
        severity: sev,
        type: pick(TYPES),
        source: pick(IPS),
        target: pick(TARGETS),
        status
      }

      this.liveEvents = [newEvent, ...this.liveEvents.slice(0, 11)]

      // Update threat counters
      const delta = { ...this.threatSummary }
      if (sev === 'critical') delta.critical++
      if (sev === 'high')     delta.high++
      if (sev === 'medium')   delta.medium++
      if (sev === 'low')      delta.low++
      if (status === 'BLOCKED')  delta.blocked++
      else                       delta.allowed++
      this.threatSummary = delta
    }, 2000),

    // Update attack origin counts every 8 seconds
    this.originTicker = setInterval(() => {
      this.attackOrigins = this.attackOrigins.map(o => ({
        ...o,
        count: o.count + Math.floor(Math.random() * 8)
      }))
    }, 8000)
  },
  beforeDestroy() {
    clearInterval(this.eventTicker)
    clearInterval(this.originTicker)
  }
}
</script>

<style scoped>
.dashboard-view {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 16px;
  overflow-y: auto;
  height: 100%;
}

.row-charts {
  display: grid;
  grid-template-columns: 1fr 1fr 280px;
  gap: 14px;
}

.main-grid {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 14px;
}

.col-left {
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
}

.col-right {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
</style>
