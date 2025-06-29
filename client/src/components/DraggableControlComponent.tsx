import React, { useRef } from 'react';
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd';
import { DroppedControl } from '../types';
import { Move, Trash2, ArrowUp, ArrowDown, GripVertical } from 'lucide-react';

interface DraggableControlComponentProps {
  control: DroppedControl;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<DroppedControl>) => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
  onRemove: (id: string) => void;
  onReorder: (dragIndex: number, hoverIndex: number) => void;
}

export const DraggableControlComponent: React.FC<DraggableControlComponentProps> = ({
  control,
  index,
  isSelected,
  onSelect,
  onUpdate,
  onMove,
  onRemove,
  onReorder
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag, preview] = useDrag({
    type: 'CONTROL_ITEM',
    item: { index, id: control.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'CONTROL_ITEM',
    hover: (item: { index: number; id: string }, monitor: DropTargetMonitor) => {
      if (!ref.current) return;
      
      const dragIndex = item.index;
      const hoverIndex = index;
      
      if (dragIndex === hoverIndex) return;
      
      // Get the bounding rectangle of the hovered element
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
      
      onReorder(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  // Connect drag and drop
  drag(drop(ref));

  const renderControl = () => {
    const commonProps = {
      className: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors",
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

      case 'emailInput':
        return (
          <input
            type="email"
            placeholder={control.properties.placeholder || 'Enter email address...'}
            {...commonProps}
          />
        );

      case 'phoneInput':
        return (
          <input
            type="tel"
            placeholder={control.properties.placeholder || '(555) 123-4567'}
            {...commonProps}
          />
        );

      case 'urlInput':
        return (
          <input
            type="url"
            placeholder={control.properties.placeholder || 'https://example.com'}
            {...commonProps}
          />
        );

      case 'passwordInput':
        return (
          <input
            type="password"
            placeholder={control.properties.placeholder || 'Enter password...'}
            {...commonProps}
          />
        );

      case 'richTextEditor':
        return (
          <div className="border border-gray-300 dark:border-gray-600 rounded-md p-3 bg-white dark:bg-gray-800 min-h-[100px] transition-colors">
            <div className="text-gray-500 dark:text-gray-400 text-sm">Rich text editor placeholder</div>
          </div>
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

      case 'multiSelectDropdown':
        const multiOptions = control.properties.options?.split(',') || ['Option 1', 'Option 2'];
        return (
          <div className="border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-800 min-h-[40px] transition-colors">
            <div className="text-gray-500 dark:text-gray-400 text-sm">Multi-select dropdown</div>
          </div>
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
                  className="text-blue-600 focus:ring-blue-500 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{option.trim()}</span>
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
                  className="text-blue-600 focus:ring-blue-500 rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{option.trim()}</span>
              </label>
            ))}
          </div>
        );

      case 'buttonGroup':
        const buttonOptions = control.properties.options?.split(',') || ['Option 1', 'Option 2'];
        return (
          <div className="flex flex-wrap gap-2">
            {buttonOptions.map((option: string, index: number) => (
              <button
                key={index}
                type="button"
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                style={{ pointerEvents: 'none' }}
              >
                {option.trim()}
              </button>
            ))}
          </div>
        );

      case 'ratingScale':
        const maxRating = control.properties.maxValue || 5;
        const isStars = control.properties.scaleType === 'stars';
        return (
          <div className="flex items-center space-x-1">
            {Array.from({ length: maxRating }, (_, i) => (
              <span key={i} className="text-2xl text-gray-300 dark:text-gray-600">
                {isStars ? '★' : i + 1}
              </span>
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
              defaultValue={control.properties.defaultValue || 50}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              style={{ pointerEvents: 'none' }}
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>{control.properties.min || 0}</span>
              <span>{control.properties.max || 100}</span>
            </div>
          </div>
        );

      case 'toggleSwitch':
        return (
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-700 dark:text-gray-300">{control.properties.offLabel || 'Off'}</span>
            <div className="relative inline-block w-10 h-6 bg-gray-200 dark:bg-gray-700 rounded-full">
              <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform"></div>
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300">{control.properties.onLabel || 'On'}</span>
          </div>
        );

      case 'tagInput':
        const predefinedTags = control.properties.predefinedTags?.split(',') || ['Tag1', 'Tag2'];
        return (
          <div className="border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-800 min-h-[40px] transition-colors">
            <div className="flex flex-wrap gap-1">
              {predefinedTags.slice(0, 3).map((tag: string, index: number) => (
                <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
                  {tag.trim()}
                </span>
              ))}
            </div>
          </div>
        );
      
      case 'datePicker':
        return <input type="date" {...commonProps} />;
      
      case 'timePicker':
        return <input type="time" {...commonProps} />;

      case 'dateRangePicker':
        return (
          <div className="flex items-center space-x-2">
            <input type="date" {...commonProps} className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors" />
            <span className="text-gray-500 dark:text-gray-400">to</span>
            <input type="date" {...commonProps} className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors" />
          </div>
        );
      
      case 'fileUpload':
        return (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center bg-gray-50 dark:bg-gray-800 transition-colors">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Click to upload or drag files here</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {control.properties.accept || 'All files'} • Max {control.properties.maxSize || 10}MB
            </p>
          </div>
        );

      case 'imageUpload':
        return (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center bg-gray-50 dark:bg-gray-800 transition-colors">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Click to upload images</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {control.properties.accept || 'Images'} • Max {control.properties.maxSize || 5}MB
            </p>
          </div>
        );

      case 'signaturePad':
        return (
          <div 
            className="border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 flex items-center justify-center transition-colors"
            style={{ 
              width: control.properties.canvasWidth || 400, 
              height: control.properties.canvasHeight || 200 
            }}
          >
            <p className="text-gray-500 dark:text-gray-400 text-sm">Signature area</p>
          </div>
        );

      case 'colorPicker':
        return (
          <div className="flex items-center space-x-3">
            <input
              type="color"
              defaultValue={control.properties.defaultColor || '#3B82F6'}
              className="w-12 h-8 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
              style={{ pointerEvents: 'none' }}
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">{control.properties.defaultColor || '#3B82F6'}</span>
          </div>
        );

      // Grid & Matrix Controls
      case 'singleSelectiveGrid':
      case 'multiSelectiveGrid':
        const rowLabels = control.properties.rowLabels?.split(',') || ['Row 1', 'Row 2'];
        const columnOptions = control.properties.columnOptions?.split(',') || ['Col 1', 'Col 2'];
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
                    {columnOptions.map((_, colIndex: number) => (
                      <td key={colIndex} className="border border-gray-300 dark:border-gray-600 px-2 py-1 text-center">
                        <input 
                          type={control.type === 'singleSelectiveGrid' ? 'radio' : 'checkbox'}
                          name={control.type === 'singleSelectiveGrid' ? `grid-${rowIndex}` : undefined}
                          style={{ pointerEvents: 'none' }}
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

      // Address Controls
      case 'addressLine1':
      case 'addressLine2':
      case 'city':
      case 'zipPostal':
        return (
          <input
            type="text"
            placeholder={control.properties.placeholder}
            {...commonProps}
          />
        );

      case 'stateProvince':
        if (control.properties.inputType === 'dropdown') {
          return (
            <select {...commonProps}>
              <option value="">Select state...</option>
              <option value="CA">California</option>
              <option value="NY">New York</option>
              <option value="TX">Texas</option>
            </select>
          );
        }
        return (
          <input
            type="text"
            placeholder="Enter state/province"
            {...commonProps}
          />
        );

      case 'country':
        return (
          <select {...commonProps}>
            <option value="">Select country...</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="UK">United Kingdom</option>
          </select>
        );

      case 'completeAddress':
        return (
          <div className="space-y-3">
            <input type="text" placeholder="Street address" {...commonProps} />
            {control.properties.includeAddressLine2 && (
              <input type="text" placeholder="Apartment, suite, etc." {...commonProps} />
            )}
            <div className="grid grid-cols-2 gap-3">
              <input type="text" placeholder="City" {...commonProps} />
              <input type="text" placeholder="State" {...commonProps} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input type="text" placeholder="ZIP Code" {...commonProps} />
              <select {...commonProps}>
                <option value="">Country</option>
                <option value="US">United States</option>
              </select>
            </div>
          </div>
        );
      
      case 'heading':
        const HeadingTag = control.properties.level || 'h2';
        return React.createElement(
          HeadingTag,
          {
            className: `font-bold text-${control.properties.alignment || 'left'} text-gray-900 dark:text-white transition-colors`,
            style: { 
              pointerEvents: 'none',
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
            className="w-full"
            style={{
              borderStyle: control.properties.style || 'solid',
              borderWidth: `${control.properties.thickness || 1}px 0 0 0`,
              borderColor: control.properties.color || '#e5e7eb',
              margin: control.properties.spacing === 'small' ? '8px 0' :
                      control.properties.spacing === 'large' ? '24px 0' : '16px 0',
              pointerEvents: 'none'
            }}
          />
        );

      case 'progressBar':
        return (
          <div className="w-full">
            <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300 mb-1">
              <span>{control.properties.label || 'Progress'}</span>
              {control.properties.showPercentage && <span>45%</span>}
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-colors" 
                style={{ 
                  width: '45%', 
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
            <input type="text" placeholder="Enter code" {...commonProps} className="mt-2" />
          </div>
        );

      case 'termsConditions':
        return (
          <div className="space-y-2">
            <label className="flex items-start space-x-2">
              <input 
                type="checkbox" 
                style={{ pointerEvents: 'none' }}
                className="mt-1 text-blue-600 focus:ring-blue-500 rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {control.properties.text || 'I agree to the terms and conditions'}
                {control.properties.linkText && (
                  <a href="#" className="text-blue-600 dark:text-blue-400 ml-1 underline">
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

  return (
    <div
      ref={ref}
      className={`group relative flex items-start space-x-4 p-4 rounded-lg transition-all ${
        isDragging 
          ? 'opacity-30 scale-105 shadow-lg z-50 bg-white dark:bg-gray-900 border-2 border-blue-400' 
          : isOver 
            ? 'bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-300 dark:border-blue-600' 
            : isSelected
              ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-600'
              : 'hover:bg-gray-50 dark:hover:bg-gray-800 border-2 border-transparent'
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Drag Handle */}
      <div 
        className="flex-shrink-0 pt-2 cursor-move opacity-60 group-hover:opacity-100 transition-opacity"
        {...drag}
      >
        <GripVertical className="w-5 h-5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300" />
      </div>

      {/* Label Column */}
      <div className="w-48 flex-shrink-0 pt-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
          {control.properties.required && (
            <span className="text-red-500 mr-1">*</span>
          )}
          {control.properties.label || control.name}
        </label>
        {control.properties.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors">
            {control.properties.description}
          </p>
        )}
      </div>

      {/* Control Column */}
      <div className="flex-1">
        {renderControl()}
      </div>

      {/* Actions Column */}
      <div className="flex-shrink-0 flex items-center space-x-2">
        {/* Order Indicator */}
        <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 rounded-full w-6 h-6 flex items-center justify-center transition-colors">
          {index + 1}
        </span>
        
        {/* Always visible delete button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(control.id);
          }}
          className="opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full transition-all duration-200 hover:scale-110"
          title="Delete Control"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>

      {/* Selection Overlay */}
      {isSelected && (
        <div className="absolute -inset-2 border-2 border-blue-500 dark:border-blue-400 rounded-lg pointer-events-none">
          {/* Control Actions */}
          <div className="absolute -top-10 left-0 flex items-center space-x-1 pointer-events-auto">
            <div className="bg-blue-500 dark:bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium flex items-center space-x-1">
              <Move className="w-3 h-3" />
              <span>{control.name}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMove(control.id, 'up');
              }}
              className="bg-gray-600 dark:bg-gray-700 text-white p-1 rounded hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
              title="Move Up"
            >
              <ArrowUp className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMove(control.id, 'down');
              }}
              className="bg-gray-600 dark:bg-gray-700 text-white p-1 rounded hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
              title="Move Down"
            >
              <ArrowDown className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(control.id);
              }}
              className="bg-red-500 dark:bg-red-600 text-white p-1 rounded hover:bg-red-600 dark:hover:bg-red-500 transition-colors"
              title="Delete"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};