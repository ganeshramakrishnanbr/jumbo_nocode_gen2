# 06 - Properties Panel and Validation System

This prompt creates the comprehensive properties panel with validation rules and control configuration.

## Visual Design Requirements

### Properties Panel Layout
- **Panel Width**: 320px fixed width on the right side
- **Section Organization**: Collapsible sections with clear visual hierarchy
- **Form Controls**: Consistent styling with main application
- **Save Indication**: Visual feedback for property changes
- **Validation Feedback**: Inline validation with error states

### Property Categories
- **Basic Properties**: Label, placeholder, help text, required state
- **Validation Rules**: Pattern matching, min/max values, character limits
- **Appearance**: Layout options, styling preferences
- **Behavior**: Conditional logic, dependencies, default values
- **Advanced**: Custom properties specific to control types

## AI Prompt

```
Create a comprehensive properties panel with validation system using the following exact specifications:

VISUAL DESIGN STANDARDS:

Panel Styling:
- Width: 320px fixed with border-left #e2e8f0 (slate-200)
- Background: White (light) / #1e293b (dark)
- Sections: Collapsible with 16px padding, 8px gap between sections
- Headers: 16px font-semibold with section icons
- Form fields: Consistent with main application styling

Property Groups:
- Basic: Eye icon, blue-600 color
- Validation: Shield icon, emerald-600 color  
- Appearance: Palette icon, purple-600 color
- Behavior: Settings icon, amber-600 color
- Advanced: Code icon, red-600 color

PROPERTIES PANEL COMPONENT (client/src/components/PropertiesPanel.tsx):
```typescript
import React, { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

import { 
  Settings, Palette, Eye, Code, Shield, ChevronDown, 
  Plus, Trash2, Copy, AlertCircle, CheckCircle2,
  Move, RotateCcw
} from 'lucide-react';

import type { DroppedControl, Section } from '@shared/types';

interface PropertiesPanelProps {
  selectedControl: DroppedControl | null;
  onUpdateControl: (id: string, updates: Partial<DroppedControl>) => void;
  sections: Section[];
  droppedControls: DroppedControl[];
}

interface PropertySectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  color?: string;
}

