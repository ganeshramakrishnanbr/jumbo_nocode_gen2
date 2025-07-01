# 09 - JSON Export and Data Management

This prompt creates the comprehensive JSON export system with data formatting and configuration management.

## Visual Design Requirements

### JSON Viewer Layout
- **Split Panel Design**: Left panel for settings, right panel for formatted JSON
- **Syntax Highlighting**: Professional JSON syntax highlighting with colors
- **Export Options**: Multiple format options and download configurations
- **Data Validation**: Real-time validation with error highlighting
- **Copy Functions**: One-click copy with visual feedback

### Export Configuration
- **Format Options**: Minified, pretty-printed, and developer-friendly formats
- **Data Selection**: Granular control over included data sections
- **Metadata Options**: Include/exclude timestamps, IDs, and system data
- **Download Settings**: Custom filenames and batch export options

## AI Prompt

```
Create a comprehensive JSON export system with the following exact visual specifications:

VISUAL DESIGN STANDARDS:

JSON Viewer Styling:
- Background: Dark code editor theme (#1e293b) with syntax highlighting
- Font: JetBrains Mono or Consolas for code readability
- Line numbers: Left gutter with gray numbers
- Syntax colors: Blue keywords, green strings, orange numbers, purple booleans
- Error highlighting: Red underline with error tooltips

Configuration Panel:
- Width: 320px with white background and subtle shadows
- Section headers: Bold text with colored icons
- Toggle switches: Blue accent color with smooth animations
- Export button: Prominent blue button with download icon

JSON VIEWER COMPONENT (client/src/components/JSONViewer.tsx):
```typescript
import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

import { 
  Download, Copy, Eye, Code, Settings, Database, 
  FileText, CheckCircle2, AlertCircle, ChevronDown,
  Braces, Hash, Quote, ToggleLeft
} from 'lucide-react';

import type { DroppedControl, Section, CustomerTier } from '@shared/types';

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

interface ExportConfig {
  format: 'pretty' | 'minified' | 'developer';
  includeMetadata: boolean;
  includeSystemData: boolean;
  includeValidation: boolean;
  includeDashboardConfig: boolean;
  includeFormProgress: boolean;
  includeControlIds: boolean;
  includeTimestamps: boolean;
  filename: string;
}

