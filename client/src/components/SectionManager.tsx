import React, { useState } from 'react';
import { Section } from '../types';
import { Plus, Settings, Trash2, Edit3 } from 'lucide-react';
import * as Icons from 'lucide-react';

interface SectionManagerProps {
  sections: Section[];
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
  onCreateSection: (section: Omit<Section, 'id' | 'controls' | 'validation'>) => void;
  onUpdateSection: (id: string, updates: Partial<Section>) => void;
  onDeleteSection: (id: string) => void;
}

export const SectionManager: React.FC<SectionManagerProps> = ({
  sections,
  activeSection,
  onSectionChange,
  onCreateSection,
  onUpdateSection,
  onDeleteSection
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
    icon: 'Layout',
    required: false,
    order: sections.length
  });

  const iconOptions = [
    'Layout', 'User', 'Mail', 'Phone', 'MapPin', 'Calendar', 'FileText', 
    'Settings', 'Shield', 'CreditCard', 'Building', 'Briefcase'
  ];

  const colorOptions = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', 
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6B7280'
  ];

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent className="w-4 h-4" /> : <Icons.Layout className="w-4 h-4" />;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSection) {
      onUpdateSection(editingSection, formData);
      setEditingSection(null);
    } else {
      onCreateSection(formData);
      setShowCreateForm(false);
    }
    setFormData({
      name: '',
      description: '',
      color: '#3B82F6',
      icon: 'Layout',
      required: false,
      order: sections.length
    });
  };

  const handleEdit = (section: Section) => {
    setFormData({
      name: section.name,
      description: section.description,
      color: section.color,
      icon: section.icon,
      required: section.required,
      order: section.order
    });
    setEditingSection(section.id);
    setShowCreateForm(true);
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setEditingSection(null);
    setFormData({
      name: '',
      description: '',
      color: '#3B82F6',
      icon: 'Layout',
      required: false,
      order: sections.length
    });
  };

  const isDefaultSection = (sectionId: string) => sectionId === 'default';

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-colors">
      {/* Section Tabs */}
      <div className="px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-1 overflow-x-auto">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeSection === section.id
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              style={{
                borderLeftColor: section.color,
                borderLeftWidth: activeSection === section.id ? '3px' : '0'
              }}
            >
              <div style={{ color: section.color }}>
                {getIcon(section.icon)}
              </div>
              <span>{section.name}</span>
              {section.required && (
                <span className="text-red-500 text-xs">*</span>
              )}
              <div className="flex items-center space-x-1 ml-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(section);
                  }}
                  className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded transition-colors"
                  title={isDefaultSection(section.id) ? "Rename section" : "Edit section"}
                >
                  <Edit3 className="w-3 h-3" />
                </button>
                {!isDefaultSection(section.id) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSection(section.id);
                    }}
                    className="p-1 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 rounded transition-colors"
                    title="Delete section"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2 px-3 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Section</span>
        </button>
      </div>

      {/* Create/Edit Section Form */}
      {showCreateForm && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800 transition-colors">
          <form onSubmit={handleSubmit} className="max-w-2xl">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 transition-colors">
              {editingSection ? 
                (isDefaultSection(editingSection) ? 'Rename Section' : 'Edit Section') : 
                'Create New Section'
              }
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                  Section Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                  placeholder="e.g., Personal Information"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                  Icon
                </label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                >
                  {iconOptions.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                  rows={2}
                  placeholder="Brief description of this section"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                  Color
                </label>
                <div className="flex space-x-2">
                  {colorOptions.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-8 h-8 rounded-full border-2 transition-colors ${
                        formData.color === color ? 'border-gray-900 dark:border-white' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Only show required checkbox for non-default sections or when creating new sections */}
              {(!editingSection || !isDefaultSection(editingSection)) && (
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.required}
                      onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
                      className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 bg-white dark:bg-gray-700"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">Required Section</span>
                  </label>
                </div>
              )}

              {/* Show info for default section */}
              {editingSection && isDefaultSection(editingSection) && (
                <div className="col-span-2">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-md p-3">
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      <strong>Note:</strong> This is the default section. You can rename it and change its appearance, but it cannot be deleted or marked as required.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3 mt-6">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                {editingSection ? 
                  (isDefaultSection(editingSection) ? 'Rename Section' : 'Update Section') : 
                  'Create Section'
                }
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};