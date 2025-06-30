# Technical Architecture - Application Launch Sequence

This document provides a detailed technical breakdown of the Jumbo No-Code Form Builder application launch sequence, including page initialization, component loading, and file execution flow.

## Application Launch Overview

The application follows a full-stack launch sequence with backend initialization followed by frontend hydration. The system uses a monolithic architecture with Express.js backend and React frontend served through Vite.

## 1. Backend Launch Sequence

### 1.1 Server Initialization (`server/index.ts`)

```
Launch Command: npm run dev
↓
NODE_ENV=development tsx server/index.ts
↓
Express Server Startup on Port 5000
```

**File Execution Order:**
1. **`server/index.ts`** - Main server entry point
2. **`server/storage.ts`** - Initialize MemStorage for user data
3. **`server/routes.ts`** - Register API routes
4. **`server/vite.ts`** - Setup Vite development server integration

**Key Events:**
- Express server initialization
- Middleware registration (JSON parsing, sessions, logging)
- API route registration
- Static file serving configuration
- Vite development server integration
- PostgreSQL session store setup

### 1.2 Database Connection Sequence

```
Database Type: PostgreSQL with Drizzle ORM
↓
Connection String: DATABASE_URL environment variable
↓
Schema Loading: shared/schema.ts
↓
Session Store: connect-pg-simple
```

**File References:**
- **`drizzle.config.ts`** - Database configuration
- **`shared/schema.ts`** - Database schema definitions
- **`server/storage.ts`** - Storage interface implementation

## 2. Frontend Launch Sequence

### 2.1 Initial Page Load (`client/index.html`)

```
Browser Request: http://localhost:5000
↓
Vite Dev Server Response
↓
HTML Template Loading
↓
React Application Bootstrap
```

**File Execution Order:**
1. **`client/index.html`** - HTML template with React root
2. **`client/src/main.tsx`** - React application entry point
3. **`client/src/App.tsx`** - Main application component

### 2.2 React Application Initialization

**Component Loading Sequence:**

```
main.tsx
├── React.StrictMode wrapper
├── TanStack Query Client initialization
└── App.tsx mounting
    ├── Database initialization (client-side SQLite)
    ├── Theme provider setup
    ├── Drag-and-drop provider (react-dnd)
    └── Main UI rendering
```

**File References:**
- **`client/src/main.tsx`** - React root rendering
- **`client/src/App.tsx`** - Main application component
- **`client/src/lib/db.ts`** - Client-side database initialization

## 3. Application State Initialization

### 3.1 Database Initialization Sequence

```
Application Start
↓
Database Client Creation (libsql)
↓
Table Creation (if not exists)
├── questionnaires table
├── sections table
└── controls table
↓
Default Data Insertion
├── Default questionnaire
└── Default section
```

**Console Log Sequence:**
```
🚀 APP: Initializing application...
Initializing localStorage-based database
Mock DB execute: INSERT OR IGNORE INTO questionnaires...
Mock DB execute: INSERT OR IGNORE INTO sections...
✅ APP: Database initialized successfully
```

**File References:**
- **`client/src/lib/db.ts`** - Database initialization functions
- **`shared/schema.ts`** - Table schema definitions

### 3.2 Hook Initialization (`useDragDrop.ts`)

```
useDragDrop Hook Loading
↓
Initial State Setup
├── controlCount: 0
├── isLoading: true
├── refreshKey: 0
└── directImportMode: false
↓
Database Query Execution
├── Load sections
└── Load controls
↓
State Update
└── isLoading: false
```

**Console Log Sequence:**
```
📊 useDragDrop: Current state: {controlCount:0, isLoading:true...}
🔄 useDragDrop: Loading controls from database
📊 useDragDrop: Database query results: {controlCount:0...}
✅ useDragDrop: Controls loaded successfully
📊 useDragDrop: Current state: {controlCount:0, isLoading:false...}
```

