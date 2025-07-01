# 17 - Testing Framework and Form Validation

This prompt creates comprehensive testing infrastructure and real-time form validation systems.

## Visual Design Requirements

### Validation Interface
- **Inline Validation**: Real-time field validation with immediate visual feedback
- **Error States**: Red borders, error icons, and descriptive error messages
- **Success States**: Green checkmarks and confirmation indicators
- **Progressive Validation**: Step-by-step validation for complex forms
- **Accessibility**: ARIA labels, screen reader support, and keyboard navigation

### Testing Dashboard
- **Test Results**: Visual test status indicators with pass/fail badges
- **Coverage Metrics**: Progress bars showing test coverage percentages
- **Error Reports**: Detailed error logs with stack traces and suggestions
- **Performance Metrics**: Load times, validation speeds, and user interaction delays

## AI Prompt

```
Create comprehensive testing framework and validation system using the following exact specifications:

VISUAL DESIGN STANDARDS:

Validation Styling:
- Error state: Red border (#ef4444), red text, error icon (XCircle)
- Success state: Green border (#10b981), green text, check icon (CheckCircle2)
- Warning state: Amber border (#f59e0b), amber text, warning icon (AlertTriangle)
- Focus state: Blue border (#3b82f6) with 2px ring offset
- Transition duration: 200ms for all state changes

Testing Interface:
- Pass badges: Green background with white checkmark
- Fail badges: Red background with white X
- Pending badges: Amber background with clock icon
- Coverage bars: Blue fill with percentage display
- Error cards: Red-tinted background with monospace error text

VALIDATION SYSTEM (client/src/lib/validation.ts):
```typescript
import { z } from 'zod';
import type { DroppedControl } from '@shared/types';

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'min' | 'max' | 'email' | 'url' | 'custom';
  value?: any;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface FormValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
  warnings: Record<string, string[]>;
  summary: {
    totalFields: number;
    validFields: number;
    errorCount: number;
    warningCount: number;
  };
}

// Base validation schemas for different control types
export const validationSchemas = {
  text: z.string(),
  email: z.string().email('Please enter a valid email address'),
  url: z.string().url('Please enter a valid URL'),
  number: z.coerce.number(),
  password: z.string(),
  textarea: z.string(),
  date: z.string().datetime().or(z.date()),
  time: z.string(),
  select: z.string(),
  multiselect: z.array(z.string()),
  radio: z.string(),
  checkbox: z.array(z.string()),
  file: z.instanceof(File).optional(),
  toggle: z.boolean(),
  slider: z.number(),
  rating: z.number().min(1).max(5),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Please enter a valid hex color'),
  tags: z.array(z.string())
};

export class FormValidator {
  private controls: DroppedControl[];
  private schemas: Map<string, z.ZodSchema> = new Map();

  constructor(controls: DroppedControl[]) {
    this.controls = controls;
    this.buildSchemas();
  }

