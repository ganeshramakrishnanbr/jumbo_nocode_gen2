# 11 - Customer Tier System and Feature Gating

This prompt creates the comprehensive customer tier system with feature limitations and upgrade prompts.

## Visual Design Requirements

### Tier Indicators
- **Tier Badges**: Color-coded badges with metallic gradients (Bronze, Silver, Gold, Platinum)
- **Feature Restrictions**: Clear visual indicators when features are locked
- **Upgrade Prompts**: Professional modal dialogs with feature comparisons
- **Progress Bars**: Visual indicators showing tier usage limits
- **Feature Tooltips**: Informative tooltips explaining tier benefits

### Tier Comparison Table
- **Feature Matrix**: Clear table showing what's available per tier
- **Usage Limits**: Visual representation of control/section limits
- **Pricing Display**: Professional pricing cards with call-to-action buttons
- **Benefit Highlights**: Key features emphasized with icons and descriptions

## AI Prompt

```
Create a comprehensive customer tier system with feature gating using the following exact specifications:

VISUAL DESIGN STANDARDS:

Tier Badge Styling:
- Bronze: Linear gradient from #cd7f32 to #b8860b with gold text
- Silver: Linear gradient from #c0c0c0 to #a8a8a8 with dark text  
- Gold: Linear gradient from #ffd700 to #ffb347 with dark text
- Platinum: Linear gradient from #e5e4e2 to #b8860b with dark text
- Badge size: 24px height with 8px padding and rounded corners

Feature Lock Indicators:
- Lock icon: Gray with subtle animation on hover
- Disabled states: 50% opacity with grayscale filter
- Upgrade buttons: Blue gradient with white text and hover effects
- Tooltips: Dark background with white text and arrow pointers

TIER CONFIGURATION (client/src/data/tiers.ts):
```typescript
export type CustomerTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum';

export interface TierConfig {
  name: CustomerTier;
  displayName: string;
  color: {
    primary: string;
    secondary: string;
    gradient: string;
  };
  limits: {
    maxControls: number; // -1 for unlimited
    maxSections: number;
    maxFormsPerMonth: number;
    maxExportsPerMonth: number;
    fileUploadSizeMB: number;
    customThemes: boolean;
    advancedValidation: boolean;
    apiAccess: boolean;
    prioritySupport: boolean;
  };
  features: {
    basicControls: boolean;
    advancedControls: boolean;
    fileUpload: boolean;
    conditionalLogic: boolean;
    customBranding: boolean;
    pdfExport: boolean;
    excelImport: boolean;
    webhookIntegrations: boolean;
    customDomains: boolean;
    whiteLabeling: boolean;
  };
  pricing: {
    monthly: number;
    yearly: number;
    currency: string;
  };
  description: string;
  highlights: string[];
}

