export const serverStats = {
  hostname: 'SRV-PROD-01',
  ip: '192.168.1.10',
  os: 'Ubuntu 22.04 LTS',
  uptime: '47d 13h 22m',
  cpu: 34,
  memory: 61,
  disk: 48,
  network: { in: '1.2 GB/s', out: '0.8 GB/s' }
}

export const threatSummary = {
  critical: 3,
  high: 12,
  medium: 47,
  low: 134,
  total: 196,
  blocked: 1842,
  allowed: 98210
}

export const liveEvents = [
  { id: 1, time: '03:27:41', severity: 'critical', type: 'Brute Force', source: '185.220.101.42', target: 'SRV-PROD-01', status: 'BLOCKED' },
  { id: 2, time: '03:27:38', severity: 'high',     type: 'SQL Injection', source: '91.108.4.11', target: 'DB-01', status: 'BLOCKED' },
  { id: 3, time: '03:27:35', severity: 'high',     type: 'Port Scan', source: '45.33.32.156', target: '192.168.1.0/24', status: 'DETECTED' },
  { id: 4, time: '03:27:31', severity: 'medium',   type: 'Failed Auth', source: '10.0.0.44', target: 'SRV-WEB-02', status: 'LOGGED' },
  { id: 5, time: '03:27:28', severity: 'medium',   type: 'XSS Attempt', source: '103.21.244.0', target: 'APP-01', status: 'BLOCKED' },
  { id: 6, time: '03:27:21', severity: 'low',      type: 'Dir Traversal', source: '198.41.0.4', target: 'APP-01', status: 'BLOCKED' },
  { id: 7, time: '03:27:15', severity: 'medium',   type: 'Suspicious TLS', source: '172.16.0.5', target: 'SRV-MAIL-01', status: 'DETECTED' },
  { id: 8, time: '03:27:09', severity: 'low',      type: 'Recon Activity', source: '104.21.0.9', target: 'FIREWALL', status: 'LOGGED' },
]

export const servers = [
  { name: 'SRV-PROD-01', role: 'Web Server', status: 'healthy', cpu: 34, mem: 61, alerts: 2 },
  { name: 'DB-01',       role: 'Database',   status: 'warning', cpu: 78, mem: 85, alerts: 5 },
  { name: 'SRV-WEB-02',  role: 'Web Server', status: 'healthy', cpu: 22, mem: 44, alerts: 0 },
  { name: 'APP-01',      role: 'App Server', status: 'critical', cpu: 94, mem: 92, alerts: 12 },
  { name: 'SRV-MAIL-01', role: 'Mail Server', status: 'healthy', cpu: 18, mem: 37, alerts: 1 },
  { name: 'FIREWALL',    role: 'Network',    status: 'healthy', cpu: 11, mem: 29, alerts: 0 },
]

export const attackOrigins = [
  { country: 'Russia',        code: 'RU', count: 412, lat: 55.7, lon: 37.6 },
  { country: 'China',         code: 'CN', count: 388, lat: 39.9, lon: 116.4 },
  { country: 'Netherlands',   code: 'NL', count: 201, lat: 52.4, lon: 4.9 },
  { country: 'United States', code: 'US', count: 177, lat: 37.8, lon: -96.1 },
  { country: 'Germany',       code: 'DE', count: 134, lat: 51.2, lon: 10.5 },
  { country: 'Brazil',        code: 'BR', count: 98,  lat: -14.2, lon: -51.9 },
  { country: 'India',         code: 'IN', count: 76,  lat: 20.6, lon: 78.9 },
]

export const hourlyEvents = {
  labels: ['18:00','19:00','20:00','21:00','22:00','23:00','00:00','01:00','02:00','03:00'],
  blocked: [42, 65, 89, 120, 95, 73, 58, 44, 61, 83],
  detected: [12, 18, 24, 31, 27, 19, 15, 11, 16, 22],
  critical: [1, 2, 3, 4, 2, 1, 0, 1, 2, 3]
}

export const ruleHits = [
  { rule: 'SSH Brute Force', hits: 847, action: 'BLOCK' },
  { rule: 'SQL Injection Pattern', hits: 523, action: 'BLOCK' },
  { rule: 'Port Scan Detection', hits: 318, action: 'ALERT' },
  { rule: 'Web Shell Upload', hits: 204, action: 'BLOCK' },
  { rule: 'Tor Exit Node', hits: 189, action: 'BLOCK' },
  { rule: 'C2 Callback Pattern', hits: 97, action: 'BLOCK' },
]
