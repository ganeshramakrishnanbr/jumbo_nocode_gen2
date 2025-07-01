# Reverse Engineering Prompts - Complete Application Recreation

This document contains comprehensive, copy-paste ready prompts for recreating the Jumbo No-Code Form Builder application using AI coding assistants. Each prompt is designed to be self-contained and includes all necessary context.

## Master Creation Prompt

Use this comprehensive prompt to recreate the entire application in one session:

```
Create a comprehensive no-code form builder application called "Jumbo Studio" with the following complete specifications:

TECHNOLOGY STACK:
- Frontend: React 18+ with TypeScript, Vite build system
- Backend: Express.js with TypeScript
- Database: PostgreSQL with Drizzle ORM
- UI: Radix UI primitives with shadcn/ui components
- Styling: Tailwind CSS with dark mode support
- DnD: react-dnd with HTML5 backend
- Forms: react-hook-form with Zod validation
- Additional: TanStack Query, date-fns, jsPDF, xlsx

PROJECT STRUCTURE:
```
jumbo-form-builder/
├── client/src/
│   ├── components/     # React components
│   ├── hooks/          # Custom hooks
│   ├── lib/            # Utilities
│   ├── data/           # Static data
│   └── main.tsx        # Entry point
├── server/
│   ├── index.ts        # Express server
│   ├── routes.ts       # API routes
│   ├── storage.ts      # Data layer
│   └── vite.ts         # Vite integration
├── shared/
│   └── schema.ts       # Database schemas
└── docs/               # Documentation
```

CORE FEATURES TO IMPLEMENT:

1. MULTI-TAB INTERFACE:
   - Dashboard Designer: Template selection with theme customization
   - Dashboard: Analytics and form management
   - Design: Three-panel drag-and-drop form builder
   - Preview: Live form preview with working controls
   - PDF Preview: Real-time PDF generation with custom templates
   - JSON Export: Complete form definition export

2. DRAG-AND-DROP FORM BUILDER:
   - Control Library (left panel, 320px fixed width)
   - Design Canvas (center, flexible width with scrollbars)
   - Properties Panel (right panel, 320px fixed width)
   - 20+ form controls: text inputs, dropdowns, date pickers, file uploads, etc.
   - Section-based organization with visual tabs

3. CUSTOMER TIER SYSTEM:
   - Bronze: 10 controls, 2 templates
   - Silver: 25 controls, 5 templates
   - Gold: 50 controls, 10 templates
   - Platinum: Unlimited access
   - Visual tier indicators and upgrade prompts

4. IMPORT/EXPORT SYSTEM:
   - Excel import with dynamic section creation
   - JSON export with tier-based complexity
   - Direct import mode for UI-only operations
   - Comprehensive error handling and validation

5. PDF GENERATION:
   - Real-time PDF preview using jsPDF
   - Multiple templates: Professional, Clean, Detailed, Compact
   - Custom branding: logo upload, footer notes
   - Form value display in generated PDFs
   - Page break management by sections

6. DASHBOARD DESIGNER:
   - Template system: Grid, Sidebar, Card, Minimal layouts
   - Theme customization: color schemes, light/dark modes
   - Live preview with real-time updates
   - Separate JSON configuration export

7. RESPONSIVE DESIGN:
   - Mobile-first approach with touch support
   - Collapsible panels on mobile devices
   - Touch-friendly drag-and-drop
   - Dark mode with smooth transitions

DATABASE SCHEMA (PostgreSQL with Drizzle):
```sql
-- Questionnaires table
CREATE TABLE questionnaires (
  id VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  purpose VARCHAR,
  category VARCHAR,
  status VARCHAR DEFAULT 'draft',
  tier VARCHAR DEFAULT 'bronze',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Sections table
CREATE TABLE sections (
  id VARCHAR PRIMARY KEY,
  questionnaire_id VARCHAR REFERENCES questionnaires(id),
  name VARCHAR NOT NULL,
  description TEXT,
  color VARCHAR DEFAULT '#3b82f6',
  icon VARCHAR DEFAULT 'FileText',
  section_order INTEGER DEFAULT 0,
  required BOOLEAN DEFAULT false
);

-- Controls table
CREATE TABLE controls (
  id VARCHAR PRIMARY KEY,
  questionnaire_id VARCHAR REFERENCES questionnaires(id),
  section_id VARCHAR REFERENCES sections(id),
  type VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  properties JSONB DEFAULT '{}',
  x INTEGER DEFAULT 0,
  y INTEGER DEFAULT 0,
  width INTEGER DEFAULT 12,
  height INTEGER DEFAULT 1
);

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR UNIQUE NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

FORM CONTROLS TO IMPLEMENT:
```typescript
// Core Input Controls
- Text Box: Single-line text input
- Multi-line Text: Textarea with configurable rows
- Numeric Control: Number input with validation
- Email Input: Email validation
- Password Input: Masked input with toggle
- URL Input: URL validation

// Date & Time Controls
- Date Picker: Calendar widget
- Time Picker: Time selection
- Date Range Picker: Start/end dates
- DateTime Picker: Combined date/time

// Selection Controls
- Dropdown: Single selection
- Multi-Select: Multiple selection with checkboxes
- Radio Group: Single selection buttons
- Checkbox Group: Multiple selection
- Button Group: Toggle buttons
- Rating Control: Star rating

// Advanced Controls
- File Upload: Single/multiple files
- Image Upload: Image-specific with preview
- Tag Input: Dynamic tag creation
- Toggle Switch: Boolean input
- Slider: Range input
- Color Picker: Color selection

// Layout Controls
- Grid Matrix: Question matrix
- Section Divider: Visual separation
- HTML Content: Rich text display
- Progress Indicator: Completion status
```

IMPLEMENTATION REQUIREMENTS:

1. Setup complete project structure with TypeScript configuration
2. Configure Tailwind CSS with dark mode support
3. Setup Drizzle ORM with PostgreSQL connection
4. Implement drag-and-drop using react-dnd
5. Create responsive three-panel layout for Design tab
6. Build comprehensive control library with categories
7. Implement real-time preview with working form controls
8. Add PDF generation with jsPDF and custom templates
9. Create Excel import/export functionality using xlsx
10. Build Dashboard Designer with template and theme systems
11. Implement customer tier restrictions throughout
12. Add comprehensive error handling and validation
13. Setup session management and basic authentication
14. Configure Vite for development and production builds
15. Add proper TypeScript types and interfaces

STYLING REQUIREMENTS:
- Use Tailwind CSS utility classes exclusively
- Implement proper dark mode with CSS variables
- Create smooth transitions (200ms cubic-bezier)
- Use Radix UI primitives for interactive components
- Ensure 44px minimum touch targets for mobile
- Add custom scrollbar styling for canvas areas

PERFORMANCE REQUIREMENTS:
- Implement React.memo for expensive components
- Use proper dependency arrays in useEffect
- Add debounced operations for expensive updates
- Optimize bundle size with code splitting
- Implement virtual scrolling for large lists

Create all necessary files, components, and configurations to build a fully functional form builder application. Include proper error handling, TypeScript types, and comprehensive documentation.
```

## Individual Feature Prompts

### 1. Project Setup and Configuration

```
Set up a new full-stack TypeScript React application with the following exact configuration:

PACKAGE.JSON DEPENDENCIES:
```json
{
  "name": "jumbo-form-builder",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "NODE_ENV=production node dist/index.js",
    "check": "tsc",
    "db:push": "drizzle-kit push"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.10.0",
    "@libsql/client": "^0.15.9",
    "@neondatabase/serverless": "^0.10.4",
    "@radix-ui/react-accordion": "^1.2.4",
    "@radix-ui/react-alert-dialog": "^1.1.7",
    "@radix-ui/react-dialog": "^1.1.7",
    "@radix-ui/react-dropdown-menu": "^2.1.7",
    "@radix-ui/react-label": "^2.1.3",
    "@radix-ui/react-select": "^2.1.7",
    "@radix-ui/react-separator": "^1.1.3",
    "@radix-ui/react-switch": "^1.1.4",
    "@radix-ui/react-tabs": "^1.1.4",
    "@radix-ui/react-toast": "^1.2.7",
    "@radix-ui/react-tooltip": "^1.2.0",
    "@tanstack/react-query": "^5.60.5",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "date-fns": "^3.6.0",
    "drizzle-orm": "^0.39.1",
    "drizzle-zod": "^0.7.0",
    "express": "^4.21.2",
    "express-session": "^1.18.1",
    "framer-motion": "^11.13.1",
    "html2canvas": "^1.4.1",
    "jspdf": "^3.0.1",
    "lucide-react": "^0.453.0",
    "nanoid": "^5.1.5",
    "next-themes": "^0.4.6",
    "react": "^18.3.1",
    "react-dnd": "^16.0.1",
    "react-dnd-html5-backend": "^16.0.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.55.0",
    "react-resizable-panels": "^2.1.7",
    "tailwind-merge": "^2.6.0",
    "tailwindcss-animate": "^1.0.7",
    "wouter": "^3.3.5",
    "xlsx": "^0.18.5",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@types/express": "4.17.21",
    "@types/express-session": "^1.18.0",
    "@types/react": "^18.3.11",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.2",
    "autoprefixer": "^10.4.20",
    "drizzle-kit": "^0.30.4",
    "esbuild": "^0.25.0",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.17",
    "tsx": "^4.19.1",
    "typescript": "5.6.3",
    "vite": "^5.4.14"
  }
}
```

VITE.CONFIG.TS:
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@shared': path.resolve(__dirname, './shared')
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5000'
    }
  },
  build: {
    outDir: 'dist/public',
    sourcemap: true
  }
});
```

TAILWIND.CONFIG.TS:
```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './client/src/**/*.{ts,tsx}',
    './client/index.html'
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
};

