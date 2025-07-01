# 15 - Animations and Interactive Elements

This prompt creates smooth animations and interactive elements for enhanced user experience.

## Visual Design Requirements

### Animation Timing
- **Micro-interactions**: 150ms for hover states and quick feedback
- **Standard transitions**: 200ms for color changes and state transitions
- **Layout animations**: 300ms for panel resizing and content changes
- **Enter/exit animations**: 400ms for modals and overlays

### Easing Functions
- **Ease-out**: cubic-bezier(0.0, 0.0, 0.2, 1) for entering animations
- **Ease-in**: cubic-bezier(0.4, 0.0, 1, 1) for exiting animations  
- **Ease-in-out**: cubic-bezier(0.4, 0.0, 0.2, 1) for transitions
- **Spring**: cubic-bezier(0.34, 1.56, 0.64, 1) for playful interactions

### Interactive Feedback
- **Hover lift**: 2px transform translateY for cards and buttons
- **Active press**: 95% scale for tactile button feedback
- **Focus rings**: 2px blue ring with 2px offset for accessibility
- **Loading states**: Smooth skeleton animations and spinners

## AI Prompt

```
Create comprehensive animations and interactive elements for the form builder with the following exact specifications:

ANIMATION SYSTEM:

Core Animation Classes (client/src/styles/animations.css):
```css
/* Base Animation Utilities */
.animate-fade-in {
  animation: fadeIn 200ms cubic-bezier(0.0, 0.0, 0.2, 1) forwards;
}

.animate-fade-out {
  animation: fadeOut 200ms cubic-bezier(0.4, 0.0, 1, 1) forwards;
}

.animate-slide-in-right {
  animation: slideInRight 300ms cubic-bezier(0.0, 0.0, 0.2, 1) forwards;
}

.animate-slide-in-left {
  animation: slideInLeft 300ms cubic-bezier(0.0, 0.0, 0.2, 1) forwards;
}

.animate-slide-in-up {
  animation: slideInUp 300ms cubic-bezier(0.0, 0.0, 0.2, 1) forwards;
}

.animate-slide-in-down {
  animation: slideInDown 300ms cubic-bezier(0.0, 0.0, 0.2, 1) forwards;
}

