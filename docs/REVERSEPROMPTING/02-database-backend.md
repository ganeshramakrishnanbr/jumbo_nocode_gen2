# 02 - Database Schema and Backend Setup

This prompt creates the complete Express.js backend with PostgreSQL database schema for the form builder application.

## Visual Design Requirements

### API Response Design
- **Consistent Structure**: All API responses follow standard format with data, status, message
- **Error Formatting**: Structured error responses with user-friendly messages
- **Loading States**: Proper HTTP status codes and response timing
- **Data Validation**: Clear validation error messages with field-specific feedback

### Database Design Principles
- **Clean Schema**: Well-structured tables with proper relationships
- **Type Safety**: Strong typing with Drizzle ORM and Zod validation
- **Performance**: Optimized queries with proper indexing
- **Scalability**: Future-proof schema design with extensibility

## AI Prompt

```
Create a comprehensive Express.js backend with PostgreSQL database for a professional form builder application:

VISUAL DESIGN INTEGRATION:
- Ensure all API responses support the design system's loading states
- Implement proper error formatting for UI error displays
- Structure data responses to match the frontend component requirements
- Include metadata for UI state management (loading, success, error states)

DATABASE SCHEMA (shared/schema.ts):
```typescript
import { pgTable, varchar, text, integer, boolean, timestamp, serial, jsonb } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Users table for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

// Questionnaires (Forms) table
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

// Form sections table
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

// Form controls table
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

// Zod validation schemas
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

// API Response types for consistent frontend integration
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}
```

EXPRESS SERVER (server/index.ts):
```typescript
import express from 'express';
import session from 'express-session';
import { createServer } from 'http';
import cors from 'cors';
import { setupVite, serveStatic } from './vite.js';
import { registerRoutes } from './routes.js';

const app = express();
const server = createServer(app);

// CORS configuration for development
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? false : 'http://localhost:5173',
  credentials: true
}));

// Middleware for parsing requests
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

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

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Register API routes
await registerRoutes(app);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    errors: process.env.NODE_ENV === 'development' ? [err.message] : []
  });
});

// Static file serving and Vite development setup
if (process.env.NODE_ENV === 'production') {
  serveStatic(app);
} else {
  await setupVite(app, server);
}

