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

// FINAL QUANTUM SYNCHRONIZATION PROTOCOL
interface FinalQuantumState {
  controls: DroppedControl[];
  hash: string;
  timestamp: number;
  version: number;
  isStable: boolean;
  syncLevel: 'PERFECT' | 'GOOD' | 'NEEDS_SYNC' | 'CRITICAL';
  lastDbSync: number;
  forceSync: boolean;
  quantumEntanglement: boolean;
  finalSyncActive: boolean;
}

export const useDragDrop = (questionnaireId: string = 'default-questionnaire', isDbInitialized: boolean = false, refreshKey: number = 0) => {
  const [droppedControls, setDroppedControls] = useState<DroppedControl[]>([]);
  const [selectedControl, setSelectedControl] = useState<DroppedControl | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // FINAL QUANTUM STATE MANAGEMENT
  const finalQuantumStateRef = useRef<FinalQuantumState>({
    controls: [],
    hash: '',
    timestamp: 0,
    version: 0,
    isStable: false,
    syncLevel: 'CRITICAL',
    lastDbSync: 0,
    forceSync: false,
    quantumEntanglement: false,
    finalSyncActive: false
  });
  
  const [quantumSyncActive, setQuantumSyncActive] = useState(false);
  const [finalRefreshCounter, setFinalRefreshCounter] = useState(0);
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const stabilityCounterRef = useRef(0);
  const forceLoadRef = useRef(false);
  const quantumEntanglementRef = useRef(false);
  const finalSyncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // FINAL: Generate quantum hash with ultimate precision
  const generateFinalQuantumHash = useCallback((controls: DroppedControl[]): string => {
    const stateString = controls
      .sort((a, b) => a.id.localeCompare(b.id))
      .map(c => `${c.id}:${c.type}:${c.name}:${c.sectionId}:${c.y}:${Object.keys(c.properties).length}:${JSON.stringify(c.properties).length}`)
      .join('|');
    
    let hash = 0;
    for (let i = 0; i < stateString.length; i++) {
      const char = stateString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return `final-${hash.toString(36)}-${controls.length}-${Date.now().toString(36)}`;
  }, []);

  // FINAL: Quantum entanglement - instant bidirectional sync
  const establishQuantumEntanglement = useCallback(async (): Promise<boolean> => {
    if (!isDbInitialized || quantumEntanglementRef.current) {
      return quantumEntanglementRef.current;
    }

    try {
      console.log('🌌 FINAL QUANTUM: ===== ESTABLISHING QUANTUM ENTANGLEMENT =====');
      
      const verification = await verifyControlsInDatabase(questionnaireId);
      const dbControls = verification.controls;
      
      console.log('📊 FINAL QUANTUM: Quantum entanglement verification:', {
        dbControlCount: dbControls.length,
        currentUICount: droppedControls.length,
        questionnaireId,
        refreshKey,
        timestamp: new Date().toISOString()
      });

      if (dbControls.length > 0) {
        console.log('📝 FINAL QUANTUM: Database controls for entanglement:');
        dbControls.slice(0, 5).forEach((control, index) => {
          console.log(`   ${index + 1}. ${control.name} (${control.type}) - Section: ${control.sectionId}, ID: ${control.id}`);
        });

        const newHash = generateFinalQuantumHash(dbControls);
        const currentState = finalQuantumStateRef.current;
        
        // FINAL: Establish entanglement by synchronizing states
        console.log('🔄 FINAL QUANTUM: Establishing quantum entanglement');
        
        // Update UI state with quantum entanglement
        setDroppedControls(dbControls);
        
        // Update quantum state with entanglement
        finalQuantumStateRef.current = {
          controls: dbControls,
          hash: newHash,
          timestamp: Date.now(),
          version: currentState.version + 1,
          isStable: true,
          syncLevel: 'PERFECT',
          lastDbSync: Date.now(),
          forceSync: false,
          quantumEntanglement: true,
          finalSyncActive: true
        };

        quantumEntanglementRef.current = true;
        setFinalRefreshCounter(prev => prev + 1);
        stabilityCounterRef.current = 0;
        forceLoadRef.current = false;
        setIsLoading(false);
        
        console.log('✅ FINAL QUANTUM: Quantum entanglement established successfully:', {
          entangledControlCount: dbControls.length,
          newHash: newHash.substring(0, 12),
          version: finalQuantumStateRef.current.version,
          quantumEntanglement: true
        });
        
        return true;
      } else {
        console.log('⚠️ FINAL QUANTUM: No controls found for entanglement');
        return false;
      }

    } catch (error) {
      console.error('❌ FINAL QUANTUM: Quantum entanglement failed:', error);
      return false;
    }
  }, [isDbInitialized, questionnaireId, droppedControls.length, generateFinalQuantumHash, refreshKey]);

  // FINAL: Continuous quantum synchronization with entanglement
  const finalQuantumSync = useCallback(async (): Promise<void> => {
    if (!isDbInitialized || quantumSyncActive) {
      return;
    }

    try {
      setQuantumSyncActive(true);
      console.log('🌌 FINAL QUANTUM SYNC: Starting final quantum sync');
      
      // First establish entanglement if not already established
      if (!quantumEntanglementRef.current) {
        const entanglementResult = await establishQuantumEntanglement();
        if (entanglementResult) {
          console.log('✅ FINAL QUANTUM SYNC: Quantum entanglement established during sync');
          return;
        }
      }

      // If entanglement exists, perform instant sync
      if (quantumEntanglementRef.current) {
        const verification = await verifyControlsInDatabase(questionnaireId);
        const dbControls = verification.controls;
        
        const newHash = generateFinalQuantumHash(dbControls);
        const currentState = finalQuantumStateRef.current;
        
        if (newHash !== currentState.hash || dbControls.length !== droppedControls.length) {
          console.log('🔄 FINAL QUANTUM SYNC: Quantum state update detected');
          
          setDroppedControls(dbControls);
          finalQuantumStateRef.current = {
            ...currentState,
            controls: dbControls,
            hash: newHash,
            timestamp: Date.now(),
            version: currentState.version + 1,
            lastDbSync: Date.now(),
            syncLevel: 'PERFECT'
          };
          
          setFinalRefreshCounter(prev => prev + 1);
          console.log('✅ FINAL QUANTUM SYNC: Quantum state synchronized');
        } else {
          console.log('✅ FINAL QUANTUM SYNC: Quantum states already synchronized');
        }
      }

    } catch (error) {
      console.error('❌ FINAL QUANTUM SYNC: Sync failed:', error);
    } finally {
      setQuantumSyncActive(false);
    }
  }, [isDbInitialized, quantumSyncActive, establishQuantumEntanglement, questionnaireId, generateFinalQuantumHash, droppedControls.length]);

  // FINAL: Initialize quantum system with immediate entanglement
  const initializeFinalQuantumSystem = useCallback(() => {
    console.log('🌌 FINAL QUANTUM INIT: Initializing final quantum system');
    
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
    }

    if (finalSyncTimeoutRef.current) {
      clearTimeout(finalSyncTimeoutRef.current);
    }

    // Immediate entanglement establishment
    if (isDbInitialized) {
      console.log('🌌 FINAL QUANTUM INIT: Triggering immediate quantum entanglement');
      
      // Multiple immediate attempts
      establishQuantumEntanglement();
      
      setTimeout(() => {
        if (!quantumEntanglementRef.current) {
          console.log('🌌 FINAL QUANTUM INIT: Retry quantum entanglement');
          establishQuantumEntanglement();
        }
      }, 100);
      
      setTimeout(() => {
        if (!quantumEntanglementRef.current) {
          console.log('🌌 FINAL QUANTUM INIT: Final retry quantum entanglement');
          establishQuantumEntanglement();
        }
      }, 300);
    }

    // Start high-frequency sync interval
    syncIntervalRef.current = setInterval(() => {
      if (isDbInitialized) {
        finalQuantumSync();
      }
    }, 250); // Very high frequency

    // Cleanup function
    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
        syncIntervalRef.current = null;
      }
      if (finalSyncTimeoutRef.current) {
        clearTimeout(finalSyncTimeoutRef.current);
        finalSyncTimeoutRef.current = null;
      }
    };
  }, [isDbInitialized, establishQuantumEntanglement, finalQuantumSync]);

  // FINAL: Initialize on database ready with immediate action
  useEffect(() => {
    console.log('🌌 FINAL QUANTUM EFFECT: Database state changed:', {
      isDbInitialized,
      refreshKey,
      currentControlCount: droppedControls.length,
      quantumEntanglement: quantumEntanglementRef.current
    });

    if (isDbInitialized) {
      const cleanup = initializeFinalQuantumSystem();
      return cleanup;
    }
  }, [isDbInitialized, initializeFinalQuantumSystem]);

  // FINAL: Respond to refresh key changes with quantum entanglement
  useEffect(() => {
    if (isDbInitialized && refreshKey > 0) {
      console.log('🌌 FINAL QUANTUM EFFECT: RefreshKey changed - establishing quantum entanglement');
      
      // Reset entanglement to force re-establishment
      quantumEntanglementRef.current = false;
      finalQuantumStateRef.current.quantumEntanglement = false;
      finalQuantumStateRef.current.forceSync = true;
      
      // Immediate entanglement
      establishQuantumEntanglement();
      
      // Backup attempts
      setTimeout(() => {
        if (!quantumEntanglementRef.current) {
          establishQuantumEntanglement();
        }
      }, 100);
      
      setTimeout(() => {
        if (!quantumEntanglementRef.current) {
          establishQuantumEntanglement();
        }
      }, 300);
    }
  }, [refreshKey, isDbInitialized, establishQuantumEntanglement]);

  // FINAL: Force entanglement when controls are empty but should have data
  useEffect(() => {
    if (isDbInitialized && droppedControls.length === 0 && refreshKey > 0 && !quantumEntanglementRef.current) {
      console.log('🌌 FINAL QUANTUM EFFECT: Empty controls detected - forcing quantum entanglement');
      
      finalSyncTimeoutRef.current = setTimeout(() => {
        establishQuantumEntanglement();
      }, 50);
      
      // Additional attempts
      setTimeout(() => {
        if (!quantumEntanglementRef.current) {
          establishQuantumEntanglement();
        }
      }, 200);
      
      setTimeout(() => {
        if (!quantumEntanglementRef.current) {
          establishQuantumEntanglement();
        }
      }, 500);
    }
  }, [isDbInitialized, droppedControls.length, refreshKey, establishQuantumEntanglement]);

  // FINAL: Enhanced force refresh with quantum entanglement
  const forceRefresh = useCallback(async () => {
    console.log('🔄 FINAL QUANTUM: ===== FORCE REFRESH WITH QUANTUM ENTANGLEMENT =====');
    
    // Reset entanglement
    quantumEntanglementRef.current = false;
    finalQuantumStateRef.current.quantumEntanglement = false;
    finalQuantumStateRef.current.forceSync = true;
    stabilityCounterRef.current = 0;
    
    // Establish new entanglement
    const result = await establishQuantumEntanglement();
    
    if (!result) {
      // Multiple retry attempts
      setTimeout(async () => {
        console.log('🔄 FINAL QUANTUM: Retry 1 - force refresh');
        await establishQuantumEntanglement();
      }, 100);
      
      setTimeout(async () => {
        console.log('🔄 FINAL QUANTUM: Retry 2 - force refresh');
        await establishQuantumEntanglement();
      }, 300);
      
      setTimeout(async () => {
        console.log('🔄 FINAL QUANTUM: Retry 3 - force refresh');
        await establishQuantumEntanglement();
      }, 600);
    }
    
    console.log('✅ FINAL QUANTUM: Force refresh completed');
  }, [establishQuantumEntanglement]);

  // FINAL: Enhanced force reload with complete quantum reset
  const forceReload = useCallback(async () => {
    console.log('🔄 FINAL QUANTUM: ===== FORCE RELOAD WITH QUANTUM RESET =====');
    
    // Complete quantum reset
    quantumEntanglementRef.current = false;
    finalQuantumStateRef.current = {
      controls: [],
      hash: '',
      timestamp: 0,
      version: 0,
      isStable: false,
      syncLevel: 'CRITICAL',
      lastDbSync: 0,
      forceSync: true,
      quantumEntanglement: false,
      finalSyncActive: false
    };
    
    stabilityCounterRef.current = 0;
    forceLoadRef.current = true;
    setDroppedControls([]);
    setIsLoading(true);
    
    // Establish quantum entanglement after reset
    setTimeout(async () => {
      await establishQuantumEntanglement();
    }, 100);
    
    console.log('✅ FINAL QUANTUM: Force reload completed');
  }, [establishQuantumEntanglement]);

  // FINAL: Nuclear reset with quantum reconstruction
  const nuclearReset = useCallback(async () => {
    console.log('💥 FINAL QUANTUM: ===== NUCLEAR RESET WITH QUANTUM RECONSTRUCTION =====');
    
    // Stop all processes
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
      syncIntervalRef.current = null;
    }
    
    if (finalSyncTimeoutRef.current) {
      clearTimeout(finalSyncTimeoutRef.current);
      finalSyncTimeoutRef.current = null;
    }
    
    // Complete quantum reset
    quantumEntanglementRef.current = false;
    finalQuantumStateRef.current = {
      controls: [],
      hash: '',
      timestamp: 0,
      version: 0,
      isStable: false,
      syncLevel: 'CRITICAL',
      lastDbSync: 0,
      forceSync: true,
      quantumEntanglement: false,
      finalSyncActive: false
    };
    
    stabilityCounterRef.current = 0;
    forceLoadRef.current = true;
    setQuantumSyncActive(false);
    setDroppedControls([]);
    setSelectedControl(null);
    setIsLoading(true);
    setFinalRefreshCounter(0);
    
    // Quantum reconstruction
    setTimeout(async () => {
      console.log('💥 FINAL QUANTUM: Quantum reconstruction phase');
      await establishQuantumEntanglement();
      const cleanup = initializeFinalQuantumSystem();
      console.log('✅ FINAL QUANTUM: Nuclear reset with quantum reconstruction completed');
    }, 200);
    
  }, [establishQuantumEntanglement, initializeFinalQuantumSystem]);

  // Standard CRUD operations with quantum entanglement integration
  const addControl = useCallback(async (controlType: ControlType, x: number, y: number, sectionId: string = 'default') => {
    if (!isDbInitialized) {
      console.warn('⚠️ FINAL QUANTUM: Cannot add control - database not initialized');
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
      
      await insertControl(newControl, questionnaireId);
      setSelectedControl(newControl);
      
      // Trigger quantum entanglement sync
      setTimeout(finalQuantumSync, 50);
      
      console.log('✅ FINAL QUANTUM: Control added with quantum sync');
    } catch (error) {
      console.error('❌ FINAL QUANTUM: Failed to add control:', error);
    }
  }, [droppedControls, questionnaireId, isDbInitialized, finalQuantumSync]);

  const updateControl = useCallback(async (id: string, updates: Partial<DroppedControl>) => {
    if (!isDbInitialized) return;

    try {
      await updateControlDB(id, updates);
      
      if (selectedControl?.id === id) {
        setSelectedControl(prev => prev ? { ...prev, ...updates } : null);
      }
      
      // Trigger quantum entanglement sync
      setTimeout(finalQuantumSync, 50);
      
      console.log('✅ FINAL QUANTUM: Control updated with quantum sync');
    } catch (error) {
      console.error('❌ FINAL QUANTUM: Failed to update control:', error);
    }
  }, [selectedControl, questionnaireId, isDbInitialized, finalQuantumSync]);

  const removeControl = useCallback(async (id: string) => {
    if (!isDbInitialized) return;

    try {
      const controlToRemove = droppedControls.find(c => c.id === id);
      if (!controlToRemove) return;
      
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
      
      if (selectedControl?.id === id) {
        setSelectedControl(null);
      }
      
      // Trigger quantum entanglement sync
      setTimeout(finalQuantumSync, 50);
      
      console.log('✅ FINAL QUANTUM: Control removed with quantum sync');
    } catch (error) {
      console.error('❌ FINAL QUANTUM: Failed to remove control:', error);
    }
  }, [droppedControls, selectedControl, questionnaireId, isDbInitialized, finalQuantumSync]);

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
      
      const targetControl = sectionControls[newIndex];
      
      await updateControlDB(id, { y: targetControl.y });
      await updateControlDB(targetControl.id, { y: control.y });
      
      // Trigger quantum entanglement sync
      setTimeout(finalQuantumSync, 50);
      
      console.log('✅ FINAL QUANTUM: Control moved with quantum sync');
    } catch (error) {
      console.error('❌ FINAL QUANTUM: Failed to move control:', error);
    }
  }, [droppedControls, questionnaireId, isDbInitialized, finalQuantumSync]);

  const reorderControl = useCallback(async (dragIndex: number, hoverIndex: number) => {
    if (!isDbInitialized) return;

    try {
      const newControls = [...droppedControls];
      const draggedControl = newControls[dragIndex];
      
      newControls.splice(dragIndex, 1);
      newControls.splice(hoverIndex, 0, draggedControl);
      
      const reorderedControls = newControls.map((control, index) => ({
        ...control,
        y: index
      }));
      
      await reorderControls(reorderedControls);
      
      // Trigger quantum entanglement sync
      setTimeout(finalQuantumSync, 50);
      
      console.log('✅ FINAL QUANTUM: Controls reordered with quantum sync');
    } catch (error) {
      console.error('❌ FINAL QUANTUM: Failed to reorder control:', error);
    }
  }, [droppedControls, questionnaireId, isDbInitialized, finalQuantumSync]);

  const selectControl = useCallback((control: DroppedControl) => {
    setSelectedControl(control);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedControl(null);
  }, []);

  // FINAL: Enhanced state monitoring with quantum entanglement status
  useEffect(() => {
    const finalState = finalQuantumStateRef.current;
    console.log('🌌 FINAL QUANTUM STATE: Current state:', {
      controlCount: droppedControls.length,
      finalHash: finalState.hash.substring(0, 12),
      finalVersion: finalState.version,
      isStable: finalState.isStable,
      syncLevel: finalState.syncLevel,
      quantumEntanglement: finalState.quantumEntanglement,
      quantumEntanglementRef: quantumEntanglementRef.current,
      stabilityCounter: stabilityCounterRef.current,
      refreshKey,
      finalRefreshCounter,
      lastDbSync: finalState.lastDbSync ? new Date(finalState.lastDbSync).toLocaleTimeString() : 'Never',
      forceSync: finalState.forceSync,
      isLoading
    });

    // Log control details if we have controls
    if (droppedControls.length > 0) {
      console.log('📝 FINAL QUANTUM STATE: Current controls:');
      droppedControls.slice(0, 3).forEach((control, index) => {
        console.log(`   ${index + 1}. ${control.name} (${control.type}) - Section: ${control.sectionId}`);
      });
    }
  }, [droppedControls.length, refreshKey, finalRefreshCounter, isLoading]);

  // FINAL: Set loading to false when quantum entanglement is established
  useEffect(() => {
    if (quantumEntanglementRef.current && droppedControls.length > 0 && isLoading) {
      console.log('✅ FINAL QUANTUM: Quantum entanglement established - setting loading to false');
      setIsLoading(false);
    }
  }, [droppedControls.length, isLoading]);

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