**File References:**
- **`client/src/hooks/useDragDrop.ts`** - Main state management hook
- **`client/src/hooks/useFormValues.ts`** - Form values management
- **`client/src/hooks/useTheme.ts`** - Theme management

## 4. User Interface Launch Sequence

### 4.1 Main Application Layout

```
App.tsx Rendering
├── Header Component
│   ├── Tab Navigation
│   ├── Customer Tier Selector
│   └── Theme Toggle
├── Main Content Area
│   └── Tab-Based Routing
└── Drag-and-Drop Provider Context
```

**Component Loading Order:**
1. **`Header.tsx`** - Navigation and controls
2. **`ThemeToggle.tsx`** - Dark/light mode toggle
3. **Tab Content Components** (based on activeTab)

### 4.2 Tab System Initialization

**Available Tabs:**
- **Dashboard Designer** - Dashboard creation interface
- **Dashboard** - Analytics and management
- **Design** - Form builder interface
- **Preview** - Live form preview
- **PDF Preview** - PDF generation and preview
- **JSON Export** - Data export interface

**Default Tab Loading:**
```
Initial Tab: 'dashboardDesigner'
↓
DashboardDesigner Component Mounting
├── Template selection interface
├── Theme customization panel
├── Live preview area
└── Configuration export
```

### 4.3 Design Tab Components (Core Form Builder)

```
Design Tab Activation
├── ControlLibrary.tsx (Left Panel - 320px)
│   ├── Control Categories Loading
│   ├── Draggable Control Items
│   └── Search Functionality
├── DesignCanvas.tsx (Center Panel - Flexible)
│   ├── Section Tabs Rendering
│   ├── Drop Zone Setup
│   ├── Scrollable Canvas Area
│   └── Control Placement Grid
└── PropertiesPanel.tsx (Right Panel - 320px)
    ├── Selected Control Properties
    ├── Form Validation Rules
    └── Styling Options
```

**File References:**
- **`client/src/components/ControlLibrary.tsx`** - Left panel component
- **`client/src/components/DesignCanvas.tsx`** - Center canvas component
- **`client/src/components/PropertiesPanel.tsx`** - Right panel component
- **`client/src/data/controls.ts`** - Control definitions and categories

## 5. Data Flow and State Management

### 5.1 Form Data Flow

```
User Interaction
↓
Component Event Handler
↓
useDragDrop Hook State Update
↓
Database Persistence (libsql)
↓
UI Re-rendering
```

**State Management Sequence:**
1. User drags control from library
2. Drop event triggers `handleDrop` in App.tsx
3. `addControl` function in useDragDrop hook
4. Database insertion via `insertControl`
5. State refresh triggers re-render
6. Updated UI reflects new control

### 5.2 Section Management Flow

```
Section Creation/Update
├── SectionManager.tsx user interaction
├── App.tsx section handler functions
├── Database operations (sections table)
└── Canvas re-rendering with new sections
```

**File References:**
- **`client/src/components/SectionManager.tsx`** - Section management UI
- **`client/src/lib/db.ts`** - Section CRUD operations

## 6. Import/Export System Launch

### 6.1 Excel Import Flow

```
Excel File Upload
├── ExcelImportModal.tsx activation
├── File validation and parsing (xlsx library)
├── Data transformation to control format
├── Batch database insertion
└── Success/error feedback display
```

**File References:**
- **`client/src/components/ExcelImportModal.tsx`** - Import interface
- **`client/src/components/ImportSuccessDialog.tsx`** - Result feedback

### 6.2 JSON Export Flow

```
Export Request
├── JSONViewer.tsx data collection
├── Form structure serialization
├── Tier-based filtering
└── JSON formatting and display
```

**File References:**
- **`client/src/components/JSONViewer.tsx`** - Export interface

## 7. Preview and PDF System

### 7.1 Preview Mode Activation

```
Preview Tab Selection
├── PreviewMode.tsx component mounting
├── Form data loading from database
├── Theme application
└── Interactive form rendering
```

### 7.2 PDF Generation Flow