export default config;
```

TSCONFIG.JSON:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./client/src/*"],
      "@shared/*": ["./shared/*"]
    }
  },
  "include": ["client/src", "server", "shared", "vite.config.ts"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

Create all configuration files and folder structure for a modern full-stack TypeScript application.
```

### 2. Database Schema and Backend Setup

```
Create a complete Express.js backend with PostgreSQL database for a form builder application:

DATABASE SCHEMA (shared/schema.ts):
```typescript
import { pgTable, varchar, text, integer, boolean, timestamp, serial, jsonb } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

export const questionnaires = pgTable("questionnaires", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  purpose: varchar("purpose", { length: 255 }),
  category: varchar("category", { length: 255 }),
  status: varchar("status", { length: 50 }).default("draft"),
  tier: varchar("tier", { length: 50 }).default("bronze"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const sections = pgTable("sections", {
  id: varchar("id", { length: 255 }).primaryKey(),
  questionnaireId: varchar("questionnaire_id", { length: 255 }).references(() => questionnaires.id),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  color: varchar("color", { length: 50 }).default("#3b82f6"),
  icon: varchar("icon", { length: 50 }).default("FileText"),
  sectionOrder: integer("section_order").default(0),
  required: boolean("required").default(false)
});

export const controls = pgTable("controls", {
  id: varchar("id", { length: 255 }).primaryKey(),
  questionnaireId: varchar("questionnaire_id", { length: 255 }).references(() => questionnaires.id),
  sectionId: varchar("section_id", { length: 255 }).references(() => sections.id),
  type: varchar("type", { length: 100 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  properties: jsonb("properties").default({}),
  x: integer("x").default(0),
  y: integer("y").default(0),
  width: integer("width").default(12),
  height: integer("height").default(1)
});

// Zod schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  passwordHash: true
});

export const insertQuestionnaireSchema = createInsertSchema(questionnaires);
export const insertSectionSchema = createInsertSchema(sections);
export const insertControlSchema = createInsertSchema(controls);

// TypeScript types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Questionnaire = typeof questionnaires.$inferSelect;
export type Section = typeof sections.$inferSelect;
export type Control = typeof controls.$inferSelect;
```

EXPRESS SERVER (server/index.ts):
```typescript
import express from 'express';
import session from 'express-session';
import { createServer } from 'http';
import { setupVite, serveStatic } from './vite.js';
import { registerRoutes } from './routes.js';

const app = express();
const server = createServer(app);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Register API routes
await registerRoutes(app);

// Static file serving and Vite setup
if (process.env.NODE_ENV === 'production') {
  serveStatic(app);
} else {
  await setupVite(app, server);
}

const port = process.env.PORT || 5000;
server.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
```

STORAGE INTERFACE (server/storage.ts):
```typescript
import { eq } from 'drizzle-orm';
import type { User, InsertUser, Questionnaire, Section, Control } from '@shared/schema';

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Questionnaire methods
  getQuestionnaires(): Promise<Questionnaire[]>;
  createQuestionnaire(questionnaire: Omit<Questionnaire, 'id' | 'createdAt' | 'updatedAt'>): Promise<Questionnaire>;
  updateQuestionnaire(id: string, updates: Partial<Questionnaire>): Promise<void>;
  deleteQuestionnaire(id: string): Promise<void>;
  
  // Section methods
  getSections(questionnaireId: string): Promise<Section[]>;
  createSection(section: Omit<Section, 'id'>): Promise<Section>;
  updateSection(id: string, updates: Partial<Section>): Promise<void>;
  deleteSection(id: string): Promise<void>;
  
  // Control methods
  getControls(questionnaireId: string): Promise<Control[]>;
  createControl(control: Omit<Control, 'id'>): Promise<Control>;
  updateControl(id: string, updates: Partial<Control>): Promise<void>;
  deleteControl(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private questionnaires: Map<string, Questionnaire> = new Map();
  private sections: Map<string, Section> = new Map();
  private controls: Map<string, Control> = new Map();
  private currentUserId = 1;

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getQuestionnaires(): Promise<Questionnaire[]> {
    return Array.from(this.questionnaires.values());
  }

  async createQuestionnaire(questionnaire: Omit<Questionnaire, 'id' | 'createdAt' | 'updatedAt'>): Promise<Questionnaire> {
    const id = `q_${Date.now()}`;
    const newQuestionnaire: Questionnaire = {
      ...questionnaire,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.questionnaires.set(id, newQuestionnaire);
    return newQuestionnaire;
  }

  // Implement remaining methods...
}

export const storage = new MemStorage();
```

Create complete backend with proper error handling, validation, and type safety.
```

### 3. React Frontend Core Structure

```
Create the main React application structure with multi-tab interface and dark mode:

MAIN APP COMPONENT (client/src/App.tsx):
```typescript
import React, { useState, useCallback, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';

import { Header } from './components/Header';
import { DashboardDesigner } from './components/DashboardDesigner';
import { Dashboard } from './components/Dashboard';
import { ControlLibrary } from './components/ControlLibrary';
import { DesignCanvas } from './components/DesignCanvas';
import { PropertiesPanel } from './components/PropertiesPanel';
import { PreviewMode } from './components/PreviewMode';
import { PDFPreview } from './components/PDFPreview';
import { JSONViewer } from './components/JSONViewer';
import { SectionManager } from './components/SectionManager';

import { useDragDrop } from './hooks/useDragDrop';
import { useFormValues } from './hooks/useFormValues';
import { initializeDatabase } from './lib/db';

import type { ControlType, DroppedControl, Section } from '@shared/types';

export type TabType = 'dashboardDesigner' | 'dashboard' | 'design' | 'preview' | 'pdf' | 'json';
export type CustomerTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false
    }
  }
});

