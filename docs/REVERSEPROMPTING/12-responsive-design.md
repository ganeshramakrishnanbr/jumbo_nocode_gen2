# 12 - Responsive Design and Mobile Optimization

This prompt creates comprehensive responsive design with mobile-first approach and touch-friendly interfaces.

## Visual Design Requirements

### Breakpoint System
- **Mobile First**: 320px base with progressive enhancement
- **Tablet**: 768px with optimized touch targets and spacing
- **Desktop**: 1024px+ with full feature set and hover states
- **Large Desktop**: 1440px+ with expanded layouts and sidebars

### Mobile Adaptations
- **Touch Targets**: Minimum 44px height for all interactive elements
- **Navigation**: Collapsible hamburger menu with slide-out drawer
- **Forms**: Stacked layouts with full-width inputs and large buttons
- **Tables**: Horizontal scrolling with sticky headers and compact design
- **Modals**: Full-screen on mobile with slide-up animations

### Tablet Optimizations
- **Split Panels**: Side-by-side layouts with 50/50 or 60/40 splits
- **Touch Gestures**: Swipe navigation and drag-and-drop support
- **Adaptive UI**: Context-sensitive toolbars and floating action buttons
- **Orientation**: Automatic layout adjustments for portrait/landscape

## AI Prompt

```
Create comprehensive responsive design with mobile-first approach using the following exact specifications:

VISUAL DESIGN STANDARDS:

Breakpoint System:
- Mobile: 320px - 767px (base design)
- Tablet: 768px - 1023px (enhanced layout)
- Desktop: 1024px - 1439px (full features)
- Large: 1440px+ (expanded interface)

Touch Interface Standards:
- Minimum touch target: 44px x 44px
- Tap spacing: 8px minimum between interactive elements
- Gesture support: Swipe, pinch, long-press recognition
- Feedback: Visual feedback within 100ms of touch interaction

RESPONSIVE LAYOUT SYSTEM (client/src/components/ResponsiveLayout.tsx):
```typescript
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'large';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
  mobileLayout?: React.ReactNode;
  tabletLayout?: React.ReactNode;
  desktopLayout?: React.ReactNode;
}

export const useBreakpoint = (): Breakpoint => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('desktop');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setBreakpoint('mobile');
      } else if (width < 1024) {
        setBreakpoint('tablet');
      } else if (width < 1440) {
        setBreakpoint('desktop');
      } else {
        setBreakpoint('large');
      }
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return breakpoint;
};

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  className,
  mobileLayout,
  tabletLayout,
  desktopLayout
}) => {
  const breakpoint = useBreakpoint();

  const getLayout = () => {
    switch (breakpoint) {
      case 'mobile':
        return mobileLayout || children;
      case 'tablet':
        return tabletLayout || desktopLayout || children;
      case 'desktop':
      case 'large':
        return desktopLayout || children;
      default:
        return children;
    }
  };

  return (
    <div 
      className={cn(
        'responsive-layout',
        `breakpoint-${breakpoint}`,
        className
      )}
    >
      {getLayout()}
    </div>
  );
};
```

MOBILE NAVIGATION COMPONENT (client/src/components/MobileNavigation.tsx):
```typescript
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from './ThemeToggle';

import { 
  Menu, X, Home, Design, Eye, FileText, Download, 
  Settings, Crown, Sparkles
} from 'lucide-react';

import type { TabType, CustomerTier } from '../App';

