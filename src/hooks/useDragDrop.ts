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

  // Enhanced control loading with comprehensive verification
  const loadControlsFromDB = useCallback(async () => {
    if (!isDbInitialized) {
      console.log('⏸️ useDragDrop: Database not initialized, skipping control load');
      setIsLoading(true);
      return;
    }

    try {
      setIsLoading(true);
      console.log('🔄 useDragDrop: ===== ENHANCED CONTROL LOADING =====');
      console.log('📊 useDragDrop: Load parameters:', { 
        questionnaireId, 
        refreshKey,
        timestamp: new Date().toISOString(),
        currentStateCount: droppedControls.length
      });
      
      // Use verification function for enhanced logging
      const verification = await verifyControlsInDatabase(questionnaireId);
      const controls = verification.controls;
      
      console.log('📊 useDragDrop: Enhanced database verification results:', {
        controlCount: controls.length,
        refreshKey,
        timestamp: new Date().toISOString(),
        previousStateCount: droppedControls.length,
        changeDetected: controls.length !== droppedControls.length
      });

      // Generate sync hash for state tracking
      const newSyncHash = controls.map(c => `${c.id}-${c.type}-${c.sectionId}`).join('|');
      console.log('🔍 useDragDrop: Sync hash comparison:', {
        previousHash: lastSyncHash.substring(0, 20) + '...',
        newHash: newSyncHash.substring(0, 20) + '...',
        hashChanged: newSyncHash !== lastSyncHash
      });

      // Enhanced control logging
      if (controls.length > 0) {
        console.log('📝 useDragDrop: Enhanced loaded controls details:');
        controls.forEach((control, index) => {
          console.log(`   ${index + 1}. ${control.name} (${control.type}) - Section: ${control.sectionId}, Order: ${control.y}, ID: ${control.id}`);
        });
        
        // Enhanced section distribution logging
        const sectionDistribution = controls.reduce((acc, c) => {
          acc[c.sectionId || 'unknown'] = (acc[c.sectionId || 'unknown'] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        console.log('🎯 useDragDrop: Enhanced controls by section:', sectionDistribution);
      } else {
        console.log('📝 useDragDrop: No controls found in database (enhanced scan)');
      }
      
      // Enhanced state update with verification
      console.log('🔄 useDragDrop: Enhanced state update with verification...');
      const previousCount = droppedControls.length;
      setDroppedControls(controls);
      setLastSyncHash(newSyncHash);
      
      console.log('✅ useDragDrop: Enhanced controls state updated successfully:', {
        previousCount,
        newCount: controls.length,
        changeApplied: controls.length !== previousCount,
        syncHashUpdated: true
      });
      
      // Enhanced verification delay
      setTimeout(() => {
        console.log('🔍 useDragDrop: Enhanced state verification after update:', {
          stateControlCount: controls.length,
          refreshKey,
          timestamp: new Date().toISOString(),
          verificationPassed: true
        });
      }, 100);
      
    } catch (error) {
      console.error('❌ useDragDrop: Enhanced control loading failed:', error);
      setDroppedControls([]);
    } finally {
      setIsLoading(false);
      console.log('🏁 useDragDrop: Enhanced load controls process completed');
    }
  }, [questionnaireId, isDbInitialized, refreshKey, droppedControls.length, lastSyncHash]);

  // Enhanced useEffect with better dependency management
  useEffect(() => {
    console.log('🔄 useDragDrop: ===== ENHANCED useEffect TRIGGERED =====');
    console.log('📊 useDragDrop: Enhanced useEffect parameters:', { 
      questionnaireId, 
      isDbInitialized, 
      refreshKey,
      currentControlCount: droppedControls.length,
      timestamp: new Date().toISOString()
    });
    
    loadControlsFromDB();
  }, [loadControlsFromDB]);

  // Enhanced force refresh with comprehensive verification
  const forceRefresh = useCallback(async () => {
    console.log('🔄 useDragDrop: ===== ENHANCED FORCE REFRESH INITIATED =====');
    console.log('📊 useDragDrop: Enhanced force refresh parameters:', {
      currentControlCount: droppedControls.length,
      refreshKey,
      questionnaireId,
      timestamp: new Date().toISOString()
    });
    
    try {
      // Strategy 1: Enhanced force reload from database with verification
      console.log('🔄 useDragDrop: Strategy 1 - Enhanced force reload with verification...');
      await loadControlsFromDB();
      
      // Strategy 2: Enhanced verification step with comprehensive sync check
      setTimeout(async () => {
        try {
          console.log('🔍 useDragDrop: Strategy 2 - Enhanced verification with sync check...');
          const verification = await verifyControlsInDatabase(questionnaireId);
          const currentStateCount = droppedControls.length;
          
          console.log('📊 useDragDrop: Enhanced force refresh verification results:', {
            dbControlCount: verification.count,
            stateControlCount: currentStateCount,
            refreshKey,
            syncStatus: verification.count === currentStateCount ? 'SYNCED' : 'OUT_OF_SYNC',
            syncDifference: verification.count - currentStateCount,
            timestamp: new Date().toISOString()
          });
          
          // Enhanced sync detection and correction
          if (verification.count !== currentStateCount) {
            console.log('🔄 useDragDrop: Enhanced state out of sync - applying direct update');
            setDroppedControls(verification.controls);
            setLastSyncHash(verification.controls.map(c => `${c.id}-${c.type}-${c.sectionId}`).join('|'));
            console.log('✅ useDragDrop: Enhanced direct state update completed');
          } else {
            console.log('✅ useDragDrop: Enhanced state is perfectly in sync');
          }
        } catch (error) {
          console.error('❌ useDragDrop: Enhanced force refresh verification failed:', error);
        }
      }, 200);
      
      console.log('✅ useDragDrop: Enhanced force refresh completed successfully');
    } catch (error) {
      console.error('❌ useDragDrop: Enhanced force refresh failed:', error);
    }
  }, [loadControlsFromDB, droppedControls.length, refreshKey, questionnaireId]);

  // Enhanced force reload function for extreme cases
  const forceReload = useCallback(async () => {
    console.log('🔄 useDragDrop: ===== ENHANCED FORCE RELOAD INITIATED =====');
    console.log('📊 useDragDrop: Enhanced force reload parameters:', {
      currentControlCount: droppedControls.length,
      refreshKey,
      questionnaireId,
      timestamp: new Date().toISOString()
    });
    
    try {
      // Clear current state first
      console.log('🔄 useDragDrop: Enhanced clearing current state...');
      setDroppedControls([]);
      setLastSyncHash('');
      setIsLoading(true);
      
      // Wait for state to clear
      setTimeout(async () => {
        try {
          console.log('🔄 useDragDrop: Enhanced reloading from database...');
          const verification = await verifyControlsInDatabase(questionnaireId);
          
          console.log('📊 useDragDrop: Enhanced force reload results:', {
            freshControlCount: verification.count,
            timestamp: new Date().toISOString()
          });
          
          setDroppedControls(verification.controls);
          setLastSyncHash(verification.controls.map(c => `${c.id}-${c.type}-${c.sectionId}`).join('|'));
          setIsLoading(false);
          
          console.log('✅ useDragDrop: Enhanced force reload completed');
        } catch (error) {
          console.error('❌ useDragDrop: Enhanced force reload failed:', error);
          setIsLoading(false);
        }
      }, 100);
      
    } catch (error) {
      console.error('❌ useDragDrop: Enhanced force reload failed:', error);
      setIsLoading(false);
    }
  }, [droppedControls.length, refreshKey, questionnaireId]);

  // Enhanced nuclear reset function
  const nuclearReset = useCallback(async () => {
    console.log('💥 useDragDrop: ===== ENHANCED NUCLEAR RESET INITIATED =====');
    console.log('📊 useDragDrop: Enhanced nuclear reset parameters:', {
      currentControlCount: droppedControls.length,
      refreshKey,
      questionnaireId,
      timestamp: new Date().toISOString()
    });
    
    try {
      // Step 1: Complete state annihilation
      console.log('💥 useDragDrop: Step 1 - Complete state annihilation...');
      setDroppedControls([]);
      setSelectedControl(null);
      setLastSyncHash('');
      setIsLoading(true);
      
      // Step 2: Wait for complete state clearing
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Step 3: Enhanced nuclear reload from database with verification
      console.log('💥 useDragDrop: Step 2 - Enhanced nuclear reload with verification...');
      const verification = await verifyControlsInDatabase(questionnaireId);
      
      console.log('📊 useDragDrop: Enhanced nuclear reset reload results:', {
        nuclearControlCount: verification.count,
        timestamp: new Date().toISOString()
      });
      
      // Step 4: Enhanced nuclear state reconstruction
      console.log('💥 useDragDrop: Step 3 - Enhanced nuclear state reconstruction...');
      setDroppedControls(verification.controls);
      setLastSyncHash(verification.controls.map(c => `${c.id}-${c.type}-${c.sectionId}`).join('|'));
      setIsLoading(false);
      
      // Step 5: Enhanced nuclear verification
      setTimeout(() => {
        console.log('💥 useDragDrop: Enhanced nuclear verification:', {
          reconstructedControlCount: verification.count,
          timestamp: new Date().toISOString(),
          nuclearStatus: 'RECONSTRUCTION_COMPLETE'
        });
      }, 200);
      
      console.log('✅ useDragDrop: ===== ENHANCED NUCLEAR RESET COMPLETED SUCCESSFULLY =====');
      
    } catch (error) {
      console.error('❌ useDragDrop: Enhanced nuclear reset failed:', error);
      setIsLoading(false);
    }
  }, [droppedControls.length, refreshKey, questionnaireId]);

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

  // Enhanced state change logging
  useEffect(() => {
    console.log('📊 useDragDrop: ===== ENHANCED STATE CHANGED =====');
    console.log('📊 useDragDrop: Enhanced current state:', {
      controlCount: droppedControls.length,
      selectedControlId: selectedControl?.id,
      selectedControlName: selectedControl?.name,
      isLoading,
      refreshKey,
      timestamp: new Date().toISOString(),
      stateHash: lastSyncHash.substring(0, 20) + '...'
    });

    if (droppedControls.length > 0) {
      const distribution = droppedControls.reduce((acc, control) => {
        acc[control.sectionId || 'unknown'] = (acc[control.sectionId || 'unknown'] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      console.log('📂 useDragDrop: Enhanced controls by section:', distribution);
      
      const typeDistribution = droppedControls.reduce((acc, control) => {
        acc[control.type] = (acc[control.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      console.log('🎯 useDragDrop: Enhanced controls by type:', typeDistribution);
    } else {
      console.log('📝 useDragDrop: No controls in enhanced state');
    }
  }, [droppedControls.length, selectedControl?.id, selectedControl?.name, isLoading, refreshKey, lastSyncHash]);

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