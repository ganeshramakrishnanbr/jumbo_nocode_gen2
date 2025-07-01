# 04 - Drag-and-Drop Form Builder Interface

This prompt creates the comprehensive three-panel drag-and-drop form builder with professional visual design.

## Visual Design Requirements

### Three-Panel Layout
- **Control Library (Left)**: 320px fixed width, clean white background with subtle borders
- **Design Canvas (Center)**: Flexible width, light gray background (#f8fafc) with visual drop zones
- **Properties Panel (Right)**: 320px fixed width, matching left panel styling

### Drag-and-Drop Visual Feedback
- **Drag State**: 30% opacity for dragged items with subtle scale (105%)
- **Drop Zones**: Blue accent border (#3b82f6) with light blue background tint
- **Hover Effects**: Smooth color transitions and subtle shadow elevation
- **Invalid Drop**: Red border (#ef4444) with light red background tint

### Component Styling
- **Cards**: 8px border radius, subtle shadows, proper spacing
- **Controls**: Professional appearance with consistent iconography
- **Selection States**: Blue ring (2px) with proper focus indicators
- **Empty States**: Centered content with helpful guidance text

### Animations
- **Drag Transitions**: 200ms ease-out for smooth interactions
- **Hover States**: 150ms color and scale transitions
- **Layout Changes**: 300ms cubic-bezier for panel resizing

## AI Prompt

```
Create a professional three-panel drag-and-drop form builder interface with the following exact visual specifications:

VISUAL DESIGN SYSTEM:

Layout Structure:
- Left Panel (Control Library): 320px fixed width
- Center Panel (Design Canvas): Flexible width, minimum 600px
- Right Panel (Properties Panel): 320px fixed width
- Total minimum width: 1240px with responsive behavior

Color Scheme:
- Panel backgrounds: #ffffff (white) for side panels
- Canvas background: #f8fafc (slate-50) for main canvas
- Border colors: #e2e8f0 (slate-200) for panel dividers
- Drop zone active: #dbeafe (blue-50) background with #3b82f6 border
- Drop zone invalid: #fef2f2 (red-50) background with #ef4444 border

Visual Feedback:
- Drag opacity: 0.3 (30% transparency)
- Drag scale: 1.05 (5% larger)
- Hover elevation: shadow-sm to shadow-md transition
- Selection ring: 2px solid #3b82f6 with 2px offset

Typography:
- Panel headers: 18px font-semibold (600 weight)
- Control names: 14px font-medium (500 weight)
- Descriptions: 12px font-normal (400 weight) in text-slate-600
- Help text: 12px text-slate-500

CONTROL LIBRARY COMPONENT (client/src/components/ControlLibrary.tsx):
```typescript
import React, { useState, useMemo } from 'react';
import { useDrag } from 'react-dnd';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { ChevronDown, Search, Crown } from 'lucide-react';
import { CONTROLS, CONTROL_CATEGORIES } from '@/data/controls';
import { getTierConfig, isControlTypeAllowed } from '@/data/tiers';

import type { ControlType, CustomerTier } from '@shared/types';

interface ControlLibraryProps {
  onDragStart: (control: ControlType) => void;
  currentTier: CustomerTier;
}

interface DraggableControlProps {
  control: ControlType;
  onDragStart: (control: ControlType) => void;
  isAllowed: boolean;
}

const DraggableControl: React.FC<DraggableControlProps> = ({ 
  control, onDragStart, isAllowed 
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'CONTROL',
    item: control,
    canDrag: isAllowed,
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    }),
    begin: () => {
      onDragStart(control);
    }
  });

  const IconComponent = control.icon;

  return (
    <div
      ref={drag}
      className={`
        group relative p-4 rounded-lg border transition-all duration-200 cursor-grab active:cursor-grabbing
        ${isAllowed 
          ? 'border-slate-200 hover:border-blue-300 hover:shadow-md hover:bg-blue-50/30 bg-white' 
          : 'border-slate-100 bg-slate-50 cursor-not-allowed opacity-60'
        }
        ${isDragging ? 'opacity-30 scale-105 shadow-lg' : ''}
      `}
      style={{
        transform: isDragging ? 'scale(1.05)' : 'scale(1)',
        transition: 'all 200ms cubic-bezier(0.4, 0.0, 0.2, 1)'
      }}
    >
      <div className="flex items-center space-x-3">
        <div className={`
          w-10 h-10 rounded-md flex items-center justify-center transition-colors duration-150
          ${isAllowed 
            ? 'bg-blue-100 text-blue-600 group-hover:bg-blue-200' 
            : 'bg-slate-100 text-slate-400'
          }
        `}>
          {IconComponent && <IconComponent className="h-5 w-5" />}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className={`font-medium text-sm transition-colors duration-150 ${
            isAllowed ? 'text-slate-900 group-hover:text-blue-900' : 'text-slate-500'
          }`}>
            {control.name}
          </h4>
          <p className="text-xs text-slate-600 truncate mt-0.5">
            {control.description}
          </p>
        </div>
      </div>
      
      {!isAllowed && (
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700 border-amber-200">
            <Crown className="h-3 w-3 mr-1" />
            Upgrade
          </Badge>
        </div>
      )}
    </div>
  );
};

