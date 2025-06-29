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

// ULTIMATE QUANTUM STATE MANAGEMENT SYSTEM
interface UltimateQuantumState {
  controls: DroppedControl[];
  hash: string;
  timestamp: number;
  version: number;
  isStable: boolean;
  syncLevel: 'PERFECT' | 'GOOD' | 'NEEDS_SYNC' | 'CRITICAL';
  lastDbSync: number;
  forceSync: boolean;
}

export const useDragDrop = (questionnaireId: string = 'default-questionnaire', isDbInitialized: boolean = false, refreshKey: number = 0) => {
  const [droppedControls, setDroppedControls] = useState<DroppedControl[]>([]);
  const [selectedControl, setSelectedControl] = useState<DroppedControl | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // ULTIMATE QUANTUM STATE MANAGEMENT
  const ultimateQuantumStateRef = useRef<UltimateQuantumState>({
    controls: [],
    hash: '',
    timestamp: 0,
    version: 0,
    isStable: false,
    syncLevel: 'CRITICAL',
    lastDbSync: 0,
    forceSync: false
  });
  
  const [quantumSyncActive, setQuantumSyncActive] = useState(false);
  const [ultimateRefreshCounter, setUltimateRefreshCounter] = useState(0);
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const stabilityCounterRef = useRef(0);
  const forceLoadRef = useRef(false);

  // ULTIMATE: Generate quantum hash with enhanced precision
  const generateUltimateQuantumHash = useCallback((controls: DroppedControl[]): string => {
    const stateString = controls
      .sort((a, b) => a.id.localeCompare(b.id))
      .map(c => `${c.id}:${c.type}:${c.name}:${c.sectionId}:${c.y}:${Object.keys(c.properties).length}`)
      .join('|');
    
    let hash = 0;
    for (let i = 0; i < stateString.length; i++) {
      const char = stateString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return `${hash.toString(36)}-${controls.length}-${Date.now().toString(36)}`;
  }, []);

  // ULTIMATE: Force immediate database load with quantum verification
  const ultimateForceLoadFromDatabase = useCallback(async (): Promise<boolean> => {
    if (!isDbInitialized) {
      console.log('⏸️ ULTIMATE QUANTUM: Database not ready');
      return false;
    }

    try {
      console.log('🌌 ULTIMATE QUANTUM: ===== FORCE LOADING FROM DATABASE =====');
      
      const verification = await verifyControlsInDatabase(questionnaireId);
      const dbControls = verification.controls;
      
      console.log('📊 ULTIMATE QUANTUM: Database verification results:', {
        dbControlCount: dbControls.length,
        currentUICount: droppedControls.length,
        questionnaireId,
        refreshKey,
        timestamp: new Date().toISOString()
      });

      if (dbControls.length > 0) {
        console.log('📝 ULTIMATE QUANTUM: Database controls found:');
        dbControls.slice(0, 5).forEach((control, index) => {
          console.log(`   ${index + 1}. ${control.name} (${control.type}) - Section: ${control.sectionId}, ID: ${control.id}`);
        });
      }

      const newHash = generateUltimateQuantumHash(dbControls);
      const currentState = ultimateQuantumStateRef.current;
      
      // ULTIMATE: Always update if there's a difference or force flag is set
      const shouldUpdate = 
        newHash !== currentState.hash || 
        dbControls.length !== droppedControls.length ||
        currentState.forceSync ||
        forceLoadRef.current;

      if (shouldUpdate) {
        console.log('🔄 ULTIMATE QUANTUM: Applying ultimate state update');
        
        // Update UI state immediately
        setDroppedControls(dbControls);
        
        // Update quantum state
        ultimateQuantumStateRef.current = {
          controls: dbControls,
          hash: newHash,
          timestamp: Date.now(),
          version: currentState.version + 1,
          isStable: dbControls.length > 0,
          syncLevel: 'PERFECT',
          lastDbSync: Date.now(),
          forceSync: false
        };

        setUltimateRefreshCounter(prev => prev + 1);
        stabilityCounterRef.current = 0;
        forceLoadRef.current = false;
        
        console.log('✅ ULTIMATE QUANTUM: State updated successfully:', {
          newControlCount: dbControls.length,
          newHash: newHash.substring(0, 12),
          version: ultimateQuantumStateRef.current.version
        });
        
        return true;
      } else {
        console.log('✅ ULTIMATE QUANTUM: State already synchronized');
        stabilityCounterRef.current++;
        return false;
      }

    } catch (error) {
      console.error('❌ ULTIMATE QUANTUM: Force load failed:', error);
      return false;
    }
  }, [isDbInitialized, questionnaireId, droppedControls.length, generateUltimateQuantumHash, refreshKey]);

  // ULTIMATE: Continuous quantum synchronization
  const ultimateQuantumSync = useCallback(async (): Promise<void> => {
    if (!isDbInitialized || quantumSyncActive) {
      return;
    }

    try {
      setQuantumSyncActive(true);
      console.log('🌌 ULTIMATE QUANTUM SYNC: Starting continuous sync');
      
      const syncResult = await ultimateForceLoadFromDatabase();
      
      if (syncResult) {
        console.log('✅ ULTIMATE QUANTUM SYNC: Sync completed with updates');
      } else {
        console.log('✅ ULTIMATE QUANTUM SYNC: Sync completed - no updates needed');
      }

    } catch (error) {
      console.error('❌ ULTIMATE QUANTUM SYNC: Sync failed:', error);
    } finally {
      setQuantumSyncActive(false);
    }
  }, [isDbInitialized, quantumSyncActive, ultimateForceLoadFromDatabase]);

  // ULTIMATE: Initialize quantum system with aggressive loading
  const initializeUltimateQuantumSystem = useCallback(() => {
    console.log('🌌 ULTIMATE QUANTUM INIT: Initializing ultimate quantum system');
    
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
    }

    // Immediate first load
    if (isDbInitialized) {
      console.log('🌌 ULTIMATE QUANTUM INIT: Triggering immediate load');
      forceLoadRef.current = true;
      ultimateQuantumSync();
    }

    // Start aggressive sync interval
    syncIntervalRef.current = setInterval(() => {
      if (isDbInitialized) {
        ultimateQuantumSync();
      }
    }, 500); // Very frequent sync

    // Cleanup function
    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
        syncIntervalRef.current = null;
      }
    };
  }, [isDbInitialized, ultimateQuantumSync]);

  // ULTIMATE: Initialize on database ready
  useEffect(() => {
    console.log('🌌 ULTIMATE QUANTUM EFFECT: Database state changed:', {
      isDbInitialized,
      refreshKey,
      currentControlCount: droppedControls.length
    });

    if (isDbInitialized) {
      const cleanup = initializeUltimateQuantumSystem();
      return cleanup;
    }
  }, [isDbInitialized, initializeUltimateQuantumSystem]);

  // ULTIMATE: Respond to refresh key changes immediately
  useEffect(() => {
    if (isDbInitialized && refreshKey > 0) {
      console.log('🌌 ULTIMATE QUANTUM EFFECT: RefreshKey changed - forcing immediate sync');
      forceLoadRef.current = true;
      ultimateQuantumStateRef.current.forceSync = true;
      ultimateQuantumSync();
    }
  }, [refreshKey, isDbInitialized, ultimateQuantumSync]);

  // ULTIMATE: Force loading when controls are empty but should have data
  useEffect(() => {
    if (isDbInitialized && droppedControls.length === 0 && refreshKey > 0) {
      console.log('🌌 ULTIMATE QUANTUM EFFECT: Empty controls detected with refreshKey > 0 - forcing load');
      setTimeout(() => {
        forceLoadRef.current = true;
        ultimateQuantumSync();
      }, 100);
    }
  }, [isDbInitialized, droppedControls.length, refreshKey, ultimateQuantumSync]);

  // ULTIMATE: Enhanced force refresh
  const forceRefresh = useCallback(async () => {
    console.log('🔄 ULTIMATE QUANTUM: ===== FORCE REFRESH =====');
    
    forceLoadRef.current = true;
    ultimateQuantumStateRef.current.forceSync = true;
    stabilityCounterRef.current = 0;
    
    const result = await ultimateForceLoadFromDatabase();
    
    if (!result) {
      // If no update, try again after a short delay
      setTimeout(async () => {
        console.log('🔄 ULTIMATE QUANTUM: Retry force refresh');
        forceLoadRef.current = true;
        await ultimateForceLoadFromDatabase();
      }, 200);
    }
    
    console.log('✅ ULTIMATE QUANTUM: Force refresh completed');
  }, [ultimateForceLoadFromDatabase]);

  // ULTIMATE: Enhanced force reload
  const forceReload = useCallback(async () => {
    console.log('🔄 ULTIMATE QUANTUM: ===== FORCE RELOAD =====');
    
    // Reset all state
    ultimateQuantumStateRef.current = {
      controls: [],
      hash: '',
      timestamp: 0,
      version: 0,
      isStable: false,
      syncLevel: 'CRITICAL',
      lastDbSync: 0,
      forceSync: true
    };
    
    stabilityCounterRef.current = 0;
    forceLoadRef.current = true;
    setDroppedControls([]);
    setIsLoading(true);
    
    // Force immediate reload
    setTimeout(async () => {
      await ultimateForceLoadFromDatabase();
      setIsLoading(false);
    }, 100);
    
    console.log('✅ ULTIMATE QUANTUM: Force reload completed');
  }, [ultimateForceLoadFromDatabase]);

  // ULTIMATE: Nuclear reset with complete reconstruction
  const nuclearReset = useCallback(async () => {
    console.log('💥 ULTIMATE QUANTUM: ===== NUCLEAR RESET =====');
    
    // Stop all processes
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
      syncIntervalRef.current = null;
    }
    
    // Complete state reset
    ultimateQuantumStateRef.current = {
      controls: [],
      hash: '',
      timestamp: 0,
      version: 0,
      isStable: false,
      syncLevel: 'CRITICAL',
      lastDbSync: 0,
      forceSync: true
    };
    
    stabilityCounterRef.current = 0;
    forceLoadRef.current = true;
    setQuantumSyncActive(false);
    setDroppedControls([]);
    setSelectedControl(null);
    setIsLoading(true);
    setUltimateRefreshCounter(0);
    
    // Nuclear reconstruction
    setTimeout(async () => {
      console.log('💥 ULTIMATE QUANTUM: Nuclear reconstruction phase');
      await ultimateForceLoadFromDatabase();
      const cleanup = initializeUltimateQuantumSystem();
      setIsLoading(false);
      console.log('✅ ULTIMATE QUANTUM: Nuclear reset completed');
    }, 200);
    
  }, [ultimateForceLoadFromDatabase, initializeUltimateQuantumSystem]);

  // Standard CRUD operations with ultimate quantum integration
  const addControl = useCallback(async (controlType: ControlType, x: number, y: number, sectionId: string = 'default') => {
    if (!isDbInitialized) {
      console.warn('⚠️ ULTIMATE QUANTUM: Cannot add control - database not initialized');
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
      
      // Trigger ultimate quantum sync
      forceLoadRef.current = true;
      setTimeout(ultimateQuantumSync, 50);
      
      console.log('✅ ULTIMATE QUANTUM: Control added with ultimate sync');
    } catch (error) {
      console.error('❌ ULTIMATE QUANTUM: Failed to add control:', error);
    }
  }, [droppedControls, questionnaireId, isDbInitialized, ultimateQuantumSync]);

  const updateControl = useCallback(async (id: string, updates: Partial<DroppedControl>) => {
    if (!isDbInitialized) return;

    try {
      await updateControlDB(id, updates);
      
      if (selectedControl?.id === id) {
        setSelectedControl(prev => prev ? { ...prev, ...updates } : null);
      }
      
      // Trigger ultimate quantum sync
      forceLoadRef.current = true;
      setTimeout(ultimateQuantumSync, 50);
      
      console.log('✅ ULTIMATE QUANTUM: Control updated with ultimate sync');
    } catch (error) {
      console.error('❌ ULTIMATE QUANTUM: Failed to update control:', error);
    }
  }, [selectedControl, questionnaireId, isDbInitialized, ultimateQuantumSync]);

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
      
      // Trigger ultimate quantum sync
      forceLoadRef.current = true;
      setTimeout(ultimateQuantumSync, 50);
      
      console.log('✅ ULTIMATE QUANTUM: Control removed with ultimate sync');
    } catch (error) {
      console.error('❌ ULTIMATE QUANTUM: Failed to remove control:', error);
    }
  }, [droppedControls, selectedControl, questionnaireId, isDbInitialized, ultimateQuantumSync]);

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
      
      // Trigger ultimate quantum sync
      forceLoadRef.current = true;
      setTimeout(ultimateQuantumSync, 50);
      
      console.log('✅ ULTIMATE QUANTUM: Control moved with ultimate sync');
    } catch (error) {
      console.error('❌ ULTIMATE QUANTUM: Failed to move control:', error);
    }
  }, [droppedControls, questionnaireId, isDbInitialized, ultimateQuantumSync]);

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
      
      // Trigger ultimate quantum sync
      forceLoadRef.current = true;
      setTimeout(ultimateQuantumSync, 50);
      
      console.log('✅ ULTIMATE QUANTUM: Controls reordered with ultimate sync');
    } catch (error) {
      console.error('❌ ULTIMATE QUANTUM: Failed to reorder control:', error);
    }
  }, [droppedControls, questionnaireId, isDbInitialized, ultimateQuantumSync]);

  const selectControl = useCallback((control: DroppedControl) => {
    setSelectedControl(control);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedControl(null);
  }, []);

  // ULTIMATE: Enhanced state monitoring with detailed logging
  useEffect(() => {
    const ultimateState = ultimateQuantumStateRef.current;
    console.log('🌌 ULTIMATE QUANTUM STATE: Current state:', {
      controlCount: droppedControls.length,
      ultimateHash: ultimateState.hash.substring(0, 12),
      ultimateVersion: ultimateState.version,
      isStable: ultimateState.isStable,
      syncLevel: ultimateState.syncLevel,
      stabilityCounter: stabilityCounterRef.current,
      refreshKey,
      ultimateRefreshCounter,
      lastDbSync: ultimateState.lastDbSync ? new Date(ultimateState.lastDbSync).toLocaleTimeString() : 'Never',
      forceSync: ultimateState.forceSync,
      isLoading
    });

    // Log control details if we have controls
    if (droppedControls.length > 0) {
      console.log('📝 ULTIMATE QUANTUM STATE: Current controls:');
      droppedControls.slice(0, 3).forEach((control, index) => {
        console.log(`   ${index + 1}. ${control.name} (${control.type}) - Section: ${control.sectionId}`);
      });
    }
  }, [droppedControls.length, refreshKey, ultimateRefreshCounter, isLoading]);

  // ULTIMATE: Set loading to false when we have controls
  useEffect(() => {
    if (droppedControls.length > 0 && isLoading) {
      console.log('✅ ULTIMATE QUANTUM: Controls loaded - setting loading to false');
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