function App() {
  const [isDbInitialized, setIsDbInitialized] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('dashboardDesigner');
  const [currentTier, setCurrentTier] = useState<CustomerTier>('Gold');
  const [draggedControl, setDraggedControl] = useState<ControlType | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const {
    droppedControls,
    sections,
    selectedControl,
    activeSection,
    addControl,
    selectControl,
    updateControl,
    moveControl,
    removeControl,
    reorderControls,
    createSection,
    updateSection,
    deleteSection,
    setActiveSection
  } = useDragDrop('default-questionnaire', isDbInitialized, refreshKey, activeSection);

  const { formValues, updateFormValue, resetFormValues } = useFormValues();

  // Initialize database on app start
  useEffect(() => {
    const initDb = async () => {
      try {
        console.log('🚀 APP: Initializing application...');
        await initializeDatabase();
        console.log('✅ APP: Database initialized successfully');
        setIsDbInitialized(true);
        console.log('📂 APP: Loaded sections:', sections.length);
      } catch (error) {
        console.error('❌ APP: Database initialization failed:', error);
      }
    };
    initDb();
  }, []);

  const handleDragStart = useCallback((control: ControlType) => {
    setDraggedControl(control);
  }, []);

  const handleDrop = useCallback(async (controlType: ControlType, x: number, y: number) => {
    try {
      await addControl(controlType, x, y, activeSection);
      setDraggedControl(null);
    } catch (error) {
      console.error('Failed to add control:', error);
    }
  }, [addControl, activeSection]);

  const handleControlSelect = useCallback((control: DroppedControl) => {
    selectControl(control);
  }, [selectControl]);

  const handleSectionCreate = useCallback(async (sectionData: Omit<Section, 'id' | 'controls' | 'validation'>) => {
    const newSection: Section = {
      id: `section_${Date.now()}`,
      questionnaireId: 'default-questionnaire',
      name: sectionData.name,
      description: sectionData.description || '',
      color: sectionData.color || '#3b82f6',
      icon: sectionData.icon || 'FileText',
      sectionOrder: sections.length,
      required: sectionData.required || false
    };
    
    await createSection(newSection);
    setActiveSection(newSection.id);
  }, [createSection, sections.length, setActiveSection]);

  const handleImportControls = useCallback(async (controls: DroppedControl[]) => {
    // Refresh the component after import
    setRefreshKey(prev => prev + 1);
  }, []);

  const handleDirectImport = useCallback(async (controls: DroppedControl[]) => {
    // Handle direct import without database persistence
    setRefreshKey(prev => prev + 1);
  }, []);

  if (!isDbInitialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Initializing application...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <DndProvider backend={HTML5Backend}>
          <div className="min-h-screen bg-background text-foreground">
            <Header
              currentTier={currentTier}
              onTierChange={setCurrentTier}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onImportControls={handleImportControls}
              onDirectImport={handleDirectImport}
            />
            
            <main className="h-[calc(100vh-64px)]">
              {activeTab === 'dashboardDesigner' && (
                <DashboardDesigner />
              )}
              
              {activeTab === 'dashboard' && (
                <Dashboard
                  currentTier={currentTier}
                  onCreateQuestionnaire={() => setActiveTab('design')}
                  onEditQuestionnaire={(id: string) => setActiveTab('design')}
                />
              )}
              
              {activeTab === 'design' && (
                <div className="flex h-full">
                  <ControlLibrary
                    onDragStart={handleDragStart}
                    currentTier={currentTier}
                  />
                  
                  <div className="flex-1 flex flex-col">
                    <SectionManager
                      sections={sections}
                      activeSection={activeSection}
                      onSectionChange={setActiveSection}
                      onCreateSection={handleSectionCreate}
                      onUpdateSection={updateSection}
                      onDeleteSection={deleteSection}
                    />
                    
                    <DesignCanvas
                      droppedControls={droppedControls}
                      selectedControl={selectedControl}
                      onControlSelect={handleControlSelect}
                      onControlUpdate={updateControl}
                      onControlMove={moveControl}
                      onControlRemove={removeControl}
                      onControlReorder={reorderControls}
                      onDrop={handleDrop}
                      draggedControl={draggedControl}
                      activeSection={activeSection}
                    />
                  </div>
                  
                  <PropertiesPanel
                    selectedControl={selectedControl}
                    onUpdateControl={updateControl}
                    sections={sections}
                    droppedControls={droppedControls}
                  />
                </div>
              )}
              
              {activeTab === 'preview' && (
                <PreviewMode
                  droppedControls={droppedControls}
                  sections={sections}
                  formValues={formValues}
                  onFormValueChange={updateFormValue}
                />
              )}
              
              {activeTab === 'pdf' && (
                <PDFPreview
                  droppedControls={droppedControls}
                  sections={sections}
                  currentTier={currentTier}
                  formValues={formValues}
                  onFormValueChange={updateFormValue}
                />
              )}
              
              {activeTab === 'json' && (
                <JSONViewer
                  droppedControls={droppedControls}
                  currentTier={currentTier}
                  sections={sections}
                />
              )}
            </main>
          </div>
        </DndProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
```

HEADER COMPONENT (client/src/components/Header.tsx):
```typescript
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from './ThemeToggle';
import { ExcelImportModal } from './ExcelImportModal';
import { DirectImportModal } from './DirectImportModal';

import { Upload, Download, Crown, Menu } from 'lucide-react';

import type { CustomerTier, TabType } from '../App';
import type { DroppedControl } from '@shared/types';

interface HeaderProps {
  currentTier: CustomerTier;
  onTierChange: (tier: CustomerTier) => void;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onImportControls?: (controls: DroppedControl[]) => void;
  onDirectImport?: (controls: DroppedControl[]) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTier,
  onTierChange,
  activeTab,
  onTabChange,
  onImportControls,
  onDirectImport
}) => {
  const [showExcelImport, setShowExcelImport] = useState(false);
  const [showDirectImport, setShowDirectImport] = useState(false);

  const tierColors = {
    Bronze: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    Silver: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    Gold: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    Platinum: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
  };

  return (
    <>
      <header className="h-16 border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="flex items-center justify-between h-full px-6">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">J</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Jumbo Studio
              </h1>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex-1 flex justify-center">
            <Tabs value={activeTab} onValueChange={onTabChange as (value: string) => void}>
              <TabsList className="grid w-full grid-cols-6 lg:w-auto">
                <TabsTrigger value="dashboardDesigner" className="text-xs lg:text-sm">
                  Dashboard Designer
                </TabsTrigger>
                <TabsTrigger value="dashboard" className="text-xs lg:text-sm">
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="design" className="text-xs lg:text-sm">
                  Design
                </TabsTrigger>
                <TabsTrigger value="preview" className="text-xs lg:text-sm">
                  Preview
                </TabsTrigger>
                <TabsTrigger value="pdf" className="text-xs lg:text-sm">
                  PDF
                </TabsTrigger>
                <TabsTrigger value="json" className="text-xs lg:text-sm">
                  JSON
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* Import/Export Actions */}
            <div className="hidden md:flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowExcelImport(true)}
              >
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDirectImport(true)}
              >
                <Download className="h-4 w-4 mr-2" />
                Direct Import
              </Button>
            </div>

            {/* Customer Tier Selector */}
            <div className="flex items-center space-x-2">
              <Crown className="h-4 w-4 text-muted-foreground" />
              <Select value={currentTier} onValueChange={onTierChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bronze">Bronze</SelectItem>
                  <SelectItem value="Silver">Silver</SelectItem>
                  <SelectItem value="Gold">Gold</SelectItem>
                  <SelectItem value="Platinum">Platinum</SelectItem>
                </SelectContent>
              </Select>
              <Badge className={tierColors[currentTier]}>
                {currentTier}
              </Badge>
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Import Modals */}
      <ExcelImportModal
        isOpen={showExcelImport}
        onClose={() => setShowExcelImport(false)}
        onImport={onImportControls || (() => {})}
      />
      
      <DirectImportModal
        isOpen={showDirectImport}
        onClose={() => setShowDirectImport(false)}
        onDirectImport={onDirectImport || (() => {})}
      />
    </>
  );
};
```

Create proper TypeScript interfaces, theme management, and component structure for a professional form builder application.
```

