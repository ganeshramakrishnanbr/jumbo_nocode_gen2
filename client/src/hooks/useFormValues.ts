import { useState, useCallback } from 'react';
import { DroppedControl } from '../types';

export interface FormValues {
  [controlId: string]: any;
}

export const useFormValues = () => {
  const [formValues, setFormValues] = useState<FormValues>({});

  const updateFormValue = useCallback((controlId: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [controlId]: value
    }));
  }, []);

  const getFormValue = useCallback((controlId: string) => {
    return formValues[controlId];
  }, [formValues]);

  const clearFormValues = useCallback(() => {
    setFormValues({});
  }, []);

  const generateSampleData = useCallback((controls: DroppedControl[]) => {
    const sampleValues: FormValues = {};
    
    controls.forEach(control => {
      switch (control.type) {
        case 'text':
          sampleValues[control.id] = control.properties.placeholder || 'Sample text input';
          break;
        case 'email':
          sampleValues[control.id] = 'user@example.com';
          break;
        case 'textarea':
          sampleValues[control.id] = 'This is a sample multi-line text response with more detailed information.';
          break;
        case 'number':
          sampleValues[control.id] = Math.floor(Math.random() * 100) + 1;
          break;
        case 'select':
          if (control.properties.options && control.properties.options.length > 0) {
            sampleValues[control.id] = control.properties.options[0];
          }
          break;
        case 'radio':
          if (control.properties.options && control.properties.options.length > 0) {
            sampleValues[control.id] = control.properties.options[Math.floor(Math.random() * control.properties.options.length)];
          }
          break;
        case 'checkbox':
          sampleValues[control.id] = Math.random() > 0.5;
          break;
        case 'date':
          sampleValues[control.id] = new Date().toISOString().split('T')[0];
          break;
        case 'phone':
          sampleValues[control.id] = '+1 (555) 123-4567';
          break;
        case 'url':
          sampleValues[control.id] = 'https://example.com';
          break;
        default:
          sampleValues[control.id] = `Sample ${control.type} value`;
      }
    });
    
    setFormValues(sampleValues);
  }, []);

  return {
    formValues,
    updateFormValue,
    getFormValue,
    clearFormValues,
    generateSampleData
  };
};