.animate-scale-in {
  animation: scaleIn 200ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.animate-scale-out {
  animation: scaleOut 150ms cubic-bezier(0.4, 0.0, 1, 1) forwards;
}

.animate-bounce-in {
  animation: bounceIn 400ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

/* Hover and Interaction Animations */
.hover-lift {
  transition: transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1), 
              box-shadow 200ms cubic-bezier(0.4, 0.0, 0.2, 1);
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 
              0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.active-press {
  transition: transform 100ms cubic-bezier(0.4, 0.0, 0.2, 1);
}

.active-press:active {
  transform: scale(0.95);
}

.drag-feedback {
  transition: opacity 200ms cubic-bezier(0.4, 0.0, 0.2, 1),
              transform 200ms cubic-bezier(0.4, 0.0, 0.2, 1);
}

.drag-feedback.dragging {
  opacity: 0.5;
  transform: scale(1.05) rotate(5deg);
}

/* Loading Animations */
.pulse-animation {
  animation: pulse 2s cubic-bezier(0.4, 0.0, 0.6, 1) infinite;
}

.skeleton-animation {
  animation: skeleton 1.5s ease-in-out infinite alternate;
}

.spinner-rotate {
  animation: spin 1s linear infinite;
}

/* Keyframe Definitions */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideInDown {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes scaleOut {
  from {
    transform: scale(1);
    opacity: 1;
  }
  to {
    transform: scale(0.9);
    opacity: 0;
  }
}

@keyframes bounceIn {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
  70% {
    transform: scale(0.9);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes skeleton {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Stagger Animation Delays */
.stagger-1 { animation-delay: 50ms; }
.stagger-2 { animation-delay: 100ms; }
.stagger-3 { animation-delay: 150ms; }
.stagger-4 { animation-delay: 200ms; }
.stagger-5 { animation-delay: 250ms; }
```

ANIMATED COMPONENTS:

Animated Modal Component:
```typescript
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface AnimatedModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const AnimatedModal: React.FC<AnimatedModalProps> = ({
  isOpen,
  onClose,
  children,
  size = 'md',
  className
}) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Trigger animation after render
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      // Remove from DOM after animation
      setTimeout(() => setShouldRender(false), 200);
    }
  }, [isOpen]);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  if (!shouldRender) return null;

  return createPortal(
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-4',
        'transition-all duration-200',
        isAnimating ? 'animate-fade-in' : 'animate-fade-out'
      )}
    >
      {/* Backdrop */}
      <div
        className={cn(
          'absolute inset-0 bg-black transition-opacity duration-200',
          isAnimating ? 'opacity-50' : 'opacity-0'
        )}
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div
        className={cn(
          'relative bg-white dark:bg-slate-800 rounded-lg shadow-xl',
          'transform transition-all duration-300',
          'max-h-[90vh] overflow-hidden',
          sizeClasses[size],
          isAnimating 
            ? 'animate-scale-in opacity-100 translate-y-0' 
            : 'animate-scale-out opacity-0 translate-y-4',
          className
        )}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="
            absolute top-4 right-4 z-10
            w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700
            flex items-center justify-center
            hover:bg-slate-200 dark:hover:bg-slate-600
            transition-colors duration-150
            hover-lift
          "
        >
          <X className="h-4 w-4 text-slate-600 dark:text-slate-300" />
        </button>

        {children}
      </div>
    </div>,
    document.body
  );
};
```

Animated Button Component:
```typescript
import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className,
  disabled,
  ...props
}) => {
  const baseClasses = `
    relative inline-flex items-center justify-center
    font-medium transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
    disabled:opacity-50 disabled:cursor-not-allowed
    rounded-lg border overflow-hidden
    hover-lift active-press
  `;

  const variants = {
    primary: `
      bg-primary-500 hover:bg-primary-600 active:bg-primary-700
      text-white border-primary-500
      shadow-sm hover:shadow-md
    `,
    secondary: `
      bg-slate-100 hover:bg-slate-200 active:bg-slate-300
      dark:bg-slate-700 dark:hover:bg-slate-600
      text-slate-700 dark:text-slate-200
      border-slate-200 dark:border-slate-600
    `,
    outline: `
      bg-white hover:bg-slate-50 active:bg-slate-100
      dark:bg-slate-800 dark:hover:bg-slate-700
      text-slate-700 dark:text-slate-200
      border-slate-300 dark:border-slate-600
      shadow-sm
    `,
    ghost: `
      bg-transparent hover:bg-slate-100 active:bg-slate-200
      dark:hover:bg-slate-700 dark:active:bg-slate-600
      text-slate-700 dark:text-slate-200
      border-transparent
    `
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {/* Loading Spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full spinner-rotate" />
        </div>
      )}

      {/* Button Content */}
      <div className={cn(
        'flex items-center space-x-2 transition-opacity duration-200',
        loading && 'opacity-0'
      )}>
        {icon && (
          <span className="transition-transform duration-200 group-hover:scale-110">
            {icon}
          </span>
        )}
        <span>{children}</span>
      </div>

      {/* Ripple Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-white opacity-0 scale-0 rounded-full transition-all duration-300 group-active:opacity-20 group-active:scale-150" />
      </div>
    </button>
  );
};
```

Animated Card Component:
```typescript
import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  delayMs?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className,
  hoverEffect = true,
  delayMs = 0,
  direction = 'up'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setTimeout(() => {
            setIsVisible(true);
            setHasAnimated(true);
          }, delayMs);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [delayMs, hasAnimated]);

  const animationClasses = {
    up: isVisible ? 'animate-slide-in-up' : 'opacity-0 translate-y-4',
    down: isVisible ? 'animate-slide-in-down' : 'opacity-0 -translate-y-4',
    left: isVisible ? 'animate-slide-in-left' : 'opacity-0 -translate-x-4',
    right: isVisible ? 'animate-slide-in-right' : 'opacity-0 translate-x-4'
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        'bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700',
        'shadow-sm transition-all duration-300',
        hoverEffect && 'hover-lift cursor-pointer',
        animationClasses[direction],
        className
      )}
    >
      {children}
    </div>
  );
};
```

Animated Toast Notification:
```typescript
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

interface AnimatedToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose: () => void;
}

export const AnimatedToast: React.FC<AnimatedToastProps> = ({
  type,
  title,
  message,
  duration = 5000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Enter animation
    setTimeout(() => setIsVisible(true), 10);

    // Auto close
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-emerald-500" />,
    error: <XCircle className="h-5 w-5 text-red-500" />,
    warning: <AlertCircle className="h-5 w-5 text-amber-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />
  };

  const backgrounds = {
    success: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    warning: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
  };

  return (
    <div
      className={cn(
        'max-w-sm w-full bg-white dark:bg-slate-800 shadow-lg rounded-lg border p-4',
        'transform transition-all duration-300',
        backgrounds[type],
        isVisible && !isExiting && 'animate-slide-in-right',
        isExiting && 'animate-slide-out-right opacity-0 translate-x-full'
      )}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 animate-bounce-in">
          {icons[type]}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">
            {title}
          </h4>
          {message && (
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {message}
            </p>
          )}
        </div>
        
        <button
          onClick={handleClose}
          className="
            flex-shrink-0 p-1 rounded-md 
            hover:bg-white/50 dark:hover:bg-slate-700/50
            transition-colors duration-150
            hover-lift
          "
        >
          <X className="h-4 w-4 text-slate-400" />
        </button>
      </div>

      {/* Progress Bar */}
      {duration > 0 && (
        <div className="mt-3 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-slate-400 dark:bg-slate-500 rounded-full transition-all linear"
            style={{
              animation: `shrink ${duration}ms linear forwards`
            }}
          />
        </div>
      )}
    </div>
  );
};

