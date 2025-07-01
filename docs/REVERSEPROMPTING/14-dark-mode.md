# 14 - Dark Mode Implementation

This prompt implements comprehensive dark mode support with smooth theme switching and consistent styling.

## Visual Design Requirements

### Dark Mode Color Palette
- **Background**: #0f172a (slate-900) - Main dark background
- **Surface**: #1e293b (slate-800) - Cards, panels, elevated surfaces
- **Border**: #334155 (slate-700) - Borders and dividers
- **Text Primary**: #f8fafc (slate-50) - Main text color
- **Text Secondary**: #cbd5e1 (slate-300) - Supporting text
- **Text Muted**: #94a3b8 (slate-400) - Muted text and placeholders

### Theme Switching Animation
- **Transition Duration**: 200ms for color changes
- **Easing**: cubic-bezier(0.4, 0.0, 0.2, 1) for smooth transitions
- **Icon Animation**: 180° rotation for theme toggle button
- **Persistence**: Theme preference saved to localStorage

### Component Adaptations
- **Buttons**: Proper contrast ratios in dark mode
- **Forms**: Dark backgrounds with light text
- **Shadows**: Adjusted shadow colors for dark backgrounds
- **Focus States**: High contrast focus rings for accessibility

## AI Prompt

```
Create comprehensive dark mode support for the form builder application with the following exact specifications:

DARK MODE DESIGN SYSTEM:

Color Variables for Dark Mode:
```css
.dark {
  /* Backgrounds */
  --background: 222.2 84% 4.9%;           /* #0f172a */
  --foreground: 210 40% 98%;              /* #f8fafc */
  --card: 217.2 32.6% 17.5%;              /* #1e293b */
  --card-foreground: 210 40% 98%;         /* #f8fafc */
  --popover: 222.2 84% 4.9%;              /* #0f172a */
  --popover-foreground: 210 40% 98%;      /* #f8fafc */
  
  /* Primary Colors */
  --primary: 217.2 91.2% 59.8%;           /* #3b82f6 (brighter in dark) */
  --primary-foreground: 222.2 84% 4.9%;  /* #0f172a */
  
  /* Secondary Colors */
  --secondary: 217.2 32.6% 17.5%;         /* #334155 */
  --secondary-foreground: 210 40% 98%;    /* #f8fafc */
  
  /* Muted Colors */
  --muted: 215 27.9% 16.9%;               /* #1e293b */
  --muted-foreground: 217.9 10.6% 64.9%; /* #94a3b8 */
  
  /* Accent Colors */
  --accent: 217.2 32.6% 17.5%;            /* #334155 */
  --accent-foreground: 210 40% 98%;       /* #f8fafc */
  
  /* Destructive */
  --destructive: 0 84.2% 60.2%;           /* #ef4444 */
  --destructive-foreground: 210 40% 98%;  /* #f8fafc */
  
  /* Borders */
  --border: 217.2 32.6% 17.5%;            /* #334155 */
  --input: 217.2 32.6% 17.5%;             /* #334155 */
  --ring: 224.3 76.3% 94.1%;              /* #3b82f6 with opacity */
}
```

THEME PROVIDER COMPONENT (client/src/hooks/useTheme.ts):
```typescript
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: 'dark' | 'light';
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
  actualTheme: 'light'
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'form-builder-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  const [actualTheme, setActualTheme] = useState<'dark' | 'light'>('light');

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove previous theme classes
    root.classList.remove('light', 'dark');

    let effectiveTheme: 'dark' | 'light';

    if (theme === 'system') {
      effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    } else {
      effectiveTheme = theme;
    }

    // Add the effective theme class
    root.classList.add(effectiveTheme);
    setActualTheme(effectiveTheme);

    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        effectiveTheme === 'dark' ? '#0f172a' : '#ffffff'
      );
    }
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = () => {
        const effectiveTheme = mediaQuery.matches ? 'dark' : 'light';
        setActualTheme(effectiveTheme);
        
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(effectiveTheme);
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    actualTheme
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
```

THEME TOGGLE COMPONENT (client/src/components/ThemeToggle.tsx):
```typescript
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTheme } from '@/hooks/useTheme';

