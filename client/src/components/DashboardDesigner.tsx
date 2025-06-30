import React, { useState } from 'react';
import { Layout, Monitor, Tablet, Smartphone, Share, Upload, Sun, Moon, Palette, Grid, Sidebar, FileImage, Minimize2 } from 'lucide-react';

interface DashboardTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  layout: 'grid' | 'sidebar' | 'card' | 'minimal';
  preview: React.ReactNode;
}

interface DashboardTheme {
  id: string;
  name: string;
  primaryColor: string;
  appearance: 'light' | 'dark';
}

interface DashboardConfig {
  template: string;
  theme: string;
  customColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  appearance: 'light' | 'dark';
  layout: {
    sidebar: boolean;
    header: boolean;
    footer: boolean;
  };
  branding: {
    logo?: string;
    title: string;
    subtitle: string;
  };
}

interface DashboardDesignerProps {
  onConfigChange?: (config: DashboardConfig) => void;
}

export const DashboardDesigner: React.FC<DashboardDesignerProps> = ({ onConfigChange }) => {
  const [activeStep, setActiveStep] = useState<'templates' | 'themes'>('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('minimal');
  const [selectedTheme, setSelectedTheme] = useState<string>('blue');
  const [appearance, setAppearance] = useState<'light' | 'dark'>('light');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showPreview, setShowPreview] = useState(false);
  const [designMode, setDesignMode] = useState(false);
  const [configStatus, setConfigStatus] = useState<'idle' | 'updating' | 'saved'>('idle');

  const templates: DashboardTemplate[] = [
    {
      id: 'grid',
      name: 'Grid Layout',
      description: 'Flexible grid-based dashboard with responsive columns',
      icon: Grid,
      layout: 'grid',
      preview: (
        <div className="w-full h-20 bg-blue-50 rounded border-2 border-blue-200 flex flex-col gap-1 p-2">
          <div className="flex gap-1 h-2">
            <div className="flex-1 bg-blue-200 rounded"></div>
            <div className="flex-1 bg-blue-200 rounded"></div>
            <div className="flex-1 bg-blue-200 rounded"></div>
          </div>
          <div className="flex gap-1 h-4">
            <div className="flex-1 bg-blue-300 rounded"></div>
            <div className="flex-1 bg-blue-300 rounded"></div>
          </div>
        </div>
      )
    },
    {
      id: 'sidebar',
      name: 'Sidebar Navigation',
      description: 'Traditional dashboard with fixed sidebar navigation',
      icon: Sidebar,
      layout: 'sidebar',
      preview: (
        <div className="w-full h-20 bg-blue-50 rounded border-2 border-blue-200 flex gap-1 p-2">
          <div className="w-6 bg-blue-400 rounded"></div>
          <div className="flex-1 flex flex-col gap-1">
            <div className="h-2 bg-blue-200 rounded"></div>
            <div className="flex gap-1 h-4">
              <div className="flex-1 bg-blue-300 rounded"></div>
              <div className="flex-1 bg-blue-300 rounded"></div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'card',
      name: 'Card Layout',
      description: 'Card-based layout with grouped sections',
      icon: FileImage,
      layout: 'card',
      preview: (
        <div className="w-full h-20 bg-blue-50 rounded border-2 border-blue-200 flex flex-col gap-1 p-2">
          <div className="h-2 bg-blue-200 rounded"></div>
          <div className="flex gap-1 h-4">
            <div className="flex-1 bg-blue-300 rounded"></div>
            <div className="flex-1 bg-blue-300 rounded"></div>
          </div>
        </div>
      )
    },
    {
      id: 'minimal',
      name: 'Minimal Design',
      description: 'Clean and focused minimal dashboard layout',
      icon: Minimize2,
      layout: 'minimal',
      preview: (
        <div className="w-full h-20 bg-blue-50 rounded border-2 border-blue-300 flex flex-col gap-1 p-2">
          <div className="h-2 bg-blue-300 rounded"></div>
          <div className="h-4 bg-blue-400 rounded"></div>
        </div>
      )
    }
  ];

  const themes: DashboardTheme[] = [
    { id: 'blue', name: 'Blue', primaryColor: '#3B82F6', appearance: 'light' },
    { id: 'purple', name: 'Purple', primaryColor: '#8B5CF6', appearance: 'light' },
    { id: 'green', name: 'Green', primaryColor: '#10B981', appearance: 'light' },
    { id: 'orange', name: 'Orange', primaryColor: '#F59E0B', appearance: 'light' },
    { id: 'red', name: 'Red', primaryColor: '#EF4444', appearance: 'light' }
  ];

  const handleTemplateSelect = (templateId: string) => {
    console.log('🎨 Template selected:', templateId);
    setConfigStatus('updating');
    setSelectedTemplate(templateId);
    
    // Update the configuration
    const newConfig = {
      template: templateId,
      theme: selectedTheme,
      customColors: {
        primary: themes.find(t => t.id === selectedTheme)?.primaryColor || '#3B82F6',
        secondary: '#8B5CF6',
        accent: '#10B981'
      },
      appearance: appearance,
      layout: {
        sidebar: templateId === 'sidebar',
        header: true,
        footer: false
      },
      branding: {
        title: 'Analytics Dashboard',
        subtitle: 'Monitor your business performance'
      }
    };
    
    console.log('📝 Dashboard config updated:', newConfig);
    
    if (onConfigChange) {
      onConfigChange(newConfig);
    }
    
    setTimeout(() => setConfigStatus('saved'), 500);
    setTimeout(() => setConfigStatus('idle'), 2000);
  };

  const handleThemeSelect = (themeId: string) => {
    console.log('🎨 Theme selected:', themeId);
    setConfigStatus('updating');
    setSelectedTheme(themeId);
    const selectedThemeData = themes.find(t => t.id === themeId);
    
    // Update the configuration
    const newConfig = {
      template: selectedTemplate,
      theme: themeId,
      customColors: {
        primary: selectedThemeData?.primaryColor || '#3B82F6',
        secondary: '#8B5CF6',
        accent: '#10B981'
      },
      appearance: appearance,
      layout: {
        sidebar: selectedTemplate === 'sidebar',
        header: true,
        footer: false
      },
      branding: {
        title: 'Analytics Dashboard',
        subtitle: 'Monitor your business performance'
      }
    };
    
    console.log('🎨 Theme config updated:', newConfig);
    
    if (onConfigChange && selectedThemeData) {
      onConfigChange(newConfig);
    }
    
    setTimeout(() => setConfigStatus('saved'), 500);
    setTimeout(() => setConfigStatus('idle'), 2000);
  };

  const handleAppearanceChange = (newAppearance: 'light' | 'dark') => {
    console.log('🎨 Appearance changed to:', newAppearance);
    setConfigStatus('updating');
    setAppearance(newAppearance);
    
    // Update the configuration
    const newConfig = {
      template: selectedTemplate,
      theme: selectedTheme,
      customColors: {
        primary: themes.find(t => t.id === selectedTheme)?.primaryColor || '#3B82F6',
        secondary: '#8B5CF6',
        accent: '#10B981'
      },
      appearance: newAppearance,
      layout: {
        sidebar: selectedTemplate === 'sidebar',
        header: true,
        footer: false
      },
      branding: {
        title: 'Analytics Dashboard',
        subtitle: 'Monitor your business performance'
      }
    };
    
    console.log('💡 Appearance config updated:', newConfig);
    
    if (onConfigChange) {
      onConfigChange(newConfig);
    }
    
    setTimeout(() => setConfigStatus('saved'), 500);
    setTimeout(() => setConfigStatus('idle'), 2000);
  };

  const getPreviewClassName = () => {
    switch (previewMode) {
      case 'tablet': return 'max-w-md mx-auto';
      case 'mobile': return 'max-w-sm mx-auto';
      default: return 'max-w-6xl mx-auto';
    }
  };

  const renderLivePreview = () => {
    const selectedThemeData = themes.find(t => t.id === selectedTheme);
    const selectedTemplateData = templates.find(t => t.id === selectedTemplate);
    
    return (
      <div className={`${getPreviewClassName()} bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden`}>
        {/* Preview Header */}
        <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Live Preview</span>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Ocean Blue</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setPreviewMode('desktop')}
              className={`p-1 rounded ${previewMode === 'desktop' ? 'bg-blue-500 text-white' : 'text-gray-500'}`}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setPreviewMode('tablet')}
              className={`p-1 rounded ${previewMode === 'tablet' ? 'bg-blue-500 text-white' : 'text-gray-500'}`}
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setPreviewMode('mobile')}
              className={`p-1 rounded ${previewMode === 'mobile' ? 'bg-blue-500 text-white' : 'text-gray-500'}`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dashboard Preview Content */}
        <div className="h-96 overflow-auto">
          {/* Header */}
          <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Layout className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">DashFlow</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Analytics Platform</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                  <Share className="w-4 h-4" />
                </button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm">
                  Deploy Dashboard
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className={`flex ${selectedTemplate === 'sidebar' ? 'gap-0' : 'flex-col'}`}>
            {/* Sidebar (if applicable) */}
            {selectedTemplate === 'sidebar' && (
              <div className="w-56 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-4">
                <div className="space-y-2">
                  <div className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-300 rounded"></div>
                    Analytics
                  </div>
                  <div className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-300 rounded"></div>
                    Users
                    <span className="ml-auto text-xs bg-gray-200 px-2 py-1 rounded">12</span>
                  </div>
                  <div className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-300 rounded"></div>
                    Performance
                  </div>
                  <div className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-300 rounded"></div>
                    Events
                    <span className="ml-auto text-xs bg-gray-200 px-2 py-1 rounded">3</span>
                  </div>
                </div>
                
                <div className="mt-8">
                  <div className="text-xs font-medium text-gray-500 mb-2">Pro Plan</div>
                  <div className="text-xs text-gray-600 mb-2">5 users remaining</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>
              </div>
            )}

            {/* Main Dashboard Area */}
            <div className="flex-1 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h2>
                  <p className="text-gray-600 dark:text-gray-400">Monitor your business performance</p>
                </div>
                <span className="text-sm text-green-600 flex items-center gap-1">
                  ● Live Data
                </span>
              </div>

              {/* Metrics Grid */}
              <div className={`grid gap-6 mb-6 ${selectedTemplate === 'grid' ? 'grid-cols-3' : selectedTemplate === 'card' ? 'grid-cols-2' : 'grid-cols-1'}`}>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900 dark:text-white">Total Revenue</h3>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">$45,231</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</div>
                  <div className="text-sm text-green-600 mt-1">↗ +20.1%</div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900 dark:text-white">Active Users</h3>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">1,429</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Active Users</div>
                  <div className="text-sm text-green-600 mt-1">↗ +12.5%</div>
                </div>

                {selectedTemplate !== 'minimal' && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-gray-900 dark:text-white">Conversion Rate</h3>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">43%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</div>
                    <div className="text-sm text-red-600 mt-1">↘ -2.3%</div>
                  </div>
                )}
              </div>

              {/* Top Clients Table */}
              {selectedTemplate !== 'minimal' && (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-medium text-gray-900 dark:text-white">Top Clients</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">Acme Corp</div>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">$12,500</div>
                          <div className="text-xs text-green-600">+15%</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">TechFlow</div>
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Pending</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">$8,750</div>
                          <div className="text-xs text-green-600">+8%</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">DataSync</div>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">$22,100</div>
                          <div className="text-xs text-green-600">+23%</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">CloudBase</div>
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Active</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">$5,300</div>
                          <div className="text-xs text-red-600">-5%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (showPreview) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        {/* Preview Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowPreview(false)}
                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                ←
              </button>
              <div className="flex items-center gap-2">
                <Layout className="w-5 h-5 text-blue-500" />
                <span className="font-medium text-gray-900 dark:text-white">Dashboard Builder</span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Create beautiful dashboards for your organization</span>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Share className="w-4 h-4" />
                <span className="ml-1 text-sm">Share</span>
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors">
                <Upload className="w-4 h-4 inline mr-1" />
                Deploy Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Preview Tabs */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto">
            <div className="flex">
              <button className="px-6 py-3 text-sm font-medium text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20">
                <Grid className="w-4 h-4 inline mr-2" />
                Build
              </button>
              <button className="px-6 py-3 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                <Monitor className="w-4 h-4 inline mr-2" />
                Preview
              </button>
              <button className="px-6 py-3 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                <Upload className="w-4 h-4 inline mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="p-8">
          {renderLivePreview()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Jumbo Studio
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Create beautiful dashboards with customizable templates and themes
          </p>
          {configStatus !== 'idle' && (
            <div className="mt-4">
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                configStatus === 'updating' 
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
              }`}>
                {configStatus === 'updating' && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                )}
                {configStatus === 'updating' ? 'Updating configuration...' : 'Configuration saved!'}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveStep('templates')}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-colors ${
                activeStep === 'templates'
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Templates
            </button>
            <button
              onClick={() => setActiveStep('themes')}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-colors ${
                activeStep === 'themes'
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Themes
            </button>
          </div>
        </div>

        {/* Content */}
        {activeStep === 'templates' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Choose Your Layout Template</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleTemplateSelect(template.id)}
                  className={`cursor-pointer group transition-all duration-200 ${
                    selectedTemplate === template.id
                      ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105'
                      : 'hover:shadow-lg hover:scale-105'
                  }`}
                >
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="mb-4">
                      {template.preview}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {template.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeStep === 'themes' && (
          <div>
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">Theme Settings</h2>
              
              {/* Appearance */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Appearance</h3>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleAppearanceChange('light')}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
                      appearance === 'light'
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <Sun className="w-4 h-4" />
                    Light
                  </button>
                  <button
                    onClick={() => handleAppearanceChange('dark')}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
                      appearance === 'dark'
                        ? 'bg-gray-700 text-white border-gray-700'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <Moon className="w-4 h-4" />
                    Dark
                  </button>
                </div>
              </div>

              {/* Color Scheme */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Color Scheme</h3>
                <div className="flex gap-4 justify-center">
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => handleThemeSelect(theme.id)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all duration-200 ${
                        selectedTheme === theme.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-200 scale-105'
                          : 'border-gray-200 hover:border-gray-300 hover:scale-105'
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                        style={{ backgroundColor: theme.primaryColor }}
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{theme.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preview Button and Current Selection */}
        <div className="text-center mt-12">
          <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 inline-block">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Current Selection</h4>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span>Template: <strong className="text-gray-900 dark:text-white">{templates.find(t => t.id === selectedTemplate)?.name}</strong></span>
              <span>Theme: <strong className="text-gray-900 dark:text-white">{themes.find(t => t.id === selectedTheme)?.name}</strong></span>
              <span>Mode: <strong className="text-gray-900 dark:text-white">{appearance === 'light' ? 'Light' : 'Dark'}</strong></span>
            </div>
          </div>
          <div>
            <button
              onClick={() => setShowPreview(true)}
              className="px-8 py-4 bg-blue-500 text-white rounded-lg text-lg font-medium hover:bg-blue-600 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Preview Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};