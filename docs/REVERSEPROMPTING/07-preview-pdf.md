# 07 - Preview Mode and PDF Generation

This prompt creates the preview mode with form testing and comprehensive PDF generation capabilities.

## Visual Design Requirements

### Preview Mode Layout
- **Full-width Design**: Utilize full screen width with centered content
- **Form Styling**: Clean, professional form appearance with proper spacing
- **Progress Indicators**: Visual progress bar showing completion status
- **Section Navigation**: Tab-based navigation between form sections
- **Responsive Design**: Mobile-friendly layout with touch-optimized controls

### PDF Generation Features
- **Template Selection**: Multiple professional templates for different use cases
- **Custom Branding**: Logo upload, custom headers/footers, company information
- **Data Integration**: Form values displayed in generated PDF
- **Page Layout**: Proper page breaks, margins, and typography
- **Export Options**: Download as PDF with custom filename

## AI Prompt

```
Create comprehensive preview mode and PDF generation with the following exact visual specifications:

VISUAL DESIGN STANDARDS:

Preview Mode Styling:
- Container: Max-width 1024px, centered with 32px horizontal padding
- Form sections: White background with subtle shadows and 16px padding
- Progress bar: Height 8px with blue-500 fill color and smooth animations
- Section tabs: 48px height with blue-500 active state and hover effects
- Form spacing: 24px between controls, 16px between label and input

PDF Template Designs:
- Margins: 40px all sides for professional appearance
- Typography: Inter font family with proper hierarchy
- Headers: Company logo (if provided) with form title and generation date
- Content: Clean layout with proper spacing and readability
- Footers: Page numbers and custom footer text

PREVIEW MODE COMPONENT (client/src/components/PreviewMode.tsx):
```typescript
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DroppedControlComponent } from './DroppedControlComponent';
import { Separator } from '@/components/ui/separator';

import { 
  Play, CheckCircle2, AlertCircle, ArrowLeft, ArrowRight,
  FileText, Clock, User, Calendar, BarChart3
} from 'lucide-react';

import type { DroppedControl, Section } from '@shared/types';
import { validateForm } from '@/lib/validation';

interface PreviewModeProps {
  droppedControls: DroppedControl[];
  sections: Section[];
  formValues?: { [controlId: string]: any };
  onFormValueChange?: (controlId: string, value: any) => void;
  currentTheme?: string;
}