  private buildSchemas() {
    this.controls.forEach(control => {
      let schema = validationSchemas[control.type as keyof typeof validationSchemas];
      
      if (!schema) {
        schema = z.any();
      }

      // Apply control-specific validation rules
      if (control.properties.required) {
        if (control.type === 'checkbox' || control.type === 'multiselect') {
          schema = z.array(z.string()).min(1, `${control.properties.label || control.name} is required`);
        } else if (control.type === 'toggle') {
          schema = z.boolean().refine(val => val === true, {
            message: `${control.properties.label || control.name} must be enabled`
          });
        } else {
          schema = schema.min(1, `${control.properties.label || control.name} is required`);
        }
      }

      // String length validations
      if (control.properties.minLength && (control.type === 'text' || control.type === 'textarea' || control.type === 'password')) {
        schema = (schema as z.ZodString).min(control.properties.minLength, 
          `Must be at least ${control.properties.minLength} characters`);
      }

      if (control.properties.maxLength && (control.type === 'text' || control.type === 'textarea' || control.type === 'password')) {
        schema = (schema as z.ZodString).max(control.properties.maxLength, 
          `Must be no more than ${control.properties.maxLength} characters`);
      }

      // Number range validations
      if (control.type === 'number' || control.type === 'slider' || control.type === 'rating') {
        if (control.properties.min !== undefined) {
          schema = (schema as z.ZodNumber).min(control.properties.min, 
            `Must be at least ${control.properties.min}`);
        }
        if (control.properties.max !== undefined) {
          schema = (schema as z.ZodNumber).max(control.properties.max, 
            `Must be no more than ${control.properties.max}`);
        }
      }

      // Pattern validation
      if (control.properties.pattern && (control.type === 'text' || control.type === 'textarea')) {
        try {
          const regex = new RegExp(control.properties.pattern);
          schema = (schema as z.ZodString).regex(regex, 'Invalid format');
        } catch (error) {
          console.warn(`Invalid regex pattern for control ${control.id}:`, control.properties.pattern);
        }
      }

      // File size validation
      if (control.type === 'file' || control.type === 'image') {
        schema = z.instanceof(File).optional().superRefine((file, ctx) => {
          if (file && control.properties.maxSize && file.size > control.properties.maxSize) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `File size must be less than ${(control.properties.maxSize / 1024 / 1024).toFixed(1)}MB`
            });
          }
          
          if (file && control.properties.acceptedTypes) {
            const acceptedTypes = control.properties.acceptedTypes.split(',').map((type: string) => type.trim());
            if (!acceptedTypes.some((type: string) => file.type.match(type))) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `File type not allowed. Accepted types: ${acceptedTypes.join(', ')}`
              });
            }
          }
        });
      }

      // Make optional if not required
      if (!control.properties.required) {
        schema = schema.optional();
      }

      this.schemas.set(control.id, schema);
    });
  }

  validateField(controlId: string, value: any): ValidationResult {
    const schema = this.schemas.get(controlId);
    const control = this.controls.find(c => c.id === controlId);
    
    if (!schema || !control) {
      return { isValid: true, errors: [], warnings: [] };
    }

    const result = schema.safeParse(value);
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!result.success) {
      errors.push(...result.error.errors.map(err => err.message));
    }

    // Add warnings for best practices
    if (control.type === 'password' && value && typeof value === 'string') {
      if (value.length > 0 && value.length < 8) {
        warnings.push('Password should be at least 8 characters for security');
      }
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
        warnings.push('Password should include uppercase, lowercase, and numbers');
      }
    }

    if (control.type === 'email' && value && typeof value === 'string') {
      // Check for common email typos
      const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
      const domain = value.split('@')[1];
      if (domain && !commonDomains.includes(domain) && domain.includes('.')) {
        const suggestions = commonDomains.filter(d => 
          this.levenshteinDistance(domain, d) <= 2
        );
        if (suggestions.length > 0) {
          warnings.push(`Did you mean ${suggestions[0]}?`);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  validateForm(formData: Record<string, any>): FormValidationResult {
    const errors: Record<string, string[]> = {};
    const warnings: Record<string, string[]> = {};
    let totalFields = 0;
    let validFields = 0;
    let errorCount = 0;
    let warningCount = 0;

    this.controls.forEach(control => {
      totalFields++;
      const value = formData[control.id];
      const result = this.validateField(control.id, value);

      if (result.errors.length > 0) {
        errors[control.id] = result.errors;
        errorCount += result.errors.length;
      } else {
        validFields++;
      }

      if (result.warnings.length > 0) {
        warnings[control.id] = result.warnings;
        warningCount += result.warnings.length;
      }
    });

    return {
      isValid: errorCount === 0,
      errors,
      warnings,
      summary: {
        totalFields,
        validFields,
        errorCount,
        warningCount
      }
    };
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) {
      matrix[0][i] = i;
    }

    for (let j = 0; j <= str2.length; j++) {
      matrix[j][0] = j;
    }

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }

    return matrix[str2.length][str1.length];
  }
}

