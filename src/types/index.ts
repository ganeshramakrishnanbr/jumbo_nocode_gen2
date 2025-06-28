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