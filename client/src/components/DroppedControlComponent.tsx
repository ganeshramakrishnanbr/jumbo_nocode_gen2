import React from 'react';
import { DroppedControl } from '../types';
import { Move, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

interface DroppedControlComponentProps {
  control: DroppedControl;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<DroppedControl>) => void;
  onMove?: (id: string, direction: 'up' | 'down') => void;
  onRemove?: (id: string) => void;
  isInOrderedLayout?: boolean;
}

export const DroppedControlComponent: React.FC<DroppedControlComponentProps> = ({
  control,
  isSelected,
  onSelect,
  onUpdate,
  onMove,
  onRemove,
  isInOrderedLayout = false
}) => {
  const renderControl = () => {
    const commonProps = {
      className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent",
      style: { pointerEvents: 'none' as const }
    };

    switch (control.type) {
      case 'textInput':
        return (
          <input
            type="text"
            placeholder={control.properties.placeholder || 'Enter text...'}
            {...commonProps}
          />
        );
      
      case 'textarea':
        return (
          <textarea
            placeholder={control.properties.placeholder || 'Enter multiple lines...'}
            rows={control.properties.rows || 4}
            {...commonProps}
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
            {...commonProps}
          />
        );
      
      case 'dropdown':
        const options = control.properties.options?.split(',') || ['Option 1', 'Option 2'];
        return (
          <select {...commonProps}>
            <option value="">Select an option...</option>
            {options.map((option: string, index: number) => (
              <option key={index} value={option.trim()}>
                {option.trim()}
              </option>
            ))}
          </select>
        );
      
      case 'radioGroup':
        const radioOptions = control.properties.options?.split(',') || ['Option 1', 'Option 2'];
        return (
          <div className={`space-${control.properties.layout === 'horizontal' ? 'x' : 'y'}-3 ${
            control.properties.layout === 'horizontal' ? 'flex flex-wrap' : ''
          }`}>
            {radioOptions.map((option: string, index: number) => (
              <label key={index} className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  name={control.id} 
                  style={{ pointerEvents: 'none' }}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{option.trim()}</span>
              </label>
            ))}
          </div>
        );
      
      case 'checkboxGroup':
        const checkboxOptions = control.properties.options?.split(',') || ['Option 1', 'Option 2'];
        return (
          <div className={`space-${control.properties.layout === 'horizontal' ? 'x' : 'y'}-3 ${
            control.properties.layout === 'horizontal' ? 'flex flex-wrap' : ''
          }`}>
            {checkboxOptions.map((option: string, index: number) => (
              <label key={index} className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  style={{ pointerEvents: 'none' }}
                  className="text-blue-600 focus:ring-blue-500 rounded"
                />
                <span className="text-sm text-gray-700">{option.trim()}</span>
              </label>
            ))}
          </div>
        );
      
      case 'datePicker':
        return <input type="date" {...commonProps} />;
      
      case 'timePicker':
        return <input type="time" {...commonProps} />;
      
      case 'fileUpload':
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <p className="text-gray-500 text-sm">Click to upload or drag files here</p>
            <p className="text-xs text-gray-400 mt-1">
              {control.properties.accept || 'All files'} • Max {control.properties.maxSize || 10}MB
            </p>
          </div>
        );
      
      case 'heading':
        const HeadingTag = control.properties.level || 'h2';
        return React.createElement(
          HeadingTag,
          {
            className: `font-bold text-${control.properties.alignment || 'left'} text-gray-900`,
            style: { pointerEvents: 'none' }
          },
          control.properties.text || 'Heading Text'
        );
      
      case 'paragraph':
        return (
          <p 
            className={`text-${control.properties.alignment || 'left'} text-gray-700`}
            style={{ pointerEvents: 'none' }}
          >
            {control.properties.text || 'This is a paragraph of text.'}
          </p>
        );
      
      case 'divider':
        return (
          <hr 
            className="w-full"
            style={{
              borderStyle: control.properties.style || 'solid',
              borderWidth: `${control.properties.thickness || 1}px 0 0 0`,
              borderColor: control.properties.color || '#e5e7eb',
              pointerEvents: 'none'
            }}
          />
        );
      
      default:
        return (
          <div className="bg-gray-100 border border-gray-300 rounded-md p-3 text-center text-gray-500">
            {control.name}
          </div>
        );
    }
  };

  if (isInOrderedLayout) {
    return (
      <div className="relative group">
        {/* Control Content */}
        <div className="w-full">
          {renderControl()}
        </div>

        {/* Selection Overlay for Ordered Layout */}
        {isSelected && (
          <div className="absolute -inset-2 border-2 border-blue-500 rounded-lg pointer-events-none">
            {/* Control Actions */}
            <div className="absolute -top-10 left-0 flex items-center space-x-1 pointer-events-auto">
              <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center space-x-1">
                <Move className="w-3 h-3" />
                <span>{control.name}</span>
              </div>
              {onMove && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMove(control.id, 'up');
                  }}
                  className="bg-gray-600 text-white p-1 rounded hover:bg-gray-700 transition-colors"
                  title="Move Up"
                >
                  <ArrowUp className="w-3 h-3" />
                </button>
              )}
              {onMove && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMove(control.id, 'down');
                  }}
                  className="bg-gray-600 text-white p-1 rounded hover:bg-gray-700 transition-colors"
                  title="Move Down"
                >
                  <ArrowDown className="w-3 h-3" />
                </button>
              )}
              {onRemove && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(control.id);
                  }}
                  className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Original absolute positioning layout (kept for backward compatibility)
  return (
    <div
      className={`absolute cursor-pointer group ${
        isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
      }`}
      style={{
        left: control.x,
        top: control.y,
        width: control.width,
        minHeight: control.height,
        zIndex: isSelected ? 10 : 1
      }}
      onClick={onSelect}
    >
      {/* Control Label */}
      {control.properties.label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {control.properties.label}
          {control.properties.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Control Content */}
      <div className="bg-white border border-gray-300 rounded-md p-2">
        {renderControl()}
      </div>

      {/* Selection Overlay */}
      {isSelected && (
        <>
          {/* Drag Handle */}
          <div className="absolute -top-8 left-0 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center space-x-1">
            <Move className="w-3 h-3" />
            <span>{control.name}</span>
          </div>

          {/* Delete Button */}
          {onRemove && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(control.id);
              }}
              className="absolute -top-8 right-0 bg-red-500 text-white p-1 rounded hover:bg-red-600 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}

          {/* Resize Handles */}
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded cursor-se-resize"></div>
        </>
      )}
    </div>
  );
};