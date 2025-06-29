import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { DroppedControl, ControlType } from '../types';
import { DraggableControlComponent } from './DraggableControlComponent';
import { Grid, Plus } from 'lucide-react';

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

  const [{ isOver }, drop] = useDrop({
    accept: 'CONTROL_TYPE',
    drop: (item: ControlType) => {
      onDrop(item, 0, droppedControls.length);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onControlSelect(null as any);
    }
  };

  // Sort controls by their order (y position represents order)
  const sortedControls = [...droppedControls].sort((a, b) => a.y - b.y);

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-800 relative overflow-auto transition-colors">
      {/* Canvas Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex items-center justify-between sticky top-0 z-10 transition-colors">
        <div className="flex items-center space-x-4">
          <h3 className="font-medium text-gray-900 dark:text-white transition-colors">Design Canvas</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 transition-colors">
            <Grid className="w-4 h-4" />
            <span>Form Layout</span>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 transition-colors">
          <span>Controls: {droppedControls.length}</span>
          {selectedControl && (
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded transition-colors">
              {selectedControl.name} Selected
            </span>
          )}
        </div>
      </div>

      {/* Canvas Area */}
      <div
        ref={(node) => {
          canvasRef.current = node;
          drop(node);
        }}
        className={`relative min-h-full p-6 transition-colors ${
          isOver ? 'bg-blue-50 dark:bg-blue-900/20' : ''
        }`}
        onClick={handleCanvasClick}
      >
        {/* Drop Zone Hint */}
        {droppedControls.length === 0 && (
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4 transition-colors">
                <Plus className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300 mb-2 transition-colors">
                Start Building Your Form Section
              </h3>
              <p className="text-gray-500 dark:text-gray-400 transition-colors">
                Drag controls from the library on the left to start building this section.
                Controls will be arranged in order with labels on the left side.
              </p>
            </div>
          </div>
        )}

        {/* Form Container */}
        {droppedControls.length > 0 && (
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 transition-colors">
            <div className="space-y-6">
              {sortedControls.map((control, index) => (
                <DraggableControlComponent
                  key={control.id}
                  control={control}
                  index={index}
                  isSelected={selectedControl?.id === control.id}
                  onSelect={() => onControlSelect(control)}
                  onUpdate={(updates) => onControlUpdate(control.id, updates)}
                  onMove={onControlMove}
                  onRemove={onControlRemove}
                  onReorder={onControlReorder}
                />
              ))}
            </div>
          </div>
        )}

        {/* Drop Preview */}
        {isOver && (
          <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 bg-opacity-50 border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-lg flex items-center justify-center z-20 pointer-events-none transition-colors">
            <div className="text-blue-600 dark:text-blue-300 text-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-colors">
              <Plus className="w-8 h-8 mx-auto mb-2" />
              <p className="font-medium">Add Control to Section</p>
              <p className="text-sm">Will be added to the end of this section</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};