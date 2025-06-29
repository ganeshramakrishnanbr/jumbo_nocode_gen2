import { PDFTemplate, CustomerTier } from '../types';

export const PDF_TEMPLATES: PDFTemplate[] = [
  {
    id: 'executive',
    name: 'Executive',
    description: 'Premium design with sophisticated styling',
    category: 'executive',
    headerHeight: 80,
    footerHeight: 60,
    margins: { top: 30, bottom: 30, left: 25, right: 25 },
    typography: {
      title: 'Georgia, serif',
      heading: 'Arial, sans-serif',
      body: 'Arial, sans-serif',
      caption: 'Arial, sans-serif'
    },
    colors: {
      primary: '#1a365d',
      secondary: '#2d3748',
      text: '#2d3748',
      background: '#ffffff',
      border: '#e2e8f0'
    },
    tierRequired: 'platinum'
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Clean business-oriented design',
    category: 'professional',
    headerHeight: 70,
    footerHeight: 50,
    margins: { top: 25, bottom: 25, left: 20, right: 20 },
    typography: {
      title: 'Arial, sans-serif',
      heading: 'Arial, sans-serif',
      body: 'Arial, sans-serif',
      caption: 'Arial, sans-serif'
    },
    colors: {
      primary: '#2563eb',
      secondary: '#4b5563',
      text: '#374151',
      background: '#ffffff',
      border: '#d1d5db'
    },
    tierRequired: 'gold'
  },
  {
    id: 'academic',
    name: 'Academic',
    description: 'Formal academic/research design',
    category: 'academic',
    headerHeight: 60,
    footerHeight: 40,
    margins: { top: 30, bottom: 30, left: 30, right: 30 },
    typography: {
      title: 'Times New Roman, serif',
      heading: 'Times New Roman, serif',
      body: 'Times New Roman, serif',
      caption: 'Times New Roman, serif'
    },
    colors: {
      primary: '#374151',
      secondary: '#6b7280',
      text: '#111827',
      background: '#ffffff',
      border: '#9ca3af'
    },
    tierRequired: 'gold'
  },
  {
    id: 'survey',
    name: 'Survey',
    description: 'Optimized for survey and feedback forms',
    category: 'survey',
    headerHeight: 50,
    footerHeight: 40,
    margins: { top: 20, bottom: 20, left: 20, right: 20 },
    typography: {
      title: 'Arial, sans-serif',
      heading: 'Arial, sans-serif',
      body: 'Arial, sans-serif',
      caption: 'Arial, sans-serif'
    },
    colors: {
      primary: '#059669',
      secondary: '#6b7280',
      text: '#374151',
      background: '#ffffff',
      border: '#d1d5db'
    },
    tierRequired: 'silver'
  },
  {
    id: 'application',
    name: 'Application',
    description: 'Designed for application and registration forms',
    category: 'application',
    headerHeight: 60,
    footerHeight: 45,
    margins: { top: 25, bottom: 25, left: 20, right: 20 },
    typography: {
      title: 'Arial, sans-serif',
      heading: 'Arial, sans-serif',
      body: 'Arial, sans-serif',
      caption: 'Arial, sans-serif'
    },
    colors: {
      primary: '#7c3aed',
      secondary: '#6b7280',
      text: '#374151',
      background: '#ffffff',
      border: '#d1d5db'
    },
    tierRequired: 'silver'
  },
  {
    id: 'medical',
    name: 'Medical',
    description: 'Healthcare-compliant design with proper spacing',
    category: 'medical',
    headerHeight: 70,
    footerHeight: 50,
    margins: { top: 30, bottom: 30, left: 25, right: 25 },
    typography: {
      title: 'Arial, sans-serif',
      heading: 'Arial, sans-serif',
      body: 'Arial, sans-serif',
      caption: 'Arial, sans-serif'
    },
    colors: {
      primary: '#dc2626',
      secondary: '#6b7280',
      text: '#374151',
      background: '#ffffff',
      border: '#d1d5db'
    },
    tierRequired: 'platinum'
  },
  {
    id: 'legal',
    name: 'Legal',
    description: 'Formal legal document design',
    category: 'legal',
    headerHeight: 60,
    footerHeight: 50,
    margins: { top: 35, bottom: 35, left: 30, right: 30 },
    typography: {
      title: 'Times New Roman, serif',
      heading: 'Times New Roman, serif',
      body: 'Times New Roman, serif',
      caption: 'Times New Roman, serif'
    },
    colors: {
      primary: '#1f2937',
      secondary: '#6b7280',
      text: '#111827',
      background: '#ffffff',
      border: '#9ca3af'
    },
    tierRequired: 'platinum'
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Modern, visually appealing design',
    category: 'creative',
    headerHeight: 80,
    footerHeight: 60,
    margins: { top: 25, bottom: 25, left: 20, right: 20 },
    typography: {
      title: 'Arial, sans-serif',
      heading: 'Arial, sans-serif',
      body: 'Arial, sans-serif',
      caption: 'Arial, sans-serif'
    },
    colors: {
      primary: '#f59e0b',
      secondary: '#6b7280',
      text: '#374151',
      background: '#ffffff',
      border: '#d1d5db'
    },
    tierRequired: 'gold'
  },
  {
    id: 'basic',
    name: 'Basic',
    description: 'Simple, clean design for all tiers',
    category: 'survey',
    headerHeight: 40,
    footerHeight: 30,
    margins: { top: 20, bottom: 20, left: 20, right: 20 },
    typography: {
      title: 'Arial, sans-serif',
      heading: 'Arial, sans-serif',
      body: 'Arial, sans-serif',
      caption: 'Arial, sans-serif'
    },
    colors: {
      primary: '#6b7280',
      secondary: '#9ca3af',
      text: '#374151',
      background: '#ffffff',
      border: '#d1d5db'
    },
    tierRequired: 'bronze'
  }
];

export const getAvailableTemplates = (tier: CustomerTier): PDFTemplate[] => {
  const tierHierarchy: Record<CustomerTier, number> = {
    bronze: 1,
    silver: 2,
    gold: 3,
    platinum: 4
  };
  
  const currentTierLevel = tierHierarchy[tier];
  
  return PDF_TEMPLATES.filter(template => 
    tierHierarchy[template.tierRequired] <= currentTierLevel
  );
};

export const getDefaultCustomization = (template: PDFTemplate) => ({
  template: template.id,
  header: {
    showLogo: false,
    logoPosition: 'left' as const,
    title: 'Form Survey',
    titleAlignment: 'center' as const,
    customText: '',
    showDate: true,
    backgroundColor: template.colors.background,
    textColor: template.colors.text
  },
  footer: {
    showCompanyInfo: false,
    companyName: '',
    contactInfo: '',
    showPageNumbers: true,
    pageNumberFormat: 'simple' as const,
    customText: '',
    backgroundColor: template.colors.background,
    textColor: template.colors.text
  },
  content: {
    fontFamily: template.typography.body,
    fontSize: 12,
    lineHeight: 1.5,
    questionSpacing: 15,
    sectionSpacing: 25,
    showRequiredIndicators: true,
    colorScheme: 'default'
  },
  page: {
    size: 'A4' as const,
    orientation: 'portrait' as const,
    margins: template.margins
  }
});