import { Sun, Moon, Monitor } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, setTheme, actualTheme } = useTheme();

  const getIcon = () => {
    switch (actualTheme) {
      case 'light':
        return <Sun className="h-4 w-4 transition-transform duration-200" />;
      case 'dark':
        return <Moon className="h-4 w-4 transition-transform duration-200" />;
      default:
        return <Monitor className="h-4 w-4 transition-transform duration-200" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`
            w-10 h-10 p-0 border-slate-200 hover:border-slate-300
            dark:border-slate-700 dark:hover:border-slate-600
            bg-white dark:bg-slate-800
            transition-all duration-200
            ${className}
          `}
          aria-label="Toggle theme"
        >
          <div className="relative overflow-hidden">
            {getIcon()}
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="
          bg-white dark:bg-slate-800 
          border-slate-200 dark:border-slate-700
          shadow-lg animate-scale-in
        "
      >
        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className={`
            flex items-center space-x-2 cursor-pointer
            hover:bg-slate-50 dark:hover:bg-slate-700
            ${theme === 'light' ? 'bg-slate-100 dark:bg-slate-600' : ''}
          `}
        >
          <Sun className="h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className={`
            flex items-center space-x-2 cursor-pointer
            hover:bg-slate-50 dark:hover:bg-slate-700
            ${theme === 'dark' ? 'bg-slate-100 dark:bg-slate-600' : ''}
          `}
        >
          <Moon className="h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => setTheme('system')}
          className={`
            flex items-center space-x-2 cursor-pointer
            hover:bg-slate-50 dark:hover:bg-slate-700
            ${theme === 'system' ? 'bg-slate-100 dark:bg-slate-600' : ''}
          `}
        >
          <Monitor className="h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
```

DARK MODE COMPONENT ADAPTATIONS:

Updated Button Component:
```typescript
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const variants = {
    primary: `
      bg-primary-500 hover:bg-primary-600 active:bg-primary-700
      dark:bg-primary-600 dark:hover:bg-primary-500 dark:active:bg-primary-400
      text-white border-primary-500 hover:border-primary-600
      dark:border-primary-600 dark:hover:border-primary-500
      focus:ring-primary-500 shadow-sm hover:shadow-md
    `,
    secondary: `
      bg-secondary-100 hover:bg-secondary-200 active:bg-secondary-300
      dark:bg-slate-700 dark:hover:bg-slate-600 dark:active:bg-slate-500
      text-secondary-700 dark:text-slate-200
      border-secondary-200 hover:border-secondary-300
      dark:border-slate-600 dark:hover:border-slate-500
      focus:ring-primary-500
    `,
    outline: `
      bg-white hover:bg-gray-50 active:bg-gray-100
      dark:bg-slate-800 dark:hover:bg-slate-700 dark:active:bg-slate-600
      text-secondary-700 dark:text-slate-200
      border-secondary-300 hover:border-secondary-400
      dark:border-slate-600 dark:hover:border-slate-500
      focus:ring-primary-500 shadow-sm
    `,
    ghost: `
      bg-transparent hover:bg-secondary-100 active:bg-secondary-200
      dark:hover:bg-slate-700 dark:active:bg-slate-600
      text-secondary-700 dark:text-slate-200
      border-transparent focus:ring-primary-500
    `
  };

  // ... rest of component
};
```

Updated Input Component:
```typescript
export const Input: React.FC<InputProps> = ({ className, ...props }) => {
  return (
    <input
      className={cn(
        `
        w-full px-3 py-2 text-sm
        bg-white dark:bg-slate-800
        border border-slate-300 dark:border-slate-600
        text-slate-900 dark:text-slate-100
        rounded-lg transition-colors duration-200
        placeholder:text-slate-400 dark:placeholder:text-slate-500
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 
        focus:border-primary-500 dark:focus:ring-offset-slate-800
        disabled:bg-slate-50 dark:disabled:bg-slate-700
        disabled:text-slate-500 dark:disabled:text-slate-400
        disabled:cursor-not-allowed
        `,
        className
      )}
      {...props}
    />
  );
};
```

Updated Card Component:
```typescript
export const Card: React.FC<CardProps> = ({
  children,
  className,
  padding = 'md',
  shadow = 'sm',
  border = true
}) => {
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm dark:shadow-slate-900/20',
    md: 'shadow-md dark:shadow-slate-900/30',
    lg: 'shadow-lg dark:shadow-slate-900/40'
  };

  return (
    <div
      className={cn(
        `
        bg-white dark:bg-slate-800
        text-slate-900 dark:text-slate-100
        rounded-lg transition-colors duration-200
        `,
        border && 'border border-slate-200 dark:border-slate-700',
        paddingClasses[padding],
        shadowClasses[shadow],
        className
      )}
    >
      {children}
    </div>
  );
};
```

APPLICATION ROOT STYLING (client/src/index.css):
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  /* Smooth transitions for theme changes */
  * {
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 200ms;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    @apply bg-background text-foreground font-sans antialiased;
    font-feature-settings: "rlig" 1, "calt" 1;
  }

  /* Custom scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    @apply bg-slate-100 dark:bg-slate-800;
  }

  ::-webkit-scrollbar-thumb {
    @apply bg-slate-300 dark:bg-slate-600 rounded-md;
  }

  ::-webkit-scrollbar-thumb:hover {
    @apply bg-slate-400 dark:bg-slate-500;
  }

  /* Dark mode scrollbar for Firefox */
  html.dark {
    scrollbar-color: rgb(71 85 105) rgb(30 41 59);
  }
}

@layer components {
  /* Theme-aware focus ring */
  .focus-ring {
    @apply focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800;
  }

  /* Theme transition helper */
  .theme-transition {
    transition: color 200ms cubic-bezier(0.4, 0.0, 0.2, 1),
                background-color 200ms cubic-bezier(0.4, 0.0, 0.2, 1),
                border-color 200ms cubic-bezier(0.4, 0.0, 0.2, 1);
  }
}
```

APP COMPONENT WITH THEME PROVIDER:
```typescript
import { ThemeProvider } from '@/hooks/useTheme';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="form-builder-theme">
      <QueryClientProvider client={queryClient}>
        <DndProvider backend={HTML5Backend}>
          <div className="min-h-screen bg-background text-foreground theme-transition">
            {/* Your app content */}
          </div>
        </DndProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
```

Implement comprehensive dark mode support with smooth transitions, proper contrast ratios, and consistent theming across all components. Ensure accessibility compliance and user preference persistence.
```