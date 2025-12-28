# ERNEST PLATFORM

> **Context-Aware Construction Management System**

ERNEST is a dual-platform construction management solution consisting of a premium web dashboard and a context-aware mobile application designed specifically for superintendents and construction teams.

## 📋 Description

ERNEST is a dual-platform construction management system with a premium web dashboard (React + Supabase) featuring real-time Kanban boards, financial tracking, and compliance monitoring, plus a context-aware mobile app (React Native + Realm) that uses device sensors to adapt UI based on location (office/field/vehicle) with offline-first sync.

---

## ✨ Features

### Web Dashboard (Proactive Office View)
- **Real-Time Project Kanban**: Drag-and-drop project management with live Supabase sync
- **Financial Tracking**: Budget monitoring, variance analysis, and spending trends
- **Compliance Management**: Certification tracking (ISO, OSHA) and incident reporting
- **Multi-Site Oversight**: Interactive list/map views for all construction sites
- **Search & Notifications**: Global search and real-time notification system
- **Premium UI**: Glassmorphic design with dark navy theme and cyan accents

### Mobile App (Context-Aware Field Operations)
- **Automatic Context Detection**: Uses GPS, accelerometer, and Bluetooth beacons
- **Adaptive UI Modes**:
  - **Office Mode**: Full task management and reporting
  - **Field Mode**: Quick capture, punch lists, photo documentation
  - **Vehicle Mode**: Minimal interface with safety-first design
- **Offline-First Architecture**: Realm database with automatic sync
- **Background Services**: Location tracking and data synchronization

---

## 🛠️ Tech Stack

### Web Application
- **Frontend**: React 19, TypeScript, Tailwind CSS, Framer Motion
- **Routing**: React Router DOM
- **State Management**: TanStack Query (React Query)
- **Backend**: Supabase (PostgreSQL + Real-time subscriptions)
- **UI Libraries**: Lucide React (icons), @hello-pangea/dnd (drag-and-drop)

### Mobile Application
- **Framework**: Expo SDK 54, React Native
- **Navigation**: React Navigation
- **Database**: Realm (offline-first)
- **Sensors**: Expo Location, Sensors, Task Manager
- **Backend Sync**: Supabase JS client

### Backend Schema
- **Database**: PostgreSQL via Supabase
- **Key Tables**: `projects`, `clients`, `assets`, `tasks`, `chrono_events`, `profiles`
- **Features**: Row-level security, real-time subscriptions, polymorphic relationships

---

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project
- Expo CLI (for mobile)
- PostgreSQL client (optional, for local dev)

### Web Application Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/SERRAJOthman/ERNEST-PLATFORM.git
   cd ERNEST-PLATFORM
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   
   The web app will be available at `http://localhost:5173`

### Mobile Application Setup

1. **Navigate to mobile directory**
   ```bash
   cd mobile
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `mobile/.env`:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Start Expo development server**
   ```bash
   npm start
   ```
   
   Scan the QR code with Expo Go app on your device.

---

## 🗄️ Database Setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com)

2. **Run the schema migration**
   - Navigate to SQL Editor in Supabase Dashboard
   - Copy and execute the contents of `supabase/schema.sql`

3. **Enable Row Level Security (RLS)**
   - The schema includes RLS policies for secure multi-tenant access

---

## 🚀 Usage

### Web Dashboard

1. **Navigate between pages**:
   - **Dashboard**: Overview with key metrics and pulse stream
   - **Projects**: Kanban board for project management
   - **Financials**: Budget tracking and financial analysis
   - **Compliance**: Certification and incident management
   - **Sites**: Multi-site location overview

2. **Manage projects**:
   - Drag cards between Kanban columns
   - Changes sync in real-time to database
   - Create new projects with the "+ New Project" button

### Mobile App

1. **Context Detection**:
   - App automatically detects your location and activity
   - UI adapts to office, field, or vehicle contexts

2. **Offline Mode**:
   - All data is cached locally in Realm
   - Automatic background sync when connection is restored

---

## 📁 Project Structure

```
ERNEST-PLATFORM/
├── src/                          # Web app source
│   ├── components/
│   │   ├── Dashboard.tsx        # Main dashboard view
│   │   └── layouts/
│   │       └── OfficeLayout.tsx # App layout with sidebar
│   ├── pages/                   # Route pages
│   │   ├── DashboardPage.tsx
│   │   ├── ProjectsPage.tsx
│   │   ├── FinancialsPage.tsx
│   │   ├── CompliancePage.tsx
│   │   └── SitesPage.tsx
│   ├── hooks/
│   │   └── useSupabaseData.ts   # React Query hooks
│   ├── lib/
│   │   └── supabase.ts          # Supabase client
│   └── types/
│       └── supabase.ts          # TypeScript types
├── mobile/                       # React Native app
│   ├── App.tsx                  # Mobile entry point
│   ├── src/
│   │   ├── components/
│   │   │   └── ContextAwareInterface.tsx
│   │   └── services/
│   │       ├── RealmService.ts
│   │       ├── ContextDetectionService.ts
│   │       └── BackgroundSyncService.ts
│   └── assets/                  # App icons and splash
├── supabase/
│   └── schema.sql               # Database schema
├── .env.example                 # Environment template
└── README.md                    # This file
```

---

## 🎨 Design Philosophy

- **Dark Navy Theme (#0a1628)** with cyan accents (#00d9ff)
- **Glassmorphism**: Translucent UI elements with backdrop blur
- **Responsive**: Mobile-first design with adaptive layouts
- **Micro-animations**: Framer Motion for smooth transitions
- **Context-Aware**: Mobile UI adapts to user's physical context

---

## 🔐 Security

- **Row-Level Security (RLS)** enabled on all Supabase tables
- **Environment variables** for sensitive credentials
- **Client-side validation** with TypeScript
- **Secure authentication** via Supabase Auth (ready for implementation)

---

## 🧪 Testing

```bash
# Web app
npm run build        # Verify production build
npm run lint         # Check for TypeScript errors

# Mobile app
cd mobile
npm test             # Run Jest tests
```

---

## 📝 License

This project is proprietary and confidential.

---

## 👤 Author

**Othman Serraj**
- GitHub: [@SERRAJOthman](https://github.com/SERRAJOthman)

---

## 🙏 Acknowledgments

- Supabase for real-time backend infrastructure
- Expo for cross-platform mobile development
- TailwindCSS for rapid UI development

---

## 📧 Contact

For questions or collaborations, please open an issue on GitHub.