export const TIER_CONFIGS: Record<CustomerTier, TierConfig> = {
  Bronze: {
    name: 'Bronze',
    displayName: 'Bronze Starter',
    color: {
      primary: '#cd7f32',
      secondary: '#b8860b',
      gradient: 'linear-gradient(135deg, #cd7f32 0%, #b8860b 100%)'
    },
    limits: {
      maxControls: 10,
      maxSections: 2,
      maxFormsPerMonth: 5,
      maxExportsPerMonth: 10,
      fileUploadSizeMB: 5,
      customThemes: false,
      advancedValidation: false,
      apiAccess: false,
      prioritySupport: false
    },
    features: {
      basicControls: true,
      advancedControls: false,
      fileUpload: false,
      conditionalLogic: false,
      customBranding: false,
      pdfExport: true,
      excelImport: false,
      webhookIntegrations: false,
      customDomains: false,
      whiteLabeling: false
    },
    pricing: {
      monthly: 9,
      yearly: 89,
      currency: 'USD'
    },
    description: 'Perfect for individuals and small projects getting started with form building.',
    highlights: [
      'Up to 10 form controls',
      'Basic control types',
      'PDF export',
      'Email support'
    ]
  },
  
  Silver: {
    name: 'Silver',
    displayName: 'Silver Professional',
    color: {
      primary: '#c0c0c0',
      secondary: '#a8a8a8',
      gradient: 'linear-gradient(135deg, #c0c0c0 0%, #a8a8a8 100%)'
    },
    limits: {
      maxControls: 25,
      maxSections: 5,
      maxFormsPerMonth: 20,
      maxExportsPerMonth: 50,
      fileUploadSizeMB: 25,
      customThemes: false,
      advancedValidation: true,
      apiAccess: false,
      prioritySupport: false
    },
    features: {
      basicControls: true,
      advancedControls: true,
      fileUpload: true,
      conditionalLogic: false,
      customBranding: false,
      pdfExport: true,
      excelImport: true,
      webhookIntegrations: false,
      customDomains: false,
      whiteLabeling: false
    },
    pricing: {
      monthly: 29,
      yearly: 299,
      currency: 'USD'
    },
    description: 'Ideal for growing businesses that need more advanced form capabilities.',
    highlights: [
      'Up to 25 form controls',
      'All control types',
      'File uploads (25MB)',
      'Excel import/export',
      'Advanced validation'
    ]
  },
  
  Gold: {
    name: 'Gold',
    displayName: 'Gold Business',
    color: {
      primary: '#ffd700',
      secondary: '#ffb347',
      gradient: 'linear-gradient(135deg, #ffd700 0%, #ffb347 100%)'
    },
    limits: {
      maxControls: 50,
      maxSections: 10,
      maxFormsPerMonth: 100,
      maxExportsPerMonth: 250,
      fileUploadSizeMB: 100,
      customThemes: true,
      advancedValidation: true,
      apiAccess: false,
      prioritySupport: true
    },
    features: {
      basicControls: true,
      advancedControls: true,
      fileUpload: true,
      conditionalLogic: true,
      customBranding: true,
      pdfExport: true,
      excelImport: true,
      webhookIntegrations: true,
      customDomains: false,
      whiteLabeling: false
    },
    pricing: {
      monthly: 79,
      yearly: 799,
      currency: 'USD'
    },
    description: 'Comprehensive solution for established businesses with complex form requirements.',
    highlights: [
      'Up to 50 form controls',
      'Conditional logic',
      'Custom branding',
      'Webhook integrations',
      'Priority support',
      'Custom themes'
    ]
  },
  
  Platinum: {
    name: 'Platinum',
    displayName: 'Platinum Enterprise',
    color: {
      primary: '#e5e4e2',
      secondary: '#b8860b',
      gradient: 'linear-gradient(135deg, #e5e4e2 0%, #b8860b 100%)'
    },
    limits: {
      maxControls: -1, // unlimited
      maxSections: -1,
      maxFormsPerMonth: -1,
      maxExportsPerMonth: -1,
      fileUploadSizeMB: 500,
      customThemes: true,
      advancedValidation: true,
      apiAccess: true,
      prioritySupport: true
    },
    features: {
      basicControls: true,
      advancedControls: true,
      fileUpload: true,
      conditionalLogic: true,
      customBranding: true,
      pdfExport: true,
      excelImport: true,
      webhookIntegrations: true,
      customDomains: true,
      whiteLabeling: true
    },
    pricing: {
      monthly: 199,
      yearly: 1999,
      currency: 'USD'
    },
    description: 'Ultimate enterprise solution with unlimited access and white-label options.',
    highlights: [
      'Unlimited form controls',
      'Full API access',
      'White-label solution',
      'Custom domains',
      'Dedicated support',
      'All features included'
    ]
  }
};

export const getTierConfig = (tier: CustomerTier): TierConfig => {
  return TIER_CONFIGS[tier];
};

export const getTierLimits = (tier: CustomerTier) => {
  return TIER_CONFIGS[tier].limits;
};

export const getTierFeatures = (tier: CustomerTier) => {
  return TIER_CONFIGS[tier].features;
};

