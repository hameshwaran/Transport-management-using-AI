let charts = {}; // Store chart instances
let currentUserIndex = 0;
let users = [
  { name: "Admin", role: "Master Admin", avatar: "A" },
  { name: "Sarah J.", role: "Fleet Manager", avatar: "S" },
  { name: "Mike R.", role: "Maintenance Tech", avatar: "M" }
];

// Persistence Logic
const STORAGE_KEY = 'fleetai_app_state';

function saveState() {
  const state = {
    fleetData,
    scheduleData,
    users,
    currentUserIndex
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const state = JSON.parse(saved);
      if (state.fleetData) fleetData = state.fleetData;
      if (state.scheduleData) scheduleData = state.scheduleData;
      if (state.users) users = state.users;
      if (state.currentUserIndex !== undefined) currentUserIndex = state.currentUserIndex;
    } catch (e) {
      console.error("Failed to load saved state:", e);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadState(); // Restore last saved details
  initLogin();
  updateLoginDropdown();
  startTelemetrySimulation(); // Start background AI logic
});

function updateLoginDropdown() {
  const dropdown = document.getElementById('login-role');
  if (dropdown) {
    dropdown.innerHTML = users.map((u, i) => `
      <option value="${i}">${u.name} (${u.role})</option>
    `).join('');
  }
}

function initLogin() {
  const loginBtn = document.getElementById('login-btn');
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      const roleIndex = document.getElementById('login-role').value;
      currentUserIndex = parseInt(roleIndex);
      
      // Hide login, show app
      document.getElementById('login-screen').style.display = 'none';
      document.querySelector('.app-container').style.display = 'flex';
      
      // Initialize app
      initNavigation();
      updateGlobalUI();
      updateAdminUI();
      renderDashboard();
      initDataGeneration();
      initRoleManagement();
      initSettingsLogic();
      saveState();
    });
  }
}

function initSettingsLogic() {
  const thresholdSlider = document.getElementById('threshold-slider');
  const sensitivitySlider = document.getElementById('sensitivity-slider');

  if (thresholdSlider) {
    thresholdSlider.addEventListener('input', (e) => {
      document.getElementById('threshold-val').innerText = e.target.value + '%';
    });
    thresholdSlider.addEventListener('change', () => alert("AI Critical Threshold updated. Monitoring engine telemetry..."));
  }

  if (sensitivitySlider) {
    sensitivitySlider.addEventListener('input', (e) => {
      const val = e.target.value;
      const label = val > 75 ? 'Ultra' : val > 50 ? 'High' : val > 25 ? 'Balanced' : 'Low';
      document.getElementById('sensitivity-val').innerText = label;
    });
    sensitivitySlider.addEventListener('change', () => alert("Predictive Sensitivity re-calibrated. Recalculating failure probabilities..."));
  }

  // Generic toggle feedback
  document.querySelectorAll('#settings-section input[type="checkbox"]').forEach(toggle => {
    toggle.addEventListener('change', () => alert("Settings preference saved."));
  });

  initDataManagement();
}

function initDataManagement() {
  const exportBtn = document.getElementById('export-csv-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const headers = "Vehicle ID,Type,Status,Health,Last Service\n";
      const rows = fleetData.map(v => `${v.id},${v.type},${v.status},${v.health}%,${v.lastService}`).join('\n');
      const blob = new Blob([headers + rows], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fleet_telemetry_export_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      alert("Fleet data successfully exported to CSV.");
    });
  }

  const clearBtn = document.getElementById('clear-data-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm("Are you sure you want to clear all simulation data? This will reset the fleet to factory defaults.")) {
        // Reset to initial state (example reset)
        localStorage.removeItem(STORAGE_KEY);
        location.reload(); // Simplest way to reset the simulation state in Vanilla
      }
    });
  }
}

