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
  const [customization, setCustomization] = useState<PDFCustomization>(() => 
    getDefaultCustomization(availableTemplates[0])
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showCustomization, setShowCustomization] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activePanel, setActivePanel] = useState<'template' | 'header' | 'footer' | 'page'>('template');
  
  const previewRef = useRef<HTMLDivElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const { generateSampleData } = useFormValues();

  // Combine passed formValues with any internal state
  const effectiveFormValues = { ...formValues };

  const handleTemplateChange = (templateId: string) => {
    const template = availableTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      setCustomization(getDefaultCustomization(template));
    }
  };

  const updateCustomization = (section: keyof PDFCustomization, field: string, value: any) => {
    setCustomization(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value
      }
    }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const logoUrl = e.target?.result as string;
        updateCustomization('header', 'logoUrl', logoUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateSampleData = () => {
    generateSampleData(droppedControls);
  };

  const zoomIn = () => setZoomLevel(prev => Math.min(prev + 25, 200));
  const zoomOut = () => setZoomLevel(prev => Math.max(prev - 25, 50));
  const resetZoom = () => setZoomLevel(100);

  const generateSinglePagePDF = async (pdf: jsPDF) => {
    const canvas = await html2canvas(previewRef.current!, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      imageTimeout: 0,
      onclone: (clonedDoc) => {
        // Ensure all images are loaded
        const images = clonedDoc.querySelectorAll('img');
        images.forEach(img => {
          if (!img.complete) {
            img.onload = () => console.log('Image loaded for PDF generation');
          }
        });
      }
    });

    const imgData = canvas.toDataURL('image/png');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 20; // 10mm margin on each side
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Smart pagination to prevent overflow
    if (imgHeight > pageHeight - 20) {
      // Content is too tall, split into multiple pages
      const sectionsPerPage = Math.ceil(imgHeight / (pageHeight - 40));
      const sectionHeight = canvas.height / sectionsPerPage;
      
      for (let i = 0; i < sectionsPerPage; i++) {
        if (i > 0) pdf.addPage();
        
        const sectionCanvas = document.createElement('canvas');
        const sectionCtx = sectionCanvas.getContext('2d')!;
        sectionCanvas.width = canvas.width;
        sectionCanvas.height = sectionHeight;
        
        sectionCtx.drawImage(canvas, 0, -i * sectionHeight);
        const sectionImgData = sectionCanvas.toDataURL('image/png');
        const sectionImgHeight = (sectionHeight * imgWidth) / canvas.width;
        
        pdf.addImage(sectionImgData, 'PNG', 10, 10, imgWidth, sectionImgHeight);
      }
    } else {
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
    }
  };

  const generatePDFWithPageBreaks = async (pdf: jsPDF) => {
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let currentY = 20;

    // Add header with logo if present
    const addHeader = async () => {
      if (customization.header.logoUrl) {
        try {
          // Create a temporary image element to get proper dimensions
          const img = new Image();
          img.crossOrigin = 'anonymous';
          
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject();
            img.src = customization.header.logoUrl;
          });
          
          // Add logo to PDF
          const logoHeight = 15;
          const logoWidth = (img.width * logoHeight) / img.height;
          pdf.addImage(customization.header.logoUrl, 'PNG', 10, currentY, logoWidth, logoHeight);
          currentY += logoHeight + 5;
        } catch (error) {
          console.warn('Could not load logo for PDF:', error);
        }
      }

      // Add title
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text(customization.header.title, pageWidth / 2, currentY, { align: 'center' });
      currentY += 10;

      if (customization.header.showDate) {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, currentY, { align: 'center' });
        currentY += 8;
      }
      
      currentY += 5; // Extra spacing after header
    };

    await addHeader();

    // Process each section
    for (const section of sections) {
      const sectionControls = droppedControls.filter(control => control.sectionId === section.id);
      if (sectionControls.length === 0) continue;

      // Check if we need a new page for this section
      if (currentY > pageHeight - 60) {
        pdf.addPage();
        currentY = 20;
        await addHeader();
      }

      // Add section title
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text(section.name, 10, currentY);
      currentY += 8;

      // Add section controls
      for (const control of sectionControls) {
        const controlHeight = 15; // Estimated height per control
        
        // Check if control would overflow to next page
        if (currentY + controlHeight > pageHeight - 30) {
          pdf.addPage();
          currentY = 20;
          await addHeader();
        }

        // Add control
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        
        const label = control.properties.label || control.name;
        const value = effectiveFormValues[control.id] || control.properties.placeholder || '';
        
        pdf.text(`${label}:`, 10, currentY);
        pdf.setFont('helvetica', 'bold');
        pdf.text(value.toString(), 60, currentY);
        pdf.setFont('helvetica', 'normal');
        
        currentY += controlHeight;
      }
      
      currentY += 5; // Extra spacing between sections
    }

    // Add footer to all pages
    const totalPages = (pdf as any).internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      
      if (customization.footer.customNote) {
        pdf.setFontSize(8);
        pdf.text(customization.footer.customNote, pageWidth / 2, pageHeight - 15, { align: 'center' });
      }
      
      if (customization.footer.showPageNumbers) {
        pdf.setFontSize(8);
        pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 20, pageHeight - 10, { align: 'right' });
      }
    }
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
        // Generate PDF with page breaks for sections and overflow prevention
        await generatePDFWithPageBreaks(pdf);
      } else {
        // Generate single-page PDF with smart overflow handling
        await generateSinglePagePDF(pdf);
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

  const renderControl = (control: DroppedControl) => {
    const baseClasses = "mb-4 p-3 border border-gray-200 rounded-lg";
    const value = effectiveFormValues[control.id];
    const hasValue = value !== undefined && value !== null && value !== '';

    switch (control.type) {
      case 'text':
      case 'email':
      case 'phone':
        return (
          <div key={control.id} className={baseClasses}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {control.properties.label || control.name}
              {control.properties.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className={`w-full p-2 border border-gray-300 rounded ${hasValue ? 'bg-blue-50 text-gray-900 font-medium' : 'bg-gray-50 text-gray-600'}`}>
              {hasValue ? value : (control.properties.placeholder || 'Enter text...')}
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
            <div className={`w-full p-2 border border-gray-300 rounded min-h-[80px] ${hasValue ? 'bg-blue-50 text-gray-900 font-medium' : 'bg-gray-50 text-gray-600'}`}>
              {hasValue ? value : (control.properties.placeholder || 'Enter detailed text...')}
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
              {hasValue ? value : 'Select an option...'}
            </div>
          </div>
        );
      
      case 'checkbox':
        return (
          <div key={control.id} className={baseClasses}>
            <div className="flex items-center">
              <div className={`w-4 h-4 border border-gray-300 rounded mr-2 flex items-center justify-center ${hasValue && value ? 'bg-blue-600 border-blue-600' : 'bg-white'}`}>
                {hasValue && value && <CheckSquare className="w-3 h-3 text-white" />}
              </div>
              <label className="text-sm font-medium text-gray-700">
                {control.properties.label || control.name}
                {control.properties.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            </div>
          </div>
        );
      
      case 'radio':
        return (
          <div key={control.id} className={baseClasses}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {control.properties.label || control.name}
              {control.properties.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {control.properties.options?.map((option: string, index: number) => (
                <div key={index} className="flex items-center">
                  <div className={`w-4 h-4 border border-gray-300 rounded-full mr-2 ${hasValue && value === option ? 'bg-blue-600 border-blue-600' : 'bg-white'}`}>
                    {hasValue && value === option && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />}
                  </div>
                  <span className="text-sm text-gray-700">{option}</span>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'date':
        return (
          <div key={control.id} className={baseClasses}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {control.properties.label || control.name}
              {control.properties.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className={`w-full p-2 border border-gray-300 rounded ${hasValue ? 'bg-blue-50 text-gray-900 font-medium' : 'bg-gray-50 text-gray-600'}`}>
              {hasValue ? new Date(value).toLocaleDateString() : 'Select date...'}
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
    <div className="w-80 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 shadow-xl">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <Settings className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
          PDF Studio
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Create professional documents</p>
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
            Tier: {selectedTemplate?.tierRequired}
          </p>
        </div>

        {/* Panel Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex">
            {(['template', 'header', 'footer', 'page'] as const).map((panel) => (
              <button
                key={panel}
                onClick={() => setActivePanel(panel)}
                className={`flex-1 p-3 text-sm font-medium border-b-2 transition-colors ${
                  activePanel === panel
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {panel.charAt(0).toUpperCase() + panel.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Header Panel */}
        {activePanel === 'header' && (
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Logo
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => logoInputRef.current?.click()}
                  className="w-full p-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                >
                  <Upload className="w-4 h-4 mx-auto mb-1" />
                  Click to upload logo
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

        {/* Footer Panel */}
        {activePanel === 'footer' && (
          <div className="p-4 space-y-4">
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
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={3}
                placeholder="Add a custom note to appear in the footer..."
              />
            </div>
          </div>
        )}

        {/* Page Panel */}
        {activePanel === 'page' && (
          <div className="p-4 space-y-4">
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
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex-1 bg-white dark:bg-gray-800 flex transition-colors">
      {/* Left Panel - Customization */}
      {showCustomization && renderCustomizationPanel()}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Modern Toolbar */}
        <div className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700 transition-all duration-300 shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowCustomization(!showCustomization)}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Settings className="w-4 h-4 mr-2" />
                {showCustomization ? 'Hide Studio' : 'Show Studio'}
              </button>
              
              <div className="flex items-center space-x-1 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-xl p-1 shadow-inner">
                <button
                  onClick={zoomOut}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-600 rounded-lg transition-all duration-200"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[60px] text-center bg-white dark:bg-gray-900 rounded-lg shadow-sm">
                  {zoomLevel}%
                </span>
                <button
                  onClick={zoomIn}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-600 rounded-lg transition-all duration-200"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={resetZoom}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-600 rounded-lg transition-all duration-200"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleGenerateSampleData}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
                title="Generate sample data for testing"
              >
                <Shuffle className="w-4 h-4 mr-2" />
                Sample Data
              </button>
              
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-gray-500 hover:to-gray-600 rounded-lg transition-all duration-200"
                title="Toggle Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              
              <button
                onClick={generatePDF}
                disabled={isGenerating}
                className="flex items-center px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100"
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
        <div className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black p-8 transition-all duration-300">
          <div 
            className="mx-auto bg-white shadow-2xl border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
            style={{
              width: customization.page.size === 'A4' ? '210mm' : '216mm',
              minHeight: customization.page.size === 'A4' ? '297mm' : '279mm',
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'top center',
              marginBottom: zoomLevel < 100 ? '40px' : '0'
            }}
            ref={previewRef}
          >
            <div className="p-8">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-start justify-between mb-4">
                  {customization.header.logoUrl && (
                    <img 
                      src={customization.header.logoUrl} 
                      alt="Company Logo" 
                      className="h-12 w-auto object-contain"
                      crossOrigin="anonymous"
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
              {(customization.footer.showPageNumbers || customization.footer.showCompanyInfo || customization.footer.customNote) && (
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
                  {customization.footer.customNote && (
                    <p className="text-sm mb-2 italic">{customization.footer.customNote}</p>
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