const PropertySection: React.FC<PropertySectionProps> = ({ 
  title, icon, children, defaultOpen = true, color = '#3b82f6' 
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-150"
        >
          <div className="flex items-center space-x-2">
            <div 
              className="w-5 h-5 rounded flex items-center justify-center"
              style={{ backgroundColor: `${color}20`, color }}
            >
              {icon}
            </div>
            <span className="font-medium text-slate-900 dark:text-slate-100">{title}</span>
          </div>
          <ChevronDown 
            className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-2 space-y-4 px-3 pb-4">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedControl,
  onUpdateControl,
  sections,
  droppedControls
}) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const updateProperty = useCallback((key: string, value: any) => {
    if (!selectedControl) return;
    
    onUpdateControl(selectedControl.id, {
      properties: {
        ...selectedControl.properties,
        [key]: value
      }
    });
    setHasUnsavedChanges(true);
    
    // Auto-save after 1 second
    setTimeout(() => setHasUnsavedChanges(false), 1000);
  }, [selectedControl, onUpdateControl]);

  const updateControlMeta = useCallback((updates: Partial<DroppedControl>) => {
    if (!selectedControl) return;
    
    onUpdateControl(selectedControl.id, updates);
    setHasUnsavedChanges(true);
    setTimeout(() => setHasUnsavedChanges(false), 1000);
  }, [selectedControl, onUpdateControl]);

  const addOption = useCallback(() => {
    if (!selectedControl) return;
    
    const currentOptions = selectedControl.properties.options || [];
    const newOption = {
      label: `Option ${currentOptions.length + 1}`,
      value: `option_${currentOptions.length + 1}`
    };
    
    updateProperty('options', [...currentOptions, newOption]);
  }, [selectedControl, updateProperty]);

  const updateOption = useCallback((index: number, field: 'label' | 'value', value: string) => {
    if (!selectedControl) return;
    
    const currentOptions = [...(selectedControl.properties.options || [])];
    currentOptions[index] = { ...currentOptions[index], [field]: value };
    
    updateProperty('options', currentOptions);
  }, [selectedControl, updateProperty]);

  const removeOption = useCallback((index: number) => {
    if (!selectedControl) return;
    
    const currentOptions = selectedControl.properties.options || [];
    const newOptions = currentOptions.filter((_: any, i: number) => i !== index);
    
    updateProperty('options', newOptions);
  }, [selectedControl, updateProperty]);

  const resetToDefaults = useCallback(() => {
    if (!selectedControl) return;
    
    // Get default properties for this control type
    const { getControlByType } = require('@/data/controls');
    const controlDefinition = getControlByType(selectedControl.type);
    
    if (controlDefinition) {
      onUpdateControl(selectedControl.id, {
        properties: { ...controlDefinition.defaultProperties }
      });
    }
  }, [selectedControl, onUpdateControl]);

  if (!selectedControl) {
    return (
      <div className="w-80 bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 flex flex-col shadow-sm">
        <div className="p-6 flex-1 flex items-center justify-center">
          <div className="text-center text-slate-500 dark:text-slate-400">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="h-8 w-8 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-lg font-medium mb-2 text-slate-900 dark:text-slate-100">
              No Control Selected
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              Select a control from the design canvas to edit its properties, configure validation rules, and customize its behavior.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const controlSupportsOptions = ['select', 'multiselect', 'radio', 'checkbox'].includes(selectedControl.type);
  const controlSupportsValidation = ['text', 'textarea', 'number', 'email', 'url', 'password'].includes(selectedControl.type);

  return (
    <div className="w-80 bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 flex flex-col shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-md flex items-center justify-center">
              <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">Properties</h3>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {selectedControl.type}
                </Badge>
                {hasUnsavedChanges && (
                  <div className="flex items-center space-x-1 text-xs text-amber-600 dark:text-amber-400">
                    <AlertCircle className="h-3 w-3" />
                    <span>Saving...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={resetToDefaults}
            className="h-8 w-8 p-0"
            title="Reset to defaults"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="text-xs text-slate-600 dark:text-slate-400 truncate">
          ID: {selectedControl.id}
        </div>
      </div>

      <ScrollArea className="flex-1 bg-white dark:bg-slate-800">
        <div className="p-4 space-y-4">
          
          {/* Basic Properties */}
          <PropertySection 
            title="Basic Properties" 
            icon={<Eye className="h-4 w-4" />}
            color="#3b82f6"
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="control-name" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Control Name
                </Label>
                <Input
                  id="control-name"
                  value={selectedControl.name}
                  onChange={(e) => updateControlMeta({ name: e.target.value })}
                  placeholder="Enter control name"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="control-label" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Display Label
                </Label>
                <Input
                  id="control-label"
                  value={selectedControl.properties.label || ''}
                  onChange={(e) => updateProperty('label', e.target.value)}
                  placeholder="Enter label text"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="placeholder" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Placeholder Text
                </Label>
                <Input
                  id="placeholder"
                  value={selectedControl.properties.placeholder || ''}
                  onChange={(e) => updateProperty('placeholder', e.target.value)}
                  placeholder="Enter placeholder text"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="help-text" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Help Text
                </Label>
                <Textarea
                  id="help-text"
                  value={selectedControl.properties.helpText || ''}
                  onChange={(e) => updateProperty('helpText', e.target.value)}
                  placeholder="Enter help text"
                  rows={2}
                  className="mt-1"
                />
              </div>
              
              <Card className="p-3 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                <div className="flex items-center space-x-3">
                  <Switch
                    id="required"
                    checked={selectedControl.properties.required || false}
                    onCheckedChange={(checked) => updateProperty('required', checked)}
                  />
                  <div className="flex-1">
                    <Label htmlFor="required" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Required Field
                    </Label>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Users must fill this field to submit the form
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </PropertySection>

          {/* Validation Rules */}
          {controlSupportsValidation && (
            <PropertySection 
              title="Validation Rules" 
              icon={<Shield className="h-4 w-4" />}
              color="#10b981"
            >
              <div className="space-y-4">
                {(selectedControl.type === 'text' || selectedControl.type === 'textarea') && (
                  <>
                    <div>
                      <Label htmlFor="max-length" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Maximum Length
                      </Label>
                      <Input
                        id="max-length"
                        type="number"
                        value={selectedControl.properties.maxLength || ''}
                        onChange={(e) => updateProperty('maxLength', parseInt(e.target.value) || undefined)}
                        placeholder="Enter max characters"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="pattern" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Validation Pattern (Regex)
                      </Label>
                      <Input
                        id="pattern"
                        value={selectedControl.properties.pattern || ''}
                        onChange={(e) => updateProperty('pattern', e.target.value)}
                        placeholder="Enter regex pattern"
                        className="mt-1 font-mono text-sm"
                      />
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Regular expression for custom validation
                      </p>
                    </div>
                  </>
                )}
                
                {selectedControl.type === 'number' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="min-value" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Minimum Value
                      </Label>
                      <Input
                        id="min-value"
                        type="number"
                        value={selectedControl.properties.min || ''}
                        onChange={(e) => updateProperty('min', parseFloat(e.target.value) || undefined)}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="max-value" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Maximum Value
                      </Label>
                      <Input
                        id="max-value"
                        type="number"
                        value={selectedControl.properties.max || ''}
                        onChange={(e) => updateProperty('max', parseFloat(e.target.value) || undefined)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}
                
                {selectedControl.type === 'password' && (
                  <div>
                    <Label htmlFor="min-length" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Minimum Length
                    </Label>
                    <Input
                      id="min-length"
                      type="number"
                      value={selectedControl.properties.minLength || ''}
                      onChange={(e) => updateProperty('minLength', parseInt(e.target.value) || undefined)}
                      placeholder="8"
                      className="mt-1"
                    />
                  </div>
                )}
              </div>
            </PropertySection>
          )}

          {/* Options Configuration */}
          {controlSupportsOptions && (
            <PropertySection 
              title="Options Configuration" 
              icon={<Code className="h-4 w-4" />}
              color="#8b5cf6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Available Options
                  </Label>
                  <Button onClick={addOption} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Option
                  </Button>
                </div>
                
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {(selectedControl.properties.options || []).map((option: any, index: number) => (
                    <Card key={index} className="p-3 border-slate-200 dark:border-slate-700">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Input
                            value={option.label}
                            onChange={(e) => updateOption(index, 'label', e.target.value)}
                            placeholder="Option label"
                            className="flex-1 text-sm"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeOption(index)}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <Input
                          value={option.value}
                          onChange={(e) => updateOption(index, 'value', e.target.value)}
                          placeholder="Option value"
                          className="text-sm font-mono"
                        />
                      </div>
                    </Card>
                  ))}
                </div>
                
                {selectedControl.type === 'radio' || selectedControl.type === 'checkbox' ? (
                  <div>
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Layout
                    </Label>
                    <Select
                      value={selectedControl.properties.layout || 'vertical'}
                      onValueChange={(value) => updateProperty('layout', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vertical">Vertical</SelectItem>
                        <SelectItem value="horizontal">Horizontal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ) : null}
              </div>
            </PropertySection>
          )}

          {/* Layout Properties */}
          <PropertySection 
            title="Layout & Position" 
            icon={<Move className="h-4 w-4" />}
            color="#f59e0b"
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="section" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Section
                </Label>
                <Select
                  value={selectedControl.sectionId || ''}
                  onValueChange={(value) => updateControlMeta({ sectionId: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map(section => (
                      <SelectItem key={section.id} value={section.id}>
                        {section.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="width" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Width (1-12)
                  </Label>
                  <Input
                    id="width"
                    type="number"
                    min="1"
                    max="12"
                    value={selectedControl.width}
                    onChange={(e) => updateControlMeta({ width: parseInt(e.target.value) || 12 })}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="height" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Height
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    min="1"
                    value={selectedControl.height}
                    onChange={(e) => updateControlMeta({ height: parseInt(e.target.value) || 1 })}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </PropertySection>
        </div>
      </ScrollArea>
    </div>
  );
};
```

VALIDATION HELPER FUNCTIONS (client/src/lib/validation.ts):
```typescript
import type { DroppedControl } from '@shared/types';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateControl = (control: DroppedControl, value: any): ValidationResult => {
  const errors: string[] = [];
  const label = control.properties.label || control.name;
  
  // Required validation
  if (control.properties.required) {
    if (value === null || value === undefined || value === '') {
      errors.push(`${label} is required`);
    }
    
    if (Array.isArray(value) && value.length === 0) {
      errors.push(`${label} requires at least one selection`);
    }
  }
  
  // Skip other validations if value is empty and not required
  if (!value && !control.properties.required) {
    return { isValid: true, errors: [] };
  }
  
  // Type-specific validation
  switch (control.type) {
    case 'text':
    case 'textarea':
      if (typeof value === 'string') {
        if (control.properties.maxLength && value.length > control.properties.maxLength) {
          errors.push(`${label} must be ${control.properties.maxLength} characters or less`);
        }
        
        if (control.properties.pattern && !new RegExp(control.properties.pattern).test(value)) {
          errors.push(`${label} format is invalid`);
        }
      }
      break;
      
    case 'email':
      if (value && typeof value === 'string') {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.push(`${label} must be a valid email address`);
        }
      }
      break;
      
    case 'number':
      if (value !== null && value !== undefined) {
        const numValue = Number(value);
        if (isNaN(numValue)) {
          errors.push(`${label} must be a number`);
        } else {
          if (control.properties.min !== undefined && numValue < control.properties.min) {
            errors.push(`${label} must be at least ${control.properties.min}`);
          }
          if (control.properties.max !== undefined && numValue > control.properties.max) {
            errors.push(`${label} must be at most ${control.properties.max}`);
          }
        }
      }
      break;
      
    case 'url':
      if (value && typeof value === 'string') {
        if (!/^https?:\/\/.+/.test(value)) {
          errors.push(`${label} must be a valid URL starting with http:// or https://`);
        }
      }
      break;
      
    case 'password':
      if (value && typeof value === 'string') {
        if (control.properties.minLength && value.length < control.properties.minLength) {
          errors.push(`${label} must be at least ${control.properties.minLength} characters long`);
        }
      }
      break;
      
    case 'multiselect':
    case 'checkbox':
      if (Array.isArray(value) && control.properties.maxSelections) {
        if (value.length > control.properties.maxSelections) {
          errors.push(`${label} allows maximum ${control.properties.maxSelections} selections`);
        }
      }
      break;
      
    case 'file':
    case 'image':
      if (value && value.size && control.properties.maxSize) {
        if (value.size > control.properties.maxSize) {
          const maxSizeMB = (control.properties.maxSize / 1024 / 1024).toFixed(1);
          errors.push(`${label} file size must be less than ${maxSizeMB}MB`);
        }
      }
      break;
      
    case 'tags':
      if (Array.isArray(value) && control.properties.maxTags) {
        if (value.length > control.properties.maxTags) {
          errors.push(`${label} allows maximum ${control.properties.maxTags} tags`);
        }
      }
      break;
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateForm = (controls: DroppedControl[], formValues: Record<string, any>): {
  isValid: boolean;
  errors: Record<string, string[]>;
  summary: {
    totalControls: number;
    validatedControls: number;
    errorCount: number;
  };
} => {
  const errors: Record<string, string[]> = {};
  let errorCount = 0;
  let validatedControls = 0;
  
  controls.forEach(control => {
    const value = formValues[control.id];
    const validation = validateControl(control, value);
    
    if (!validation.isValid) {
      errors[control.id] = validation.errors;
      errorCount += validation.errors.length;
    }
    
    validatedControls++;
  });
  
  return {
    isValid: errorCount === 0,
    errors,
    summary: {
      totalControls: controls.length,
      validatedControls,
      errorCount
    }
  };
};

// Real-time validation hook
export const useControlValidation = (control: DroppedControl, value: any) => {
  const [validation, setValidation] = React.useState<ValidationResult>({ isValid: true, errors: [] });
  
  React.useEffect(() => {
    const result = validateControl(control, value);
    setValidation(result);
  }, [control, value]);
  
  return validation;
};
```

Create a comprehensive properties panel with validation system, organized sections, and intuitive property management for all form control types.
```