function initRoleManagement() {
  const createBtn = document.getElementById('create-role-btn');
  if (createBtn) {
    createBtn.addEventListener('click', () => {
      const name = prompt("Enter User Name:");
      const role = prompt("Enter Role Title (e.g., Logistic Ops):");
      if (name && role) {
        users.push({
          name: name,
          role: role,
          avatar: name.charAt(0).toUpperCase()
        });
        updateLoginDropdown();
        saveState();
        alert(`New role "${role}" created for ${name}. This user can now sign in.`);
      }
    });
  }

  const logsBtn = document.getElementById('view-team-logs-btn');
  if (logsBtn) {
    logsBtn.addEventListener('click', () => {
      const logs = [
        "[10:42 AM] Sarah J. (Fleet Manager) signed in.",
        "[11:15 AM] Admin created a new 'Maintenance Tech' role.",
        "[01:22 PM] Mike R. resolved a Critical Alert for TRK-2940.",
        "[02:45 PM] AI System updated maintenance thresholds.",
        "[04:10 PM] Weekly fleet summary report exported to CSV."
      ];
      alert("Administrative Team Logs:\n\n" + logs.join('\n'));
    });
  }

  const systemStatusBtn = document.createElement('button');
  systemStatusBtn.id = 'view-system-status-btn';
  systemStatusBtn.className = 'btn btn-outline';
  systemStatusBtn.innerText = 'Generate System Status Report';
  systemStatusBtn.style.marginTop = '1rem';
  
  const manageTeamPanel = document.querySelector('#settings-section .glass-panel:nth-child(3)');
  if (manageTeamPanel) {
    manageTeamPanel.appendChild(systemStatusBtn);
    systemStatusBtn.addEventListener('click', () => {
      const healthy = fleetData.filter(v => v.status === 'Healthy').length;
      const uptime = (Math.random() * 5 + 95).toFixed(2);
      alert(`System Status Report:\n\nFleet Integrity: ${(healthy / fleetData.length * 100).toFixed(1)}%\nAI Engine Uptime: ${uptime}%\nLast Prediction Batch: Just Now\nSensor Data Integrity: Optimal`);
    });
  }
}

function updateGlobalUI() {
  const count = fleetData.filter(v => v.status !== 'Healthy').length;
  const countEl = document.getElementById('notification-count');
  if (countEl) {
    countEl.innerText = count;
    countEl.style.display = count > 0 ? 'block' : 'none';
  }
}

// Navigation Logic
function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const sections = ['dashboard', 'fleet', 'schedule', 'alerts', 'settings'];

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const target = item.getAttribute('data-section');
      if (!target) return;

      // Update UI
      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      sections.forEach(s => {
        const el = document.getElementById(s + '-section');
        if (el) el.hidden = (s !== target);
      });

      // Render section specific content
      if (target === 'dashboard') renderDashboard();
      if (target === 'fleet') renderFleet();
      if (target === 'schedule') renderSchedule();
      if (target === 'alerts') renderAlerts();
    });
  });
}