export const canUseFeature = (tier: CustomerTier, feature: keyof TierConfig['features']): boolean => {
  return TIER_CONFIGS[tier].features[feature];
};

export const isWithinLimits = (
  tier: CustomerTier, 
  type: keyof TierConfig['limits'], 
  currentCount: number
): boolean => {
  const limit = TIER_CONFIGS[tier].limits[type];
  return limit === -1 || currentCount < limit;
};

export const getUsagePercentage = (
  tier: CustomerTier,
  type: keyof TierConfig['limits'],
  currentCount: number
): number => {
  const limit = TIER_CONFIGS[tier].limits[type];
  if (limit === -1) return 0; // unlimited
  return Math.min((currentCount / limit) * 100, 100);
};
```

TIER BADGE COMPONENT (client/src/components/TierBadge.tsx):
```typescript
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getTierConfig, type CustomerTier } from '@/data/tiers';

interface TierBadgeProps {
  tier: CustomerTier;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const TierBadge: React.FC<TierBadgeProps> = ({
  tier,
  size = 'md',
  showIcon = true,
  className
}) => {
  const config = getTierConfig(tier);
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <Badge
      className={cn(
        'border-0 font-semibold text-white shadow-sm transition-all duration-200',
        sizeClasses[size],
        className
      )}
      style={{
        background: config.color.gradient,
        color: tier === 'Silver' || tier === 'Platinum' ? '#1f2937' : '#ffffff'
      }}
    >
      {showIcon && (
        <Crown className={cn('mr-1', iconSizes[size])} />
      )}
      {config.displayName}
    </Badge>
  );
};
```

FEATURE GATE COMPONENT (client/src/components/FeatureGate.tsx):
```typescript
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { TierBadge } from './TierBadge';

import { Lock, Zap, CheckCircle2, ArrowRight } from 'lucide-react';

import { getTierConfig, canUseFeature, type CustomerTier } from '@/data/tiers';

