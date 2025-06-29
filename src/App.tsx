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
    forceRefresh
  } = useDragDrop(currentQuestionnaire, isDbInitialized, refreshKey);

  // Initialize database and load sections
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);
        console.log('🚀 Initializing application...');
        
        // Initialize database
        await initializeDatabase();
        setIsDbInitialized(true);
        console.log('✅ Database initialized successfully');
        
        // Load sections
        const loadedSections = await getSections(currentQuestionnaire);
        setSections(loadedSections);
        console.log('📂 Loaded sections:', loadedSections.length);
        
        // Set active section to first available section
        if (loadedSections.length > 0) {
          setActiveSection(loadedSections[0].id);
          console.log('🎯 Active section set to:', loadedSections[0].id);
        }
      } catch (error) {
        console.error('❌ Failed to initialize app:', error);
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
    console.log('🚀 EXCEL IMPORT STARTED');
    console.log('📊 Import Details:', {
      controlCount: controls.length,
      questionnaire: currentQuestionnaire,
      activeSection,
      currentControlCount: droppedControls.length,
      dbInitialized: isDbInitialized
    });

    if (!isDbInitialized) {
      console.error('❌ Database not initialized - cannot import');
      alert('Database not ready. Please wait and try again.');
      return;
    }

    setImportInProgress(true);
    
    try {
      console.log('📝 Controls to import:', controls.map(c => ({
        id: c.id,
        type: c.type,
        name: c.name,
        sectionId: c.sectionId,
        order: c.y
      })));

      let successCount = 0;
      let errorCount = 0;
      const errors: string[] = [];

      // Process each control individually with detailed logging
      for (let i = 0; i < controls.length; i++) {
        const control = controls[i];
        console.log(`🔄 Processing control ${i + 1}/${controls.length}:`, {
          id: control.id,
          type: control.type,
          name: control.name,
          sectionId: control.sectionId
        });

        try {
          await insertControl(control, currentQuestionnaire);
          successCount++;
          console.log(`✅ Successfully inserted control ${i + 1}: ${control.name}`);
        } catch (error) {
          errorCount++;
          const errorMsg = `Failed to insert ${control.name}: ${error}`;
          errors.push(errorMsg);
          console.error(`❌ Error inserting control ${i + 1}:`, error);
        }
      }

      console.log('📊 Import Summary:', {
        total: controls.length,
        success: successCount,
        errors: errorCount,
        errorDetails: errors
      });

      if (successCount === 0) {
        throw new Error(`No controls were imported successfully. Errors: ${errors.join(', ')}`);
      }

      // COMPREHENSIVE REFRESH STRATEGY
      console.log('🔄 Starting comprehensive refresh strategy...');
      
      // Strategy 1: Immediate refresh key update
      console.log('📈 Strategy 1: Updating refresh key');
      const newRefreshKey = refreshKey + 1;
      setRefreshKey(newRefreshKey);
      console.log(`🔑 Refresh key: ${refreshKey} → ${newRefreshKey}`);

      // Strategy 2: Force refresh after short delay
      setTimeout(async () => {
        console.log('⏰ Strategy 2: Executing force refresh');
        try {
          await forceRefresh();
          console.log('✅ Force refresh completed');
          
          // Verify controls are loaded
          const currentControls = await getControls(currentQuestionnaire);
          console.log('🔍 Post-refresh verification:', {
            dbControlCount: currentControls.length,
            uiControlCount: droppedControls.length,
            importedCount: successCount
          });
          
        } catch (error) {
          console.error('❌ Force refresh failed:', error);
        }
      }, 150);

      // Strategy 3: Final verification and correction
      setTimeout(async () => {
        console.log('🔍 Strategy 3: Final verification and sync check');
        try {
          const dbControls = await getControls(currentQuestionnaire);
          console.log('📊 Final verification results:', {
            dbControlCount: dbControls.length,
            uiControlCount: droppedControls.length,
            expectedMinimum: successCount,
            syncStatus: dbControls.length >= successCount ? 'GOOD' : 'NEEDS_SYNC'
          });

          // If UI is out of sync, force another refresh
          if (dbControls.length > droppedControls.length) {
            console.log('🔄 UI out of sync - forcing final refresh');
            setRefreshKey(prev => prev + 1);
          } else {
            console.log('✅ UI and database are in sync');
          }

          // Log section distribution
          const sectionDistribution = dbControls.reduce((acc, control) => {
            const section = control.sectionId || 'unknown';
            acc[section] = (acc[section] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
          console.log('📂 Controls by section:', sectionDistribution);

        } catch (error) {
          console.error('❌ Final verification failed:', error);
        }
      }, 400);

      // Strategy 4: User notification and guidance
      const message = successCount === controls.length 
        ? `Successfully imported all ${successCount} controls!`
        : `Imported ${successCount} of ${controls.length} controls. ${errorCount} failed.`;
      
      console.log(`🎉 ${message}`);
      
      // Show detailed user feedback
      if (errorCount > 0) {
        alert(`${message}\n\nErrors:\n${errors.slice(0, 3).join('\n')}${errors.length > 3 ? '\n...' : ''}`);
      } else {
        alert(`${message}\n\nControls should appear in the Design tab shortly. If they don't appear immediately, please wait a moment for the refresh to complete.`);
      }

    } catch (error) {
      console.error('❌ EXCEL IMPORT FAILED:', error);
      alert(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setImportInProgress(false);
      console.log('🏁 EXCEL IMPORT PROCESS COMPLETED');
    }
  };

  const renderContent = () => {
    if (isLoading || !isDbInitialized) {
      return (
        <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300 transition-colors">Initializing database...</p>
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
        
        {/* Import Progress Indicator */}
        {importInProgress && (
          <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Importing controls...</span>
          </div>
        )}
        
        {/* Footer */}
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-6 py-3 transition-colors">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 transition-colors">
            <div className="flex items-center space-x-6">
              <span>© 2025 Jumbo No-Code Builder</span>
              <span>Professional Form Builder Platform</span>
              {isDbInitialized && <span className="text-green-600 dark:text-green-400">Database Connected</span>}
              <span className="capitalize">{theme} Theme</span>
              {importInProgress && <span className="text-blue-600 dark:text-blue-400">Import in Progress</span>}
            </div>
            <div className="flex items-center space-x-4">
              <span>Version 1.0.0</span>
              {activeTab !== 'dashboard' && <span>Sections: {sections.length}</span>}
              {activeTab !== 'dashboard' && <span>Controls: {droppedControls.length}</span>}
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