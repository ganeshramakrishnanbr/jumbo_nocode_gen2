import React from 'react';
import { DroppedControl, CustomerTier, Section } from '../types';
import { Copy, Download } from 'lucide-react';

interface JSONViewerProps {
  droppedControls: DroppedControl[];
  currentTier: CustomerTier;
  sections: Section[];
}

export const JSONViewer: React.FC<JSONViewerProps> = ({
  droppedControls,
  currentTier,
  sections
}) => {
  const generateJSON = () => {
    return {
      formDefinition: {
        id: `form-${Date.now()}`,
        name: "Generated Form",
        version: "1.0.0",
        created: new Date().toISOString(),
        tierExperience: currentTier,
        sections: sections.map(section => ({
          id: section.id,
          name: section.name,
          order: section.order,
          required: section.required,
          controls: droppedControls
            .filter(control => control.sectionId === section.id)
            .map(control => ({
              id: control.id,
              type: control.type,
              name: control.name,
              position: { x: control.x, y: control.y },
              size: { width: control.width, height: control.height },
              properties: control.properties,
              validation: {
                required: control.properties.required || false,
                rules: []
              }
            }))
        })),
        controls: droppedControls.map(control => ({
          id: control.id,
          type: control.type,
          name: control.name,
          position: { x: control.x, y: control.y },
          size: { width: control.width, height: control.height },
          properties: control.properties,
          sectionId: control.sectionId || null,
          validation: {
            required: control.properties.required || false,
            rules: []
          }
        })),
        settings: {
          layout: "standard",
          theme: currentTier,
          navigation: {
            type: "tabs",
            showProgress: true,
            allowSkip: currentTier === 'platinum' || currentTier === 'gold'
          }
        }
      },
      tierConfiguration: {
        tier: currentTier,
        layoutOptions: getTierLayouts(currentTier),
        customization: getTierCustomization(currentTier),
        pdfGeneration: {
          templatesAvailable: getTierPDFTemplates(currentTier),
          customStyling: currentTier === 'platinum' || currentTier === 'gold'
        }
      },
      generatedAt: new Date().toISOString(),
      schemaVersion: "2.1.0"
    };
  };

  const getTierLayouts = (tier: CustomerTier) => {
    const layouts = {
      platinum: 12,
      gold: 8,
      silver: 5,
      bronze: 3
    };
    return layouts[tier];
  };

  const getTierCustomization = (tier: CustomerTier) => {
    const customization = {
      platinum: ['Full Theme Control', 'Custom CSS', 'Logo Upload', 'Animation Control'],
      gold: ['Preset Themes', 'Logo Upload', 'Basic Styling'],
      silver: ['Preset Themes', 'Basic Colors'],
      bronze: ['Basic Themes']
    };
    return customization[tier];
  };

  const getTierPDFTemplates = (tier: CustomerTier) => {
    const templates = {
      platinum: 20,
      gold: 12,
      silver: 6,
      bronze: 3
    };
    return templates[tier];
  };

  const jsonString = JSON.stringify(generateJSON(), null, 2);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonString);
  };

  const downloadJSON = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `form-definition-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 bg-white dark:bg-gray-800 flex flex-col transition-colors">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors">JSON Configuration</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">
              Real-time generated form definition and tier configuration
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={copyToClipboard}
              className="flex items-center px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </button>
            <button
              onClick={downloadJSON}
              className="flex items-center px-3 py-2 text-sm bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </button>
          </div>
        </div>
      </div>

      {/* JSON Content */}
      <div className="flex-1 overflow-auto p-6">
        <pre className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 text-sm font-mono overflow-auto border border-gray-200 dark:border-gray-700 transition-colors">
          <code className="text-gray-800 dark:text-gray-200 transition-colors">{jsonString}</code>
        </pre>
      </div>

      {/* Footer Stats */}
      <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-3 bg-gray-50 dark:bg-gray-800 transition-colors">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 transition-colors">
          <div className="flex items-center space-x-6">
            <span>Controls: {droppedControls.length}</span>
            <span>Sections: {sections.length}</span>
            <span>Tier: {currentTier.charAt(0).toUpperCase() + currentTier.slice(1)}</span>
          </div>
          <span>Generated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};