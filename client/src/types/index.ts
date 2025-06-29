export type CustomerTier = 'platinum' | 'gold' | 'silver' | 'bronze';
export type Theme = 'light' | 'dark';

export interface TierConfig {
  name: string;
  color: string;
  bgColor: string;
  textColor: string;
  layouts: number;
  customization: string[];
  pdfTemplates: number;
  animations: boolean;
}

export interface ControlType {
  id: string;
  type: string;
  category: string;
  name: string;
  icon: string;
  description: string;
  properties: ControlProperty[];
}

export interface ControlProperty {
  name: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'color';
  value: any;
  options?: string[];
}

export interface DroppedControl {
  id: string;
  type: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  properties: Record<string, any>;
  sectionId?: string;
}

export interface Section {
  id: string;
  name: string;
  color: string;
  icon: string;
  description: string;
  order: number;
  required: boolean;
  controls: DroppedControl[];
  validation: {
    isValid: boolean;
    requiredFields: number;
    completedFields: number;
  };
}

export interface FormConfig {
  id: string;
  name: string;
  tier: CustomerTier;
  sections: Section[];
  settings: {
    layout: string;
    theme: string;
    customCSS?: string;
  };
}

export interface Questionnaire {
  id: string;
  name: string;
  description: string;
  purpose: string;
  category: string;
  status: 'Active' | 'Inactive' | 'Draft';
  version: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  tier: CustomerTier;
  sections: Section[];
  controls: DroppedControl[];
  analytics: {
    totalResponses: number;
    completionRate: number;
    averageTime: number;
    lastResponse: string;
  };
  versions: QuestionnaireVersion[];
}

export interface QuestionnaireVersion {
  id: string;
  version: string;
  description: string;
  createdAt: string;
  createdBy: string;
  status: 'Draft' | 'Published' | 'Archived';
  changes: string[];
  sections: Section[];
  controls: DroppedControl[];
}

export interface DashboardStats {
  totalQuestionnaires: number;
  activeQuestionnaires: number;
  inactiveQuestionnaires: number;
  draftQuestionnaires: number;
  totalResponses: number;
  averageCompletionRate: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'created' | 'updated' | 'published' | 'archived';
  questionnaireName: string;
  timestamp: string;
  user: string;
}

export interface ThemeConfig {
  light: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    text: {
      primary: string;
      secondary: string;
      muted: string;
    };
    border: string;
    accent: string;
  };
  dark: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    text: {
      primary: string;
      secondary: string;
      muted: string;
    };
    border: string;
    accent: string;
  };
}

// PDF Preview Types
export interface PDFTemplate {
  id: string;
  name: string;
  description: string;
  category: 'executive' | 'professional' | 'academic' | 'survey' | 'application' | 'medical' | 'legal' | 'creative';
  headerHeight: number;
  footerHeight: number;
  margins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  typography: {
    title: string;
    heading: string;
    body: string;
    caption: string;
  };
  colors: {
    primary: string;
    secondary: string;
    text: string;
    background: string;
    border: string;
  };
  tierRequired: CustomerTier;
}

export interface PDFCustomization {
  template: string;
  header: {
    showLogo: boolean;
    logoPosition: 'left' | 'center' | 'right';
    title: string;
    titleAlignment: 'left' | 'center' | 'right';
    customText: string;
    showDate: boolean;
    backgroundColor: string;
    textColor: string;
  };
  footer: {
    showCompanyInfo: boolean;
    companyName: string;
    contactInfo: string;
    showPageNumbers: boolean;
    pageNumberFormat: 'simple' | 'total' | 'custom';
    customText: string;
    backgroundColor: string;
    textColor: string;
  };
  content: {
    fontFamily: string;
    fontSize: number;
    lineHeight: number;
    questionSpacing: number;
    sectionSpacing: number;
    showRequiredIndicators: boolean;
    colorScheme: string;
  };
  page: {
    size: 'A4' | 'Letter' | 'Legal' | 'A3';
    orientation: 'portrait' | 'landscape';
    margins: {
      top: number;
      bottom: number;
      left: number;
      right: number;
    };
  };
}

export interface PDFExportSettings {
  format: 'pdf' | 'high-resolution' | 'pdf-a' | 'flattened';
  quality: 'standard' | 'high' | 'print';
  includeResponses: boolean;
  watermark?: string;
  metadata: {
    title: string;
    author: string;
    subject: string;
    keywords: string[];
  };
}