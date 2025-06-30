import { useState, useCallback, useEffect, useRef } from 'react';
import { DroppedControl, ControlType } from '../types';
import { 
  getControls, 
  insertControl, 
  updateControl as updateControlDB, 
  deleteControl as deleteControlDB,
  reorderControls,
  verifyControlsInDatabase
} from '../lib/db';

export const useDragDrop = (questionnaireId: string = 'default-questionnaire', isDbInitialized: boolean = false, refreshKey: number = 0, activeSection: string = 'default') => {
  const [droppedControls, setDroppedControls] = useState<DroppedControl[]>([]);
  const [selectedControl, setSelectedControl] = useState<DroppedControl | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [directImportMode, setDirectImportMode] = useState(false);

  // Load controls from database
  const loadControlsFromDB = useCallback(async () => {
    if (!isDbInitialized || directImportMode) {
      console.log('⏸️ useDragDrop: Skipping DB load - direct import mode active or DB not ready');
      return;
    }

    try {
      setIsLoading(true);
      console.log('🔄 useDragDrop: Loading controls from database');
      
      const controls = await getControls(questionnaireId);
      
      console.log('📊 useDragDrop: Database query results:', {
        controlCount: controls.length,
        refreshKey,
        timestamp: new Date().toISOString()
      });

      setDroppedControls(controls);
      console.log('✅ useDragDrop: Controls loaded successfully');
      
    } catch (error) {
      console.error('❌ useDragDrop: Failed to load controls:', error);
      setDroppedControls([]);
    } finally {
      setIsLoading(false);
    }
  }, [questionnaireId, isDbInitialized, refreshKey, directImportMode]);

  // Initialize controls on database ready
  useEffect(() => {
    if (isDbInitialized && !directImportMode) {
      loadControlsFromDB();
    }
  }, [loadControlsFromDB]);

  // **NEW: Direct UI Import Function**
  const directImportControls = useCallback((controls: DroppedControl[]) => {
    console.log('🚀 DIRECT IMPORT: ===== DIRECT UI IMPORT INITIATED =====');
    console.log('📊 DIRECT IMPORT: Importing directly to UI state:', {
      controlCount: controls.length,
      currentControlCount: droppedControls.length,
      timestamp: new Date().toISOString()
    });

    // Enable direct import mode
    setDirectImportMode(true);
    setIsLoading(false);

    // Group controls by section and assign proper order within each section
    const controlsBySection = controls.reduce((acc, control) => {
      const sectionId = control.sectionId || 'default';
      if (!acc[sectionId]) acc[sectionId] = [];
      acc[sectionId].push(control);
      return acc;
    }, {} as Record<string, DroppedControl[]>);

    // Generate unique IDs for imported controls and preserve original section IDs
    const processedControls: DroppedControl[] = [];
    Object.entries(controlsBySection).forEach(([sectionId, sectionControls]) => {
      sectionControls.forEach((control, index) => {
        processedControls.push({
          ...control,
          id: `direct-import-${Date.now()}-${processedControls.length}-${Math.random().toString(36).substring(2, 8)}`,
          x: 0,
          y: index, // Order within section
          width: 400,
          height: control.type === 'textarea' ? 100 : 50,
          sectionId: sectionId
        });
      });
    });

    console.log('📝 DIRECT IMPORT: Processed controls for direct UI import:');
    processedControls.forEach((control, index) => {
      console.log(`   ${index + 1}. ${control.name} (${control.type}) - Section: ${control.sectionId}, ID: ${control.id}`);
    });

    // **DIRECT UI STATE UPDATE - NO DATABASE**
    setDroppedControls(processedControls);

    console.log('✅ DIRECT IMPORT: ===== DIRECT UI IMPORT COMPLETED =====');
    console.log('📊 DIRECT IMPORT: Final state:', {
      importedControlCount: processedControls.length,
      directImportMode: true,
      timestamp: new Date().toISOString()
    });

    return {
      success: processedControls.length,
      total: controls.length,
      errors: []
    };
  }, [droppedControls.length]);

  // **NEW: Toggle between direct import mode and database mode**
  const toggleDirectImportMode = useCallback((enabled: boolean) => {
    console.log(`🔄 DIRECT IMPORT: Toggling direct import mode: ${enabled}`);
    setDirectImportMode(enabled);
    
    if (!enabled && isDbInitialized) {
      // When disabling direct import mode, reload from database
      loadControlsFromDB();
    }
  }, [isDbInitialized, loadControlsFromDB]);

  // **NEW: Save direct import controls to database**
  const saveDirectImportToDatabase = useCallback(async () => {
    if (!directImportMode || !isDbInitialized) {
      console.log('⚠️ DIRECT IMPORT: Cannot save - not in direct import mode or DB not ready');
      return { success: false, error: 'Not in direct import mode or database not ready' };
    }

    try {
      console.log('🔄 DIRECT IMPORT: Saving direct import controls to database...');
      
      let successCount = 0;
      const errors: string[] = [];

      for (const control of droppedControls) {
        try {
          await insertControl(control, questionnaireId);
          successCount++;
          console.log(`✅ DIRECT IMPORT: Saved control: ${control.name}`);
        } catch (error) {
          const errorMsg = `Failed to save ${control.name}: ${error}`;
          errors.push(errorMsg);
          console.error(`❌ DIRECT IMPORT: ${errorMsg}`);
        }
      }

      console.log('📊 DIRECT IMPORT: Save results:', {
        successCount,
        errorCount: errors.length,
        totalControls: droppedControls.length
      });

      if (successCount > 0) {
        // Disable direct import mode and reload from database
        setDirectImportMode(false);
        await loadControlsFromDB();
        
        return { 
          success: true, 
          successCount, 
          errorCount: errors.length, 
          errors 
        };
      } else {
        return { 
          success: false, 
          error: 'No controls were saved successfully',
          errors 
        };
      }

    } catch (error) {
      console.error('❌ DIRECT IMPORT: Failed to save to database:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        errors: []
      };
    }
  }, [directImportMode, isDbInitialized, droppedControls, questionnaireId, loadControlsFromDB]);

  const forceRefresh = useCallback(async () => {
    console.log('🔄 useDragDrop: Force refresh initiated');
    
    if (directImportMode) {
      console.log('🔄 useDragDrop: In direct import mode - no database refresh needed');
      return;
    }
    
    await loadControlsFromDB();
  }, [loadControlsFromDB, directImportMode]);

  const forceReload = useCallback(async () => {
    console.log('🔄 useDragDrop: Force reload initiated');
    
    if (directImportMode) {
      console.log('🔄 useDragDrop: In direct import mode - clearing UI state');
      setDroppedControls([]);
      setSelectedControl(null);
      return;
    }
    
    setDroppedControls([]);
    setSelectedControl(null);
    setIsLoading(true);
    
    setTimeout(async () => {
      await loadControlsFromDB();
    }, 100);
  }, [loadControlsFromDB, directImportMode]);

  const nuclearReset = useCallback(async () => {
    console.log('💥 useDragDrop: Nuclear reset initiated');
    
    setDirectImportMode(false);
    setDroppedControls([]);
    setSelectedControl(null);
    setIsLoading(true);
    
    if (isDbInitialized) {
      setTimeout(async () => {
        await loadControlsFromDB();
      }, 100);
    }
  }, [isDbInitialized, loadControlsFromDB]);

  // Standard CRUD operations (modified for direct import mode)
  const addControl = useCallback(async (controlType: ControlType, x: number, y: number, sectionId: string = 'default') => {
    const sectionControls = droppedControls.filter(c => c.sectionId === sectionId);
    const newControl: DroppedControl = {
      id: `${controlType.type}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
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
      sectionId
    };

    if (directImportMode) {
      // Direct UI update
      setDroppedControls(prev => [...prev, newControl]);
      setSelectedControl(newControl);
      console.log('✅ useDragDrop: Control added directly to UI');
    } else if (isDbInitialized) {
      // Database + UI update
      try {
        await insertControl(newControl, questionnaireId);
        setDroppedControls(prev => [...prev, newControl]);
        setSelectedControl(newControl);
        console.log('✅ useDragDrop: Control added to database and UI');
      } catch (error) {
        console.error('❌ useDragDrop: Failed to add control:', error);
      }
    }
  }, [droppedControls, questionnaireId, isDbInitialized, directImportMode]);

  const updateControl = useCallback(async (id: string, updates: Partial<DroppedControl>) => {
    if (directImportMode) {
      // Direct UI update
      setDroppedControls(prev => 
        prev.map(control => 
          control.id === id ? { ...control, ...updates } : control
        )
      );
      
      if (selectedControl?.id === id) {
        setSelectedControl(prev => prev ? { ...prev, ...updates } : null);
      }
      console.log('✅ useDragDrop: Control updated directly in UI');
    } else if (isDbInitialized) {
      // Database + UI update
      try {
        await updateControlDB(id, updates);
        
        setDroppedControls(prev => 
          prev.map(control => 
            control.id === id ? { ...control, ...updates } : control
          )
        );
        
        if (selectedControl?.id === id) {
          setSelectedControl(prev => prev ? { ...prev, ...updates } : null);
        }
        console.log('✅ useDragDrop: Control updated in database and UI');
      } catch (error) {
        console.error('❌ useDragDrop: Failed to update control:', error);
      }
    }
  }, [selectedControl, questionnaireId, isDbInitialized, directImportMode]);

  const removeControl = useCallback(async (id: string) => {
    const controlToRemove = droppedControls.find(c => c.id === id);
    if (!controlToRemove) return;

    if (directImportMode) {
      // Direct UI update
      const filtered = droppedControls.filter(control => control.id !== id);
      const reordered = filtered.map(control => {
        if (control.sectionId === controlToRemove.sectionId && control.y > controlToRemove.y) {
          return { ...control, y: control.y - 1 };
        }
        return control;
      });
      
      setDroppedControls(reordered);
      
      if (selectedControl?.id === id) {
        setSelectedControl(null);
      }
      console.log('✅ useDragDrop: Control removed directly from UI');
    } else if (isDbInitialized) {
      // Database + UI update
      try {
        await deleteControlDB(id);
        
        const filtered = droppedControls.filter(control => control.id !== id);
        const reordered = filtered.map(control => {
          if (control.sectionId === controlToRemove.sectionId && control.y > controlToRemove.y) {
            return { ...control, y: control.y - 1 };
          }
          return control;
        });
        
        const controlsToUpdate = reordered.filter(c => 
          c.sectionId === controlToRemove.sectionId && c.y >= controlToRemove.y
        );
        if (controlsToUpdate.length > 0) {
          await reorderControls(controlsToUpdate);
        }
        
        setDroppedControls(reordered);
        
        if (selectedControl?.id === id) {
          setSelectedControl(null);
        }
        console.log('✅ useDragDrop: Control removed from database and UI');
      } catch (error) {
        console.error('❌ useDragDrop: Failed to remove control:', error);
      }
    }
  }, [droppedControls, selectedControl, questionnaireId, isDbInitialized, directImportMode]);

  const moveControl = useCallback(async (id: string, direction: 'up' | 'down') => {
    const control = droppedControls.find(c => c.id === id);
    if (!control) return;
    
    const sectionControls = droppedControls.filter(c => c.sectionId === control.sectionId);
    const currentIndex = sectionControls.findIndex(c => c.id === id);
    
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= sectionControls.length) return;
    
    const targetControl = sectionControls[newIndex];

    if (directImportMode) {
      // Direct UI update
      const updatedControls = droppedControls.map(c => {
        if (c.id === id) return { ...c, y: targetControl.y };
        if (c.id === targetControl.id) return { ...c, y: control.y };
        return c;
      });
      
      setDroppedControls(updatedControls);
      console.log('✅ useDragDrop: Control moved directly in UI');
    } else if (isDbInitialized) {
      // Database + UI update
      try {
        await updateControlDB(id, { y: targetControl.y });
        await updateControlDB(targetControl.id, { y: control.y });
        
        const updatedControls = droppedControls.map(c => {
          if (c.id === id) return { ...c, y: targetControl.y };
          if (c.id === targetControl.id) return { ...c, y: control.y };
          return c;
        });
        
        setDroppedControls(updatedControls);
        console.log('✅ useDragDrop: Control moved in database and UI');
      } catch (error) {
        console.error('❌ useDragDrop: Failed to move control:', error);
      }
    }
  }, [droppedControls, questionnaireId, isDbInitialized, directImportMode]);

  const reorderControl = useCallback(async (dragIndex: number, hoverIndex: number) => {
    console.log('🔄 REORDER: Starting reorder operation', { dragIndex, hoverIndex, controlCount: droppedControls.length });
    
    // Work directly with all controls and reorder by index
    if (dragIndex >= droppedControls.length || hoverIndex >= droppedControls.length || dragIndex < 0 || hoverIndex < 0) {
      console.error('❌ REORDER: Invalid indices', { dragIndex, hoverIndex, controlCount: droppedControls.length });
      return;
    }
    
    const newControls = [...droppedControls];
    const draggedControl = newControls[dragIndex];
    
    // Perform the reorder
    newControls.splice(dragIndex, 1);
    newControls.splice(hoverIndex, 0, draggedControl);
    
    // Update y positions based on new order
    const allReorderedControls = newControls.map((control, index) => ({
      ...control,
      y: index
    }));

    console.log('📝 REORDER: Reordered controls', { 
      draggedControl: draggedControl.name, 
      fromIndex: dragIndex, 
      toIndex: hoverIndex,
      totalControls: allReorderedControls.length
    });

    if (directImportMode) {
      // Direct UI update
      setDroppedControls(allReorderedControls);
      console.log('✅ REORDER: Controls reordered directly in UI');
    } else if (isDbInitialized) {
      // Database + UI update
      try {
        await reorderControls(allReorderedControls);
        setDroppedControls(allReorderedControls);
        console.log('✅ REORDER: Controls reordered in database and UI');
      } catch (error) {
        console.error('❌ REORDER: Failed to reorder control:', error);
      }
    }
  }, [droppedControls, activeSection, isDbInitialized, directImportMode]);

  const selectControl = useCallback((control: DroppedControl) => {
    setSelectedControl(control);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedControl(null);
  }, []);

  // Enhanced state monitoring
  useEffect(() => {
    console.log('📊 useDragDrop: Current state:', {
      controlCount: droppedControls.length,
      selectedControlId: selectedControl?.id,
      isLoading,
      refreshKey,
      directImportMode,
      timestamp: new Date().toISOString()
    });

    if (droppedControls.length > 0) {
      console.log('📝 useDragDrop: First 3 controls:');
      droppedControls.slice(0, 3).forEach((control, index) => {
        console.log(`   ${index + 1}. ${control.name} (${control.type}) - Section: ${control.sectionId}`);
      });
    }
  }, [droppedControls.length, selectedControl?.id, isLoading, refreshKey, directImportMode]);

  return {
    droppedControls,
    selectedControl,
    isLoading,
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
    // New direct import functions
    directImportControls,
    toggleDirectImportMode,
    saveDirectImportToDatabase
  };
};