// Add shrink animation to CSS
const shrinkKeyframes = `
@keyframes shrink {
  from { width: 100%; }
  to { width: 0%; }
}
`;
```

DRAG AND DROP ANIMATIONS:

Enhanced Draggable Component:
```typescript
export const DraggableControlComponent: React.FC<DraggableControlComponentProps> = ({
  control,
  isSelected,
  onSelect,
  // ... other props
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'CONTROL',
    item: control,
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  return (
    <div
      ref={drag}
      className={cn(
        'group relative p-4 border rounded-lg transition-all duration-200',
        'cursor-grab active:cursor-grabbing',
        isDragging && 'drag-feedback dragging',
        isSelected && 'ring-2 ring-primary-500 border-primary-500',
        !isDragging && 'hover-lift'
      )}
      onClick={onSelect}
    >
      {/* Control content with entrance animation */}
      <div className="animate-fade-in">
        {/* ... control content */}
      </div>

      {/* Selection indicator with bounce animation */}
      {isSelected && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full animate-bounce-in" />
      )}
    </div>
  );
};
```

STAGGERED LIST ANIMATIONS:

Animated List Component:
```typescript
export const AnimatedList: React.FC<{ children: React.ReactNode[]; stagger?: boolean }> = ({
  children,
  stagger = true
}) => {
  return (
    <div className="space-y-2">
      {children.map((child, index) => (
        <div
          key={index}
          className={cn(
            'animate-slide-in-up',
            stagger && `stagger-${Math.min(index + 1, 5)}`
          )}
        >
          {child}
        </div>
      ))}
    </div>
  );
};
```

Implement smooth, performant animations that enhance user experience without overwhelming the interface. Focus on micro-interactions, loading states, and transitions that provide clear visual feedback.
```