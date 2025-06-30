# Launch Instructions - VS Code Development Setup

This guide provides step-by-step instructions for setting up and running the Jumbo No-Code Form Builder project in Visual Studio Code.

## Prerequisites

### Required Software
- **Node.js 18+** - [Download from nodejs.org](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **PostgreSQL 14+** - [Download from postgresql.org](https://www.postgresql.org/download/)
- **Visual Studio Code** - [Download from code.visualstudio.com](https://code.visualstudio.com/)
- **Git** - [Download from git-scm.com](https://git-scm.com/)

### Recommended VS Code Extensions
Install these extensions for the best development experience:

```
Required Extensions:
- TypeScript and JavaScript Language Features (built-in)
- ES7+ React/Redux/React-Native snippets (dsznajder.es7-react-js-snippets)
- Tailwind CSS IntelliSense (bradlc.vscode-tailwindcss)
- Prettier - Code formatter (esbenp.prettier-vscode)
- ESLint (dbaeumer.vscode-eslint)

Recommended Extensions:
- Auto Rename Tag (formulahendry.auto-rename-tag)
- Bracket Pair Colorizer 2 (CoenraadS.bracket-pair-colorizer-2)
- Thunder Client (rangav.vscode-thunder-client) - for API testing
- PostgreSQL (ckolkman.vscode-postgres) - for database management
- GitLens (eamodio.gitlens) - enhanced Git capabilities
- Path Intellisense (christian-kohler.path-intellisense)
- Import Cost (wix.vscode-import-cost)
```

## Project Setup

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd jumbo-form-builder

# Install dependencies
npm install
```

### 2. Database Setup

#### Option A: Local PostgreSQL
```bash
# Create database
createdb jumbo_forms

# Set environment variables (create .env file in project root)
echo "DATABASE_URL=postgresql://username:password@localhost:5432/jumbo_forms" > .env
echo "NODE_ENV=development" >> .env
echo "SESSION_SECRET=your-random-session-secret-here" >> .env
```

#### Option B: Using Docker PostgreSQL
```bash
# Run PostgreSQL in Docker
docker run --name postgres-jumbo \
  -e POSTGRES_DB=jumbo_forms \
  -e POSTGRES_USER=jumbo_user \
  -e POSTGRES_PASSWORD=jumbo_pass \
  -p 5432:5432 \
  -d postgres:14

# Set environment variables
echo "DATABASE_URL=postgresql://jumbo_user:jumbo_pass@localhost:5432/jumbo_forms" > .env
echo "NODE_ENV=development" >> .env
echo "SESSION_SECRET=your-random-session-secret-here" >> .env
```

### 3. Initialize Database Schema

```bash
# Push database schema
npm run db:push

# Verify connection
npx drizzle-kit studio
```

## VS Code Configuration

### 1. Workspace Settings
Create `.vscode/settings.json` in your project root:

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "typescript.suggest.autoImports": true,
  "typescript.updateImportsOnFileMove.enabled": "always"
}
```

### 2. Launch Configuration
Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Full Stack",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/server/index.ts",
      "env": {
        "NODE_ENV": "development"
      },
      "runtimeArgs": [
        "--loader",
        "tsx/esm"
      ],
      "console": "integratedTerminal",
      "skipFiles": [
        "<node_internals>/**"
      ]
    },
    {
      "name": "Debug Server Only",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/server/index.ts",
      "env": {
        "NODE_ENV": "development",
        "DEBUG": "express:*"
      },
      "runtimeArgs": [
        "--loader",
        "tsx/esm"
      ],
      "console": "integratedTerminal",
      "skipFiles": [
        "<node_internals>/**"
      ]
    }
  ]
}
```

### 3. Tasks Configuration
Create `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Development Server",
      "type": "npm",
      "script": "dev",
      "group": {
        "kind": "build",
        "isDefault": true
      },
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared",
        "showReuseMessage": true,
        "clear": false
      },
      "problemMatcher": ["$tsc"]
    },
    {
      "label": "Build Production",
      "type": "npm",
      "script": "build",
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      }
    },
    {
      "label": "Type Check",
      "type": "npm",
      "script": "check",
      "group": "test",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      }
    },
    {
      "label": "Database Push",
      "type": "npm",
      "script": "db:push",
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      }
    }
  ]
}
```

## Running the Project

### Method 1: Using VS Code Tasks (Recommended)

1. **Open Command Palette**: `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
2. **Type**: "Tasks: Run Task"
3. **Select**: "Start Development Server"
4. **Access**: Open browser to `http://localhost:5000`

### Method 2: Using Integrated Terminal

```bash
# Open integrated terminal: Ctrl+` (Windows/Linux) or Cmd+` (Mac)
npm run dev
```

### Method 3: Using Debug Configuration

1. **Go to Run and Debug**: `Ctrl+Shift+D` (Windows/Linux) or `Cmd+Shift+D` (Mac)
2. **Select**: "Launch Full Stack" from dropdown
3. **Click**: Start Debugging (F5)

## Development Workflow

### 1. Daily Development Setup
```bash
# Start your day
git pull origin main
npm install  # if package.json changed
npm run dev

# Open in browser
open http://localhost:5000
```

