# 03 - Frontend Core Structure

This prompt creates the main React application structure with routing, state management, and core components.

## Visual Design Requirements

### Application Layout
- **Header**: 64px height with navigation tabs and user controls
- **Main Content**: Full height minus header with proper overflow handling
- **Loading States**: Professional skeleton screens and spinners
- **Error States**: User-friendly error displays with recovery options

### Tab System Visual Design
- **Tab Heights**: 48px for comfortable touch targets
- **Active Indicators**: 3px blue underline with smooth sliding animation
- **Hover States**: Subtle background color change with 150ms transition
- **Typography**: 14px font-medium for tab labels

### Theme Integration
- **Color Transitions**: 200ms duration for theme switching
- **Dark Mode**: Seamless theme persistence and switching
- **Component Consistency**: All components follow design system
- **Accessibility**: Proper focus states and keyboard navigation

## AI Prompt

```
Create the main React application structure with the following exact visual specifications:

VISUAL REQUIREMENTS:

Application Shell:
- Header: 64px height, white background (light) / slate-800 (dark)
- Border: 1px slate-200 (light) / slate-700 (dark) bottom border
- Logo: Professional gradient from blue-500 to purple-600
- Typography: Inter font family throughout
- Spacing: Consistent 16px, 24px, 32px spacing scale

Tab Navigation:
- Tab height: 48px for optimal touch targets
- Active state: 3px blue-500 bottom border with slide animation
- Hover state: slate-100 (light) / slate-700 (dark) background
- Text: 14px font-medium, slate-700 (light) / slate-200 (dark)
- Transition: 200ms cubic-bezier(0.4, 0.0, 0.2, 1) for all states

MAIN APP COMPONENT (client/src/App.tsx):
```typescript
import React, { useState, useCallback, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/hooks/useTheme';

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
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { Toast } from './components/ui/Toast';

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
      refetchOnWindowFocus: false,
      retry: 2
    }
  }
});

function App() {
  const [isDbInitialized, setIsDbInitialized] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('dashboardDesigner');
  const [currentTier, setCurrentTier] = useState<CustomerTier>('Gold');
  const [draggedControl, setDraggedControl] = useState<ControlType | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [toast, setToast] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
  } | null>(null);

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
    setActiveSection,
    isLoading
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
        setToast({
          type: 'success',
          title: 'Application Ready',
          message: 'Form builder initialized successfully'
        });
      } catch (error) {
        console.error('❌ APP: Database initialization failed:', error);
        setToast({
          type: 'error',
          title: 'Initialization Failed',
          message: 'Please refresh the page to try again'
        });
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
      setToast({
        type: 'success',
        title: 'Control Added',
        message: `${controlType.name} has been added to your form`
      });
    } catch (error) {
      console.error('Failed to add control:', error);
      setToast({
        type: 'error',
        title: 'Failed to Add Control',
        message: 'Please try again'
      });
    }
  }, [addControl, activeSection]);

  const handleControlSelect = useCallback((control: DroppedControl) => {
    selectControl(control);
  }, [selectControl]);

  const handleSectionCreate = useCallback(async (sectionData: Omit<Section, 'id' | 'controls' | 'validation'>) => {
    try {
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
      setToast({
        type: 'success',
        title: 'Section Created',
        message: `"${newSection.name}" section has been created`
      });
    } catch (error) {
      console.error('Failed to create section:', error);
      setToast({
        type: 'error',
        title: 'Failed to Create Section',
        message: 'Please try again'
      });
    }
  }, [createSection, sections.length, setActiveSection]);

  const handleImportControls = useCallback(async (controls: DroppedControl[]) => {
    try {
      setRefreshKey(prev => prev + 1);
      setToast({
        type: 'success',
        title: 'Import Successful',
        message: `${controls.length} controls imported successfully`
      });
    } catch (error) {
      setToast({
        type: 'error',
        title: 'Import Failed',
        message: 'Please check your file and try again'
      });
    }
  }, []);

  // Loading state
  if (!isDbInitialized) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
            <LoadingSpinner size="lg" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Initializing Jumbo Studio
            </h2>
            <p className="text-muted-foreground max-w-sm">
              Setting up your form builder environment...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="form-builder-theme">
        <DndProvider backend={HTML5Backend}>
          <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
            <Header
              currentTier={currentTier}
              onTierChange={setCurrentTier}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onImportControls={handleImportControls}
              onDirectImport={handleImportControls}
            />
            
            <main className="h-[calc(100vh-64px)] overflow-hidden">
              {activeTab === 'dashboardDesigner' && (
                <div className="h-full animate-fade-in">
                  <DashboardDesigner />
                </div>
              )}
              
              {activeTab === 'dashboard' && (
                <div className="h-full animate-fade-in">
                  <Dashboard
                    currentTier={currentTier}
                    onCreateQuestionnaire={() => setActiveTab('design')}
                    onEditQuestionnaire={(id: string) => setActiveTab('design')}
                  />
                </div>
              )}
              
              {activeTab === 'design' && (
                <div className="h-full flex animate-fade-in">
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
                <div className="h-full animate-fade-in">
                  <PreviewMode
                    droppedControls={droppedControls}
                    sections={sections}
                    formValues={formValues}
                    onFormValueChange={updateFormValue}
                  />
                </div>
              )}
              
              {activeTab === 'pdf' && (
                <div className="h-full animate-fade-in">
                  <PDFPreview
                    droppedControls={droppedControls}
                    sections={sections}
                    currentTier={currentTier}
                    formValues={formValues}
                    onFormValueChange={updateFormValue}
                  />
                </div>
              )}
              
              {activeTab === 'json' && (
                <div className="h-full animate-fade-in">
                  <JSONViewer
                    droppedControls={droppedControls}
                    currentTier={currentTier}
                    sections={sections}
                    dashboardConfig={{
                      template: 'grid',
                      theme: 'light',
                      customColors: {
                        primary: '#3b82f6',
                        secondary: '#64748b',
                        accent: '#06b6d4'
                      },
                      appearance: 'light',
                      layout: {
                        sidebar: true,
                        header: true,
                        footer: false
                      },
                      branding: {
                        title: 'My Dashboard',
                        subtitle: 'Analytics and Insights'
                      }
                    }}
                  />
                </div>
              )}
            </main>

            {/* Toast Notifications */}
            {toast && (
              <div className="fixed bottom-4 right-4 z-50">
                <Toast
                  type={toast.type}
                  title={toast.title}
                  message={toast.message}
                  onClose={() => setToast(null)}
                />
              </div>
            )}
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

