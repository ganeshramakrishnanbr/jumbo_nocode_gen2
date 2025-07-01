# 10 - Excel Import and Template System

This prompt creates the comprehensive Excel import system with template generation and bulk form creation.

## Visual Design Requirements

### Import Modal Design
- **Modal Size**: 700px width with responsive height and scrolling
- **Upload Area**: Drag-and-drop zone with visual feedback and progress indicators
- **Preview Table**: Clean data table with column mapping and validation
- **Error Handling**: Inline error display with correction suggestions
- **Progress Tracking**: Step-by-step import process with visual indicators

### Template Generation
- **Column Headers**: Predefined structure with control types and properties
- **Sample Data**: Example rows showing proper formatting
- **Validation Rules**: Clear documentation of data formats and constraints
- **Download Options**: Multiple template formats for different use cases

## AI Prompt

```
Create a comprehensive Excel import system with template generation using the following exact specifications:

VISUAL DESIGN STANDARDS:

Import Modal Styling:
- Modal: 700px width with clean white background and subtle shadows
- Upload zone: Dashed border with hover effects and file type indicators
- Preview table: Striped rows with header highlighting and scroll support
- Progress bars: Blue accent with smooth animations and percentage display
- Error states: Red highlighting with clear error messages and suggestions

Template Structure:
- Control columns: Type, Name, Label, Placeholder, Required, Validation
- Section columns: Section Name, Section Color, Section Order
- Property columns: Dynamic based on control type with proper validation
- Sample data: Professional examples with realistic form scenarios

EXCEL IMPORT MODAL (client/src/components/ExcelImportModal.tsx):
```typescript
import React, { useState, useCallback, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

import { 
  Upload, Download, CheckCircle2, AlertCircle, XCircle,
  FileSpreadsheet, Eye, RefreshCw, FileDown, ArrowRight
} from 'lucide-react';

import * as XLSX from 'xlsx';
import type { DroppedControl } from '@shared/types';

interface ExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (controls: DroppedControl[]) => void;
}

interface ImportStep {
  id: string;
  title: string;
  completed: boolean;
  error?: string;
}

interface ParsedRow {
  rowIndex: number;
  data: Record<string, any>;
  errors: string[];
  warnings: string[];
  control?: DroppedControl;
}