export const PreviewMode: React.FC<PreviewModeProps> = ({
  droppedControls,
  sections,
  formValues = {},
  onFormValueChange = () => {},
  currentTheme = 'classic'
}) => {
  const [activeSection, setActiveSection] = useState(sections[0]?.id || '');
  const [showValidation, setShowValidation] = useState(false);

  // Calculate form progress and validation
  const { formProgress, validation } = useMemo(() => {
    const progress = {
      overall: 0,
      required: 0,
      filledCount: 0,
      totalCount: droppedControls.length
    };

    const requiredControls = droppedControls.filter(c => c.properties.required);
    const filledControls = droppedControls.filter(c => {
      const value = formValues[c.id];
      return value !== undefined && value !== null && value !== '';
    });
    const filledRequiredControls = requiredControls.filter(c => {
      const value = formValues[c.id];
      return value !== undefined && value !== null && value !== '';
    });

    progress.overall = droppedControls.length > 0 ? (filledControls.length / droppedControls.length) * 100 : 0;
    progress.required = requiredControls.length > 0 ? (filledRequiredControls.length / requiredControls.length) * 100 : 100;
    progress.filledCount = filledControls.length;

    const formValidation = validateForm(droppedControls, formValues);

    return {
      formProgress: progress,
      validation: formValidation
    };
  }, [droppedControls, formValues]);

  // Group controls by section
  const controlsBySection = useMemo(() => {
    const grouped: Record<string, DroppedControl[]> = {};
    
    sections.forEach(section => {
      grouped[section.id] = droppedControls
        .filter(control => control.sectionId === section.id)
        .sort((a, b) => a.y - b.y || a.x - b.x);
    });

    // Add controls without section to a default group
    const unassignedControls = droppedControls.filter(control => 
      !control.sectionId || !sections.find(s => s.id === control.sectionId)
    );
    if (unassignedControls.length > 0) {
      grouped['unassigned'] = unassignedControls.sort((a, b) => a.y - b.y || a.x - b.x);
    }

    return grouped;
  }, [droppedControls, sections]);

  const getSectionProgress = (sectionId: string) => {
    const sectionControls = controlsBySection[sectionId] || [];
    if (sectionControls.length === 0) return 100;
    
    const filledControls = sectionControls.filter(control => {
      const value = formValues[control.id];
      return value !== undefined && value !== null && value !== '';
    });
    
    return (filledControls.length / sectionControls.length) * 100;
  };

  const getSectionStatus = (sectionId: string) => {
    const sectionControls = controlsBySection[sectionId] || [];
    const requiredControls = sectionControls.filter(c => c.properties.required);
    const hasErrors = sectionControls.some(c => validation.errors[c.id]);
    
    if (hasErrors) return 'error';
    if (requiredControls.length === 0) return 'complete';
    
    const completedRequired = requiredControls.filter(c => {
      const value = formValues[c.id];
      return value !== undefined && value !== null && value !== '';
    });
    
    return completedRequired.length === requiredControls.length ? 'complete' : 'incomplete';
  };

  if (droppedControls.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="h-10 w-10 text-slate-400 dark:text-slate-500" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
            No Form Controls Added
          </h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Switch to the Design tab to start building your form by dragging controls from the library onto the canvas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="h-full flex flex-col">
        
        {/* Header with Progress */}
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Play className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    Form Preview
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Test your form and see how users will interact with it
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button
                  variant={showValidation ? "default" : "outline"}
                  onClick={() => setShowValidation(!showValidation)}
                  className="flex items-center space-x-2"
                >
                  {validation.isValid ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span>Validation</span>
                </Button>
              </div>
            </div>
            
            {/* Progress Indicators */}
            <div className="grid grid-cols-3 gap-6 mb-4">
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Overall Progress</span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {Math.round(formProgress.overall)}%
                  </span>
                </div>
                <Progress value={formProgress.overall} className="h-2" />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {formProgress.filledCount} of {formProgress.totalCount} fields completed
                </p>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Required Fields</span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {Math.round(formProgress.required)}%
                  </span>
                </div>
                <Progress value={formProgress.required} className="h-2" />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  All required fields must be completed
                </p>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Validation Status</span>
                  {validation.isValid ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {validation.isValid ? 'All valid' : `${validation.summary.errorCount} errors`}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full max-w-4xl mx-auto px-6 py-8">
            {sections.length > 1 ? (
              <Tabs value={activeSection} onValueChange={setActiveSection} className="h-full">
                <TabsList className="grid w-full mb-6" style={{ gridTemplateColumns: `repeat(${sections.length}, 1fr)` }}>
                  {sections.map((section) => {
                    const status = getSectionStatus(section.id);
                    const progress = getSectionProgress(section.id);
                    
                    return (
                      <TabsTrigger 
                        key={section.id} 
                        value={section.id}
                        className="relative flex flex-col items-center p-3"
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: section.color }}
                          />
                          <span className="font-medium">{section.name}</span>
                          {status === 'complete' && (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          )}
                          {status === 'error' && (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-current transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>

                {sections.map((section) => (
                  <TabsContent key={section.id} value={section.id} className="h-[calc(100%-120px)]">
                    <ScrollArea className="h-full">
                      <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
                        <CardHeader className="pb-4">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-medium"
                              style={{ backgroundColor: section.color }}
                            >
                              {sections.indexOf(section) + 1}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                {section.name}
                              </h3>
                              {section.description && (
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                  {section.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {(controlsBySection[section.id] || []).map((control) => (
                            <div key={control.id}>
                              <DroppedControlComponent
                                control={control}
                                isSelected={false}
                                onSelect={() => {}}
                                onUpdate={() => {}}
                                isInPreviewMode={true}
                                value={formValues[control.id]}
                                onChange={(value) => onFormValueChange(control.id, value)}
                                validationError={
                                  showValidation && validation.errors[control.id] 
                                    ? validation.errors[control.id][0] 
                                    : undefined
                                }
                              />
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </ScrollArea>
                  </TabsContent>
                ))}
              </Tabs>
            ) : (
              <ScrollArea className="h-full">
                <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Form Preview
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Fill out the form to test the user experience
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {droppedControls
                      .sort((a, b) => a.y - b.y || a.x - b.x)
                      .map((control) => (
                        <div key={control.id}>
                          <DroppedControlComponent
                            control={control}
                            isSelected={false}
                            onSelect={() => {}}
                            onUpdate={() => {}}
                            isInPreviewMode={true}
                            value={formValues[control.id]}
                            onChange={(value) => onFormValueChange(control.id, value)}
                            validationError={
                              showValidation && validation.errors[control.id] 
                                ? validation.errors[control.id][0] 
                                : undefined
                            }
                          />
                        </div>
                      ))}
                  </CardContent>
                </Card>
              </ScrollArea>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
```

PDF PREVIEW COMPONENT (client/src/components/PDFPreview.tsx):
```typescript
import React, { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

import { 
  FileDown, Eye, Image, Settings, Upload, Palette,
  Download, CheckCircle2, AlertCircle, FileText
} from 'lucide-react';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { DroppedControl, Section, CustomerTier } from '@shared/types';
import { PDF_TEMPLATES, getAvailableTemplates } from '@/data/pdfTemplates';

interface PDFPreviewProps {
  droppedControls: DroppedControl[];
  sections: Section[];
  currentTier: CustomerTier;
  formValues?: { [controlId: string]: any };
  onFormValueChange?: (controlId: string, value: any) => void;
}

interface PDFConfig {
  template: string;
  includeValues: boolean;
  includeEmptyFields: boolean;
  pageBreaksBetweenSections: boolean;
  showSectionNumbers: boolean;
  customHeader: string;
  customFooter: string;
  logoUrl?: string;
  primaryColor: string;
  fontSize: number;
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export const PDFPreview: React.FC<PDFPreviewProps> = ({
  droppedControls,
  sections,
  currentTier,
  formValues = {},
  onFormValueChange = () => {}
}) => {
  const [config, setConfig] = useState<PDFConfig>({
    template: 'professional',
    includeValues: true,
    includeEmptyFields: false,
    pageBreaksBetweenSections: true,
    showSectionNumbers: true,
    customHeader: 'Form Response',
    customFooter: 'Generated by Jumbo Studio',
    primaryColor: '#3b82f6',
    fontSize: 12,
    margins: { top: 40, right: 40, bottom: 40, left: 40 }
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string>('');
  const previewRef = useRef<HTMLDivElement>(null);

  const availableTemplates = getAvailableTemplates(currentTier);

  const handleLogoUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setLogoFile(file);
      const url = URL.createObjectURL(file);
      setLogoUrl(url);
      setConfig(prev => ({ ...prev, logoUrl: url }));
    }
  }, []);

  const generatePDF = useCallback(async () => {
    if (!previewRef.current || droppedControls.length === 0) return;

    setIsGenerating(true);
    
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      
      const ratio = Math.min(
        (pdfWidth - config.margins.left - config.margins.right) / canvasWidth,
        (pdfHeight - config.margins.top - config.margins.bottom) / canvasHeight
      );
      
      const imgWidth = canvasWidth * ratio;
      const imgHeight = canvasHeight * ratio;
      
      // Add header
      if (config.customHeader) {
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text(config.customHeader, config.margins.left, 20);
        
        // Add generation date
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Generated on ${new Date().toLocaleDateString()}`, pdfWidth - config.margins.right, 20, { align: 'right' });
      }
      
      // Add logo if provided
      if (logoUrl) {
        try {
          pdf.addImage(logoUrl, 'JPEG', pdfWidth - config.margins.right - 30, 5, 25, 15);
        } catch (error) {
          console.warn('Could not add logo to PDF:', error);
        }
      }
      
      // Add main content
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', config.margins.left, config.margins.top, imgWidth, imgHeight);
      
      // Add footer
      if (config.customFooter) {
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.text(config.customFooter, config.margins.left, pdfHeight - 10);
        pdf.text(`Page 1`, pdfWidth - config.margins.right, pdfHeight - 10, { align: 'right' });
      }
      
      // Download the PDF
      const fileName = `form-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [config, droppedControls, logoUrl]);

  const renderFormContent = () => {
    const controlsBySection = sections.length > 0 
      ? sections.reduce((acc, section) => {
          acc[section.id] = droppedControls.filter(c => c.sectionId === section.id);
          return acc;
        }, {} as Record<string, DroppedControl[]>)
      : { 'default': droppedControls };

    return (
      <div className="space-y-8">
        {Object.entries(controlsBySection).map(([sectionId, controls]) => {
          const section = sections.find(s => s.id === sectionId);
          
          if (controls.length === 0) return null;
          
          return (
            <div key={sectionId} className="space-y-4">
              {section && (
                <div className="border-b border-slate-200 pb-2">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center space-x-2">
                    {config.showSectionNumbers && (
                      <span 
                        className="w-6 h-6 rounded-full text-white text-sm flex items-center justify-center"
                        style={{ backgroundColor: section.color }}
                      >
                        {sections.indexOf(section) + 1}
                      </span>
                    )}
                    <span>{section.name}</span>
                  </h3>
                  {section.description && (
                    <p className="text-sm text-slate-600 mt-1">{section.description}</p>
                  )}
                </div>
              )}
              
              <div className="grid gap-4">
                {controls
                  .sort((a, b) => a.y - b.y || a.x - b.x)
                  .map(control => {
                    const value = formValues[control.id];
                    const hasValue = value !== undefined && value !== null && value !== '';
                    
                    // Skip empty fields if configured
                    if (!config.includeEmptyFields && !hasValue) return null;
                    
                    return (
                      <div key={control.id} className="border-l-2 border-slate-200 pl-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <Label className="text-sm font-medium text-slate-700">
                              {control.properties.label || control.name}
                              {control.properties.required && (
                                <span className="text-red-500 ml-1">*</span>
                              )}
                            </Label>
                            
                            {config.includeValues && hasValue && (
                              <div className="mt-1 text-sm text-slate-900">
                                {Array.isArray(value) ? value.join(', ') : value.toString()}
                              </div>
                            )}
                            
                            {!hasValue && config.includeEmptyFields && (
                              <div className="mt-1 text-sm text-slate-400 italic">
                                [Not filled]
                              </div>
                            )}
                            
                            {control.properties.helpText && (
                              <p className="text-xs text-slate-500 mt-1">
                                {control.properties.helpText}
                              </p>
                            )}
                          </div>
                          
                          <Badge variant="outline" className="ml-2 text-xs">
                            {control.type}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (droppedControls.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="h-10 w-10 text-slate-400 dark:text-slate-500" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
            No Form Content Available
          </h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Add some form controls in the Design tab to generate a PDF preview.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex bg-slate-50 dark:bg-slate-900">
      
      {/* Configuration Panel */}
      <div className="w-80 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <Settings className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">PDF Settings</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">Configure your PDF export</p>
            </div>
          </div>
        </div>
        
        <ScrollArea className="h-[calc(100%-88px)] p-4">
          <div className="space-y-6">
            
            {/* Template Selection */}
            <div>
              <Label className="text-sm font-medium">PDF Template</Label>
              <Select value={config.template} onValueChange={(value) => setConfig(prev => ({ ...prev, template: value }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableTemplates.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Logo Upload */}
            <div>
              <Label className="text-sm font-medium">Company Logo</Label>
              <div className="mt-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('logo-upload')?.click()}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Logo
                  </Button>
                </div>
                {logoUrl && (
                  <div className="mt-2">
                    <img src={logoUrl} alt="Logo preview" className="h-12 object-contain" />
                  </div>
                )}
              </div>
            </div>
            
            {/* Header & Footer */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="header" className="text-sm font-medium">Custom Header</Label>
                <Input
                  id="header"
                  value={config.customHeader}
                  onChange={(e) => setConfig(prev => ({ ...prev, customHeader: e.target.value }))}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="footer" className="text-sm font-medium">Custom Footer</Label>
                <Input
                  id="footer"
                  value={config.customFooter}
                  onChange={(e) => setConfig(prev => ({ ...prev, customFooter: e.target.value }))}
                  className="mt-1"
                />
              </div>
            </div>
            
            {/* Content Options */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Switch
                  checked={config.includeValues}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, includeValues: checked }))}
                />
                <Label className="text-sm">Include Form Values</Label>
              </div>
              
              <div className="flex items-center space-x-3">
                <Switch
                  checked={config.includeEmptyFields}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, includeEmptyFields: checked }))}
                />
                <Label className="text-sm">Show Empty Fields</Label>
              </div>
              
              <div className="flex items-center space-x-3">
                <Switch
                  checked={config.pageBreaksBetweenSections}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, pageBreaksBetweenSections: checked }))}
                />
                <Label className="text-sm">Page Breaks Between Sections</Label>
              </div>
              
              <div className="flex items-center space-x-3">
                <Switch
                  checked={config.showSectionNumbers}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, showSectionNumbers: checked }))}
                />
                <Label className="text-sm">Show Section Numbers</Label>
              </div>
            </div>
            
            {/* Color Customization */}
            <div>
              <Label htmlFor="primary-color" className="text-sm font-medium">Primary Color</Label>
              <div className="flex items-center space-x-2 mt-1">
                <input
                  type="color"
                  value={config.primaryColor}
                  onChange={(e) => setConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                  className="w-10 h-10 rounded border border-slate-300"
                />
                <Input
                  value={config.primaryColor}
                  onChange={(e) => setConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                  className="font-mono"
                />
              </div>
            </div>
            
            {/* Generate Button */}
            <Button 
              onClick={generatePDF} 
              disabled={isGenerating || droppedControls.length === 0}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </>
              )}
            </Button>
          </div>
        </ScrollArea>
      </div>
      
      {/* Preview Area */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-8">
          <div 
            ref={previewRef}
            className="bg-white shadow-lg rounded-lg p-8 min-h-[800px]"
            style={{ fontSize: `${config.fontSize}px` }}
          >
            {/* PDF Header */}
            <div className="flex items-start justify-between mb-8 pb-4 border-b-2 border-slate-200">
              <div>
                <h1 className="text-2xl font-bold text-slate-900" style={{ color: config.primaryColor }}>
                  {config.customHeader}
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                  Generated on {new Date().toLocaleDateString()}
                </p>
              </div>
              {logoUrl && (
                <img src={logoUrl} alt="Company Logo" className="h-16 object-contain" />
              )}
            </div>
            
            {/* Form Content */}
            {renderFormContent()}
            
            {/* PDF Footer */}
            {config.customFooter && (
              <div className="mt-8 pt-4 border-t border-slate-200 text-center">
                <p className="text-xs text-slate-500">{config.customFooter}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
```

Create comprehensive preview mode with form testing capabilities and professional PDF generation with customizable templates, branding, and export options.
```