### 4. Drag-and-Drop Form Builder Interface

```
Create a comprehensive three-panel drag-and-drop form builder:

CONTROL LIBRARY (client/src/components/ControlLibrary.tsx):
```typescript
import React, { useState, useMemo } from 'react';
import { useDrag } from 'react-dnd';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';

import { ChevronDown, Search } from 'lucide-react';
import { CONTROLS, CONTROL_CATEGORIES } from '@/data/controls';
import { getTierConfig, isControlTypeAllowed } from '@/data/tiers';

import type { ControlType, CustomerTier } from '@shared/types';

interface ControlLibraryProps {
  onDragStart: (control: ControlType) => void;
  currentTier: CustomerTier;
}

interface DraggableControlProps {
  control: ControlType;
  onDragStart: (control: ControlType) => void;
  isAllowed: boolean;
}

const DraggableControl: React.FC<DraggableControlProps> = ({ 
  control, onDragStart, isAllowed 
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'CONTROL',
    item: control,
    canDrag: isAllowed,
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    }),
    begin: () => {
      onDragStart(control);
    }
  });

  const IconComponent = control.icon;

  return (
    <div
      ref={drag}
      className={`
        group relative p-3 rounded-lg border transition-all cursor-grab active:cursor-grabbing
        ${isAllowed 
          ? 'border-border hover:border-primary/50 hover:bg-accent/50' 
          : 'border-muted bg-muted/30 cursor-not-allowed opacity-60'
        }
        ${isDragging ? 'opacity-30 scale-105' : ''}
      `}
    >
      <div className="flex items-center space-x-3">
        <div className={`
          w-8 h-8 rounded-md flex items-center justify-center
          ${isAllowed ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}
        `}>
          {IconComponent && <IconComponent className="h-4 w-4" />}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className={`font-medium text-sm ${isAllowed ? 'text-foreground' : 'text-muted-foreground'}`}>
            {control.name}
          </h4>
          <p className="text-xs text-muted-foreground truncate">
            {control.description}
          </p>
        </div>
      </div>
      
      {!isAllowed && (
        <div className="absolute top-1 right-1">
          <Badge variant="secondary" className="text-xs">
            Upgrade
          </Badge>
        </div>
      )}
    </div>
  );
};

