# 13 - Visual Design System & Component Styling

This prompt creates the complete visual design system with consistent styling, components, and user interface elements.

## Visual Design Requirements

### Color System
- **Primary Blue**: #3b82f6 - Main actions, links, active states
- **Secondary Slate**: #64748b - Supporting text, inactive elements
- **Accent Cyan**: #06b6d4 - Highlights, success states, CTAs
- **Success Green**: #10b981 - Success messages and confirmations
- **Warning Amber**: #f59e0b - Warning states and cautions
- **Error Red**: #ef4444 - Error states and destructive actions

### Typography Scale
- **Display**: 48px (3rem) - Large headings and hero text
- **Heading 1**: 32px (2rem) - Main page titles
- **Heading 2**: 24px (1.5rem) - Section headers
- **Heading 3**: 20px (1.25rem) - Subsection headers
- **Body Large**: 18px (1.125rem) - Large body text
- **Body**: 16px (1rem) - Standard body text
- **Body Small**: 14px (0.875rem) - Supporting text
- **Caption**: 12px (0.75rem) - Captions and labels

### Spacing System
- **Base Unit**: 4px
- **Scale**: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px, 80px, 96px

### Component Standards
- **Border Radius**: 6px standard, 8px for cards, 12px for large elements
- **Shadows**: Layered elevation system with consistent opacity
- **Animations**: 200ms for interactions, 300ms for transitions
- **Focus States**: 2px blue ring with 2px offset

## AI Prompt

```
Create a comprehensive visual design system for a professional form builder application with the following exact specifications:

DESIGN SYSTEM FOUNDATION:

Color Palette:
```css
:root {
  /* Primary Colors */
  --primary-50: #eff6ff;
  --primary-100: #dbeafe;
  --primary-200: #bfdbfe;
  --primary-300: #93c5fd;
  --primary-400: #60a5fa;
  --primary-500: #3b82f6; /* Primary */
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
  --primary-800: #1e40af;
  --primary-900: #1e3a8a;

  /* Secondary Colors */
  --secondary-50: #f8fafc;
  --secondary-100: #f1f5f9;
  --secondary-200: #e2e8f0;
  --secondary-300: #cbd5e1;
  --secondary-400: #94a3b8;
  --secondary-500: #64748b; /* Secondary */
  --secondary-600: #475569;
  --secondary-700: #334155;
  --secondary-800: #1e293b;
  --secondary-900: #0f172a;

  /* Accent Colors */
  --accent-50: #ecfeff;
  --accent-100: #cffafe;
  --accent-200: #a5f3fc;
  --accent-300: #67e8f9;
  --accent-400: #22d3ee;
  --accent-500: #06b6d4; /* Accent */
  --accent-600: #0891b2;
  --accent-700: #0e7490;
  --accent-800: #155e75;
  --accent-900: #164e63;

  /* Status Colors */
  --success-500: #10b981;
  --warning-500: #f59e0b;
  --error-500: #ef4444;

  /* Neutral Grays */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;
}
```

Typography System:
```css
/* Font Imports */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

