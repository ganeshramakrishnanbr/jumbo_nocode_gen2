# 01 - Project Setup and Configuration

This prompt sets up the complete project foundation with proper TypeScript configuration, build tools, and dependencies.

## Visual Design Requirements

### Color Scheme
Create a professional, modern design system with:
- **Primary Blue**: #3b82f6 (main actions, links, active states)
- **Secondary Gray**: #64748b (supporting text, borders, inactive elements)
- **Accent Cyan**: #06b6d4 (highlights, success indicators, CTAs)
- **Background Light**: #ffffff (main background)
- **Background Dark**: #0f172a (dark mode main background)
- **Surface Light**: #f8fafc (cards, panels, elevated surfaces)
- **Surface Dark**: #1e293b (dark mode cards and panels)

### Typography System
- **Font Stack**: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif
- **Scale**: 12px, 14px, 16px, 18px, 20px, 24px, 32px, 48px
- **Weights**: 300 (light), 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- **Line Heights**: 1.2 for headings, 1.5 for body text, 1.4 for UI elements

### Layout System
- **Grid**: CSS Grid and Flexbox for responsive layouts
- **Spacing Scale**: 4px base unit (4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px)
- **Border Radius**: 6px standard, 8px for cards, 4px for small elements
- **Shadows**: Subtle layered shadows for depth and hierarchy

### Component Styling Standards
- **Buttons**: 6px radius, consistent padding (8px 16px for small, 12px 24px for medium)
- **Inputs**: 6px radius, 1px border, proper focus rings with 2px offset
- **Cards**: 8px radius, subtle shadows, proper content spacing
- **Navigation**: Clean horizontal tabs with smooth underline animations

## AI Prompt

```
Create a modern full-stack TypeScript React application with professional visual design following these exact specifications:

PROJECT SETUP REQUIREMENTS:

VISUAL DESIGN SYSTEM:
Implement a complete design system with:

Color Palette:
- Primary: #3b82f6 (Blue 500) for main actions and active states
- Secondary: #64748b (Slate 500) for supporting elements
- Accent: #06b6d4 (Cyan 500) for highlights and CTAs
- Success: #10b981 (Emerald 500)
- Warning: #f59e0b (Amber 500) 
- Error: #ef4444 (Red 500)
- Background: #ffffff (light) / #0f172a (dark)
- Surface: #f8fafc (light) / #1e293b (dark)

Typography:
- Font: Inter, system-ui, sans-serif
- Scale: 12px to 48px with harmonious progression
- Weights: 300, 400, 500, 600, 700
- Line heights: 1.2 (headings), 1.5 (body), 1.4 (UI)

Layout & Spacing:
- 4px base spacing unit
- Consistent spacing: 8px, 16px, 24px, 32px
- Border radius: 6px standard, 8px cards
- Responsive breakpoints: 640px, 768px, 1024px, 1280px

PACKAGE.JSON SETUP:
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

TAILWIND CONFIG (tailwind.config.ts):
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
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
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
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'slide-in': 'slide-in 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-in': {
          from: { transform: 'translateX(-100%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
      },
      boxShadow: {
        'soft': '0 2px 8px 0 rgba(0, 0, 0, 0.06)',
        'medium': '0 4px 16px 0 rgba(0, 0, 0, 0.08)',
        'hard': '0 8px 32px 0 rgba(0, 0, 0, 0.12)',
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
};

export default config;
```

CSS VARIABLES (client/src/index.css):
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 84% 4.9%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 94.1%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground font-sans;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}

@layer components {
  .btn-primary {
    @apply bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors;
  }
  
  .card-elevated {
    @apply bg-card text-card-foreground shadow-soft border border-border rounded-lg;
  }
  
  .input-field {
    @apply flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2;
  }
}
```

FOLDER STRUCTURE:
```
jumbo-form-builder/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   └── ui/          # shadcn/ui components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utilities and configurations
│   │   ├── data/            # Static data and configurations
│   │   ├── types/           # TypeScript type definitions
│   │   ├── index.css        # Global styles
│   │   └── main.tsx         # React entry point
│   └── index.html           # HTML template
├── server/
│   ├── index.ts             # Express server entry
│   ├── routes.ts            # API routes
│   ├── storage.ts           # Data storage layer
│   └── vite.ts              # Vite dev integration
├── shared/
│   └── schema.ts            # Database schemas
├── docs/                    # Documentation
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── vite.config.ts
├── postcss.config.js
└── drizzle.config.ts
```

VITE CONFIG (vite.config.ts):
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
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          utils: ['clsx', 'tailwind-merge', 'date-fns']
        }
      }
    }
  }
});
```

TYPESCRIPT CONFIG (tsconfig.json):
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

Create all configuration files with the exact visual design specifications provided. Ensure proper TypeScript support, modern build tooling, and a scalable folder structure for a professional form builder application.
```