import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { ControlType } from '../types';
import { CONTROLS, CONTROL_CATEGORIES } from '../data/controls';
import { ChevronRight, Search } from 'lucide-react';
import * as Icons from 'lucide-react';

interface ControlLibraryProps {
  onDragStart: (control: ControlType) => void;
}

interface DraggableControlProps {
  control: ControlType;
  onDragStart: (control: ControlType) => void;
}

const DraggableControl: React.FC<DraggableControlProps> = ({ control, onDragStart }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'CONTROL_TYPE',
    item: () => {
      onDragStart(control);
      return control;
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent className="w-4 h-4" /> : <Icons.Square className="w-4 h-4" />;
  };

  return (
    <div
      ref={drag}
      className={`p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-move hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all bg-white dark:bg-gray-800 group ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900 transition-colors">
          {getIcon(control.icon)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
            {control.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
            {control.description}
          </p>
          <span className="inline-block mt-2 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-300 rounded">
            {control.category}
          </span>
        </div>
      </div>
    </div>
  );
};

export const ControlLibrary: React.FC<ControlLibraryProps> = ({ onDragStart }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredControls = CONTROLS.filter(control => {
    const matchesSearch = control.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         control.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || control.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full lg:w-80 bg-white dark:bg-gray-900 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700 flex flex-col transition-colors">
      {/* Header */}
      <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 transition-colors">Control Library</h2>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search controls..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
          />
        </div>

        {/* Category Filter */}
        <div className="space-y-1 max-h-32 overflow-y-auto">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              !selectedCategory ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            All Categories
          </button>
          {CONTROL_CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                selectedCategory === category ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {category}
              <ChevronRight className="w-3 h-3" />
            </button>
          ))}
        </div>
      </div>

      {/* Controls List */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 max-h-64 lg:max-h-none">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-3">
          {filteredControls.map(control => (
            <DraggableControl
              key={control.id}
              control={control}
              onDragStart={onDragStart}
            />
          ))}
        </div>
        
        {filteredControls.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No controls found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};