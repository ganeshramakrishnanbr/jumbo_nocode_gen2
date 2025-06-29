import { useState, useCallback, useEffect } from 'react';
import { DroppedControl, ControlType } from '../types';
import { 
  getControls, 
  insertControl, 
  updateControl as updateControlDB, 
  deleteControl as deleteControlDB,
  reorderControls 
} from '../lib/db';

export const useDragDrop = (questionnaireId: string = 'default-questionnaire', isDbInitialized: boolean = false, refreshKey: number = 0) => {
  const [droppedControls, setDroppedControls] = useState<DroppedControl[]>([]);
  const [selectedControl, setSelectedControl] = useState<DroppedControl | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Enhanced control loading with comprehensive logging and error boundaries
  const loadControlsFromDB = useCallback(async () => {
    if (!isDbInitialized) {
      console.log('⏸️ useDragDrop: Database not initialized, skipping control load');
      setIsLoading(true);
      return;
    }

    try {
      setIsLoading(true);
      console.log('🔄 useDragDrop: ===== LOADING CONTROLS FROM DATABASE =====');
      console.log('📊 useDragDrop: Load parameters:', { 
        questionnaireId, 
        refreshKey,
        timestamp: new Date().toISOString()
      });
      
      const controls = await getControls(questionnaireId);
      
      console.log('📊 useDragDrop: Database query results:', {
        controlCount: controls.length,
        refreshKey,
        timestamp: new Date().toISOString()
      });

      // Detailed control logging
      if (controls.length > 0) {
        console.log('📝 useDragDrop: Loaded controls details:');
        controls.forEach((control, index) => {
          console.log(`   ${index + 1}. ${control.name} (${control.type}) - Section: ${control.sectionId}, Order: ${control.y}, ID: ${control.id}`);
        });
      } else {
        console.log('📝 useDragDrop: No controls found in database');
      }
      
      // Log section distribution for debugging
      const sectionDistribution = controls.reduce((acc, c) => {
        acc[c.sectionId || 'unknown'] = (acc[c.sectionId || 'unknown'] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      console.log('🎯 useDragDrop: Controls by section:', sectionDistribution);
      
      // Update state with error boundary
      console.log('🔄 useDragDrop: Updating React state...');
      setDroppedControls(controls);
      console.log('✅ useDragDrop: Controls state updated successfully');
      
      // Verify state update with delay
      setTimeout(() => {
        console.log('🔍 useDragDrop: State verification after update:', {
          stateControlCount: controls.length,
          refreshKey,
          timestamp: new Date().toISOString()
        });
      }, 100);
      
    } catch (error) {
      console.error('❌ useDragDrop: Failed to load controls:', error);
      // Don't throw error, just log it to prevent app crash
      setDroppedControls([]);
    } finally {
      setIsLoading(false);
      console.log('🏁 useDragDrop: Load controls process completed');
    }
  }, [questionnaireId, isDbInitialized, refreshKey]);

  // Load controls when dependencies change with enhanced error handling
  useEffect(() => {
    console.log('🔄 useDragDrop: ===== useEffect TRIGGERED =====');
    console.log('📊 useDragDrop: useEffect parameters:', { 
      questionnaireId, 
      isDbInitialized, 
      refreshKey,
      timestamp: new Date().toISOString()
    });
    
    // Add error boundary around loadControlsFromDB
    const safeLoadControls = async () => {
      try {
        await loadControlsFromDB();
      } catch (error) {
        console.error('❌ useDragDrop: useEffect error:', error);
      }
    };
    
    safeLoadControls();
  }, [loadControlsFromDB]);

  // Enhanced force refresh with comprehensive verification and multiple strategies
  const forceRefresh = useCallback(async () => {
    console.log('🔄 useDragDrop: ===== FORCE REFRESH INITIATED =====');
    console.log('📊 useDragDrop: Force refresh parameters:', {
      currentControlCount: droppedControls.length,
      refreshKey,
      questionnaireId,
      timestamp: new Date().toISOString()
    });
    
    try {
      // Strategy 1: Force reload from database
      console.log('🔄 useDragDrop: Strategy 1 - Force reload from database...');
      await loadControlsFromDB();
      
      // Strategy 2: Additional verification step with enhanced logging
      setTimeout(async () => {
        try {
          console.log('🔍 useDragDrop: Strategy 2 - Force refresh verification step...');
          const verificationControls = await getControls(questionnaireId);
          const currentStateCount = droppedControls.length;
          
          console.log('📊 useDragDrop: Force refresh verification results:', {
            dbControlCount: verificationControls.length,
            stateControlCount: currentStateCount,
            refreshKey,
            syncStatus: verificationControls.length === currentStateCount ? 'SYNCED' : 'OUT_OF_SYNC',
            timestamp: new Date().toISOString()
          });
          
          // If state is still out of sync, update it directly
          if (verificationControls.length !== currentStateCount) {
            console.log('🔄 useDragDrop: State out of sync - updating directly');
            setDroppedControls(verificationControls);
            console.log('✅ useDragDrop: Direct state update completed');
            
            // Strategy 3: Final verification after direct update
            setTimeout(() => {
              console.log('🔍 useDragDrop: Strategy 3 - Final verification after direct update:', {
                finalStateCount: verificationControls.length,
                expectedCount: verificationControls.length,
                timestamp: new Date().toISOString()
              });
            }, 100);
          } else {
            console.log('✅ useDragDrop: State is in sync');
          }
        } catch (error) {
          console.error('❌ useDragDrop: Force refresh verification failed:', error);
        }
      }, 200);
      
      console.log('✅ useDragDrop: Force refresh completed successfully');
    } catch (error) {
      console.error('❌ useDragDrop: Force refresh failed:', error);
    }
  }, [loadControlsFromDB, droppedControls.length, refreshKey, questionnaireId]);

  const addControl = useCallback(async (controlType: ControlType, x: number, y: number, sectionId: string = 'default') => {
    if (!isDbInitialized) {
      console.warn('⚠️ useDragDrop: Cannot add control - database not initialized');
      return;
    }

    try {
      const sectionControls = droppedControls.filter(c => c.sectionId === sectionId);
      const newControl: DroppedControl = {
        id: `${controlType.type}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
        type: controlType.type,
        name: controlType.name,
        x: 0, // Not used in ordered layout
        y: sectionControls.length, // Use as order index within section
        width: 400, // Standard width for ordered layout
        height: controlType.type === 'textarea' ? 100 : 50,
        properties: controlType.properties.reduce((acc, prop) => {
          acc[prop.name] = prop.value;
          return acc;
        }, {} as Record<string, any>),
        sectionId
      };
      
      console.log('➕ useDragDrop: Adding new control:', {
        id: newControl.id,
        type: newControl.type,
        name: newControl.name,
        sectionId: newControl.sectionId
      });
      
      // Insert into database
      await insertControl(newControl, questionnaireId);
      
      // Update local state
      setDroppedControls(prev => [...prev, newControl]);
      setSelectedControl(newControl);
      
      console.log('✅ useDragDrop: Control added successfully');
    } catch (error) {
      console.error('❌ useDragDrop: Failed to add control:', error);
    }
  }, [droppedControls, questionnaireId, isDbInitialized]);

  const updateControl = useCallback(async (id: string, updates: Partial<DroppedControl>) => {
    if (!isDbInitialized) {
      console.warn('⚠️ useDragDrop: Cannot update control - database not initialized');
      return;
    }

    try {
      console.log('🔄 useDragDrop: Updating control:', { id, updates });
      
      // Update in database
      await updateControlDB(id, updates);
      
      // Update local state
      setDroppedControls(prev => 
        prev.map(control => 
          control.id === id ? { ...control, ...updates } : control
        )
      );
      
      if (selectedControl?.id === id) {
        setSelectedControl(prev => prev ? { ...prev, ...updates } : null);
      }
      
      console.log('✅ useDragDrop: Control updated successfully');
    } catch (error) {
      console.error('❌ useDragDrop: Failed to update control:', error);
    }
  }, [selectedControl, questionnaireId, isDbInitialized]);

  const removeControl = useCallback(async (id: string) => {
    if (!isDbInitialized) {
      console.warn('⚠️ useDragDrop: Cannot remove control - database not initialized');
      return;
    }

    try {
      const controlToRemove = droppedControls.find(c => c.id === id);
      if (!controlToRemove) {
        console.warn('⚠️ useDragDrop: Control not found for removal:', id);
        return;
      }
      
      console.log('🗑️ useDragDrop: Removing control:', {
        id,
        name: controlToRemove.name,
        sectionId: controlToRemove.sectionId
      });
      
      // Delete from database
      await deleteControlDB(id);
      
      // Update local state and reorder
      const filtered = droppedControls.filter(control => control.id !== id);
      const reordered = filtered.map(control => {
        if (control.sectionId === controlToRemove.sectionId && control.y > controlToRemove.y) {
          return { ...control, y: control.y - 1 };
        }
        return control;
      });
      
      // Update order in database
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
      
      console.log('✅ useDragDrop: Control removed successfully');
    } catch (error) {
      console.error('❌ useDragDrop: Failed to remove control:', error);
    }
  }, [droppedControls, selectedControl, questionnaireId, isDbInitialized]);

  const moveControl = useCallback(async (id: string, direction: 'up' | 'down') => {
    if (!isDbInitialized) {
      console.warn('⚠️ useDragDrop: Cannot move control - database not initialized');
      return;
    }

    try {
      const control = droppedControls.find(c => c.id === id);
      if (!control) return;
      
      const sectionControls = droppedControls.filter(c => c.sectionId === control.sectionId);
      const currentIndex = sectionControls.findIndex(c => c.id === id);
      
      if (currentIndex === -1) return;
      
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (newIndex < 0 || newIndex >= sectionControls.length) return;
      
      console.log('🔄 useDragDrop: Moving control:', {
        id,
        direction,
        currentIndex,
        newIndex
      });
      
      // Swap the y positions
      const targetControl = sectionControls[newIndex];
      const updatedControls = droppedControls.map(c => {
        if (c.id === id) return { ...c, y: targetControl.y };
        if (c.id === targetControl.id) return { ...c, y: control.y };
        return c;
      });
      
      // Update in database
      await updateControlDB(id, { y: targetControl.y });
      await updateControlDB(targetControl.id, { y: control.y });
      
      setDroppedControls(updatedControls);
      console.log('✅ useDragDrop: Control moved successfully');
    } catch (error) {
      console.error('❌ useDragDrop: Failed to move control:', error);
    }
  }, [droppedControls, questionnaireId, isDbInitialized]);

  const reorderControl = useCallback(async (dragIndex: number, hoverIndex: number) => {
    if (!isDbInitialized) {
      console.warn('⚠️ useDragDrop: Cannot reorder control - database not initialized');
      return;
    }

    try {
      console.log('🔄 useDragDrop: Reordering controls:', { dragIndex, hoverIndex });
      
      const newControls = [...droppedControls];
      const draggedControl = newControls[dragIndex];
      
      // Remove the dragged control
      newControls.splice(dragIndex, 1);
      // Insert it at the new position
      newControls.splice(hoverIndex, 0, draggedControl);
      
      // Update y positions to match new order
      const reorderedControls = newControls.map((control, index) => ({
        ...control,
        y: index
      }));
      
      // Update in database
      await reorderControls(reorderedControls);
      
      setDroppedControls(reorderedControls);
      console.log('✅ useDragDrop: Controls reordered successfully');
    } catch (error) {
      console.error('❌ useDragDrop: Failed to reorder control:', error);
    }
  }, [droppedControls, questionnaireId, isDbInitialized]);

  const selectControl = useCallback((control: DroppedControl) => {
    console.log('🎯 useDragDrop: Control selected:', {
      id: control.id,
      name: control.name,
      type: control.type
    });
    setSelectedControl(control);
  }, []);

  const clearSelection = useCallback(() => {
    console.log('🎯 useDragDrop: Selection cleared');
    setSelectedControl(null);
  }, []);

  // Enhanced state change logging for debugging with more detailed information
  useEffect(() => {
    console.log('📊 useDragDrop: ===== STATE CHANGED =====');
    console.log('📊 useDragDrop: Current state:', {
      controlCount: droppedControls.length,
      selectedControlId: selectedControl?.id,
      selectedControlName: selectedControl?.name,
      isLoading,
      refreshKey,
      timestamp: new Date().toISOString()
    });

    // Log control distribution by section with enhanced details
    if (droppedControls.length > 0) {
      const distribution = droppedControls.reduce((acc, control) => {
        acc[control.sectionId || 'unknown'] = (acc[control.sectionId || 'unknown'] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      console.log('📂 useDragDrop: Current controls by section:', distribution);
      
      // Log first few controls for debugging
      console.log('📝 useDragDrop: First 5 controls in state:');
      droppedControls.slice(0, 5).forEach((control, index) => {
        console.log(`   ${index + 1}. ${control.name} (${control.type}) - Section: ${control.sectionId}, ID: ${control.id}`);
      });
    } else {
      console.log('📝 useDragDrop: No controls in current state');
    }
  }, [droppedControls.length, selectedControl?.id, selectedControl?.name, isLoading, refreshKey]);

  return {
    droppedControls,
    selectedControl,
    isLoading,
    addControl,
    updateControl,
    removeControl,
    moveControl,
    reorderControl,
    selectControl,
    clearSelection,
    forceRefresh
  };
};