```
PDF Preview Request
├── PDFPreview.tsx component activation
├── jsPDF library initialization
├── Template selection and application
├── Form data population
└── Real-time PDF rendering
```

**File References:**
- **`client/src/components/PreviewMode.tsx`** - Live preview component
- **`client/src/components/PDFPreview.tsx`** - PDF generation component
- **`client/src/data/pdfTemplates.ts`** - PDF template definitions

## 8. Dashboard Designer System

### 8.1 Dashboard Designer Launch

```
Dashboard Designer Tab Selection
├── DashboardDesigner.tsx mounting
├── Template library loading
├── Theme customization panel setup
└── Live preview initialization
```

**Template Loading Sequence:**
- Grid layout templates
- Sidebar layout options
- Card-based designs
- Minimal interface templates

**File References:**
- **`client/src/components/DashboardDesigner.tsx`** - Main designer component

## 9. Customer Tier System

### 9.1 Tier-Based Feature Loading

```
Tier Selection (Bronze/Silver/Gold/Platinum)
├── Feature availability calculation
├── Control library filtering
├── Template access restriction
└── UI element enabling/disabling
```

**File References:**
- **`client/src/data/tiers.ts`** - Tier configuration and restrictions

## 10. Error Handling and Recovery

### 10.1 Error Boundary System

```
Component Error Occurrence
├── React Error Boundary catch
├── Fallback UI rendering
├── Error logging to console
└── Recovery options display
```

### 10.2 Network Error Handling

```
API Request Failure
├── TanStack Query error handling
├── Retry mechanism activation
├── User notification display
└── Graceful degradation
```

## 11. Performance Optimization Events

### 11.1 Lazy Loading Sequence

```
Route/Component Request
├── Dynamic import() execution
├── Bundle loading from Vite
├── Component code splitting
└── Progressive loading completion
```

### 11.2 Virtual Scrolling (Large Forms)

```
Large Control List Rendering
├── Viewport calculation
├── Visible item determination
├── Off-screen item virtualization
└── Smooth scrolling maintenance
```

## 12. Development vs Production Launch

### 12.1 Development Mode

```
npm run dev execution
├── tsx server/index.ts (TypeScript execution)
├── Vite dev server startup
├── Hot module replacement (HMR) setup
├── React DevTools integration
└── Source map generation
```

### 12.2 Production Mode

```
npm run build + npm start execution
├── vite build (static asset generation)
├── esbuild server bundling
├── Express static file serving
├── Optimized asset delivery
└── Production error handling
```

## 13. File Dependency Graph

### 13.1 Critical Path Files

```
server/index.ts
├── server/routes.ts
├── server/storage.ts
├── server/vite.ts
└── shared/schema.ts

client/src/main.tsx
├── client/src/App.tsx
├── client/src/lib/db.ts
├── client/src/hooks/useDragDrop.ts
└── client/src/components/*
```

### 13.2 Configuration Files

```
Root Configuration
├── package.json (dependencies and scripts)
├── vite.config.ts (build configuration)
├── tailwind.config.ts (styling configuration)
├── tsconfig.json (TypeScript configuration)
├── drizzle.config.ts (database configuration)
└── postcss.config.js (CSS processing)
```

## 14. Monitoring and Debugging

### 14.1 Console Log Patterns

**Application Startup:**
- 🚀 APP: Messages for application-level events
- 📊 useDragDrop: State management logging
- 📂 APP: Data loading confirmations
- ✅ Success messages for completed operations

**Development Tools:**
- Vite connection status
- React DevTools availability
- TypeScript compilation status
- Database operation confirmations

### 14.2 Performance Monitoring

**Key Metrics Tracked:**
- Initial page load time
- Component mounting duration
- Database query execution time
- Drag-and-drop operation latency
- PDF generation performance

## Summary

The Jumbo No-Code Form Builder follows a structured launch sequence that initializes backend services, establishes database connections, loads the React frontend, and progressively activates features based on user interaction. The system is designed for modularity, performance, and extensibility while maintaining a consistent user experience across all features and customer tiers.