import { Upload, Download, Crown, Menu, Sparkles } from 'lucide-react';

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
    Bronze: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    Silver: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
    Gold: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    Platinum: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
  };

  const tabs = [
    { id: 'dashboardDesigner', label: 'Dashboard Designer', icon: null },
    { id: 'dashboard', label: 'Dashboard', icon: null },
    { id: 'design', label: 'Design', icon: null },
    { id: 'preview', label: 'Preview', icon: null },
    { id: 'pdf', label: 'PDF', icon: null },
    { id: 'json', label: 'JSON', icon: null }
  ] as const;

  return (
    <>
      <header className="h-16 border-b border-border bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center justify-between h-full px-6 max-w-full">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Jumbo Studio
                </h1>
                <p className="text-xs text-muted-foreground">Form Builder</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex-1 flex justify-center px-8">
            <Tabs value={activeTab} onValueChange={onTabChange as (value: string) => void}>
              <TabsList className="grid grid-cols-6 h-12 p-1 bg-muted/50">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="
                      relative px-3 py-2 text-sm font-medium
                      data-[state=active]:bg-background 
                      data-[state=active]:text-foreground
                      data-[state=active]:shadow-sm
                      transition-all duration-200
                      hover:text-foreground/80
                    "
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            {/* Import/Export Actions */}
            <div className="hidden md:flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowExcelImport(true)}
                className="h-9 px-3 hover-lift"
              >
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDirectImport(true)}
                className="h-9 px-3 hover-lift"
              >
                <Download className="h-4 w-4 mr-2" />
                Direct Import
              </Button>
            </div>

            {/* Customer Tier Selector */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Crown className="h-4 w-4 text-muted-foreground" />
                <Select value={currentTier} onValueChange={onTierChange}>
                  <SelectTrigger className="w-32 h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bronze">Bronze</SelectItem>
                    <SelectItem value="Silver">Silver</SelectItem>
                    <SelectItem value="Gold">Gold</SelectItem>
                    <SelectItem value="Platinum">Platinum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Badge className={`${tierColors[currentTier]} border-0 font-medium`}>
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

REACT ENTRY POINT (client/src/main.tsx):
```typescript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

const root = createRoot(container);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

HTML TEMPLATE (client/index.html):
```html
<!DOCTYPE html>
<html lang="en" class="h-full">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#ffffff" />
    <meta name="description" content="Professional no-code form builder with drag-and-drop interface" />
    <title>Jumbo Studio - Form Builder</title>
  </head>
  <body class="h-full font-sans antialiased">
    <div id="root" class="h-full"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

GLOBAL STYLES (client/src/index.css):
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
    @apply bg-background text-foreground;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}

@layer components {
  .hover-lift {
    @apply transition-transform duration-200 hover:-translate-y-0.5;
  }
  
  .animate-fade-in {
    animation: fadeIn 300ms cubic-bezier(0.4, 0.0, 0.2, 1);
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
```

Create a professional React application foundation with proper routing, state management, theming, and visual consistency. Ensure smooth animations, accessibility compliance, and optimal user experience.
```