/* Typography Scale */
.text-display {
  font-size: 3rem;
  line-height: 1.1;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.text-h1 {
  font-size: 2rem;
  line-height: 1.2;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.text-h2 {
  font-size: 1.5rem;
  line-height: 1.3;
  font-weight: 600;
}

.text-h3 {
  font-size: 1.25rem;
  line-height: 1.4;
  font-weight: 500;
}

.text-body-lg {
  font-size: 1.125rem;
  line-height: 1.5;
  font-weight: 400;
}

.text-body {
  font-size: 1rem;
  line-height: 1.5;
  font-weight: 400;
}

.text-body-sm {
  font-size: 0.875rem;
  line-height: 1.4;
  font-weight: 400;
}

.text-caption {
  font-size: 0.75rem;
  line-height: 1.3;
  font-weight: 400;
  letter-spacing: 0.01em;
}
```

Component Library (client/src/components/ui/):

BUTTON COMPONENT:
```typescript
import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const baseClasses = `
    inline-flex items-center justify-center
    font-medium transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    rounded-lg border
  `;

  const variants = {
    primary: `
      bg-primary-500 hover:bg-primary-600 active:bg-primary-700
      text-white border-primary-500 hover:border-primary-600
      focus:ring-primary-500 shadow-sm hover:shadow-md
    `,
    secondary: `
      bg-secondary-100 hover:bg-secondary-200 active:bg-secondary-300
      text-secondary-700 border-secondary-200 hover:border-secondary-300
      focus:ring-secondary-500
    `,
    outline: `
      bg-white hover:bg-gray-50 active:bg-gray-100
      text-secondary-700 border-secondary-300 hover:border-secondary-400
      focus:ring-primary-500 shadow-sm
    `,
    ghost: `
      bg-transparent hover:bg-secondary-100 active:bg-secondary-200
      text-secondary-700 border-transparent
      focus:ring-primary-500
    `,
    destructive: `
      bg-error-500 hover:bg-red-600 active:bg-red-700
      text-white border-error-500 hover:border-red-600
      focus:ring-error-500 shadow-sm hover:shadow-md
    `
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };

  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};
```

INPUT COMPONENT:
```typescript
import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  helperText,
  error,
  leftIcon,
  rightIcon,
  className,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-secondary-700 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400">
            {leftIcon}
          </div>
        )}
        
        <input
          className={cn(
            `
            w-full px-3 py-2 text-sm
            bg-white border border-secondary-300
            rounded-lg transition-colors duration-200
            placeholder:text-secondary-400
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:border-primary-500
            disabled:bg-secondary-50 disabled:text-secondary-500 disabled:cursor-not-allowed
            `,
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            error && 'border-error-500 focus:ring-error-500 focus:border-error-500',
            className
          )}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-error-500">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-secondary-500">{helperText}</p>
      )}
    </div>
  );
};
```

CARD COMPONENT:
```typescript
import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  padding = 'md',
  shadow = 'sm',
  border = true
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  };

  return (
    <div
      className={cn(
        'bg-white rounded-lg',
        border && 'border border-secondary-200',
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

BADGE COMPONENT:
```typescript
import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  className
}) => {
  const baseClasses = `
    inline-flex items-center font-medium rounded-full
    transition-colors duration-200
  `;

  const variants = {
    primary: 'bg-primary-100 text-primary-700 border-primary-200',
    secondary: 'bg-secondary-100 text-secondary-700 border-secondary-200',
    success: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-100 text-amber-700 border-amber-200',
    error: 'bg-red-100 text-red-700 border-red-200',
    outline: 'bg-white text-secondary-700 border-secondary-300'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs border',
    md: 'px-2.5 py-1 text-sm border'
  };

  return (
    <span
      className={cn(baseClasses, variants[variant], sizes[size], className)}
    >
      {children}
    </span>
  );
};
```

TOAST/NOTIFICATION SYSTEM:
```typescript
import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  onClose: () => void;
  autoClose?: boolean;
}

export const Toast: React.FC<ToastProps> = ({
  type,
  title,
  message,
  onClose,
  autoClose = true
}) => {
  React.useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-emerald-500" />,
    error: <XCircle className="h-5 w-5 text-red-500" />,
    warning: <AlertCircle className="h-5 w-5 text-amber-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />
  };

  const backgrounds = {
    success: 'bg-emerald-50 border-emerald-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-amber-50 border-amber-200',
    info: 'bg-blue-50 border-blue-200'
  };

  return (
    <div
      className={cn(
        'p-4 rounded-lg border shadow-lg max-w-sm w-full',
        'transform transition-all duration-300 ease-in-out',
        'animate-slide-in',
        backgrounds[type]
      )}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {icons[type]}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-secondary-900 mb-1">
            {title}
          </h4>
          {message && (
            <p className="text-sm text-secondary-600">
              {message}
            </p>
          )}
        </div>
        
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 rounded-md hover:bg-white/50 transition-colors duration-150"
        >
          <X className="h-4 w-4 text-secondary-400" />
        </button>
      </div>
    </div>
  );
};
```

LOADING STATES:
```typescript
import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className
}) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-primary-200 border-t-primary-500',
        sizes[size],
        className
      )}
    />
  );
};

interface SkeletonProps {
  className?: string;
  lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  lines = 1
}) => {
  return (
    <div className="animate-pulse">
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'bg-secondary-200 rounded',
            index === lines - 1 ? 'w-3/4' : 'w-full',
            index > 0 && 'mt-2',
            'h-4',
            className
          )}
        />
      ))}
    </div>
  );
};
```

ANIMATION CLASSES:
```css
/* Custom Animations */
@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scale-in {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slide-in 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
}

.animate-fade-in {
  animation: fade-in 0.2s ease-out;
}

.animate-scale-in {
  animation: scale-in 0.2s cubic-bezier(0.4, 0.0, 0.2, 1);
}

/* Hover Transitions */
.hover-lift {
  transition: transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1);
}

.hover-lift:hover {
  transform: translateY(-2px);
}

/* Focus Styles */
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
}
```

Create a comprehensive visual design system with consistent components, proper accessibility features, and smooth animations. Ensure all components follow the exact visual specifications and maintain design consistency across the application.
```