import React from 'react';
import { CustomerTier } from '../types';
import { TIER_CONFIGS } from '../data/tiers';
import { Settings, Download, Upload, Save, Eye, Code, BarChart3 } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  currentTier: CustomerTier;
  onTierChange: (tier: CustomerTier) => void;
  activeTab: 'dashboard' | 'design' | 'preview' | 'json';
  onTabChange: (tab: 'dashboard' | 'design' | 'preview' | 'json') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTier,
  onTierChange,
  activeTab,
  onTabChange
}) => {
  const tierConfig = TIER_CONFIGS[currentTier];
  
  // Show controls only for design, preview, and JSON tabs
  const showControls = activeTab !== 'dashboard';

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">
                Jumbo No-Code Builder
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">
                Professional Form Builder Platform
              </p>
            </div>
          </div>

          {/* Center Tabs */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 transition-colors">
            <button
              onClick={() => onTabChange('dashboard')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Dashboard
            </button>
            <button
              onClick={() => onTabChange('design')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'design'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4 inline mr-2" />
              Design
            </button>
            <button
              onClick={() => onTabChange('preview')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'preview'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Eye className="w-4 h-4 inline mr-2" />
              Preview
            </button>
            <button
              onClick={() => onTabChange('json')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'json'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Code className="w-4 h-4 inline mr-2" />
              JSON
            </button>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle - Always visible */}
            <ThemeToggle />

            {/* Conditional Controls - Only show on design, preview, and JSON tabs */}
            {showControls && (
              <>
                {/* Toolbar Buttons */}
                <div className="flex items-center space-x-2">
                  <button 
                    className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Import Form"
                  >
                    <Upload className="w-5 h-5" />
                  </button>
                  <button 
                    className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Export Form"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button 
                    className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Save Form"
                  >
                    <Save className="w-5 h-5" />
                  </button>
                </div>

                {/* Tier Selection */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300 transition-colors">Tier:</span>
                  <select
                    value={currentTier}
                    onChange={(e) => onTierChange(e.target.value as CustomerTier)}
                    className={`px-3 py-2 rounded-lg border-2 ${tierConfig.color} ${tierConfig.bgColor} ${tierConfig.textColor} font-medium text-sm dark:bg-gray-800 dark:border-gray-600 transition-colors`}
                  >
                    {Object.entries(TIER_CONFIGS).map(([key, config]) => (
                      <option key={key} value={key}>
                        {config.name}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};