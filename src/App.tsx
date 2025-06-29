import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Zap } from 'lucide-react';
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
  insertControl,
  getControls
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
  const [nuclearResetInProgress, setNuclearResetInProgress] = useState(false);

  // Direct UI state for bypassing database
  const [directUIControls, setDirectUIControls] = useState<DroppedControl[]>([]);
  const [directUIMode, setDirectUIMode] = useState(false);
  const [directUISelectedControl, setDirectUISelectedControl] = useState<DroppedControl | null>(null);

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
        console.log('🚀 APP: Initializing application...');
        
        // Initialize database
        await initializeDatabase();
        setIsDbInitialized(true);
        console.log('✅ APP: Database initialized successfully');
        
        // Load sections
        const loadedSections = await getSections(currentQuestionnaire);
        setSections(loadedSections);
        console.log('📂 APP: Loaded sections:', loadedSections.length);
        
        // Set active section to first available section
        if (loadedSections.length > 0) {
          setActiveSection(loadedSections[0].id);
          console.log('🎯 APP: Active section set to:', loadedSections[0].id);
        }
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
    if (directUIMode) {
      handleDirectUIDrop(controlType, x, y);
    } else {
      addControl(controlType, x, y, activeSection);
    }
    setDraggedControl(null);
  };

  const handleDirectUIDrop = (controlType: ControlType, x: number, y: number) => {
    console.log('🚀 DIRECT UI: Adding control directly to UI state');
    
    const sectionControls = directUIControls.filter(c => c.sectionId === activeSection);
    const newControl: DroppedControl = {
      id: `direct-${controlType.type}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      type: controlType.type,
      name: controlType.name,
      x: 0,
      y: sectionControls.length,
      width: 400,
      height: controlType.type === 'textarea' ? 100 : 50,
      properties: controlType.properties.reduce((acc, prop) => {
        acc[prop.name] = prop.value;
        return acc;
      }, {} as Record<string, any>),
      sectionId: activeSection
    };
    
    setDirectUIControls(prev => [...prev, newControl]);
    setDirectUISelectedControl(newControl);
    console.log('✅ DIRECT UI: Control added to direct UI state');
  };

  const handleDirectImport = (controls: DroppedControl[]) => {
    console.log('🚀 DIRECT UI: ===== STARTING DIRECT UI IMPORT =====');
    console.log('📊 DIRECT UI: Import details:', {
      controlCount: controls.length,
      directUIMode: true,
      timestamp: new Date().toISOString()
    });

    try {
      // Switch to direct UI mode
      setDirectUIMode(true);
      
      // Set controls directly in UI state
      setDirectUIControls(controls);
      
      // Reset refresh key to 0 to indicate successful direct import
      setRefreshKey(0);
      
      console.log('✅ DIRECT UI: Controls imported directly to UI state');
      console.log('🎉 DIRECT UI: ===== DIRECT UI IMPORT COMPLETED SUCCESSFULLY =====');
      
      // Show success message
      setImportResults({
        success: controls.length,
        total: controls.length,
        errors: []
      });
      setShowImportDialog(true);
      
    } catch (error) {
      console.error('❌ DIRECT UI: Direct import failed:', error);
      setImportResults({
        success: 0,
        total: controls.length,
        errors: [error instanceof Error ? error.message : 'Unknown error occurred']
      });
      setShowImportDialog(true);
    }
  };

  const handleMoveControl = (id: string, direction: 'up' | 'down') => {
    if (directUIMode) {
      // Handle direct UI move
      const control = directUIControls.find(c => c.id === id);
      if (!control) return;
      
      const sectionControls = directUIControls.filter(c => c.sectionId === control.sectionId);
      const currentIndex = sectionControls.findIndex(c => c.id === id);
      
      if (currentIndex === -1) return;
      
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (newIndex < 0 || newIndex >= sectionControls.length) return;
      
      const targetControl = sectionControls[newIndex];
      const updatedControls = directUIControls.map(c => {
        if (c.id === id) return { ...c, y: targetControl.y };
        if (c.id === targetControl.id) return { ...c, y: control.y };
        return c;
      });
      
      setDirectUIControls(updatedControls);
    } else {
      moveControl(id, direction);
    }
  };

  const handleRemoveControl = (id: string) => {
    if (directUIMode) {
      setDirectUIControls(prev => prev.filter(c => c.id !== id));
      if (directUISelectedControl?.id === id) {
        setDirectUISelectedControl(null);
      }
    } else {
      removeControl(id);
    }
  };

  const handleReorderControl = (dragIndex: number, hoverIndex: number) => {
    if (directUIMode) {
      const newControls = [...directUIControls];
      const draggedControl = newControls[dragIndex];
      
      newControls.splice(dragIndex, 1);
      newControls.splice(hoverIndex, 0, draggedControl);
      
      const reorderedControls = newControls.map((control, index) => ({
        ...control,
        y: index
      }));
      
      setDirectUIControls(reorderedControls);
    } else {
      reorderControl(dragIndex, hoverIndex);
    }
  };

  const handleControlSelect = (control: DroppedControl) => {
    if (directUIMode) {
      setDirectUISelectedControl(control);
    } else {
      selectControl(control);
    }
  };

  const handleControlUpdate = (id: string, updates: Partial<DroppedControl>) => {
    if (directUIMode) {
      setDirectUIControls(prev => prev.map(c => 
        c.id === id ? { ...c, ...updates } : c
      ));
      if (directUISelectedControl?.id === id) {
        setDirectUISelectedControl(prev => prev ? { ...prev, ...updates } : null);
      }
    } else {
      updateControl(id, updates);
    }
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
      
      // Insert into database
      await insertSection(newSection, currentQuestionnaire);
      
      // Update local state
      setSections(prev => [...prev, newSection]);
    } catch (error) {
      console.error('Failed to create section:', error);
    }
  };

  const handleUpdateSection = async (id: string, updates: Partial<Section>) => {
    try {
      // Update in database
      await updateSectionDB(id, updates);
      
      // Update local state
      setSections(prev => prev.map(section => 
        section.id === id ? { ...section, ...updates } : section
      ));
    } catch (error) {
      console.error('Failed to update section:', error);
    }
  };

  const handleDeleteSection = async (id: string) => {
    if (id === 'default') return; // Don't allow deleting default section
    
    try {
      // Move controls from deleted section to default section
      const controlsToMove = (directUIMode ? directUIControls : droppedControls).filter(control => control.sectionId === id);
      
      if (directUIMode) {
        setDirectUIControls(prev => prev.map(control => 
          control.sectionId === id ? { ...control, sectionId: 'default' } : control
        ));
      } else {
        for (const control of controlsToMove) {
          await updateControl(control.id, { sectionId: 'default' });
        }
      }
      
      // Delete section from database
      await deleteSectionDB(id);
      
      // Update local state
      setSections(prev => prev.filter(section => section.id !== id));
      
      if (activeSection === id) {
        setActiveSection('default');
      }
    } catch (error) {
      console.error('Failed to delete section:', error);
    }
  };

  const handleCreateQuestionnaire = () => {
    // Switch to design mode when creating a new questionnaire
    setActiveTab('design');
  };

  const handleEditQuestionnaire = (id: string) => {
    // Load questionnaire data and switch to design mode
    setCurrentQuestionnaire(id);
    setActiveTab('design');
  };

  const handleDeleteControl = (controlId: string) => {
    handleRemoveControl(controlId);
  };

  const handleImportControls = async (controls: DroppedControl[]) => {
    console.log('🚀 EXCEL IMPORT: ===== STARTING DATABASE IMPORT PROCESS =====');
    console.log('📊 EXCEL IMPORT: Import details:', {
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

      // STEP 1: COMPREHENSIVE DATA VALIDATION WITH ENHANCED ERROR CHECKING
      console.log('🔍 EXCEL IMPORT: STEP 1 - Ultimate data validation...');
      let successCount = 0;
      let errorCount = 0;
      const errors: string[] = [];

      for (const control of controls) {
        console.log(`🔍 EXCEL IMPORT: Validating control: ${control.name}`);
        
        if (!control.type || !control.name) {
          const error = `Invalid control data: missing type or name for control ${control.id}`;
          errors.push(error);
          errorCount++;
          console.error(`❌ EXCEL IMPORT: ${error}`);
          continue;
        }
        
        if (!control.id) {
          const error = `Invalid control ID: missing ID for control ${control.name}`;
          errors.push(error);
          errorCount++;
          console.error(`❌ EXCEL IMPORT: ${error}`);
          continue;
        }

        console.log(`✅ EXCEL IMPORT: Control ${control.name} passed validation`);
      }

      if (errorCount > 0) {
        console.error('❌ EXCEL IMPORT: Data validation failed:', errors);
        throw new Error(`Data validation failed: ${errors.join(', ')}`);
      }

      console.log('✅ EXCEL IMPORT: All controls passed validation');

      // STEP 2: ENHANCED INDIVIDUAL CONTROL PROCESSING WITH ATOMIC OPERATIONS
      console.log('🔄 EXCEL IMPORT: STEP 2 - Processing individual controls with atomic operations...');
      
      for (let i = 0; i < controls.length; i++) {
        const control = controls[i];
        console.log(`🔄 EXCEL IMPORT: Processing control ${i + 1}/${controls.length}:`);
        console.log(`   - ID: ${control.id}`);
        console.log(`   - Type: ${control.type}`);
        console.log(`   - Name: ${control.name}`);
        console.log(`   - Section: ${control.sectionId}`);
        console.log(`   - Properties: ${JSON.stringify(control.properties, null, 2)}`);

        try {
          // Generate ultra-unique ID with multiple layers of uniqueness
          const timestamp = Date.now();
          const randomSuffix = Math.random().toString(36).substring(2, 10);
          const indexSuffix = i.toString().padStart(4, '0');
          const processSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
          const nuclearSuffix = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
          const uniqueId = `nuclear-${control.type}-${timestamp}-${randomSuffix}-${indexSuffix}-${processSuffix}-${nuclearSuffix}`;
          
          const controlToInsert = {
            ...control,
            id: uniqueId
          };

          console.log(`📝 EXCEL IMPORT: Inserting control with nuclear-unique ID: ${uniqueId}`);
          await insertControl(controlToInsert, currentQuestionnaire);
          successCount++;
          console.log(`✅ EXCEL IMPORT: Successfully inserted control ${i + 1}: ${control.name}`);
        } catch (error) {
          errorCount++;
          const errorMsg = `Failed to insert ${control.name}: ${error}`;
          errors.push(errorMsg);
          console.error(`❌ EXCEL IMPORT: Error inserting control ${i + 1}:`, error);
        }
      }

      console.log('📊 EXCEL IMPORT: STEP 2 COMPLETE - Import summary:', {
        total: controls.length,
        success: successCount,
        errors: errorCount,
        errorDetails: errors.slice(0, 5)
      });

      if (successCount === 0) {
        throw new Error(`No controls were imported successfully. Errors: ${errors.slice(0, 3).join(', ')}`);
      }

      // Store import results for dialog
      setImportResults({
        success: successCount,
        total: controls.length,
        errors: errors
      });

      // STEP 3: NUCLEAR OPTION - COMPLETE APPLICATION RESET AND RELOAD
      console.log('💥 EXCEL IMPORT: STEP 3 - EXECUTING NUCLEAR RESET AND RELOAD...');
      
      // Show dialog first
      setTimeout(() => {
        console.log('🎉 EXCEL IMPORT: Showing success dialog');
        setShowImportDialog(true);
      }, 100);

      // Execute nuclear reset after a short delay
      setTimeout(async () => {
        console.log('💥 EXCEL IMPORT: Executing nuclear reset...');
        await executeNuclearReset();
      }, 500);

      console.log('🎉 EXCEL IMPORT: ===== NUCLEAR IMPORT PROCESS COMPLETED SUCCESSFULLY =====');

    } catch (error) {
      console.error('❌ EXCEL IMPORT: ===== NUCLEAR IMPORT PROCESS FAILED =====', error);
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

  // NUCLEAR OPTION: Complete application state reset and reload
  const executeNuclearReset = async () => {
    console.log('💥 NUCLEAR RESET: ===== INITIATING COMPLETE APPLICATION RESET =====');
    setNuclearResetInProgress(true);
    
    try {
      // Step 1: Clear all React state
      console.log('🧹 NUCLEAR RESET: Step 1 - Clearing all React state...');
      setRefreshKey(0);
      setSections([]);
      clearSelection();
      setIsLoading(true);
      
      // Step 2: Force hook reset
      console.log('🔄 NUCLEAR RESET: Step 2 - Forcing hook reset...');
      await nuclearReset();
      
      // Step 3: Wait for state to clear
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Step 4: Reinitialize everything from scratch
      console.log('🔄 NUCLEAR RESET: Step 3 - Reinitializing from database...');
      
      // Reload sections
      const freshSections = await getSections(currentQuestionnaire);
      setSections(freshSections);
      console.log('📂 NUCLEAR RESET: Reloaded sections:', freshSections.length);
      
      // Set active section
      if (freshSections.length > 0) {
        setActiveSection(freshSections[0].id);
      }
      
      // Step 5: Force multiple refresh cycles
      console.log('🔄 NUCLEAR RESET: Step 4 - Multiple refresh cycles...');
      for (let i = 0; i < 3; i++) {
        setRefreshKey(prev => prev + 1);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      console.log('✅ NUCLEAR RESET: ===== COMPLETE APPLICATION RESET SUCCESSFUL =====');
      
    } catch (error) {
      console.error('❌ NUCLEAR RESET: Failed:', error);
    } finally {
      setNuclearResetInProgress(false);
      setIsLoading(false);
    }
  };

  const handleDialogClose = () => {
    console.log('🔄 DIALOG: ===== DIALOG CLOSE WITH VERIFICATION =====');
    setShowImportDialog(false);
    setImportResults(null);
    
    if (!directUIMode) {
      // Nuclear verification after dialog close for database mode
      setTimeout(async () => {
        console.log('💥 DIALOG: Nuclear verification after dialog close');
        try {
          // Final verification with nuclear reset if needed
          const finalControls = await getControls(currentQuestionnaire);
          console.log('🔍 DIALOG: Final nuclear verification:', {
            dbControlCount: finalControls.length,
            uiControlCount: droppedControls.length,
            timestamp: new Date().toISOString(),
            refreshKey: refreshKey,
            syncDifference: finalControls.length - droppedControls.length
          });

          // If still significantly out of sync, execute nuclear reset
          if (finalControls.length > droppedControls.length + 2) {
            console.log('💥 DIALOG: Still significantly out of sync - executing nuclear reset');
            await executeNuclearReset();
          } else {
            // Just a regular refresh
            setRefreshKey(prev => prev + 1);
          }
          
          console.log('✅ DIALOG: ===== NUCLEAR VERIFICATION COMPLETED =====');
        } catch (error) {
          console.error('❌ DIALOG: Nuclear verification failed:', error);
        }
      }, 200);
    }
  };

  // Get current controls based on mode
  const getCurrentControls = () => {
    return directUIMode ? directUIControls : droppedControls;
  };

  // Get current selected control
  const getCurrentSelectedControl = () => {
    return directUIMode ? directUISelectedControl : selectedControl;
  };

  const renderContent = () => {
    if (isLoading || !isDbInitialized || nuclearResetInProgress) {
      return (
        <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300 transition-colors">
              {nuclearResetInProgress ? 'Nuclear reset in progress...' : 'Initializing database...'}
            </p>
            {nuclearResetInProgress && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Completely resetting application state and reloading from database
              </p>
            )}
          </div>
        </div>
      );
    }

    const currentControls = getCurrentControls();
    const currentSelectedControl = getCurrentSelectedControl();

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
                droppedControls={currentControls.filter(control => control.sectionId === activeSection)}
                selectedControl={currentSelectedControl}
                onControlSelect={handleControlSelect}
                onControlUpdate={handleControlUpdate}
                onControlMove={handleMoveControl}
                onControlRemove={handleRemoveControl}
                onControlReorder={handleReorderControl}
                onDrop={handleDrop}
                draggedControl={draggedControl}
                activeSection={activeSection}
              />
            </div>
            <PropertiesPanel
              selectedControl={currentSelectedControl}
              onUpdateControl={handleControlUpdate}
              sections={sections}
              droppedControls={currentControls}
            />
          </div>
        );
      
      case 'preview':
        return (
          <PreviewMode
            droppedControls={currentControls}
            sections={sections}
            onDeleteControl={handleDeleteControl}
          />
        );
      
      case 'json':
        return (
          <JSONViewer
            droppedControls={currentControls}
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
          onDirectImport={handleDirectImport}
        />
        
        <div className="flex-1 flex overflow-hidden">
          {renderContent()}
        </div>
        
        {/* Import Progress Indicator */}
        {importInProgress && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Database Import in Progress...
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Processing Excel data with nuclear-level validation and complete state reset.
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">
                  Check console for detailed progress logs.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Nuclear Reset Progress Indicator */}
        {nuclearResetInProgress && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
              <div className="text-center">
                <div className="animate-pulse">
                  <div className="w-16 h-16 bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white text-2xl">💥</span>
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Nuclear Reset in Progress
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Completely resetting application state and reloading all data from database.
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">
                  This will force synchronization between UI and database.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Import Success/Error Dialog */}
        <ImportSuccessDialog
          isOpen={showImportDialog}
          onClose={handleDialogClose}
          results={importResults}
        />
        
        {/* Enhanced Footer with Direct UI Status */}
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-6 py-3 transition-colors">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 transition-colors">
            <div className="flex items-center space-x-6">
              <span>© 2025 Jumbo No-Code Builder</span>
              <span>Professional Form Builder Platform</span>
              {isDbInitialized && <span className="text-green-600 dark:text-green-400">Database Connected</span>}
              <span className="capitalize">{theme} Theme</span>
              {directUIMode && (
                <span className="text-green-600 dark:text-green-400 animate-pulse flex items-center">
                  <Zap className="w-3 h-3 mr-1" />
                  Direct UI Mode
                </span>
              )}
              {importInProgress && <span className="text-blue-600 dark:text-blue-400 animate-pulse">Database Import Processing...</span>}
              {nuclearResetInProgress && <span className="text-red-600 dark:text-red-400 animate-pulse">Nuclear Reset Active</span>}
              <span className="text-xs text-white font-mono bg-blue-600 dark:bg-blue-700 px-3 py-1 rounded-full shadow-sm">
                RefreshKey: {refreshKey}
              </span>
              <span className="text-xs text-white font-mono bg-green-600 dark:bg-green-700 px-3 py-1 rounded-full shadow-sm">
                Controls: {getCurrentControls().length}
              </span>
              {getCurrentControls().length > 0 && (
                <span className="text-xs text-white font-mono bg-purple-600 dark:bg-purple-700 px-3 py-1 rounded-full shadow-sm">
                  Loaded: ✓
                </span>
              )}
              {directUIMode && (
                <span className="text-xs text-white font-mono bg-green-600 dark:bg-green-700 px-3 py-1 rounded-full shadow-sm animate-pulse">
                  Direct: ⚡
                </span>
              )}
              {nuclearResetInProgress && (
                <span className="text-xs text-white font-mono bg-red-600 dark:bg-red-700 px-3 py-1 rounded-full shadow-sm animate-pulse">
                  Nuclear: 💥
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <span>Version 1.0.0</span>
              {activeTab !== 'dashboard' && <span>Sections: {sections.length}</span>}
              {activeTab !== 'dashboard' && <span>Mode: {directUIMode ? 'Direct UI' : 'Database'}</span>}
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