interface MobileNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  currentTier: CustomerTier;
  onTierChange: (tier: CustomerTier) => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  activeTab,
  onTabChange,
  currentTier,
  onTierChange
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const tabs = [
    { id: 'dashboardDesigner', label: 'Dashboard Designer', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'design', label: 'Design', icon: Design },
    { id: 'preview', label: 'Preview', icon: Eye },
    { id: 'pdf', label: 'PDF', icon: FileText },
    { id: 'json', label: 'JSON', icon: Download }
  ] as const;

  const tierColors = {
    Bronze: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    Silver: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
    Gold: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    Platinum: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
  };

  const handleTabSelect = (tab: TabType) => {
    onTabChange(tab);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Jumbo Studio
              </h1>
              <p className="text-xs text-slate-500">Form Builder</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Badge className={`${tierColors[currentTier]} border-0 text-xs`}>
              {currentTier}
            </Badge>
            
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
                      <Sparkles className="h-3 w-3 text-white" />
                    </div>
                    <span>Navigation</span>
                  </SheetTitle>
                </SheetHeader>
                
                <div className="mt-6 space-y-6">
                  {/* Navigation Tabs */}
                  <div className="space-y-2">
                    <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-3">
                      Tabs
                    </h3>
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      
                      return (
                        <button
                          key={tab.id}
                          onClick={() => handleTabSelect(tab.id)}
                          className={cn(
                            'w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors duration-200',
                            isActive
                              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                          )}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="font-medium">{tab.label}</span>
                          {isActive && (
                            <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  
                  <Separator />
                  
                  {/* Customer Tier */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                      <Crown className="h-4 w-4" />
                      <span>Customer Tier</span>
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {(['Bronze', 'Silver', 'Gold', 'Platinum'] as CustomerTier[]).map((tier) => (
                        <button
                          key={tier}
                          onClick={() => onTierChange(tier)}
                          className={cn(
                            'p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200',
                            currentTier === tier
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300'
                          )}
                        >
                          {tier}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Settings */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </h3>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Theme
                      </span>
                      <ThemeToggle />
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Bottom Tab Bar for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 z-50">
        <div className="grid grid-cols-4 gap-1 p-2">
          {tabs.slice(0, 4).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  'flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors duration-200',
                  isActive
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
```

RESPONSIVE DESIGN CANVAS (client/src/components/ResponsiveDesignCanvas.tsx):
```typescript
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { DraggableControlComponent } from './DraggableControlComponent';
import { useBreakpoint } from './ResponsiveLayout';

import { 
  Grid3x3, List, Smartphone, Tablet, Monitor,
  Plus, Eye, Settings
} from 'lucide-react';

import type { DroppedControl } from '@shared/types';

interface ResponsiveDesignCanvasProps {
  droppedControls: DroppedControl[];
  selectedControl: DroppedControl | null;
  onControlSelect: (control: DroppedControl) => void;
  onControlUpdate: (id: string, updates: Partial<DroppedControl>) => void;
  onControlMove: (id: string, direction: 'up' | 'down') => void;
  onControlRemove: (id: string) => void;
  onControlReorder: (dragIndex: number, hoverIndex: number) => void;
  onDrop: (controlType: any, x: number, y: number) => void;
  draggedControl: any;
  activeSection: string;
}

export const ResponsiveDesignCanvas: React.FC<ResponsiveDesignCanvasProps> = ({
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
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('list');
  const actualBreakpoint = useBreakpoint();

  const sectionControls = droppedControls.filter(
    control => control.sectionId === activeSection || (!control.sectionId && activeSection === 'default')
  );

  const getCanvasWidth = () => {
    switch (viewMode) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      case 'desktop': return '100%';
      default: return '100%';
    }
  };

  const getCanvasClass = () => {
    const baseClass = 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-all duration-300';
    
    if (actualBreakpoint === 'mobile') {
      return `${baseClass} w-full min-h-[400px]`;
    }
    
    return `${baseClass} mx-auto min-h-[600px]`;
  };

  const ViewModeButton = ({ mode, icon: Icon, label }: { 
    mode: typeof viewMode, 
    icon: React.ComponentType<any>, 
    label: string 
  }) => (
    <Button
      variant={viewMode === mode ? "default" : "outline"}
      size="sm"
      onClick={() => setViewMode(mode)}
      className="flex items-center space-x-2"
    >
      <Icon className="h-4 w-4" />
      <span className="hidden sm:inline">{label}</span>
    </Button>
  );

  if (sectionControls.length === 0) {
    return (
      <div className="flex-1 flex flex-col">
        {/* Canvas Header - Hidden on mobile */}
        {actualBreakpoint !== 'mobile' && (
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
            <div className="flex items-center space-x-4">
              <h3 className="font-medium text-slate-900 dark:text-slate-100">Design Canvas</h3>
              <Badge variant="outline" className="text-xs">
                {sectionControls.length} controls
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <ViewModeButton mode="mobile" icon={Smartphone} label="Mobile" />
              <ViewModeButton mode="tablet" icon={Tablet} label="Tablet" />
              <ViewModeButton mode="desktop" icon={Monitor} label="Desktop" />
              
              <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-2" />
              
              <Button
                variant={layoutMode === 'list' ? "default" : "outline"}
                size="sm"
                onClick={() => setLayoutMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={layoutMode === 'grid' ? "default" : "outline"}
                size="sm"
                onClick={() => setLayoutMode('grid')}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Empty State */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
              Start Building Your Form
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              Drag controls from the library on the left to begin creating your form. 
              You can organize them into sections and customize their properties.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" className="flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>View Examples</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Import Template</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Canvas Header - Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <h3 className="font-medium text-slate-900 dark:text-slate-100">Design Canvas</h3>
          <Badge variant="outline" className="text-xs">
            {sectionControls.length} controls
          </Badge>
        </div>
        
        {/* Responsive Controls */}
        {actualBreakpoint !== 'mobile' && (
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center space-x-1">
              <ViewModeButton mode="mobile" icon={Smartphone} label="Mobile" />
              <ViewModeButton mode="tablet" icon={Tablet} label="Tablet" />
              <ViewModeButton mode="desktop" icon={Monitor} label="Desktop" />
            </div>
            
            <div className="w-px h-6 bg-slate-300 dark:bg-slate-600" />
            
            <div className="flex items-center space-x-1">
              <Button
                variant={layoutMode === 'list' ? "default" : "outline"}
                size="sm"
                onClick={() => setLayoutMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={layoutMode === 'grid' ? "default" : "outline"}
                size="sm"
                onClick={() => setLayoutMode('grid')}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Canvas Content */}
      <div className="flex-1 p-4 bg-slate-50 dark:bg-slate-900 overflow-hidden">
        <div 
          className={getCanvasClass()}
          style={{ 
            width: actualBreakpoint === 'mobile' ? '100%' : getCanvasWidth(),
            maxWidth: '100%'
          }}
        >
          <ScrollArea className="h-full">
            <div className="p-6">
              <div className={cn(
                'space-y-4',
                layoutMode === 'grid' && actualBreakpoint !== 'mobile' && 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 space-y-0'
              )}>
                {sectionControls
                  .sort((a, b) => a.y - b.y || a.x - b.x)
                  .map((control, index) => (
                    <DraggableControlComponent
                      key={control.id}
                      control={control}
                      index={index}
                      isSelected={selectedControl?.id === control.id}
                      onSelect={() => onControlSelect(control)}
                      onUpdate={onControlUpdate}
                      onMove={onControlMove}
                      onRemove={onControlRemove}
                      onReorder={onControlReorder}
                    />
                  ))}
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Mobile-specific bottom padding to account for tab bar */}
      {actualBreakpoint === 'mobile' && (
        <div className="h-20" />
      )}
    </div>
  );
};
```

RESPONSIVE MODAL COMPONENT (client/src/components/ResponsiveModal.tsx):
```typescript
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useBreakpoint } from './ResponsiveLayout';

interface ResponsiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const ResponsiveModal: React.FC<ResponsiveModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}) => {
  const breakpoint = useBreakpoint();

  // Use Sheet (slide-up) on mobile, Dialog on larger screens
  if (breakpoint === 'mobile') {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent 
          side="bottom" 
          className="h-[90vh] rounded-t-lg"
        >
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
          </SheetHeader>
          <div className="mt-6 overflow-y-auto h-[calc(100%-80px)]">
            {children}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  const sizeClasses = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${sizeClasses[size]} max-h-[90vh] overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="mt-6">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};
```

RESPONSIVE STYLES (client/src/styles/responsive.css):
```css
/* Touch-friendly interactive elements */
@media (max-width: 767px) {
  /* Minimum touch target sizes */
  button, 
  [role="button"], 
  input[type="button"], 
  input[type="submit"], 
  .clickable {
    min-height: 44px;
    min-width: 44px;
  }

  /* Larger form inputs */
  input[type="text"],
  input[type="email"],
  input[type="password"],
  input[type="number"],
  textarea,
  select {
    min-height: 48px;
    font-size: 16px; /* Prevents zoom on iOS */
  }

  /* Improved spacing for mobile */
  .form-field {
    margin-bottom: 20px;
  }

  /* Hide desktop-only elements */
  .desktop-only {
    display: none !important;
  }

  /* Full-width modals on mobile */
  .modal-mobile {
    margin: 0;
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    border-radius: 0;
  }

  /* Stack navigation items */
  .nav-horizontal {
    flex-direction: column;
    align-items: stretch;
  }

  /* Larger padding for better touch experience */
  .touch-padding {
    padding: 16px;
  }
}

/* Tablet optimizations */
@media (min-width: 768px) and (max-width: 1023px) {
  /* Two-column layouts */
  .tablet-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }

  /* Sidebar adaptations */
  .sidebar-tablet {
    width: 280px;
  }

  /* Hide mobile-only elements */
  .mobile-only {
    display: none !important;
  }
}

/* Desktop and above */
@media (min-width: 1024px) {
  /* Hide mobile and tablet only elements */
  .mobile-only,
  .tablet-only {
    display: none !important;
  }

  /* Enable hover effects */
  .hover-enabled:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  }

  /* Multi-column layouts */
  .desktop-grid {
    display: grid;
    grid-template-columns: 320px 1fr 320px;
    gap: 24px;
  }
}

/* Large desktop optimizations */
@media (min-width: 1440px) {
  .large-desktop-grid {
    grid-template-columns: 360px 1fr 360px;
    gap: 32px;
  }

  .large-desktop-container {
    max-width: 1400px;
    margin: 0 auto;
  }
}

/* Dark mode responsive adjustments */
@media (prefers-color-scheme: dark) {
  .responsive-shadow {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
  }
}

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .responsive-border {
    border-width: 2px;
  }
  
  .responsive-outline {
    outline: 2px solid;
    outline-offset: 2px;
  }
}
```

Create comprehensive responsive design with mobile-first approach, touch-friendly interfaces, adaptive layouts, and optimized user experience across all device sizes.
```