export const ExcelImportModal: React.FC<ExcelImportModalProps> = ({
  isOpen,
  onClose,
  onImport
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResults, setImportResults] = useState<{
    success: number;
    errors: number;
    warnings: number;
    details: ParsedRow[];
  } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  const steps: ImportStep[] = [
    { id: 'upload', title: 'Upload File', completed: false },
    { id: 'parse', title: 'Parse Data', completed: false },
    { id: 'validate', title: 'Validate Controls', completed: false },
    { id: 'import', title: 'Import Controls', completed: false }
  ];

  const generateTemplate = useCallback(() => {
    const template = [
      {
        'Control Type': 'text',
        'Control Name': 'First Name',
        'Label': 'First Name',
        'Placeholder': 'Enter your first name',
        'Required': 'TRUE',
        'Help Text': 'Please enter your first name',
        'Section Name': 'Personal Information',
        'Section Color': '#3b82f6',
        'Section Order': '1',
        'Max Length': '50',
        'Validation Pattern': '',
        'Default Value': ''
      },
      {
        'Control Type': 'text',
        'Control Name': 'Last Name',
        'Label': 'Last Name',
        'Placeholder': 'Enter your last name',
        'Required': 'TRUE',
        'Help Text': 'Please enter your last name',
        'Section Name': 'Personal Information',
        'Section Color': '#3b82f6',
        'Section Order': '1',
        'Max Length': '50',
        'Validation Pattern': '',
        'Default Value': ''
      },
      {
        'Control Type': 'email',
        'Control Name': 'Email Address',
        'Label': 'Email Address',
        'Placeholder': 'your@email.com',
        'Required': 'TRUE',
        'Help Text': 'We will use this to contact you',
        'Section Name': 'Contact Information',
        'Section Color': '#10b981',
        'Section Order': '2',
        'Max Length': '',
        'Validation Pattern': '',
        'Default Value': ''
      },
      {
        'Control Type': 'number',
        'Control Name': 'Age',
        'Label': 'Age',
        'Placeholder': '25',
        'Required': 'FALSE',
        'Help Text': 'Please enter your age',
        'Section Name': 'Personal Information',
        'Section Color': '#3b82f6',
        'Section Order': '1',
        'Max Length': '',
        'Validation Pattern': '',
        'Default Value': '',
        'Min Value': '18',
        'Max Value': '120'
      },
      {
        'Control Type': 'select',
        'Control Name': 'Country',
        'Label': 'Country',
        'Placeholder': 'Select your country',
        'Required': 'TRUE',
        'Help Text': 'Choose your country of residence',
        'Section Name': 'Contact Information',
        'Section Color': '#10b981',
        'Section Order': '2',
        'Max Length': '',
        'Validation Pattern': '',
        'Default Value': '',
        'Options': 'United States|US,Canada|CA,United Kingdom|UK,Australia|AU'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Form Controls');
    
    // Download the file
    XLSX.writeFile(workbook, 'form-template.xlsx');
  }, []);

  const handleFileUpload = useCallback((uploadedFile: File) => {
    if (!uploadedFile.name.match(/\.(xlsx|xls)$/)) {
      alert('Please upload an Excel file (.xlsx or .xls)');
      return;
    }

    setFile(uploadedFile);
    setCurrentStep(1);
    parseExcelFile(uploadedFile);
  }, []);

  const parseExcelFile = useCallback(async (file: File) => {
    setIsProcessing(true);
    
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      if (jsonData.length < 2) {
        throw new Error('Excel file must contain at least a header row and one data row');
      }

      const headers = jsonData[0] as string[];
      const rows = jsonData.slice(1) as any[][];
      
      const parsed: ParsedRow[] = rows.map((row, index) => {
        const rowData: Record<string, any> = {};
        const errors: string[] = [];
        const warnings: string[] = [];
        
        headers.forEach((header, colIndex) => {
          rowData[header] = row[colIndex] || '';
        });

        // Validate required fields
        if (!rowData['Control Type']) {
          errors.push('Control Type is required');
        }
        
        if (!rowData['Control Name']) {
          errors.push('Control Name is required');
        }
        
        if (!rowData['Label']) {
          warnings.push('Label is recommended');
        }

        // Validate control type
        const validTypes = [
          'text', 'textarea', 'number', 'email', 'password', 'url',
          'date', 'time', 'datetime', 'select', 'multiselect', 'radio',
          'checkbox', 'file', 'image', 'rating', 'slider', 'toggle',
          'color', 'tags'
        ];
        
        if (rowData['Control Type'] && !validTypes.includes(rowData['Control Type'])) {
          errors.push(`Invalid control type: ${rowData['Control Type']}`);
        }

        // Validate boolean fields
        ['Required'].forEach(field => {
          if (rowData[field] && !['TRUE', 'FALSE', 'true', 'false', '1', '0'].includes(String(rowData[field]))) {
            warnings.push(`${field} should be TRUE/FALSE`);
          }
        });

        // Validate numeric fields
        ['Section Order', 'Max Length', 'Min Value', 'Max Value'].forEach(field => {
          if (rowData[field] && isNaN(Number(rowData[field]))) {
            errors.push(`${field} must be a number`);
          }
        });

        return {
          rowIndex: index + 2, // +2 because index starts at 0 and we skip header
          data: rowData,
          errors,
          warnings
        };
      });

      setParsedData(parsed);
      setCurrentStep(2);
      validateAndCreateControls(parsed);
      
    } catch (error) {
      console.error('Error parsing Excel file:', error);
      alert(`Error parsing file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const validateAndCreateControls = useCallback((rows: ParsedRow[]) => {
    const validRows = rows.filter(row => row.errors.length === 0);
    const sectionsMap = new Map<string, { id: string; color: string; order: number }>();
    
    // Create sections first
    validRows.forEach(row => {
      const sectionName = row.data['Section Name'];
      const sectionColor = row.data['Section Color'] || '#3b82f6';
      const sectionOrder = parseInt(row.data['Section Order']) || 1;
      
      if (sectionName && !sectionsMap.has(sectionName)) {
        sectionsMap.set(sectionName, {
          id: `section_${sectionName.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
          color: sectionColor,
          order: sectionOrder
        });
      }
    });

    // Create controls
    const controls: DroppedControl[] = validRows.map((row, index) => {
      const data = row.data;
      const sectionName = data['Section Name'];
      const sectionId = sectionName ? sectionsMap.get(sectionName)?.id : undefined;
      
      // Parse options for select/radio/checkbox controls
      let options: any[] = [];
      if (data['Options'] && ['select', 'multiselect', 'radio', 'checkbox'].includes(data['Control Type'])) {
        options = data['Options'].split(',').map((option: string) => {
          const [label, value] = option.split('|');
          return { label: label.trim(), value: (value || label).trim() };
        });
      }

      const control: DroppedControl = {
        id: `control_${Date.now()}_${index}`,
        type: data['Control Type'],
        name: data['Control Name'],
        questionnaireId: 'default-questionnaire',
        sectionId,
        x: 0,
        y: index * 100,
        width: 12,
        height: 1,
        properties: {
          label: data['Label'] || data['Control Name'],
          placeholder: data['Placeholder'] || '',
          required: ['TRUE', 'true', '1'].includes(String(data['Required'])),
          helpText: data['Help Text'] || '',
          ...(data['Max Length'] && { maxLength: parseInt(data['Max Length']) }),
          ...(data['Min Value'] && { min: parseFloat(data['Min Value']) }),
          ...(data['Max Value'] && { max: parseFloat(data['Max Value']) }),
          ...(data['Validation Pattern'] && { pattern: data['Validation Pattern'] }),
          ...(data['Default Value'] && { defaultValue: data['Default Value'] }),
          ...(options.length > 0 && { options })
        }
      };

      row.control = control;
      return control;
    });

    setCurrentStep(3);
    
    // Simulate import process
    setTimeout(() => {
      setImportResults({
        success: controls.length,
        errors: rows.filter(r => r.errors.length > 0).length,
        warnings: rows.filter(r => r.warnings.length > 0).length,
        details: rows
      });
      setCurrentStep(4);
      
      if (controls.length > 0) {
        onImport(controls);
      }
    }, 1000);
  }, [onImport]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const resetModal = useCallback(() => {
    setCurrentStep(0);
    setFile(null);
    setParsedData([]);
    setImportResults(null);
    setIsProcessing(false);
  }, []);

  const handleClose = useCallback(() => {
    resetModal();
    onClose();
  }, [resetModal, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileSpreadsheet className="h-5 w-5 text-green-600" />
            <span>Excel Import</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${index <= currentStep 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-slate-200 text-slate-500'
                  }
                `}>
                  {index < currentStep ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`
                    w-16 h-0.5 mx-2
                    ${index < currentStep ? 'bg-blue-500' : 'bg-slate-200'}
                  `} />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <ScrollArea className="max-h-[500px]">
            {currentStep === 0 && (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Upload an Excel file with your form controls, or download our template to get started.
                  </p>
                  
                  <div className="flex justify-center space-x-4 mb-6">
                    <Button onClick={generateTemplate} variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download Template
                    </Button>
                  </div>
                </div>

                {/* Upload Zone */}
                <div
                  ref={dragRef}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors"
                >
                  <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                    Drop your Excel file here
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    or click to browse (.xlsx, .xls)
                  </p>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                  >
                    Choose File
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                    className="hidden"
                  />
                </div>

                {/* Template Information */}
                <Card>
                  <CardHeader>
                    <h4 className="font-medium flex items-center space-x-2">
                      <FileSpreadsheet className="h-4 w-4" />
                      <span>Template Format</span>
                    </h4>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p><strong>Required Columns:</strong> Control Type, Control Name</p>
                    <p><strong>Optional Columns:</strong> Label, Placeholder, Required, Help Text, Section Name, Section Color</p>
                    <p><strong>Control Types:</strong> text, email, number, select, radio, checkbox, file, etc.</p>
                    <p><strong>Boolean Values:</strong> Use TRUE/FALSE for Required field</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {currentStep === 1 && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
                </div>
                <h3 className="text-lg font-medium">Parsing Excel File</h3>
                <p className="text-slate-600">Processing your file and extracting form controls...</p>
              </div>
            )}

            {currentStep >= 2 && parsedData.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-medium">Import Preview</h3>
                
                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-3 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {parsedData.filter(r => r.errors.length === 0).length}
                      </div>
                      <div className="text-sm text-slate-600">Valid Controls</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3 text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {parsedData.filter(r => r.errors.length > 0).length}
                      </div>
                      <div className="text-sm text-slate-600">Errors</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3 text-center">
                      <div className="text-2xl font-bold text-amber-600">
                        {parsedData.filter(r => r.warnings.length > 0).length}
                      </div>
                      <div className="text-sm text-slate-600">Warnings</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Data Table */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="max-h-64 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 sticky top-0">
                        <tr>
                          <th className="p-2 text-left">Row</th>
                          <th className="p-2 text-left">Control</th>
                          <th className="p-2 text-left">Type</th>
                          <th className="p-2 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parsedData.map((row) => (
                          <tr key={row.rowIndex} className="border-t">
                            <td className="p-2">{row.rowIndex}</td>
                            <td className="p-2 font-medium">
                              {row.data['Control Name'] || 'Unnamed'}
                            </td>
                            <td className="p-2">
                              <Badge variant="outline">
                                {row.data['Control Type'] || 'Unknown'}
                              </Badge>
                            </td>
                            <td className="p-2">
                              {row.errors.length > 0 ? (
                                <Badge variant="destructive">Error</Badge>
                              ) : row.warnings.length > 0 ? (
                                <Badge variant="secondary">Warning</Badge>
                              ) : (
                                <Badge variant="default">Valid</Badge>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && importResults && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-medium">Import Complete!</h3>
                <div className="space-y-2">
                  <p className="text-green-600">
                    Successfully imported {importResults.success} controls
                  </p>
                  {importResults.errors > 0 && (
                    <p className="text-red-600">
                      {importResults.errors} rows had errors and were skipped
                    </p>
                  )}
                  {importResults.warnings > 0 && (
                    <p className="text-amber-600">
                      {importResults.warnings} rows had warnings
                    </p>
                  )}
                </div>
                
                <div className="flex justify-center space-x-4">
                  <Button onClick={handleClose}>
                    Close
                  </Button>
                  <Button onClick={resetModal} variant="outline">
                    Import Another File
                  </Button>
                </div>
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};
```

Create a comprehensive Excel import system with template generation, data validation, error handling, and bulk form control creation with proper section organization.
```