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
import { PDFPreview } from './components/PDFPreview';
import { JSONViewer } from './components/JSONViewer';
import { SectionManager } from './components/SectionManager';
import { ImportSuccessDialog } from './components/ImportSuccessDialog';
import { useDragDrop } from './hooks/useDragDrop';
import { useTheme } from './hooks/useTheme';
import { useFormValues } from './hooks/useFormValues';
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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'design' | 'preview' | 'pdf' | 'json'>('dashboard');
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

  // Initialize theme and form values
  const { theme } = useTheme();
  const { formValues, updateFormValue } = useFormValues();

  const {
    droppedControls,
    selectedControl,
    isLoading: controlsLoading,
    directImportMode,
    addControl,
    updateControl,
    removeControl,
    moveControl,
    reorderControl,
    selectControl,
    clearSelection,
    forceRefresh,
    forceReload,
    nuclearReset,
    directImportControls
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
    addControl(controlType, x, y, activeSection);
    setDraggedControl(null);
  };

  const handleDirectImport = (controls: DroppedControl[]) => {
    console.log('🚀 DIRECT UI: ===== STARTING DIRECT UI IMPORT =====');
    console.log('📊 DIRECT UI: Import details:', {
      controlCount: controls.length,
      directUIMode: true,
      timestamp: new Date().toISOString()
    });

    try {
      // STEP 1: Extract unique section IDs from imported controls
      const sectionIds = controls.map(control => control.sectionId || 'default');
      const uniqueSectionIds = Array.from(new Set(sectionIds));
      console.log('📂 DIRECT UI: Creating sections for:', uniqueSectionIds);
      
      // STEP 2: Create section objects dynamically
      const newSections: Section[] = uniqueSectionIds.map((sectionId, index) => {
        const sectionName = sectionId === 'default' ? 'General' : 
          sectionId.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        
        return {
          id: sectionId,
          name: sectionName,
          color: index === 0 ? '#3B82F6' : `hsl(${(index * 60) % 360}, 70%, 50%)`,
          icon: index === 0 ? 'Layout' : 'Folder',
          description: `${sectionName} section`,
          order: index,
          required: false,
          controls: [],
          validation: {
            isValid: true,
            requiredFields: 0,
            completedFields: 0
          }
        };
      });
      
      // STEP 3: Update sections state
      setSections(newSections);
      console.log('✅ DIRECT UI: Created sections:', newSections.map(s => s.name));
      
      // STEP 4: Set active section to the first imported section
      if (newSections.length > 0) {
        setActiveSection(newSections[0].id);
        console.log('🎯 DIRECT UI: Active section set to:', newSections[0].id);
      }
      
      // STEP 5: Use the hook's direct import function
      const result = directImportControls(controls);
      
      // Reset refresh key to 0 to indicate successful direct import
      setRefreshKey(0);
      
      console.log('✅ DIRECT UI: Controls imported directly to UI state');
      console.log('🎉 DIRECT UI: ===== DIRECT UI IMPORT COMPLETED SUCCESSFULLY =====');
      
      // Show success message
      setImportResults({
        success: result.success,
        total: result.total,
        errors: result.errors
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
    moveControl(id, direction);
  };

  const handleRemoveControl = (id: string) => {
    removeControl(id);
  };

  const handleReorderControl = (dragIndex: number, hoverIndex: number) => {
    reorderControl(dragIndex, hoverIndex);
  };

  const handleControlSelect = (control: DroppedControl) => {
    selectControl(control);
  };

  const handleControlUpdate = (id: string, updates: Partial<DroppedControl>) => {
    updateControl(id, updates);
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
      const controlsToMove = droppedControls.filter(control => control.sectionId === id);
      
      for (const control of controlsToMove) {
        await updateControl(control.id, { sectionId: 'default' });
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
    removeControl(controlId);
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
    
    if (!directImportMode) {
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
          <div className="flex flex-1 flex-col lg:flex-row">
            {/* Mobile/Tablet: Stacked layout, Desktop: Side-by-side */}
            <div className="lg:hidden">
              <ControlLibrary onDragStart={handleDragStart} />
            </div>
            
            <div className="hidden lg:block">
              <ControlLibrary onDragStart={handleDragStart} />
            </div>
            
            <div className="flex-1 flex flex-col min-w-0">
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
            
            {/* Properties Panel - Hidden on mobile, collapsible on tablet */}
            <div className="hidden md:block">
              <PropertiesPanel
                selectedControl={selectedControl}
                onUpdateControl={handleControlUpdate}
                sections={sections}
                droppedControls={droppedControls}
              />
            </div>
          </div>
        );
      
      case 'preview':
        return (
          <PreviewMode
            droppedControls={droppedControls}
            sections={sections}
            onDeleteControl={handleDeleteControl}
            formValues={formValues}
            onFormValueChange={updateFormValue}
          />
        );
      
      case 'pdf':
        return (
          <PDFPreview
            droppedControls={droppedControls}
            sections={sections}
            currentTier={currentTier}
            formValues={formValues}
            onFormValueChange={updateFormValue}
          />
        );
      
      case 'json':
        return (
          <JSONViewer
            droppedControls={droppedControls}
            currentTier={currentTier}
            sections={sections}
            selectedTheme="classic"
            tabAlignment="top"
            formProgress={{
              overall: droppedControls.length > 0 ? Math.round((droppedControls.filter(c => c.properties.value).length / droppedControls.length) * 100) : 0,
              required: droppedControls.filter(c => c.properties.required).length > 0 ? Math.round((droppedControls.filter(c => c.properties.required && c.properties.value).length / droppedControls.filter(c => c.properties.required).length) * 100) : 100,
              filledCount: droppedControls.filter(c => c.properties.value).length,
              totalCount: droppedControls.length
            }}
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
          directImportMode={directImportMode}
        />
        
        {/* Enhanced Footer with Direct UI Status */}
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-6 py-3 transition-colors">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 transition-colors">
            <div className="flex items-center space-x-6">
              <span>© 2025 Jumbo No-Code Builder</span>
              <span>Professional Form Builder Platform</span>
              {isDbInitialized && <span className="text-green-600 dark:text-green-400">Database Connected</span>}
              <span className="capitalize">{theme} Theme</span>
              {directImportMode && (
                <span className="text-green-600 dark:text-green-400 animate-pulse flex items-center">
                  <span className="w-3 h-3 mr-1">⚡</span>
                  Direct UI Mode
                </span>
              )}
              {importInProgress && <span className="text-blue-600 dark:text-blue-400 animate-pulse">Database Import Processing...</span>}
              {nuclearResetInProgress && <span className="text-red-600 dark:text-red-400 animate-pulse">Nuclear Reset Active</span>}
              <span className="text-xs text-white font-mono bg-blue-600 dark:bg-blue-700 px-3 py-1 rounded-full shadow-sm">
                RefreshKey: {refreshKey}
              </span>
              <span className="text-xs text-white font-mono bg-green-600 dark:bg-green-700 px-3 py-1 rounded-full shadow-sm">
                Controls: {droppedControls.length}
              </span>
              {droppedControls.length > 0 && (
                <span className="text-xs text-white font-mono bg-purple-600 dark:bg-purple-700 px-3 py-1 rounded-full shadow-sm">
                  Loaded: ✓
                </span>
              )}
              {directImportMode && (
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
              {activeTab !== 'dashboard' && <span>Mode: {directImportMode ? 'Direct UI' : 'Database'}</span>}
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