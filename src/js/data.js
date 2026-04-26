let fleetData = [
  { id: 'TRK-2940', type: 'Heavy Duty', status: 'Critical', health: 42, lastService: '2026-01-15', component: 'Engine Cooling System', confidence: 94 },
  { id: 'VAN-1102', type: 'Delivery Van', status: 'Warning', health: 68, lastService: '2026-03-02', component: 'Transmission Fluid', confidence: 82 },
  { id: 'TRK-8821', type: 'Heavy Duty', status: 'Healthy', health: 95, lastService: '2026-04-10', component: 'Brake Pads', confidence: 65 },
  { id: 'TRK-4432', type: 'Medium Duty', status: 'Healthy', health: 88, lastService: '2026-02-28', component: 'Tires', confidence: 20 },
  { id: 'VAN-5521', type: 'Delivery Van', status: 'Healthy', health: 91, lastService: '2026-04-05', component: 'Air Filter', confidence: 15 },
  { id: 'TRK-9012', type: 'Heavy Duty', status: 'Warning', health: 74, lastService: '2025-11-20', component: 'Battery', confidence: 45 },
];

let predictionTrend = [
  { day: 'Mon', cost: 1200 },
  { day: 'Tue', cost: 900 },
  { day: 'Wed', cost: 2100 },
  { day: 'Thu', cost: 600 },
  { day: 'Fri', cost: 1500 },
  { day: 'Sat', cost: 300 },
  { day: 'Sun', cost: 1800 },
];

let maintenanceDistribution = [
  { component: 'Engine', planned: 40, predictive: 60 },
  { component: 'Brakes', planned: 80, predictive: 20 },
  { component: 'Tires', planned: 90, predictive: 10 },
  { component: 'Transmission', planned: 30, predictive: 70 },
];

let scheduleData = [
  { date: 'Today, 25 Apr', tasks: [
    { id: 'TSK-091', vehicle: 'TRK-2940', type: 'Predictive', component: 'Engine Cooling System', status: 'Pending', time: '14:00' },
    { id: 'TSK-092', vehicle: 'VAN-4410', type: 'Routine', component: 'Oil Change', status: 'In Progress', time: '09:00' }
  ]},
  { date: 'Tomorrow, 26 Apr', tasks: [
    { id: 'TSK-093', vehicle: 'VAN-1102', type: 'Predictive', component: 'Transmission Fluid', status: 'Scheduled', time: '10:00' }
  ]},
  { date: 'Wednesday, 28 Apr', tasks: [
    { id: 'TSK-094', vehicle: 'TRK-8821', type: 'Routine', component: 'Tire Rotation', status: 'Scheduled', time: '08:00' },
    { id: 'TSK-095', vehicle: 'TRK-9012', type: 'Predictive', component: 'Brake Inspection', status: 'Scheduled', time: '13:00' }
  ]}
];