export const ControlLibrary: React.FC<ControlLibraryProps> = ({ 
  onDragStart, currentTier 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['Core Input'])
  );

  const tierConfig = getTierConfig(currentTier);
  
  const filteredControls = useMemo(() => {
    return CONTROLS.filter(control =>
      control.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      control.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      control.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const controlsByCategory = useMemo(() => {
    return CONTROL_CATEGORIES.map(category => ({
      ...category,
      controls: filteredControls.filter(control => control.category === category.name)
    })).filter(category => category.controls.length > 0);
  }, [filteredControls]);

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryName)) {
        next.delete(categoryName);
      } else {
        next.add(categoryName);
      }
      return next;
    });
  };

  return (
    <div className="w-80 bg-white border-r border-slate-200 flex flex-col shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 bg-slate-50/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Control Library</h2>
          <Badge className="text-xs font-medium" variant="outline">
            {currentTier}
          </Badge>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search controls..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        {/* Tier info */}
        <div className="mt-3 text-xs text-slate-600 bg-blue-50 p-2 rounded border border-blue-100">
          {tierConfig.maxControls === -1 
            ? '✨ Unlimited controls available' 
            : `📊 Up to ${tierConfig.maxControls} controls available`
          }
        </div>
      </div>

      {/* Categories */}
      <ScrollArea className="flex-1 bg-white">
        <div className="p-4 space-y-3">
          {controlsByCategory.map(category => {
            const isExpanded = expandedCategories.has(category.name);
            const IconComponent = category.icon;
            
            return (
              <Collapsible
                key={category.name}
                open={isExpanded}
                onOpenChange={() => toggleCategory(category.name)}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-slate-50 transition-colors duration-150"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center">
                        {IconComponent && <IconComponent className="h-4 w-4 text-slate-600" />}
                      </div>
                      <div className="text-left">
                        <h3 className="font-medium text-sm text-slate-900">{category.name}</h3>
                        <p className="text-xs text-slate-500">
                          {category.controls.length} controls
                        </p>
                      </div>
                    </div>
                    <ChevronDown 
                      className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : ''
                      }`} 
                    />
                  </Button>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <div className="mt-2 space-y-2 pl-2">
                    {category.controls.map(control => (
                      <DraggableControl
                        key={control.type}
                        control={control}
                        onDragStart={onDragStart}
                        isAllowed={isControlTypeAllowed(currentTier, control.type)}
                      />
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
```

DESIGN CANVAS COMPONENT (client/src/components/DesignCanvas.tsx):
```typescript
import React, { useRef, useCallback } from 'react';
import { useDrop } from 'react-dnd';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { DraggableControlComponent } from './DraggableControlComponent';

import { FileText, Plus, Sparkles } from 'lucide-react';

import type { ControlType, DroppedControl } from '@shared/types';

interface DesignCanvasProps {
  droppedControls: DroppedControl[];
  selectedControl: DroppedControl | null;
  onControlSelect: (control: DroppedControl) => void;
  onControlUpdate: (id: string, updates: Partial<DroppedControl>) => void;
  onControlMove: (id: string, direction: 'up' | 'down') => void;
  onControlRemove: (id: string) => void;
  onControlReorder: (dragIndex: number, hoverIndex: number) => void;
  onDrop: (controlType: ControlType, x: number, y: number) => void;
  draggedControl: ControlType | null;
  activeSection: string;
}

export const DesignCanvas: React.FC<DesignCanvasProps> = ({
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
  const canvasRef = useRef<HTMLDivElement>(null);

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'CONTROL',
    drop: (item: ControlType, monitor) => {
      const offset = monitor.getClientOffset();
      if (offset && canvasRef.current) {
        const canvasRect = canvasRef.current.getBoundingClientRect();
        const x = offset.x - canvasRect.left;
        const y = offset.y - canvasRect.top;
        onDrop(item, x, y);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  });

  // Filter controls for active section
  const sectionControls = droppedControls.filter(
    control => control.sectionId === activeSection
  );

  const handleControlSelect = useCallback((control: DroppedControl) => {
    onControlSelect(control);
  }, [onControlSelect]);

  const getDropZoneClasses = () => {
    if (isOver && canDrop) {
      return 'bg-blue-50 border-blue-300 border-2 border-dashed';
    }
    if (isOver && !canDrop) {
      return 'bg-red-50 border-red-300 border-2 border-dashed';
    }
    return 'bg-slate-50';
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 border-r border-slate-200">
      {/* Canvas area */}
      <div
        ref={(node) => {
          canvasRef.current = node;
          drop(node);
        }}
        className={`flex-1 relative transition-colors duration-200 ${getDropZoneClasses()}`}
      >
        <ScrollArea className="h-full w-full">
          <div 
            className="min-h-full p-6 space-y-4"
            style={{
              scrollbarWidth: 'auto',
              scrollbarColor: 'rgba(148, 163, 184, 0.5) transparent'
            }}
          >
            {sectionControls.length === 0 ? (
              <div className="flex items-center justify-center h-96 border-2 border-dashed border-slate-300 rounded-xl bg-white/50 backdrop-blur-sm">
                <div className="text-center text-slate-600 max-w-md">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Start Building Your Form</h3>
                  <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                    Drag controls from the library on the left to start building your form. 
                    You can customize each control's properties in the panel on the right.
                  </p>
                  {draggedControl && (
                    <div className="mt-6 p-4 bg-blue-100 rounded-lg border border-blue-200 animate-pulse">
                      <div className="flex items-center justify-center space-x-2">
                        <Sparkles className="h-4 w-4 text-blue-600" />
                        <p className="text-sm text-blue-700 font-medium">
                          Drop "{draggedControl.name}" here to add it to your form
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              sectionControls.map((control, index) => (
                <DraggableControlComponent
                  key={control.id}
                  control={control}
                  index={index}
                  isSelected={selectedControl?.id === control.id}
                  onSelect={() => handleControlSelect(control)}
                  onUpdate={onControlUpdate}
                  onMove={onControlMove}
                  onRemove={onControlRemove}
                  onReorder={onControlReorder}
                />
              ))
            )}
            
            {/* Active Drop Indicator */}
            {isOver && canDrop && draggedControl && (
              <div className="border-2 border-dashed border-blue-400 rounded-xl p-8 bg-blue-50/80 backdrop-blur-sm animate-pulse">
                <div className="text-center text-blue-700">
                  <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Plus className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="font-medium text-sm">
                    Drop "{draggedControl.name}" here
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Release to add to your form
                  </p>
                </div>
              </div>
            )}

            {/* Invalid Drop Indicator */}
            {isOver && !canDrop && draggedControl && (
              <div className="border-2 border-dashed border-red-400 rounded-xl p-8 bg-red-50/80 backdrop-blur-sm">
                <div className="text-center text-red-700">
                  <div className="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-red-600 font-bold text-lg">✕</span>
                  </div>
                  <p className="font-medium text-sm">
                    Cannot drop "{draggedControl.name}" here
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    This control is not available in your current tier
                  </p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
```

PROPERTIES PANEL COMPONENT (client/src/components/PropertiesPanel.tsx):
```typescript
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { Settings, Palette, Eye, Code, Layers } from 'lucide-react';

import type { DroppedControl, Section } from '@shared/types';

interface PropertiesPanelProps {
  selectedControl: DroppedControl | null;
  onUpdateControl: (id: string, updates: Partial<DroppedControl>) => void;
  sections: Section[];
  droppedControls: DroppedControl[];
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedControl,
  onUpdateControl,
  sections,
  droppedControls
}) => {
  if (!selectedControl) {
    return (
      <div className="w-80 bg-white border-l border-slate-200 flex flex-col shadow-sm">
        <div className="p-6 flex-1 flex items-center justify-center">
          <div className="text-center text-slate-500">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium mb-2 text-slate-900">No Control Selected</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Select a control from the design canvas to edit its properties and customize its behavior.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const updateProperty = (key: string, value: any) => {
    onUpdateControl(selectedControl.id, {
      properties: {
        ...selectedControl.properties,
        [key]: value
      }
    });
  };

  const updateControlMeta = (updates: Partial<DroppedControl>) => {
    onUpdateControl(selectedControl.id, updates);
  };

  return (
    <div className="w-80 bg-white border-l border-slate-200 flex flex-col shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 bg-slate-50/50">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-blue-100 rounded-md flex items-center justify-center">
            <Settings className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900">Properties</h3>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {selectedControl.type}
              </Badge>
              <span className="text-xs text-slate-500 truncate">
                {selectedControl.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 bg-white">
        <div className="p-6 space-y-6">
          {/* Basic Properties */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Eye className="h-4 w-4 text-slate-600" />
              <h4 className="font-medium text-slate-900">Basic Properties</h4>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="control-name" className="text-sm font-medium text-slate-700">
                  Control Name
                </Label>
                <Input
                  id="control-name"
                  value={selectedControl.name}
                  onChange={(e) => updateControlMeta({ name: e.target.value })}
                  placeholder="Enter control name"
                  className="mt-1 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <Label htmlFor="control-label" className="text-sm font-medium text-slate-700">
                  Display Label
                </Label>
                <Input
                  id="control-label"
                  value={selectedControl.properties.label || ''}
                  onChange={(e) => updateProperty('label', e.target.value)}
                  placeholder="Enter label text"
                  className="mt-1 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <Label htmlFor="placeholder" className="text-sm font-medium text-slate-700">
                  Placeholder Text
                </Label>
                <Input
                  id="placeholder"
                  value={selectedControl.properties.placeholder || ''}
                  onChange={(e) => updateProperty('placeholder', e.target.value)}
                  placeholder="Enter placeholder text"
                  className="mt-1 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <Label htmlFor="help-text" className="text-sm font-medium text-slate-700">
                  Help Text
                </Label>
                <Textarea
                  id="help-text"
                  value={selectedControl.properties.helpText || ''}
                  onChange={(e) => updateProperty('helpText', e.target.value)}
                  placeholder="Enter help text"
                  rows={2}
                  className="mt-1 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <Switch
                  id="required"
                  checked={selectedControl.properties.required || false}
                  onCheckedChange={(checked) => updateProperty('required', checked)}
                />
                <div>
                  <Label htmlFor="required" className="text-sm font-medium text-slate-700">
                    Required Field
                  </Label>
                  <p className="text-xs text-slate-500">
                    Users must fill this field to submit the form
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-slate-200" />

          {/* Layout Properties */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Layers className="h-4 w-4 text-slate-600" />
              <h4 className="font-medium text-slate-900">Layout & Position</h4>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="section" className="text-sm font-medium text-slate-700">
                  Section
                </Label>
                <Select
                  value={selectedControl.sectionId || ''}
                  onValueChange={(value) => updateControlMeta({ sectionId: value })}
                >
                  <SelectTrigger className="mt-1 border-slate-200 focus:border-blue-500 focus:ring-blue-500">
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
                  <Label htmlFor="width" className="text-sm font-medium text-slate-700">
                    Width (1-12)
                  </Label>
                  <Input
                    id="width"
                    type="number"
                    min="1"
                    max="12"
                    value={selectedControl.width}
                    onChange={(e) => updateControlMeta({ width: parseInt(e.target.value) || 12 })}
                    className="mt-1 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <Label htmlFor="height" className="text-sm font-medium text-slate-700">
                    Height
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    min="1"
                    value={selectedControl.height}
                    onChange={(e) => updateControlMeta({ height: parseInt(e.target.value) || 1 })}
                    className="mt-1 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
```

Create a professional three-panel drag-and-drop interface with the exact visual specifications provided. Ensure smooth animations, proper visual feedback, and an intuitive user experience for form building.
```