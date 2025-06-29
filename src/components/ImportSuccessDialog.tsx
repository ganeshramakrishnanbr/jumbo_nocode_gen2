import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, X, RefreshCw, Eye, Database } from 'lucide-react';

interface ImportResults {
  success: number;
  total: number;
  errors: string[];
}

interface ImportSuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  results: ImportResults | null;
}

export const ImportSuccessDialog: React.FC<ImportSuccessDialogProps> = ({
  isOpen,
  onClose,
  results
}) => {
  const [countdown, setCountdown] = useState(5);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (isOpen && autoRefresh && results && results.success > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            onClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen, autoRefresh, results, onClose]);

  useEffect(() => {
    if (isOpen) {
      setCountdown(5);
    }
  }, [isOpen]);

  if (!isOpen || !results) return null;

  const isSuccess = results.success > 0;
  const hasErrors = results.errors.length > 0;
  const isAtomicSuccess = results.success === results.total;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full mx-4 transition-colors">
        {/* Header */}
        <div className={`p-6 border-b border-gray-200 dark:border-gray-700 ${
          isSuccess ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'
        } rounded-t-lg`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {isSuccess ? (
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              )}
              <div>
                <h3 className={`text-lg font-semibold ${
                  isSuccess ? 'text-green-900 dark:text-green-100' : 'text-red-900 dark:text-red-100'
                }`}>
                  {isAtomicSuccess ? 'Atomic Import Successful!' : 
                   isSuccess ? 'Partial Import Completed' : 'Import Failed'}
                </h3>
                <p className={`text-sm ${
                  isSuccess ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                }`}>
                  {isSuccess 
                    ? `${results.success} of ${results.total} controls imported`
                    : `Failed to import controls`
                  }
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setAutoRefresh(false);
                onClose();
              }}
              className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSuccess ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-green-700 dark:text-green-300">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">
                  {isAtomicSuccess ? 'Atomic transaction completed successfully!' : 
                   `Successfully imported ${results.success} controls!`}
                </span>
              </div>
              
              {isAtomicSuccess && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Database className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                        Atomic Transaction Success
                      </h4>
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        All controls were imported in a single atomic transaction, ensuring complete data integrity. 
                        No partial data or inconsistent states occurred during the import process.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                      Enhanced State Synchronization
                    </h4>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      The application is using enhanced state synchronization to ensure your imported controls appear correctly. 
                      {autoRefresh && (
                        <span className="font-medium"> Auto-closing in {countdown} seconds...</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Next Steps:</h4>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <li>• Controls will appear in the Design tab with enhanced synchronization</li>
                  <li>• You can modify properties in the Properties panel</li>
                  <li>• Use Preview tab to test your form</li>
                  <li>• Export JSON when ready for deployment</li>
                  <li>• All changes are automatically saved with atomic operations</li>
                </ul>
              </div>

              {hasErrors && !isAtomicSuccess && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">
                    Partial Import - Some Issues Found:
                  </h4>
                  <div className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
                    {results.errors.slice(0, 3).map((error, index) => (
                      <div key={index}>• {error}</div>
                    ))}
                    {results.errors.length > 3 && (
                      <div>• ... and {results.errors.length - 3} more issues</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-red-700 dark:text-red-300">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-medium">Atomic import failed</span>
              </div>
              
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Database className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-900 dark:text-red-100 mb-2">Atomic Transaction Failed</h4>
                    <p className="text-sm text-red-800 dark:text-red-200 mb-2">
                      The atomic transaction was rolled back to prevent partial data corruption. 
                      No controls were imported to maintain data integrity.
                    </p>
                    <div className="text-sm text-red-800 dark:text-red-200 space-y-1">
                      <strong>Errors:</strong>
                      {results.errors.slice(0, 5).map((error, index) => (
                        <div key={index}>• {error}</div>
                      ))}
                      {results.errors.length > 5 && (
                        <div>• ... and {results.errors.length - 5} more errors</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Suggestions:</h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Check that your Excel file follows the template format exactly</li>
                  <li>• Ensure all required fields are filled correctly</li>
                  <li>• Verify control types match the available control types</li>
                  <li>• Make sure all IDs are left empty for auto-generation</li>
                  <li>• Try downloading a fresh template and re-filling it</li>
                  <li>• Check the console logs for detailed error information</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isSuccess && autoRefresh && (
                <button
                  onClick={() => setAutoRefresh(false)}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  Cancel auto-close
                </button>
              )}
            </div>
            <div className="flex items-center space-x-3">
              {isSuccess && (
                <button
                  onClick={onClose}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Controls</span>
                </button>
              )}
              {!isSuccess && (
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-600 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};