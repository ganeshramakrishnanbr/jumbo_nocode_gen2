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

  // Load controls from database when database is initialized or refresh key changes
  const loadControlsFromDB = useCallback(async () => {
    if (!isDbInitialized) {
      console.log('⏸️ Database not initialized, skipping control load');
      setIsLoading(true);
      return;
    }

    try {
      setIsLoading(true);
      console.log('🔄 Loading controls from database...', { questionnaireId, refreshKey });
      const controls = await getControls(questionnaireId);
      console.log('📊 Loaded controls:', controls.length, 'controls');
      console.log('🎯 Controls by section:', controls.reduce((acc, c) => {
        acc[c.sectionId || 'unknown'] = (acc[c.sectionId || 'unknown'] || 0) + 1;
        return acc;
      }, {} as Record<string, number>));
      
      setDroppedControls(controls);
      console.log('✅ Controls state updated successfully');
    } catch (error) {
      console.error('❌ Failed to load controls:', error);
    } finally {
      setIsLoading(false);
    }
  }, [questionnaireId, isDbInitialized, refreshKey]);

  // Load controls when dependencies change
  useEffect(() => {
    console.log('🔄 useDragDrop useEffect triggered', { questionnaireId, isDbInitialized, refreshKey });
    loadControlsFromDB();
  }, [loadControlsFromDB]);

  // Function to manually force refresh controls
  const forceRefresh = useCallback(async () => {
    console.log('🔄 Force refresh triggered');
    await loadControlsFromDB();
  }, [loadControlsFromDB]);

  const addControl = useCallback(async (controlType: ControlType, x: number, y: number, sectionId: string = 'default') => {
    if (!isDbInitialized) return;

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
      
      // Insert into database
      await insertControl(newControl, questionnaireId);
      
      // Update local state
      setDroppedControls(prev => [...prev, newControl]);
      setSelectedControl(newControl);
    } catch (error) {
      console.error('Failed to add control:', error);
    }
  }, [droppedControls, questionnaireId, isDbInitialized]);

  const updateControl = useCallback(async (id: string, updates: Partial<DroppedControl>) => {
    if (!isDbInitialized) return;

    try {
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
    } catch (error) {
      console.error('Failed to update control:', error);
    }
  }, [selectedControl, questionnaireId, isDbInitialized]);

  const removeControl = useCallback(async (id: string) => {
    if (!isDbInitialized) return;

    try {
      const controlToRemove = droppedControls.find(c => c.id === id);
      if (!controlToRemove) return;
      
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
    } catch (error) {
      console.error('Failed to remove control:', error);
    }
  }, [droppedControls, selectedControl, questionnaireId, isDbInitialized]);

  const moveControl = useCallback(async (id: string, direction: 'up' | 'down') => {
    if (!isDbInitialized) return;

    try {
      const control = droppedControls.find(c => c.id === id);
      if (!control) return;
      
      const sectionControls = droppedControls.filter(c => c.sectionId === control.sectionId);
      const currentIndex = sectionControls.findIndex(c => c.id === id);
      
      if (currentIndex === -1) return;
      
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (newIndex < 0 || newIndex >= sectionControls.length) return;
      
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
    } catch (error) {
      console.error('Failed to move control:', error);
    }
  }, [droppedControls, questionnaireId, isDbInitialized]);

  const reorderControl = useCallback(async (dragIndex: number, hoverIndex: number) => {
    if (!isDbInitialized) return;

    try {
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
    } catch (error) {
      console.error('Failed to reorder control:', error);
    }
  }, [droppedControls, questionnaireId, isDbInitialized]);

  const selectControl = useCallback((control: DroppedControl) => {
    setSelectedControl(control);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedControl(null);
  }, []);

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