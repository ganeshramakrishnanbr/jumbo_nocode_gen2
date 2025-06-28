import { ControlType } from '../types';

export const CONTROL_CATEGORIES = [
  'Core Input',
  'Date & Time',
  'Selection',
  'Grid & Matrix',
  'File & Media',
  'Advanced Input',
  'Address',
  'Layout & Display',
  'Validation & Security'
];

export const CONTROLS: ControlType[] = [
  // Core Input Controls
  {
    id: 'text-input',
    type: 'textInput',
    category: 'Core Input',
    name: 'Text Box',
    icon: 'Type',
    description: 'Single line text input field',
    properties: [
      { name: 'label', type: 'text', value: 'Text Input' },
      { name: 'placeholder', type: 'text', value: 'Enter text...' },
      { name: 'required', type: 'boolean', value: false },
      { name: 'maxLength', type: 'number', value: 100 },
      { name: 'minLength', type: 'number', value: 0 }
    ]
  },
  {
    id: 'textarea',
    type: 'textarea',
    category: 'Core Input',
    name: 'Multi-line Text',
    icon: 'AlignLeft',
    description: 'Multi-line text input field',
    properties: [
      { name: 'label', type: 'text', value: 'Textarea' },
      { name: 'placeholder', type: 'text', value: 'Enter multiple lines...' },
      { name: 'rows', type: 'number', value: 4 },
      { name: 'required', type: 'boolean', value: false },
      { name: 'maxLength', type: 'number', value: 500 }
    ]
  },
  {
    id: 'number-input',
    type: 'numberInput',
    category: 'Core Input',
    name: 'Numeric Control',
    icon: 'Hash',
    description: 'Numeric input field with validation',
    properties: [
      { name: 'label', type: 'text', value: 'Number Input' },
      { name: 'min', type: 'number', value: 0 },
      { name: 'max', type: 'number', value: 100 },
      { name: 'step', type: 'number', value: 1 },
      { name: 'decimalPlaces', type: 'number', value: 0 },
      { name: 'required', type: 'boolean', value: false }
    ]
  },
  {
    id: 'email-input',
    type: 'emailInput',
    category: 'Core Input',
    name: 'Email Input',
    icon: 'Mail',
    description: 'Email input with validation',
    properties: [
      { name: 'label', type: 'text', value: 'Email Address' },
      { name: 'placeholder', type: 'text', value: 'Enter email address...' },
      { name: 'required', type: 'boolean', value: false }
    ]
  },
  {
    id: 'phone-input',
    type: 'phoneInput',
    category: 'Core Input',
    name: 'Phone Number',
    icon: 'Phone',
    description: 'Phone number input with formatting',
    properties: [
      { name: 'label', type: 'text', value: 'Phone Number' },
      { name: 'placeholder', type: 'text', value: '(555) 123-4567' },
      { name: 'countryCode', type: 'text', value: '+1' },
      { name: 'required', type: 'boolean', value: false }
    ]
  },
  {
    id: 'url-input',
    type: 'urlInput',
    category: 'Core Input',
    name: 'URL Input',
    icon: 'Link',
    description: 'Website URL input with validation',
    properties: [
      { name: 'label', type: 'text', value: 'Website URL' },
      { name: 'placeholder', type: 'text', value: 'https://example.com' },
      { name: 'required', type: 'boolean', value: false }
    ]
  },
  {
    id: 'password-input',
    type: 'passwordInput',
    category: 'Core Input',
    name: 'Password Field',
    icon: 'Lock',
    description: 'Password input with strength validation',
    properties: [
      { name: 'label', type: 'text', value: 'Password' },
      { name: 'placeholder', type: 'text', value: 'Enter password...' },
      { name: 'minLength', type: 'number', value: 8 },
      { name: 'requireUppercase', type: 'boolean', value: false },
      { name: 'requireNumbers', type: 'boolean', value: false },
      { name: 'required', type: 'boolean', value: false }
    ]
  },
  {
    id: 'rich-text-editor',
    type: 'richTextEditor',
    category: 'Core Input',
    name: 'Rich Text Editor',
    icon: 'Edit3',
    description: 'Rich text editor with formatting options',
    properties: [
      { name: 'label', type: 'text', value: 'Rich Text' },
      { name: 'placeholder', type: 'text', value: 'Enter formatted text...' },
      { name: 'toolbar', type: 'text', value: 'bold,italic,underline,link' },
      { name: 'maxLength', type: 'number', value: 1000 },
      { name: 'required', type: 'boolean', value: false }
    ]
  },

  // Date & Time Controls
  {
    id: 'date-picker',
    type: 'datePicker',
    category: 'Date & Time',
    name: 'Date Picker',
    icon: 'Calendar',
    description: 'Date selection with calendar widget',
    properties: [
      { name: 'label', type: 'text', value: 'Date Picker' },
      { name: 'format', type: 'select', value: 'YYYY-MM-DD', options: ['YYYY-MM-DD', 'MM/DD/YYYY', 'DD/MM/YYYY'] },
      { name: 'minDate', type: 'text', value: '' },
      { name: 'maxDate', type: 'text', value: '' },
      { name: 'required', type: 'boolean', value: false }
    ]
  },
  {
    id: 'time-picker',
    type: 'timePicker',
    category: 'Date & Time',
    name: 'Time Picker',
    icon: 'Clock',
    description: 'Time selection input',
    properties: [
      { name: 'label', type: 'text', value: 'Time Picker' },
      { name: 'format', type: 'select', value: '24h', options: ['12h', '24h'] },
      { name: 'step', type: 'number', value: 15 },
      { name: 'required', type: 'boolean', value: false }
    ]
  },
  {
    id: 'date-range-picker',
    type: 'dateRangePicker',
    category: 'Date & Time',
    name: 'Date Range Picker',
    icon: 'CalendarRange',
    description: 'Start and end date selection',
    properties: [
      { name: 'label', type: 'text', value: 'Date Range' },
      { name: 'format', type: 'select', value: 'YYYY-MM-DD', options: ['YYYY-MM-DD', 'MM/DD/YYYY', 'DD/MM/YYYY'] },
      { name: 'maxRange', type: 'number', value: 365 },
      { name: 'required', type: 'boolean', value: false }
    ]
  },

  // Selection Controls
  {
    id: 'dropdown',
    type: 'dropdown',
    category: 'Selection',
    name: 'Dropdown',
    icon: 'ChevronDown',
    description: 'Single selection dropdown',
    properties: [
      { name: 'label', type: 'text', value: 'Dropdown' },
      { name: 'options', type: 'text', value: 'Option 1,Option 2,Option 3' },
      { name: 'searchable', type: 'boolean', value: false },
      { name: 'required', type: 'boolean', value: false }
    ]
  },
  {
    id: 'multi-select-dropdown',
    type: 'multiSelectDropdown',
    category: 'Selection',
    name: 'Multi-Select Dropdown',
    icon: 'List',
    description: 'Multiple selection dropdown',
    properties: [
      { name: 'label', type: 'text', value: 'Multi-Select' },
      { name: 'options', type: 'text', value: 'Option 1,Option 2,Option 3' },
      { name: 'maxSelections', type: 'number', value: 0 },
      { name: 'searchable', type: 'boolean', value: true },
      { name: 'required', type: 'boolean', value: false }
    ]
  },
  {
    id: 'radio-group',
    type: 'radioGroup',
    category: 'Selection',
    name: 'Radio Button',
    icon: 'Circle',
    description: 'Single selection radio buttons',
    properties: [
      { name: 'label', type: 'text', value: 'Radio Group' },
      { name: 'options', type: 'text', value: 'Option 1,Option 2,Option 3' },
      { name: 'layout', type: 'select', value: 'vertical', options: ['vertical', 'horizontal'] },
      { name: 'required', type: 'boolean', value: false }
    ]
  },
  {
    id: 'checkbox-group',
    type: 'checkboxGroup',
    category: 'Selection',
    name: 'Checkbox',
    icon: 'CheckSquare',
    description: 'Multiple selection checkboxes',
    properties: [
      { name: 'label', type: 'text', value: 'Checkbox Group' },
      { name: 'options', type: 'text', value: 'Option 1,Option 2,Option 3' },
      { name: 'layout', type: 'select', value: 'vertical', options: ['vertical', 'horizontal'] },
      { name: 'maxSelections', type: 'number', value: 0 },
      { name: 'required', type: 'boolean', value: false }
    ]
  },
  {
    id: 'button-group',
    type: 'buttonGroup',
    category: 'Selection',
    name: 'Button Group',
    icon: 'MoreHorizontal',
    description: 'Styled buttons for selection',
    properties: [
      { name: 'label', type: 'text', value: 'Button Group' },
      { name: 'options', type: 'text', value: 'Option 1,Option 2,Option 3' },
      { name: 'selectionType', type: 'select', value: 'single', options: ['single', 'multiple'] },
      { name: 'required', type: 'boolean', value: false }
    ]
  },
  {
    id: 'rating-scale',
    type: 'ratingScale',
    category: 'Selection',
    name: 'Rating Scale',
    icon: 'Star',
    description: 'Star or numeric rating scale',
    properties: [
      { name: 'label', type: 'text', value: 'Rating' },
      { name: 'scaleType', type: 'select', value: 'stars', options: ['stars', 'numbers'] },
      { name: 'maxValue', type: 'number', value: 5 },
      { name: 'required', type: 'boolean', value: false }
    ]
  },
  {
    id: 'slider',
    type: 'slider',
    category: 'Selection',
    name: 'Slider',
    icon: 'Sliders',
    description: 'Range slider for numeric input',
    properties: [
      { name: 'label', type: 'text', value: 'Slider' },
      { name: 'min', type: 'number', value: 0 },
      { name: 'max', type: 'number', value: 100 },
      { name: 'step', type: 'number', value: 1 },
      { name: 'defaultValue', type: 'number', value: 50 },
      { name: 'required', type: 'boolean', value: false }
    ]
  },
  {
    id: 'toggle-switch',
    type: 'toggleSwitch',
    category: 'Selection',
    name: 'Toggle Switch',
    icon: 'ToggleLeft',
    description: 'Binary choice control',
    properties: [
      { name: 'label', type: 'text', value: 'Toggle Switch' },
      { name: 'onLabel', type: 'text', value: 'On' },
      { name: 'offLabel', type: 'text', value: 'Off' },
      { name: 'defaultState', type: 'boolean', value: false },
      { name: 'required', type: 'boolean', value: false }
    ]
  },
  {
    id: 'image-selection',
    type: 'imageSelection',
    category: 'Selection',
    name: 'Image Selection',
    icon: 'Image',
    description: 'Choose from image options',
    properties: [
      { name: 'label', type: 'text', value: 'Image Selection' },
      { name: 'imageUrls', type: 'text', value: 'https://via.placeholder.com/150,https://via.placeholder.com/150' },
      { name: 'selectionType', type: 'select', value: 'single', options: ['single', 'multiple'] },
      { name: 'required', type: 'boolean', value: false }
    ]
  },
  {
    id: 'tag-input',
    type: 'tagInput',
    category: 'Selection',
    name: 'Tag Input',
    icon: 'Tag',
    description: 'Add/remove tags dynamically',
    properties: [
      { name: 'label', type: 'text', value: 'Tags' },
      { name: 'predefinedTags', type: 'text', value: 'Tag1,Tag2,Tag3' },
      { name: 'allowCustomTags', type: 'boolean', value: true },
      { name: 'maxTags', type: 'number', value: 10 },
      { name: 'required', type: 'boolean', value: false }
    ]
  },

  // Grid & Matrix Controls
  {
    id: 'single-selective-grid',
    type: 'singleSelectiveGrid',
    category: 'Grid & Matrix',
    name: 'Single Selective Grid',
    icon: 'Grid3X3',
    description: 'Grid with radio button groups',
    properties: [
      { name: 'label', type: 'text', value: 'Single Selective Grid' },
      { name: 'rowLabels', type: 'text', value: 'Row 1,Row 2,Row 3' },
      { name: 'columnOptions', type: 'text', value: 'Option 1,Option 2,Option 3' },
      { name: 'required', type: 'boolean', value: false }
    ]
  },
  {
    id: 'multi-selective-grid',
    type: 'multiSelectiveGrid',
    category: 'Grid & Matrix',
    name: 'Multi Selective Grid',
    icon: 'Grid3X3',
    description: 'Grid with checkbox groups',
    properties: [
      { name: 'label', type: 'text', value: 'Multi Selective Grid' },
      { name: 'rowLabels', type: 'text', value: 'Row 1,Row 2,Row 3' },
      { name: 'columnOptions', type: 'text', value: 'Option 1,Option 2,Option 3' },
      { name: 'required', type: 'boolean', value: false }
    ]
  },
  {
    id: 'matrix-questions',
    type: 'matrixQuestions',
    category: 'Grid & Matrix',
    name: 'Matrix Questions',
    icon: 'Table',
    description: 'Multiple questions with same answers',
    properties: [
      { name: 'label', type: 'text', value: 'Matrix Questions' },
      { name: 'questions', type: 'text', value: 'Question 1,Question 2,Question 3' },
      { name: 'answers', type: 'text', value: 'Strongly Agree,Agree,Neutral,Disagree,Strongly Disagree' },
      { name: 'required', type: 'boolean', value: false }
    ]
  },
  {
    id: 'ranking-control',
    type: 'rankingControl',
    category: 'Grid & Matrix',
    name: 'Ranking Control',
    icon: 'ArrowUpDown',
    description: 'Drag and drop to rank items',
    properties: [
      { name: 'label', type: 'text', value: 'Ranking' },
      { name: 'items', type: 'text', value: 'Item 1,Item 2,Item 3,Item 4' },
      { name: 'rankingMethod', type: 'select', value: 'drag-drop', options: ['drag-drop', 'numbered'] },
      { name: 'required', type: 'boolean', value: false }
    ]
  },

  // File & Media Controls
  {
    id: 'file-upload',
    type: 'fileUpload',
    category: 'File & Media',
    name: 'File Upload',
    icon: 'Upload',
    description: 'File upload with type restrictions',
    properties: [
      { name: 'label', type: 'text', value: 'File Upload' },
      { name: 'accept', type: 'text', value: '.pdf,.doc,.docx' },
      { name: 'multiple', type: 'boolean', value: false },
      { name: 'maxSize', type: 'number', value: 10 },
      { name: 'required', type: 'boolean', value: false }
    ]
  },
  {
    id: 'image-upload',
    type: 'imageUpload',
    category: 'File & Media',
    name: 'Image Upload',
    icon: 'ImagePlus',
    description: 'Image upload with preview',
    properties: [
      { name: 'label', type: 'text', value: 'Image Upload' },
      { name: 'accept', type: 'text', value: '.jpg,.jpeg,.png,.gif' },
      { name: 'multiple', type: 'boolean', value: false },
      { name: 'maxSize', type: 'number', value: 5 },
      { name: 'showPreview', type: 'boolean', value: true },
      { name: 'required', type: 'boolean', value: false }
    ]
  },
  {
    id: 'signature-pad',
    type: 'signaturePad',
    category: 'File & Media',
    name: 'Signature Pad',
    icon: 'PenTool',
    description: 'Digital signature capture',
    properties: [
      { name: 'label', type: 'text', value: 'Signature' },
      { name: 'canvasWidth', type: 'number', value: 400 },
      { name: 'canvasHeight', type: 'number', value: 200 },
      { name: 'lineColor', type: 'color', value: '#000000' },
      { name: 'required', type: 'boolean', value: false }
    ]
  },
  {
    id: 'color-picker',
    type: 'colorPicker',
    category: 'File & Media',
    name: 'Color Picker',
    icon: 'Palette',
    description: 'Visual color selection',
    properties: [
      { name: 'label', type: 'text', value: 'Color Picker' },
      { name: 'defaultColor', type: 'color', value: '#3B82F6' },
      { name: 'format', type: 'select', value: 'hex', options: ['hex', 'rgb', 'hsl'] },
      { name: 'showPalette', type: 'boolean', value: true },
      { name: 'required', type: 'boolean', value: false }
    ]
  },

  // Advanced Input Controls
  {
    id: 'table-input',
    type: 'tableInput',
    category: 'Advanced Input',
    name: 'Table Input',
    icon: 'Table2',
    description: 'User-editable data table',
    properties: [
      { name: 'label', type: 'text', value: 'Table Input' },
      { name: 'columnHeaders', type: 'text', value: 'Column 1,Column 2,Column 3' },
      { name: 'maxRows', type: 'number', value: 10 },
      { name: 'allowAddRows', type: 'boolean', value: true },
      { name: 'required', type: 'boolean', value: false }
    ]
  },
  {
    id: 'map-selector',
    type: 'mapSelector',
    category: 'Advanced Input',
    name: 'Map Selector',
    icon: 'MapPin',
    description: 'Location/address selection',
    properties: [
      { name: 'label', type: 'text', value: 'Location' },
      { name: 'defaultLat', type: 'number', value: 40.7128 },
      { name: 'defaultLng', type: 'number', value: -74.0060 },
      { name: 'zoomLevel', type: 'number', value: 10 },
      { name: 'required', type: 'boolean', value: false }
    ]
  },
  {
    id: 'barcode-scanner',
    type: 'barcodeScanner',
    category: 'Advanced Input',
    name: 'Barcode/QR Scanner',
    icon: 'QrCode',
    description: 'Scan codes via camera',
    properties: [
      { name: 'label', type: 'text', value: 'Barcode Scanner' },
      { name: 'codeTypes', type: 'text', value: 'QR,Code128,EAN13' },
      { name: 'allowManualEntry', type: 'boolean', value: true },
      { name: 'required', type: 'boolean', value: false }
    ]
  },

  // Address Controls
  {
    id: 'address-line-1',
    type: 'addressLine1',
    category: 'Address',
    name: 'Address Line 1',
    icon: 'MapPin',
    description: 'Primary address field',
    properties: [
      { name: 'label', type: 'text', value: 'Address Line 1' },
      { name: 'placeholder', type: 'text', value: 'Street address' },
      { name: 'maxLength', type: 'number', value: 100 },
      { name: 'required', type: 'boolean', value: false }
    ]
  },
  {
    id: 'address-line-2',
    type: 'addressLine2',
    category: 'Address',
    name: 'Address Line 2',
    icon: 'MapPin',
    description: 'Secondary address field',
    properties: [
      { name: 'label', type: 'text', value: 'Address Line 2' },
      { name: 'placeholder', type: 'text', value: 'Apartment, suite, etc.' },
      { name: 'maxLength', type: 'number', value: 100 },
      { name: 'required', type: 'boolean', value: false }
    ]
  },
  {
    id: 'city',
    type: 'city',
    category: 'Address',
    name: 'City',
    icon: 'Building',
    description: 'City name with suggestions',
    properties: [
      { name: 'label', type: 'text', value: 'City' },
      { name: 'placeholder', type: 'text', value: 'Enter city name' },
      { name: 'autoComplete', type: 'boolean', value: true },
      { name: 'required', type: 'boolean', value: false }
    ]
  },
  {
    id: 'state-province',
    type: 'stateProvince',
    category: 'Address',
    name: 'State/Province',
    icon: 'Map',
    description: 'State dropdown or text input',
    properties: [
      { name: 'label', type: 'text', value: 'State/Province' },
      { name: 'inputType', type: 'select', value: 'dropdown', options: ['dropdown', 'text'] },
      { name: 'country', type: 'text', value: 'US' },
      { name: 'required', type: 'boolean', value: false }
    ]
  },
  {
    id: 'zip-postal',
    type: 'zipPostal',
    category: 'Address',
    name: 'ZIP/Postal Code',
    icon: 'Hash',
    description: 'ZIP code with format validation',
    properties: [
      { name: 'label', type: 'text', value: 'ZIP/Postal Code' },
      { name: 'placeholder', type: 'text', value: '12345' },
      { name: 'country', type: 'text', value: 'US' },
      { name: 'formatValidation', type: 'boolean', value: true },
      { name: 'required', type: 'boolean', value: false }
    ]
  },
  {
    id: 'country',
    type: 'country',
    category: 'Address',
    name: 'Country',
    icon: 'Globe',
    description: 'Country selection dropdown',
    properties: [
      { name: 'label', type: 'text', value: 'Country' },
      { name: 'defaultCountry', type: 'text', value: 'United States' },
      { name: 'showFlags', type: 'boolean', value: true },
      { name: 'required', type: 'boolean', value: false }
    ]
  },
  {
    id: 'complete-address',
    type: 'completeAddress',
    category: 'Address',
    name: 'Complete Address Block',
    icon: 'MapPin',
    description: 'Combined address control with all fields',
    properties: [
      { name: 'label', type: 'text', value: 'Complete Address' },
      { name: 'includeAddressLine2', type: 'boolean', value: true },
      { name: 'defaultCountry', type: 'text', value: 'US' },
      { name: 'autoFill', type: 'boolean', value: true },
      { name: 'required', type: 'boolean', value: false }
    ]
  },

  // Layout & Display Controls
  {
    id: 'heading',
    type: 'heading',
    category: 'Layout & Display',
    name: 'Label/Heading',
    icon: 'Heading',
    description: 'Text heading element',
    properties: [
      { name: 'text', type: 'text', value: 'Heading Text' },
      { name: 'level', type: 'select', value: 'h2', options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] },
      { name: 'alignment', type: 'select', value: 'left', options: ['left', 'center', 'right'] },
      { name: 'fontSize', type: 'select', value: 'medium', options: ['small', 'medium', 'large', 'xl'] },
      { name: 'color', type: 'color', value: '#000000' }
    ]
  },
  {
    id: 'section-divider',
    type: 'sectionDivider',
    category: 'Layout & Display',
    name: 'Section Divider',
    icon: 'Minus',
    description: 'Visual separation lines',
    properties: [
      { name: 'style', type: 'select', value: 'solid', options: ['solid', 'dashed', 'dotted'] },
      { name: 'thickness', type: 'number', value: 1 },
      { name: 'color', type: 'color', value: '#e5e7eb' },
      { name: 'spacing', type: 'select', value: 'medium', options: ['small', 'medium', 'large'] }
    ]
  },
  {
    id: 'progress-bar',
    type: 'progressBar',
    category: 'Layout & Display',
    name: 'Progress Bar',
    icon: 'BarChart3',
    description: 'Form completion indicator',
    properties: [
      { name: 'label', type: 'text', value: 'Progress' },
      { name: 'showPercentage', type: 'boolean', value: true },
      { name: 'color', type: 'color', value: '#3B82F6' },
      { name: 'position', type: 'select', value: 'top', options: ['top', 'bottom'] }
    ]
  },
  {
    id: 'repeater-section',
    type: 'repeaterSection',
    category: 'Layout & Display',
    name: 'Repeater Section',
    icon: 'Copy',
    description: 'Duplicate field groups',
    properties: [
      { name: 'label', type: 'text', value: 'Repeater Section' },
      { name: 'minRepeats', type: 'number', value: 1 },
      { name: 'maxRepeats', type: 'number', value: 10 },
      { name: 'addLabel', type: 'text', value: 'Add Item' },
      { name: 'removeLabel', type: 'text', value: 'Remove Item' }
    ]
  },
  {
    id: 'conditional-section',
    type: 'conditionalSection',
    category: 'Layout & Display',
    name: 'Conditional Section',
    icon: 'Eye',
    description: 'Show/hide sections based on conditions',
    properties: [
      { name: 'label', type: 'text', value: 'Conditional Section' },
      { name: 'condition', type: 'text', value: 'field_id == "value"' },
      { name: 'animation', type: 'select', value: 'fade', options: ['none', 'fade', 'slide'] }
    ]
  },

  // Validation & Security Controls
  {
    id: 'captcha',
    type: 'captcha',
    category: 'Validation & Security',
    name: 'Captcha',
    icon: 'Shield',
    description: 'Bot prevention control',
    properties: [
      { name: 'label', type: 'text', value: 'Captcha Verification' },
      { name: 'type', type: 'select', value: 'image', options: ['image', 'text', 'recaptcha'] },
      { name: 'difficulty', type: 'select', value: 'medium', options: ['easy', 'medium', 'hard'] },
      { name: 'required', type: 'boolean', value: true }
    ]
  },
  {
    id: 'terms-conditions',
    type: 'termsConditions',
    category: 'Validation & Security',
    name: 'Terms & Conditions',
    icon: 'FileText',
    description: 'Legal text with checkbox',
    properties: [
      { name: 'label', type: 'text', value: 'Terms & Conditions' },
      { name: 'text', type: 'text', value: 'I agree to the terms and conditions' },
      { name: 'linkText', type: 'text', value: 'View Terms' },
      { name: 'linkUrl', type: 'text', value: '/terms' },
      { name: 'expandable', type: 'boolean', value: true },
      { name: 'required', type: 'boolean', value: true }
    ]
  }
];