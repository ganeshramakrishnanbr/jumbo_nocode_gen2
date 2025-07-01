# 08 - Section Management System

This prompt creates the comprehensive section management system with visual organization and workflow controls.

## Visual Design Requirements

### Section Navigation Bar
- **Height**: 56px with clean horizontal layout
- **Section Tabs**: 48px height with rounded corners and active states
- **Color Indicators**: 4px left border with section color
- **Progress Rings**: Small circular progress indicators showing completion
- **Add Button**: Plus icon button with hover animations

### Section Management Modal
- **Modal Size**: 600px width with responsive height
- **Form Layout**: Clean two-column layout for section properties
- **Color Picker**: Visual color selection with predefined palette
- **Icon Selection**: Grid of available icons with search functionality
- **Validation**: Inline validation with error states

## AI Prompt

```
Create a comprehensive section management system with the following exact visual specifications:

VISUAL DESIGN STANDARDS:

Section Navigation Styling:
- Background: White with subtle shadow (light) / slate-800 (dark)
- Height: 56px with 16px horizontal padding
- Section tabs: 48px height, 8px border radius, 12px horizontal padding
- Active state: Blue-50 background with blue-500 left border
- Hover state: Slate-50 background with 150ms transition
- Progress indicators: 16px diameter rings with section color

Section Properties:
- Required fields: Name, description, color
- Optional fields: Icon, required flag, conditional logic
- Validation: Real-time with error highlighting
- Color palette: Predefined professional colors with custom option

SECTION MANAGER COMPONENT (client/src/components/SectionManager.tsx):
```typescript
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CreateSectionModal } from './CreateSectionModal';
import { EditSectionModal } from './EditSectionModal';

import { 
  Plus, Settings, Eye, ChevronRight, MoreHorizontal,
  FileText, Users, Calendar, Star, Shield, Zap,
  CheckCircle2, AlertCircle, Clock
} from 'lucide-react';

import type { Section } from '@shared/types';

interface SectionManagerProps {
  sections: Section[];
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
  onCreateSection: (section: Omit<Section, 'id' | 'controls' | 'validation'>) => void;
  onUpdateSection: (id: string, updates: Partial<Section>) => void;
  onDeleteSection: (id: string) => void;
  controlsBySection?: Record<string, number>;
  formValues?: Record<string, any>;
}

interface SectionProgress {
  total: number;
  completed: number;
  required: number;
  requiredCompleted: number;
}

