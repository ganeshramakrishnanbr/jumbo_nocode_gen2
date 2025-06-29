# Jumbo No-Code Form Builder

## Overview

This is a comprehensive no-code form builder application that allows users to create dynamic forms through a drag-and-drop interface. The application supports multiple customer tiers (Bronze, Silver, Gold, Platinum) with varying feature sets, and includes capabilities for importing/exporting form definitions via Excel templates.

## System Architecture

The application follows a full-stack monolithic architecture with clear separation between client and server concerns:

- **Frontend**: React with TypeScript, using Vite for development and building
- **Backend**: Express.js server with TypeScript support
- **Database**: PostgreSQL with Drizzle ORM for schema management
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with dark mode support
- **Build System**: Vite for client-side bundling, esbuild for server-side bundling

## Key Components

### Frontend Architecture
- **Component-based React structure** with TypeScript for type safety
- **Drag-and-drop functionality** using react-dnd for form builder interface
- **Theme system** with light/dark mode support using custom hooks
- **Local SQLite database** for client-side data persistence using libsql
- **Excel import/export** functionality for form templates
- **Responsive design** with mobile-first approach

### Backend Architecture
- **Express.js REST API** with middleware for JSON parsing and request logging
- **Session management** using connect-pg-simple with PostgreSQL sessions
- **Database migrations** managed through Drizzle Kit
- **Static file serving** with Vite integration in development

### Key Features
1. **Multi-tier customer experience** with feature limitations based on subscription level
2. **Form builder interface** with drag-and-drop controls from a component library
3. **Section-based form organization** with visual management
4. **Real-time preview mode** for form testing
5. **PDF Preview functionality** with real-time generation, tier-based templates, and customization options
6. **JSON export/import** for form definitions with expandable sections
7. **Excel template system** for bulk form creation
8. **Dashboard with analytics** showing form usage statistics

## Data Flow

1. **Form Creation**: Users drag controls from the library onto the design canvas
2. **Control Configuration**: Properties panel allows customization of control behavior
3. **Section Management**: Forms are organized into logical sections with ordering
4. **Preview Generation**: Real-time preview shows how the form appears to end users
5. **Data Persistence**: Form definitions stored in local SQLite for immediate use
6. **Export/Import**: Forms can be exported as JSON or Excel templates for sharing

## External Dependencies

### Frontend Dependencies
- **React ecosystem**: React 18 with hooks, react-dnd for drag-and-drop
- **UI libraries**: Radix UI primitives, Lucide React icons, shadcn/ui components
- **Data handling**: TanStack Query for state management, date-fns for date utilities
- **Excel processing**: SheetJS (xlsx) for template generation and parsing
- **Database**: libsql client for local SQLite operations

### Backend Dependencies
- **Express.js**: Web framework with middleware support
- **Database**: Drizzle ORM with PostgreSQL dialect, Neon Database serverless driver
- **Session management**: connect-pg-simple for PostgreSQL session storage
- **Development**: tsx for TypeScript execution, esbuild for production bundling

### Build Tools
- **Vite**: Frontend build tool with React plugin and runtime error overlay
- **TypeScript**: Type safety across the entire stack
- **Tailwind CSS**: Utility-first CSS framework with PostCSS processing
- **ESBuild**: Fast JavaScript bundler for server-side code

## Deployment Strategy

The application is configured for deployment on Replit with the following strategy:

1. **Development mode**: 
   - Frontend served by Vite dev server with HMR
   - Backend runs with tsx for TypeScript execution
   - Database uses local PostgreSQL connection

2. **Production build**:
   - Frontend built to static files in `dist/public`
   - Backend bundled with esbuild to `dist/index.js`
   - Static files served by Express in production

3. **Database deployment**:
   - Uses Neon Database serverless PostgreSQL
   - Schema migrations handled by Drizzle Kit
   - Connection string provided via `DATABASE_URL` environment variable

4. **Environment configuration**:
   - Development/production modes controlled by `NODE_ENV`
   - Replit-specific plugins enabled in non-production environments
   - Runtime error modal integration for development

## Changelog

```
Changelog:
- June 29, 2025. Initial setup and migration from Bolt
- June 29, 2025. Enhanced Excel import with dynamic section creation
- June 29, 2025. Preserved original Bolt documentation in docs/ folder and .bolt file
- June 29, 2025. Added comprehensive PDF Preview functionality with real-time generation and tier-based templates
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```