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
    ['See the "Design" sheet for sample data and examples']
  ];

  const instructionsSheet = XLSX.utils.aoa_to_sheet(instructionsData);
  XLSX.utils.book_append_sheet(workbook, instructionsSheet, 'Instructions');

  // Design Sheet with Sample Data
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
    {
      id: 'sample-text-1',
      type: 'textInput',
      category: 'Core Input',
      name: 'Full Name',
      label: 'Full Name',
      placeholder: 'Enter your full name',
      required: true,
      description: 'Please enter your complete name',
      sectionId: 'default',
      order: 1,
      maxLength: 100
    },
    {
      id: 'sample-email-1',
      type: 'emailInput',
      category: 'Core Input',
      name: 'Email Address',
      label: 'Email Address',
      placeholder: 'Enter your email address',
      required: true,
      description: 'We will use this to contact you',
      sectionId: 'default',
      order: 2
    },
    {
      id: 'sample-phone-1',
      type: 'phoneInput',
      category: 'Core Input',
      name: 'Phone Number',
      label: 'Phone Number',
      placeholder: '(555) 123-4567',
      required: false,
      description: 'Optional contact number',
      sectionId: 'default',
      order: 3
    },
    {
      id: 'sample-dropdown-1',
      type: 'dropdown',
      category: 'Selection',
      name: 'Country',
      label: 'Country',
      required: true,
      options: 'United States,Canada,United Kingdom,Australia,Germany,France,Japan',
      description: 'Select your country',
      sectionId: 'default',
      order: 4
    },
    {
      id: 'sample-radio-1',
      type: 'radioGroup',
      category: 'Selection',
      name: 'Gender',
      label: 'Gender',
      required: false,
      options: 'Male,Female,Other,Prefer not to say',
      layout: 'horizontal',
      description: 'Optional demographic information',
      sectionId: 'default',
      order: 5
    },
    {
      id: 'sample-checkbox-1',
      type: 'checkboxGroup',
      category: 'Selection',
      name: 'Interests',
      label: 'Areas of Interest',
      required: false,
      options: 'Technology,Sports,Music,Travel,Reading,Cooking,Art,Gaming',
      layout: 'vertical',
      description: 'Select all that apply',
      sectionId: 'default',
      order: 6
    },
    {
      id: 'sample-textarea-1',
      type: 'textarea',
      category: 'Core Input',
      name: 'Comments',
      label: 'Additional Comments',
      placeholder: 'Please share any additional information...',
      required: false,
      rows: 4,
      maxLength: 500,
      description: 'Optional feedback or comments',
      sectionId: 'default',
      order: 7
    },
    {
      id: 'sample-date-1',
      type: 'datePicker',
      category: 'Date & Time',
      name: 'Birth Date',
      label: 'Date of Birth',
      required: false,
      format: 'YYYY-MM-DD',
      description: 'Optional birth date',
      sectionId: 'default',
      order: 8
    },
    {
      id: 'sample-rating-1',
      type: 'ratingScale',
      category: 'Selection',
      name: 'Satisfaction',
      label: 'Overall Satisfaction',
      required: false,
      scaleType: 'stars',
      maxValue: 5,
      description: 'Rate your experience',
      sectionId: 'default',
      order: 9
    },
    {
      id: 'sample-file-1',
      type: 'fileUpload',
      category: 'File & Media',
      name: 'Resume',
      label: 'Upload Resume',
      required: false,
      accept: '.pdf,.doc,.docx',
      multiple: false,
      maxSize: 10,
      description: 'Upload your resume (PDF or Word format)',
      sectionId: 'default',
      order: 10
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
      case 'id': return { wch: 15 };
      case 'type': return { wch: 18 };
      case 'category': return { wch: 15 };
      case 'name': return { wch: 20 };
      case 'label': return { wch: 20 };
      case 'placeholder': return { wch: 25 };
      case 'options': return { wch: 40 };
      case 'description': return { wch: 30 };
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