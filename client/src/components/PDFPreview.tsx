import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, Settings, Download, ZoomIn, ZoomOut, RotateCcw, 
  Palette, Layout, Eye, Copy, Save, RefreshCw, Maximize2,
  ChevronDown, ChevronRight, Image, Type, AlignCenter, Upload,
  FileImage, CheckSquare, Shuffle
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { DroppedControl, Section, CustomerTier, PDFCustomization, PDFExportSettings } from '../types';
import { PDF_TEMPLATES, getAvailableTemplates, getDefaultCustomization } from '../data/pdfTemplates';
import { useFormValues } from '../hooks/useFormValues';

interface PDFPreviewProps {
  droppedControls: DroppedControl[];
  sections: Section[];
  currentTier: CustomerTier;
  formValues?: { [controlId: string]: any };
  onFormValueChange?: (controlId: string, value: any) => void;
}

export const PDFPreview: React.FC<PDFPreviewProps> = ({
  droppedControls,
  sections,
  currentTier,
  formValues = {},
  onFormValueChange
}) => {
  const [availableTemplates] = useState(() => getAvailableTemplates(currentTier));
  const [selectedTemplate, setSelectedTemplate] = useState(availableTemplates[0]);
  const [customization, setCustomization] = useState(() => 
    getDefaultCustomization(selectedTemplate)
  );
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCustomization, setShowCustomization] = useState(true);
  const [activePanel, setActivePanel] = useState<'header' | 'footer' | 'content' | 'page'>('content');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Local form values management
  const { formValues: localFormValues, generateSampleData, updateFormValue } = useFormValues();
  const effectiveFormValues = { ...localFormValues, ...formValues };
  
  const previewRef = useRef<HTMLDivElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Update customization when template changes
  useEffect(() => {
    if (selectedTemplate) {
      setCustomization(getDefaultCustomization(selectedTemplate));
    }
  }, [selectedTemplate]);

  const handleTemplateChange = (templateId: string) => {
    const template = availableTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
    }
  };

  const updateCustomization = (section: keyof PDFCustomization, field: string, value: any) => {
    setCustomization(prev => {
      if (section === 'header') {
        return { ...prev, header: { ...prev.header, [field]: value } };
      } else if (section === 'footer') {
        return { ...prev, footer: { ...prev.footer, [field]: value } };
      } else if (section === 'content') {
        return { ...prev, content: { ...prev.content, [field]: value } };
      } else if (section === 'page') {
        return { ...prev, page: { ...prev.page, [field]: value } };
      }
      return prev;
    });
  };

  const handleZoom = (delta: number) => {
    setZoom(prev => Math.max(25, Math.min(200, prev + delta)));
  };

  const resetZoom = () => setZoom(100);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const logoUrl = e.target?.result as string;
        updateCustomization('header', 'logoUrl', logoUrl);
        updateCustomization('header', 'showLogo', true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateSampleData = () => {
    generateSampleData(droppedControls);
  };

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      if (!previewRef.current) return;

      // Create PDF
      const pdf = new jsPDF({
        orientation: customization.page.orientation,
        unit: 'mm',
        format: customization.page.size.toLowerCase() as any
      });

      if (customization.page.sectionPageBreaks && sections.length > 0) {
        // Generate PDF with page breaks for sections
        await generatePDFWithPageBreaks(pdf);
      } else {
        // Generate single-page PDF
        const canvas = await html2canvas(previewRef.current, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pdf.internal.pageSize.getWidth();
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      }
      
      // Add metadata
      pdf.setProperties({
        title: customization.header.title,
        author: 'Jumbo No-Code Form Builder',
        subject: 'Form PDF Export',
        keywords: 'form, survey, pdf',
        creator: 'Jumbo No-Code Form Builder'
      });

      // Download PDF
      pdf.save(`${customization.header.title.replace(/\s+/g, '-').toLowerCase()}.pdf`);
    } catch (error) {
      console.error('PDF generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generatePDFWithPageBreaks = async (pdf: jsPDF) => {
    // Implementation for section-based page breaks
    // This is a simplified version - in production, you'd want more sophisticated layout
    
    for (let i = 0; i < sections.length; i++) {
      if (i > 0) {
        pdf.addPage();
      }
      
      // Add header to each page
      if (customization.header.showLogo && customization.header.logoUrl) {
        // Add logo (simplified)
        pdf.setFontSize(16);
        pdf.text('Logo', 20, 20);
      }
      
      if (customization.header.title) {
        pdf.setFontSize(18);
        pdf.text(customization.header.title, 20, customization.header.showLogo ? 35 : 20);
      }
      
      // Add section content
      const section = sections[i];
      const sectionControls = droppedControls.filter(control => control.sectionId === section.id);
      
      pdf.setFontSize(14);
      pdf.text(section.name, 20, 50);
      
      let yPosition = 65;
      sectionControls.forEach(control => {
        const value = effectiveFormValues[control.id] || '';
        pdf.setFontSize(12);
        pdf.text(`${control.properties.label || control.name}:`, 20, yPosition);
        pdf.text(String(value), 20, yPosition + 5);
        yPosition += 15;
      });
      
      // Add footer
      if (customization.footer.showPageNumbers) {
        pdf.setFontSize(10);
        pdf.text(`Page ${i + 1} of ${sections.length}`, 20, pdf.internal.pageSize.getHeight() - 20);
      }
      
      if (customization.footer.customNote) {
        pdf.text(customization.footer.customNote, 20, pdf.internal.pageSize.getHeight() - 10);
      }
    }
  };

  const renderControl = (control: DroppedControl) => {
    const baseClasses = "mb-4 p-3 border border-gray-200 rounded-lg";
    const value = effectiveFormValues[control.id];
    const hasValue = value !== undefined && value !== null && value !== '';
    
    switch (control.type) {
      case 'text':
        return (
          <div key={control.id} className={baseClasses}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {control.properties.label || control.name}
              {control.properties.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className={`w-full p-2 border border-gray-300 rounded ${hasValue ? 'bg-blue-50 text-gray-900 font-medium' : 'bg-gray-50 text-gray-600'}`}>
              {hasValue ? value : (control.properties.placeholder || 'Text input field')}
            </div>
          </div>
        );
      
      case 'email':
        return (
          <div key={control.id} className={baseClasses}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {control.properties.label || control.name}
              {control.properties.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className={`w-full p-2 border border-gray-300 rounded ${hasValue ? 'bg-blue-50 text-gray-900 font-medium' : 'bg-gray-50 text-gray-600'}`}>
              {hasValue ? value : (control.properties.placeholder || 'email@example.com')}
            </div>
          </div>
        );
      
      case 'textarea':
        return (
          <div key={control.id} className={baseClasses}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {control.properties.label || control.name}
              {control.properties.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className={`w-full p-2 border border-gray-300 rounded h-20 ${hasValue ? 'bg-blue-50 text-gray-900 font-medium' : 'bg-gray-50 text-gray-600'}`}>
              {hasValue ? value : (control.properties.placeholder || 'Multi-line text area')}
            </div>
          </div>
        );
      
      case 'select':
        return (
          <div key={control.id} className={baseClasses}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {control.properties.label || control.name}
              {control.properties.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className={`w-full p-2 border border-gray-300 rounded ${hasValue ? 'bg-blue-50 text-gray-900 font-medium' : 'bg-gray-50 text-gray-600'}`}>
              {hasValue ? value : (control.properties.placeholder || 'Select an option...')}
            </div>
            {!hasValue && control.properties.options && (
              <div className="text-xs text-gray-500 mt-1">
                Options: {control.properties.options.join(', ')}
              </div>
            )}
          </div>
        );
      
      case 'radio':
        return (
          <div key={control.id} className={baseClasses}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {control.properties.label || control.name}
              {control.properties.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {hasValue ? (
              <div className="p-2 bg-blue-50 rounded border border-blue-200">
                <span className="text-gray-900 font-medium">Selected: {value}</span>
              </div>
            ) : (
              <div className="space-y-2">
                {control.properties.options?.map((option: string, index: number) => (
                  <div key={index} className="flex items-center">
                    <div className="w-4 h-4 border border-gray-300 rounded-full mr-2"></div>
                    <span className="text-gray-700">{option}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      
      case 'checkbox':
        return (
          <div key={control.id} className={baseClasses}>
            <div className="flex items-center">
              <div className={`w-4 h-4 border border-gray-300 rounded mr-2 ${hasValue && value ? 'bg-blue-500 border-blue-500' : ''}`}>
                {hasValue && value && <CheckSquare className="w-4 h-4 text-white" />}
              </div>
              <label className="text-sm font-medium text-gray-700">
                {control.properties.label || control.name}
                {control.properties.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {hasValue && (
                <span className="ml-2 text-sm text-blue-600 font-medium">
                  ({value ? 'Checked' : 'Unchecked'})
                </span>
              )}
            </div>
          </div>
        );
      
      case 'number':
        return (
          <div key={control.id} className={baseClasses}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {control.properties.label || control.name}
              {control.properties.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className={`w-full p-2 border border-gray-300 rounded ${hasValue ? 'bg-blue-50 text-gray-900 font-medium' : 'bg-gray-50 text-gray-600'}`}>
              {hasValue ? value : (control.properties.placeholder || '0')}
            </div>
          </div>
        );
      
      default:
        return (
          <div key={control.id} className={baseClasses}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {control.properties.label || control.name}
              {control.properties.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-gray-600">
              {control.type} field
            </div>
          </div>
        );
    }
  };

  const renderCustomizationPanel = () => (
    <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-colors">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">PDF Customization</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Customize your PDF appearance</p>
      </div>
      
      <div className="flex-1 overflow-auto">
        {/* Template Selection */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Template
          </label>
          <select
            value={selectedTemplate?.id || ''}
            onChange={(e) => handleTemplateChange(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {availableTemplates.map(template => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {selectedTemplate?.description}
          </p>
        </div>

        {/* Customization Panels */}
        <div className="space-y-1">
          {/* Header Section */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActivePanel(activePanel === 'header' ? 'content' : 'header')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Layout className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="font-medium text-gray-900 dark:text-white">Header</span>
              </div>
              {activePanel === 'header' ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </button>
            
            {activePanel === 'header' && (
              <div className="p-4 pt-0 space-y-3">
                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Header Logo
                  </label>
                  <div className="space-y-2">
                    <button
                      onClick={() => logoInputRef.current?.click()}
                      className="flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Logo
                    </button>
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    {customization.header.logoUrl && (
                      <div className="flex items-center space-x-2">
                        <img 
                          src={customization.header.logoUrl} 
                          alt="Logo preview" 
                          className="w-8 h-8 object-contain border rounded"
                        />
                        <span className="text-xs text-green-600">Logo uploaded</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={customization.header.title}
                    onChange={(e) => updateCustomization('header', 'title', e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title Alignment
                  </label>
                  <select
                    value={customization.header.titleAlignment}
                    onChange={(e) => updateCustomization('header', 'titleAlignment', e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showDate"
                    checked={customization.header.showDate}
                    onChange={(e) => updateCustomization('header', 'showDate', e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="showDate" className="text-sm text-gray-700 dark:text-gray-300">
                    Show Date
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Footer Section */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActivePanel(activePanel === 'footer' ? 'content' : 'footer')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <AlignCenter className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="font-medium text-gray-900 dark:text-white">Footer</span>
              </div>
              {activePanel === 'footer' ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </button>
            
            {activePanel === 'footer' && (
              <div className="p-4 pt-0 space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showPageNumbers"
                    checked={customization.footer.showPageNumbers}
                    onChange={(e) => updateCustomization('footer', 'showPageNumbers', e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="showPageNumbers" className="text-sm text-gray-700 dark:text-gray-300">
                    Show Page Numbers
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showCompanyInfo"
                    checked={customization.footer.showCompanyInfo}
                    onChange={(e) => updateCustomization('footer', 'showCompanyInfo', e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="showCompanyInfo" className="text-sm text-gray-700 dark:text-gray-300">
                    Show Company Info
                  </label>
                </div>
                {customization.footer.showCompanyInfo && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={customization.footer.companyName}
                      onChange={(e) => updateCustomization('footer', 'companyName', e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Custom Footer Note
                  </label>
                  <textarea
                    value={customization.footer.customNote}
                    onChange={(e) => updateCustomization('footer', 'customNote', e.target.value)}
                    placeholder="Add a custom note to appear in the footer"
                    rows={2}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Page Settings */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActivePanel(activePanel === 'page' ? 'content' : 'page')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="font-medium text-gray-900 dark:text-white">Page Settings</span>
              </div>
              {activePanel === 'page' ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </button>
            
            {activePanel === 'page' && (
              <div className="p-4 pt-0 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Page Size
                  </label>
                  <select
                    value={customization.page.size}
                    onChange={(e) => updateCustomization('page', 'size', e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="A4">A4</option>
                    <option value="Letter">Letter</option>
                    <option value="Legal">Legal</option>
                    <option value="A3">A3</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Orientation
                  </label>
                  <select
                    value={customization.page.orientation}
                    onChange={(e) => updateCustomization('page', 'orientation', e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="sectionPageBreaks"
                    checked={customization.page.sectionPageBreaks}
                    onChange={(e) => updateCustomization('page', 'sectionPageBreaks', e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="sectionPageBreaks" className="text-sm text-gray-700 dark:text-gray-300">
                    Start each section on a new page
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 bg-white dark:bg-gray-800 flex transition-colors">
      {/* Left Panel - Customization */}
      {showCustomization && renderCustomizationPanel()}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-700 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCustomization(!showCustomization)}
                className="flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4 mr-1" />
                {showCustomization ? 'Hide' : 'Show'} Panel
              </button>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleZoom(-25)}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-300 min-w-[60px] text-center">
                  {zoom}%
                </span>
                <button
                  onClick={() => handleZoom(25)}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={resetZoom}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                title="Toggle Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              
              <button
                onClick={generatePDF}
                disabled={isGenerating}
                className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                {isGenerating ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                {isGenerating ? 'Generating...' : 'Export PDF'}
              </button>
            </div>
          </div>
        </div>
        
        {/* PDF Preview */}
        <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900 p-6 transition-colors">
          <div 
            className="mx-auto bg-white shadow-lg"
            style={{ 
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top center',
              width: customization.page.orientation === 'portrait' ? '210mm' : '297mm',
              minHeight: customization.page.orientation === 'portrait' ? '297mm' : '210mm'
            }}
          >
            <div ref={previewRef} className="w-full h-full p-8">
              {/* Header */}
              <div 
                className="mb-8 pb-4 border-b-2 flex items-center justify-between"
                style={{ 
                  color: customization.header.textColor,
                  backgroundColor: customization.header.backgroundColor,
                  borderColor: selectedTemplate?.colors.border
                }}
              >
                <div className="flex items-center space-x-4">
                  {customization.header.showLogo && customization.header.logoUrl && (
                    <img 
                      src={customization.header.logoUrl} 
                      alt="Logo" 
                      className="h-12 w-auto object-contain"
                    />
                  )}
                  <div style={{ textAlign: customization.header.titleAlignment }}>
                    <h1 className="text-2xl font-bold mb-1">{customization.header.title}</h1>
                    {customization.header.showDate && (
                      <p className="text-sm text-gray-600">
                        Generated on {new Date().toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="space-y-6">
                {sections.length > 0 ? (
                  sections.map(section => {
                    const sectionControls = droppedControls.filter(
                      control => control.sectionId === section.id
                    );
                    
                    if (sectionControls.length === 0) return null;
                    
                    return (
                      <div key={section.id} className="mb-8">
                        <h2 
                          className="text-xl font-semibold mb-4 pb-2 border-b"
                          style={{ 
                            color: selectedTemplate?.colors.primary,
                            borderColor: selectedTemplate?.colors.border
                          }}
                        >
                          {section.name}
                        </h2>
                        <div className="space-y-4">
                          {sectionControls.map(renderControl)}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="space-y-4">
                    {droppedControls.map(renderControl)}
                  </div>
                )}
                
                {droppedControls.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No form controls to display</p>
                    <p className="text-sm">Add some controls in Design mode to see the PDF preview</p>
                  </div>
                )}
              </div>
              
              {/* Footer */}
              {(customization.footer.showPageNumbers || customization.footer.showCompanyInfo) && (
                <div 
                  className="mt-8 pt-4 border-t-2 text-center"
                  style={{ 
                    color: customization.footer.textColor,
                    backgroundColor: customization.footer.backgroundColor,
                    borderColor: selectedTemplate?.colors.border
                  }}
                >
                  {customization.footer.showCompanyInfo && customization.footer.companyName && (
                    <p className="text-sm mb-2">{customization.footer.companyName}</p>
                  )}
                  {customization.footer.showPageNumbers && (
                    <p className="text-xs text-gray-500">Page 1</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};