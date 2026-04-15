/* app.js */

// Initialize Icons
lucide.createIcons();

// Navigation Logic
const navItems = document.querySelectorAll('.nav-links li');
const views = document.querySelectorAll('.view');
const topHeaderTitle = document.querySelector('.top-header h2');

const viewTitles = {
    'dashboard': 'Overview Dashboard',
    'venues': 'Site Map & Queue Monitior',
    'alerts': 'Live System Alerts',
    'recommendations': 'AI Recommendations'
};

navItems.forEach(item => {
    item.addEventListener('click', () => {
        // Update active nav state
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');

        // Show proper view
        const targetView = item.getAttribute('data-tab');
        views.forEach(view => {
            if (view.id === `view-${targetView}`) {
                view.classList.add('active');
                view.classList.remove('hidden');
            } else {
                view.classList.remove('active');
                view.classList.add('hidden');
            }
        });

        // Update header title
        if (topHeaderTitle && viewTitles[targetView]) {
            topHeaderTitle.textContent = viewTitles[targetView];
        }

    });
});

// Mock Data Models
const queues = [
    { id: 1, name: 'Food Court Main', type: 'Food', waitTime: 45, maxTime: 60 },
    { id: 2, name: 'Restroom North', type: 'Facilities', waitTime: 5, maxTime: 15 },
    { id: 3, name: 'Merch Stand B', type: 'Merchandise', waitTime: 25, maxTime: 30 },
    { id: 4, name: 'Entry Gate 2', type: 'Access', waitTime: 12, maxTime: 20 },
    { id: 5, name: 'Meet & Greet VIP', type: 'Activity', waitTime: 55, maxTime: 60 },
    { id: 6, name: 'Food Truck Lane', type: 'Food', waitTime: 18, maxTime: 30 }
];

const alertsData = [
    { type: 'critical', title: 'Overcrowded Zone', desc: 'Main Stage area is currently at 95% capacity. AI recommending alternative flow routes dynamically to VIP attendees.', time: 'Just now', icon: 'alert-triangle' },
    { type: 'warning', title: 'High Queue Time Peak', desc: 'Food Court Main waiting time exceeds 45 mins. Suggested vendor restock alert sent.', time: '5m ago', icon: 'clock' },
    { type: 'info', title: 'Facility Update', desc: 'Restroom South maintenance completed. Queues are flowing normally.', time: '15m ago', icon: 'info' }
];

const recommendationsData = [
    {
        title: "Smart Route Generation",
        desc: "Main stage is overly crowded. Engine suggests routing incoming flow through East Corridor to bypass Gate 1. Dispatch guards to update signage.",
        action: "Deploy Alternate Route",
        icon: "map-pin"
    },
    {
        title: "Resource Allocation",
        desc: "Food Court Main queues are peaking and demand is high for beverages. AI suggests dispatch of 4 moving snack vendors to Sector C.",
        action: "Dispatch Vendors",
        icon: "truck"
    },
    {
        title: "Dynamic Notification",
        desc: "Weather API indicates incoming light rain in 20 minutes. Recommend sending a push notification to all users about covered viewing spots near Pavilion.",
        action: "Broadcast Notification",
        icon: "cloud-rain"
    },
    {
        title: "Capacity Planning",
        desc: "Stage 2 performances ends in 10 minutes. AI predicts 2,000 attendees moving towards Food Court. Recommend pre-emptively opening secondary lanes.",
        action: "Open Contingency Lanes",
        icon: "users"
    }

];

// Helper to get status class based on wait percentage
function getStatusClass(wait, max) {
    const pct = (wait / max) * 100;
    if (pct > 75) return 'status-high';
    if (pct > 40) return 'status-medium';
    return 'status-low';
}

function getWaitLabelClass(wait, max) {
    const pct = (wait / max) * 100;
    if (pct > 75) return 'text-danger';
    if (pct > 40) return 'text-warning';
    return 'text-success';
}