const port = process.env.PORT || 5000;
server.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});
```

STORAGE INTERFACE (server/storage.ts):
```typescript
import { eq, desc } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import type { 
  User, InsertUser, Questionnaire, Section, Control,
  ApiResponse, ValidationError 
} from '@shared/schema';

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Questionnaire methods
  getQuestionnaires(): Promise<Questionnaire[]>;
  getQuestionnaire(id: string): Promise<Questionnaire | undefined>;
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
  reorderControls(controls: { id: string; y: number }[]): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private questionnaires: Map<string, Questionnaire> = new Map();
  private sections: Map<string, Section> = new Map();
  private controls: Map<string, Control> = new Map();
  private currentUserId = 1;

  constructor() {
    // Initialize with default questionnaire
    const defaultQuestionnaire: Questionnaire = {
      id: 'default-questionnaire',
      name: 'Default Form',
      description: 'Default form for development',
      purpose: 'development',
      category: 'general',
      status: 'draft',
      tier: 'gold',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.questionnaires.set(defaultQuestionnaire.id, defaultQuestionnaire);

    // Initialize with default section
    const defaultSection: Section = {
      id: 'default-section',
      questionnaireId: 'default-questionnaire',
      name: 'General Information',
      description: 'Basic form section',
      color: '#3b82f6',
      icon: 'FileText',
      sectionOrder: 0,
      required: false
    };
    this.sections.set(defaultSection.id, defaultSection);
  }

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
    return Array.from(this.questionnaires.values())
      .sort((a, b) => b.updatedAt!.getTime() - a.updatedAt!.getTime());
  }

  async getQuestionnaire(id: string): Promise<Questionnaire | undefined> {
    return this.questionnaires.get(id);
  }

  async createQuestionnaire(questionnaire: Omit<Questionnaire, 'id' | 'createdAt' | 'updatedAt'>): Promise<Questionnaire> {
    const id = nanoid();
    const newQuestionnaire: Questionnaire = {
      ...questionnaire,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.questionnaires.set(id, newQuestionnaire);
    return newQuestionnaire;
  }

  async updateQuestionnaire(id: string, updates: Partial<Questionnaire>): Promise<void> {
    const questionnaire = this.questionnaires.get(id);
    if (questionnaire) {
      const updated = { ...questionnaire, ...updates, updatedAt: new Date() };
      this.questionnaires.set(id, updated);
    }
  }

  async deleteQuestionnaire(id: string): Promise<void> {
    this.questionnaires.delete(id);
    // Cascade delete sections and controls
    const sectionsToDelete = Array.from(this.sections.values())
      .filter(section => section.questionnaireId === id);
    sectionsToDelete.forEach(section => this.sections.delete(section.id));
    
    const controlsToDelete = Array.from(this.controls.values())
      .filter(control => control.questionnaireId === id);
    controlsToDelete.forEach(control => this.controls.delete(control.id));
  }

  async getSections(questionnaireId: string): Promise<Section[]> {
    return Array.from(this.sections.values())
      .filter(section => section.questionnaireId === questionnaireId)
      .sort((a, b) => a.sectionOrder - b.sectionOrder);
  }

  async createSection(section: Omit<Section, 'id'>): Promise<Section> {
    const id = nanoid();
    const newSection: Section = { ...section, id };
    this.sections.set(id, newSection);
    return newSection;
  }

  async updateSection(id: string, updates: Partial<Section>): Promise<void> {
    const section = this.sections.get(id);
    if (section) {
      const updated = { ...section, ...updates };
      this.sections.set(id, updated);
    }
  }

  async deleteSection(id: string): Promise<void> {
    this.sections.delete(id);
    // Cascade delete controls in this section
    const controlsToDelete = Array.from(this.controls.values())
      .filter(control => control.sectionId === id);
    controlsToDelete.forEach(control => this.controls.delete(control.id));
  }

  async getControls(questionnaireId: string): Promise<Control[]> {
    return Array.from(this.controls.values())
      .filter(control => control.questionnaireId === questionnaireId)
      .sort((a, b) => a.y - b.y || a.x - b.x);
  }

  async createControl(control: Omit<Control, 'id'>): Promise<Control> {
    const id = nanoid();
    const newControl: Control = { ...control, id };
    this.controls.set(id, newControl);
    return newControl;
  }

  async updateControl(id: string, updates: Partial<Control>): Promise<void> {
    const control = this.controls.get(id);
    if (control) {
      const updated = { ...control, ...updates };
      this.controls.set(id, updated);
    }
  }

  async deleteControl(id: string): Promise<void> {
    this.controls.delete(id);
  }

  async reorderControls(controls: { id: string; y: number }[]): Promise<void> {
    controls.forEach(({ id, y }) => {
      const control = this.controls.get(id);
      if (control) {
        this.controls.set(id, { ...control, y });
      }
    });
  }
}

export const storage = new MemStorage();
```

API ROUTES (server/routes.ts):
```typescript
import { Express } from 'express';
import { z } from 'zod';
import { storage } from './storage.js';
import { 
  insertQuestionnaireSchema, 
  insertSectionSchema, 
  insertControlSchema,
  ApiResponse 
} from '@shared/schema.js';

