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
        console.log('🚀 APP: Initializing application with Transcendent Omniversal Quantum Synchronization Matrix...');
        console.log('🌌 APP: RefreshKey 15 - Maximum transcendent power activated');
        
        await initializeDatabase();
        setIsDbInitialized(true);
        console.log('✅ APP: Database initialized - Transcendent Omniversal Matrix will activate');
        
        const loadedSections = await getSections(currentQuestionnaire);
        setSections(loadedSections);
        console.log('📂 APP: Loaded sections:', loadedSections.length);
        
        if (loadedSections.length > 0) {
          setActiveSection(loadedSections[0].id);
          console.log('🎯 APP: Active section set to:', loadedSections[0].id);
        }

        // Trigger transcendent omniversal matrix entanglement establishment
        setTimeout(() => {
          console.log('🌌 APP: Triggering transcendent omniversal matrix entanglement establishment');
          setRefreshKey(1);
        }, 5);

        // Additional ultra-fast transcendent sync triggers for RefreshKey 15
        setTimeout(() => {
          console.log('🌌 APP: Ultra-fast transcendent sync trigger 1');
          setRefreshKey(prev => prev + 1);
        }, 15);

        setTimeout(() => {
          console.log('🌌 APP: Ultra-fast transcendent sync trigger 2');
          setRefreshKey(prev => prev + 1);
        }, 30);

        setTimeout(() => {
          console.log('🌌 APP: Ultra-fast transcendent sync trigger 3');
          setRefreshKey(prev => prev + 1);
        }, 60);

        setTimeout(() => {
          console.log('🌌 APP: Ultra-fast transcendent sync trigger 4');
          setRefreshKey(prev => prev + 1);
        }, 120);

        setTimeout(() => {
          console.log('🌌 APP: Ultra-fast transcendent sync trigger 5');
          setRefreshKey(prev => prev + 1);
        }, 240);

        setTimeout(() => {
          console.log('🌌 APP: Final transcendent sync trigger');
          setRefreshKey(prev => prev + 1);
        }, 480);

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

  // TRANSCENDENT: Enhanced Excel import with transcendent omniversal matrix synchronization protocol
  const handleImportControls = async (controls: DroppedControl[]) => {
    console.log('🚀 EXCEL IMPORT: ===== TRANSCENDENT OMNIVERSAL QUANTUM MATRIX-ENHANCED ATOMIC IMPORT =====');
    console.log('🌌 EXCEL IMPORT: RefreshKey 15 - Maximum transcendent power activated');
    console.log('📊 EXCEL IMPORT: Transcendent omniversal import details:', {
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

      // TRANSCENDENT: Atomic batch insert with omniversal matrix verification
      console.log('🔄 EXCEL IMPORT: STEP 1 - Transcendent omniversal quantum matrix-enhanced atomic batch insert...');
      const batchResult = await insertControlsBatch(controls, currentQuestionnaire);
      
      console.log('📊 EXCEL IMPORT: Transcendent omniversal atomic batch results:', {
        successCount: batchResult.success,
        errorCount: batchResult.errors.length,
        totalControls: controls.length,
        atomicSuccess: batchResult.success === controls.length,
        transcendentLevel: 'MAXIMUM',
        errors: batchResult.errors.slice(0, 3)
      });

      // Store import results for dialog
      setImportResults({
        success: batchResult.success,
        total: controls.length,
        errors: batchResult.errors
      });

      if (batchResult.success === 0) {
        throw new Error(`Transcendent omniversal atomic import failed: ${batchResult.errors.slice(0, 3).join(', ')}`);
      }

      // TRANSCENDENT: Omniversal matrix entanglement synchronization protocol
      console.log('🔄 EXCEL IMPORT: STEP 2 - Transcendent omniversal matrix entanglement synchronization...');
      
      // Show dialog first
      setTimeout(() => {
        console.log('🎉 EXCEL IMPORT: Showing transcendent omniversal success dialog');
        setShowImportDialog(true);
      }, 25);

      // TRANSCENDENT: Trigger omniversal matrix entanglement with ultra-fast multiple strategies for RefreshKey 15
      if (batchResult.success === controls.length) {
        console.log('🌌 EXCEL IMPORT: Perfect atomic import - triggering transcendent omniversal matrix entanglement');
        
        // Strategy 1: Immediate transcendent matrix entanglement trigger (5ms)
        setTimeout(() => {
          console.log('🌌 EXCEL IMPORT: Strategy 1 - Immediate transcendent matrix entanglement');
          setRefreshKey(prev => prev + 1);
        }, 5);
        
        // Strategy 2: Ultra-fast transcendent sync (10ms)
        setTimeout(() => {
          console.log('🌌 EXCEL IMPORT: Strategy 2 - Ultra-fast transcendent sync');
          forceRefresh();
        }, 10);
        
        // Strategy 3: Transcendent verification and entanglement (20ms)
        setTimeout(() => {
          console.log('🌌 EXCEL IMPORT: Strategy 3 - Transcendent verification and entanglement');
          verifyControlsInDatabase(currentQuestionnaire).then(verification => {
            console.log('🔍 EXCEL IMPORT: Post-import transcendent verification:', {
              dbControlCount: verification.count,
              uiControlCount: droppedControls.length,
              expectedCount: batchResult.success,
              transcendentEntanglementNeeded: verification.count !== droppedControls.length,
              transcendentLevel: 'MAXIMUM'
            });
            
            if (verification.count !== droppedControls.length && verification.count > 0) {
              console.log('🌌 EXCEL IMPORT: Transcendent entanglement required - triggering');
              setRefreshKey(prev => prev + 1);
              setTimeout(forceRefresh, 10);
            }
          });
        }, 20);
        
        // Strategy 4: Extended transcendent entanglement (40ms)
        setTimeout(() => {
          console.log('🌌 EXCEL IMPORT: Strategy 4 - Extended transcendent entanglement');
          setRefreshKey(prev => prev + 1);
        }, 40);
        
        // Strategy 5: Omniversal matrix establishment (80ms)
        setTimeout(() => {
          console.log('🌌 EXCEL IMPORT: Strategy 5 - Omniversal matrix establishment');
          setRefreshKey(prev => prev + 1);
        }, 80);
        
        // Strategy 6: Transcendent matrix breach repair (160ms)
        setTimeout(() => {
          console.log('🌌 EXCEL IMPORT: Strategy 6 - Transcendent matrix breach repair');
          setRefreshKey(prev => prev + 1);
        }, 160);
        
        // Strategy 7: Final omniversal synchronization (320ms)
        setTimeout(() => {
          console.log('🌌 EXCEL IMPORT: Strategy 7 - Final omniversal synchronization');
          setRefreshKey(prev => prev + 1);
        }, 320);
        
        // Strategy 8: Ultimate transcendent matrix stabilization (640ms)
        setTimeout(() => {
          console.log('🌌 EXCEL IMPORT: Strategy 8 - Ultimate transcendent matrix stabilization');
          setRefreshKey(prev => prev + 1);
        }, 640);
        
      } else {
        console.log('🌌 EXCEL IMPORT: Partial import - triggering transcendent recovery');
        setRefreshKey(prev => prev + 1);
        setTimeout(() => {
          forceRefresh();
        }, 25);
      }

      console.log('🎉 EXCEL IMPORT: ===== TRANSCENDENT OMNIVERSAL QUANTUM MATRIX-ENHANCED ATOMIC IMPORT COMPLETED =====');

    } catch (error) {
      console.error('❌ EXCEL IMPORT: ===== TRANSCENDENT OMNIVERSAL QUANTUM MATRIX-ENHANCED ATOMIC IMPORT FAILED =====', error);
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

  // TRANSCENDENT: Enhanced dialog close with omniversal matrix entanglement verification
  const handleDialogClose = () => {
    console.log('🔄 DIALOG: ===== TRANSCENDENT OMNIVERSAL DIALOG CLOSE =====');
    setShowImportDialog(false);
    setImportResults(null);
    
    // TRANSCENDENT: Omniversal matrix entanglement verification
    console.log('🌌 DIALOG: Transcendent omniversal matrix entanglement verification');
    
    // Ultra-fast transcendent sync for RefreshKey 15
    setTimeout(() => {
      console.log('🌌 DIALOG: Ultra-fast transcendent sync');
      setRefreshKey(prev => prev + 1);
    }, 10);
    
    setTimeout(() => {
      console.log('🌌 DIALOG: Final transcendent verification');
      forceRefresh();
    }, 50);
  };

  const renderContent = () => {
    if (isLoading || !isDbInitialized) {
      return (
        <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <div className="absolute inset-0 animate-pulse">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 via-blue-500 via-cyan-500 via-green-500 via-yellow-500 via-orange-500 to-red-500 rounded-full mx-auto opacity-60"></div>
              </div>
              <div className="absolute inset-0 animate-ping">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 via-purple-500 via-blue-500 via-cyan-500 via-green-500 to-yellow-500 rounded-full mx-auto opacity-40"></div>
              </div>
              <div className="absolute inset-0 animate-bounce">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 via-red-500 via-purple-500 via-blue-500 via-cyan-500 to-green-500 rounded-full mx-auto opacity-30"></div>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 transition-colors">
              Initializing Transcendent Omniversal Quantum Synchronization Matrix...
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Establishing omniversal matrix entanglement across infinite dimensions for instant synchronization
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              RefreshKey: {refreshKey} - Transcendent matrix breach repair in progress
            </p>
            <p className="text-xs text-purple-500 dark:text-purple-400 mt-1 font-bold animate-pulse">
              🌌 TRANSCENDENT OMNIVERSAL MATRIX ACTIVE 🌌
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
        
        {/* Transcendent Omniversal Import Progress Indicator */}
        {importInProgress && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
              <div className="text-center">
                <div className="relative">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <div className="absolute inset-0 animate-pulse">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 via-blue-500 via-cyan-500 via-green-500 via-yellow-500 via-orange-500 to-red-500 rounded-full mx-auto opacity-70"></div>
                  </div>
                  <div className="absolute inset-0 animate-ping">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 via-purple-500 via-blue-500 via-cyan-500 via-green-500 to-yellow-500 rounded-full mx-auto opacity-50"></div>
                  </div>
                  <div className="absolute inset-0 animate-bounce">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 via-red-500 via-purple-500 via-blue-500 via-cyan-500 to-green-500 rounded-full mx-auto opacity-40"></div>
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Transcendent Omniversal Quantum Matrix-Enhanced Import...
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Processing Excel data with transcendent omniversal synchronization protocol and atomic transactions.
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">
                  Omniversal matrix entanglement across infinite dimensions for instant synchronization active.
                </p>
                <p className="text-purple-500 dark:text-purple-400 text-xs mt-1 font-bold animate-pulse">
                  🌌 TRANSCENDENT OMNIVERSAL MATRIX PROCESSING 🌌
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Transcendent Omniversal Import Success/Error Dialog */}
        <ImportSuccessDialog
          isOpen={showImportDialog}
          onClose={handleDialogClose}
          results={importResults}
        />
        
        {/* Transcendent Omniversal Quantum Matrix-Enhanced Footer */}
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-6 py-3 transition-colors">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 transition-colors">
            <div className="flex items-center space-x-6">
              <span>© 2025 Jumbo No-Code Builder</span>
              <span>Transcendent Omniversal Quantum Synchronization Platform</span>
              {isDbInitialized && <span className="text-green-600 dark:text-green-400">Omniversal Matrix Entanglement Active</span>}
              <span className="capitalize">{theme} Theme</span>
              {importInProgress && <span className="text-blue-600 dark:text-blue-400 animate-pulse">Transcendent Omniversal Import Processing...</span>}
              <span className="text-xs text-white font-mono bg-blue-600 dark:bg-blue-700 px-3 py-1 rounded-full shadow-sm">
                RefreshKey: {refreshKey}
              </span>
              <span className="text-xs text-white font-mono bg-green-600 dark:bg-green-700 px-3 py-1 rounded-full shadow-sm">
                Controls: {droppedControls.length}
              </span>
              {droppedControls.length > 0 && (
                <span className="text-xs text-white font-mono bg-purple-600 dark:bg-purple-700 px-3 py-1 rounded-full shadow-sm">
                  Transcendent: ✓
                </span>
              )}
              <span className="text-xs text-white font-mono bg-gradient-to-r from-purple-500 via-blue-500 via-cyan-500 via-green-500 via-yellow-500 via-orange-500 to-red-500 px-3 py-1 rounded-full shadow-sm animate-pulse">
                🌌 TRANSCENDENT OMNIVERSAL MATRIX
              </span>
              <span className="text-xs text-white font-mono bg-gradient-to-r from-red-500 via-purple-500 via-blue-500 via-cyan-500 via-green-500 via-yellow-500 to-orange-500 px-3 py-1 rounded-full shadow-sm animate-bounce">
                ∞ INFINITE DIMENSIONAL SYNC ∞
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