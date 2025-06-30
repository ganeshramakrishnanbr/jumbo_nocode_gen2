import React, { useState } from 'react';
import { DroppedControl, CustomerTier, Section } from '../types';
import { Copy, Download, ChevronDown, ChevronRight, Code, Palette } from 'lucide-react';

interface JSONViewerProps {
  droppedControls: DroppedControl[];
  currentTier: CustomerTier;
  sections: Section[];
  selectedTheme?: string;
  tabAlignment?: 'top' | 'left' | 'right';
  formProgress?: {
    overall: number;
    required: number;
    filledCount: number;
    totalCount: number;
  };
  dashboardConfig?: {
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
  };
}

export const JSONViewer: React.FC<JSONViewerProps> = ({
  droppedControls,
  currentTier,
  sections,
  selectedTheme = 'classic',
  tabAlignment = 'top',
  formProgress = { overall: 0, required: 0, filledCount: 0, totalCount: 0 },
  dashboardConfig
}) => {
  const [designerExpanded, setDesignerExpanded] = useState(true);
  const [experienceExpanded, setExperienceExpanded] = useState(false);
  const [dashboardExpanded, setDashboardExpanded] = useState(false);
  const generateDesignerJSON = () => {
    return {
      formDefinition: {
        id: `form-${Date.now()}`,
        name: "Generated Form",
        version: "1.0.0",
        created: new Date().toISOString(),
        tierExperience: currentTier,
        sections: sections.map(section => ({
          id: section.id,
          name: section.name,
          order: section.order,
          required: section.required,
          controls: droppedControls
            .filter(control => control.sectionId === section.id)
            .map(control => ({
              id: control.id,
              type: control.type,
              name: control.name,
              position: { x: control.x, y: control.y },
              size: { width: control.width, height: control.height },
              properties: control.properties,
              validation: {
                required: control.properties.required || false,
                rules: []
              }
            }))
        })),
        controls: droppedControls.map(control => ({
          id: control.id,
          type: control.type,
          name: control.name,
          position: { x: control.x, y: control.y },
          size: { width: control.width, height: control.height },
          properties: control.properties,
          sectionId: control.sectionId || null,
          validation: {
            required: control.properties.required || false,
            rules: []
          }
        })),
        settings: {
          layout: "standard",
          theme: currentTier,
          navigation: {
            type: "tabs",
            showProgress: true,
            allowSkip: currentTier === 'platinum' || currentTier === 'gold'
          }
        }
      },
      tierConfiguration: {
        tier: currentTier,
        layoutOptions: getTierLayouts(currentTier),
        customization: getTierCustomization(currentTier),
        pdfGeneration: {
          templatesAvailable: getTierPDFTemplates(currentTier),
          customStyling: currentTier === 'platinum' || currentTier === 'gold'
        }
      },
      generatedAt: new Date().toISOString(),
      schemaVersion: "2.1.0"
    };
  };

  const getTierLayouts = (tier: CustomerTier) => {
    const layouts = {
      platinum: 12,
      gold: 8,
      silver: 5,
      bronze: 3
    };
    return layouts[tier];
  };

  const getTierCustomization = (tier: CustomerTier) => {
    const customization = {
      platinum: ['Full Theme Control', 'Custom CSS', 'Logo Upload', 'Animation Control'],
      gold: ['Preset Themes', 'Logo Upload', 'Basic Styling'],
      silver: ['Preset Themes', 'Basic Colors'],
      bronze: ['Basic Themes']
    };
    return customization[tier];
  };

  const getTierPDFTemplates = (tier: CustomerTier) => {
    const templates = {
      platinum: 20,
      gold: 12,
      silver: 6,
      bronze: 3
    };
    return templates[tier];
  };

  const generateUserExperienceJSON = () => {
    return {
      userExperience: {
        id: `ux-${Date.now()}`,
        name: "User Experience Configuration",
        version: "1.0.0",
        created: new Date().toISOString(),
        tier: currentTier,
        
        // Theme Configuration
        themeSettings: {
          selectedTheme: selectedTheme,
          themeType: selectedTheme,
          appearance: {
            colorScheme: selectedTheme === 'classic' ? 'traditional' : 
                        selectedTheme === 'modern' ? 'gradient' :
                        selectedTheme === 'minimal' ? 'clean' :
                        selectedTheme === 'compact' ? 'dense' : 'luxury',
            typography: selectedTheme === 'luxury' ? 'serif' : 'sans-serif',
            borderRadius: selectedTheme === 'modern' || selectedTheme === 'luxury' ? 'rounded' : 'standard',
            spacing: selectedTheme === 'compact' ? 'tight' : 'standard'
          }
        },

        // Layout Configuration
        layoutSettings: {
          tabAlignment: tabAlignment,
          navigationStyle: tabAlignment === 'top' ? 'horizontal-tabs' : 'vertical-sidebar',
          sectionManagement: {
            totalSections: sections.length,
            sectionsEnabled: sections.length > 1,
            sectionNames: sections.map(s => s.name)
          }
        },

        // Progress Tracking
        progressTracking: {
          enabled: true,
          overall: formProgress.overall,
          required: formProgress.required,
          metrics: {
            fieldsCompleted: formProgress.filledCount,
            totalFields: formProgress.totalCount,
            completionRate: formProgress.overall / 100
          }
        },

        // Form Controls Experience
        controlsExperience: droppedControls.map(control => ({
          id: control.id,
          type: control.type,
          userVisible: true,
          accessibility: {
            label: control.properties.label || '',
            required: control.properties.required || false,
            helpText: control.properties.description || '',
            placeholder: control.properties.placeholder || ''
          },
          validation: {
            isRequired: control.properties.required || false,
            customRules: []
          },
          styling: {
            theme: selectedTheme,
            position: 'section-based'
          }
        })),

        // Interactive Features
        interactivity: {
          formValidation: 'real-time',
          progressIndicators: true,
          sectionNavigation: sections.length > 1,
          responsiveDesign: true,
          darkModeSupport: true
        },

        // Export Settings
        exportCapabilities: {
          supportedFormats: ['JSON', 'PDF', 'Excel'],
          themePreservation: true,
          layoutPreservation: true,
          dataExport: true
        }
      },

      // Metadata
      metadata: {
        generatedAt: new Date().toISOString(),
        schemaVersion: "1.0.0",
        source: "Jumbo No-Code Form Builder",
        purpose: "User Experience Export"
      }
    };
  };

  const generateDashboardJSON = () => {
    if (!dashboardConfig) {
      return {
        dashboardDesigner: {
          id: `dashboard-${Date.now()}`,
          name: "Dashboard Configuration",
          version: "1.0.0",
          created: new Date().toISOString(),
          note: "No dashboard configuration available"
        }
      };
    }

    return {
      dashboardDesigner: {
        id: `dashboard-${Date.now()}`,
        name: "Dashboard Configuration",
        version: "1.0.0",
        created: new Date().toISOString(),
        
        // Template Configuration
        templateSettings: {
          selectedTemplate: dashboardConfig.template,
          templateType: dashboardConfig.template,
          layoutProperties: {
            structure: dashboardConfig.template === 'grid' ? 'flexible-grid' :
                      dashboardConfig.template === 'sidebar' ? 'fixed-sidebar' :
                      dashboardConfig.template === 'card' ? 'card-based' : 'minimal-layout',
            responsiveBreakpoints: {
              mobile: '768px',
              tablet: '1024px',
              desktop: '1200px'
            }
          }
        },

        // Theme and Appearance
        themeConfiguration: {
          selectedTheme: dashboardConfig.theme,
          appearance: dashboardConfig.appearance,
          colorPalette: {
            primary: dashboardConfig.customColors.primary,
            secondary: dashboardConfig.customColors.secondary,
            accent: dashboardConfig.customColors.accent
          },
          darkModeSupport: true,
          themeVariants: {
            light: {
              background: '#ffffff',
              surface: '#f8fafc',
              text: '#1f2937'
            },
            dark: {
              background: '#111827',
              surface: '#1f2937', 
              text: '#f9fafb'
            }
          }
        },

        // Layout Configuration
        layoutSettings: {
          sidebar: {
            enabled: dashboardConfig.layout.sidebar,
            position: 'left',
            collapsible: true,
            width: '256px'
          },
          header: {
            enabled: dashboardConfig.layout.header,
            height: '64px',
            sticky: true
          },
          footer: {
            enabled: dashboardConfig.layout.footer,
            height: 'auto'
          }
        },

        // Branding Configuration
        brandingSettings: {
          title: dashboardConfig.branding.title,
          subtitle: dashboardConfig.branding.subtitle,
          logo: dashboardConfig.branding.logo || null,
          favicon: null,
          customStyling: {
            logoPosition: 'left',
            titleAlignment: 'left',
            headerStyle: 'modern'
          }
        },

        // Component Library
        availableComponents: {
          charts: ['line', 'bar', 'pie', 'area', 'scatter'],
          widgets: ['metric-card', 'progress-bar', 'gauge', 'counter'],
          tables: ['data-table', 'comparison-table', 'summary-table'],
          navigation: ['breadcrumbs', 'tabs', 'pagination'],
          display: ['alerts', 'badges', 'cards', 'avatars']
        },

        // Integration Settings
        integrationCapabilities: {
          dataConnections: {
            apis: true,
            databases: true,
            realTime: true
          },
          exportFormats: ['JSON', 'PDF', 'PNG', 'SVG'],
          sharingOptions: ['public-link', 'embed-code', 'download'],
          deployment: {
            platforms: ['web', 'mobile-responsive'],
            hosting: 'cloud-ready'
          }
        }
      },

      // Metadata
      metadata: {
        generatedAt: new Date().toISOString(),
        schemaVersion: "1.0.0",
        source: "Jumbo No-Code Form Builder - Dashboard Designer",
        purpose: "Dashboard Configuration Export",
        compatibleWith: ["React", "Vue", "Angular", "Vanilla JS"]
      }
    };
  };

  const designerJsonString = JSON.stringify(generateDesignerJSON(), null, 2);
  const experienceJsonString = JSON.stringify(generateUserExperienceJSON(), null, 2);
  const dashboardJsonString = JSON.stringify(generateDashboardJSON(), null, 2);

  const copyToClipboard = (jsonType: 'designer' | 'experience') => {
    const jsonString = jsonType === 'designer' ? designerJsonString : experienceJsonString;
    navigator.clipboard.writeText(jsonString);
  };

  const downloadJSON = (jsonType: 'designer' | 'experience') => {
    const jsonString = jsonType === 'designer' ? designerJsonString : experienceJsonString;
    const filename = jsonType === 'designer' ? 
      `form-definition-${Date.now()}.json` : 
      `user-experience-${Date.now()}.json`;
    
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 bg-white dark:bg-gray-800 flex flex-col transition-colors">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 transition-colors">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors">JSON Configuration</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">
            Export form definitions and user experience configurations
          </p>
        </div>
      </div>

      {/* JSON Sections */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        
        {/* Designer JSON Section */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg transition-colors">
          <div className="border-b border-gray-200 dark:border-gray-700 p-4 transition-colors">
            <button
              onClick={() => setDesignerExpanded(!designerExpanded)}
              className="w-full flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700 p-2 -m-2 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Code className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">Designer JSON</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Form structure, controls, and configuration</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {designerExpanded && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); copyToClipboard('designer'); }}
                      className="flex items-center px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded transition-colors"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); downloadJSON('designer'); }}
                      className="flex items-center px-2 py-1 text-xs bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded transition-colors"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </button>
                  </>
                )}
                {designerExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </button>
          </div>
          
          {designerExpanded && (
            <div className="p-4">
              <pre className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 text-sm font-mono overflow-auto border border-gray-200 dark:border-gray-700 transition-colors max-h-96">
                <code className="text-gray-800 dark:text-gray-200 transition-colors">{designerJsonString}</code>
              </pre>
            </div>
          )}
        </div>

        {/* User Experience JSON Section */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg transition-colors">
          <div className="border-b border-gray-200 dark:border-gray-700 p-4 transition-colors">
            <button
              onClick={() => setExperienceExpanded(!experienceExpanded)}
              className="w-full flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700 p-2 -m-2 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">User Experience JSON</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Theme settings, layout, and user interaction data</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {experienceExpanded && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); copyToClipboard('experience'); }}
                      className="flex items-center px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded transition-colors"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); downloadJSON('experience'); }}
                      className="flex items-center px-2 py-1 text-xs bg-purple-600 dark:bg-purple-700 hover:bg-purple-700 dark:hover:bg-purple-600 text-white rounded transition-colors"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </button>
                  </>
                )}
                {experienceExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </button>
          </div>
          
          {experienceExpanded && (
            <div className="p-4">
              <pre className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 text-sm font-mono overflow-auto border border-gray-200 dark:border-gray-700 transition-colors max-h-96">
                <code className="text-gray-800 dark:text-gray-200 transition-colors">{experienceJsonString}</code>
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-3 bg-gray-50 dark:bg-gray-800 transition-colors">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 transition-colors">
          <div className="flex items-center space-x-6">
            <span>Controls: {droppedControls.length}</span>
            <span>Sections: {sections.length}</span>
            <span>Tier: {currentTier.charAt(0).toUpperCase() + currentTier.slice(1)}</span>
            <span>Theme: {selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)}</span>
            <span>Progress: {formProgress.overall}%</span>
          </div>
          <span>Generated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};