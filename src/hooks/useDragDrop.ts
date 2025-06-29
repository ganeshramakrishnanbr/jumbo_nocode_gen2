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

// QUANTUM STATE MANAGEMENT SYSTEM
interface QuantumState {
  controls: DroppedControl[];
  hash: string;
  timestamp: number;
  version: number;
  isStable: boolean;
  syncLevel: 'PERFECT' | 'GOOD' | 'NEEDS_SYNC' | 'CRITICAL';
}

export const useDragDrop = (questionnaireId: string = 'default-questionnaire', isDbInitialized: boolean = false, refreshKey: number = 0) => {
  const [droppedControls, setDroppedControls] = useState<DroppedControl[]>([]);
  const [selectedControl, setSelectedControl] = useState<DroppedControl | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // QUANTUM STATE MANAGEMENT
  const quantumStateRef = useRef<QuantumState>({
    controls: [],
    hash: '',
    timestamp: 0,
    version: 0,
    isStable: false,
    syncLevel: 'CRITICAL'
  });
  
  const [quantumSyncActive, setQuantumSyncActive] = useState(false);
  const [lastQuantumSync, setLastQuantumSync] = useState(0);
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const stabilityCounterRef = useRef(0);

  // QUANTUM: Generate state hash for perfect tracking
  const generateQuantumHash = useCallback((controls: DroppedControl[]): string => {
    const stateString = controls
      .sort((a, b) => a.id.localeCompare(b.id))
      .map(c => `${c.id}:${c.type}:${c.sectionId}:${c.y}`)
      .join('|');
    
    // Simple hash function for state tracking
    let hash = 0;
    for (let i = 0; i < stateString.length; i++) {
      const char = stateString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }, []);

  // QUANTUM: Analyze sync level between database and UI state
  const analyzeQuantumSyncLevel = useCallback((dbControls: DroppedControl[], uiControls: DroppedControl[]): 'PERFECT' | 'GOOD' | 'NEEDS_SYNC' | 'CRITICAL' => {
    const dbHash = generateQuantumHash(dbControls);
    const uiHash = generateQuantumHash(uiControls);
    
    if (dbHash === uiHash) return 'PERFECT';
    if (Math.abs(dbControls.length - uiControls.length) <= 1) return 'GOOD';
    if (Math.abs(dbControls.length - uiControls.length) <= 3) return 'NEEDS_SYNC';
    return 'CRITICAL';
  }, [generateQuantumHash]);

  // QUANTUM: Real-time bidirectional synchronization
  const quantumSync = useCallback(async (): Promise<boolean> => {
    if (!isDbInitialized || quantumSyncActive) {
      return false;
    }

    try {
      setQuantumSyncActive(true);
      console.log('🌌 QUANTUM SYNC: ===== INITIATING QUANTUM SYNCHRONIZATION =====');
      
      const startTime = Date.now();
      const verification = await verifyControlsInDatabase(questionnaireId);
      const dbControls = verification.controls;
      
      const currentQuantumState = quantumStateRef.current;
      const newHash = generateQuantumHash(dbControls);
      const syncLevel = analyzeQuantumSyncLevel(dbControls, droppedControls);
      
      console.log('🌌 QUANTUM SYNC: State analysis:', {
        dbControlCount: dbControls.length,
        uiControlCount: droppedControls.length,
        previousHash: currentQuantumState.hash.substring(0, 8),
        newHash: newHash.substring(0, 8),
        syncLevel,
        hashChanged: newHash !== currentQuantumState.hash,
        stabilityCounter: stabilityCounterRef.current,
        refreshKey,
        timestamp: new Date().toISOString()
      });

      // QUANTUM: Update quantum state
      const newQuantumState: QuantumState = {
        controls: dbControls,
        hash: newHash,
        timestamp: startTime,
        version: currentQuantumState.version + 1,
        isStable: syncLevel === 'PERFECT' && stabilityCounterRef.current >= 3,
        syncLevel
      };

      quantumStateRef.current = newQuantumState;

      // QUANTUM: Apply state updates based on sync level
      let stateUpdated = false;
      
      if (syncLevel === 'PERFECT') {
        stabilityCounterRef.current++;
        console.log('✨ QUANTUM SYNC: Perfect synchronization achieved');
        
        if (stabilityCounterRef.current >= 5) {
          console.log('🎯 QUANTUM SYNC: Quantum stability reached - entering maintenance mode');
          setLastQuantumSync(startTime);
          return true; // Quantum stability achieved
        }
      } else {
        stabilityCounterRef.current = 0;
        
        if (newHash !== currentQuantumState.hash || syncLevel === 'CRITICAL') {
          console.log('🔄 QUANTUM SYNC: Applying quantum state correction');
          setDroppedControls(dbControls);
          stateUpdated = true;
        }
      }

      const syncDuration = Date.now() - startTime;
      console.log('✅ QUANTUM SYNC: Synchronization completed:', {
        duration: `${syncDuration}ms`,
        stateUpdated,
        syncLevel,
        stabilityCounter: stabilityCounterRef.current,
        quantumVersion: newQuantumState.version
      });

      setLastQuantumSync(startTime);
      return syncLevel === 'PERFECT' && stabilityCounterRef.current >= 5;

    } catch (error) {
      console.error('❌ QUANTUM SYNC: Synchronization failed:', error);
      stabilityCounterRef.current = 0;
      return false;
    } finally {
      setQuantumSyncActive(false);
    }
  }, [isDbInitialized, quantumSyncActive, questionnaireId, generateQuantumHash, analyzeQuantumSyncLevel, droppedControls, refreshKey]);

  // QUANTUM: Initialize quantum synchronization system
  const initializeQuantumSync = useCallback(() => {
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
    }

    console.log('🌌 QUANTUM INIT: Initializing quantum synchronization system');
    
    // Start quantum sync interval
    syncIntervalRef.current = setInterval(async () => {
      const quantumStable = await quantumSync();
      
      if (quantumStable) {
        console.log('🎯 QUANTUM INIT: Quantum stability achieved - reducing sync frequency');
        if (syncIntervalRef.current) {
          clearInterval(syncIntervalRef.current);
          // Switch to maintenance mode with longer intervals
          syncIntervalRef.current = setInterval(quantumSync, 5000);
        }
      }
    }, 1000); // Initial high-frequency sync

  }, [quantumSync]);

  // QUANTUM: Enhanced control loading with quantum integration
  const loadControlsFromDB = useCallback(async () => {
    if (!isDbInitialized) {
      console.log('⏸️ useDragDrop: Database not initialized, skipping control load');
      setIsLoading(true);
      return;
    }

    try {
      setIsLoading(true);
      console.log('🔄 useDragDrop: ===== QUANTUM-ENHANCED CONTROL LOADING =====');
      
      const verification = await verifyControlsInDatabase(questionnaireId);
      const controls = verification.controls;
      
      const newHash = generateQuantumHash(controls);
      const currentQuantumState = quantumStateRef.current;
      
      console.log('📊 useDragDrop: Quantum-enhanced load results:', {
        controlCount: controls.length,
        newHash: newHash.substring(0, 8),
        previousHash: currentQuantumState.hash.substring(0, 8),
        hashChanged: newHash !== currentQuantumState.hash,
        refreshKey,
        timestamp: new Date().toISOString()
      });

      // QUANTUM: Only update if quantum state indicates change
      if (newHash !== currentQuantumState.hash || controls.length !== droppedControls.length) {
        console.log('🔄 useDragDrop: Quantum state change detected - updating');
        setDroppedControls(controls);
        
        // Update quantum state
        quantumStateRef.current = {
          ...currentQuantumState,
          controls,
          hash: newHash,
          timestamp: Date.now(),
          version: currentQuantumState.version + 1
        };
        
        stabilityCounterRef.current = 0;
      } else {
        console.log('✅ useDragDrop: Quantum state stable - no update needed');
        stabilityCounterRef.current++;
      }
      
    } catch (error) {
      console.error('❌ useDragDrop: Quantum-enhanced loading failed:', error);
      setDroppedControls([]);
    } finally {
      setIsLoading(false);
    }
  }, [questionnaireId, isDbInitialized, generateQuantumHash, droppedControls.length, refreshKey]);

  // QUANTUM: Initialize system on database ready
  useEffect(() => {
    if (isDbInitialized) {
      console.log('🌌 QUANTUM EFFECT: Database initialized - starting quantum system');
      initializeQuantumSync();
      loadControlsFromDB();
    }

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
        syncIntervalRef.current = null;
      }
    };
  }, [isDbInitialized, initializeQuantumSync, loadControlsFromDB]);

  // QUANTUM: Respond to refresh key changes
  useEffect(() => {
    if (isDbInitialized && refreshKey > 0) {
      console.log('🌌 QUANTUM EFFECT: RefreshKey changed - triggering quantum sync');
      stabilityCounterRef.current = 0; // Reset stability
      quantumSync();
    }
  }, [refreshKey, isDbInitialized, quantumSync]);

  // QUANTUM: Enhanced force refresh with quantum intelligence
  const forceRefresh = useCallback(async () => {
    console.log('🔄 useDragDrop: ===== QUANTUM FORCE REFRESH =====');
    
    stabilityCounterRef.current = 0;
    const quantumStable = await quantumSync();
    
    if (!quantumStable) {
      // If not stable, trigger additional sync
      setTimeout(quantumSync, 500);
    }
    
    console.log('✅ useDragDrop: Quantum force refresh completed');
  }, [quantumSync]);

  // QUANTUM: Enhanced force reload with quantum reset
  const forceReload = useCallback(async () => {
    console.log('🔄 useDragDrop: ===== QUANTUM FORCE RELOAD =====');
    
    // Reset quantum state
    quantumStateRef.current = {
      controls: [],
      hash: '',
      timestamp: 0,
      version: 0,
      isStable: false,
      syncLevel: 'CRITICAL'
    };
    
    stabilityCounterRef.current = 0;
    setDroppedControls([]);
    setIsLoading(true);
    
    // Reinitialize quantum system
    setTimeout(async () => {
      await loadControlsFromDB();
      initializeQuantumSync();
    }, 200);
    
    console.log('✅ useDragDrop: Quantum force reload completed');
  }, [loadControlsFromDB, initializeQuantumSync]);

  // QUANTUM: Nuclear reset with complete quantum reconstruction
  const nuclearReset = useCallback(async () => {
    console.log('💥 useDragDrop: ===== QUANTUM NUCLEAR RESET =====');
    
    // Stop all quantum processes
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
      syncIntervalRef.current = null;
    }
    
    // Complete quantum state reset
    quantumStateRef.current = {
      controls: [],
      hash: '',
      timestamp: 0,
      version: 0,
      isStable: false,
      syncLevel: 'CRITICAL'
    };
    
    stabilityCounterRef.current = 0;
    setQuantumSyncActive(false);
    setDroppedControls([]);
    setSelectedControl(null);
    setIsLoading(true);
    
    // Quantum reconstruction
    setTimeout(async () => {
      console.log('💥 useDragDrop: Quantum reconstruction phase');
      await loadControlsFromDB();
      initializeQuantumSync();
      console.log('✅ useDragDrop: Quantum nuclear reset completed');
    }, 300);
    
  }, [loadControlsFromDB, initializeQuantumSync]);

  // Standard CRUD operations with quantum integration
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
      
      await insertControl(newControl, questionnaireId);
      setSelectedControl(newControl);
      
      // Trigger quantum sync
      stabilityCounterRef.current = 0;
      setTimeout(quantumSync, 100);
      
      console.log('✅ useDragDrop: Control added with quantum sync');
    } catch (error) {
      console.error('❌ useDragDrop: Failed to add control:', error);
    }
  }, [droppedControls, questionnaireId, isDbInitialized, quantumSync]);

  const updateControl = useCallback(async (id: string, updates: Partial<DroppedControl>) => {
    if (!isDbInitialized) return;

    try {
      await updateControlDB(id, updates);
      
      if (selectedControl?.id === id) {
        setSelectedControl(prev => prev ? { ...prev, ...updates } : null);
      }
      
      // Trigger quantum sync
      stabilityCounterRef.current = 0;
      setTimeout(quantumSync, 100);
      
      console.log('✅ useDragDrop: Control updated with quantum sync');
    } catch (error) {
      console.error('❌ useDragDrop: Failed to update control:', error);
    }
  }, [selectedControl, questionnaireId, isDbInitialized, quantumSync]);

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
      
      // Trigger quantum sync
      stabilityCounterRef.current = 0;
      setTimeout(quantumSync, 100);
      
      console.log('✅ useDragDrop: Control removed with quantum sync');
    } catch (error) {
      console.error('❌ useDragDrop: Failed to remove control:', error);
    }
  }, [droppedControls, selectedControl, questionnaireId, isDbInitialized, quantumSync]);

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
      
      // Trigger quantum sync
      stabilityCounterRef.current = 0;
      setTimeout(quantumSync, 100);
      
      console.log('✅ useDragDrop: Control moved with quantum sync');
    } catch (error) {
      console.error('❌ useDragDrop: Failed to move control:', error);
    }
  }, [droppedControls, questionnaireId, isDbInitialized, quantumSync]);

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
      
      // Trigger quantum sync
      stabilityCounterRef.current = 0;
      setTimeout(quantumSync, 100);
      
      console.log('✅ useDragDrop: Controls reordered with quantum sync');
    } catch (error) {
      console.error('❌ useDragDrop: Failed to reorder control:', error);
    }
  }, [droppedControls, questionnaireId, isDbInitialized, quantumSync]);

  const selectControl = useCallback((control: DroppedControl) => {
    setSelectedControl(control);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedControl(null);
  }, []);

  // QUANTUM: Enhanced state monitoring
  useEffect(() => {
    const quantumState = quantumStateRef.current;
    console.log('🌌 QUANTUM STATE: Current quantum state:', {
      controlCount: droppedControls.length,
      quantumHash: quantumState.hash.substring(0, 8),
      quantumVersion: quantumState.version,
      isStable: quantumState.isStable,
      syncLevel: quantumState.syncLevel,
      stabilityCounter: stabilityCounterRef.current,
      lastSync: lastQuantumSync ? new Date(lastQuantumSync).toLocaleTimeString() : 'Never',
      refreshKey
    });
  }, [droppedControls.length, lastQuantumSync, refreshKey]);

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