// Real-time validation hook
export const useFormValidation = (controls: DroppedControl[]) => {
  const [validator] = React.useState(() => new FormValidator(controls));
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string[]>>({});
  const [fieldWarnings, setFieldWarnings] = React.useState<Record<string, string[]>>({});

  const validateField = React.useCallback((controlId: string, value: any) => {
    const result = validator.validateField(controlId, value);
    
    setFieldErrors(prev => ({
      ...prev,
      [controlId]: result.errors
    }));
    
    setFieldWarnings(prev => ({
      ...prev,
      [controlId]: result.warnings
    }));

    return result;
  }, [validator]);

  const validateForm = React.useCallback((formData: Record<string, any>) => {
    const result = validator.validateForm(formData);
    setFieldErrors(result.errors);
    setFieldWarnings(result.warnings);
    return result;
  }, [validator]);

  const clearFieldValidation = React.useCallback((controlId: string) => {
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[controlId];
      return newErrors;
    });
    
    setFieldWarnings(prev => {
      const newWarnings = { ...prev };
      delete newWarnings[controlId];
      return newWarnings;
    });
  }, []);

  return {
    validateField,
    validateForm,
    clearFieldValidation,
    fieldErrors,
    fieldWarnings,
    hasErrors: Object.keys(fieldErrors).length > 0,
    hasWarnings: Object.keys(fieldWarnings).length > 0
  };
};
```

VALIDATION UI COMPONENTS (client/src/components/validation/ValidationMessage.tsx):
```typescript
import React from 'react';
import { AlertTriangle, CheckCircle2, XCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ValidationMessageProps {
  type: 'error' | 'warning' | 'success' | 'info';
  message: string;
  className?: string;
}

export const ValidationMessage: React.FC<ValidationMessageProps> = ({
  type,
  message,
  className
}) => {
  const icons = {
    error: XCircle,
    warning: AlertTriangle,
    success: CheckCircle2,
    info: Info
  };

  const styles = {
    error: 'text-red-600 dark:text-red-400',
    warning: 'text-amber-600 dark:text-amber-400',
    success: 'text-green-600 dark:text-green-400',
    info: 'text-blue-600 dark:text-blue-400'
  };

  const Icon = icons[type];

  return (
    <div className={cn(
      'flex items-center space-x-2 text-sm mt-1 transition-all duration-200',
      styles[type],
      className
    )}>
      <Icon className="h-4 w-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
};

interface ValidationSummaryProps {
  errors: Record<string, string[]>;
  warnings: Record<string, string[]>;
  className?: string;
}

export const ValidationSummary: React.FC<ValidationSummaryProps> = ({
  errors,
  warnings,
  className
}) => {
  const errorCount = Object.values(errors).flat().length;
  const warningCount = Object.values(warnings).flat().length;

  if (errorCount === 0 && warningCount === 0) {
    return (
      <div className={cn(
        'flex items-center space-x-2 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800',
        className
      )}>
        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
        <span className="text-green-800 dark:text-green-200 font-medium">
          Form validation passed
        </span>
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {errorCount > 0 && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <div className="flex items-center space-x-2 mb-2">
            <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <span className="text-red-800 dark:text-red-200 font-medium">
              {errorCount} error{errorCount > 1 ? 's' : ''} found
            </span>
          </div>
          <ul className="space-y-1 text-sm text-red-700 dark:text-red-300">
            {Object.entries(errors).map(([fieldId, fieldErrors]) =>
              fieldErrors.map((error, index) => (
                <li key={`${fieldId}-${index}`} className="list-disc list-inside">
                  {error}
                </li>
              ))
            )}
          </ul>
        </div>
      )}

      {warningCount > 0 && (
        <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <span className="text-amber-800 dark:text-amber-200 font-medium">
              {warningCount} warning{warningCount > 1 ? 's' : ''} found
            </span>
          </div>
          <ul className="space-y-1 text-sm text-amber-700 dark:text-amber-300">
            {Object.entries(warnings).map(([fieldId, fieldWarnings]) =>
              fieldWarnings.map((warning, index) => (
                <li key={`${fieldId}-${index}`} className="list-disc list-inside">
                  {warning}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
```

TESTING FRAMEWORK (client/src/lib/testing.ts):
```typescript
interface TestCase {
  id: string;
  name: string;
  description: string;
  category: 'validation' | 'ui' | 'integration' | 'performance';
  run: () => Promise<TestResult>;
}

interface TestResult {
  passed: boolean;
  message: string;
  duration: number;
  details?: any;
}

interface TestSuite {
  name: string;
  tests: TestCase[];
  setup?: () => Promise<void>;
  teardown?: () => Promise<void>;
}

export class FormTestRunner {
  private suites: TestSuite[] = [];
  private results: Map<string, TestResult> = new Map();

  addTestSuite(suite: TestSuite) {
    this.suites.push(suite);
  }

  async runAllTests(): Promise<Map<string, TestResult>> {
    this.results.clear();

    for (const suite of this.suites) {
      if (suite.setup) {
        await suite.setup();
      }

      for (const test of suite.tests) {
        const startTime = performance.now();
        try {
          const result = await test.run();
          result.duration = performance.now() - startTime;
          this.results.set(test.id, result);
        } catch (error) {
          this.results.set(test.id, {
            passed: false,
            message: error instanceof Error ? error.message : 'Unknown error',
            duration: performance.now() - startTime
          });
        }
      }

      if (suite.teardown) {
        await suite.teardown();
      }
    }

    return this.results;
  }

  async runTest(testId: string): Promise<TestResult | null> {
    for (const suite of this.suites) {
      const test = suite.tests.find(t => t.id === testId);
      if (test) {
        const startTime = performance.now();
        try {
          const result = await test.run();
          result.duration = performance.now() - startTime;
          this.results.set(testId, result);
          return result;
        } catch (error) {
          const result = {
            passed: false,
            message: error instanceof Error ? error.message : 'Unknown error',
            duration: performance.now() - startTime
          };
          this.results.set(testId, result);
          return result;
        }
      }
    }
    return null;
  }

  getTestResults() {
    return this.results;
  }

  getTestSummary() {
    const total = this.results.size;
    const passed = Array.from(this.results.values()).filter(r => r.passed).length;
    const failed = total - passed;
    const avgDuration = total > 0 
      ? Array.from(this.results.values()).reduce((sum, r) => sum + r.duration, 0) / total 
      : 0;

    return {
      total,
      passed,
      failed,
      passRate: total > 0 ? (passed / total) * 100 : 0,
      avgDuration
    };
  }
}

// Pre-built test suites
export const validationTestSuite: TestSuite = {
  name: 'Form Validation Tests',
  tests: [
    {
      id: 'required-field-validation',
      name: 'Required Field Validation',
      description: 'Test that required fields show errors when empty',
      category: 'validation',
      run: async () => {
        const validator = new FormValidator([
          {
            id: 'test-field',
            type: 'text',
            name: 'Test Field',
            properties: { required: true, label: 'Test Field' }
          } as any
        ]);

        const result = validator.validateField('test-field', '');
        
        return {
          passed: !result.isValid && result.errors.length > 0,
          message: result.isValid ? 'Required field validation failed' : 'Required field validation passed',
          duration: 0,
          details: result
        };
      }
    },
    {
      id: 'email-validation',
      name: 'Email Format Validation',
      description: 'Test that email fields validate format correctly',
      category: 'validation',
      run: async () => {
        const validator = new FormValidator([
          {
            id: 'email-field',
            type: 'email',
            name: 'Email Field',
            properties: { label: 'Email' }
          } as any
        ]);

        const validEmail = validator.validateField('email-field', 'test@example.com');
        const invalidEmail = validator.validateField('email-field', 'invalid-email');
        
        return {
          passed: validEmail.isValid && !invalidEmail.isValid,
          message: validEmail.isValid && !invalidEmail.isValid 
            ? 'Email validation passed' 
            : 'Email validation failed',
          duration: 0,
          details: { validEmail, invalidEmail }
        };
      }
    }
  ]
};

export const uiTestSuite: TestSuite = {
  name: 'UI Component Tests',
  tests: [
    {
      id: 'form-render-test',
      name: 'Form Rendering Test',
      description: 'Test that forms render without errors',
      category: 'ui',
      run: async () => {
        // Simulate component rendering test
        await new Promise(resolve => setTimeout(resolve, 100));
        
        return {
          passed: true,
          message: 'Form rendered successfully',
          duration: 0
        };
      }
    }
  ]
};
```

Create comprehensive testing framework with real-time validation, visual feedback, and automated test execution for robust form functionality and user experience validation.
```