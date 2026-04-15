const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const cors = require('cors');
const { initDB, seedDB, getDB } = require('./db/database');
const apiRoutes = require('./routes/api');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize database
initDB();
seedDB();

// API routes
app.use('/api', apiRoutes);

// Serve main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ─── REAL-TIME DATA SIMULATION ENGINE ────────────────────────────────
const db = getDB();

function generateLiveMetrics() {
    const modes = db.prepare('SELECT * FROM transit_modes').all();
    const systemMetrics = db.prepare('SELECT * FROM system_metrics ORDER BY id DESC LIMIT 1').get();
    const alerts = db.prepare('SELECT * FROM alerts WHERE active = 1 ORDER BY created_at DESC LIMIT 10').all();
    const fleetVehicles = db.prepare('SELECT * FROM fleet_vehicles LIMIT 20').all();

    // Simulate live fluctuation
    const updatedModes = modes.map(mode => {
        const fluctuation = (Math.random() - 0.5) * 4;
        const newEfficiency = Math.max(10, Math.min(100, mode.efficiency + fluctuation));
        const newActiveUnits = mode.active_units + Math.floor((Math.random() - 0.5) * 10);
        const newAvgSpeed = Math.max(1, mode.avg_speed + (Math.random() - 0.5) * 2);

        db.prepare("UPDATE transit_modes SET efficiency = ?, active_units = ?, avg_speed = ?, updated_at = datetime('now') WHERE id = ?")
            .run(Math.round(newEfficiency * 10) / 10, Math.max(0, newActiveUnits), Math.round(newAvgSpeed * 10) / 10, mode.id);

        return {
            ...mode,
            efficiency: Math.round(newEfficiency * 10) / 10,
            active_units: Math.max(0, newActiveUnits),
            avg_speed: Math.round(newAvgSpeed * 10) / 10
        };
    });

    // Update system metrics
    const gridLoad = Math.max(10, Math.min(95, (systemMetrics?.grid_load || 42.8) + (Math.random() - 0.5) * 3));
    const activeUnits = Math.max(500, (systemMetrics?.active_units || 1240) + Math.floor((Math.random() - 0.5) * 20));
    const latency = Math.max(1, Math.min(50, (systemMetrics?.latency_ms || 4) + (Math.random() - 0.5) * 2));
    const congestionLevels = ['LOW', 'LOW', 'LOW', 'MODERATE', 'HIGH'];
    const congestion = congestionLevels[Math.floor(Math.random() * congestionLevels.length)];

    db.prepare(`INSERT INTO system_metrics (grid_load, congestion_index, active_units, latency_ms, efficiency_coefficient, timestamp)
                VALUES (?, ?, ?, ?, ?, datetime('now'))`)
        .run(
            Math.round(gridLoad * 10) / 10,
            congestion,
            activeUnits,
            Math.round(latency * 10) / 10,
            Math.round((0.85 + Math.random() * 0.14) * 100) / 100
        );

    const latestMetrics = db.prepare('SELECT * FROM system_metrics ORDER BY id DESC LIMIT 1').get();

    // Update fleet positions
    fleetVehicles.forEach(v => {
        const newLat = v.latitude + (Math.random() - 0.5) * 0.002;
        const newLng = v.longitude + (Math.random() - 0.5) * 0.002;
        const statuses = ['moving', 'moving', 'moving', 'idle', 'charging'];
        const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
        db.prepare("UPDATE fleet_vehicles SET latitude = ?, longitude = ?, status = ?, updated_at = datetime('now') WHERE id = ?")
            .run(newLat, newLng, newStatus, v.id);
    });

    const updatedFleet = db.prepare('SELECT * FROM fleet_vehicles LIMIT 20').all();

    // Get historical metrics for charts
    const history = db.prepare('SELECT grid_load, congestion_index, active_units, latency_ms, efficiency_coefficient, timestamp FROM system_metrics ORDER BY id DESC LIMIT 30').all().reverse();

    // Generate energy data
    const energyData = {
        solar: Math.round(20 + Math.random() * 30),
        wind: Math.round(10 + Math.random() * 25),
        grid: Math.round(20 + Math.random() * 40),
        regenerative: Math.round(5 + Math.random() * 15)
    };

    return {
        timestamp: new Date().toISOString(),
        transitModes: updatedModes,
        systemMetrics: latestMetrics,
        alerts,
        fleet: updatedFleet,
        history,
        energy: energyData
    };
}

// WebSocket connection handling
wss.on('connection', (ws) => {
    console.log('🔌 Client connected to WebSocket');

    // Send initial data immediately
    try {
        const initialData = generateLiveMetrics();
        ws.send(JSON.stringify({ type: 'initial', data: initialData }));
    } catch (err) {
        console.error('Error sending initial data:', err);
    }

    ws.on('close', () => {
        console.log('🔌 Client disconnected');
    });

    ws.on('error', (err) => {
        console.error('WebSocket error:', err);
    });
});

// Broadcast live data every 2 seconds
setInterval(() => {
    if (wss.clients.size > 0) {
        try {
            const liveData = generateLiveMetrics();
            const message = JSON.stringify({ type: 'update', data: liveData });

            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            });
        } catch (err) {
            console.error('Broadcast error:', err);
        }
    }
}, 2000);

// Randomly generate alerts
setInterval(() => {
    const alertTypes = [
        { severity: 'warning', title: 'Bus Route Delay', message: 'Route B7 experiencing 12min delay due to congestion on Main St', mode: 'bus' },
        { severity: 'critical', title: 'Metro Signal Failure', message: 'Signal degradation detected at Station Delta-9', mode: 'metro' },
        { severity: 'info', title: 'Fleet Optimization', message: 'AI rerouting 15 EV units to high-demand Zone 4', mode: 'cab' },
        { severity: 'warning', title: 'Bike Dock Full', message: 'Station Echo-3 at 98% capacity. Rebalancing initiated', mode: 'bike' },
        { severity: 'info', title: 'Pedestrian Surge', message: 'Walk corridor Alpha detecting 340% normal foot traffic', mode: 'walk' },
        { severity: 'critical', title: 'Grid Overload Risk', message: 'Energy consumption approaching 90% threshold in Sector 7-G', mode: 'system' },
        { severity: 'info', title: 'EV Charging Spike', message: '23 vehicles queued at rapid charge station Foxtrot-1', mode: 'cab' },
        { severity: 'warning', title: 'Weather Advisory', message: 'Heavy rain predicted in 45min — activating wet-road protocols', mode: 'system' },
    ];

    const alert = alertTypes[Math.floor(Math.random() * alertTypes.length)];

    // Deactivate old alerts if too many
    const count = db.prepare('SELECT COUNT(*) as cnt FROM alerts WHERE active = 1').get();
    if (count.cnt > 20) {
        db.prepare('UPDATE alerts SET active = 0 WHERE id IN (SELECT id FROM alerts WHERE active = 1 ORDER BY created_at ASC LIMIT 5)').run();
    }

    db.prepare("INSERT INTO alerts (severity, title, message, mode, active, created_at) VALUES (?, ?, ?, ?, 1, datetime('now'))")
        .run(alert.severity, alert.title, alert.message, alert.mode);

}, 8000);

server.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════╗
║                                                      ║
║   ⚡ HYPER-ELECTRIC MOBILITY DASHBOARD               ║
║   🌐 Server running at http://localhost:${PORT}         ║
║   📡 WebSocket active on ws://localhost:${PORT}         ║
║   🗄️  SQLite database initialized                     ║
║                                                      ║
╚══════════════════════════════════════════════════════╝
    `);
});
