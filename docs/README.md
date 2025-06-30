# Jumbo No-Code Form Builder - Documentation

Welcome to the comprehensive documentation for the Jumbo No-Code Form Builder project. This documentation suite provides everything you need to understand, use, extend, and recreate this advanced form building platform.

## Documentation Overview

### 📋 [Requirements.md](./Requirements.md)
Complete technical and functional requirements specification covering:
- System architecture and technology stack
- Feature specifications by module
- Performance and security requirements
- User interface and experience requirements
- Data management and persistence requirements
- Testing and quality assurance requirements

### 🚀 [Prompts.md](./Prompts.md)
Comprehensive AI-assisted development prompts for recreating the project:
- Step-by-step implementation prompts
- Feature-specific development instructions
- Architecture-preserving guidelines
- Best practices and coding standards
- Extension and customization prompts

### 📚 [ORIGINAL_FEATURES.md](./ORIGINAL_FEATURES.md)
Documentation of original Bolt.new features and migration details:
- Original feature set from Bolt platform
- Migration process and considerations
- Feature preservation and enhancement notes

### 🔧 [BOLT_MIGRATION.md](./BOLT_MIGRATION.md)
Technical details of the migration from Bolt to Replit:
- Migration strategy and process
- Technical challenges and solutions
- Environment configuration changes
- Platform-specific adaptations

## Quick Start Guide

### For Users
1. Read the [Requirements.md](./Requirements.md) to understand system capabilities
2. Review feature specifications to understand available functionality
3. Check customer tier requirements for feature access

### For Developers
1. Start with [Requirements.md](./Requirements.md) for technical specifications
2. Use [Prompts.md](./Prompts.md) for AI-assisted development
3. Follow the step-by-step implementation guide
4. Refer to migration docs for platform-specific considerations

### For Project Managers
1. Review [Requirements.md](./Requirements.md) for complete feature scope
2. Use requirements for project planning and estimation
3. Reference testing requirements for QA planning
4. Check performance requirements for infrastructure planning

## Project Structure

```
jumbo-form-builder/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility libraries
│   │   └── types/          # TypeScript type definitions
├── server/                 # Express backend
│   ├── routes.ts           # API route definitions
│   ├── storage.ts          # Data storage layer
│   └── vite.ts             # Vite development integration
├── shared/                 # Shared code and schemas
│   └── schema.ts           # Database schemas and types
├── docs/                   # Documentation (this folder)
│   ├── Requirements.md     # Complete requirements spec
│   ├── Prompts.md          # Development prompts
│   ├── ORIGINAL_FEATURES.md # Original feature documentation
│   └── BOLT_MIGRATION.md   # Migration documentation
└── replit.md               # Project overview and changelog
```

## Key Features

### Core Form Building
- **Drag-and-Drop Interface**: Intuitive form creation with 20+ control types
- **Section Management**: Organize forms into logical sections with visual tabs
- **Real-Time Preview**: Live preview of form appearance and functionality
- **Properties Panel**: Comprehensive control configuration and customization

### Data Management
- **Excel Import/Export**: Bulk form creation and data exchange
- **JSON Export**: Complete form definition export with tier-based complexity
- **Database Persistence**: PostgreSQL storage with Drizzle ORM
- **Version Control**: Form versioning and change tracking

### Dashboard Designer
- **Template System**: Multiple professional dashboard layouts
- **Theme Customization**: Color schemes and appearance configuration
- **Live Preview**: Real-time dashboard preview and customization
- **Export System**: Separate JSON configuration for dashboard settings

### Customer Tier System
- **Multi-Tier Access**: Bronze, Silver, Gold, Platinum feature tiers
- **Feature Gating**: Tier-based access to controls and templates
- **Upgrade Prompts**: Contextual suggestions for tier upgrades
- **Visual Indicators**: Clear tier badges and feature limitations

### Advanced Features
- **PDF Generation**: Professional PDF output with custom templates
- **Mobile Responsive**: Mobile-first design with touch support
- **Dark Mode**: Complete dark mode theme with smooth transitions
- **Accessibility**: WCAG 2.1 AA compliance with screen reader support

## Technology Stack

### Frontend
- **React 18+** with TypeScript for component architecture
- **Vite** for development and build tooling
- **Tailwind CSS** with dark mode for styling
- **Radix UI** primitives with shadcn/ui components
- **React DnD** for drag-and-drop functionality
- **React Hook Form** with Zod validation

### Backend
- **Express.js** with TypeScript for API server
- **PostgreSQL** with Drizzle ORM for data persistence
- **Session Management** with connect-pg-simple
- **Authentication** with Passport.js strategies

### Build & Development
- **TypeScript** with strict mode for type safety
- **ESBuild** for production backend bundling
- **PostCSS** with Autoprefixer for CSS processing
- **Replit** deployment with environment configuration

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- Modern web browser with JavaScript enabled

### Installation
1. Clone the repository and install dependencies
2. Configure environment variables for database connection
3. Run database migrations with Drizzle Kit
4. Start development server with `npm run dev`

### Development Workflow
1. Use the Design tab to create and edit forms
2. Preview forms in real-time with the Preview tab
3. Generate PDFs with the PDF Preview tab
4. Export form definitions with the JSON tab
5. Import bulk data with Excel import functionality

## Contributing

When contributing to this project:
1. Follow the architectural patterns established in the codebase
2. Use the development prompts in [Prompts.md](./Prompts.md) for new features
3. Maintain compatibility with existing functionality
4. Add comprehensive tests for new features
5. Update documentation for significant changes

## Support and Resources

- **Requirements**: Reference [Requirements.md](./Requirements.md) for complete specifications
- **Development**: Use [Prompts.md](./Prompts.md) for AI-assisted development
- **Migration**: Check [BOLT_MIGRATION.md](./BOLT_MIGRATION.md) for platform-specific notes
- **Features**: Review [ORIGINAL_FEATURES.md](./ORIGINAL_FEATURES.md) for feature heritage

## License

This project is licensed under the MIT License. See the project root for license details.

---

For questions, issues, or contributions, please refer to the appropriate documentation sections or contact the development team.