import { useState, useCallback, useEffect } from 'react';
import { DroppedControl, ControlType } from '../types';
import { 
  getControls, 
  insertControl, 
  updateControl as updateControlDB, 
  deleteControl as deleteControlDB,
  reorderControls,
  verifyControlsInDatabase
} from '../lib/db';

export const useDragDrop = (questionnaireId: string = 'default-questionnaire', isDbInitialized: boolean = false, refreshKey: number = 0) => {
  const [droppedControls, setDroppedControls] = useState<DroppedControl[]>([]);
  const [selectedControl, setSelectedControl] = useState<DroppedControl | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSyncHash, setLastSyncHash] = useState<string>('');
  const [stableStateCounter, setStableStateCounter] = useState(0);

  // OPTIMIZED: Enhanced control loading with stability tracking
  const loadControlsFromDB = useCallback(async () => {
    if (!isDbInitialized) {
      console.log('⏸️ useDragDrop: Database not initialized, skipping control load');
      setIsLoading(true);
      return;
    }

    try {
      setIsLoading(true);
      console.log('🔄 useDragDrop: ===== OPTIMIZED CONTROL LOADING =====');
      console.log('📊 useDragDrop: Load parameters:', { 
        questionnaireId, 
        refreshKey,
        timestamp: new Date().toISOString(),
        currentStateCount: droppedControls.length,
        stableStateCounter
      });
      
      // Use verification function for enhanced logging
      const verification = await verifyControlsInDatabase(questionnaireId);
      const controls = verification.controls;
      
      console.log('📊 useDragDrop: Optimized database verification results:', {
        controlCount: controls.length,
        refreshKey,
        timestamp: new Date().toISOString(),
        previousStateCount: droppedControls.length,
        changeDetected: controls.length !== droppedControls.length,
        stableStateCounter
      });

      // Generate sync hash for state tracking
      const newSyncHash = controls.map(c => `${c.id}-${c.type}-${c.sectionId}`).join('|');
      const hashChanged = newSyncHash !== lastSyncHash;
      
      console.log('🔍 useDragDrop: Optimized sync hash comparison:', {
        previousHash: lastSyncHash.substring(0, 20) + '...',
        newHash: newSyncHash.substring(0, 20) + '...',
        hashChanged,
        stableStateCounter: hashChanged ? 0 : stableStateCounter + 1
      });

      // OPTIMIZED: Only update state if there are actual changes
      if (hashChanged || controls.length !== droppedControls.length) {
        console.log('🔄 useDragDrop: State changes detected - updating...');
        setDroppedControls(controls);
        setLastSyncHash(newSyncHash);
        setStableStateCounter(0); // Reset stability counter on change
        
        console.log('✅ useDragDrop: State updated successfully:', {
          newCount: controls.length,
          changeApplied: true,
          syncHashUpdated: true
        });
      } else {
        console.log('✅ useDragDrop: State is stable - no update needed');
        setStableStateCounter(prev => prev + 1);
      }
      
    } catch (error) {
      console.error('❌ useDragDrop: Optimized control loading failed:', error);
      setDroppedControls([]);
    } finally {
      setIsLoading(false);
      console.log('🏁 useDragDrop: Optimized load controls process completed');
    }
  }, [questionnaireId, isDbInitialized, refreshKey, droppedControls.length, lastSyncHash, stableStateCounter]);

  // OPTIMIZED: Debounced useEffect to prevent excessive calls
  useEffect(() => {
    console.log('🔄 useDragDrop: ===== OPTIMIZED useEffect TRIGGERED =====');
    console.log('📊 useDragDrop: Optimized useEffect parameters:', { 
      questionnaireId, 
      isDbInitialized, 
      refreshKey,
      currentControlCount: droppedControls.length,
      timestamp: new Date().toISOString(),
      stableStateCounter
    });
    
    // OPTIMIZED: Add debouncing to prevent rapid successive calls
    const timeoutId = setTimeout(() => {
      loadControlsFromDB();
    }, 50); // Small delay to debounce rapid calls
    
    return () => clearTimeout(timeoutId);
  }, [questionnaireId, isDbInitialized, refreshKey]);

  // OPTIMIZED: Smart force refresh that checks stability first
  const forceRefresh = useCallback(async () => {
    console.log('🔄 useDragDrop: ===== OPTIMIZED FORCE REFRESH INITIATED =====');
    console.log('📊 useDragDrop: Optimized force refresh parameters:', {
      currentControlCount: droppedControls.length,
      refreshKey,
      questionnaireId,
      timestamp: new Date().toISOString(),
      stableStateCounter
    });
    
    try {
      // OPTIMIZED: Check if state is already stable
      if (stableStateCounter >= 2) {
        console.log('✅ useDragDrop: State is already stable - skipping force refresh');
        return;
      }
      
      // Strategy 1: Optimized force reload with stability check
      console.log('🔄 useDragDrop: Strategy 1 - Optimized force reload with stability check...');
      await loadControlsFromDB();
      
      // Strategy 2: Verification with smart sync detection
      setTimeout(async () => {
        try {
          console.log('🔍 useDragDrop: Strategy 2 - Smart verification with sync detection...');
          const verification = await verifyControlsInDatabase(questionnaireId);
          const currentStateCount = droppedControls.length;
          
          console.log('📊 useDragDrop: Optimized force refresh verification results:', {
            dbControlCount: verification.count,
            stateControlCount: currentStateCount,
            refreshKey,
            syncStatus: verification.count === currentStateCount ? 'SYNCED' : 'OUT_OF_SYNC',
            syncDifference: verification.count - currentStateCount,
            timestamp: new Date().toISOString(),
            stableStateCounter
          });
          
          // OPTIMIZED: Only update if significantly out of sync
          if (Math.abs(verification.count - currentStateCount) > 1) {
            console.log('🔄 useDragDrop: Significant sync difference detected - applying correction');
            setDroppedControls(verification.controls);
            setLastSyncHash(verification.controls.map(c => `${c.id}-${c.type}-${c.sectionId}`).join('|'));
            setStableStateCounter(0);
            console.log('✅ useDragDrop: Optimized sync correction applied');
          } else {
            console.log('✅ useDragDrop: State is optimally synced');
            setStableStateCounter(prev => prev + 1);
          }
        } catch (error) {
          console.error('❌ useDragDrop: Optimized force refresh verification failed:', error);
        }
      }, 150); // Reduced delay for faster response
      
      console.log('✅ useDragDrop: Optimized force refresh completed successfully');
    } catch (error) {
      console.error('❌ useDragDrop: Optimized force refresh failed:', error);
    }
  }, [loadControlsFromDB, droppedControls.length, refreshKey, questionnaireId, stableStateCounter]);

  // OPTIMIZED: Intelligent force reload with stability preservation
  const forceReload = useCallback(async () => {
    console.log('🔄 useDragDrop: ===== OPTIMIZED FORCE RELOAD INITIATED =====');
    console.log('📊 useDragDrop: Optimized force reload parameters:', {
      currentControlCount: droppedControls.length,
      refreshKey,
      questionnaireId,
      timestamp: new Date().toISOString(),
      stableStateCounter
    });
    
    try {
      // OPTIMIZED: Preserve stable state if possible
      if (stableStateCounter >= 3) {
        console.log('✅ useDragDrop: State is highly stable - performing gentle reload');
        await loadControlsFromDB();
        return;
      }
      
      // Clear current state with optimized timing
      console.log('🔄 useDragDrop: Optimized clearing current state...');
      setDroppedControls([]);
      setLastSyncHash('');
      setStableStateCounter(0);
      setIsLoading(true);
      
      // Optimized reload timing
      setTimeout(async () => {
        try {
          console.log('🔄 useDragDrop: Optimized reloading from database...');
          const verification = await verifyControlsInDatabase(questionnaireId);
          
          console.log('📊 useDragDrop: Optimized force reload results:', {
            freshControlCount: verification.count,
            timestamp: new Date().toISOString()
          });
          
          setDroppedControls(verification.controls);
          setLastSyncHash(verification.controls.map(c => `${c.id}-${c.type}-${c.sectionId}`).join('|'));
          setStableStateCounter(1); // Start with some stability
          setIsLoading(false);
          
          console.log('✅ useDragDrop: Optimized force reload completed');
        } catch (error) {
          console.error('❌ useDragDrop: Optimized force reload failed:', error);
          setIsLoading(false);
        }
      }, 75); // Optimized timing
      
    } catch (error) {
      console.error('❌ useDragDrop: Optimized force reload failed:', error);
      setIsLoading(false);
    }
  }, [droppedControls.length, refreshKey, questionnaireId, stableStateCounter]);

  // OPTIMIZED: Intelligent nuclear reset with stability tracking
  const nuclearReset = useCallback(async () => {
    console.log('💥 useDragDrop: ===== OPTIMIZED NUCLEAR RESET INITIATED =====');
    console.log('📊 useDragDrop: Optimized nuclear reset parameters:', {
      currentControlCount: droppedControls.length,
      refreshKey,
      questionnaireId,
      timestamp: new Date().toISOString(),
      stableStateCounter
    });
    
    try {
      // Step 1: Complete state reset with optimization
      console.log('💥 useDragDrop: Step 1 - Optimized state reset...');
      setDroppedControls([]);
      setSelectedControl(null);
      setLastSyncHash('');
      setStableStateCounter(0);
      setIsLoading(true);
      
      // Step 2: Optimized wait time
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Step 3: Optimized nuclear reload with verification
      console.log('💥 useDragDrop: Step 2 - Optimized nuclear reload...');
      const verification = await verifyControlsInDatabase(questionnaireId);
      
      console.log('📊 useDragDrop: Optimized nuclear reset reload results:', {
        nuclearControlCount: verification.count,
        timestamp: new Date().toISOString()
      });
      
      // Step 4: Optimized state reconstruction
      console.log('💥 useDragDrop: Step 3 - Optimized state reconstruction...');
      setDroppedControls(verification.controls);
      setLastSyncHash(verification.controls.map(c => `${c.id}-${c.type}-${c.sectionId}`).join('|'));
      setStableStateCounter(2); // Start with good stability
      setIsLoading(false);
      
      // Step 5: Optimized verification
      setTimeout(() => {
        console.log('💥 useDragDrop: Optimized nuclear verification:', {
          reconstructedControlCount: verification.count,
          timestamp: new Date().toISOString(),
          nuclearStatus: 'OPTIMIZED_RECONSTRUCTION_COMPLETE'
        });
        setStableStateCounter(3); // Mark as highly stable
      }, 100);
      
      console.log('✅ useDragDrop: ===== OPTIMIZED NUCLEAR RESET COMPLETED SUCCESSFULLY =====');
      
    } catch (error) {
      console.error('❌ useDragDrop: Optimized nuclear reset failed:', error);
      setIsLoading(false);
    }
  }, [droppedControls.length, refreshKey, questionnaireId, stableStateCounter]);

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
      
      console.log('➕ useDragDrop: Adding new control:', {
        id: newControl.id,
        type: newControl.type,
        name: newControl.name,
        sectionId: newControl.sectionId
      });
      
      await insertControl(newControl, questionnaireId);
      setDroppedControls(prev => [...prev, newControl]);
      setSelectedControl(newControl);
      setStableStateCounter(0); // Reset stability on change
      
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
      
      await updateControlDB(id, updates);
      
      setDroppedControls(prev => 
        prev.map(control => 
          control.id === id ? { ...control, ...updates } : control
        )
      );
      
      if (selectedControl?.id === id) {
        setSelectedControl(prev => prev ? { ...prev, ...updates } : null);
      }
      
      setStableStateCounter(0); // Reset stability on change
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
      setStableStateCounter(0); // Reset stability on change
      
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
      
      const targetControl = sectionControls[newIndex];
      const updatedControls = droppedControls.map(c => {
        if (c.id === id) return { ...c, y: targetControl.y };
        if (c.id === targetControl.id) return { ...c, y: control.y };
        return c;
      });
      
      await updateControlDB(id, { y: targetControl.y });
      await updateControlDB(targetControl.id, { y: control.y });
      
      setDroppedControls(updatedControls);
      setStableStateCounter(0); // Reset stability on change
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
      
      newControls.splice(dragIndex, 1);
      newControls.splice(hoverIndex, 0, draggedControl);
      
      const reorderedControls = newControls.map((control, index) => ({
        ...control,
        y: index
      }));
      
      await reorderControls(reorderedControls);
      setDroppedControls(reorderedControls);
      setStableStateCounter(0); // Reset stability on change
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

  // OPTIMIZED: Enhanced state change logging with stability tracking
  useEffect(() => {
    console.log('📊 useDragDrop: ===== OPTIMIZED STATE CHANGED =====');
    console.log('📊 useDragDrop: Optimized current state:', {
      controlCount: droppedControls.length,
      selectedControlId: selectedControl?.id,
      selectedControlName: selectedControl?.name,
      isLoading,
      refreshKey,
      timestamp: new Date().toISOString(),
      stateHash: lastSyncHash.substring(0, 20) + '...',
      stableStateCounter,
      stabilityLevel: stableStateCounter >= 3 ? 'HIGH' : stableStateCounter >= 1 ? 'MEDIUM' : 'LOW'
    });

    if (droppedControls.length > 0) {
      const distribution = droppedControls.reduce((acc, control) => {
        acc[control.sectionId || 'unknown'] = (acc[control.sectionId || 'unknown'] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      console.log('📂 useDragDrop: Optimized controls by section:', distribution);
      
      const typeDistribution = droppedControls.reduce((acc, control) => {
        acc[control.type] = (acc[control.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      console.log('🎯 useDragDrop: Optimized controls by type:', typeDistribution);
    } else {
      console.log('📝 useDragDrop: No controls in optimized state');
    }
  }, [droppedControls.length, selectedControl?.id, selectedControl?.name, isLoading, refreshKey, lastSyncHash, stableStateCounter]);

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
    forceRefresh,
    forceReload,
    nuclearReset
  };
};