// Data Generation Logic
function initDataGeneration() {
  const addVehicleBtn = document.getElementById('add-vehicle-btn');
  if (addVehicleBtn) {
    addVehicleBtn.addEventListener('click', () => {
      const id = prompt("Enter Vehicle ID (e.g., TRK-5000):", "TRK-" + Math.floor(Math.random() * 9000 + 1000));
      if (id) {
        const newVehicle = {
          id: id,
          type: "New Vehicle",
          status: "Healthy",
          health: 100,
          lastService: new Date().toISOString().split('T')[0],
          component: "General",
          confidence: 0
        };
        fleetData.unshift(newVehicle); // Add to beginning
        saveState();
        renderFleet();
        alert(`Vehicle ${id} added successfully!`);
      }
    });
  }

  const generateScheduleBtn = document.getElementById('generate-schedule-btn');
  if (generateScheduleBtn) {
    generateScheduleBtn.addEventListener('click', () => {
      const newTask = {
        id: "TSK-" + Math.floor(Math.random() * 900 + 100),
        vehicle: fleetData[Math.floor(Math.random() * fleetData.length)].id,
        type: Math.random() > 0.5 ? "Predictive" : "Routine",
        component: "System Check",
        status: "Scheduled",
        time: "11:00"
      };
      
      // Add to tomorrow's tasks for demonstration
      scheduleData[1].tasks.push(newTask);
      saveState();
      renderSchedule();
      alert("AI has generated a new maintenance window based on real-time telemetry!");
    });
  }

  // Notification Bell Toggle
  const bell = document.getElementById('notification-bell');
  const dropdown = document.getElementById('notification-dropdown');
  if (bell && dropdown) {
    bell.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
      renderNotificationList();
    });
    document.addEventListener('click', () => dropdown.style.display = 'none');
  }

  // Admin Profile Multi-User Simulation
  const adminProfile = document.getElementById('admin-profile');
  if (adminProfile) {
    adminProfile.addEventListener('click', () => {
      const user = users[currentUserIndex];
      const nextIndex = (currentUserIndex + 1) % users.length;
      const nextUser = users[nextIndex];
      
      const action = prompt(`Signed in as: ${user.name} (${user.role})\n\nType 'S' to Switch to ${nextUser.name}\nType 'L' to Logout\nType 'C' to Cancel`).toUpperCase();
      
      if (action === 'S') {
        currentUserIndex = nextIndex;
        updateAdminUI();
        saveState();
        alert(`Successfully switched to ${nextUser.name} session.`);
      } else if (action === 'L') {
        // Logout Logic
        document.getElementById('login-screen').style.display = 'flex';
        document.querySelector('.app-container').style.display = 'none';
        alert("Session terminated. Returning to Sign-In page.");
      }
    });
  }
}

function updateAdminUI() {
  const user = users[currentUserIndex];
  const avatarEl = document.querySelector('#admin-profile .avatar');
  const nameEl = document.querySelector('#admin-profile div > div:first-child');
  const roleEl = document.querySelector('#admin-profile div > div:last-child');
  
  if (avatarEl) avatarEl.innerText = user.avatar;
  if (nameEl) nameEl.innerText = user.name;
  if (roleEl) roleEl.innerText = user.role;
}

function renderNotificationList() {
  const list = document.getElementById('notification-list');
  const alerts = fleetData.filter(v => v.status !== 'Healthy');
  if (list) {
    list.innerHTML = alerts.length ? alerts.map(a => `
      <div style="padding: 0.5rem 0; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 0.8rem;">
        <span style="color: ${a.status === 'Critical' ? 'var(--accent-danger)' : 'var(--accent-warning)'}">●</span>
        <strong>${a.id}</strong>: ${a.component} Alert
      </div>
    `).join('') : '<p class="text-subtle">No active alerts</p>';
  }
}

