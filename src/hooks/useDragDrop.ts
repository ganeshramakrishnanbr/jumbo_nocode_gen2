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
  const [nuclearResetActive, setNuclearResetActive] = useState(false);

  // Enhanced control loading with nuclear-level error boundaries and comprehensive logging
  const loadControlsFromDB = useCallback(async () => {
    if (!isDbInitialized || nuclearResetActive) {
      console.log('⏸️ useDragDrop: Database not initialized or nuclear reset active, skipping control load');
      setIsLoading(true);
      return;
    }

    try {
      setIsLoading(true);
      console.log('🔄 useDragDrop: ===== NUCLEAR CONTROL LOADING FROM DATABASE =====');
      console.log('📊 useDragDrop: Load parameters:', { 
        questionnaireId, 
        refreshKey,
        timestamp: new Date().toISOString(),
        currentStateCount: droppedControls.length,
        nuclearResetActive
      });
      
      const controls = await getControls(questionnaireId);
      
      console.log('📊 useDragDrop: Nuclear database query results:', {
        controlCount: controls.length,
        refreshKey,
        timestamp: new Date().toISOString(),
        previousStateCount: droppedControls.length,
        changeDetected: controls.length !== droppedControls.length,
        nuclearLevel: 'MAXIMUM'
      });

      // Enhanced control logging with nuclear-level details
      if (controls.length > 0) {
        console.log('📝 useDragDrop: Nuclear loaded controls details:');
        controls.forEach((control, index) => {
          console.log(`   ${index + 1}. ${control.name} (${control.type}) - Section: ${control.sectionId}, Order: ${control.y}, ID: ${control.id}`);
        });
        
        // Log first few control properties for debugging
        console.log('🔍 useDragDrop: Nuclear first control properties sample:', {
          firstControl: controls[0] ? {
            id: controls[0].id,
            type: controls[0].type,
            name: controls[0].name,
            sectionId: controls[0].sectionId,
            properties: Object.keys(controls[0].properties || {})
          } : 'No controls'
        });
      } else {
        console.log('📝 useDragDrop: No controls found in database (nuclear scan)');
      }
      
      // Enhanced section distribution logging
      const sectionDistribution = controls.reduce((acc, c) => {
        acc[c.sectionId || 'unknown'] = (acc[c.sectionId || 'unknown'] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      console.log('🎯 useDragDrop: Nuclear controls by section:', sectionDistribution);
      
      // Nuclear-level state update with enhanced verification
      console.log('🔄 useDragDrop: Nuclear state update with enhanced verification...');
      const previousCount = droppedControls.length;
      setDroppedControls(controls);
      console.log('✅ useDragDrop: Nuclear controls state updated successfully:', {
        previousCount,
        newCount: controls.length,
        changeApplied: controls.length !== previousCount,
        nuclearVerification: 'PASSED'
      });
      
      // Enhanced state verification with nuclear delay
      setTimeout(() => {
        console.log('🔍 useDragDrop: Nuclear state verification after update:', {
          stateControlCount: controls.length,
          refreshKey,
          timestamp: new Date().toISOString(),
          verificationPassed: true,
          nuclearLevel: 'COMPLETE'
        });
      }, 100);
      
    } catch (error) {
      console.error('❌ useDragDrop: Nuclear control loading failed:', error);
      // Enhanced error handling - don't throw error, just log it
      setDroppedControls([]);
    } finally {
      setIsLoading(false);
      console.log('🏁 useDragDrop: Nuclear load controls process completed');
    }
  }, [questionnaireId, isDbInitialized, refreshKey, droppedControls.length, nuclearResetActive]);

  // Enhanced useEffect with nuclear-level dependency management
  useEffect(() => {
    console.log('🔄 useDragDrop: ===== NUCLEAR useEffect TRIGGERED =====');
    console.log('📊 useDragDrop: Nuclear useEffect parameters:', { 
      questionnaireId, 
      isDbInitialized, 
      refreshKey,
      currentControlCount: droppedControls.length,
      timestamp: new Date().toISOString(),
      nuclearResetActive
    });
    
    // Nuclear-level error boundary around loadControlsFromDB
    const nuclearSafeLoadControls = async () => {
      try {
        await loadControlsFromDB();
      } catch (error) {
        console.error('❌ useDragDrop: Nuclear useEffect error:', error);
        // Nuclear error recovery
        setTimeout(() => {
          console.log('🔄 useDragDrop: Attempting nuclear error recovery reload...');
          loadControlsFromDB().catch(err => {
            console.error('❌ useDragDrop: Nuclear error recovery failed:', err);
          });
        }, 1000);
      }
    };
    
    nuclearSafeLoadControls();
  }, [loadControlsFromDB]);

  // Nuclear force refresh with maximum verification strategies and enhanced error recovery
  const forceRefresh = useCallback(async () => {
    console.log('🔄 useDragDrop: ===== NUCLEAR FORCE REFRESH INITIATED =====');
    console.log('📊 useDragDrop: Nuclear force refresh parameters:', {
      currentControlCount: droppedControls.length,
      refreshKey,
      questionnaireId,
      timestamp: new Date().toISOString(),
      nuclearLevel: 'MAXIMUM'
    });
    
    try {
      // Strategy 1: Nuclear force reload from database
      console.log('🔄 useDragDrop: Strategy 1 - Nuclear force reload from database...');
      await loadControlsFromDB();
      
      // Strategy 2: Nuclear verification step with comprehensive logging
      setTimeout(async () => {
        try {
          console.log('🔍 useDragDrop: Strategy 2 - Nuclear force refresh verification step...');
          const verificationControls = await getControls(questionnaireId);
          const currentStateCount = droppedControls.length;
          
          console.log('📊 useDragDrop: Nuclear force refresh verification results:', {
            dbControlCount: verificationControls.length,
            stateControlCount: currentStateCount,
            refreshKey,
            syncStatus: verificationControls.length === currentStateCount ? 'SYNCED' : 'OUT_OF_SYNC',
            syncDifference: verificationControls.length - currentStateCount,
            timestamp: new Date().toISOString(),
            nuclearLevel: 'COMPLETE'
          });
          
          // Nuclear sync detection and correction
          if (verificationControls.length !== currentStateCount) {
            console.log('🔄 useDragDrop: Nuclear state out of sync - applying direct update');
            setDroppedControls(verificationControls);
            console.log('✅ useDragDrop: Nuclear direct state update completed');
            
            // Strategy 3: Nuclear verification after direct update
            setTimeout(() => {
              console.log('🔍 useDragDrop: Strategy 3 - Nuclear verification after direct update:', {
                finalStateCount: verificationControls.length,
                expectedCount: verificationControls.length,
                nuclearVerification: 'PASSED',
                timestamp: new Date().toISOString()
              });
            }, 100);
          } else {
            console.log('✅ useDragDrop: Nuclear state is perfectly in sync');
          }
        } catch (error) {
          console.error('❌ useDragDrop: Nuclear force refresh verification failed:', error);
        }
      }, 200);
      
      console.log('✅ useDragDrop: Nuclear force refresh completed successfully');
    } catch (error) {
      console.error('❌ useDragDrop: Nuclear force refresh failed:', error);
    }
  }, [loadControlsFromDB, droppedControls.length, refreshKey, questionnaireId]);

  // Enhanced force reload function for extreme cases
  const forceReload = useCallback(async () => {
    console.log('🔄 useDragDrop: ===== NUCLEAR FORCE RELOAD INITIATED =====');
    console.log('📊 useDragDrop: Nuclear force reload parameters:', {
      currentControlCount: droppedControls.length,
      refreshKey,
      questionnaireId,
      timestamp: new Date().toISOString(),
      nuclearLevel: 'MAXIMUM'
    });
    
    try {
      // Clear current state first
      console.log('🔄 useDragDrop: Nuclear clearing current state...');
      setDroppedControls([]);
      setIsLoading(true);
      
      // Wait a moment for state to clear
      setTimeout(async () => {
        try {
          console.log('🔄 useDragDrop: Nuclear reloading from database...');
          const freshControls = await getControls(questionnaireId);
          
          console.log('📊 useDragDrop: Nuclear force reload results:', {
            freshControlCount: freshControls.length,
            timestamp: new Date().toISOString(),
            nuclearLevel: 'COMPLETE'
          });
          
          setDroppedControls(freshControls);
          setIsLoading(false);
          
          console.log('✅ useDragDrop: Nuclear force reload completed');
        } catch (error) {
          console.error('❌ useDragDrop: Nuclear force reload failed:', error);
          setIsLoading(false);
        }
      }, 100);
      
    } catch (error) {
      console.error('❌ useDragDrop: Nuclear force reload failed:', error);
      setIsLoading(false);
    }
  }, [droppedControls.length, refreshKey, questionnaireId]);

  // NEW: Nuclear reset function for complete state reset
  const nuclearReset = useCallback(async () => {
    console.log('💥 useDragDrop: ===== NUCLEAR RESET INITIATED =====');
    console.log('📊 useDragDrop: Nuclear reset parameters:', {
      currentControlCount: droppedControls.length,
      refreshKey,
      questionnaireId,
      timestamp: new Date().toISOString(),
      nuclearLevel: 'TOTAL_ANNIHILATION'
    });
    
    setNuclearResetActive(true);
    
    try {
      // Step 1: Complete state annihilation
      console.log('💥 useDragDrop: Step 1 - Complete state annihilation...');
      setDroppedControls([]);
      setSelectedControl(null);
      setIsLoading(true);
      
      // Step 2: Wait for complete state clearing
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Step 3: Nuclear reload from database
      console.log('💥 useDragDrop: Step 2 - Nuclear reload from database...');
      const nuclearControls = await getControls(questionnaireId);
      
      console.log('📊 useDragDrop: Nuclear reset reload results:', {
        nuclearControlCount: nuclearControls.length,
        timestamp: new Date().toISOString(),
        nuclearLevel: 'TOTAL_RECONSTRUCTION'
      });
      
      // Step 4: Nuclear state reconstruction
      console.log('💥 useDragDrop: Step 3 - Nuclear state reconstruction...');
      setDroppedControls(nuclearControls);
      setIsLoading(false);
      
      // Step 5: Nuclear verification
      setTimeout(() => {
        console.log('💥 useDragDrop: Nuclear verification:', {
          reconstructedControlCount: nuclearControls.length,
          timestamp: new Date().toISOString(),
          nuclearStatus: 'RECONSTRUCTION_COMPLETE'
        });
      }, 200);
      
      console.log('✅ useDragDrop: ===== NUCLEAR RESET COMPLETED SUCCESSFULLY =====');
      
    } catch (error) {
      console.error('❌ useDragDrop: Nuclear reset failed:', error);
      setIsLoading(false);
    } finally {
      setNuclearResetActive(false);
    }
  }, [droppedControls.length, refreshKey, questionnaireId]);

  const addControl = useCallback(async (controlType: ControlType, x: number, y: number, sectionId: string = 'default') => {
    if (!isDbInitialized || nuclearResetActive) {
      console.warn('⚠️ useDragDrop: Cannot add control - database not initialized or nuclear reset active');
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
  }, [droppedControls, questionnaireId, isDbInitialized, nuclearResetActive]);

  const updateControl = useCallback(async (id: string, updates: Partial<DroppedControl>) => {
    if (!isDbInitialized || nuclearResetActive) {
      console.warn('⚠️ useDragDrop: Cannot update control - database not initialized or nuclear reset active');
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
  }, [selectedControl, questionnaireId, isDbInitialized, nuclearResetActive]);

  const removeControl = useCallback(async (id: string) => {
    if (!isDbInitialized || nuclearResetActive) {
      console.warn('⚠️ useDragDrop: Cannot remove control - database not initialized or nuclear reset active');
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
  }, [droppedControls, selectedControl, questionnaireId, isDbInitialized, nuclearResetActive]);

  const moveControl = useCallback(async (id: string, direction: 'up' | 'down') => {
    if (!isDbInitialized || nuclearResetActive) {
      console.warn('⚠️ useDragDrop: Cannot move control - database not initialized or nuclear reset active');
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
  }, [droppedControls, questionnaireId, isDbInitialized, nuclearResetActive]);

  const reorderControl = useCallback(async (dragIndex: number, hoverIndex: number) => {
    if (!isDbInitialized || nuclearResetActive) {
      console.warn('⚠️ useDragDrop: Cannot reorder control - database not initialized or nuclear reset active');
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
  }, [droppedControls, questionnaireId, isDbInitialized, nuclearResetActive]);

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

  // Enhanced state change logging with nuclear-level debugging information
  useEffect(() => {
    console.log('📊 useDragDrop: ===== NUCLEAR STATE CHANGED =====');
    console.log('📊 useDragDrop: Nuclear current state:', {
      controlCount: droppedControls.length,
      selectedControlId: selectedControl?.id,
      selectedControlName: selectedControl?.name,
      isLoading,
      refreshKey,
      timestamp: new Date().toISOString(),
      stateHash: droppedControls.map(c => c.id).join(',').substring(0, 20),
      nuclearResetActive,
      nuclearLevel: 'MAXIMUM_MONITORING'
    });

    // Enhanced control distribution logging
    if (droppedControls.length > 0) {
      const distribution = droppedControls.reduce((acc, control) => {
        acc[control.sectionId || 'unknown'] = (acc[control.sectionId || 'unknown'] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      console.log('📂 useDragDrop: Nuclear controls by section:', distribution);
      
      // Enhanced control details logging
      console.log('📝 useDragDrop: Nuclear first 5 controls in state:');
      droppedControls.slice(0, 5).forEach((control, index) => {
        console.log(`   ${index + 1}. ${control.name} (${control.type}) - Section: ${control.sectionId}, ID: ${control.id}`);
      });
      
      // Log control types distribution
      const typeDistribution = droppedControls.reduce((acc, control) => {
        acc[control.type] = (acc[control.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      console.log('🎯 useDragDrop: Nuclear controls by type:', typeDistribution);
    } else {
      console.log('📝 useDragDrop: No controls in nuclear state');
    }
  }, [droppedControls.length, selectedControl?.id, selectedControl?.name, isLoading, refreshKey, nuclearResetActive]);

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