export const JSONViewer: React.FC<JSONViewerProps> = ({
  droppedControls,
  currentTier,
  sections,
  selectedTheme,
  tabAlignment,
  formProgress,
  dashboardConfig
}) => {
  const [config, setConfig] = useState<ExportConfig>({
    format: 'pretty',
    includeMetadata: true,
    includeSystemData: false,
    includeValidation: true,
    includeDashboardConfig: true,
    includeFormProgress: false,
    includeControlIds: true,
    includeTimestamps: false,
    filename: `form-export-${new Date().toISOString().split('T')[0]}`
  });

  const [copySuccess, setCopySuccess] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['form']));

  const jsonData = useMemo(() => {
    const data: any = {};

    // Basic form structure
    if (expandedSections.has('form')) {
      data.form = {
        ...(config.includeMetadata && {
          name: "Untitled Form",
          description: "Generated form configuration",
          version: "1.0.0",
          ...(config.includeTimestamps && {
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          })
        }),
        tier: currentTier,
        ...(selectedTheme && { theme: selectedTheme }),
        ...(tabAlignment && { tabAlignment }),
        sections: sections.map(section => ({
          ...(config.includeControlIds && { id: section.id }),
          name: section.name,
          description: section.description,
          color: section.color,
          icon: section.icon,
          order: section.sectionOrder,
          required: section.required || false,
          ...(config.includeSystemData && {
            questionnaireId: section.questionnaireId
          })
        })),
        controls: droppedControls.map(control => ({
          ...(config.includeControlIds && { id: control.id }),
          type: control.type,
          name: control.name,
          properties: {
            ...control.properties,
            ...(config.includeValidation && control.validation && {
              validation: control.validation
            })
          },
          position: {
            x: control.x,
            y: control.y,
            width: control.width,
            height: control.height
          },
          ...(control.sectionId && { sectionId: control.sectionId }),
          ...(config.includeSystemData && {
            questionnaireId: control.questionnaireId
          })
        }))
      };
    }

    // Dashboard configuration
    if (config.includeDashboardConfig && dashboardConfig && expandedSections.has('dashboard')) {
      data.dashboard = {
        template: dashboardConfig.template,
        theme: dashboardConfig.theme,
        appearance: dashboardConfig.appearance,
        layout: dashboardConfig.layout,
        branding: dashboardConfig.branding,
        customColors: dashboardConfig.customColors,
        ...(config.includeTimestamps && {
          configuredAt: new Date().toISOString()
        })
      };
    }

    // Form progress
    if (config.includeFormProgress && formProgress && expandedSections.has('progress')) {
      data.progress = {
        overall: formProgress.overall,
        required: formProgress.required,
        completed: formProgress.filledCount,
        total: formProgress.totalCount,
        ...(config.includeTimestamps && {
          calculatedAt: new Date().toISOString()
        })
      };
    }

    // Tier configuration
    if (expandedSections.has('tier')) {
      data.tierConfig = getTierConfiguration(currentTier);
    }

    // Export metadata
    if (config.includeMetadata && expandedSections.has('metadata')) {
      data.exportMetadata = {
        exportedAt: new Date().toISOString(),
        exportedBy: "Jumbo Studio",
        version: "1.0.0",
        format: config.format,
        tier: currentTier,
        controlCount: droppedControls.length,
        sectionCount: sections.length
      };
    }

    return data;
  }, [
    droppedControls,
    sections,
    currentTier,
    selectedTheme,
    tabAlignment,
    formProgress,
    dashboardConfig,
    config,
    expandedSections
  ]);

  const formattedJSON = useMemo(() => {
    switch (config.format) {
      case 'minified':
        return JSON.stringify(jsonData);
      case 'developer':
        return JSON.stringify(jsonData, null, 4);
      case 'pretty':
      default:
        return JSON.stringify(jsonData, null, 2);
    }
  }, [jsonData, config.format]);

  const getTierConfiguration = (tier: CustomerTier) => {
    const tierConfigs = {
      Bronze: {
        maxControls: 10,
        maxSections: 2,
        features: ['basic-controls', 'simple-validation'],
        pdfTemplates: ['basic'],
        customization: 'limited'
      },
      Silver: {
        maxControls: 25,
        maxSections: 5,
        features: ['basic-controls', 'advanced-validation', 'file-upload'],
        pdfTemplates: ['basic', 'professional'],
        customization: 'moderate'
      },
      Gold: {
        maxControls: 50,
        maxSections: 10,
        features: ['all-controls', 'advanced-validation', 'conditional-logic', 'integrations'],
        pdfTemplates: ['basic', 'professional', 'branded'],
        customization: 'extensive'
      },
      Platinum: {
        maxControls: -1, // unlimited
        maxSections: -1, // unlimited
        features: ['all-controls', 'advanced-validation', 'conditional-logic', 'integrations', 'custom-themes', 'api-access'],
        pdfTemplates: ['all'],
        customization: 'unlimited'
      }
    };

    return tierConfigs[tier];
  };

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(formattedJSON);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy JSON:', error);
    }
  }, [formattedJSON]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([formattedJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${config.filename}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [formattedJSON, config.filename]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const getSyntaxHighlightedJSON = (jsonString: string) => {
    return jsonString
      .replace(/(".*?")\s*:/g, '<span class="json-key">$1</span>:')
      .replace(/:\s*(".*?")/g, ': <span class="json-string">$1</span>')
      .replace(/:\s*(\d+\.?\d*)/g, ': <span class="json-number">$1</span>')
      .replace(/:\s*(true|false)/g, ': <span class="json-boolean">$1</span>')
      .replace(/:\s*(null)/g, ': <span class="json-null">$1</span>');
  };

  if (droppedControls.length === 0 && sections.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <Code className="h-10 w-10 text-slate-400 dark:text-slate-500" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
            No Data to Export
          </h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Create some form controls and sections in the Design tab to generate JSON export data.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex bg-slate-50 dark:bg-slate-900">
      
      {/* Configuration Panel */}
      <div className="w-80 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center">
              <Settings className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">JSON Export</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">Configure your data export</p>
            </div>
          </div>
        </div>
        
        <ScrollArea className="h-[calc(100%-88px)]">
          <div className="p-4 space-y-6">
            
            {/* Format Options */}
            <Collapsible defaultOpen>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded">
                <div className="flex items-center space-x-2">
                  <Code className="h-4 w-4 text-emerald-600" />
                  <span className="font-medium">Format Options</span>
                </div>
                <ChevronDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 mt-3">
                <div>
                  <Label className="text-sm font-medium">JSON Format</Label>
                  <Select value={config.format} onValueChange={(value: any) => setConfig(prev => ({ ...prev, format: value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pretty">Pretty (2 spaces)</SelectItem>
                      <SelectItem value="developer">Developer (4 spaces)</SelectItem>
                      <SelectItem value="minified">Minified</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Filename</Label>
                  <Input
                    value={config.filename}
                    onChange={(e) => setConfig(prev => ({ ...prev, filename: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Separator />
            
            {/* Data Sections */}
            <Collapsible defaultOpen>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded">
                <div className="flex items-center space-x-2">
                  <Database className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Data Sections</span>
                </div>
                <ChevronDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 mt-3">
                {[
                  { id: 'form', label: 'Form Structure', icon: FileText, description: 'Controls and sections' },
                  { id: 'dashboard', label: 'Dashboard Config', icon: Eye, description: 'Theme and layout settings' },
                  { id: 'progress', label: 'Form Progress', icon: ToggleLeft, description: 'Completion statistics' },
                  { id: 'tier', label: 'Tier Configuration', icon: Hash, description: 'Feature limitations' },
                  { id: 'metadata', label: 'Export Metadata', icon: Braces, description: 'Export information' }
                ].map(section => (
                  <div key={section.id} className="flex items-center space-x-3">
                    <Switch
                      checked={expandedSections.has(section.id)}
                      onCheckedChange={() => toggleSection(section.id)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <section.icon className="h-4 w-4 text-slate-500" />
                        <Label className="text-sm font-medium">{section.label}</Label>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{section.description}</p>
                    </div>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>

            <Separator />
            
            {/* Data Options */}
            <Collapsible defaultOpen>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded">
                <div className="flex items-center space-x-2">
                  <Settings className="h-4 w-4 text-purple-600" />
                  <span className="font-medium">Data Options</span>
                </div>
                <ChevronDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 mt-3">
                {[
                  { key: 'includeMetadata', label: 'Include Metadata', description: 'Form name, version, dates' },
                  { key: 'includeSystemData', label: 'Include System Data', description: 'Internal IDs and references' },
                  { key: 'includeValidation', label: 'Include Validation', description: 'Validation rules and patterns' },
                  { key: 'includeControlIds', label: 'Include Control IDs', description: 'Unique control identifiers' },
                  { key: 'includeTimestamps', label: 'Include Timestamps', description: 'Creation and update times' }
                ].map(option => (
                  <div key={option.key} className="flex items-center space-x-3">
                    <Switch
                      checked={config[option.key as keyof ExportConfig] as boolean}
                      onCheckedChange={(checked) => setConfig(prev => ({ ...prev, [option.key]: checked }))}
                    />
                    <div className="flex-1">
                      <Label className="text-sm font-medium">{option.label}</Label>
                      <p className="text-xs text-slate-500 mt-1">{option.description}</p>
                    </div>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>

            <Separator />
            
            {/* Export Actions */}
            <div className="space-y-3">
              <Button onClick={handleCopy} variant="outline" className="w-full">
                {copySuccess ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy JSON
                  </>
                )}
              </Button>
              
              <Button onClick={handleDownload} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download JSON
              </Button>
            </div>

            {/* Statistics */}
            <Card className="bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600">
              <CardContent className="p-3">
                <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Export Stats</h4>
                <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Controls:</span>
                    <span>{droppedControls.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sections:</span>
                    <span>{sections.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>File Size:</span>
                    <span>{(new Blob([formattedJSON]).size / 1024).toFixed(1)} KB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tier:</span>
                    <Badge variant="outline" className="h-5 text-xs">
                      {currentTier}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
      
      {/* JSON Preview */}
      <div className="flex-1 flex flex-col">
        <div className="bg-slate-800 text-slate-200 p-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-slate-700 rounded flex items-center justify-center">
                <Braces className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold">JSON Preview</h3>
                <p className="text-sm text-slate-400">
                  {config.format} format • {(new Blob([formattedJSON]).size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-slate-700 text-slate-200">
                {Object.keys(jsonData).length} sections
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex-1 bg-slate-900 text-slate-100">
          <ScrollArea className="h-full">
            <div className="p-6">
              <pre className="text-sm font-mono leading-relaxed">
                <style jsx>{`
                  .json-key { color: #60a5fa; }
                  .json-string { color: #34d399; }
                  .json-number { color: #fbbf24; }
                  .json-boolean { color: #c084fc; }
                  .json-null { color: #f87171; }
                `}</style>
                <div dangerouslySetInnerHTML={{ __html: getSyntaxHighlightedJSON(formattedJSON) }} />
              </pre>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};
```

Create a comprehensive JSON export system with syntax highlighting, configurable data sections, and professional formatting options for complete form configuration management.
```