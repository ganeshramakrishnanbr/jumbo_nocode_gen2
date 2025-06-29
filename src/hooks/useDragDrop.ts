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

  // Enhanced control loading with comprehensive logging
  const loadControlsFromDB = useCallback(async () => {
    if (!isDbInitialized) {
      console.log('⏸️ useDragDrop: Database not initialized, skipping control load');
      setIsLoading(true);
      return;
    }

    try {
      setIsLoading(true);
      console.log('🔄 useDragDrop: Loading controls from database...', { 
        questionnaireId, 
        refreshKey,
        timestamp: new Date().toISOString()
      });
      
      const controls = await getControls(questionnaireId);
      
      console.log('📊 useDragDrop: Database query results:', {
        controlCount: controls.length,
        controls: controls.map(c => ({
          id: c.id,
          type: c.type,
          name: c.name,
          sectionId: c.sectionId,
          order: c.y
        }))
      });
      
      // Log section distribution
      const sectionDistribution = controls.reduce((acc, c) => {
        acc[c.sectionId || 'unknown'] = (acc[c.sectionId || 'unknown'] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      console.log('🎯 useDragDrop: Controls by section:', sectionDistribution);
      
      // Update state
      setDroppedControls(controls);
      console.log('✅ useDragDrop: Controls state updated successfully');
      
      // Verify state update
      setTimeout(() => {
        console.log('🔍 useDragDrop: State verification after update:', {
          stateControlCount: controls.length,
          refreshKey,
          timestamp: new Date().toISOString()
        });
      }, 50);
      
    } catch (error) {
      console.error('❌ useDragDrop: Failed to load controls:', error);
    } finally {
      setIsLoading(false);
    }
  }, [questionnaireId, isDbInitialized, refreshKey]);

  // Load controls when dependencies change
  useEffect(() => {
    console.log('🔄 useDragDrop: useEffect triggered', { 
      questionnaireId, 
      isDbInitialized, 
      refreshKey,
      timestamp: new Date().toISOString()
    });
    loadControlsFromDB();
  }, [loadControlsFromDB]);

  // Enhanced force refresh with verification
  const forceRefresh = useCallback(async () => {
    console.log('🔄 useDragDrop: Force refresh initiated', {
      currentControlCount: droppedControls.length,
      refreshKey,
      timestamp: new Date().toISOString()
    });
    
    try {
      await loadControlsFromDB();
      console.log('✅ useDragDrop: Force refresh completed successfully');
    } catch (error) {
      console.error('❌ useDragDrop: Force refresh failed:', error);
    }
  }, [loadControlsFromDB, droppedControls.length, refreshKey]);

  const addControl = useCallback(async (controlType: ControlType, x: number, y: number, sectionId: string = 'default') => {
    if (!isDbInitialized) {
      console.warn('⚠️ useDragDrop: Cannot add control - database not initialized');
      return;
    }

    try {
      const sectionControls = droppedControls.filter(c => c.sectionId === sectionId);
      const newControl: DroppedControl = {
        id: `${controlType.type}-${Date.now()}`,
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

  // Log state changes for debugging
  useEffect(() => {
    console.log('📊 useDragDrop: State changed:', {
      controlCount: droppedControls.length,
      selectedControlId: selectedControl?.id,
      isLoading,
      refreshKey,
      timestamp: new Date().toISOString()
    });
  }, [droppedControls.length, selectedControl?.id, isLoading, refreshKey]);

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