export async function registerRoutes(app: Express) {
  // Helper function for API responses
  const apiResponse = <T>(data?: T, message?: string, success = true): ApiResponse<T> => ({
    success,
    data,
    message,
    errors: success ? undefined : [message || 'An error occurred']
  });

  // Questionnaire routes
  app.get('/api/questionnaires', async (req, res) => {
    try {
      const questionnaires = await storage.getQuestionnaires();
      res.json(apiResponse(questionnaires, 'Questionnaires retrieved successfully'));
    } catch (error) {
      res.status(500).json(apiResponse(null, 'Failed to retrieve questionnaires', false));
    }
  });

  app.post('/api/questionnaires', async (req, res) => {
    try {
      const validatedData = insertQuestionnaireSchema.parse(req.body);
      const questionnaire = await storage.createQuestionnaire(validatedData);
      res.status(201).json(apiResponse(questionnaire, 'Questionnaire created successfully'));
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json(apiResponse(null, 'Validation failed', false));
      } else {
        res.status(500).json(apiResponse(null, 'Failed to create questionnaire', false));
      }
    }
  });

  app.get('/api/questionnaires/:id', async (req, res) => {
    try {
      const questionnaire = await storage.getQuestionnaire(req.params.id);
      if (!questionnaire) {
        return res.status(404).json(apiResponse(null, 'Questionnaire not found', false));
      }
      res.json(apiResponse(questionnaire, 'Questionnaire retrieved successfully'));
    } catch (error) {
      res.status(500).json(apiResponse(null, 'Failed to retrieve questionnaire', false));
    }
  });

  // Section routes
  app.get('/api/sections', async (req, res) => {
    try {
      const questionnaireId = req.query.questionnaireId as string || 'default-questionnaire';
      const sections = await storage.getSections(questionnaireId);
      res.json(apiResponse(sections, 'Sections retrieved successfully'));
    } catch (error) {
      res.status(500).json(apiResponse(null, 'Failed to retrieve sections', false));
    }
  });

  app.post('/api/sections', async (req, res) => {
    try {
      const validatedData = insertSectionSchema.parse(req.body);
      const section = await storage.createSection(validatedData);
      res.status(201).json(apiResponse(section, 'Section created successfully'));
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json(apiResponse(null, 'Validation failed', false));
      } else {
        res.status(500).json(apiResponse(null, 'Failed to create section', false));
      }
    }
  });

  // Control routes
  app.get('/api/controls', async (req, res) => {
    try {
      const questionnaireId = req.query.questionnaireId as string || 'default-questionnaire';
      const controls = await storage.getControls(questionnaireId);
      res.json(apiResponse(controls, 'Controls retrieved successfully'));
    } catch (error) {
      res.status(500).json(apiResponse(null, 'Failed to retrieve controls', false));
    }
  });

  app.post('/api/controls', async (req, res) => {
    try {
      const validatedData = insertControlSchema.parse(req.body);
      const control = await storage.createControl(validatedData);
      res.status(201).json(apiResponse(control, 'Control created successfully'));
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json(apiResponse(null, 'Validation failed', false));
      } else {
        res.status(500).json(apiResponse(null, 'Failed to create control', false));
      }
    }
  });

  app.put('/api/controls/:id', async (req, res) => {
    try {
      await storage.updateControl(req.params.id, req.body);
      res.json(apiResponse(null, 'Control updated successfully'));
    } catch (error) {
      res.status(500).json(apiResponse(null, 'Failed to update control', false));
    }
  });

  app.delete('/api/controls/:id', async (req, res) => {
    try {
      await storage.deleteControl(req.params.id);
      res.json(apiResponse(null, 'Control deleted successfully'));
    } catch (error) {
      res.status(500).json(apiResponse(null, 'Failed to delete control', false));
    }
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json(apiResponse({ status: 'healthy', timestamp: new Date().toISOString() }));
  });
}
```

VITE INTEGRATION (server/vite.ts):
```typescript
import { Express } from 'express';
import { createServer as createViteServer } from 'vite';
import { Server } from 'http';

export async function setupVite(app: Express, server: Server) {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa'
  });

  app.use(vite.ssrFixStacktrace);
  app.use(vite.middlewares);
}

export function serveStatic(app: Express) {
  app.use(express.static('dist/public'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve('dist/public/index.html'));
  });
}
```

Create a robust backend with proper error handling, validation, and API structure that supports the form builder's visual design system and user experience requirements.
```