export const SectionManager: React.FC<SectionManagerProps> = ({
  sections,
  activeSection,
  onSectionChange,
  onCreateSection,
  onUpdateSection,
  onDeleteSection,
  controlsBySection = {},
  formValues = {}
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);

  const getSectionProgress = (sectionId: string): SectionProgress => {
    // This would typically calculate based on controls in the section
    const controlCount = controlsBySection[sectionId] || 0;
    const completed = Math.floor(controlCount * 0.7); // Mock completion
    
    return {
      total: controlCount,
      completed,
      required: Math.floor(controlCount * 0.4),
      requiredCompleted: Math.floor(completed * 0.8)
    };
  };

  const getSectionStatus = (section: Section) => {
    const progress = getSectionProgress(section.id);
    
    if (progress.total === 0) return 'empty';
    if (progress.required > 0 && progress.requiredCompleted < progress.required) return 'incomplete';
    if (progress.completed === progress.total) return 'complete';
    return 'in-progress';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'incomplete':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-amber-500" />;
      default:
        return <FileText className="h-4 w-4 text-slate-400" />;
    }
  };

  const getProgressPercentage = (progress: SectionProgress) => {
    if (progress.total === 0) return 0;
    return (progress.completed / progress.total) * 100;
  };

  if (sections.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
              <FileText className="h-4 w-4 text-slate-500" />
            </div>
            <div>
              <h3 className="font-medium text-slate-900 dark:text-slate-100">No Sections</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Create sections to organize your form</p>
            </div>
          </div>
          
          <Button onClick={() => setShowCreateModal(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Section
          </Button>
        </div>
        
        <CreateSectionModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreateSection={onCreateSection}
        />
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            
            {/* Section Navigation */}
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 flex-shrink-0">
                Sections:
              </h3>
              
              <ScrollArea className="flex-1">
                <div className="flex items-center space-x-2 pb-2">
                  {sections.map((section, index) => {
                    const progress = getSectionProgress(section.id);
                    const status = getSectionStatus(section);
                    const progressPercentage = getProgressPercentage(progress);
                    const isActive = activeSection === section.id;
                    
                    return (
                      <TooltipProvider key={section.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => onSectionChange(section.id)}
                              className={`
                                relative flex items-center space-x-3 px-4 py-2 rounded-lg
                                border-l-4 transition-all duration-200 min-w-0 flex-shrink-0
                                ${isActive 
                                  ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-500 shadow-sm' 
                                  : 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600'
                                }
                              `}
                              style={{ 
                                borderLeftColor: isActive ? section.color : undefined 
                              }}
                            >
                              {/* Section Icon and Number */}
                              <div className="flex items-center space-x-2 flex-shrink-0">
                                <div 
                                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
                                  style={{ backgroundColor: section.color }}
                                >
                                  {index + 1}
                                </div>
                                {getStatusIcon(status)}
                              </div>
                              
                              {/* Section Info */}
                              <div className="flex-1 min-w-0 text-left">
                                <div className="font-medium text-sm text-slate-900 dark:text-slate-100 truncate">
                                  {section.name}
                                </div>
                                {progress.total > 0 && (
                                  <div className="flex items-center space-x-2 mt-1">
                                    <div className="flex-1 bg-slate-200 dark:bg-slate-600 rounded-full h-1.5">
                                      <div 
                                        className="h-1.5 rounded-full transition-all duration-300"
                                        style={{ 
                                          width: `${progressPercentage}%`,
                                          backgroundColor: section.color 
                                        }}
                                      />
                                    </div>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                      {progress.completed}/{progress.total}
                                    </span>
                                  </div>
                                )}
                              </div>
                              
                              {/* Section Actions */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingSection(section);
                                }}
                                className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Settings className="h-3 w-3" />
                              </button>
                            </button>
                          </TooltipTrigger>
                          
                          <TooltipContent>
                            <div className="text-sm">
                              <div className="font-medium">{section.name}</div>
                              {section.description && (
                                <div className="text-slate-400 mt-1">{section.description}</div>
                              )}
                              <div className="mt-2 space-y-1">
                                <div>Controls: {progress.total}</div>
                                <div>Completed: {progress.completed}</div>
                                {section.required && (
                                  <div className="text-amber-400">Required Section</div>
                                )}
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </div>
          
          {/* Add Section Button */}
          <Button
            onClick={() => setShowCreateModal(true)}
            size="sm"
            variant="outline"
            className="flex-shrink-0 ml-4"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Section
          </Button>
        </div>
        
        {/* Active Section Summary */}
        {activeSection && (
          <div className="px-4 pb-3">
            {(() => {
              const currentSection = sections.find(s => s.id === activeSection);
              if (!currentSection) return null;
              
              const progress = getSectionProgress(activeSection);
              const status = getSectionStatus(currentSection);
              
              return (
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-medium"
                        style={{ backgroundColor: currentSection.color }}
                      >
                        {sections.indexOf(currentSection) + 1}
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900 dark:text-slate-100">
                          {currentSection.name}
                        </h4>
                        {currentSection.description && (
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {currentSection.description}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {currentSection.required && (
                        <Badge variant="outline" className="text-amber-600 border-amber-600">
                          Required
                        </Badge>
                      )}
                      
                      <div className="text-right">
                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {progress.completed} / {progress.total} controls
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {Math.round(getProgressPercentage(progress))}% complete
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
      
      {/* Modals */}
      <CreateSectionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateSection={onCreateSection}
        existingSections={sections}
      />
      
      {editingSection && (
        <EditSectionModal
          isOpen={true}
          onClose={() => setEditingSection(null)}
          section={editingSection}
          onUpdateSection={onUpdateSection}
          onDeleteSection={onDeleteSection}
          existingSections={sections}
        />
      )}
    </>
  );
};
```

CREATE SECTION MODAL (client/src/components/CreateSectionModal.tsx):
```typescript
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

import { 
  FileText, Users, Calendar, Star, Shield, Zap, Settings,
  Heart, Target, Briefcase, Home, Phone, Mail
} from 'lucide-react';

import type { Section } from '@shared/types';

interface CreateSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSection: (section: Omit<Section, 'id' | 'controls' | 'validation'>) => void;
  existingSections?: Section[];
}

const SECTION_COLORS = [
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#8b5cf6', // Purple
  '#06b6d4', // Cyan
  '#84cc16', // Lime
  '#f97316', // Orange
  '#ec4899', // Pink
  '#6b7280'  // Gray
];

const SECTION_ICONS = [
  { icon: FileText, name: 'Document', id: 'FileText' },
  { icon: Users, name: 'Users', id: 'Users' },
  { icon: Calendar, name: 'Calendar', id: 'Calendar' },
  { icon: Star, name: 'Star', id: 'Star' },
  { icon: Shield, name: 'Shield', id: 'Shield' },
  { icon: Zap, name: 'Lightning', id: 'Zap' },
  { icon: Settings, name: 'Settings', id: 'Settings' },
  { icon: Heart, name: 'Heart', id: 'Heart' },
  { icon: Target, name: 'Target', id: 'Target' },
  { icon: Briefcase, name: 'Briefcase', id: 'Briefcase' },
  { icon: Home, name: 'Home', id: 'Home' },
  { icon: Phone, name: 'Phone', id: 'Phone' },
  { icon: Mail, name: 'Mail', id: 'Mail' }
];

export const CreateSectionModal: React.FC<CreateSectionModalProps> = ({
  isOpen,
  onClose,
  onCreateSection,
  existingSections = []
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: SECTION_COLORS[0],
    icon: 'FileText',
    required: false
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Section name is required';
    } else if (existingSections.some(s => s.name.toLowerCase() === formData.name.toLowerCase())) {
      newErrors.name = 'A section with this name already exists';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    onCreateSection({
      questionnaireId: 'default-questionnaire',
      name: formData.name.trim(),
      description: formData.description.trim(),
      color: formData.color,
      icon: formData.icon,
      sectionOrder: existingSections.length,
      required: formData.required
    });
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      color: SECTION_COLORS[0],
      icon: 'FileText',
      required: false
    });
    setErrors({});
    onClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      color: SECTION_COLORS[0],
      icon: 'FileText',
      required: false
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
              style={{ backgroundColor: formData.color }}
            >
              {(() => {
                const IconComponent = SECTION_ICONS.find(i => i.id === formData.icon)?.icon || FileText;
                return <IconComponent className="h-4 w-4" />;
              })()}
            </div>
            <span>Create New Section</span>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[600px]">
          <div className="space-y-6 pr-6">
            
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="section-name" className="text-sm font-medium">
                  Section Name *
                </Label>
                <Input
                  id="section-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter section name"
                  className={`mt-1 ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="section-description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="section-description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the purpose of this section"
                  rows={3}
                  className="mt-1"
                />
              </div>
            </div>
            
            {/* Visual Customization */}
            <div className="space-y-4">
              <h4 className="font-medium text-slate-900 dark:text-slate-100">Visual Appearance</h4>
              
              {/* Color Selection */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Section Color</Label>
                <div className="grid grid-cols-5 gap-2">
                  {SECTION_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setFormData(prev => ({ ...prev, color }))}
                      className={`
                        w-12 h-12 rounded-lg border-2 transition-all duration-200
                        ${formData.color === color 
                          ? 'border-slate-900 dark:border-slate-100 shadow-md scale-110' 
                          : 'border-slate-200 dark:border-slate-700 hover:scale-105'
                        }
                      `}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
              
              {/* Icon Selection */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Section Icon</Label>
                <div className="grid grid-cols-6 gap-2">
                  {SECTION_ICONS.map(({ icon: Icon, name, id }) => (
                    <button
                      key={id}
                      onClick={() => setFormData(prev => ({ ...prev, icon: id }))}
                      className={`
                        p-3 rounded-lg border transition-all duration-200 flex flex-col items-center space-y-1
                        ${formData.icon === id 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30' 
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                        }
                      `}
                      title={name}
                    >
                      <Icon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                      <span className="text-xs text-slate-500 dark:text-slate-400">{name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Section Properties */}
            <div className="space-y-4">
              <h4 className="font-medium text-slate-900 dark:text-slate-100">Section Properties</h4>
              
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Switch
                    checked={formData.required}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, required: checked }))}
                  />
                  <div>
                    <Label className="text-sm font-medium">Required Section</Label>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      Users must complete all required fields in this section before proceeding
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Preview */}
            <div className="space-y-4">
              <h4 className="font-medium text-slate-900 dark:text-slate-100">Preview</h4>
              
              <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-medium"
                    style={{ backgroundColor: formData.color }}
                  >
                    {(() => {
                      const IconComponent = SECTION_ICONS.find(i => i.id === formData.icon)?.icon || FileText;
                      return <IconComponent className="h-4 w-4" />;
                    })()}
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-slate-900 dark:text-slate-100">
                      {formData.name || 'Section Name'}
                      {formData.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </h5>
                    {formData.description && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {formData.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!formData.name.trim()}>
            Create Section
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
```

EDIT SECTION MODAL (client/src/components/EditSectionModal.tsx):
```typescript
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

import { Trash2, Save } from 'lucide-react';

import type { Section } from '@shared/types';

interface EditSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: Section;
  onUpdateSection: (id: string, updates: Partial<Section>) => void;
  onDeleteSection: (id: string) => void;
  existingSections: Section[];
}

export const EditSectionModal: React.FC<EditSectionModalProps> = ({
  isOpen,
  onClose,
  section,
  onUpdateSection,
  onDeleteSection,
  existingSections
}) => {
  const [formData, setFormData] = useState({
    name: section.name,
    description: section.description || '',
    color: section.color,
    icon: section.icon,
    required: section.required || false
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const changed = (
      formData.name !== section.name ||
      formData.description !== (section.description || '') ||
      formData.color !== section.color ||
      formData.icon !== section.icon ||
      formData.required !== (section.required || false)
    );
    setHasChanges(changed);
  }, [formData, section]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Section name is required';
    } else {
      const duplicate = existingSections.find(s => 
        s.id !== section.id && s.name.toLowerCase() === formData.name.toLowerCase()
      );
      if (duplicate) {
        newErrors.name = 'A section with this name already exists';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    
    onUpdateSection(section.id, {
      name: formData.name.trim(),
      description: formData.description.trim(),
      color: formData.color,
      icon: formData.icon,
      required: formData.required
    });
    
    onClose();
  };

  const handleDelete = () => {
    onDeleteSection(section.id);
    onClose();
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                style={{ backgroundColor: formData.color }}
              >
                {/* Icon would be rendered here */}
              </div>
              <span>Edit Section</span>
            </div>
            
            {hasChanges && (
              <div className="flex items-center space-x-1 text-sm text-amber-600">
                <div className="w-2 h-2 bg-amber-500 rounded-full" />
                <span>Unsaved changes</span>
              </div>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[600px]">
          <div className="space-y-6 pr-6">
            {/* Same form fields as CreateSectionModal but populated with existing data */}
            {/* ... form content ... */}
            
            <Separator />
            
            {/* Danger Zone */}
            <div className="space-y-4">
              <h4 className="font-medium text-red-600">Danger Zone</h4>
              
              <div className="border border-red-200 rounded-lg p-4 bg-red-50 dark:bg-red-950/20">
                <div className="flex items-start justify-between">
                  <div>
                    <h5 className="font-medium text-red-900 dark:text-red-400">Delete Section</h5>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                      This action cannot be undone. All controls in this section will be moved to the default section.
                    </p>
                  </div>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Section</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete the "{section.name}" section? 
                          This action cannot be undone and will move all controls to the default section.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                          Delete Section
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges || !formData.name.trim()}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
```

Create a comprehensive section management system with visual organization, progress tracking, and intuitive section creation and editing workflows.
```