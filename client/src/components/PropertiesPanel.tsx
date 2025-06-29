import React, { useState } from 'react';
import { DroppedControl, Section } from '../types';
import { Settings, Eye, Code, Palette, Link } from 'lucide-react';

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
  const [showDependencies, setShowDependencies] = useState(false);

  const handlePropertyChange = (property: string, value: any) => {
    if (selectedControl) {
      onUpdateControl(selectedControl.id, {
        properties: {
          ...selectedControl.properties,
          [property]: value
        }
      });
    }
  };

  const handleSectionChange = (sectionId: string) => {
    if (selectedControl) {
      onUpdateControl(selectedControl.id, { sectionId });
    }
  };

  const handlePositionChange = (property: 'x' | 'y' | 'width' | 'height', value: number) => {
    if (selectedControl) {
      onUpdateControl(selectedControl.id, { [property]: value });
    }
  };

  const handleDependencyChange = (dependencies: any[]) => {
    if (selectedControl) {
      handlePropertyChange('dependencies', dependencies);
    }
  };

  const addDependency = () => {
    const currentDependencies = selectedControl?.properties.dependencies || [];
    const newDependency = {
      controlId: '',
      condition: 'equals',
      value: ''
    };
    handleDependencyChange([...currentDependencies, newDependency]);
  };

  const removeDependency = (index: number) => {
    const currentDependencies = selectedControl?.properties.dependencies || [];
    const newDependencies = currentDependencies.filter((_: any, i: number) => i !== index);
    handleDependencyChange(newDependencies);
  };

  const updateDependency = (index: number, field: string, value: any) => {
    const currentDependencies = selectedControl?.properties.dependencies || [];
    const newDependencies = [...currentDependencies];
    newDependencies[index] = { ...newDependencies[index], [field]: value };
    handleDependencyChange(newDependencies);
  };

  // Get available controls for dependencies (excluding current control and first control)
  const availableControlsForDependencies = droppedControls.filter(control => 
    control.id !== selectedControl?.id && control.y === 0 // Only first control can be independent
  );

  if (!selectedControl) {
    return (
      <div className="w-full md:w-80 bg-white dark:bg-gray-900 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700 p-4 sm:p-6 transition-colors">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <Settings className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
          <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2 transition-colors">No Control Selected</h3>
          <p className="text-sm">
            Click on a control in the canvas to view and edit its properties.
          </p>
        </div>
      </div>
    );
  }

  const isFirstControl = selectedControl.y === 0;

  return (
    <div className="w-full md:w-80 bg-white dark:bg-gray-900 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700 flex flex-col transition-colors">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 transition-colors">Properties Panel</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">
          Editing: <span className="font-medium text-gray-700 dark:text-gray-300">{selectedControl.name}</span>
        </p>
        {isFirstControl && (
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
            First control - Always visible
          </p>
        )}
      </div>

      {/* Properties Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Section Assignment */}
        <div>
          <h3 className="flex items-center text-sm font-medium text-gray-900 dark:text-white mb-3 transition-colors">
            <Eye className="w-4 h-4 mr-2" />
            Section Assignment
          </h3>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">Assign to Section</label>
            <select
              value={selectedControl.sectionId || 'default'}
              onChange={(e) => handleSectionChange(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
            >
              {sections.map(section => (
                <option key={section.id} value={section.id}>
                  {section.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dependencies Section - Only show for non-first controls */}
        {!isFirstControl && (
          <div>
            <h3 className="flex items-center text-sm font-medium text-gray-900 dark:text-white mb-3 transition-colors">
              <Link className="w-4 h-4 mr-2" />
              Dependencies
              <button
                onClick={() => setShowDependencies(!showDependencies)}
                className="ml-auto text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                {showDependencies ? 'Hide' : 'Show'}
              </button>
            </h3>
            
            {showDependencies && (
              <div className="space-y-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Control visibility based on other control values
                </p>
                
                {selectedControl.properties.dependencies?.map((dependency: any, index: number) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-md p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Rule {index + 1}</span>
                      <button
                        onClick={() => removeDependency(index)}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Depends on Control</label>
                      <select
                        value={dependency.controlId}
                        onChange={(e) => updateDependency(index, 'controlId', e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        <option value="">Select control...</option>
                        {availableControlsForDependencies.map(control => (
                          <option key={control.id} value={control.id}>
                            {control.properties.label || control.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Condition</label>
                      <select
                        value={dependency.condition}
                        onChange={(e) => updateDependency(index, 'condition', e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        <option value="equals">Equals</option>
                        <option value="not_equals">Not Equals</option>
                        <option value="contains">Contains</option>
                        <option value="greater_than">Greater Than</option>
                        <option value="less_than">Less Than</option>
                        <option value="is_empty">Is Empty</option>
                        <option value="is_not_empty">Is Not Empty</option>
                      </select>
                    </div>
                    
                    {dependency.condition !== 'is_empty' && dependency.condition !== 'is_not_empty' && (
                      <div>
                        <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Value</label>
                        <input
                          type="text"
                          value={dependency.value}
                          onChange={(e) => updateDependency(index, 'value', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="Enter value..."
                        />
                      </div>
                    )}
                  </div>
                ))}
                
                <button
                  onClick={addDependency}
                  className="w-full px-3 py-2 text-xs border border-dashed border-gray-300 dark:border-gray-600 rounded-md text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  + Add Dependency Rule
                </button>
              </div>
            )}
          </div>
        )}

        {/* Position & Size */}
        <div>
          <h3 className="flex items-center text-sm font-medium text-gray-900 dark:text-white mb-3 transition-colors">
            <Eye className="w-4 h-4 mr-2" />
            Position & Size
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">Order</label>
              <input
                type="number"
                value={selectedControl.y}
                onChange={(e) => handlePositionChange('y', parseInt(e.target.value) || 0)}
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">Width</label>
              <input
                type="number"
                value={selectedControl.width}
                onChange={(e) => handlePositionChange('width', parseInt(e.target.value) || 100)}
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Basic Properties */}
        <div>
          <h3 className="flex items-center text-sm font-medium text-gray-900 dark:text-white mb-3 transition-colors">
            <Settings className="w-4 h-4 mr-2" />
            Basic Properties
          </h3>
          <div className="space-y-3">
            {Object.entries(selectedControl.properties).map(([key, value]) => {
              // Skip dependencies as they're handled separately
              if (key === 'dependencies') return null;
              
              return (
                <div key={key}>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 capitalize transition-colors">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  {typeof value === 'boolean' ? (
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => handlePropertyChange(key, e.target.checked)}
                        className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 bg-white dark:bg-gray-800"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 transition-colors">
                        {key === 'required' ? 'Required field' : 'Enable'}
                      </span>
                    </label>
                  ) : typeof value === 'number' ? (
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => handlePropertyChange(key, parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                    />
                  ) : key === 'options' ? (
                    <textarea
                      value={value}
                      onChange={(e) => handlePropertyChange(key, e.target.value)}
                      placeholder="Option 1,Option 2,Option 3"
                      rows={3}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                    />
                  ) : (
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handlePropertyChange(key, e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Advanced Properties */}
        <div>
          <h3 className="flex items-center text-sm font-medium text-gray-900 dark:text-white mb-3 transition-colors">
            <Code className="w-4 h-4 mr-2" />
            Advanced
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">CSS Classes</label>
              <input
                type="text"
                placeholder="custom-class another-class"
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">Custom ID</label>
              <input
                type="text"
                placeholder="control-id"
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Styling */}
        <div>
          <h3 className="flex items-center text-sm font-medium text-gray-900 dark:text-white mb-3 transition-colors">
            <Palette className="w-4 h-4 mr-2" />
            Styling
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">Background</label>
              <input
                type="color"
                defaultValue="#ffffff"
                className="w-full h-8 border border-gray-300 dark:border-gray-600 rounded cursor-pointer bg-white dark:bg-gray-800"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">Border</label>
              <input
                type="color"
                defaultValue="#d1d5db"
                className="w-full h-8 border border-gray-300 dark:border-gray-600 rounded cursor-pointer bg-white dark:bg-gray-800"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};