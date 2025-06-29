import { createClient, Client } from '@libsql/client';
import { Questionnaire, Section, DroppedControl, CustomerTier } from '../types';

let db: Client | null = null;

export const initializeDatabase = async (): Promise<Client> => {
  if (db) return db;

  try {
    // Create in-memory SQLite database with proper WASM configuration
    db = createClient({
      url: ':memory:',
      wasmUrl: '/node_modules/@libsql/client/dist/web/libsql-wasm.wasm'
    });

    // Create tables
    await createTables();
    
    // Insert default data
    await insertDefaultData();
    
    console.log('Database initialized successfully');
    return db;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
};

const createTables = async () => {
  if (!db) throw new Error('Database not initialized');

  // Create questionnaires table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS questionnaires (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      purpose TEXT,
      category TEXT DEFAULT 'General',
      status TEXT DEFAULT 'Draft',
      version TEXT DEFAULT '1.0.0',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      created_by TEXT DEFAULT 'User',
      tier TEXT DEFAULT 'platinum',
      total_responses INTEGER DEFAULT 0,
      completion_rate REAL DEFAULT 0,
      average_time REAL DEFAULT 0,
      last_response TEXT DEFAULT 'Never'
    )
  `);

  // Create sections table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS sections (
      id TEXT PRIMARY KEY,
      questionnaire_id TEXT,
      name TEXT NOT NULL,
      description TEXT,
      color TEXT DEFAULT '#3B82F6',
      icon TEXT DEFAULT 'Layout',
      section_order INTEGER DEFAULT 0,
      required BOOLEAN DEFAULT FALSE,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (questionnaire_id) REFERENCES questionnaires (id) ON DELETE CASCADE
    )
  `);

  // Create controls table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS controls (
      id TEXT PRIMARY KEY,
      questionnaire_id TEXT,
      section_id TEXT NOT NULL,
      type TEXT NOT NULL,
      name TEXT NOT NULL,
      x INTEGER DEFAULT 0,
      y INTEGER DEFAULT 0,
      width INTEGER DEFAULT 400,
      height INTEGER DEFAULT 50,
      properties TEXT DEFAULT '{}',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (questionnaire_id) REFERENCES questionnaires (id) ON DELETE CASCADE,
      FOREIGN KEY (section_id) REFERENCES sections (id) ON DELETE CASCADE
    )
  `);

  // Create indexes for better performance
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_sections_questionnaire ON sections(questionnaire_id)`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_controls_section ON controls(section_id)`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_controls_questionnaire ON controls(questionnaire_id)`);
};

const insertDefaultData = async () => {
  if (!db) throw new Error('Database not initialized');

  // Insert default questionnaire
  const defaultQuestionnaireId = 'default-questionnaire';
  await db.execute({
    sql: `INSERT OR IGNORE INTO questionnaires (id, name, description, purpose, category, status, tier) 
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [
      defaultQuestionnaireId,
      'Default Questionnaire',
      'Default questionnaire for form building',
      'Template for creating new forms',
      'General',
      'Draft',
      'platinum'
    ]
  });

  // Insert default section
  const defaultSectionId = 'default';
  await db.execute({
    sql: `INSERT OR IGNORE INTO sections (id, questionnaire_id, name, description, color, icon, section_order, required) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      defaultSectionId,
      defaultQuestionnaireId,
      'General Information',
      'Basic form information',
      '#3B82F6',
      'Layout',
      0,
      false
    ]
  });
};