### 2. Working with Features

#### Creating New Components
```bash
# Components are in client/src/components/
# Follow existing naming convention: PascalCase.tsx
# Example: client/src/components/MyNewComponent.tsx
```

#### Database Changes
```bash
# Modify schema in shared/schema.ts
# Push changes to database
npm run db:push

# Open Drizzle Studio to verify
npx drizzle-kit studio
```

#### Adding Dependencies
```bash
# Frontend dependencies
npm install package-name

# Backend dependencies (already shared in this setup)
npm install package-name

# TypeScript types
npm install -D @types/package-name
```

### 3. Testing Your Changes

#### Manual Testing Checklist
- [ ] Form creation works in Design tab
- [ ] Drag and drop functionality
- [ ] Preview tab shows real form
- [ ] PDF generation works
- [ ] Excel import/export functions
- [ ] Dashboard Designer loads
- [ ] Responsive design on mobile
- [ ] Dark mode toggle works

#### Debug Tools
```bash
# Check TypeScript errors
npm run check

# View database in browser
npx drizzle-kit studio

# Monitor network requests in browser DevTools
# Check React DevTools for component state
```

## Troubleshooting

### Common Issues

#### 1. Database Connection Errors
```bash
# Check PostgreSQL is running
pg_isready -h localhost -p 5432

# Verify connection string
echo $DATABASE_URL

# Reset database
dropdb jumbo_forms
createdb jumbo_forms
npm run db:push
```

#### 2. TypeScript Errors
```bash
# Clear TypeScript cache
rm -rf node_modules/.cache
npm run check

# Restart TypeScript server in VS Code
# Command Palette: "TypeScript: Restart TS Server"
```

#### 3. Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change port in package.json dev script
# "dev": "NODE_ENV=development PORT=3001 tsx server/index.ts"
```

#### 4. Module Resolution Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check tsconfig.json paths are correct
```

### Performance Issues

#### 1. Slow Development Server
```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Restart development server
npm run dev
```

#### 2. Memory Issues
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run dev
```

## VS Code Keyboard Shortcuts

### Essential Shortcuts
- **Open Command Palette**: `Ctrl+Shift+P` / `Cmd+Shift+P`
- **Quick File Open**: `Ctrl+P` / `Cmd+P`
- **Toggle Terminal**: `Ctrl+`` / `Cmd+``
- **Start Debugging**: `F5`
- **Toggle Sidebar**: `Ctrl+B` / `Cmd+B`
- **Go to Definition**: `F12`
- **Find All References**: `Shift+F12`
- **Rename Symbol**: `F2`
- **Format Document**: `Shift+Alt+F` / `Shift+Option+F`

### React Development
- **Duplicate Line**: `Shift+Alt+Down` / `Shift+Option+Down`
- **Move Line**: `Alt+Up/Down` / `Option+Up/Down`
- **Multi-cursor**: `Ctrl+Alt+Down` / `Cmd+Option+Down`
- **Select All Occurrences**: `Ctrl+Shift+L` / `Cmd+Shift+L`

## File Structure Navigation

```
jumbo-form-builder/
├── client/src/
│   ├── components/          # React components
│   │   ├── ControlLibrary.tsx
│   │   ├── DesignCanvas.tsx
│   │   ├── PropertiesPanel.tsx
│   │   └── ...
│   ├── hooks/               # Custom React hooks
│   │   ├── useDragDrop.ts
│   │   └── useFormValues.ts
│   ├── lib/                 # Utilities and configs
│   │   └── db.ts
│   └── data/                # Static data and configs
│       ├── controls.ts
│       └── tiers.ts
├── server/                  # Backend Express app
│   ├── index.ts            # Main server entry
│   ├── routes.ts           # API routes
│   └── storage.ts          # Data layer
├── shared/                  # Shared TypeScript
│   └── schema.ts           # Database schemas
└── docs/                   # Documentation
    ├── Requirements.md
    ├── Prompts.md
    └── launch.md (this file)
```

## Environment Variables

Create a `.env` file in the project root:

```bash
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/jumbo_forms

# Application
NODE_ENV=development
PORT=5000
SESSION_SECRET=your-random-session-secret-here

# Optional: Enable debug logging
DEBUG=express:*
```

## Production Build

```bash
# Build for production
npm run build

# Test production build locally
npm start

# Verify build artifacts
ls -la dist/
```

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "Add feature description"

# Push and create PR
git push origin feature/your-feature-name
```

## Additional Resources

### Documentation Links
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Vite Guide](https://vitejs.dev/guide/)

### Project-Specific Docs
- [Requirements.md](./Requirements.md) - Complete feature specifications
- [Prompts.md](./Prompts.md) - AI-assisted development prompts
- [README.md](./README.md) - Project overview and documentation index

## Support

If you encounter issues:

1. Check this troubleshooting guide
2. Review the [Requirements.md](./Requirements.md) for expected behavior
3. Use VS Code's integrated terminal for error messages
4. Check browser DevTools console for frontend errors
5. Use PostgreSQL logs for database issues

Happy coding! 🚀