interface FeatureGateProps {
  currentTier: CustomerTier;
  requiredFeature: keyof ReturnType<typeof getTierConfig>['features'];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgradePrompt?: boolean;
}

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: CustomerTier;
  targetFeature: string;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  currentTier,
  targetFeature
}) => {
  const currentConfig = getTierConfig(currentTier);
  const availableTiers: CustomerTier[] = ['Bronze', 'Silver', 'Gold', 'Platinum'];
  const eligibleTiers = availableTiers.filter(tier => 
    getTierConfig(tier).features[targetFeature as keyof typeof getTierConfig('Bronze')['features']]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-amber-500" />
            <span>Upgrade Required</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              This feature requires a higher tier
            </h3>
            <p className="text-slate-600">
              Upgrade your plan to unlock advanced features and increase your limits.
            </p>
          </div>

          <div className="grid gap-4">
            {eligibleTiers.map(tier => {
              const config = getTierConfig(tier);
              const isRecommended = tier === 'Gold';
              
              return (
                <Card 
                  key={tier} 
                  className={cn(
                    'relative border-2 transition-all duration-200',
                    isRecommended 
                      ? 'border-blue-500 shadow-md' 
                      : 'border-slate-200 hover:border-slate-300'
                  )}
                >
                  {isRecommended && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-500 text-white px-3 py-1">
                        Recommended
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <TierBadge tier={tier} size="lg" />
                        <p className="text-sm text-slate-600 mt-2">
                          {config.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">
                          ${config.pricing.monthly}
                        </div>
                        <div className="text-sm text-slate-600">
                          per month
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-2 mb-4">
                      {config.highlights.slice(0, 3).map((highlight, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      className="w-full" 
                      variant={isRecommended ? "default" : "outline"}
                    >
                      Upgrade to {tier}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center text-sm text-slate-500">
            <p>All plans include a 14-day free trial. No credit card required.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const FeatureGate: React.FC<FeatureGateProps> = ({
  currentTier,
  requiredFeature,
  children,
  fallback,
  showUpgradePrompt = true
}) => {
  const [showUpgrade, setShowUpgrade] = useState(false);
  const hasAccess = canUseFeature(currentTier, requiredFeature);

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <>
      <div className="relative">
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Lock className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="font-medium text-slate-900 mb-2">
              Feature Locked
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              This feature requires a higher tier plan
            </p>
            {showUpgradePrompt && (
              <Button 
                onClick={() => setShowUpgrade(true)}
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white"
              >
                <Zap className="h-4 w-4 mr-2" />
                Upgrade Plan
              </Button>
            )}
          </div>
        </div>
        <div className="opacity-50 pointer-events-none">
          {children}
        </div>
      </div>

      <UpgradeModal
        isOpen={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        currentTier={currentTier}
        targetFeature={requiredFeature}
      />
    </>
  );
};
```

USAGE MONITOR COMPONENT (client/src/components/UsageMonitor.tsx):
```typescript
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TierBadge } from './TierBadge';

import { AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';

import { getTierConfig, getUsagePercentage, isWithinLimits, type CustomerTier } from '@/data/tiers';

interface UsageMonitorProps {
  currentTier: CustomerTier;
  usage: {
    controls: number;
    sections: number;
    formsThisMonth: number;
    exportsThisMonth: number;
  };
}

export const UsageMonitor: React.FC<UsageMonitorProps> = ({
  currentTier,
  usage
}) => {
  const config = getTierConfig(currentTier);
  
  const getUsageStatus = (percentage: number) => {
    if (percentage >= 90) return { color: 'red', icon: AlertTriangle, text: 'Critical' };
    if (percentage >= 75) return { color: 'amber', icon: TrendingUp, text: 'High' };
    return { color: 'green', icon: CheckCircle2, text: 'Good' };
  };

  const usageItems = [
    {
      label: 'Form Controls',
      current: usage.controls,
      limit: config.limits.maxControls,
      key: 'maxControls' as const
    },
    {
      label: 'Sections',
      current: usage.sections,
      limit: config.limits.maxSections,
      key: 'maxSections' as const
    },
    {
      label: 'Forms This Month',
      current: usage.formsThisMonth,
      limit: config.limits.maxFormsPerMonth,
      key: 'maxFormsPerMonth' as const
    },
    {
      label: 'Exports This Month',
      current: usage.exportsThisMonth,
      limit: config.limits.maxExportsPerMonth,
      key: 'maxExportsPerMonth' as const
    }
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Usage & Limits</h3>
          <TierBadge tier={currentTier} size="sm" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {usageItems.map(item => {
          const percentage = getUsagePercentage(currentTier, item.key, item.current);
          const isUnlimited = item.limit === -1;
          const status = getUsageStatus(percentage);
          const StatusIcon = status.icon;
          
          return (
            <div key={item.label} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{item.label}</span>
                <div className="flex items-center space-x-2">
                  {!isUnlimited && (
                    <StatusIcon 
                      className={`h-4 w-4 ${
                        status.color === 'red' ? 'text-red-500' :
                        status.color === 'amber' ? 'text-amber-500' :
                        'text-green-500'
                      }`} 
                    />
                  )}
                  <span className="text-slate-600">
                    {item.current} {isUnlimited ? '' : `/ ${item.limit}`}
                  </span>
                  {isUnlimited && (
                    <Badge variant="outline" className="text-xs">
                      Unlimited
                    </Badge>
                  )}
                </div>
              </div>
              
              {!isUnlimited && (
                <Progress 
                  value={percentage} 
                  className="h-2"
                  style={{
                    backgroundColor: status.color === 'red' ? '#fee2e2' : 
                                   status.color === 'amber' ? '#fef3c7' : '#f0fdf4'
                  }}
                />
              )}
            </div>
          );
        })}
        
        <div className="pt-2 border-t">
          <p className="text-xs text-slate-500 text-center">
            Need more? <button className="text-blue-600 hover:underline">Upgrade your plan</button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
```

Create a comprehensive customer tier system with feature gating, usage monitoring, upgrade prompts, and visual tier indicators that enhance the user experience while encouraging plan upgrades.
```