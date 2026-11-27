<template>
  <div class="dashboard-view">
    <ThreatOverview :stats="threatSummary" />

    <div class="main-grid">
      <!-- Left column -->
      <div class="col-left">
        <EventsChart :hourly="hourlyEvents" />
        <LiveEvents :events="liveEvents" />
      </div>

      <!-- Right column -->
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
import AttackOrigins  from '@/components/widgets/AttackOrigins.vue'
import RuleHits       from '@/components/widgets/RuleHits.vue'

import {
  threatSummary,
  liveEvents,
  servers,
  attackOrigins,
  hourlyEvents,
  ruleHits
} from '@/data/mockData.js'

export default {
  name: 'DashboardView',
  components: {
    ThreatOverview,
    LiveEvents,
    ServerHealth,
    EventsChart,
    AttackOrigins,
    RuleHits
  },
  data() {
    return {
      threatSummary,
      servers,
      attackOrigins,
      hourlyEvents,
      ruleHits,
      liveEvents: [...liveEvents]
    }
  },
  mounted() {
    // simulate live event stream: rotate events every 4 seconds
    this.liveTimer = setInterval(() => {
      const severities = ['critical', 'high', 'medium', 'low']
      const types = ['Brute Force', 'SQL Injection', 'Port Scan', 'XSS Attempt', 'Dir Traversal', 'Failed Auth', 'Recon Activity', 'C2 Callback']
      const statuses = ['BLOCKED', 'BLOCKED', 'BLOCKED', 'DETECTED', 'LOGGED']
      const ips = ['185.220.101.42', '91.108.4.11', '45.33.32.156', '103.21.244.0', '198.41.0.4', '172.16.0.5']
      const targets = ['SRV-PROD-01', 'DB-01', 'SRV-WEB-02', 'APP-01', 'FIREWALL']

      const now = new Date()
      const timeStr = now.toTimeString().slice(0, 8)
      const sev = severities[Math.floor(Math.random() * severities.length)]
      const newEvent = {
        id: Date.now(),
        time: timeStr,
        severity: sev,
        type: types[Math.floor(Math.random() * types.length)],
        source: ips[Math.floor(Math.random() * ips.length)],
        target: targets[Math.floor(Math.random() * targets.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)]
      }

      this.liveEvents = [newEvent, ...this.liveEvents.slice(0, 7)]

      if (sev === 'critical') this.threatSummary = { ...this.threatSummary, critical: this.threatSummary.critical + 1 }
      if (sev === 'high')     this.threatSummary = { ...this.threatSummary, high:     this.threatSummary.high + 1 }
    }, 4000)
  },
  beforeDestroy() {
    clearInterval(this.liveTimer)
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

.main-grid {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 14px;
  min-height: 0;
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
