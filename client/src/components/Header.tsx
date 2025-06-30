import React, { useState } from 'react';
import { CustomerTier } from '../types';
import { TIER_CONFIGS } from '../data/tiers';
import { Settings, Download, Upload, Save, Eye, Code, BarChart3, FileSpreadsheet, Zap, FileText, Menu, X, Layout } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { ExcelImportModal } from './ExcelImportModal';
import { DirectImportModal } from './DirectImportModal';
import { generateExcelTemplate } from '../utils/excelTemplate';
import { DroppedControl } from '../types';

interface HeaderProps {
  currentTier: CustomerTier;
  onTierChange: (tier: CustomerTier) => void;
  activeTab: 'dashboardDesigner' | 'dashboard' | 'design' | 'preview' | 'pdf' | 'json';
  onTabChange: (tab: 'dashboardDesigner' | 'dashboard' | 'design' | 'preview' | 'pdf' | 'json') => void;
  onImportControls?: (controls: DroppedControl[]) => void;
  onDirectImport?: (controls: DroppedControl[]) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTier,
  onTierChange,
  activeTab,
  onTabChange,
  onImportControls,
  onDirectImport
}) => {
  const [showImportModal, setShowImportModal] = useState(false);
  const [showDirectImportModal, setShowDirectImportModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const tierConfig = TIER_CONFIGS[currentTier];
  
  // Show controls only for design, preview, and JSON tabs
  const showControls = activeTab !== 'dashboard';

  const handleDownloadTemplate = () => {
    generateExcelTemplate();
  };

  const handleImportControls = (controls: DroppedControl[]) => {
    if (onImportControls) {
      onImportControls(controls);
    }
    setShowImportModal(false);
  };

  const handleDirectImport = (controls: DroppedControl[]) => {
    if (onDirectImport) {
      onDirectImport(controls);
    }
    setShowDirectImportModal(false);
  };

  const tabs = [
    { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { key: 'dashboardDesigner', label: 'Jumbo Studio', icon: Layout },
    { key: 'design', label: 'Design', icon: Settings },
    { key: 'preview', label: 'Preview', icon: Eye },
    { key: 'pdf', label: 'PDF Preview', icon: FileText },
    { key: 'json', label: 'JSON', icon: Code }
  ];

  return (
    <>
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white transition-colors">
                  Jumbo No-Code Builder
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 transition-colors hidden sm:block">
                  Professional Form Builder Platform
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 transition-colors">
              {tabs.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => onTabChange(key as any)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === key
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 inline mr-2" />
                  {label}
                </button>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Theme Toggle - Always visible */}
              <ThemeToggle />

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* Desktop Controls */}
              {showControls && (
                <div className="hidden lg:flex items-center space-x-2">
                  {/* Toolbar Buttons */}
                  <button 
                    onClick={handleDownloadTemplate}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Download Excel Template"
                  >
                    <FileSpreadsheet className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setShowDirectImportModal(true)}
                    className="p-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                    title="Direct UI Import (Recommended)"
                  >
                    <Zap className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setShowImportModal(true)}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Database Import (Legacy)"
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
                </div>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col space-y-2">
                {tabs.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => {
                      onTabChange(key as any);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === key
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {label}
                  </button>
                ))}

                {/* Mobile Controls */}
                {showControls && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-wrap gap-2">
                      <button 
                        onClick={handleDownloadTemplate}
                        className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm"
                      >
                        <FileSpreadsheet className="w-4 h-4 mr-2" />
                        Template
                      </button>
                      <button 
                        onClick={() => {
                          setShowDirectImportModal(true);
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center px-3 py-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg text-sm"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Import
                      </button>
                    </div>

                    {/* Mobile Tier Selection */}
                    <div className="mt-4">
                      <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">Tier:</label>
                      <select
                        value={currentTier}
                        onChange={(e) => onTierChange(e.target.value as CustomerTier)}
                        className={`w-full px-3 py-2 rounded-lg border-2 ${tierConfig.color} ${tierConfig.bgColor} ${tierConfig.textColor} font-medium text-sm dark:bg-gray-800 dark:border-gray-600 transition-colors`}
                      >
                        {Object.entries(TIER_CONFIGS).map(([key, config]) => (
                          <option key={key} value={key}>
                            {config.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Excel Import Modal (Legacy) */}
      <ExcelImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImportControls}
      />

      {/* Direct Import Modal (New) */}
      <DirectImportModal
        isOpen={showDirectImportModal}
        onClose={() => setShowDirectImportModal(false)}
        onDirectImport={handleDirectImport}
      />
    </>
  );
};