// NEW: Atomic batch insert for controls with comprehensive error handling
export const insertControlsBatch = async (controls: DroppedControl[], questionnaireId: string = 'default-questionnaire'): Promise<{ success: number; errors: string[] }> => {
  if (!db) throw new Error('Database not initialized');

  console.log('🔄 DB ATOMIC: ===== STARTING ATOMIC BATCH INSERT =====');
  console.log('📊 DB ATOMIC: Batch details:', {
    controlCount: controls.length,
    questionnaireId,
    timestamp: new Date().toISOString()
  });

  let success = 0;
  const errors: string[] = [];

  // Start transaction for atomic operation
  try {
    console.log('🔄 DB ATOMIC: Beginning transaction...');
    await db.execute('BEGIN TRANSACTION');

    for (let i = 0; i < controls.length; i++) {
      const control = controls[i];
      try {
        console.log(`🔄 DB ATOMIC: Inserting control ${i + 1}/${controls.length}: ${control.name}`);
        
        // Validate control data
        if (!control.id || !control.type || !control.name) {
          throw new Error(`Invalid control data: missing required fields`);
        }

        // Insert control with atomic operation
        await db.execute({
          sql: `INSERT INTO controls (id, questionnaire_id, section_id, type, name, x, y, width, height, properties) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            control.id,
            questionnaireId,
            control.sectionId || 'default',
            control.type,
            control.name,
            control.x,
            control.y,
            control.width,
            control.height,
            JSON.stringify(control.properties)
          ]
        });

        success++;
        console.log(`✅ DB ATOMIC: Successfully inserted control ${i + 1}: ${control.name}`);
      } catch (error) {
        const errorMsg = `Failed to insert control ${control.name}: ${error}`;
        errors.push(errorMsg);
        console.error(`❌ DB ATOMIC: ${errorMsg}`);
        
        // For atomic operation, we should rollback on any error
        throw error;
      }
    }

    // Commit transaction if all inserts successful
    console.log('🔄 DB ATOMIC: Committing transaction...');
    await db.execute('COMMIT');
    
    console.log('✅ DB ATOMIC: ===== ATOMIC BATCH INSERT COMPLETED SUCCESSFULLY =====');
    console.log('📊 DB ATOMIC: Final results:', {
      successCount: success,
      errorCount: errors.length,
      totalProcessed: controls.length
    });

    return { success, errors };

  } catch (error) {
    // Rollback transaction on any error
    console.log('🔄 DB ATOMIC: Rolling back transaction due to error...');
    try {
      await db.execute('ROLLBACK');
      console.log('✅ DB ATOMIC: Transaction rolled back successfully');
    } catch (rollbackError) {
      console.error('❌ DB ATOMIC: Failed to rollback transaction:', rollbackError);
    }

    console.error('❌ DB ATOMIC: ===== ATOMIC BATCH INSERT FAILED =====');
    console.error('❌ DB ATOMIC: Error details:', error);
    
    // Return error result
    return { 
      success: 0, 
      errors: [`Atomic transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`] 
    };
  }
};

// NEW: Enhanced control verification with detailed logging
export const verifyControlsInDatabase = async (questionnaireId: string = 'default-questionnaire'): Promise<{ count: number; controls: DroppedControl[] }> => {
  if (!db) throw new Error('Database not initialized');

  console.log('🔍 DB VERIFY: ===== STARTING DATABASE VERIFICATION =====');
  console.log('📊 DB VERIFY: Verification parameters:', {
    questionnaireId,
    timestamp: new Date().toISOString()
  });

  try {
    const result = await db.execute({
      sql: 'SELECT * FROM controls WHERE questionnaire_id = ? ORDER BY y, x',
      args: [questionnaireId]
    });

    const controls = result.rows.map(row => ({
      id: row.id as string,
      type: row.type as string,
      name: row.name as string,
      x: row.x as number,
      y: row.y as number,
      width: row.width as number,
      height: row.height as number,
      properties: JSON.parse(row.properties as string || '{}'),
      sectionId: row.section_id as string
    }));

    console.log('✅ DB VERIFY: Database verification completed:', {
      controlCount: controls.length,
      sectionDistribution: controls.reduce((acc, c) => {
        acc[c.sectionId || 'unknown'] = (acc[c.sectionId || 'unknown'] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    });

    console.log('📝 DB VERIFY: First 5 controls in database:');
    controls.slice(0, 5).forEach((control, index) => {
      console.log(`   ${index + 1}. ${control.name} (${control.type}) - Section: ${control.sectionId}, ID: ${control.id}`);
    });

    return { count: controls.length, controls };

  } catch (error) {
    console.error('❌ DB VERIFY: Database verification failed:', error);
    throw error;
  }
};

// Questionnaire operations
export const getQuestionnaires = async (): Promise<Questionnaire[]> => {
  if (!db) throw new Error('Database not initialized');

  const result = await db.execute('SELECT * FROM questionnaires ORDER BY updated_at DESC');
  
  return result.rows.map(row => ({
    id: row.id as string,
    name: row.name as string,
    description: row.description as string || '',
    purpose: row.purpose as string || '',
    category: row.category as string || 'General',
    status: row.status as 'Active' | 'Inactive' | 'Draft',
    version: row.version as string || '1.0.0',
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    createdBy: row.created_by as string || 'User',
    tier: row.tier as CustomerTier,
    sections: [],
    controls: [],
    analytics: {
      totalResponses: row.total_responses as number || 0,
      completionRate: row.completion_rate as number || 0,
      averageTime: row.average_time as number || 0,
      lastResponse: row.last_response as string || 'Never'
    },
    versions: []
  }));
};

export const insertQuestionnaire = async (questionnaire: Omit<Questionnaire, 'sections' | 'controls' | 'versions'>): Promise<void> => {
  if (!db) throw new Error('Database not initialized');

  await db.execute({
    sql: `INSERT INTO questionnaires (id, name, description, purpose, category, status, version, created_by, tier, total_responses, completion_rate, average_time, last_response) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      questionnaire.id,
      questionnaire.name,
      questionnaire.description,
      questionnaire.purpose,
      questionnaire.category,
      questionnaire.status,
      questionnaire.version,
      questionnaire.createdBy,
      questionnaire.tier,
      questionnaire.analytics.totalResponses,
      questionnaire.analytics.completionRate,
      questionnaire.analytics.averageTime,
      questionnaire.analytics.lastResponse
    ]
  });
};

export const updateQuestionnaire = async (id: string, updates: Partial<Questionnaire>): Promise<void> => {
  if (!db) throw new Error('Database not initialized');

  const setClause = [];
  const args = [];

  if (updates.name) {
    setClause.push('name = ?');
    args.push(updates.name);
  }
  if (updates.description) {
    setClause.push('description = ?');
    args.push(updates.description);
  }
  if (updates.status) {
    setClause.push('status = ?');
    args.push(updates.status);
  }
  if (updates.tier) {
    setClause.push('tier = ?');
    args.push(updates.tier);
  }

  setClause.push('updated_at = CURRENT_TIMESTAMP');
  args.push(id);

  await db.execute({
    sql: `UPDATE questionnaires SET ${setClause.join(', ')} WHERE id = ?`,
    args
  });
};

export const deleteQuestionnaire = async (id: string): Promise<void> => {
  if (!db) throw new Error('Database not initialized');

  await db.execute({
    sql: 'DELETE FROM questionnaires WHERE id = ?',
    args: [id]
  });
};

// Section operations
export const getSections = async (questionnaireId: string = 'default-questionnaire'): Promise<Section[]> => {
  if (!db) throw new Error('Database not initialized');

  const result = await db.execute({
    sql: 'SELECT * FROM sections WHERE questionnaire_id = ? ORDER BY section_order',
    args: [questionnaireId]
  });

  return result.rows.map(row => ({
    id: row.id as string,
    name: row.name as string,
    description: row.description as string || '',
    color: row.color as string,
    icon: row.icon as string,
    order: row.section_order as number,
    required: Boolean(row.required),
    controls: [],
    validation: {
      isValid: true,
      requiredFields: 0,
      completedFields: 0
    }
  }));
};

export const insertSection = async (section: Omit<Section, 'controls' | 'validation'>, questionnaireId: string = 'default-questionnaire'): Promise<void> => {
  if (!db) throw new Error('Database not initialized');

  await db.execute({
    sql: `INSERT INTO sections (id, questionnaire_id, name, description, color, icon, section_order, required) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      section.id,
      questionnaireId,
      section.name,
      section.description,
      section.color,
      section.icon,
      section.order,
      section.required
    ]
  });
};

export const updateSection = async (id: string, updates: Partial<Section>): Promise<void> => {
  if (!db) throw new Error('Database not initialized');

  const setClause = [];
  const args = [];

  if (updates.name) {
    setClause.push('name = ?');
    args.push(updates.name);
  }
  if (updates.description !== undefined) {
    setClause.push('description = ?');
    args.push(updates.description);
  }
  if (updates.color) {
    setClause.push('color = ?');
    args.push(updates.color);
  }
  if (updates.icon) {
    setClause.push('icon = ?');
    args.push(updates.icon);
  }
  if (updates.order !== undefined) {
    setClause.push('section_order = ?');
    args.push(updates.order);
  }
  if (updates.required !== undefined) {
    setClause.push('required = ?');
    args.push(updates.required);
  }

  args.push(id);

  await db.execute({
    sql: `UPDATE sections SET ${setClause.join(', ')} WHERE id = ?`,
    args
  });
};

export const deleteSection = async (id: string): Promise<void> => {
  if (!db) throw new Error('Database not initialized');

  await db.execute({
    sql: 'DELETE FROM sections WHERE id = ?',
    args: [id]
  });
};

// Control operations
export const getControls = async (questionnaireId: string = 'default-questionnaire'): Promise<DroppedControl[]> => {
  if (!db) throw new Error('Database not initialized');

  const result = await db.execute({
    sql: 'SELECT * FROM controls WHERE questionnaire_id = ? ORDER BY y, x',
    args: [questionnaireId]
  });

  return result.rows.map(row => ({
    id: row.id as string,
    type: row.type as string,
    name: row.name as string,
    x: row.x as number,
    y: row.y as number,
    width: row.width as number,
    height: row.height as number,
    properties: JSON.parse(row.properties as string || '{}'),
    sectionId: row.section_id as string
  }));
};

export const insertControl = async (control: DroppedControl, questionnaireId: string = 'default-questionnaire'): Promise<void> => {
  if (!db) throw new Error('Database not initialized');

  await db.execute({
    sql: `INSERT INTO controls (id, questionnaire_id, section_id, type, name, x, y, width, height, properties) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      control.id,
      questionnaireId,
      control.sectionId || 'default',
      control.type,
      control.name,
      control.x,
      control.y,
      control.width,
      control.height,
      JSON.stringify(control.properties)
    ]
  });
};

export const updateControl = async (id: string, updates: Partial<DroppedControl>): Promise<void> => {
  if (!db) throw new Error('Database not initialized');

  const setClause = [];
  const args = [];

  if (updates.type) {
    setClause.push('type = ?');
    args.push(updates.type);
  }
  if (updates.name) {
    setClause.push('name = ?');
    args.push(updates.name);
  }
  if (updates.x !== undefined) {
    setClause.push('x = ?');
    args.push(updates.x);
  }
  if (updates.y !== undefined) {
    setClause.push('y = ?');
    args.push(updates.y);
  }
  if (updates.width !== undefined) {
    setClause.push('width = ?');
    args.push(updates.width);
  }
  if (updates.height !== undefined) {
    setClause.push('height = ?');
    args.push(updates.height);
  }
  if (updates.properties) {
    setClause.push('properties = ?');
    args.push(JSON.stringify(updates.properties));
  }
  if (updates.sectionId) {
    setClause.push('section_id = ?');
    args.push(updates.sectionId);
  }

  args.push(id);

  await db.execute({
    sql: `UPDATE controls SET ${setClause.join(', ')} WHERE id = ?`,
    args
  });
};

export const deleteControl = async (id: string): Promise<void> => {
  if (!db) throw new Error('Database not initialized');

  await db.execute({
    sql: 'DELETE FROM controls WHERE id = ?',
    args: [id]
  });
};

export const reorderControls = async (controls: DroppedControl[]): Promise<void> => {
  if (!db) throw new Error('Database not initialized');

  // Update all controls with new order
  for (const control of controls) {
    await db.execute({
      sql: 'UPDATE controls SET y = ? WHERE id = ?',
      args: [control.y, control.id]
    });
  }
};

// Utility function to get database instance
export const getDatabase = (): Client => {
  if (!db) throw new Error('Database not initialized');
  return db;
};