import { TierConfig } from '../types';

export const TIER_CONFIGS: Record<string, TierConfig> = {
  platinum: {
    name: 'Platinum',
    color: 'border-purple-500',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    layouts: 12,
    customization: ['Full Theme Control', 'Custom CSS', 'Logo Upload', 'Animation Control'],
    pdfTemplates: 20,
    animations: true,
  },
  gold: {
    name: 'Gold',
    color: 'border-amber-500',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    layouts: 8,
    customization: ['Preset Themes', 'Logo Upload', 'Basic Styling'],
    pdfTemplates: 12,
    animations: true,
  },
  silver: {
    name: 'Silver',
    color: 'border-gray-500',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-700',
    layouts: 5,
    customization: ['Preset Themes', 'Basic Colors'],
    pdfTemplates: 6,
    animations: false,
  },
  bronze: {
    name: 'Bronze',
    color: 'border-orange-500',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    layouts: 3,
    customization: ['Basic Themes'],
    pdfTemplates: 3,
    animations: false,
  },
};