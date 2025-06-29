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
    ['Jumbo No-Code Builder - Control Library Template'],
    [''],
    ['INSTRUCTIONS:'],
    ['1. This template contains all available form controls from the Jumbo No-Code Builder'],
    ['2. Use the "Design" sheet to define your form controls'],
    ['3. Fill in the required columns for each control you want to add'],
    ['4. IMPORTANT: Leave the ID column EMPTY - IDs will be auto-generated during import'],
    ['5. Save the file and import it back into the application'],
    ['6. You can modify controls after import in the Design tab'],
    [''],
    ['AVAILABLE CONTROL CATEGORIES:'],
    ...CONTROL_CATEGORIES.map(category => [category]),
    [''],
    ['AVAILABLE CONTROLS:'],
    ['Category', 'Control Type', 'Control Name', 'Description'],
    ...CONTROLS.map(control => [
      control.category,
      control.type,
      control.name,
      control.description
    ]),
    [''],
    ['COLUMN DESCRIPTIONS:'],
    ['id: LEAVE EMPTY - Unique identifier will be auto-generated'],
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
    'spacing'
  ];

  const sampleData: ExcelControlData[] = [
    // Personal Information Section
    {
      id: '', // ALWAYS EMPTY for auto-generation
      type: 'textInput',
      category: 'Core Input',
      name: 'Full Name',
      label: 'Full Name',
      placeholder: 'Enter your complete legal name',
      required: true,
      description: 'Required for identification purposes',
      sectionId: 'personal-info',
      order: 1,
      maxLength: 100
    },
    {
      id: '', // ALWAYS EMPTY for auto-generation
      type: 'emailInput',
      category: 'Core Input',
      name: 'Email Address',
      label: 'Email Address',
      placeholder: 'your.email@example.com',
      required: true,
      description: 'Primary contact email - required for account creation',
      sectionId: 'personal-info',
      order: 2
    },
    {
      id: '', // ALWAYS EMPTY for auto-generation
      type: 'phoneInput',
      category: 'Core Input',
      name: 'Phone Number',
      label: 'Phone Number',
      placeholder: '(555) 123-4567',
      required: false,
      description: 'Optional backup contact method',
      sectionId: 'personal-info',
      order: 3
    },
    {
      id: '', // ALWAYS EMPTY for auto-generation
      type: 'datePicker',
      category: 'Date & Time',
      name: 'Date of Birth',
      label: 'Date of Birth',
      required: true,
      format: 'YYYY-MM-DD',
      description: 'Required for age verification',
      sectionId: 'personal-info',
      order: 4
    },
    {
      id: '', // ALWAYS EMPTY for auto-generation
      type: 'radioGroup',
      category: 'Selection',
      name: 'Gender',
      label: 'Gender',
      required: false,
      options: 'Male,Female,Non-binary,Prefer not to say',
      layout: 'horizontal',
      description: 'Optional demographic information',
      sectionId: 'personal-info',
      order: 5
    },

    // Address Information Section
    {
      id: '', // ALWAYS EMPTY for auto-generation
      type: 'completeAddress',
      category: 'Address',
      name: 'Home Address',
      label: 'Home Address',
      required: true,
      includeAddressLine2: true,
      defaultCountry: 'US',
      description: 'Complete mailing address required for shipping',
      sectionId: 'address-info',
      order: 1
    },

    // Professional Information Section
    {
      id: '', // ALWAYS EMPTY for auto-generation
      type: 'textInput',
      category: 'Core Input',
      name: 'Company Name',
      label: 'Company/Organization',
      placeholder: 'Enter your company name',
      required: false,
      description: 'Current employer or organization',
      sectionId: 'professional-info',
      order: 1,
      maxLength: 150
    },
    {
      id: '', // ALWAYS EMPTY for auto-generation
      type: 'textInput',
      category: 'Core Input',
      name: 'Job Title',
      label: 'Job Title',
      placeholder: 'e.g., Software Engineer, Manager',
      required: false,
      description: 'Your current position or role',
      sectionId: 'professional-info',
      order: 2,
      maxLength: 100
    },
    {
      id: '', // ALWAYS EMPTY for auto-generation
      type: 'dropdown',
      category: 'Selection',
      name: 'Experience Level',
      label: 'Years of Experience',
      required: true,
      options: 'Less than 1 year,1-2 years,3-5 years,6-10 years,11-15 years,More than 15 years',
      description: 'Total years of professional experience',
      sectionId: 'professional-info',
      order: 3
    },
    {
      id: '', // ALWAYS EMPTY for auto-generation
      type: 'checkboxGroup',
      category: 'Selection',
      name: 'Technical Skills',
      label: 'Technical Skills',
      required: false,
      options: 'JavaScript,Python,Java,C++,React,Angular,Vue.js,Node.js,SQL,MongoDB,AWS,Docker',
      layout: 'vertical',
      description: 'Select all technologies you are proficient in',
      sectionId: 'professional-info',
      order: 4
    },
    {
      id: '', // ALWAYS EMPTY for auto-generation
      type: 'numberInput',
      category: 'Core Input',
      name: 'Expected Salary',
      label: 'Expected Annual Salary (USD)',
      required: false,
      min: 30000,
      max: 500000,
      step: 1000,
      description: 'Optional salary expectation',
      sectionId: 'professional-info',
      order: 5
    },

    // Preferences Section
    {
      id: '', // ALWAYS EMPTY for auto-generation
      type: 'toggleSwitch',
      category: 'Selection',
      name: 'Remote Work',
      label: 'Open to Remote Work',
      required: false,
      onLabel: 'Yes',
      offLabel: 'No',
      defaultValue: false,
      description: 'Willing to work remotely',
      sectionId: 'preferences',
      order: 1
    },
    {
      id: '', // ALWAYS EMPTY for auto-generation
      type: 'slider',
      category: 'Selection',
      name: 'Travel Willingness',
      label: 'Willingness to Travel (%)',
      required: false,
      min: 0,
      max: 100,
      step: 5,
      defaultValue: 25,
      description: 'Percentage of time willing to travel for work',
      sectionId: 'preferences',
      order: 2
    },
    {
      id: '', // ALWAYS EMPTY for auto-generation
      type: 'ratingScale',
      category: 'Selection',
      name: 'Interest Level',
      label: 'Interest in this Position',
      required: true,
      scaleType: 'stars',
      maxValue: 5,
      description: 'Rate your interest level (required)',
      sectionId: 'preferences',
      order: 3
    },
    {
      id: '', // ALWAYS EMPTY for auto-generation
      type: 'dateRangePicker',
      category: 'Date & Time',
      name: 'Availability',
      label: 'Available Start Date Range',
      required: false,
      format: 'YYYY-MM-DD',
      description: 'When you could potentially start',
      sectionId: 'preferences',
      order: 4
    },

    // Additional Information Section
    {
      id: '', // ALWAYS EMPTY for auto-generation
      type: 'fileUpload',
      category: 'File & Media',
      name: 'Resume Upload',
      label: 'Upload Resume',
      required: true,
      accept: '.pdf,.doc,.docx',
      multiple: false,
      maxSize: 10,
      description: 'Required: Upload your current resume (PDF or Word)',
      sectionId: 'additional-info',
      order: 1
    },
    {
      id: '', // ALWAYS EMPTY for auto-generation
      type: 'urlInput',
      category: 'Core Input',
      name: 'Portfolio URL',
      label: 'Portfolio/LinkedIn URL',
      placeholder: 'https://www.linkedin.com/in/yourname',
      required: false,
      description: 'Link to your professional portfolio or LinkedIn profile',
      sectionId: 'additional-info',
      order: 2
    },
    {
      id: '', // ALWAYS EMPTY for auto-generation
      type: 'textarea',
      category: 'Core Input',
      name: 'Cover Letter',
      label: 'Cover Letter / Additional Information',
      placeholder: 'Tell us why you are interested in this position...',
      required: false,
      rows: 6,
      maxLength: 1000,
      description: 'Optional cover letter or additional information',
      sectionId: 'additional-info',
      order: 3
    },
    {
      id: '', // ALWAYS EMPTY for auto-generation
      type: 'termsConditions',
      category: 'Validation & Security',
      name: 'Terms Agreement',
      label: 'Terms and Conditions',
      required: true,
      text: 'I agree to the terms and conditions and privacy policy',
      linkText: 'View Terms',
      linkUrl: '/terms',
      description: 'Required: Must agree to terms to proceed',
      sectionId: 'additional-info',
      order: 4
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
          controlTypes: [...new Set(controls.map(c => c.type))],
          sections: [...new Set(controls.map(c => c.sectionId))],
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
      'thickness', 'spacing'
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