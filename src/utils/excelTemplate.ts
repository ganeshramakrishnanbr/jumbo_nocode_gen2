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
    ['4. Save the file and import it back into the application'],
    ['5. You can modify controls after import in the Design tab'],
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
    ['id: Unique identifier (auto-generated if empty)'],
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
    ['- Use description field to explain why field is required']
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
      id: 'personal-name',
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
      id: 'personal-email',
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
      id: 'personal-phone',
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
      id: 'personal-dob',
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
      id: 'personal-gender',
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
      id: 'address-complete',
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
      id: 'prof-company',
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
      id: 'prof-title',
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
      id: 'prof-experience',
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
      id: 'prof-skills',
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
      id: 'prof-salary',
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
      id: 'pref-remote',
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
      id: 'pref-travel',
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
      id: 'pref-rating',
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
      id: 'pref-start',
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
      id: 'additional-resume',
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
      id: 'additional-portfolio',
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
      id: 'additional-cover',
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
      id: 'additional-terms',
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
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Look for Design sheet
        const designSheetName = workbook.SheetNames.find(name => 
          name.toLowerCase() === 'design'
        );
        
        if (!designSheetName) {
          reject(new Error('Design sheet not found in the Excel file'));
          return;
        }
        
        const worksheet = workbook.Sheets[designSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length < 2) {
          reject(new Error('No data found in Design sheet'));
          return;
        }
        
        const headers = jsonData[0] as string[];
        const rows = jsonData.slice(1) as any[][];
        
        const controls: ExcelControlData[] = rows
          .filter(row => row.some(cell => cell !== undefined && cell !== ''))
          .map((row, index) => {
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
            
            // Generate ID if not provided
            if (!control.id) {
              control.id = `imported-${control.type || 'control'}-${Date.now()}-${index}`;
            }
            
            // Set defaults
            control.sectionId = control.sectionId || 'default';
            control.order = control.order || index;
            control.required = control.required || false;
            
            return control;
          });
        
        resolve(controls);
      } catch (error) {
        reject(new Error(`Failed to parse Excel file: ${error}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

export const convertExcelDataToControls = (excelData: ExcelControlData[]): DroppedControl[] => {
  return excelData.map(data => {
    // Build properties object from Excel data
    const properties: Record<string, any> = {
      label: data.label || data.name,
      required: data.required || false
    };
    
    // Add type-specific properties
    if (data.placeholder) properties.placeholder = data.placeholder;
    if (data.description) properties.description = data.description;
    if (data.options) properties.options = data.options;
    if (data.minLength) properties.minLength = data.minLength;
    if (data.maxLength) properties.maxLength = data.maxLength;
    if (data.min !== undefined) properties.min = data.min;
    if (data.max !== undefined) properties.max = data.max;
    if (data.step) properties.step = data.step;
    if (data.rows) properties.rows = data.rows;
    if (data.accept) properties.accept = data.accept;
    if (data.multiple !== undefined) properties.multiple = data.multiple;
    if (data.maxSize) properties.maxSize = data.maxSize;
    if (data.format) properties.format = data.format;
    if (data.layout) properties.layout = data.layout;
    if (data.scaleType) properties.scaleType = data.scaleType;
    if (data.maxValue) properties.maxValue = data.maxValue;
    if (data.defaultValue !== undefined) properties.defaultValue = data.defaultValue;
    if (data.onLabel) properties.onLabel = data.onLabel;
    if (data.offLabel) properties.offLabel = data.offLabel;
    if (data.canvasWidth) properties.canvasWidth = data.canvasWidth;
    if (data.canvasHeight) properties.canvasHeight = data.canvasHeight;
    if (data.defaultColor) properties.defaultColor = data.defaultColor;
    if (data.text) properties.text = data.text;
    if (data.level) properties.level = data.level;
    if (data.alignment) properties.alignment = data.alignment;
    if (data.fontSize) properties.fontSize = data.fontSize;
    if (data.color) properties.color = data.color;
    if (data.style) properties.style = data.style;
    if (data.thickness) properties.thickness = data.thickness;
    if (data.spacing) properties.spacing = data.spacing;
    
    return {
      id: data.id,
      type: data.type,
      name: data.name,
      x: 0,
      y: data.order || 0,
      width: 400,
      height: data.type === 'textarea' ? 100 : 50,
      properties,
      sectionId: data.sectionId || 'default'
    };
  });
};