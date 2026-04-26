# FleetAI Architecture

## Overview
FleetAI is a premium, client-side application designed to simulate an AI-driven transport maintenance optimization system. It uses a **Vanilla JavaScript** architecture to ensure maximum portability, high performance, and zero server-side dependencies for demonstration purposes.

## Core Components

### 1. Presentation Layer (`index.html` & `src/css/styles.css`)
- **Glassmorphism UI**: Uses modern CSS back-drop filters and gradients to create a high-end, futuristic dashboard feel.
- **Responsive Layout**: A sidebar-driven navigation system that works across various screen sizes.
- **Inter Font System**: Leverages the Inter typeface for professional readability.

### 2. Logic Layer (`src/js/app.js`)
- **State Management**: Uses simple global objects to track fleet status, maintenance schedules, and the current user session.
- **Navigation Engine**: A custom SPA (Single Page Application) router that handles section switching without page reloads.
- **Chart Integration**: Uses `Chart.js` for real-time data visualization.
- **Authentication Simulation**: A role-based sign-in system that manages user profiles and avatars.

### 3. Data Layer (`src/js/data.js`)
- **Static Telemetry**: Initialized with mock data for vehicles, prediction trends, and maintenance task lists.
- **Dynamic Updates**: The application logic modifies these data sets in-memory during a session (e.g., adding vehicles, fixing alerts).

## AI Predictive Logic
The "AI" in FleetAI is simulated using a probability-based engine:
- **Health Metrics**: Calculated based on simulated mileage, engine hours, and component age.
- **Confidence Scores**: Randomly weighted factors that mimic a machine learning model's uncertainty.
- **Recommendation Engine**: Filters the fleet for "non-healthy" vehicles and prioritizes actions based on "Critical" vs "Warning" status.

## PWA Capabilities
- **Installability**: Defined via `manifest.json`.
- **Service Worker**: Handles basic caching to allow the app to function offline once loaded.
