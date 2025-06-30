import * as XLSX from 'xlsx';
import { CONTROLS, CONTROL_CATEGORIES } from '../data/controls';
import { DroppedControl } from '../types';

export interface ExcelControlData {
  id: string;
  type: string;
  category: string;
  name: string;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string;
  description?: string;
  sectionId: string;
  order: number;
  // Additional properties based on control type
  [key: string]: any;
}

export const generateExcelTemplate = () => {
  const workbook = XLSX.utils.book_new();

  // Instructions Sheet
  const instructionsData = [
    ['JUMBO FORM BUILDER - EXCEL TEMPLATE INSTRUCTIONS'],
    [''],
    ['This template allows you to create form controls in bulk using Excel.'],
    ['Follow the format in the "Design" sheet to create your form controls.'],
    [''],
    ['COLUMN DESCRIPTIONS:'],
    ['id: Leave EMPTY - IDs are auto-generated during import'],
    ['type: Control type from the available controls list'],
    ['category: Control category'],
    ['name: Display name for the control'],
    ['label: Label text shown to users'],
    ['placeholder: Placeholder text for input fields'],
    ['required: TRUE/FALSE - whether field is required'],
    ['options: Comma-separated list for dropdowns, radio buttons, etc.'],
    ['description: Help text for the control'],
    ['sectionId: Section to place the control (default: "default")'],
    ['order: Display order within the section'],
    [''],
    ['EXAMPLE USAGE:'],
    ['See the "Design" sheet for sample data and examples'],
    [''],
    ['REQUIRED FIELD EXAMPLES:'],
    ['- Set required=TRUE for mandatory fields'],
    ['- Required fields will show red asterisk (*) in the form'],
    ['- Use description field to explain why field is required'],
    [''],
    ['IMPORTANT NOTES:'],
    ['- ALWAYS leave ID column empty for auto-generation'],
    ['- Duplicate IDs will cause import errors'],
    ['- Controls will be added to existing sections or create new ones'],
    ['- Check console logs during import for detailed debugging information']
  ];

  const instructionsSheet = XLSX.utils.aoa_to_sheet(instructionsData);
  XLSX.utils.book_append_sheet(workbook, instructionsSheet, 'Instructions');

  // Design Sheet with Enhanced Sample Data
  const designHeaders = [
    'id',
    'type',
    'category',
    'name',
    'label',
    'placeholder',
    'required',
    'options',
    'description',
    'sectionId',
    'order',
    'minLength',
    'maxLength',
    'min',
    'max',
    'step',
    'rows',
    'accept',
    'multiple',
    'maxSize',
    'format',
    'layout',
    'scaleType',
    'maxValue',
    'defaultValue',
    'onLabel',
    'offLabel',
    'canvasWidth',
    'canvasHeight',
    'defaultColor',
    'text',
    'level',
    'alignment',
    'fontSize',
    'color',
    'style',
    'thickness',
    'spacing',
    'rowLabels',
    'columnOptions',
    'questions',
    'answers',
    'items'
  ];

  const sampleData: ExcelControlData[] = [
    // Core Input Section - All basic input types
    {
      id: '',
      type: 'textInput',
      category: 'Core Input',
      name: 'Full Name',
      label: 'Full Name',
      placeholder: 'Enter your complete legal name',
      required: true,
      description: 'Required for identification purposes',
      sectionId: 'core-inputs',
      order: 1,
      maxLength: 100
    },
    {
      id: '',
      type: 'textarea',
      category: 'Core Input',
      name: 'Description',
      label: 'Tell us about yourself',
      placeholder: 'Provide a detailed description...',
      required: false,
      description: 'Multi-line text input example',
      sectionId: 'core-inputs',
      order: 2,
      rows: 4,
      maxLength: 500
    },
    {
      id: '',
      type: 'numberInput',
      category: 'Core Input',
      name: 'Age',
      label: 'Age',
      required: true,
      description: 'Numeric input with validation',
      sectionId: 'core-inputs',
      order: 3,
      min: 18,
      max: 100,
      step: 1
    },
    {
      id: '',
      type: 'emailInput',
      category: 'Core Input',
      name: 'Email Address',
      label: 'Email Address',
      placeholder: 'your.email@example.com',
      required: true,
      description: 'Primary contact email - required for account creation',
      sectionId: 'core-inputs',
      order: 4
    },
    {
      id: '',
      type: 'phoneInput',
      category: 'Core Input',
      name: 'Phone Number',
      label: 'Phone Number',
      placeholder: '(555) 123-4567',
      required: false,
      description: 'Optional backup contact method',
      sectionId: 'core-inputs',
      order: 5
    },

    // Date & Time Section
    {
      id: '',
      type: 'datePicker',
      category: 'Date & Time',
      name: 'Date of Birth',
      label: 'Date of Birth',
      required: true,
      format: 'YYYY-MM-DD',
      description: 'Required for age verification',
      sectionId: 'date-time',
      order: 1
    },
    {
      id: '',
      type: 'timePicker',
      category: 'Date & Time',
      name: 'Preferred Meeting Time',
      label: 'Best Meeting Time',
      required: false,
      format: '24h',
      description: 'Time selection input',
      sectionId: 'date-time',
      order: 2,
      step: 15
    },

    // Selection Section
    {
      id: '',
      type: 'dropdown',
      category: 'Selection',
      name: 'Country',
      label: 'Country of Residence',
      required: true,
      options: 'United States,Canada,United Kingdom,Australia,Germany,France,Japan,Other',
      description: 'Single selection dropdown',
      sectionId: 'selection-controls',
      order: 1
    },
    {
      id: '',
      type: 'radioGroup',
      category: 'Selection',
      name: 'Experience Level',
      label: 'Experience Level',
      required: true,
      options: 'Beginner,Intermediate,Advanced,Expert',
      description: 'Single selection radio buttons',
      sectionId: 'selection-controls',
      order: 2,
      layout: 'vertical'
    },
    {
      id: '',
      type: 'checkboxGroup',
      category: 'Selection',
      name: 'Interests',
      label: 'Areas of Interest',
      required: false,
      options: 'Technology,Sports,Music,Travel,Reading,Cooking,Photography,Art',
      description: 'Multiple selection checkboxes',
      sectionId: 'selection-controls',
      order: 3,
      layout: 'vertical',
      maxSelections: 3
    },
    {
      id: '',
      type: 'ratingScale',
      category: 'Selection',
      name: 'Satisfaction Rating',
      label: 'Rate your experience',
      required: false,
      description: 'Star rating scale',
      sectionId: 'selection-controls',
      order: 4,
      scaleType: 'stars',
      maxValue: 5
    },

    // Grid & Matrix Section - THE KEY MISSING CONTROLS
    {
      id: '',
      type: 'singleSelectiveGrid',
      category: 'Grid & Matrix',
      name: 'Service Quality Rating',
      label: 'Rate our services (Single Selection per Row)',
      required: true,
      description: 'Grid with radio button groups - single selection per row',
      sectionId: 'grid-matrix',
      order: 1,
      rowLabels: 'Customer Service,Product Quality,Delivery Speed,Website Experience,Overall Satisfaction',
      columnOptions: 'Excellent,Good,Average,Poor,Very Poor'
    },
    {
      id: '',
      type: 'multiSelectiveGrid',
      category: 'Grid & Matrix',
      name: 'Feature Usage',
      label: 'Which features do you use? (Multiple Selection per Row)',
      required: false,
      description: 'Grid with checkbox groups - multiple selections allowed per row',
      sectionId: 'grid-matrix',
      order: 2,
      rowLabels: 'Mobile App,Web Platform,API Integration,Desktop Software,Browser Extension',
      columnOptions: 'Daily,Weekly,Monthly,Rarely,Never'
    },
    {
      id: '',
      type: 'matrixQuestions',
      category: 'Grid & Matrix',
      name: 'Agreement Survey',
      label: 'Please indicate your level of agreement',
      required: true,
      description: 'Multiple questions with same answer options',
      sectionId: 'grid-matrix',
      order: 3,
      questions: 'I find the product easy to use,The product meets my needs,I would recommend this product,The price is reasonable,Customer support is helpful',
      answers: 'Strongly Agree,Agree,Neutral,Disagree,Strongly Disagree'
    },
    {
      id: '',
      type: 'rankingControl',
      category: 'Grid & Matrix',
      name: 'Priority Ranking',
      label: 'Rank these features by importance',
      required: false,
      description: 'Drag and drop to rank items',
      sectionId: 'grid-matrix',
      order: 4,
      items: 'Performance,Security,User Interface,Customer Support,Price,Documentation'
    },

    // File & Media Section
    {
      id: '',
      type: 'fileUpload',
      category: 'File & Media',
      name: 'Resume Upload',
      label: 'Upload your Resume/CV',
      required: true,
      description: 'File upload with type restrictions',
      sectionId: 'file-media',
      order: 1,
      accept: '.pdf,.doc,.docx',
      maxSize: 10
    },
    {
      id: '',
      type: 'imageUpload',
      category: 'File & Media',
      name: 'Profile Photo',
      label: 'Profile Photo Upload',
      required: false,
      description: 'Image upload with preview',
      sectionId: 'file-media',
      order: 2,
      accept: '.jpg,.jpeg,.png,.gif',
      maxSize: 5
    },
    {
      id: '',
      type: 'signaturePad',
      category: 'File & Media',
      name: 'Digital Signature',
      label: 'Please provide your signature',
      required: true,
      description: 'Digital signature capture',
      sectionId: 'file-media',
      order: 3,
      canvasWidth: 400,
      canvasHeight: 200
    },

    // Layout & Display Section
    {
      id: '',
      type: 'heading',
      category: 'Layout & Display',
      name: 'Section Title',
      label: 'Personal Information Section',
      required: false,
      description: 'Text heading element',
      sectionId: 'layout-display',
      order: 1,
      text: 'Personal Information',
      level: 'h2',
      alignment: 'left',
      fontSize: 'large',
      color: '#1F2937'
    },
    {
      id: '',
      type: 'sectionDivider',
      category: 'Layout & Display',
      name: 'Section Break',
      label: 'Visual Separator',
      required: false,
      description: 'Visual separation lines',
      sectionId: 'layout-display',
      order: 2,
      style: 'solid',
      thickness: 1,
      color: '#e5e7eb',
      spacing: 'medium'
    },

    // Address Section
    {
      id: '',
      type: 'addressLookup',
      category: 'Address',
      name: 'Home Address',
      label: 'Home Address',
      required: true,
      description: 'Address lookup with autocomplete',
      sectionId: 'address',
      order: 1
    },
    {
      id: '',
      type: 'postalCode',
      category: 'Address',
      name: 'ZIP Code',
      label: 'ZIP/Postal Code',
      placeholder: '12345',
      required: true,
      description: 'Postal code with format validation',
      sectionId: 'address',
      order: 2
    },

    // Validation & Security Section
    {
      id: '',
      type: 'captcha',
      category: 'Validation & Security',
      name: 'Security Verification',
      label: 'Please verify you are human',
      required: true,
      description: 'CAPTCHA verification',
      sectionId: 'validation-security',
      order: 1
    },
    {
      id: '',
      type: 'consentCheckbox',
      category: 'Validation & Security',
      name: 'Privacy Consent',
      label: 'I agree to the privacy policy and terms of service',
      required: true,
      description: 'Required consent checkbox',
      sectionId: 'validation-security',
      order: 2
    }
  ];

  // Convert sample data to array format for Excel
  const designData = [
    designHeaders,
    ...sampleData.map(control => designHeaders.map(header => {
      const value = control[header as keyof ExcelControlData];
      if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
      return value || '';
    }))
  ];

  const designSheet = XLSX.utils.aoa_to_sheet(designData);
  
  // Set column widths for better readability
  const columnWidths = designHeaders.map(header => {
    switch (header) {
      case 'id': return { wch: 18 };
      case 'type': return { wch: 20 };
      case 'category': return { wch: 15 };
      case 'name': return { wch: 25 };
      case 'label': return { wch: 25 };
      case 'placeholder': return { wch: 35 };
      case 'options': return { wch: 50 };
      case 'description': return { wch: 40 };
      case 'sectionId': return { wch: 18 };
      case 'rowLabels': return { wch: 50 };
      case 'columnOptions': return { wch: 50 };
      case 'questions': return { wch: 50 };
      case 'answers': return { wch: 50 };
      case 'items': return { wch: 50 };
      default: return { wch: 12 };
    }
  });
  
  designSheet['!cols'] = columnWidths;

  XLSX.utils.book_append_sheet(workbook, designSheet, 'Design');

  // Generate and download the file
  const fileName = `Jumbo_Form_Controls_Template_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

export const parseExcelFile = (file: File): Promise<ExcelControlData[]> => {
  return new Promise((resolve, reject) => {
    console.log('🔄 EXCEL PARSE: ===== STARTING EXCEL FILE PARSING =====');
    console.log('📊 EXCEL PARSE: File details:', {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: new Date(file.lastModified).toISOString()
    });

    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        console.log('📖 EXCEL PARSE: File read successfully, parsing workbook...');
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        console.log('📊 EXCEL PARSE: Workbook details:', {
          sheetNames: workbook.SheetNames,
          sheetCount: workbook.SheetNames.length
        });
        
        // Look for Design sheet
        const designSheetName = workbook.SheetNames.find(name => 
          name.toLowerCase() === 'design'
        );
        
        if (!designSheetName) {
          const error = 'Design sheet not found in the Excel file';
          console.error('❌ EXCEL PARSE:', error);
          reject(new Error(error));
          return;
        }
        
        console.log('✅ EXCEL PARSE: Found Design sheet:', designSheetName);
        
        const worksheet = workbook.Sheets[designSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        console.log('📊 EXCEL PARSE: Raw sheet data:', {
          totalRows: jsonData.length,
          firstRowSample: jsonData[0]
        });
        
        if (jsonData.length < 2) {
          const error = 'No data found in Design sheet';
          console.error('❌ EXCEL PARSE:', error);
          reject(new Error(error));
          return;
        }
        
        const headers = jsonData[0] as string[];
        const rows = jsonData.slice(1) as any[][];
        
        console.log('📊 EXCEL PARSE: Data structure:', {
          headers: headers,
          dataRows: rows.length,
          nonEmptyRows: rows.filter(row => row.some(cell => cell !== undefined && cell !== '')).length
        });
        
        const controls: ExcelControlData[] = rows
          .filter(row => row.some(cell => cell !== undefined && cell !== ''))
          .map((row, index) => {
            console.log(`🔄 EXCEL PARSE: Processing row ${index + 1}:`, row);
            
            const control: any = {};
            
            headers.forEach((header, colIndex) => {
              const value = row[colIndex];
              if (value !== undefined && value !== '') {
                if (header === 'required' || header === 'multiple') {
                  control[header] = value === 'TRUE' || value === true;
                } else if (['order', 'minLength', 'maxLength', 'min', 'max', 'step', 'rows', 'maxSize', 'maxValue', 'canvasWidth', 'canvasHeight'].includes(header)) {
                  control[header] = parseInt(value) || 0;
                } else {
                  control[header] = value;
                }
              }
            });
            
            // Generate guaranteed unique ID with comprehensive uniqueness strategy
            const timestamp = Date.now();
            const randomSuffix = Math.random().toString(36).substring(2, 8);
            const indexSuffix = index.toString().padStart(3, '0');
            const typePrefix = control.type || 'control';
            control.id = `imported-${typePrefix}-${timestamp}-${randomSuffix}-${indexSuffix}`;
            
            // Set defaults
            control.sectionId = control.sectionId || 'default';
            control.order = control.order || index;
            control.required = control.required || false;
            
            console.log(`✅ EXCEL PARSE: Processed control ${index + 1}:`, {
              id: control.id,
              type: control.type,
              name: control.name,
              sectionId: control.sectionId,
              required: control.required
            });
            
            return control;
          });
        
        console.log('✅ EXCEL PARSE: ===== PARSING COMPLETED SUCCESSFULLY =====');
        console.log('📊 EXCEL PARSE: Final results:', {
          totalControls: controls.length,
          controlTypes: Array.from(new Set(controls.map(c => c.type))),
          sections: Array.from(new Set(controls.map(c => c.sectionId))),
          requiredControls: controls.filter(c => c.required).length
        });
        
        resolve(controls);
      } catch (error) {
        console.error('❌ EXCEL PARSE: Parsing failed:', error);
        reject(new Error(`Failed to parse Excel file: ${error}`));
      }
    };
    
    reader.onerror = () => {
      const error = 'Failed to read file';
      console.error('❌ EXCEL PARSE:', error);
      reject(new Error(error));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

export const convertExcelDataToControls = (excelData: ExcelControlData[]): DroppedControl[] => {
  console.log('🔄 EXCEL CONVERT: ===== STARTING DATA CONVERSION =====');
  console.log('📊 EXCEL CONVERT: Input data:', {
    controlCount: excelData.length,
    sampleControl: excelData[0] ? {
      id: excelData[0].id,
      type: excelData[0].type,
      name: excelData[0].name
    } : 'No controls'
  });

  const convertedControls = excelData.map((data, index) => {
    console.log(`🔄 EXCEL CONVERT: Converting control ${index + 1}: ${data.name}`);
    
    // Build properties object from Excel data
    const properties: Record<string, any> = {
      label: data.label || data.name,
      required: data.required || false
    };
    
    // Add type-specific properties with comprehensive logging
    const propertyMappings = [
      'placeholder', 'description', 'options', 'minLength', 'maxLength', 
      'min', 'max', 'step', 'rows', 'accept', 'multiple', 'maxSize', 
      'format', 'layout', 'scaleType', 'maxValue', 'defaultValue', 
      'onLabel', 'offLabel', 'canvasWidth', 'canvasHeight', 'defaultColor', 
      'text', 'level', 'alignment', 'fontSize', 'color', 'style', 
      'thickness', 'spacing', 'rowLabels', 'columnOptions', 'questions', 
      'answers', 'items'
    ];

    propertyMappings.forEach(prop => {
      if (data[prop] !== undefined && data[prop] !== '') {
        properties[prop] = data[prop];
      }
    });
    
    const convertedControl: DroppedControl = {
      id: data.id, // Use the guaranteed unique ID from parsing
      type: data.type,
      name: data.name,
      x: 0,
      y: data.order || index,
      width: 400,
      height: data.type === 'textarea' ? 100 : 50,
      properties,
      sectionId: data.sectionId || 'default'
    };

    console.log(`✅ EXCEL CONVERT: Converted control ${index + 1}:`, {
      id: convertedControl.id,
      type: convertedControl.type,
      name: convertedControl.name,
      sectionId: convertedControl.sectionId,
      propertyCount: Object.keys(properties).length
    });
    
    return convertedControl;
  });

  console.log('✅ EXCEL CONVERT: ===== CONVERSION COMPLETED =====');
  console.log('📊 EXCEL CONVERT: Final results:', {
    convertedCount: convertedControls.length,
    sectionDistribution: convertedControls.reduce((acc, control) => {
      acc[control.sectionId || 'unknown'] = (acc[control.sectionId || 'unknown'] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  });

  return convertedControls;
};