// Section Rendering
function renderDashboard() {
  const container = document.getElementById('dashboard-section');
  if (!container || container.hidden) return;

  // Calculate dynamic metrics
  const totalVehicles = fleetData.length;
  const criticalAlerts = fleetData.filter(v => v.status === 'Critical').length;
  const costSaved = predictionTrend.reduce((acc, curr) => acc + curr.cost, 0);

  document.getElementById('metric-total-vehicles').innerText = totalVehicles;
  document.getElementById('metric-critical-alerts').innerText = criticalAlerts;
  document.getElementById('metric-cost-saved').innerText = '$' + costSaved.toLocaleString();

  // Populate Recommendations Table
  const tableBody = document.getElementById('recommendations-table');
  if (tableBody) {
    const criticalVehicles = fleetData.filter(v => v.status !== 'Healthy').slice(0, 5);
    tableBody.innerHTML = criticalVehicles.map(v => `
      <tr>
        <td><strong>${v.id}</strong></td>
        <td>${v.component}</td>
        <td>${v.confidence}%</td>
        <td><span class="status-badge status-${v.status.toLowerCase()}">${v.status}</span></td>
        <td><button class="btn ${v.status === 'Critical' ? 'btn-primary' : 'btn-outline'} recommendation-action" data-id="${v.id}" data-action="${v.status === 'Critical' ? 'schedule' : 'details'}" style="padding: 0.25rem 0.75rem;">${v.status === 'Critical' ? 'Schedule' : 'Details'}</button></td>
      </tr>
    `).join('');

    // Attach event listeners
    tableBody.querySelectorAll('.recommendation-action').forEach(btn => {
      btn.addEventListener('click', () => {
        const vehicleId = btn.getAttribute('data-id');
        const action = btn.getAttribute('data-action');
        handleRecommendation(vehicleId, action);
      });
    });
  }

  // Cleanup old charts
  if (charts.cost) charts.cost.destroy();
  if (charts.dist) charts.dist.destroy();

  // Initialize Charts
  const costCtx = document.getElementById('costChart').getContext('2d');
  charts.cost = new Chart(costCtx, {
    type: 'line',
    data: {
      labels: predictionTrend.map(d => d.day),
      datasets: [{
        label: 'Cost Saved ($)',
        data: predictionTrend.map(d => d.cost),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b' } },
        x: { grid: { display: false }, ticks: { color: '#64748b' } }
      }
    }
  });

  const distCtx = document.getElementById('distChart').getContext('2d');
  charts.dist = new Chart(distCtx, {
    type: 'bar',
    data: {
      labels: maintenanceDistribution.map(d => d.component),
      datasets: [
        { label: 'Planned', data: maintenanceDistribution.map(d => d.planned), backgroundColor: '#3b82f6' },
        { label: 'Predictive', data: maintenanceDistribution.map(d => d.predictive), backgroundColor: '#8b5cf6' }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#f8fafc' } } },
      scales: {
        y: { stacked: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b' } },
        x: { stacked: true, grid: { display: false }, ticks: { color: '#64748b' } }
      }
    }
  });
}

function handleRecommendation(vehicleId, action) {
  if (action === 'schedule') {
    const vehicle = fleetData.find(v => v.id === vehicleId);
    const newTask = {
      id: "TSK-" + Math.floor(Math.random() * 900 + 100),
      vehicle: vehicleId,
      type: "Predictive",
      component: vehicle ? vehicle.component : "System Check",
      status: "Scheduled",
      time: "09:00"
    };
    
    // Add to tomorrow's schedule
    scheduleData[1].tasks.push(newTask);
    saveState();
    alert(`AI Recommendation Accepted: Maintenance scheduled for ${vehicleId} tomorrow at 09:00.`);
  } else {
    alert(`Viewing detailed telematics logs for ${vehicleId}... (Simulation)`);
  }
}

function renderFleet() {
  const grid = document.getElementById('fleet-grid');
  if (!grid) return;
  grid.innerHTML = fleetData.map(v => `
    <div class="glass-panel glass-card-interactive animate-fade-in" style="padding: 1.5rem">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem">
        <div>
          <h3 class="heading-3">${v.id}</h3>
          <span class="text-subtle">${v.type}</span>
        </div>
        <span class="status-badge status-${v.status.toLowerCase()}">${v.status}</span>
      </div>
      <div style="margin: 1.5rem 0">
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem">
          <span class="text-subtle">Overall Health</span>
          <span style="font-weight: 600">${v.health}%</span>
        </div>
        <div class="progress-bg">
          <div class="progress-fill" style="width: ${v.health}%; background: ${v.health > 80 ? '#10b981' : v.health > 60 ? '#f59e0b' : '#ef4444'}"></div>
        </div>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 1rem">
        <span class="text-subtle">Last Service: ${v.lastService}</span>
        <button class="btn btn-outline telematics-action" data-id="${v.id}" style="padding: 0.25rem 0.5rem; font-size: 0.75rem">View Telematics</button>
      </div>
    </div>
  `).join('');

  // Attach event listeners
  grid.querySelectorAll('.telematics-action').forEach(btn => {
    btn.addEventListener('click', () => {
      const vehicleId = btn.getAttribute('data-id');
      alert(`Fetching live telemetry for ${vehicleId}...\n\nEngine Temp: 92°C\nOil Pressure: 45 PSI\nFuel Rate: 8.2 L/h\nGPS Status: Locked`);
    });
  });
}

function renderSchedule() {
  const container = document.getElementById('schedule-timeline');
  if (!container) return;
  container.innerHTML = scheduleData.map(day => `
    <div class="day-group animate-fade-in">
      <h3 class="heading-3" style="color: var(--accent-primary); margin-bottom: 1rem">${day.date}</h3>
      <div class="task-list">
        ${day.tasks.map(t => `
          <div class="task-card">
            <div class="task-time">${t.time}</div>
            <div style="flex: 1">
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem">
                <h4 style="font-weight: 600">${t.vehicle} - ${t.component}</h4>
                <span class="status-badge ${t.type === 'Predictive' ? 'status-critical' : 'status-healthy'}" style="font-size: 0.65rem">${t.type}</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center">
                <span class="text-subtle" style="font-size: 0.875rem">Task ID: ${t.id}</span>
                <span style="font-size: 0.875rem; color: ${t.status === 'In Progress' ? 'var(--accent-warning)' : 'var(--text-muted)'}">${t.status}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function renderAlerts() {
  const container = document.getElementById('alerts-list');
  if (!container) return;
  
  const alerts = fleetData.filter(v => v.status !== 'Healthy');
  
  container.innerHTML = alerts.map(a => `
    <div class="glass-panel animate-fade-in" style="padding: 1.5rem; display: flex; align-items: center; gap: 1.5rem; border-left: 4px solid ${a.status === 'Critical' ? 'var(--accent-danger)' : 'var(--accent-warning)'}">
      <div style="font-size: 1.5rem;">${a.status === 'Critical' ? '🚨' : '⚠️'}</div>
      <div style="flex: 1">
        <h4 style="font-weight: 600; margin-bottom: 0.25rem;">${a.status} Maintenance Alert: ${a.id}</h4>
        <p class="text-subtle">AI predicts ${a.component} failure with ${a.confidence}% confidence.</p>
      </div>
      <button class="btn btn-primary fix-now-btn" data-id="${a.id}">Fix Now</button>
    </div>
  `).join('');

  // Attach event listeners to Fix Now buttons
  container.querySelectorAll('.fix-now-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const vehicleId = btn.getAttribute('data-id');
      const vehicle = fleetData.find(v => v.id === vehicleId);
      if (vehicle) {
        vehicle.status = 'Healthy';
        vehicle.health = 100;
        vehicle.confidence = 0;
        saveState();
        alert(`Issue resolved for ${vehicleId}. Vehicle health restored to 100%.`);
        updateGlobalUI();
        renderAlerts();
      }
    });
  });
}

// Telemetry Simulation logic
function startTelemetrySimulation() {
  setInterval(() => {
    // Randomly fluctuate health of 1-2 vehicles
    const count = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < count; i++) {
      const idx = Math.floor(Math.random() * fleetData.length);
      const vehicle = fleetData[idx];
      
      // Small fluctuation
      const delta = (Math.random() * 2 - 1).toFixed(1);
      vehicle.health = Math.min(100, Math.max(10, parseFloat(vehicle.health) + parseFloat(delta))).toFixed(1);
      
      // If health drops significantly, update status
      if (vehicle.health < 50) vehicle.status = 'Critical';
      else if (vehicle.health < 75) vehicle.status = 'Warning';
      else vehicle.status = 'Healthy';
    }
    
    updateGlobalUI();
    
    // Silently re-render current section if it's the dashboard or fleet
    const activeNav = document.querySelector('.nav-item.active');
    if (activeNav) {
      const section = activeNav.getAttribute('data-section');
      if (section === 'dashboard') renderDashboard();
      if (section === 'fleet') renderFleet();
    }
  }, 10000); // Every 10 seconds
}
