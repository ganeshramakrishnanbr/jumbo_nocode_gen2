import React, { useState } from 'react';
import { DroppedControl, Section } from '../types';
import { CheckCircle, AlertCircle, Circle, ChevronRight, Trash2, Palette, Layout, Maximize2, Grid3X3, AlignLeft, Sparkles, BarChart3, Settings, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Home, User, Bell, HelpCircle, Monitor, Tablet, Smartphone, Watch } from 'lucide-react';

interface PreviewModeProps {
  droppedControls: DroppedControl[];
  sections: Section[];
  onDeleteControl?: (controlId: string) => void;
  formValues?: { [controlId: string]: any };
  onFormValueChange?: (controlId: string, value: any) => void;
}

// Tab Layout Themes based on design patterns
const TAB_LAYOUT_THEMES = {
  cleanMinimal: {
    name: 'Clean Minimal',
    description: 'Simple text tabs with clean spacing',
    renderTabs: (sections: Section[], activeSection: number, setActiveSection: (index: number) => void) => (
      <div className="flex space-x-8 mb-8 border-b border-gray-200 dark:border-gray-700">
        {sections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(index)}
            className={`pb-3 px-1 text-sm font-medium transition-colors ${
              activeSection === index
                ? 'text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {section.name}
          </button>
        ))}
      </div>
    )
  },
  iconText: {
    name: 'Icon & Text',
    description: 'Tabs with icons and descriptive labels',
    renderTabs: (sections: Section[], activeSection: number, setActiveSection: (index: number) => void) => (
      <div className="flex space-x-1 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        {sections.map((section, index) => {
          const icons = [Home, User, Settings, Bell];
          const IconComponent = icons[index % icons.length];
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(index)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                activeSection === index
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span className="text-sm font-medium">{section.name}</span>
            </button>
          );
        })}
      </div>
    )
  },
  leftSidebar: {
    name: 'Left Sidebar',
    description: 'Vertical navigation with icons',
    renderTabs: (sections: Section[], activeSection: number, setActiveSection: (index: number) => void) => (
      <div className="flex-shrink-0 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-2">
        {sections.map((section, index) => {
          const icons = [Settings, User, Bell, HelpCircle];
          const IconComponent = icons[index % icons.length];
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(index)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-all ${
                activeSection === index
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span className="text-sm">{section.name}</span>
            </button>
          );
        })}
      </div>
    )
  },
  underlineStyle: {
    name: 'Underline Style',
    description: 'Tabs with colored underline indicator',
    renderTabs: (sections: Section[], activeSection: number, setActiveSection: (index: number) => void) => (
      <div className="flex space-x-8 mb-8">
        {sections.map((section, index) => {
          const icons = [Palette, BarChart3, Settings, Sparkles];
          const IconComponent = icons[index % icons.length];
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(index)}
              className={`flex items-center space-x-2 pb-3 relative transition-colors ${
                activeSection === index
                  ? 'text-purple-600 dark:text-purple-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span className="text-sm font-medium">{section.name}</span>
              {activeSection === index && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    )
  },
  cardSelection: {
    name: 'Card Selection',
    description: 'Card-based selection with icons',
    renderTabs: (sections: Section[], activeSection: number, setActiveSection: (index: number) => void) => (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {sections.map((section, index) => {
          const icons = [Smartphone, Monitor, Tablet, Watch];
          const IconComponent = icons[index % icons.length];
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(index)}
              className={`p-4 rounded-lg border-2 transition-all ${
                activeSection === index
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <IconComponent className="w-8 h-8 mx-auto mb-2" />
              <div className="text-sm font-medium">{section.name}</div>
            </button>
          );
        })}
      </div>
    )
  },
  buttonStyle: {
    name: 'Button Style',
    description: 'Full-width button tabs with background',
    renderTabs: (sections: Section[], activeSection: number, setActiveSection: (index: number) => void) => (
      <div className="flex rounded-lg bg-gray-100 dark:bg-gray-800 p-1 mb-8">
        {sections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(index)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              activeSection === index
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            {section.name}
          </button>
        ))}
      </div>
    )
  }
};

// Theme definitions for modern layouts
const FORM_THEMES = {
  classic: {
    name: 'Classic',
    icon: AlignLeft,
    description: 'Traditional form layout with labels above fields',
    containerClass: 'max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-8',
    sectionTabsClass: 'flex space-x-1 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg',
    activeTabClass: 'px-6 py-3 rounded-md bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 font-medium shadow-sm',
    inactiveTabClass: 'px-6 py-3 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors',
    fieldSpacing: 'space-y-6',
    labelClass: 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2',
    inputClass: 'w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
  },
  modern: {
    name: 'Modern Card',
    icon: Layout,
    description: 'Clean card-based design with floating labels',
    containerClass: 'max-w-4xl mx-auto bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-10',
    sectionTabsClass: 'flex space-x-2 mb-10 bg-white dark:bg-gray-900 p-2 rounded-xl shadow-inner',
    activeTabClass: 'px-8 py-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg transform scale-105 transition-all',
    inactiveTabClass: 'px-8 py-4 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all',
    fieldSpacing: 'space-y-8',
    labelClass: 'block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3',
    inputClass: 'w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
  },
  minimal: {
    name: 'Minimal',
    icon: Maximize2,
    description: 'Clean minimal design with subtle borders',
    containerClass: 'max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-none border-t-4 border-blue-500 p-12',
    sectionTabsClass: 'flex space-x-8 mb-12 border-b border-gray-200 dark:border-gray-700',
    activeTabClass: 'pb-4 border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 font-medium',
    inactiveTabClass: 'pb-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors',
    fieldSpacing: 'space-y-10',
    labelClass: 'block text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2 font-medium',
    inputClass: 'w-full px-0 py-3 border-0 border-b border-gray-300 dark:border-gray-600 focus:ring-0 focus:border-blue-500 bg-transparent text-gray-900 dark:text-white text-lg'
  },
  compact: {
    name: 'Compact Grid',
    icon: Grid3X3,
    description: 'Space-efficient grid layout for dense forms',
    containerClass: 'max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6',
    sectionTabsClass: 'flex space-x-1 mb-6 bg-gray-50 dark:bg-gray-800 p-1 rounded',
    activeTabClass: 'px-4 py-2 rounded bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 font-medium text-sm shadow-sm',
    inactiveTabClass: 'px-4 py-2 rounded text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 text-sm transition-colors',
    fieldSpacing: 'grid grid-cols-1 md:grid-cols-2 gap-4',
    labelClass: 'block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1',
    inputClass: 'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm'
  },
  luxury: {
    name: 'Luxury',
    icon: Sparkles,
    description: 'Premium design with elegant styling',
    containerClass: 'max-w-4xl mx-auto bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl border border-gray-300 dark:border-gray-600 p-12 relative overflow-hidden',
    sectionTabsClass: 'flex space-x-3 mb-12 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 p-3 rounded-2xl',
    activeTabClass: 'px-10 py-5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 text-white font-bold shadow-xl transform scale-105 transition-all',
    inactiveTabClass: 'px-10 py-5 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-600/50 transition-all font-medium',
    fieldSpacing: 'space-y-10',
    labelClass: 'block text-sm font-bold text-gray-800 dark:text-gray-200 mb-4 tracking-wide',
    inputClass: 'w-full px-6 py-5 border-2 border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-4 focus:ring-amber-500/30 focus:border-amber-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg text-lg'
  }
};

export const PreviewMode: React.FC<PreviewModeProps> = ({
  droppedControls,
  sections,
  onDeleteControl,
  formValues = {},
  onFormValueChange
}) => {
  const [activeSection, setActiveSection] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>(formValues);
  const [selectedTheme, setSelectedTheme] = useState<keyof typeof FORM_THEMES>('classic');
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [tabAlignment, setTabAlignment] = useState<'top' | 'left' | 'right'>('top');
  const [selectedTabLayout, setSelectedTabLayout] = useState<keyof typeof TAB_LAYOUT_THEMES>('cleanMinimal');
  const [showTabLayoutSelector, setShowTabLayoutSelector] = useState(false);
  const [demoActiveTab, setDemoActiveTab] = useState(0); // Index-based for demo sections

  const handleInputChange = (controlId: string, value: any) => {
    setFormData(prev => ({ ...prev, [controlId]: value }));
    
    // Sync with parent component if callback provided
    if (onFormValueChange) {
      onFormValueChange(controlId, value);
    }
  };

  // Calculate form completion percentage
  const calculateFormCompletion = () => {
    const allControls = droppedControls.filter(isControlVisible);
    const requiredControls = allControls.filter(control => control.properties.required);
    const allControlsCount = allControls.length;
    const filledControlsCount = allControls.filter(control => {
      const value = formData[control.id];
      return value !== undefined && value !== '' && value !== null;
    }).length;
    
    const requiredControlsCount = requiredControls.length;
    const filledRequiredControlsCount = requiredControls.filter(control => {
      const value = formData[control.id];
      return value !== undefined && value !== '' && value !== null;
    }).length;

    const overallPercentage = allControlsCount > 0 ? Math.round((filledControlsCount / allControlsCount) * 100) : 0;
    const requiredPercentage = requiredControlsCount > 0 ? Math.round((filledRequiredControlsCount / requiredControlsCount) * 100) : 100;

    return {
      overall: overallPercentage,
      required: requiredPercentage,
      filledCount: filledControlsCount,
      totalCount: allControlsCount,
      requiredFilled: filledRequiredControlsCount,
      requiredTotal: requiredControlsCount
    };
  };

  const handleDeleteControl = (controlId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDeleteControl) {
      onDeleteControl(controlId);
    }
  };

  // Check if control should be visible based on dependencies
  const isControlVisible = (control: DroppedControl): boolean => {
    // If no dependencies, always visible
    if (!control.properties.dependencies || control.properties.dependencies.length === 0) {
      return true;
    }

    // Check each dependency
    return control.properties.dependencies.every((dep: any) => {
      const dependentValue = formData[dep.controlId];
      
      switch (dep.condition) {
        case 'equals':
          return dependentValue === dep.value;
        case 'not_equals':
          return dependentValue !== dep.value;
        case 'contains':
          return dependentValue && dependentValue.toString().includes(dep.value);
        case 'greater_than':
          return Number(dependentValue) > Number(dep.value);
        case 'less_than':
          return Number(dependentValue) < Number(dep.value);
        case 'is_empty':
          return !dependentValue || dependentValue === '';
        case 'is_not_empty':
          return dependentValue && dependentValue !== '';
        default:
          return true;
      }
    });
  };

  const getSectionStatus = (section: Section) => {
    const sectionControls = droppedControls.filter(c => c.sectionId === section.id && isControlVisible(c));
    const requiredControls = sectionControls.filter(c => c.properties.required);
    const completedRequired = requiredControls.filter(c => formData[c.id]);
    
    if (requiredControls.length === 0) return 'completed';
    if (completedRequired.length === requiredControls.length) return 'completed';
    if (completedRequired.length > 0) return 'partial';
    return 'empty';
  };

  const renderStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'partial':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const renderControl = (control: DroppedControl) => {
    const value = formData[control.id] || '';

    const inputProps = {
      value,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => 
        handleInputChange(control.id, e.target.value),
      className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors",
      required: control.properties.required
    };

    switch (control.type) {
      case 'textInput':
        return (
          <input
            type="text"
            placeholder={control.properties.placeholder}
            {...inputProps}
          />
        );
      
      case 'textarea':
        return (
          <textarea
            placeholder={control.properties.placeholder}
            rows={control.properties.rows || 4}
            {...inputProps}
          />
        );
      
      case 'numberInput':
        return (
          <input
            type="number"
            min={control.properties.min}
            max={control.properties.max}
            step={control.properties.step}
            {...inputProps}
          />
        );

      case 'emailInput':
        return (
          <input
            type="email"
            placeholder={control.properties.placeholder}
            {...inputProps}
          />
        );

      case 'phoneInput':
        return (
          <input
            type="tel"
            placeholder={control.properties.placeholder}
            {...inputProps}
          />
        );

      case 'urlInput':
        return (
          <input
            type="url"
            placeholder={control.properties.placeholder}
            {...inputProps}
          />
        );

      case 'passwordInput':
        return (
          <input
            type="password"
            placeholder={control.properties.placeholder}
            {...inputProps}
          />
        );

      case 'richTextEditor':
        return (
          <div className="border border-gray-300 dark:border-gray-600 rounded-md p-3 bg-white dark:bg-gray-800 min-h-[100px] transition-colors">
            <textarea
              placeholder={control.properties.placeholder || 'Enter formatted text...'}
              rows={6}
              {...inputProps}
              className="w-full border-0 bg-transparent resize-none focus:ring-0 focus:outline-none"
            />
          </div>
        );
      
      case 'dropdown':
        const options = control.properties.options?.split(',') || [];
        return (
          <select {...inputProps}>
            <option value="">Select an option...</option>
            {options.map((option: string, index: number) => (
              <option key={index} value={option.trim()}>
                {option.trim()}
              </option>
            ))}
          </select>
        );

      case 'multiSelectDropdown':
        const multiOptions = control.properties.options?.split(',') || [];
        const selectedValues = Array.isArray(value) ? value : [];
        return (
          <div className="border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-800 min-h-[40px] transition-colors">
            <div className="space-y-1">
              {multiOptions.map((option: string, index: number) => (
                <label key={index} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(option.trim())}
                    onChange={(e) => {
                      const newValues = e.target.checked
                        ? [...selectedValues, option.trim()]
                        : selectedValues.filter((v: string) => v !== option.trim());
                      handleInputChange(control.id, newValues);
                    }}
                    className="text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <span className="text-sm">{option.trim()}</span>
                </label>
              ))}
            </div>
          </div>
        );
      
      case 'radioGroup':
        const radioOptions = control.properties.options?.split(',') || [];
        return (
          <div className="space-y-2">
            {radioOptions.map((option: string, index: number) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={control.id}
                  value={option.trim()}
                  checked={value === option.trim()}
                  onChange={(e) => handleInputChange(control.id, e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span>{option.trim()}</span>
              </label>
            ))}
          </div>
        );
      
      case 'checkboxGroup':
        const checkboxOptions = control.properties.options?.split(',') || [];
        const checkedValues = Array.isArray(value) ? value : [];
        return (
          <div className="space-y-2">
            {checkboxOptions.map((option: string, index: number) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={option.trim()}
                  checked={checkedValues.includes(option.trim())}
                  onChange={(e) => {
                    const newValues = e.target.checked
                      ? [...checkedValues, option.trim()]
                      : checkedValues.filter((v: string) => v !== option.trim());
                    handleInputChange(control.id, newValues);
                  }}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span>{option.trim()}</span>
              </label>
            ))}
          </div>
        );

      case 'buttonGroup':
        const buttonOptions = control.properties.options?.split(',') || [];
        const isMultiSelect = control.properties.selectionType === 'multiple';
        const buttonValues = isMultiSelect ? (Array.isArray(value) ? value : []) : value;
        
        return (
          <div className="flex flex-wrap gap-2">
            {buttonOptions.map((option: string, index: number) => {
              const isSelected = isMultiSelect 
                ? buttonValues.includes(option.trim())
                : buttonValues === option.trim();
              
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    if (isMultiSelect) {
                      const newValues = isSelected
                        ? buttonValues.filter((v: string) => v !== option.trim())
                        : [...buttonValues, option.trim()];
                      handleInputChange(control.id, newValues);
                    } else {
                      handleInputChange(control.id, option.trim());
                    }
                  }}
                  className={`px-4 py-2 border rounded-md text-sm transition-colors ${
                    isSelected
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {option.trim()}
                </button>
              );
            })}
          </div>
        );

      case 'ratingScale':
        const maxRating = control.properties.maxValue || 5;
        const isStars = control.properties.scaleType === 'stars';
        const currentRating = parseInt(value) || 0;
        
        return (
          <div className="flex items-center space-x-1">
            {Array.from({ length: maxRating }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleInputChange(control.id, i + 1)}
                className={`text-2xl transition-colors ${
                  i < currentRating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                }`}
              >
                {isStars ? '★' : i + 1}
              </button>
            ))}
          </div>
        );

      case 'slider':
        return (
          <div className="space-y-2">
            <input
              type="range"
              min={control.properties.min || 0}
              max={control.properties.max || 100}
              step={control.properties.step || 1}
              value={value || control.properties.defaultValue || 50}
              onChange={(e) => handleInputChange(control.id, parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>{control.properties.min || 0}</span>
              <span className="font-medium">{value || control.properties.defaultValue || 50}</span>
              <span>{control.properties.max || 100}</span>
            </div>
          </div>
        );

      case 'toggleSwitch':
        const isToggled = Boolean(value);
        return (
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-700 dark:text-gray-300">{control.properties.offLabel || 'Off'}</span>
            <button
              type="button"
              onClick={() => handleInputChange(control.id, !isToggled)}
              className={`relative inline-block w-10 h-6 rounded-full transition-colors ${
                isToggled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                isToggled ? 'translate-x-5' : 'translate-x-1'
              }`}></div>
            </button>
            <span className="text-sm text-gray-700 dark:text-gray-300">{control.properties.onLabel || 'On'}</span>
          </div>
        );

      case 'tagInput':
        const tags = Array.isArray(value) ? value : [];
        const [newTag, setNewTag] = useState('');
        
        return (
          <div className="border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-800 transition-colors">
            <div className="flex flex-wrap gap-1 mb-2">
              {tags.map((tag: string, index: number) => (
                <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded flex items-center">
                  {tag}
                  <button
                    type="button"
                    onClick={() => {
                      const newTags = tags.filter((_: string, i: number) => i !== index);
                      handleInputChange(control.id, newTags);
                    }}
                    className="ml-1 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && newTag.trim()) {
                  e.preventDefault();
                  const newTags = [...tags, newTag.trim()];
                  handleInputChange(control.id, newTags);
                  setNewTag('');
                }
              }}
              placeholder="Type and press Enter to add tags"
              className="w-full border-0 bg-transparent focus:ring-0 focus:outline-none text-sm"
            />
          </div>
        );
      
      case 'datePicker':
        return <input type="date" {...inputProps} />;
      
      case 'timePicker':
        return <input type="time" {...inputProps} />;

      case 'dateRangePicker':
        const [startDate, endDate] = Array.isArray(value) ? value : ['', ''];
        return (
          <div className="flex items-center space-x-2">
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => handleInputChange(control.id, [e.target.value, endDate])}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors" 
            />
            <span className="text-gray-500 dark:text-gray-400">to</span>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => handleInputChange(control.id, [startDate, e.target.value])}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors" 
            />
          </div>
        );

      // Grid & Matrix Controls
      case 'singleSelectiveGrid':
      case 'multiSelectiveGrid':
        const rowLabels = control.properties.rowLabels?.split(',') || ['Row 1', 'Row 2'];
        const columnOptions = control.properties.columnOptions?.split(',') || ['Col 1', 'Col 2'];
        const gridValue = value || {};
        
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 dark:border-gray-600">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <th className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-left text-xs"></th>
                  {columnOptions.map((col: string, index: number) => (
                    <th key={index} className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center text-xs text-gray-700 dark:text-gray-300">
                      {col.trim()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rowLabels.map((row: string, rowIndex: number) => (
                  <tr key={rowIndex}>
                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-xs text-gray-700 dark:text-gray-300">{row.trim()}</td>
                    {columnOptions.map((col: string, colIndex: number) => (
                      <td key={colIndex} className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center">
                        <input 
                          type={control.type === 'singleSelectiveGrid' ? 'radio' : 'checkbox'}
                          name={control.type === 'singleSelectiveGrid' ? `grid-${control.id}-${rowIndex}` : undefined}
                          checked={control.type === 'singleSelectiveGrid' 
                            ? gridValue[rowIndex] === colIndex
                            : gridValue[rowIndex]?.includes(colIndex)
                          }
                          onChange={(e) => {
                            const newGridValue = { ...gridValue };
                            if (control.type === 'singleSelectiveGrid') {
                              newGridValue[rowIndex] = e.target.checked ? colIndex : null;
                            } else {
                              if (!newGridValue[rowIndex]) newGridValue[rowIndex] = [];
                              if (e.target.checked) {
                                newGridValue[rowIndex] = [...newGridValue[rowIndex], colIndex];
                              } else {
                                newGridValue[rowIndex] = newGridValue[rowIndex].filter((i: number) => i !== colIndex);
                              }
                            }
                            handleInputChange(control.id, newGridValue);
                          }}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'matrixQuestions':
        const questions = control.properties.questions?.split(',') || ['Question 1', 'Question 2'];
        const answers = control.properties.answers?.split(',') || ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree'];
        const matrixValue = value || {};
        
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 dark:border-gray-600">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <th className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-left text-xs w-1/3">Question</th>
                  {answers.map((answer: string, index: number) => (
                    <th key={index} className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center text-xs text-gray-700 dark:text-gray-300">
                      {answer.trim()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {questions.map((question: string, qIndex: number) => (
                  <tr key={qIndex}>
                    <td className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-xs text-gray-700 dark:text-gray-300">{question.trim()}</td>
                    {answers.map((answer: string, aIndex: number) => (
                      <td key={aIndex} className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center">
                        <input 
                          type="radio"
                          name={`matrix-${control.id}-${qIndex}`}
                          checked={matrixValue[qIndex] === aIndex}
                          onChange={() => {
                            const newMatrixValue = { ...matrixValue };
                            newMatrixValue[qIndex] = aIndex;
                            handleInputChange(control.id, newMatrixValue);
                          }}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'rankingControl':
        const items = control.properties.items?.split(',') || ['Item 1', 'Item 2', 'Item 3'];
        const rankedItems = Array.isArray(value) ? value : items.map((item: string, index: number) => ({ item: item.trim(), rank: index + 1 }));
        
        return (
          <div className="space-y-2">
            {rankedItems.map((rankedItem: { item: string; rank: number }, index: number) => (
              <div key={index} className="flex items-center space-x-3 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800">
                <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                <span className="flex-1 text-gray-700 dark:text-gray-300">{rankedItem.item}</span>
                <div className="flex space-x-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (index > 0) {
                        const newRanked = [...rankedItems];
                        [newRanked[index], newRanked[index - 1]] = [newRanked[index - 1], newRanked[index]];
                        handleInputChange(control.id, newRanked);
                      }
                    }}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (index < rankedItems.length - 1) {
                        const newRanked = [...rankedItems];
                        [newRanked[index], newRanked[index + 1]] = [newRanked[index + 1], newRanked[index]];
                        handleInputChange(control.id, newRanked);
                      }
                    }}
                    disabled={index === rankedItems.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  >
                    ↓
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'fileUpload':
        return (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center transition-colors">
            <input
              type="file"
              accept={control.properties.accept}
              multiple={control.properties.multiple}
              className="hidden"
              id={control.id}
              onChange={(e) => handleInputChange(control.id, e.target.files)}
            />
            <label htmlFor={control.id} className="cursor-pointer">
              <p className="text-gray-600 dark:text-gray-300">Click to upload or drag files here</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {control.properties.accept || 'All files'} • Max {control.properties.maxSize || 10}MB
              </p>
            </label>
          </div>
        );

      case 'imageUpload':
        return (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center transition-colors">
            <input
              type="file"
              accept={control.properties.accept || 'image/*'}
              multiple={control.properties.multiple}
              className="hidden"
              id={control.id}
              onChange={(e) => handleInputChange(control.id, e.target.files)}
            />
            <label htmlFor={control.id} className="cursor-pointer">
              <p className="text-gray-600 dark:text-gray-300">Click to upload images</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {control.properties.accept || 'Images'} • Max {control.properties.maxSize || 5}MB
              </p>
            </label>
          </div>
        );

      case 'signaturePad':
        return (
          <div className="border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 p-4 text-center transition-colors">
            <div 
              className="border-2 border-dashed border-gray-200 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 flex items-center justify-center transition-colors"
              style={{ 
                width: '100%', 
                height: control.properties.canvasHeight || 200 
              }}
            >
              <p className="text-gray-500 dark:text-gray-400 text-sm">Click to sign</p>
            </div>
          </div>
        );

      case 'colorPicker':
        return (
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={value || control.properties.defaultColor || '#3B82F6'}
              onChange={(e) => handleInputChange(control.id, e.target.value)}
              className="w-12 h-8 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">{value || control.properties.defaultColor || '#3B82F6'}</span>
          </div>
        );

      case 'tableInput':
        const columnHeaders = control.properties.columnHeaders?.split(',') || ['Column 1', 'Column 2'];
        const tableData = Array.isArray(value) ? value : [{}];
        
        return (
          <div className="border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  {columnHeaders.map((header: string, index: number) => (
                    <th key={index} className="px-3 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300 border-b border-gray-300 dark:border-gray-600">
                      {header.trim()}
                    </th>
                  ))}
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row: any, rowIndex: number) => (
                  <tr key={rowIndex}>
                    {columnHeaders.map((header: string, colIndex: number) => (
                      <td key={colIndex} className="px-3 py-2 border-b border-gray-300 dark:border-gray-600">
                        <input
                          type="text"
                          value={row[header.trim()] || ''}
                          onChange={(e) => {
                            const newTableData = [...tableData];
                            newTableData[rowIndex] = { ...newTableData[rowIndex], [header.trim()]: e.target.value };
                            handleInputChange(control.id, newTableData);
                          }}
                          className="w-full px-2 py-1 border-0 bg-transparent focus:ring-0 focus:outline-none text-sm"
                        />
                      </td>
                    ))}
                    <td className="px-2 py-2 border-b border-gray-300 dark:border-gray-600">
                      <button
                        type="button"
                        onClick={() => {
                          const newTableData = tableData.filter((_, index) => index !== rowIndex);
                          handleInputChange(control.id, newTableData);
                        }}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-600">
              <button
                type="button"
                onClick={() => {
                  const newTableData = [...tableData, {}];
                  handleInputChange(control.id, newTableData);
                }}
                className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
              >
                + Add Row
              </button>
            </div>
          </div>
        );

      // Address Controls
      case 'addressLine1':
      case 'addressLine2':
      case 'city':
      case 'zipPostal':
        return (
          <input
            type="text"
            placeholder={control.properties.placeholder}
            {...inputProps}
          />
        );

      case 'stateProvince':
        if (control.properties.inputType === 'dropdown') {
          return (
            <select {...inputProps}>
              <option value="">Select state...</option>
              <option value="CA">California</option>
              <option value="NY">New York</option>
              <option value="TX">Texas</option>
              <option value="FL">Florida</option>
            </select>
          );
        }
        return (
          <input
            type="text"
            placeholder="Enter state/province"
            {...inputProps}
          />
        );

      case 'country':
        return (
          <select {...inputProps}>
            <option value="">Select country...</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="UK">United Kingdom</option>
            <option value="AU">Australia</option>
          </select>
        );

      case 'completeAddress':
        const addressData = value || {};
        return (
          <div className="space-y-3">
            <input 
              type="text" 
              placeholder="Street address" 
              value={addressData.line1 || ''}
              onChange={(e) => handleInputChange(control.id, { ...addressData, line1: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
            />
            {control.properties.includeAddressLine2 && (
              <input 
                type="text" 
                placeholder="Apartment, suite, etc." 
                value={addressData.line2 || ''}
                onChange={(e) => handleInputChange(control.id, { ...addressData, line2: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
              />
            )}
            <div className="grid grid-cols-2 gap-3">
              <input 
                type="text" 
                placeholder="City" 
                value={addressData.city || ''}
                onChange={(e) => handleInputChange(control.id, { ...addressData, city: e.target.value })}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
              />
              <input 
                type="text" 
                placeholder="State" 
                value={addressData.state || ''}
                onChange={(e) => handleInputChange(control.id, { ...addressData, state: e.target.value })}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input 
                type="text" 
                placeholder="ZIP Code" 
                value={addressData.zip || ''}
                onChange={(e) => handleInputChange(control.id, { ...addressData, zip: e.target.value })}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
              />
              <select 
                value={addressData.country || ''}
                onChange={(e) => handleInputChange(control.id, { ...addressData, country: e.target.value })}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
              >
                <option value="">Country</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
              </select>
            </div>
          </div>
        );
      
      case 'heading':
        const HeadingTag = control.properties.level || 'h2';
        return React.createElement(
          HeadingTag,
          {
            className: `font-bold text-${control.properties.alignment || 'left'} mb-2 text-gray-900 dark:text-white transition-colors`,
            style: {
              fontSize: control.properties.fontSize === 'small' ? '14px' : 
                       control.properties.fontSize === 'large' ? '24px' :
                       control.properties.fontSize === 'xl' ? '32px' : '18px',
              color: control.properties.color || undefined
            }
          },
          control.properties.text || 'Heading Text'
        );
      
      case 'sectionDivider':
        return (
          <hr 
            className="w-full my-4"
            style={{
              borderStyle: control.properties.style || 'solid',
              borderWidth: `${control.properties.thickness || 1}px 0 0 0`,
              borderColor: control.properties.color || '#e5e7eb',
              margin: control.properties.spacing === 'small' ? '8px 0' :
                      control.properties.spacing === 'large' ? '24px 0' : '16px 0'
            }}
          />
        );

      case 'progressBar':
        const progress = 45; // Mock progress value
        return (
          <div className="w-full">
            <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300 mb-1">
              <span>{control.properties.label || 'Progress'}</span>
              {control.properties.showPercentage && <span>{progress}%</span>}
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all" 
                style={{ 
                  width: `${progress}%`, 
                  backgroundColor: control.properties.color || '#3B82F6' 
                }}
              ></div>
            </div>
          </div>
        );

      // Security Controls
      case 'captcha':
        return (
          <div className="border border-gray-300 dark:border-gray-600 rounded-md p-4 bg-gray-50 dark:bg-gray-800 text-center transition-colors">
            <div className="w-32 h-16 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-2 flex items-center justify-center">
              <span className="text-xs text-gray-500 dark:text-gray-400">CAPTCHA</span>
            </div>
            <input 
              type="text" 
              placeholder="Enter code" 
              value={value}
              onChange={(e) => handleInputChange(control.id, e.target.value)}
              className="mt-2 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors" 
            />
          </div>
        );

      case 'termsConditions':
        return (
          <div className="space-y-2">
            <label className="flex items-start space-x-2">
              <input 
                type="checkbox" 
                checked={Boolean(value)}
                onChange={(e) => handleInputChange(control.id, e.target.checked)}
                className="mt-1 text-blue-600 focus:ring-blue-500 rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {control.properties.text || 'I agree to the terms and conditions'}
                {control.properties.linkText && (
                  <a href={control.properties.linkUrl || '#'} className="text-blue-600 dark:text-blue-400 ml-1 underline" target="_blank" rel="noopener noreferrer">
                    {control.properties.linkText}
                  </a>
                )}
              </span>
            </label>
          </div>
        );
      
      default:
        return (
          <div className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-3 text-center text-gray-500 dark:text-gray-400 transition-colors">
            {control.name}
          </div>
        );
    }
  };

  // Render control with theme-specific styling
  const renderThemedControl = (control: DroppedControl, theme: typeof FORM_THEMES.classic) => {
    const value = formData[control.id];
    
    // Apply theme input classes to input elements
    const getThemedInputProps = (additionalClasses = '') => ({
      className: `${theme.inputClass} ${additionalClasses}`,
      value: value || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => 
        handleInputChange(control.id, e.target.value)
    });

    switch (control.type) {
      case 'textInput':
        return <input type="text" placeholder={control.properties.placeholder || 'Enter text...'} {...getThemedInputProps()} />;
      
      case 'textarea':
        return (
          <textarea
            placeholder={control.properties.placeholder || 'Enter multiple lines...'}
            rows={control.properties.rows || 4}
            className={theme.inputClass}
            value={value || ''}
            onChange={(e) => handleInputChange(control.id, e.target.value)}
          />
        );
      
      case 'numberInput':
        return (
          <input
            type="number"
            min={control.properties.min}
            max={control.properties.max}
            step={control.properties.step}
            placeholder="Enter number..."
            {...getThemedInputProps()}
          />
        );

      case 'emailInput':
        return <input type="email" placeholder={control.properties.placeholder || 'Enter email address...'} {...getThemedInputProps()} />;

      case 'phoneInput':
        return <input type="tel" placeholder={control.properties.placeholder || '(555) 123-4567'} {...getThemedInputProps()} />;

      case 'dropdown':
        const options = control.properties.options?.split(',') || ['Option 1', 'Option 2'];
        return (
          <select className={theme.inputClass} value={value || ''} onChange={(e) => handleInputChange(control.id, e.target.value)}>
            <option value="">Select an option...</option>
            {options.map((option: string, index: number) => (
              <option key={index} value={option.trim()}>
                {option.trim()}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={Boolean(value)}
              onChange={(e) => handleInputChange(control.id, e.target.checked)}
              className="text-blue-600 focus:ring-blue-500 rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            />
            <span className="text-gray-700 dark:text-gray-300">{control.properties.text || 'Check this option'}</span>
          </div>
        );

      case 'radioButtons':
        const radioOptions = control.properties.options?.split(',') || ['Option 1', 'Option 2'];
        return (
          <div className="space-y-2">
            {radioOptions.map((option: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={control.id}
                  value={option.trim()}
                  checked={value === option.trim()}
                  onChange={(e) => handleInputChange(control.id, e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700 dark:text-gray-300">{option.trim()}</span>
              </div>
            ))}
          </div>
        );

      default:
        return renderControl(control);
    }
  };



  // Define variables first, before any early returns
  const currentSection = sections[activeSection];
  const sectionControls = droppedControls
    .filter(c => c.sectionId === currentSection?.id)
    .filter(isControlVisible); // Apply visibility filter

  const currentTheme = FORM_THEMES[selectedTheme];

  if (sections.length === 0) {
    return (
      <div className="flex-1 bg-gray-50 dark:bg-gray-800 flex items-center justify-center transition-colors">
        <div className="text-center">
          <Circle className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300 mb-2 transition-colors">No Sections Created</h3>
          <p className="text-gray-500 dark:text-gray-400 transition-colors">Create sections to organize your form controls.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-800 flex h-full transition-colors">
      {/* Theme Selector & Section Tabs - Fixed width sidebar */}
      <div className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-colors">
        {/* Theme Selector */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900 dark:text-white transition-colors">Theme Selection</h3>
            <button
              onClick={() => setShowThemeSelector(!showThemeSelector)}
              className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Toggle Theme Selector"
            >
              <Palette className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          
          {showThemeSelector && (
            <div className="space-y-2 mb-4">
              {Object.entries(FORM_THEMES).map(([key, theme]) => {
                const IconComponent = theme.icon;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedTheme(key as keyof typeof FORM_THEMES);
                      setShowThemeSelector(false);
                    }}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all ${
                      selectedTheme === key
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-600'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800 border-2 border-transparent'
                    }`}
                  >
                    <IconComponent className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{theme.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{theme.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
          
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <currentTheme.icon className="w-4 h-4" />
            <span>Current: {currentTheme.name}</span>
          </div>
        </div>

        {/* Form Progress Section */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900 dark:text-white transition-colors">Form Progress</h3>
            <BarChart3 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </div>
          
          {(() => {
            const completion = calculateFormCompletion();
            return (
              <div className="space-y-3">
                {/* Overall Progress */}
                <div>
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                    <span>Overall Progress</span>
                    <span>{completion.filledCount}/{completion.totalCount} fields</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-blue-500 transition-all duration-300" 
                      style={{ width: `${completion.overall}%` }}
                    ></div>
                  </div>
                  <div className="text-center text-sm font-medium text-gray-900 dark:text-white mt-1">
                    {completion.overall}%
                  </div>
                </div>

                {/* Required Fields Progress */}
                {completion.requiredTotal > 0 && (
                  <div>
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                      <span>Required Fields</span>
                      <span>{completion.requiredFilled}/{completion.requiredTotal} required</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          completion.required === 100 ? 'bg-green-500' : 'bg-orange-500'
                        }`}
                        style={{ width: `${completion.required}%` }}
                      ></div>
                    </div>
                    <div className={`text-center text-sm font-medium mt-1 ${
                      completion.required === 100 ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'
                    }`}>
                      {completion.required}%
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>

        {/* Tab Layout Themes */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900 dark:text-white transition-colors">Tab Themes</h3>
            <button
              onClick={() => setShowTabLayoutSelector(!showTabLayoutSelector)}
              className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Toggle Tab Theme Selector"
            >
              <Layout className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          
          {showTabLayoutSelector && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {Object.entries(TAB_LAYOUT_THEMES).map(([key, theme]) => (
                <button
                  key={key}
                  onClick={() => setSelectedTabLayout(key as keyof typeof TAB_LAYOUT_THEMES)}
                  className={`w-full p-3 rounded-lg text-left transition-all ${
                    selectedTabLayout === key
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-600'
                      : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="space-y-1">
                    <p className="font-medium text-gray-900 dark:text-white text-sm">{theme.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{theme.description}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
          
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mt-3">
            <Layout className="w-4 h-4" />
            <span>Current: {TAB_LAYOUT_THEMES[selectedTabLayout].name}</span>
          </div>
        </div>

        {/* Tab Alignment Settings */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900 dark:text-white transition-colors">Tab Position</h3>
            <Settings className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs text-gray-600 dark:text-gray-400 font-medium">Tab Alignment</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'top', icon: ArrowUp, label: 'Top' },
                { value: 'left', icon: ArrowLeft, label: 'Left' },
                { value: 'right', icon: ArrowRight, label: 'Right' }
              ].map(({ value, icon: IconComponent, label }) => (
                <button
                  key={value}
                  onClick={() => setTabAlignment(value as 'top' | 'left' | 'right')}
                  className={`flex flex-col items-center p-2 rounded-lg text-xs transition-all ${
                    tabAlignment === value
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800 border-2 border-transparent text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <IconComponent className="w-4 h-4 mb-1" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h3 className="font-medium text-gray-900 dark:text-white transition-colors">Form Sections</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 transition-colors">
            Navigate through form sections
          </p>
        </div>
        <div className="p-2 flex-1 overflow-y-auto">
          {sections.map((section, index) => {
            const status = getSectionStatus(section);
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(index)}
                className={`w-full flex items-center justify-between p-3 rounded-lg mb-2 text-left transition-colors ${
                  activeSection === index
                    ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {renderStatusIcon(status)}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white transition-colors">{section.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">{section.description}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Content - Scrollable area with theme and tab alignment */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-8 min-h-full">
            {/* Dynamic Layout using selected tab theme with alignment */}
            <div className="w-full max-w-none" key={`${selectedTabLayout}-${tabAlignment}`}>
              {(() => {
                // Use real sections if available, otherwise demo sections for theme preview
                const demoSections = [
                  { id: '1', name: 'Overview', description: 'Basic information' },
                  { id: '2', name: 'Analytics', description: 'Data analysis' },
                  { id: '3', name: 'Reports', description: 'Generated reports' },
                  { id: '4', name: 'Settings', description: 'Configuration' }
                ];
                
                const displaySections = sections.length > 0 ? sections : demoSections;
                const currentActiveTab = sections.length > 0 ? activeSection : demoActiveTab;
                const setCurrentActiveTab = sections.length > 0 ? setActiveSection : setDemoActiveTab;
                const currentSection = displaySections[currentActiveTab];
                
                // Content component
                const FormContent = () => (
                  <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 lg:p-8">
                    <div className="mb-6 lg:mb-8">
                      <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {currentSection?.name || 'Overview'}
                      </h1>
                      <p className="text-gray-600 dark:text-gray-300">
                        {currentSection?.description || 'Basic information'}
                      </p>
                    </div>
                    
                    {sections.length > 0 ? (
                      (() => {
                        const sectionControls = droppedControls.filter(c => c.sectionId === currentSection?.id);
                        return sectionControls.length === 0 ? (
                          <div className="text-center py-16">
                            <Circle className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                            <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300 mb-2">No controls in this section</h3>
                            <p className="text-gray-500 dark:text-gray-400">Add form controls to see the preview</p>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            {sectionControls
                              .sort((a, b) => a.y - b.y || a.x - b.x)
                              .map(control => (
                                <div key={control.id} className="relative group">
                                  <div className="space-y-2">
                                    {control.properties.label && (
                                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        {control.properties.required && (
                                          <span className="text-red-500 mr-1">*</span>
                                        )}
                                        {control.properties.label}
                                      </label>
                                    )}
                                    <div className="w-full">
                                      {renderThemedControl(control, FORM_THEMES[selectedTheme])}
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        );
                      })()
                    ) : (
                      <div className="text-center py-16">
                        <Circle className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300 mb-2">Tab Theme Demo</h3>
                        <p className="text-gray-500 dark:text-gray-400">Add form controls in the Design tab to see them here with the {TAB_LAYOUT_THEMES[selectedTabLayout].name} theme</p>
                      </div>
                    )}
                  </div>
                );
                
                // Layout based on alignment and theme
                if (selectedTabLayout === 'leftSidebar' || tabAlignment === 'left') {
                  return (
                    <div className="flex gap-4 lg:gap-8">
                      <div className="flex-shrink-0 w-64">
                        {selectedTabLayout === 'leftSidebar' ? (
                          TAB_LAYOUT_THEMES.leftSidebar.renderTabs(displaySections as any, currentActiveTab, setCurrentActiveTab)
                        ) : (
                          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-2">
                            {displaySections.map((section, index) => (
                              <button
                                key={section.id}
                                onClick={() => setCurrentActiveTab(index)}
                                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-all ${
                                  currentActiveTab === index
                                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                }`}
                              >
                                <span className="text-sm">{section.name}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="w-full max-w-4xl">
                          <FormContent />
                        </div>
                      </div>
                    </div>
                  );
                } else if (tabAlignment === 'right') {
                  return (
                    <div className="flex flex-row-reverse gap-4 lg:gap-8">
                      <div className="flex-shrink-0 w-64">
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-2">
                          {displaySections.map((section, index) => (
                            <button
                              key={section.id}
                              onClick={() => setCurrentActiveTab(index)}
                              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-all ${
                                currentActiveTab === index
                                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                              }`}
                            >
                              <span className="text-sm">{section.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="w-full max-w-4xl">
                          <FormContent />
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div className="w-full">
                      <div className="mb-6">
                        {TAB_LAYOUT_THEMES[selectedTabLayout].renderTabs(displaySections as any, currentActiveTab, setCurrentActiveTab)}
                      </div>
                      <div className="w-full max-w-4xl mx-auto">
                        <FormContent />
                      </div>
                    </div>
                  );
                }
              })()}
            </div>
          </div>
        </div>

        {/* Navigation - Fixed at bottom */}
        <div className="flex-shrink-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-6 transition-colors">
          <div className="flex justify-between">
            <button
              onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
              disabled={activeSection === 0}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setActiveSection(Math.min(sections.length - 1, activeSection + 1))}
              disabled={activeSection === sections.length - 1}
              className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};