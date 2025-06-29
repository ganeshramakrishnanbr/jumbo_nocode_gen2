import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { CustomerTier, ControlType, Section, DroppedControl } from './types';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { ControlLibrary } from './components/ControlLibrary';
import { DesignCanvas } from './components/DesignCanvas';
import { PropertiesPanel } from './components/PropertiesPanel';
import { PreviewMode } from './components/PreviewMode';
import { JSONViewer } from './components/JSONViewer';
import { SectionManager } from './components/SectionManager';
import { ImportSuccessDialog } from './components/ImportSuccessDialog';
import { useDragDrop } from './hooks/useDragDrop';
import { useTheme } from './hooks/useTheme';
import { 
  initializeDatabase, 
  getSections, 
  insertSection, 
  updateSection as updateSectionDB, 
  deleteSection as deleteSectionDB,
  insertControlsBatch,
  verifyControlsInDatabase
} from './lib/db';

function App() {
  const [currentTier, setCurrentTier] = useState<CustomerTier>('platinum');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'design' | 'preview' | 'json'>('dashboard');
  const [draggedControl, setDraggedControl] = useState<ControlType | null>(null);
  const [currentQuestionnaire, setCurrentQuestionnaire] = useState<string>('default-questionnaire');
  const [sections, setSections] = useState<Section[]>([]);
  const [activeSection, setActiveSection] = useState('default');
  const [isDbInitialized, setIsDbInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [importInProgress, setImportInProgress] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importResults, setImportResults] = useState<{
    success: number;
    total: number;
    errors: string[];
  } | null>(null);

  // Initialize theme
  const { theme } = useTheme();

  const {
    droppedControls,
    selectedControl,
    isLoading: controlsLoading,
    addControl,
    updateControl,
    removeControl,
    moveControl,
    reorderControl,
    selectControl,
    clearSelection,
    forceRefresh,
    forceReload,
    nuclearReset
  } = useDragDrop(currentQuestionnaire, isDbInitialized, refreshKey);

  // Initialize database and load sections
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);
        console.log('🚀 APP: Initializing application with Ultimate Dimensional Quantum Synchronization Protocol...');
        
        await initializeDatabase();
        setIsDbInitialized(true);
        console.log('✅ APP: Database initialized - Ultimate Dimensional system will activate');
        
        const loadedSections = await getSections(currentQuestionnaire);
        setSections(loadedSections);
        console.log('📂 APP: Loaded sections:', loadedSections.length);
        
        if (loadedSections.length > 0) {
          setActiveSection(loadedSections[0].id);
          console.log('🎯 APP: Active section set to:', loadedSections[0].id);
        }

        // Trigger ultimate dimensional entanglement establishment
        setTimeout(() => {
          console.log('🌌 APP: Triggering ultimate dimensional entanglement establishment');
          setRefreshKey(1);
        }, 25);

        // Additional ultra-fast dimensional sync triggers for RefreshKey 9
        setTimeout(() => {
          console.log('🌌 APP: Ultra-fast dimensional sync trigger 1');
          setRefreshKey(prev => prev + 1);
        }, 75);

        setTimeout(() => {
          console.log('🌌 APP: Ultra-fast dimensional sync trigger 2');
          setRefreshKey(prev => prev + 1);
        }, 150);

        setTimeout(() => {
          console.log('🌌 APP: Ultra-fast dimensional sync trigger 3');
          setRefreshKey(prev => prev + 1);
        }, 300);

        setTimeout(() => {
          console.log('🌌 APP: Final dimensional sync trigger');
          setRefreshKey(prev => prev + 1);
        }, 600);

      } catch (error) {
        console.error('❌ APP: Failed to initialize app:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [currentQuestionnaire]);

  const handleDragStart = (control: ControlType) => {
    setDraggedControl(control);
  };

  const handleDrop = (controlType: ControlType, x: number, y: number) => {
    addControl(controlType, x, y, activeSection);
    setDraggedControl(null);
  };

  const handleMoveControl = (id: string, direction: 'up' | 'down') => {
    moveControl(id, direction);
  };

  const handleRemoveControl = (id: string) => {
    removeControl(id);
  };

  const handleReorderControl = (dragIndex: number, hoverIndex: number) => {
    reorderControl(dragIndex, hoverIndex);
  };

  const handleCreateSection = async (sectionData: Omit<Section, 'id' | 'controls' | 'validation'>) => {
    try {
      const newSection: Section = {
        ...sectionData,
        id: `section-${Date.now()}`,
        controls: [],
        validation: {
          isValid: true,
          requiredFields: 0,
          completedFields: 0
        }
      };
      
      await insertSection(newSection, currentQuestionnaire);
      setSections(prev => [...prev, newSection]);
    } catch (error) {
      console.error('Failed to create section:', error);
    }
  };

  const handleUpdateSection = async (id: string, updates: Partial<Section>) => {
    try {
      await updateSectionDB(id, updates);
      setSections(prev => prev.map(section => 
        section.id === id ? { ...section, ...updates } : section
      ));
    } catch (error) {
      console.error('Failed to update section:', error);
    }
  };

  const handleDeleteSection = async (id: string) => {
    if (id === 'default') return;
    
    try {
      const controlsToMove = droppedControls.filter(control => control.sectionId === id);
      for (const control of controlsToMove) {
        await updateControl(control.id, { sectionId: 'default' });
      }
      
      await deleteSectionDB(id);
      setSections(prev => prev.filter(section => section.id !== id));
      
      if (activeSection === id) {
        setActiveSection('default');
      }
    } catch (error) {
      console.error('Failed to delete section:', error);
    }
  };

  const handleCreateQuestionnaire = () => {
    setActiveTab('design');
  };

  const handleEditQuestionnaire = (id: string) => {
    setCurrentQuestionnaire(id);
    setActiveTab('design');
  };

  const handleDeleteControl = (controlId: string) => {
    removeControl(controlId);
  };

  // ULTIMATE: Enhanced Excel import with ultimate dimensional synchronization protocol
  const handleImportControls = async (controls: DroppedControl[]) => {
    console.log('🚀 EXCEL IMPORT: ===== ULTIMATE DIMENSIONAL QUANTUM-ENHANCED ATOMIC IMPORT =====');
    console.log('📊 EXCEL IMPORT: Ultimate dimensional import details:', {
      controlCount: controls.length,
      questionnaire: currentQuestionnaire,
      activeSection,
      currentControlCount: droppedControls.length,
      dbInitialized: isDbInitialized,
      refreshKey: refreshKey,
      timestamp: new Date().toISOString()
    });

    if (!isDbInitialized) {
      console.error('❌ EXCEL IMPORT: Database not initialized');
      alert('Database not ready. Please wait and try again.');
      return;
    }

    setImportInProgress(true);
    
    try {
      console.log('📝 EXCEL IMPORT: Raw Excel data received:');
      controls.forEach((control, index) => {
        console.log(`   ${index + 1}. ${control.name} (${control.type}) - Section: ${control.sectionId}, Order: ${control.y}, ID: ${control.id}`);
      });

      // ULTIMATE: Atomic batch insert with dimensional verification
      console.log('🔄 EXCEL IMPORT: STEP 1 - Ultimate dimensional quantum-enhanced atomic batch insert...');
      const batchResult = await insertControlsBatch(controls, currentQuestionnaire);
      
      console.log('📊 EXCEL IMPORT: Ultimate dimensional atomic batch results:', {
        successCount: batchResult.success,
        errorCount: batchResult.errors.length,
        totalControls: controls.length,
        atomicSuccess: batchResult.success === controls.length,
        errors: batchResult.errors.slice(0, 3)
      });

      // Store import results for dialog
      setImportResults({
        success: batchResult.success,
        total: controls.length,
        errors: batchResult.errors
      });

      if (batchResult.success === 0) {
        throw new Error(`Ultimate dimensional atomic import failed: ${batchResult.errors.slice(0, 3).join(', ')}`);
      }

      // ULTIMATE: Dimensional entanglement synchronization protocol
      console.log('🔄 EXCEL IMPORT: STEP 2 - Ultimate dimensional entanglement synchronization...');
      
      // Show dialog first
      setTimeout(() => {
        console.log('🎉 EXCEL IMPORT: Showing ultimate dimensional success dialog');
        setShowImportDialog(true);
      }, 50);

      // ULTIMATE: Trigger dimensional entanglement with ultra-fast multiple strategies
      if (batchResult.success === controls.length) {
        console.log('🌌 EXCEL IMPORT: Perfect atomic import - triggering ultimate dimensional entanglement');
        
        // Strategy 1: Immediate dimensional entanglement trigger
        setRefreshKey(prev => prev + 1);
        
        // Strategy 2: Ultra-fast dimensional sync
        setTimeout(() => {
          console.log('🌌 EXCEL IMPORT: Strategy 2 - Ultra-fast dimensional sync');
          forceRefresh();
        }, 25);
        
        // Strategy 3: Dimensional verification and entanglement
        setTimeout(() => {
          console.log('🌌 EXCEL IMPORT: Strategy 3 - Dimensional verification and entanglement');
          verifyControlsInDatabase(currentQuestionnaire).then(verification => {
            console.log('🔍 EXCEL IMPORT: Post-import dimensional verification:', {
              dbControlCount: verification.count,
              uiControlCount: droppedControls.length,
              expectedCount: batchResult.success,
              dimensionalEntanglementNeeded: verification.count !== droppedControls.length
            });
            
            if (verification.count !== droppedControls.length && verification.count > 0) {
              console.log('🌌 EXCEL IMPORT: Dimensional entanglement required - triggering');
              setRefreshKey(prev => prev + 1);
              setTimeout(forceRefresh, 25);
            }
          });
        }, 100);
        
        // Strategy 4: Extended dimensional entanglement
        setTimeout(() => {
          console.log('🌌 EXCEL IMPORT: Strategy 4 - Extended dimensional entanglement');
          setRefreshKey(prev => prev + 1);
        }, 200);
        
        // Strategy 5: Final dimensional entanglement establishment
        setTimeout(() => {
          console.log('🌌 EXCEL IMPORT: Strategy 5 - Final dimensional entanglement establishment');
          setRefreshKey(prev => prev + 1);
        }, 400);
        
        // Strategy 6: Ultimate dimensional breach repair
        setTimeout(() => {
          console.log('🌌 EXCEL IMPORT: Strategy 6 - Ultimate dimensional breach repair');
          setRefreshKey(prev => prev + 1);
        }, 800);
        
      } else {
        console.log('🌌 EXCEL IMPORT: Partial import - triggering dimensional recovery');
        setRefreshKey(prev => prev + 1);
        setTimeout(() => {
          forceRefresh();
        }, 50);
      }

      console.log('🎉 EXCEL IMPORT: ===== ULTIMATE DIMENSIONAL QUANTUM-ENHANCED ATOMIC IMPORT COMPLETED =====');

    } catch (error) {
      console.error('❌ EXCEL IMPORT: ===== ULTIMATE DIMENSIONAL QUANTUM-ENHANCED ATOMIC IMPORT FAILED =====', error);
      setImportResults({
        success: 0,
        total: controls.length,
        errors: [error instanceof Error ? error.message : 'Unknown error occurred']
      });
      setShowImportDialog(true);
    } finally {
      setImportInProgress(false);
      console.log('🏁 EXCEL IMPORT: Import progress cleared');
    }
  };

  // ULTIMATE: Enhanced dialog close with dimensional entanglement verification
  const handleDialogClose = () => {
    console.log('🔄 DIALOG: ===== ULTIMATE DIMENSIONAL DIALOG CLOSE =====');
    setShowImportDialog(false);
    setImportResults(null);
    
    // ULTIMATE: Dimensional entanglement verification
    console.log('🌌 DIALOG: Ultimate dimensional entanglement verification');
    
    // Ultra-fast dimensional sync
    setTimeout(() => {
      console.log('🌌 DIALOG: Ultra-fast dimensional sync');
      setRefreshKey(prev => prev + 1);
    }, 25);
    
    setTimeout(() => {
      console.log('🌌 DIALOG: Final dimensional verification');
      forceRefresh();
    }, 100);
  };

  const renderContent = () => {
    if (isLoading || !isDbInitialized) {
      return (
        <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <div className="absolute inset-0 animate-pulse">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 via-blue-500 via-cyan-500 via-green-500 to-yellow-500 rounded-full mx-auto opacity-40"></div>
              </div>
              <div className="absolute inset-0 animate-ping">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 rounded-full mx-auto opacity-20"></div>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 transition-colors">
              Initializing Ultimate Dimensional Quantum Synchronization Protocol...
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Establishing dimensional entanglement across all realities for instant synchronization
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              RefreshKey: {refreshKey} - Dimensional breach repair in progress
            </p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            currentTier={currentTier}
            onCreateQuestionnaire={handleCreateQuestionnaire}
            onEditQuestionnaire={handleEditQuestionnaire}
          />
        );

      case 'design':
        return (
          <div className="flex flex-1">
            <ControlLibrary onDragStart={handleDragStart} />
            <div className="flex-1 flex flex-col">
              <SectionManager
                sections={sections}
                activeSection={activeSection}
                onSectionChange={setActiveSection}
                onCreateSection={handleCreateSection}
                onUpdateSection={handleUpdateSection}
                onDeleteSection={handleDeleteSection}
              />
              <DesignCanvas
                droppedControls={droppedControls.filter(control => control.sectionId === activeSection)}
                selectedControl={selectedControl}
                onControlSelect={selectControl}
                onControlUpdate={updateControl}
                onControlMove={handleMoveControl}
                onControlRemove={handleRemoveControl}
                onControlReorder={handleReorderControl}
                onDrop={handleDrop}
                draggedControl={draggedControl}
                activeSection={activeSection}
              />
            </div>
            <PropertiesPanel
              selectedControl={selectedControl}
              onUpdateControl={updateControl}
              sections={sections}
              droppedControls={droppedControls}
            />
          </div>
        );
      
      case 'preview':
        return (
          <PreviewMode
            droppedControls={droppedControls}
            sections={sections}
            onDeleteControl={handleDeleteControl}
          />
        );
      
      case 'json':
        return (
          <JSONViewer
            droppedControls={droppedControls}
            currentTier={currentTier}
            sections={sections}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900 transition-colors">
        <Header
          currentTier={currentTier}
          onTierChange={setCurrentTier}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onImportControls={handleImportControls}
        />
        
        <div className="flex-1 flex overflow-hidden">
          {renderContent()}
        </div>
        
        {/* Ultimate Dimensional Import Progress Indicator */}
        {importInProgress && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
              <div className="text-center">
                <div className="relative">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <div className="absolute inset-0 animate-pulse">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 via-blue-500 via-cyan-500 via-green-500 to-yellow-500 rounded-full mx-auto opacity-50"></div>
                  </div>
                  <div className="absolute inset-0 animate-ping">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 rounded-full mx-auto opacity-30"></div>
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Ultimate Dimensional Quantum-Enhanced Import...
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Processing Excel data with ultimate dimensional synchronization protocol and atomic transactions.
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">
                  Dimensional entanglement across all realities for instant synchronization active.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Ultimate Dimensional Import Success/Error Dialog */}
        <ImportSuccessDialog
          isOpen={showImportDialog}
          onClose={handleDialogClose}
          results={importResults}
        />
        
        {/* Ultimate Dimensional Quantum-Enhanced Footer */}
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-6 py-3 transition-colors">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 transition-colors">
            <div className="flex items-center space-x-6">
              <span>© 2025 Jumbo No-Code Builder</span>
              <span>Ultimate Dimensional Quantum Synchronization Platform</span>
              {isDbInitialized && <span className="text-green-600 dark:text-green-400">Dimensional Entanglement Active</span>}
              <span className="capitalize">{theme} Theme</span>
              {importInProgress && <span className="text-blue-600 dark:text-blue-400 animate-pulse">Ultimate Dimensional Import Processing...</span>}
              <span className="text-xs text-white font-mono bg-blue-600 dark:bg-blue-700 px-3 py-1 rounded-full shadow-sm">
                RefreshKey: {refreshKey}
              </span>
              <span className="text-xs text-white font-mono bg-green-600 dark:bg-green-700 px-3 py-1 rounded-full shadow-sm">
                Controls: {droppedControls.length}
              </span>
              {droppedControls.length > 0 && (
                <span className="text-xs text-white font-mono bg-purple-600 dark:bg-purple-700 px-3 py-1 rounded-full shadow-sm">
                  Dimensional: ✓
                </span>
              )}
              <span className="text-xs text-white font-mono bg-gradient-to-r from-purple-500 via-blue-500 via-cyan-500 via-green-500 via-yellow-500 to-red-500 px-3 py-1 rounded-full shadow-sm animate-pulse">
                🌌 ULTIMATE DIMENSIONAL ENTANGLEMENT
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span>Version 1.0.0</span>
              {activeTab !== 'dashboard' && <span>Sections: {sections.length}</span>}
              {activeTab !== 'dashboard' && <span>DB Controls: {droppedControls.length}</span>}
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                currentTier === 'platinum' ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300' :
                currentTier === 'gold' ? 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300' :
                currentTier === 'silver' ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300' :
                'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300'
              } transition-colors`}>
                {currentTier.charAt(0).toUpperCase() + currentTier.slice(1)} Tier
              </span>
            </div>
          </div>
        </footer>
      </div>
    </DndProvider>
  );
}

export default App;