// Render Dashboard Queues
function renderDashboardQueues() {
    const container = document.getElementById('queue-list-container');
    if (!container) return;

    // Sort by wait time descending for dashboard
    const sorted = [...queues].sort((a, b) => (b.waitTime / b.maxTime) - (a.waitTime / a.maxTime)).slice(0, 4);

    container.innerHTML = sorted.map(q => {
        const pct = Math.min((q.waitTime / q.maxTime) * 100, 100);
        return `
        <div class="queue-item">
            <div class="queue-header">
                <span>${q.name}</span>
                <span class="queue-time ${getWaitLabelClass(q.waitTime, q.maxTime)}">${q.waitTime} min</span>
            </div>
            <div class="progress-track">
                <div class="progress-bar ${getStatusClass(q.waitTime, q.maxTime)}" style="width: ${pct}%"></div>
            </div>
        </div>
        `;
    }).join('');
}

// Render Venues Detailed
function renderVenues() {
    const container = document.getElementById('venues-detailed-container');
    if (!container) return;

    container.innerHTML = queues.map(q => {
        const pct = Math.min((q.waitTime / q.maxTime) * 100, 100);
        return `
        <div class="venue-card glass-panel">
            <div class="venue-card-header">
                <div class="venue-card-title">${q.name}</div>
                <div class="venue-type">${q.type}</div>
            </div>
            <p class="text-muted" style="margin-bottom: 1rem; font-size: 0.9rem;">Engine estimate derived from live crowd telemetry data.</p>
            <div class="queue-header" style="margin-bottom: 0.5rem">
                <span>Current Wait Est.</span>
                <span class="queue-time ${getWaitLabelClass(q.waitTime, q.maxTime)}">${q.waitTime} mins</span>
            </div>
            <div class="progress-track">
                <div class="progress-bar ${getStatusClass(q.waitTime, q.maxTime)}" style="width: ${pct}%"></div>
            </div>
        </div>
        `;
    }).join('');
}

// Render Alerts
function renderAlerts() {
    const container = document.getElementById('alerts-list-container');
    if (!container) return;

    container.innerHTML = alertsData.map(a => `
        <div class="alert-item glass-panel ${a.type}">
            <div class="alert-icon">
                <i data-lucide="${a.icon}"></i>
            </div>
            <div class="alert-content">
                <h4>${a.title}</h4>
                <p>${a.desc}</p>
            </div>
            <div class="alert-time">${a.time}</div>
        </div>
    `).join('');
}

// Render Recommendations
function renderRecommendations() {
    const container = document.getElementById('recommendations-container');
    if (!container) return;

    container.innerHTML = recommendationsData.map(r => `
        <div class="rec-card glass-panel">
            <div class="rec-header">
                <i data-lucide="${r.icon}" class="rec-icon"></i>
                <h4 style="font-size: 1.1rem; font-weight: 600;">${r.title}</h4>
            </div>
            <p class="text-muted" style="line-height: 1.5; font-size: 0.95rem;">${r.desc}</p>
            <div class="rec-action">
                <span>${r.action}</span>
                <i data-lucide="arrow-right" style="width: 16px; height: 16px;"></i>
            </div>
        </div>
    `).join('');

    // re-init icons for newly added HTML
    lucide.createIcons();
}

// Initialize application data
function initApp() {
    renderDashboardQueues();
    renderVenues();
    renderAlerts();
    renderRecommendations();
    lucide.createIcons();
}

// Start
document.addEventListener('DOMContentLoaded', initApp);

// Simulate real-time updates for feeling dynamic
setInterval(() => {
    // Randomly fluctuate a queue time slightly
    const randomIdx = Math.floor(Math.random() * queues.length);
    const fluctuation = Math.floor(Math.random() * 5) - 2; // -2 to +2
    const targetQueue = queues[randomIdx];

    // Don't let it go below 0 or above maxTime wildly
    targetQueue.waitTime = Math.min(targetQueue.maxTime * 1.5, Math.max(0, targetQueue.waitTime + fluctuation));

    // Re-render components with dynamic queues
    renderDashboardQueues();
    renderVenues();
}, 6000);