export const ControlLibrary: React.FC<ControlLibraryProps> = ({ 
  onDragStart, currentTier 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['Core Input'])
  );

  const tierConfig = getTierConfig(currentTier);
  
  const filteredControls = useMemo(() => {
    return CONTROLS.filter(control =>
      control.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      control.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      control.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const controlsByCategory = useMemo(() => {
    return CONTROL_CATEGORIES.map(category => ({
      ...category,
      controls: filteredControls.filter(control => control.category === category.name)
    })).filter(category => category.controls.length > 0);
  }, [filteredControls]);

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryName)) {
        next.delete(categoryName);
      } else {
        next.add(categoryName);
      }
      return next;
    });
  };

  return (
    <div className="w-80 bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Control Library</h2>
          <Badge className="text-xs" variant="outline">
            {currentTier}
          </Badge>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search controls..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        {/* Tier info */}
        <div className="mt-2 text-xs text-muted-foreground">
          {tierConfig.maxControls === -1 
            ? 'Unlimited controls available' 
            : `Up to ${tierConfig.maxControls} controls available`
          }
        </div>
      </div>

      {/* Categories */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {controlsByCategory.map(category => {
            const isExpanded = expandedCategories.has(category.name);
            const IconComponent = category.icon;
            
            return (
              <Collapsible
                key={category.name}
                open={isExpanded}
                onOpenChange={() => toggleCategory(category.name)}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                      {IconComponent && <IconComponent className="h-3 w-3 text-primary" />}
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-sm">{category.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {category.controls.length} controls
                      </p>
                    </div>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <div className="mt-2 space-y-2 pl-2">
                    {category.controls.map(control => (
                      <DraggableControl
                        key={control.type}
                        control={control}
                        onDragStart={onDragStart}
                        isAllowed={isControlTypeAllowed(currentTier, control.type)}
                      />
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
```

DESIGN CANVAS (client/src/components/DesignCanvas.tsx):
```typescript
import React, { useRef, useCallback } from 'react';
import { useDrop } from 'react-dnd';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DraggableControlComponent } from './DraggableControlComponent';

import { FileText, Plus } from 'lucide-react';

import type { ControlType, DroppedControl } from '@shared/types';

interface DesignCanvasProps {
  droppedControls: DroppedControl[];
  selectedControl: DroppedControl | null;
  onControlSelect: (control: DroppedControl) => void;
  onControlUpdate: (id: string, updates: Partial<DroppedControl>) => void;
  onControlMove: (id: string, direction: 'up' | 'down') => void;
  onControlRemove: (id: string) => void;
  onControlReorder: (dragIndex: number, hoverIndex: number) => void;
  onDrop: (controlType: ControlType, x: number, y: number) => void;
  draggedControl: ControlType | null;
  activeSection: string;
}

export const DesignCanvas: React.FC<DesignCanvasProps> = ({
  droppedControls,
  selectedControl,
  onControlSelect,
  onControlUpdate,
  onControlMove,
  onControlRemove,
  onControlReorder,
  onDrop,
  draggedControl,
  activeSection
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'CONTROL',
    drop: (item: ControlType, monitor) => {
      const offset = monitor.getClientOffset();
      if (offset && canvasRef.current) {
        const canvasRect = canvasRef.current.getBoundingClientRect();
        const x = offset.x - canvasRect.left;
        const y = offset.y - canvasRect.top;
        onDrop(item, x, y);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  });

  // Filter controls for active section
  const sectionControls = droppedControls.filter(
    control => control.sectionId === activeSection
  );

  const handleControlSelect = useCallback((control: DroppedControl) => {
    onControlSelect(control);
  }, [onControlSelect]);

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Canvas area */}
      <div
        ref={(node) => {
          canvasRef.current = node;
          drop(node);
        }}
        className={`
          flex-1 relative transition-colors
          ${isOver && canDrop ? 'bg-blue-50 dark:bg-blue-950/20' : ''}
          ${isOver && !canDrop ? 'bg-red-50 dark:bg-red-950/20' : ''}
        `}
      >
        <ScrollArea className="h-full w-full">
          <div 
            className="min-h-full p-6 space-y-3"
            style={{
              scrollbarWidth: 'auto',
              scrollbarColor: 'rgba(155, 155, 155, 0.5) transparent'
            }}
          >
            {sectionControls.length === 0 ? (
              <div className="flex items-center justify-center h-96 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                <div className="text-center text-muted-foreground">
                  <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Start Building Your Form</h3>
                  <p className="text-sm max-w-sm mx-auto">
                    Drag controls from the library on the left to start building your form. 
                    You can customize each control's properties in the panel on the right.
                  </p>
                  {draggedControl && (
                    <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
                      <p className="text-sm text-primary font-medium">
                        Drop "{draggedControl.name}" here to add it to your form
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              sectionControls.map((control, index) => (
                <DraggableControlComponent
                  key={control.id}
                  control={control}
                  index={index}
                  isSelected={selectedControl?.id === control.id}
                  onSelect={() => handleControlSelect(control)}
                  onUpdate={onControlUpdate}
                  onMove={onControlMove}
                  onRemove={onControlRemove}
                  onReorder={onControlReorder}
                />
              ))
            )}
            
            {/* Drop indicator */}
            {isOver && canDrop && draggedControl && (
              <div className="border-2 border-dashed border-primary rounded-lg p-8 bg-primary/5">
                <div className="text-center text-primary">
                  <Plus className="h-8 w-8 mx-auto mb-2" />
                  <p className="font-medium">Drop "{draggedControl.name}" here</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
```

PROPERTIES PANEL (client/src/components/PropertiesPanel.tsx):
```typescript
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

import { Settings, Palette, Eye, Code } from 'lucide-react';

import type { DroppedControl, Section } from '@shared/types';

interface PropertiesPanelProps {
  selectedControl: DroppedControl | null;
  onUpdateControl: (id: string, updates: Partial<DroppedControl>) => void;
  sections: Section[];
  droppedControls: DroppedControl[];
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedControl,
  onUpdateControl,
  sections,
  droppedControls
}) => {
  if (!selectedControl) {
    return (
      <div className="w-80 bg-card border-l border-border flex flex-col">
        <div className="p-6 flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Settings className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Control Selected</h3>
            <p className="text-sm">
              Select a control from the design canvas to edit its properties
            </p>
          </div>
        </div>
      </div>
    );
  }

  const updateProperty = (key: string, value: any) => {
    onUpdateControl(selectedControl.id, {
      properties: {
        ...selectedControl.properties,
        [key]: value
      }
    });
  };

  const updateControlMeta = (updates: Partial<DroppedControl>) => {
    onUpdateControl(selectedControl.id, updates);
  };

  return (
    <div className="w-80 bg-card border-l border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
            <Settings className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Properties</h3>
            <p className="text-xs text-muted-foreground">
              {selectedControl.type} • {selectedControl.name}
            </p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Basic Properties */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <h4 className="font-medium">Basic Properties</h4>
            </div>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="control-name">Control Name</Label>
                <Input
                  id="control-name"
                  value={selectedControl.name}
                  onChange={(e) => updateControlMeta({ name: e.target.value })}
                  placeholder="Enter control name"
                />
              </div>
              
              <div>
                <Label htmlFor="control-label">Label</Label>
                <Input
                  id="control-label"
                  value={selectedControl.properties.label || ''}
                  onChange={(e) => updateProperty('label', e.target.value)}
                  placeholder="Enter label text"
                />
              </div>
              
              <div>
                <Label htmlFor="placeholder">Placeholder</Label>
                <Input
                  id="placeholder"
                  value={selectedControl.properties.placeholder || ''}
                  onChange={(e) => updateProperty('placeholder', e.target.value)}
                  placeholder="Enter placeholder text"
                />
              </div>
              
              <div>
                <Label htmlFor="help-text">Help Text</Label>
                <Textarea
                  id="help-text"
                  value={selectedControl.properties.helpText || ''}
                  onChange={(e) => updateProperty('helpText', e.target.value)}
                  placeholder="Enter help text"
                  rows={2}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="required"
                  checked={selectedControl.properties.required || false}
                  onCheckedChange={(checked) => updateProperty('required', checked)}
                />
                <Label htmlFor="required">Required field</Label>
              </div>
            </div>
          </div>

          <Separator />

          {/* Control-specific properties */}
          {(selectedControl.type === 'text' || selectedControl.type === 'textarea') && (
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Code className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-medium">Validation</h4>
              </div>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="max-length">Maximum Length</Label>
                  <Input
                    id="max-length"
                    type="number"
                    value={selectedControl.properties.maxLength || ''}
                    onChange={(e) => updateProperty('maxLength', parseInt(e.target.value) || undefined)}
                    placeholder="Enter max characters"
                  />
                </div>
                
                <div>
                  <Label htmlFor="pattern">Validation Pattern (Regex)</Label>
                  <Input
                    id="pattern"
                    value={selectedControl.properties.pattern || ''}
                    onChange={(e) => updateProperty('pattern', e.target.value)}
                    placeholder="Enter regex pattern"
                  />
                </div>
              </div>
            </div>
          )}

          {(selectedControl.type === 'select' || selectedControl.type === 'radio' || selectedControl.type === 'checkbox') && (
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Code className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-medium">Options</h4>
              </div>
              
              <div className="space-y-2">
                {(selectedControl.properties.options || []).map((option: any, index: number) => (
                  <div key={index} className="flex space-x-2">
                    <Input
                      value={option.label}
                      onChange={(e) => {
                        const newOptions = [...(selectedControl.properties.options || [])];
                        newOptions[index] = { ...option, label: e.target.value, value: e.target.value.toLowerCase().replace(/\s+/g, '_') };
                        updateProperty('options', newOptions);
                      }}
                      placeholder="Option label"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newOptions = (selectedControl.properties.options || []).filter((_: any, i: number) => i !== index);
                        updateProperty('options', newOptions);
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newOption = { label: 'New Option', value: 'new_option' };
                    const currentOptions = selectedControl.properties.options || [];
                    updateProperty('options', [...currentOptions, newOption]);
                  }}
                  className="w-full"
                >
                  Add Option
                </Button>
              </div>
            </div>
          )}

          <Separator />

          {/* Layout Properties */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Palette className="h-4 w-4 text-muted-foreground" />
              <h4 className="font-medium">Layout</h4>
            </div>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="section">Section</Label>
                <Select
                  value={selectedControl.sectionId || ''}
                  onValueChange={(value) => updateControlMeta({ sectionId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map(section => (
                      <SelectItem key={section.id} value={section.id}>
                        {section.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="width">Width (1-12)</Label>
                  <Input
                    id="width"
                    type="number"
                    min="1"
                    max="12"
                    value={selectedControl.width}
                    onChange={(e) => updateControlMeta({ width: parseInt(e.target.value) || 12 })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="height">Height</Label>
                  <Input
                    id="height"
                    type="number"
                    min="1"
                    value={selectedControl.height}
                    onChange={(e) => updateControlMeta({ height: parseInt(e.target.value) || 1 })}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
```

Include drag-and-drop reordering, visual feedback, and proper TypeScript interfaces for all components.
```

### 5. Complete Control System with 20+ Types

```
Create a comprehensive control system with all form control types:

CONTROL DEFINITIONS (client/src/data/controls.ts):
```typescript
import { 
  Type, AlignLeft, Hash, Mail, Lock, Link, Calendar, Clock, 
  CalendarDays, ChevronDown, CheckSquare, RadioButton, ToggleLeft,
  Upload, Image, Star, Sliders, Palette, Tags, Grid3x3, 
  Minus, FileText, BarChart3
} from 'lucide-react';

export interface ControlCategory {
  name: string;
  icon: any;
  description: string;
}

export interface ControlType {
  type: string;
  name: string;
  category: string;
  icon: any;
  description: string;
  defaultProperties: Record<string, any>;
}

export const CONTROL_CATEGORIES: ControlCategory[] = [
  {
    name: 'Core Input',
    icon: Type,
    description: 'Basic text and numeric input controls'
  },
  {
    name: 'Date & Time',
    icon: Calendar,
    description: 'Date, time, and datetime controls'
  },
  {
    name: 'Selection Controls',
    icon: CheckSquare,
    description: 'Dropdown, radio, checkbox selections'
  },
  {
    name: 'File Upload',
    icon: Upload,
    description: 'File and image upload controls'
  },
  {
    name: 'Advanced',
    icon: Sliders,
    description: 'Advanced input and interactive controls'
  },
  {
    name: 'Layout & Display',
    icon: Grid3x3,
    description: 'Layout helpers and display elements'
  }
];

export const CONTROLS: ControlType[] = [
  // Core Input Controls
  {
    type: 'text',
    name: 'Text Box',
    category: 'Core Input',
    icon: Type,
    description: 'Single-line text input field',
    defaultProperties: {
      label: 'Text Input',
      placeholder: 'Enter text...',
      required: false,
      maxLength: 255,
      pattern: ''
    }
  },
  {
    type: 'textarea',
    name: 'Multi-line Text',
    category: 'Core Input',
    icon: AlignLeft,
    description: 'Multi-line text area for longer content',
    defaultProperties: {
      label: 'Text Area',
      placeholder: 'Enter your text...',
      required: false,
      rows: 4,
      maxLength: 1000
    }
  },
  {
    type: 'number',
    name: 'Numeric Control',
    category: 'Core Input',
    icon: Hash,
    description: 'Numeric input with validation',
    defaultProperties: {
      label: 'Number',
      placeholder: '0',
      required: false,
      min: 0,
      max: 100,
      step: 1
    }
  },
  {
    type: 'email',
    name: 'Email Input',
    category: 'Core Input',
    icon: Mail,
    description: 'Email address input with validation',
    defaultProperties: {
      label: 'Email Address',
      placeholder: 'your@email.com',
      required: false
    }
  },
  {
    type: 'password',
    name: 'Password Input',
    category: 'Core Input',
    icon: Lock,
    description: 'Password input with toggle visibility',
    defaultProperties: {
      label: 'Password',
      placeholder: 'Enter password...',
      required: false,
      showToggle: true
    }
  },
  {
    type: 'url',
    name: 'URL Input',
    category: 'Core Input',
    icon: Link,
    description: 'URL input with validation',
    defaultProperties: {
      label: 'Website URL',
      placeholder: 'https://example.com',
      required: false
    }
  },

  // Date & Time Controls
  {
    type: 'date',
    name: 'Date Picker',
    category: 'Date & Time',
    icon: Calendar,
    description: 'Date selection with calendar widget',
    defaultProperties: {
      label: 'Select Date',
      placeholder: 'Pick a date',
      required: false,
      format: 'yyyy-MM-dd'
    }
  },
  {
    type: 'time',
    name: 'Time Picker',
    category: 'Date & Time',
    icon: Clock,
    description: 'Time selection input',
    defaultProperties: {
      label: 'Select Time',
      placeholder: 'Pick a time',
      required: false,
      format: '24h'
    }
  },
  {
    type: 'datetime',
    name: 'DateTime Picker',
    category: 'Date & Time',
    icon: CalendarDays,
    description: 'Combined date and time selection',
    defaultProperties: {
      label: 'Select Date & Time',
      placeholder: 'Pick date and time',
      required: false
    }
  },

  // Selection Controls
  {
    type: 'select',
    name: 'Dropdown',
    category: 'Selection Controls',
    icon: ChevronDown,
    description: 'Single selection dropdown menu',
    defaultProperties: {
      label: 'Select Option',
      placeholder: 'Choose an option',
      required: false,
      options: [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' }
      ]
    }
  },
  {
    type: 'multiselect',
    name: 'Multi-Select',
    category: 'Selection Controls',
    icon: CheckSquare,
    description: 'Multiple selection dropdown',
    defaultProperties: {
      label: 'Select Multiple',
      placeholder: 'Choose options',
      required: false,
      options: [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' }
      ]
    }
  },
  {
    type: 'radio',
    name: 'Radio Group',
    category: 'Selection Controls',
    icon: RadioButton,
    description: 'Single selection radio buttons',
    defaultProperties: {
      label: 'Choose One',
      required: false,
      layout: 'vertical',
      options: [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' }
      ]
    }
  },
  {
    type: 'checkbox',
    name: 'Checkbox Group',
    category: 'Selection Controls',
    icon: CheckSquare,
    description: 'Multiple selection checkboxes',
    defaultProperties: {
      label: 'Select All That Apply',
      required: false,
      layout: 'vertical',
      options: [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' }
      ]
    }
  },

  // File Upload Controls
  {
    type: 'file',
    name: 'File Upload',
    category: 'File Upload',
    icon: Upload,
    description: 'Single or multiple file upload',
    defaultProperties: {
      label: 'Upload File',
      placeholder: 'Click to upload or drag and drop',
      required: false,
      multiple: false,
      acceptedTypes: '',
      maxSize: 10485760 // 10MB
    }
  },
  {
    type: 'image',
    name: 'Image Upload',
    category: 'File Upload',
    icon: Image,
    description: 'Image upload with preview',
    defaultProperties: {
      label: 'Upload Image',
      placeholder: 'Click to upload image',
      required: false,
      multiple: false,
      acceptedTypes: 'image/*',
      maxSize: 5242880, // 5MB
      showPreview: true
    }
  },

  // Advanced Controls
  {
    type: 'rating',
    name: 'Rating Control',
    category: 'Advanced',
    icon: Star,
    description: 'Star rating input',
    defaultProperties: {
      label: 'Rate This',
      required: false,
      maxRating: 5,
      allowHalf: false,
      icon: 'star'
    }
  },
  {
    type: 'slider',
    name: 'Slider',
    category: 'Advanced',
    icon: Sliders,
    description: 'Range slider input',
    defaultProperties: {
      label: 'Select Value',
      required: false,
      min: 0,
      max: 100,
      step: 1,
      defaultValue: 50,
      showValue: true
    }
  },
  {
    type: 'toggle',
    name: 'Toggle Switch',
    category: 'Advanced',
    icon: ToggleLeft,
    description: 'Boolean toggle switch',
    defaultProperties: {
      label: 'Enable Option',
      required: false,
      defaultValue: false,
      onLabel: 'Yes',
      offLabel: 'No'
    }
  },
  {
    type: 'color',
    name: 'Color Picker',
    category: 'Advanced',
    icon: Palette,
    description: 'Color selection input',
    defaultProperties: {
      label: 'Select Color',
      required: false,
      defaultValue: '#3b82f6',
      format: 'hex'
    }
  },
  {
    type: 'tags',
    name: 'Tag Input',
    category: 'Advanced',
    icon: Tags,
    description: 'Dynamic tag creation and selection',
    defaultProperties: {
      label: 'Add Tags',
      placeholder: 'Type and press Enter',
      required: false,
      maxTags: 10,
      suggestions: []
    }
  },

  // Layout & Display Controls
  {
    type: 'matrix',
    name: 'Grid Matrix',
    category: 'Layout & Display',
    icon: Grid3x3,
    description: 'Question matrix with rating scales',
    defaultProperties: {
      label: 'Rate the Following',
      required: false,
      questions: [
        'Question 1',
        'Question 2',
        'Question 3'
      ],
      scale: [
        { label: 'Poor', value: '1' },
        { label: 'Good', value: '2' },
        { label: 'Excellent', value: '3' }
      ]
    }
  },
  {
    type: 'divider',
    name: 'Section Divider',
    category: 'Layout & Display',
    icon: Minus,
    description: 'Visual separator between sections',
    defaultProperties: {
      label: 'Section Break',
      style: 'line',
      thickness: 1,
      color: '#e5e7eb'
    }
  },
  {
    type: 'html',
    name: 'HTML Content',
    category: 'Layout & Display',
    icon: FileText,
    description: 'Rich text and HTML content display',
    defaultProperties: {
      label: 'Content Block',
      content: '<p>Enter your HTML content here...</p>',
      allowHtml: true
    }
  },
  {
    type: 'progress',
    name: 'Progress Indicator',
    category: 'Layout & Display',
    icon: BarChart3,
    description: 'Form completion progress display',
    defaultProperties: {
      label: 'Form Progress',
      showPercentage: true,
      showSteps: true,
      style: 'bar'
    }
  }
];
```

CONTROL RENDERING COMPONENT (client/src/components/DroppedControlComponent.tsx):
```typescript
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { 
  Calendar as CalendarIcon, Upload, Star, Eye, EyeOff, 
  ArrowUp, ArrowDown, Trash2, Copy
} from 'lucide-react';

import type { DroppedControl } from '@shared/types';

interface DroppedControlComponentProps {
  control: DroppedControl;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<DroppedControl>) => void;
  onMove?: (id: string, direction: 'up' | 'down') => void;
  onRemove?: (id: string) => void;
  isInPreviewMode?: boolean;
  value?: any;
  onChange?: (value: any) => void;
}

export const DroppedControlComponent: React.FC<DroppedControlComponentProps> = ({
  control,
  isSelected,
  onSelect,
  onUpdate,
  onMove,
  onRemove,
  isInPreviewMode = false,
  value,
  onChange
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [date, setDate] = useState<Date>();

  const handleValueChange = (newValue: any) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  const renderControl = () => {
    switch (control.type) {
      case 'text':
        return (
          <Input
            type="text"
            placeholder={control.properties.placeholder}
            value={value || ''}
            onChange={(e) => handleValueChange(e.target.value)}
            disabled={!isInPreviewMode}
            maxLength={control.properties.maxLength}
            className={isSelected && !isInPreviewMode ? 'ring-2 ring-primary' : ''}
          />
        );

      case 'textarea':
        return (
          <Textarea
            placeholder={control.properties.placeholder}
            value={value || ''}
            onChange={(e) => handleValueChange(e.target.value)}
            disabled={!isInPreviewMode}
            rows={control.properties.rows || 4}
            maxLength={control.properties.maxLength}
            className={isSelected && !isInPreviewMode ? 'ring-2 ring-primary' : ''}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            placeholder={control.properties.placeholder}
            value={value || ''}
            onChange={(e) => handleValueChange(e.target.value)}
            disabled={!isInPreviewMode}
            min={control.properties.min}
            max={control.properties.max}
            step={control.properties.step}
            className={isSelected && !isInPreviewMode ? 'ring-2 ring-primary' : ''}
          />
        );

      case 'email':
        return (
          <Input
            type="email"
            placeholder={control.properties.placeholder}
            value={value || ''}
            onChange={(e) => handleValueChange(e.target.value)}
            disabled={!isInPreviewMode}
            className={isSelected && !isInPreviewMode ? 'ring-2 ring-primary' : ''}
          />
        );

      case 'password':
        return (
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder={control.properties.placeholder}
              value={value || ''}
              onChange={(e) => handleValueChange(e.target.value)}
              disabled={!isInPreviewMode}
              className={isSelected && !isInPreviewMode ? 'ring-2 ring-primary pr-10' : 'pr-10'}
            />
            {control.properties.showToggle && (
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            )}
          </div>
        );

      case 'url':
        return (
          <Input
            type="url"
            placeholder={control.properties.placeholder}
            value={value || ''}
            onChange={(e) => handleValueChange(e.target.value)}
            disabled={!isInPreviewMode}
            className={isSelected && !isInPreviewMode ? 'ring-2 ring-primary' : ''}
          />
        );

      case 'date':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal ${
                  isSelected && !isInPreviewMode ? 'ring-2 ring-primary' : ''
                }`}
                disabled={!isInPreviewMode}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? date.toLocaleDateString() : control.properties.placeholder}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => {
                  setDate(newDate);
                  handleValueChange(newDate?.toISOString());
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );

      case 'select':
        return (
          <Select value={value || ''} onValueChange={handleValueChange} disabled={!isInPreviewMode}>
            <SelectTrigger className={isSelected && !isInPreviewMode ? 'ring-2 ring-primary' : ''}>
              <SelectValue placeholder={control.properties.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {control.properties.options?.map((option: any, index: number) => (
                <SelectItem key={index} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'radio':
        return (
          <RadioGroup
            value={value || ''}
            onValueChange={handleValueChange}
            disabled={!isInPreviewMode}
            className={control.properties.layout === 'horizontal' ? 'flex space-x-4' : 'space-y-2'}
          >
            {control.properties.options?.map((option: any, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`${control.id}-${index}`} />
                <Label htmlFor={`${control.id}-${index}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'checkbox':
        return (
          <div className={control.properties.layout === 'horizontal' ? 'flex space-x-4' : 'space-y-2'}>
            {control.properties.options?.map((option: any, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`${control.id}-${index}`}
                  checked={(value || []).includes(option.value)}
                  onCheckedChange={(checked) => {
                    const currentValues = value || [];
                    if (checked) {
                      handleValueChange([...currentValues, option.value]);
                    } else {
                      handleValueChange(currentValues.filter((v: any) => v !== option.value));
                    }
                  }}
                  disabled={!isInPreviewMode}
                />
                <Label htmlFor={`${control.id}-${index}`}>{option.label}</Label>
              </div>
            ))}
          </div>
        );

      case 'file':
        return (
          <div className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-colors ${
            isSelected && !isInPreviewMode ? 'ring-2 ring-primary' : ''
          }`}>
            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">
              {control.properties.placeholder}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {control.properties.acceptedTypes && `Accepted: ${control.properties.acceptedTypes}`}
            </p>
          </div>
        );

      case 'rating':
        return (
          <div className="flex space-x-1">
            {Array.from({ length: control.properties.maxRating || 5 }).map((_, index) => (
              <Star
                key={index}
                className={`h-6 w-6 cursor-pointer transition-colors ${
                  index < (value || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
                onClick={() => isInPreviewMode && handleValueChange(index + 1)}
              />
            ))}
          </div>
        );

      case 'slider':
        return (
          <div className="space-y-3">
            <Slider
              value={[value || control.properties.defaultValue || 0]}
              onValueChange={(newValue) => handleValueChange(newValue[0])}
              max={control.properties.max || 100}
              min={control.properties.min || 0}
              step={control.properties.step || 1}
              disabled={!isInPreviewMode}
              className={isSelected && !isInPreviewMode ? 'ring-2 ring-primary' : ''}
            />
            {control.properties.showValue && (
              <div className="flex justify-between text-sm text-gray-500">
                <span>{control.properties.min || 0}</span>
                <span className="font-medium">{value || control.properties.defaultValue || 0}</span>
                <span>{control.properties.max || 100}</span>
              </div>
            )}
          </div>
        );

      case 'toggle':
        return (
          <div className="flex items-center space-x-3">
            <Switch
              checked={value || false}
              onCheckedChange={handleValueChange}
              disabled={!isInPreviewMode}
            />
            <div className="flex space-x-2 text-sm">
              <span className={!value ? 'font-medium' : 'text-muted-foreground'}>
                {control.properties.offLabel || 'No'}
              </span>
              <span>/</span>
              <span className={value ? 'font-medium' : 'text-muted-foreground'}>
                {control.properties.onLabel || 'Yes'}
              </span>
            </div>
          </div>
        );

      case 'color':
        return (
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={value || control.properties.defaultValue || '#3b82f6'}
              onChange={(e) => handleValueChange(e.target.value)}
              disabled={!isInPreviewMode}
              className="w-12 h-10 rounded border border-input cursor-pointer disabled:cursor-not-allowed"
            />
            <Input
              value={value || control.properties.defaultValue || '#3b82f6'}
              onChange={(e) => handleValueChange(e.target.value)}
              disabled={!isInPreviewMode}
              className="font-mono"
              placeholder="#3b82f6"
            />
          </div>
        );

      default:
        return (
          <div className="p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
            <p className="text-sm text-gray-500 text-center">
              Control type "{control.type}" not implemented
            </p>
          </div>
        );
    }
  };

  return (
    <div
      className={`group relative p-4 border rounded-lg transition-all cursor-pointer ${
        isSelected && !isInPreviewMode
          ? 'border-primary bg-primary/5 shadow-md'
          : 'border-border hover:border-border/80 hover:shadow-sm'
      }`}
      onClick={onSelect}
    >
      {/* Control Label */}
      {control.properties.label && (
        <Label className="block mb-2 font-medium">
          {control.properties.label}
          {control.properties.required && (
            <span className="text-destructive ml-1">*</span>
          )}
        </Label>
      )}

      {/* Control Component */}
      {renderControl()}

      {/* Help Text */}
      {control.properties.helpText && (
        <p className="text-sm text-muted-foreground mt-2">
          {control.properties.helpText}
        </p>
      )}

      {/* Design Mode Controls */}
      {!isInPreviewMode && isSelected && (
        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onMove && (
            <>
              <Button
                size="sm"
                variant="outline"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onMove(control.id, 'up');
                }}
              >
                <ArrowUp className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onMove(control.id, 'down');
                }}
              >
                <ArrowDown className="h-3 w-3" />
              </Button>
            </>
          )}
          <Button
            size="sm"
            variant="outline"
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation();
              // Copy control functionality
            }}
          >
            <Copy className="h-3 w-3" />
          </Button>
          {onRemove && (
            <Button
              size="sm"
              variant="destructive"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(control.id);
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
```

Include validation logic, proper event handling, and accessibility features for all control types.
```

Remember to use these prompts with AI coding assistants that support TypeScript and React development. Each prompt is designed to be comprehensive and includes all necessary context for successful implementation.

## Usage Instructions

1. Start with the Master Creation Prompt for a complete application
2. Use individual feature prompts for specific functionality
3. Always include the preservation instruction: "Don't override existing functionality when adding new features"
4. Test each feature thoroughly after implementation
5. Follow the established patterns and conventions

## Additional Notes

- All prompts include proper TypeScript typing
- Error handling and validation are built into each feature
- Responsive design and accessibility are included throughout
- The system is designed for extensibility and maintenance
- Performance optimizations are included where appropriate