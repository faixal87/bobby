"""
Penjana data dummy untuk Dashboard SOC (latihan).

Jalankan:  python3 tools/generate_data.py
Output:    data/events.json

Nota: Semua alamat IP diambil daripada julat DOKUMENTASI (RFC 5737)
iaitu 192.0.2.0/24, 198.51.100.0/24 dan 203.0.113.0/24 — bukan IP sebenar.
"""
import json
import random
from datetime import datetime, timedelta, timezone

random.seed(2026)  # tetap, supaya data sama setiap kali dijana

TOTAL_EVENTS = 600
HOURS_BACK = 24
MYT = timezone(timedelta(hours=8))

ATTACK_TYPES = {
    # jenis: (berat kebarangkalian, port sasaran, severity yang mungkin)
    "Brute Force":   (30, [22, 3389, 21],  ["Medium", "High"]),
    "Port Scan":     (25, [0],             ["Low", "Medium"]),
    "Phishing":      (15, [25, 443],       ["Medium", "High", "Critical"]),
    "SQL Injection": (12, [80, 443],       ["High", "Critical"]),
    "Malware":       (10, [445, 443],      ["High", "Critical"]),
    "DDoS":          (8,  [80, 443],       ["Medium", "High", "Critical"]),
}

COUNTRIES = [
    ("China", "CN", 22), ("Russia", "RU", 18), ("United States", "US", 12),
    ("Vietnam", "VN", 9), ("Brazil", "BR", 8), ("Indonesia", "ID", 8),
    ("India", "IN", 7), ("Iran", "IR", 6), ("Netherlands", "NL", 5),
    ("Malaysia", "MY", 5),
]

TARGETS = [
    "web-srv-01 (10.10.1.10)", "mail-srv (10.10.1.20)", "db-srv (10.10.2.5)",
    "vpn-gw (10.10.0.1)", "fileshare (10.10.3.8)", "cidos-lms (10.10.1.30)",
]

ACTIONS_BY_SEVERITY = {
    "Low": ["Logged", "Logged", "Blocked"],
    "Medium": ["Blocked", "Blocked", "Logged"],
    "High": ["Blocked", "Quarantined", "Investigating"],
    "Critical": ["Investigating", "Quarantined", "Escalated"],
}

PREFIXES = ["192.0.2", "198.51.100", "203.0.113"]

# Kumpulan "penyerang tegar" — IP yang muncul berulang kali (untuk carta Top IP)
REPEAT_ATTACKERS = [
    (f"{random.choice(PREFIXES)}.{random.randint(1, 254)}", random.choice(COUNTRIES))
    for _ in range(12)
]


def pick_weighted(items, weight_index):
    return random.choices(items, weights=[i[weight_index] for i in items])[0]


def random_source():
    if random.random() < 0.55:
        return random.choice(REPEAT_ATTACKERS)
    ip = f"{random.choice(PREFIXES)}.{random.randint(1, 254)}"
    return ip, pick_weighted(COUNTRIES, 2)


def random_time(now):
    # Lebih banyak serangan pada waktu malam (00:00–05:00 MYT)
    while True:
        t = now - timedelta(seconds=random.randint(0, HOURS_BACK * 3600))
        if t.hour < 6 or random.random() < 0.55:
            return t


def main():
    now = datetime(2026, 11, 27, 11, 0, tzinfo=MYT)
    types = [(name, *meta) for name, meta in ATTACK_TYPES.items()]
    events = []

    for _ in range(TOTAL_EVENTS):
        name, _w, ports, severities = pick_weighted(types, 1)
        ip, (country, code, _cw) = random_source()
        severity = random.choice(severities)
        port = random.choice(ports) or random.choice([22, 23, 80, 135, 443, 3306, 8080])
        events.append({
            "timestamp": random_time(now).isoformat(timespec="seconds"),
            "type": name,
            "severity": severity,
            "source_ip": ip,
            "country": country,
            "country_code": code,
            "target": random.choice(TARGETS),
            "port": port,
            "action": random.choice(ACTIONS_BY_SEVERITY[severity]),
            "failed_login": name == "Brute Force",
        })

    events.sort(key=lambda e: e["timestamp"], reverse=True)
    for i, e in enumerate(events, start=1):
        e["id"] = f"EVT-{i:04d}"

    out = {
        "generated_at": now.isoformat(timespec="seconds"),
        "organisation": "Politeknik & Kolej Komuniti · Security Operations Centre (Latihan)",
        "events": [{"id": e.pop("id"), **e} for e in events],
    }
    with open("data/events.json", "w", encoding="utf-8") as f:
        json.dump(out, f, indent=2)
    print(f"{len(events)} events ditulis ke data/events.json")


if __name__ == "__main__":
    main()
