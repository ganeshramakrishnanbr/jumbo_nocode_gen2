import React, { useState } from 'react';
import { Upload, FileSpreadsheet, X, AlertCircle, CheckCircle, Zap } from 'lucide-react';
import { parseExcelFile, convertExcelDataToControls, ExcelControlData } from '../utils/excelTemplate';
import { DroppedControl } from '../types';

interface DirectImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDirectImport: (controls: DroppedControl[]) => void;
}

export const DirectImportModal: React.FC<DirectImportModalProps> = ({
  isOpen,
  onClose,
  onDirectImport
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState<ExcelControlData[]>([]);
  const [error, setError] = useState<string>('');
  const [step, setStep] = useState<'upload' | 'preview' | 'success'>('upload');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setError('Please select a valid Excel file (.xlsx or .xls)');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      console.log('🚀 DIRECT IMPORT: Starting direct UI import process...');
      const excelData = await parseExcelFile(file);
      setPreviewData(excelData);
      setStep('preview');
      console.log('✅ DIRECT IMPORT: Excel data parsed successfully for preview');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file');
      console.error('❌ DIRECT IMPORT: Failed to parse Excel file:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDirectImport = () => {
    try {
      console.log('🚀 DIRECT IMPORT: Converting Excel data to controls...');
      const controls = convertExcelDataToControls(previewData);
      console.log('✅ DIRECT IMPORT: Controls converted, importing directly to UI...');
      
      // Direct UI import - no database involved
      onDirectImport(controls);
      setStep('success');
      
      console.log('🎉 DIRECT IMPORT: Direct UI import completed successfully!');
      
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import controls');
      console.error('❌ DIRECT IMPORT: Failed to import controls:', err);
    }
  };

  const handleClose = () => {
    setStep('upload');
    setPreviewData([]);
    setError('');
    setIsProcessing(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden transition-colors">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors">
                Direct UI Import
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">
                Import Excel controls directly to UI (bypasses database)
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'upload' && (
            <div className="space-y-6">
              {/* Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="flex items-center justify-center mb-4">
                  <Zap className="w-12 h-12 text-green-500 dark:text-green-400 mr-2" />
                  <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2 transition-colors">
                  Direct UI Import
                </h4>
                <p className="text-gray-500 dark:text-gray-400 mb-4 transition-colors">
                  Upload Excel file for instant UI import (no database delays)
                </p>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileInput}
                  className="hidden"
                  id="direct-excel-upload"
                />
                <label
                  htmlFor="direct-excel-upload"
                  className="inline-flex items-center px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 cursor-pointer transition-colors"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Choose File for Direct Import
                </label>
              </div>

              {/* Benefits */}
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
                <h5 className="font-medium text-green-900 dark:text-green-300 mb-2">Direct Import Benefits:</h5>
                <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                  <li>• ⚡ Instant UI updates - no database synchronization delays</li>
                  <li>• 🎯 Direct control rendering - immediate visual feedback</li>
                  <li>• 🚀 Faster import process - bypasses database operations</li>
                  <li>• 🔄 No RefreshKey issues - controls appear immediately</li>
                </ul>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-red-900 dark:text-red-300">Error</h5>
                    <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                  </div>
                </div>
              )}

              {isProcessing && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                  <p className="text-gray-600 dark:text-gray-300">Processing file for direct import...</p>
                </div>
              )}
            </div>
          )}

          {step === 'preview' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white transition-colors">
                  Preview Direct Import
                </h4>
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {previewData.length} controls ready for direct import
                  </span>
                </div>
              </div>

              {/* Preview Table */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="max-h-96 overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Label
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Required
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Section
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {previewData.map((control, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                              {control.type}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                            {control.name}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                            {control.label}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {control.required ? (
                              <span className="text-red-600 dark:text-red-400">Required</span>
                            ) : (
                              <span className="text-gray-500 dark:text-gray-400">Optional</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                            {control.sectionId}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setStep('upload')}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleDirectImport}
                  className="flex items-center px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Direct Import {previewData.length} Controls
                </button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <div className="flex items-center justify-center mb-4">
                <Zap className="w-16 h-16 text-green-500 dark:text-green-400 mr-2" />
                <CheckCircle className="w-16 h-16 text-green-500 dark:text-green-400" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2 transition-colors">
                Direct Import Successful!
              </h4>
              <p className="text-gray-600 dark:text-gray-300 transition-colors">
                {previewData.length} controls imported directly to UI - no database delays!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};