# 05 - Complete Form Control System (20+ Types)

This prompt creates a comprehensive form control system with all control types and proper rendering.

## Visual Design Requirements

### Form Control Styling
- **Input Fields**: 6px border radius, 1px border, 10px padding
- **Focus States**: 2px blue ring with 2px offset for accessibility
- **Error States**: Red border (#ef4444) with red ring focus
- **Disabled States**: Gray background with reduced opacity
- **Validation Icons**: Inline icons for validation feedback

### Control Categories
- **Core Input**: Text, textarea, number, email, password, URL
- **Date & Time**: Date picker, time picker, datetime picker
- **Selection**: Dropdown, radio, checkbox, multi-select
- **Advanced**: File upload, rating, slider, toggle, color picker
- **Layout**: Section divider, HTML content, progress indicator

## AI Prompt

```
Create a comprehensive form control system with 20+ control types and the following exact visual specifications:

VISUAL DESIGN STANDARDS:

Input Styling:
- Border radius: 6px for modern appearance
- Border: 1px solid #d1d5db (gray-300) default, #3b82f6 (blue-500) focus
- Padding: 10px horizontal, 8px vertical for optimal touch targets
- Font size: 14px for readability across devices
- Focus ring: 2px #3b82f6 with 2px offset for accessibility

Validation States:
- Error: Border #ef4444 (red-500), ring #ef4444, error text below
- Success: Border #10b981 (emerald-500), ring #10b981, success icon
- Warning: Border #f59e0b (amber-500), ring #f59e0b, warning icon

CONTROL DEFINITIONS (client/src/data/controls.ts):
```typescript
import { 
  Type, AlignLeft, Hash, Mail, Lock, Link, Calendar, Clock, 
  CalendarDays, ChevronDown, CheckSquare, RadioButton, ToggleLeft,
  Upload, Image, Star, Sliders, Palette, Tags, Grid3x3, 
  Minus, FileText, BarChart3, Eye, EyeOff
} from 'lucide-react';

export interface ControlCategory {
  name: string;
  icon: any;
  description: string;
  color: string;
}

export interface ControlType {
  type: string;
  name: string;
  category: string;
  icon: any;
  description: string;
  defaultProperties: Record<string, any>;
  validation?: {
    required?: boolean;
    pattern?: string;
    min?: number;
    max?: number;
    maxLength?: number;
  };
}

export const CONTROL_CATEGORIES: ControlCategory[] = [
  {
    name: 'Core Input',
    icon: Type,
    description: 'Basic text and numeric input controls',
    color: '#3b82f6'
  },
  {
    name: 'Date & Time',
    icon: Calendar,
    description: 'Date, time, and datetime controls',
    color: '#10b981'
  },
  {
    name: 'Selection Controls',
    icon: CheckSquare,
    description: 'Dropdown, radio, checkbox selections',
    color: '#f59e0b'
  },
  {
    name: 'File Upload',
    icon: Upload,
    description: 'File and image upload controls',
    color: '#ef4444'
  },
  {
    name: 'Advanced',
    icon: Sliders,
    description: 'Advanced input and interactive controls',
    color: '#8b5cf6'
  },
  {
    name: 'Layout & Display',
    icon: Grid3x3,
    description: 'Layout helpers and display elements',
    color: '#06b6d4'
  }
];

export const CONTROLS: ControlType[] = [
  // Core Input Controls
  {
    type: 'text',
    name: 'Text Box',
    category: 'Core Input',
    icon: Type,
    description: 'Single-line text input field',
    defaultProperties: {
      label: 'Text Input',
      placeholder: 'Enter text...',
      required: false,
      maxLength: 255,
      pattern: '',
      helpText: ''
    },
    validation: {
      maxLength: 255
    }
  },
  {
    type: 'textarea',
    name: 'Multi-line Text',
    category: 'Core Input',
    icon: AlignLeft,
    description: 'Multi-line text area for longer content',
    defaultProperties: {
      label: 'Text Area',
      placeholder: 'Enter your text...',
      required: false,
      rows: 4,
      maxLength: 2000,
      helpText: ''
    },
    validation: {
      maxLength: 2000
    }
  },
  {
    type: 'number',
    name: 'Number Input',
    category: 'Core Input',
    icon: Hash,
    description: 'Numeric input with validation',
    defaultProperties: {
      label: 'Number',
      placeholder: '0',
      required: false,
      min: 0,
      max: 100,
      step: 1,
      helpText: ''
    },
    validation: {
      min: 0,
      max: 100
    }
  },
  {
    type: 'email',
    name: 'Email Input',
    category: 'Core Input',
    icon: Mail,
    description: 'Email address input with validation',
    defaultProperties: {
      label: 'Email Address',
      placeholder: 'your@email.com',
      required: false,
      helpText: ''
    },
    validation: {
      pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$'
    }
  },
  {
    type: 'password',
    name: 'Password Input',
    category: 'Core Input',
    icon: Lock,
    description: 'Password input with toggle visibility',
    defaultProperties: {
      label: 'Password',
      placeholder: 'Enter password...',
      required: false,
      showToggle: true,
      minLength: 8,
      helpText: ''
    },
    validation: {
      min: 8
    }
  },
  {
    type: 'url',
    name: 'URL Input',
    category: 'Core Input',
    icon: Link,
    description: 'URL input with validation',
    defaultProperties: {
      label: 'Website URL',
      placeholder: 'https://example.com',
      required: false,
      helpText: ''
    },
    validation: {
      pattern: '^https?:\\/\\/.+'
    }
  },

  // Date & Time Controls
  {
    type: 'date',
    name: 'Date Picker',
    category: 'Date & Time',
    icon: Calendar,
    description: 'Date selection with calendar widget',
    defaultProperties: {
      label: 'Select Date',
      placeholder: 'Pick a date',
      required: false,
      format: 'yyyy-MM-dd',
      helpText: ''
    }
  },
  {
    type: 'time',
    name: 'Time Picker',
    category: 'Date & Time',
    icon: Clock,
    description: 'Time selection input',
    defaultProperties: {
      label: 'Select Time',
      placeholder: 'Pick a time',
      required: false,
      format: '24h',
      helpText: ''
    }
  },
  {
    type: 'datetime',
    name: 'DateTime Picker',
    category: 'Date & Time',
    icon: CalendarDays,
    description: 'Combined date and time selection',
    defaultProperties: {
      label: 'Select Date & Time',
      placeholder: 'Pick date and time',
      required: false,
      helpText: ''
    }
  },

  // Selection Controls
  {
    type: 'select',
    name: 'Dropdown',
    category: 'Selection Controls',
    icon: ChevronDown,
    description: 'Single selection dropdown menu',
    defaultProperties: {
      label: 'Select Option',
      placeholder: 'Choose an option',
      required: false,
      options: [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' }
      ],
      helpText: ''
    }
  },
  {
    type: 'multiselect',
    name: 'Multi-Select',
    category: 'Selection Controls',
    icon: CheckSquare,
    description: 'Multiple selection dropdown',
    defaultProperties: {
      label: 'Select Multiple',
      placeholder: 'Choose options',
      required: false,
      maxSelections: 5,
      options: [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' }
      ],
      helpText: ''
    }
  },
  {
    type: 'radio',
    name: 'Radio Group',
    category: 'Selection Controls',
    icon: RadioButton,
    description: 'Single selection radio buttons',
    defaultProperties: {
      label: 'Choose One',
      required: false,
      layout: 'vertical',
      options: [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' }
      ],
      helpText: ''
    }
  },
  {
    type: 'checkbox',
    name: 'Checkbox Group',
    category: 'Selection Controls',
    icon: CheckSquare,
    description: 'Multiple selection checkboxes',
    defaultProperties: {
      label: 'Select All That Apply',
      required: false,
      layout: 'vertical',
      maxSelections: 0, // 0 = unlimited
      options: [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' }
      ],
      helpText: ''
    }
  },

  // File Upload Controls
  {
    type: 'file',
    name: 'File Upload',
    category: 'File Upload',
    icon: Upload,
    description: 'Single or multiple file upload',
    defaultProperties: {
      label: 'Upload File',
      placeholder: 'Click to upload or drag and drop',
      required: false,
      multiple: false,
      acceptedTypes: '',
      maxSize: 10485760, // 10MB
      helpText: ''
    }
  },
  {
    type: 'image',
    name: 'Image Upload',
    category: 'File Upload',
    icon: Image,
    description: 'Image upload with preview',
    defaultProperties: {
      label: 'Upload Image',
      placeholder: 'Click to upload image',
      required: false,
      multiple: false,
      acceptedTypes: 'image/*',
      maxSize: 5242880, // 5MB
      showPreview: true,
      helpText: ''
    }
  },

  // Advanced Controls
  {
    type: 'rating',
    name: 'Rating Control',
    category: 'Advanced',
    icon: Star,
    description: 'Star rating input',
    defaultProperties: {
      label: 'Rate This',
      required: false,
      maxRating: 5,
      allowHalf: false,
      icon: 'star',
      helpText: ''
    }
  },
  {
    type: 'slider',
    name: 'Slider',
    category: 'Advanced',
    icon: Sliders,
    description: 'Range slider input',
    defaultProperties: {
      label: 'Select Value',
      required: false,
      min: 0,
      max: 100,
      step: 1,
      defaultValue: 50,
      showValue: true,
      helpText: ''
    },
    validation: {
      min: 0,
      max: 100
    }
  },
  {
    type: 'toggle',
    name: 'Toggle Switch',
    category: 'Advanced',
    icon: ToggleLeft,
    description: 'Boolean toggle switch',
    defaultProperties: {
      label: 'Enable Option',
      required: false,
      defaultValue: false,
      onLabel: 'Yes',
      offLabel: 'No',
      helpText: ''
    }
  },
  {
    type: 'color',
    name: 'Color Picker',
    category: 'Advanced',
    icon: Palette,
    description: 'Color selection input',
    defaultProperties: {
      label: 'Select Color',
      required: false,
      defaultValue: '#3b82f6',
      format: 'hex',
      helpText: ''
    }
  },
  {
    type: 'tags',
    name: 'Tag Input',
    category: 'Advanced',
    icon: Tags,
    description: 'Dynamic tag creation and selection',
    defaultProperties: {
      label: 'Add Tags',
      placeholder: 'Type and press Enter',
      required: false,
      maxTags: 10,
      suggestions: [],
      helpText: ''
    }
  },

  // Layout & Display Controls
  {
    type: 'matrix',
    name: 'Grid Matrix',
    category: 'Layout & Display',
    icon: Grid3x3,
    description: 'Question matrix with rating scales',
    defaultProperties: {
      label: 'Rate the Following',
      required: false,
      questions: [
        'Question 1',
        'Question 2',
        'Question 3'
      ],
      scale: [
        { label: 'Poor', value: '1' },
        { label: 'Good', value: '2' },
        { label: 'Excellent', value: '3' }
      ],
      helpText: ''
    }
  },
  {
    type: 'divider',
    name: 'Section Divider',
    category: 'Layout & Display',
    icon: Minus,
    description: 'Visual separator between sections',
    defaultProperties: {
      label: 'Section Break',
      style: 'line',
      thickness: 1,
      color: '#e5e7eb',
      helpText: ''
    }
  },
  {
    type: 'html',
    name: 'HTML Content',
    category: 'Layout & Display',
    icon: FileText,
    description: 'Rich text and HTML content display',
    defaultProperties: {
      label: 'Content Block',
      content: '<p>Enter your HTML content here...</p>',
      allowHtml: true,
      helpText: ''
    }
  },
  {
    type: 'progress',
    name: 'Progress Indicator',
    category: 'Layout & Display',
    icon: BarChart3,
    description: 'Form completion progress display',
    defaultProperties: {
      label: 'Form Progress',
      showPercentage: true,
      showSteps: true,
      style: 'bar',
      helpText: ''
    }
  }
];

// Helper function to get controls by category
export const getControlsByCategory = (category: string): ControlType[] => {
  return CONTROLS.filter(control => control.category === category);
};

// Helper function to get control by type
export const getControlByType = (type: string): ControlType | undefined => {
  return CONTROLS.find(control => control.type === type);
};
```

CONTROL RENDERING COMPONENT (client/src/components/DroppedControlComponent.tsx):
```typescript
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

import { 
  Calendar as CalendarIcon, Upload, Star, Eye, EyeOff, 
  ArrowUp, ArrowDown, Trash2, Copy, CheckCircle, XCircle,
  Clock, Palette
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

import type { DroppedControl } from '@shared/types';

interface DroppedControlComponentProps {
  control: DroppedControl;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<DroppedControl>) => void;
  onMove?: (id: string, direction: 'up' | 'down') => void;
  onRemove?: (id: string) => void;
  isInPreviewMode?: boolean;
  value?: any;
  onChange?: (value: any) => void;
  validationError?: string;
}

export const DroppedControlComponent: React.FC<DroppedControlComponentProps> = ({
  control,
  isSelected,
  onSelect,
  onUpdate,
  onMove,
  onRemove,
  isInPreviewMode = false,
  value,
  onChange,
  validationError
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>('');

  const handleValueChange = (newValue: any) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  const getInputClassName = (baseClass: string = '') => {
    return cn(
      baseClass,
      'transition-all duration-200',
      validationError 
        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
        : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500',
      isSelected && !isInPreviewMode && !validationError ? 'ring-2 ring-blue-500 ring-offset-2' : ''
    );
  };

  const renderControl = () => {
    switch (control.type) {
      case 'text':
        return (
          <Input
            type="text"
            placeholder={control.properties.placeholder}
            value={value || ''}
            onChange={(e) => handleValueChange(e.target.value)}
            disabled={!isInPreviewMode}
            maxLength={control.properties.maxLength}
            className={getInputClassName()}
          />
        );

      case 'textarea':
        return (
          <Textarea
            placeholder={control.properties.placeholder}
            value={value || ''}
            onChange={(e) => handleValueChange(e.target.value)}
            disabled={!isInPreviewMode}
            rows={control.properties.rows || 4}
            maxLength={control.properties.maxLength}
            className={getInputClassName('resize-none')}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            placeholder={control.properties.placeholder}
            value={value || ''}
            onChange={(e) => handleValueChange(Number(e.target.value))}
            disabled={!isInPreviewMode}
            min={control.properties.min}
            max={control.properties.max}
            step={control.properties.step}
            className={getInputClassName()}
          />
        );

      case 'email':
        return (
          <div className="relative">
            <Input
              type="email"
              placeholder={control.properties.placeholder}
              value={value || ''}
              onChange={(e) => handleValueChange(e.target.value)}
              disabled={!isInPreviewMode}
              className={getInputClassName('pr-10')}
            />
            {isInPreviewMode && value && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
            )}
          </div>
        );

      case 'password':
        return (
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder={control.properties.placeholder}
              value={value || ''}
              onChange={(e) => handleValueChange(e.target.value)}
              disabled={!isInPreviewMode}
              className={getInputClassName('pr-10')}
            />
            {control.properties.showToggle && isInPreviewMode && (
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            )}
          </div>
        );

      case 'url':
        return (
          <Input
            type="url"
            placeholder={control.properties.placeholder}
            value={value || ''}
            onChange={(e) => handleValueChange(e.target.value)}
            disabled={!isInPreviewMode}
            className={getInputClassName()}
          />
        );

      case 'date':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !date && 'text-muted-foreground',
                  getInputClassName()
                )}
                disabled={!isInPreviewMode}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP') : control.properties.placeholder}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => {
                  setDate(newDate);
                  handleValueChange(newDate?.toISOString());
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );

      case 'time':
        return (
          <div className="relative">
            <Input
              type="time"
              value={time}
              onChange={(e) => {
                setTime(e.target.value);
                handleValueChange(e.target.value);
              }}
              disabled={!isInPreviewMode}
              className={getInputClassName('pr-10')}
            />
            <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>
        );

      case 'select':
        return (
          <Select value={value || ''} onValueChange={handleValueChange} disabled={!isInPreviewMode}>
            <SelectTrigger className={getInputClassName()}>
              <SelectValue placeholder={control.properties.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {control.properties.options?.map((option: any, index: number) => (
                <SelectItem key={index} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'radio':
        return (
          <RadioGroup
            value={value || ''}
            onValueChange={handleValueChange}
            disabled={!isInPreviewMode}
            className={cn(
              control.properties.layout === 'horizontal' ? 'flex flex-wrap gap-6' : 'space-y-3'
            )}
          >
            {control.properties.options?.map((option: any, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem 
                  value={option.value} 
                  id={`${control.id}-${index}`}
                  className="transition-colors duration-200"
                />
                <Label htmlFor={`${control.id}-${index}`} className="cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'checkbox':
        return (
          <div className={cn(
            control.properties.layout === 'horizontal' ? 'flex flex-wrap gap-6' : 'space-y-3'
          )}>
            {control.properties.options?.map((option: any, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`${control.id}-${index}`}
                  checked={(value || []).includes(option.value)}
                  onCheckedChange={(checked) => {
                    const currentValues = value || [];
                    if (checked) {
                      handleValueChange([...currentValues, option.value]);
                    } else {
                      handleValueChange(currentValues.filter((v: any) => v !== option.value));
                    }
                  }}
                  disabled={!isInPreviewMode}
                  className="transition-colors duration-200"
                />
                <Label htmlFor={`${control.id}-${index}`} className="cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        );

      case 'file':
        return (
          <div className={cn(
            'border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200',
            validationError 
              ? 'border-red-300 bg-red-50' 
              : 'border-slate-300 hover:border-slate-400 bg-slate-50',
            isSelected && !isInPreviewMode && 'ring-2 ring-blue-500 ring-offset-2'
          )}>
            <Upload className="mx-auto h-8 w-8 text-slate-400 mb-2" />
            <p className="text-sm text-slate-600 mb-1">
              {control.properties.placeholder}
            </p>
            {control.properties.acceptedTypes && (
              <p className="text-xs text-slate-500">
                Accepted: {control.properties.acceptedTypes}
              </p>
            )}
            {control.properties.maxSize && (
              <p className="text-xs text-slate-500">
                Max size: {(control.properties.maxSize / 1024 / 1024).toFixed(1)}MB
              </p>
            )}
          </div>
        );

      case 'rating':
        return (
          <div className="flex items-center space-x-1">
            {Array.from({ length: control.properties.maxRating || 5 }).map((_, index) => (
              <Star
                key={index}
                className={cn(
                  'h-6 w-6 transition-colors duration-200',
                  index < (value || 0) ? 'text-yellow-400 fill-current' : 'text-slate-300',
                  isInPreviewMode && 'cursor-pointer hover:text-yellow-300'
                )}
                onClick={() => isInPreviewMode && handleValueChange(index + 1)}
              />
            ))}
            {control.properties.showValue && value > 0 && (
              <span className="ml-2 text-sm text-slate-600">
                {value} / {control.properties.maxRating}
              </span>
            )}
          </div>
        );

      case 'slider':
        return (
          <div className="space-y-3">
            <Slider
              value={[value || control.properties.defaultValue || 0]}
              onValueChange={(newValue) => handleValueChange(newValue[0])}
              max={control.properties.max || 100}
              min={control.properties.min || 0}
              step={control.properties.step || 1}
              disabled={!isInPreviewMode}
              className="transition-opacity duration-200"
            />
            {control.properties.showValue && (
              <div className="flex justify-between text-sm text-slate-500">
                <span>{control.properties.min || 0}</span>
                <span className="font-medium text-slate-700">
                  {value || control.properties.defaultValue || 0}
                </span>
                <span>{control.properties.max || 100}</span>
              </div>
            )}
          </div>
        );

      case 'toggle':
        return (
          <div className="flex items-center space-x-3">
            <Switch
              checked={value || false}
              onCheckedChange={handleValueChange}
              disabled={!isInPreviewMode}
              className="transition-colors duration-200"
            />
            <div className="flex items-center space-x-2 text-sm">
              <span className={cn(
                'transition-colors duration-200',
                !value ? 'font-medium text-slate-700' : 'text-slate-500'
              )}>
                {control.properties.offLabel || 'Off'}
              </span>
              <span className="text-slate-400">/</span>
              <span className={cn(
                'transition-colors duration-200',
                value ? 'font-medium text-slate-700' : 'text-slate-500'
              )}>
                {control.properties.onLabel || 'On'}
              </span>
            </div>
          </div>
        );

      case 'color':
        return (
          <div className="flex items-center space-x-3">
            <div className="relative">
              <input
                type="color"
                value={value || control.properties.defaultValue || '#3b82f6'}
                onChange={(e) => handleValueChange(e.target.value)}
                disabled={!isInPreviewMode}
                className="w-12 h-10 rounded border border-slate-300 cursor-pointer disabled:cursor-not-allowed"
              />
              <Palette className="absolute -top-1 -right-1 h-3 w-3 text-slate-400" />
            </div>
            <Input
              value={value || control.properties.defaultValue || '#3b82f6'}
              onChange={(e) => handleValueChange(e.target.value)}
              disabled={!isInPreviewMode}
              className={cn('font-mono flex-1', getInputClassName())}
              placeholder="#3b82f6"
            />
          </div>
        );

      case 'tags':
        return (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {(value || []).map((tag: string, index: number) => (
                <Badge key={index} variant="secondary" className="px-2 py-1">
                  {tag}
                  {isInPreviewMode && (
                    <button
                      onClick={() => {
                        const newTags = (value || []).filter((_: any, i: number) => i !== index);
                        handleValueChange(newTags);
                      }}
                      className="ml-1 text-slate-500 hover:text-slate-700"
                    >
                      ×
                    </button>
                  )}
                </Badge>
              ))}
            </div>
            <Input
              placeholder={control.properties.placeholder}
              disabled={!isInPreviewMode}
              className={getInputClassName()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                  e.preventDefault();
                  const newTag = e.currentTarget.value.trim();
                  const currentTags = value || [];
                  if (!currentTags.includes(newTag)) {
                    handleValueChange([...currentTags, newTag]);
                  }
                  e.currentTarget.value = '';
                }
              }}
            />
          </div>
        );

      default:
        return (
          <div className="p-4 border border-dashed border-slate-300 rounded-lg bg-slate-50 text-center">
            <p className="text-sm text-slate-500">
              Control type "{control.type}" not implemented
            </p>
          </div>
        );
    }
  };

  return (
    <div
      className={cn(
        'group relative p-4 border rounded-lg transition-all duration-200 cursor-pointer',
        isSelected && !isInPreviewMode
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20 shadow-md'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-sm',
        validationError && 'border-red-300 bg-red-50 dark:bg-red-950/20'
      )}
      onClick={onSelect}
    >
      {/* Control Label */}
      {control.properties.label && (
        <Label className="block mb-2 font-medium text-slate-700 dark:text-slate-300">
          {control.properties.label}
          {control.properties.required && (
            <span className="text-red-500 ml-1">*</span>
          )}
        </Label>
      )}

      {/* Control Component */}
      {renderControl()}

      {/* Validation Error */}
      {validationError && (
        <p className="text-sm text-red-600 mt-2 flex items-center">
          <XCircle className="h-4 w-4 mr-1" />
          {validationError}
        </p>
      )}

      {/* Help Text */}
      {control.properties.helpText && !validationError && (
        <p className="text-sm text-slate-500 mt-2">
          {control.properties.helpText}
        </p>
      )}

      {/* Design Mode Controls */}
      {!isInPreviewMode && isSelected && (
        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {onMove && (
            <>
              <Button
                size="sm"
                variant="outline"
                className="h-6 w-6 p-0 bg-white shadow-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onMove(control.id, 'up');
                }}
              >
                <ArrowUp className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-6 w-6 p-0 bg-white shadow-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onMove(control.id, 'down');
                }}
              >
                <ArrowDown className="h-3 w-3" />
              </Button>
            </>
          )}
          <Button
            size="sm"
            variant="outline"
            className="h-6 w-6 p-0 bg-white shadow-sm"
            onClick={(e) => {
              e.stopPropagation();
              // Copy control functionality
            }}
          >
            <Copy className="h-3 w-3" />
          </Button>
          {onRemove && (
            <Button
              size="sm"
              variant="destructive"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(control.id);
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
```

Create a comprehensive form control system with proper validation, accessibility features, and consistent visual design across all 20+ control types.
```