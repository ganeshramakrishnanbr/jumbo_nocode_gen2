# Jumbo No-Code Builder - Requirements Specification

## 1. Overview

The Jumbo No-Code Builder is a comprehensive, tier-based form building platform that enables users to create professional forms through an intuitive drag-and-drop interface. The system supports multiple customer tiers with varying levels of functionality and customization options, backed by persistent SQLite storage for reliable data management, and includes a complete library of 40+ professional form controls.

## 2. Functional Requirements

### 2.1 Customer Tier Selection System

#### 2.1.1 Tier Configuration
- **Platinum Tier**
  - 12 available layouts
  - Full theme control with custom CSS
  - Logo upload capability
  - Animation control features
  - 20 PDF generation templates
  - Access to all 40+ form controls
  - Premium visual experience

- **Gold Tier**
  - 8 available layouts
  - Preset themes with logo upload
  - Basic styling options
  - 12 PDF generation templates
  - Access to most form controls (35+ controls)
  - Enhanced visual experience

- **Silver Tier**
  - 5 available layouts
  - Preset themes with basic colors
  - 6 PDF generation templates
  - Access to standard form controls (25+ controls)
  - Standard visual experience

- **Bronze Tier**
  - 3 available layouts
  - Basic themes only
  - 3 PDF generation templates
  - Access to basic form controls (15+ controls)
  - Basic visual experience

#### 2.1.2 Tier-Based Feature Access
- Features must be enabled/disabled based on selected tier
- Visual indicators for tier-specific capabilities
- Upgrade prompts for restricted features
- Real-time tier switching for demonstration purposes
- Control availability filtering by tier

### 2.2 Core Application Structure

#### 2.2.1 Four-Panel Layout
- **Dashboard**: Questionnaire management and analytics overview with conditional header controls
- **Left Panel**: Control Library with 40+ categorized controls and search functionality
- **Center Panel**: Design Canvas with drag-and-drop functionality and section management
- **Right Panel**: Properties Panel for selected control configuration

#### 2.2.2 Header Configuration
- Logo/branding area
- Application title: "Jumbo No-Code Builder"
- Navigation tabs (Dashboard, Design, Preview, JSON)
- Conditional controls (Import, Export, Save, Tier selection) - visible only on Design, Preview, JSON tabs
- Theme toggle (Light/Dark mode) - always visible
- Action buttons with tooltips

#### 2.2.3 Footer Elements
- Copyright information
- Version information
- Current tier indicator
- Database connection status
- Control and section counts
- Current theme indicator

### 2.3 Dashboard Requirements

#### 2.3.1 Questionnaire Management
- **Overview Statistics**:
  - Total questionnaires count
  - Active/Inactive/Draft status counts
  - Total responses across all questionnaires
  - Average completion rate

- **Questionnaire List**:
  - Search and filter functionality
  - Status-based filtering (All, Active, Inactive, Draft)
  - Sortable columns (name, created date, status, responses)
  - Quick action buttons (Edit, Preview, Duplicate, Delete)

- **Recent Activity Feed**:
  - Real-time activity tracking
  - User attribution for changes
  - Timestamp information
  - Activity type indicators (Created, Updated, Published)

#### 2.3.2 Analytics Dashboard
- **Performance Metrics**:
  - Response rates by questionnaire
  - Completion time analytics
  - Drop-off point analysis
  - User engagement metrics

- **Visual Charts**:
  - Response trends over time
  - Completion rate comparisons
  - Popular control usage statistics
  - Tier-based feature utilization

### 2.4 Comprehensive Control Library & Properties

#### 2.4.1 Control Categories (9 Categories, 40+ Controls)

1. **Core Input Controls (8 controls)**
   - Text Box (single line with validation)
   - Multi-line Text (textarea with character limits)
   - Numeric Control (number input with decimal support)
   - Email Input (email validation and formatting)
   - Phone Number (international phone formatting)
   - URL Input (website link validation)
   - Password Field (strength validation and masking)
   - Rich Text Editor (WYSIWYG text editing)

2. **Date & Time Controls (3 controls)**
   - Date Picker (calendar widget with restrictions)
   - Time Picker (12/24 hour time selection)
   - Date Range Picker (start and end date selection)

3. **Selection Controls (10 controls)**
   - Dropdown (single selection with search)
   - Multi-Select Dropdown (multiple choice dropdown)
   - Radio Button (single selection button groups)
   - Checkbox (individual and grouped checkboxes)
   - Button Group (styled selection buttons)
   - Rating Scale (star or numeric ratings)
   - Slider (range slider for numeric input)
   - Toggle Switch (binary choice control)
   - Image Selection (visual option selection)
   - Tag Input (dynamic tag management)

4. **Grid & Matrix Controls (4 controls)**
   - Single Selective Grid (radio button matrix)
   - Multi Selective Grid (checkbox matrix)
   - Matrix Questions (survey-style question grids)
   - Ranking Control (drag-and-drop item ranking)

5. **File & Media Controls (4 controls)**
   - File Upload (multi-type file upload with restrictions)
   - Image Upload (image-specific upload with preview)
   - Signature Pad (digital signature capture)
   - Color Picker (visual color selection with formats)

6. **Advanced Input Controls (3 controls)**
   - Table Input (user-editable data tables)
   - Map Selector (location and address selection)
   - Barcode/QR Scanner (camera-based code scanning)

7. **Address Controls (7 controls)**
   - Address Line 1 (primary address field)
   - Address Line 2 (secondary address field)
   - City (city name with auto-complete)
   - State/Province (dropdown or text input)
   - ZIP/Postal Code (format validation by country)
   - Country (country selection with flags)
   - Complete Address Block (combined address control)

8. **Layout & Display Controls (5 controls)**
   - Label/Heading (customizable text headings)
   - Section Divider (visual separation lines)
   - Progress Bar (form completion indicator)
   - Repeater Section (duplicate field groups)
   - Conditional Section (show/hide based on logic)

9. **Validation & Security Controls (2 controls)**
   - Captcha (bot prevention with multiple types)
   - Terms & Conditions (legal text with acceptance)

#### 2.4.2 Control Properties System
Each control must support configuration through:
- **Basic Properties**: Label, placeholder, default value, required status
- **Section Properties**: Section assignment, grouping, order
- **Styling Properties**: Colors, fonts, spacing, borders, alignment
- **Behavior Properties**: Validation rules, conditional logic, dependencies
- **Data Properties**: Field mapping, data types, constraints, options
- **Advanced Properties**: Custom CSS, JavaScript events, API integration

### 2.5 Drag & Drop Interface

#### 2.5.1 Design Mode Functionality
- Drag controls from library to canvas
- Visual drop zones with feedback
- Ordered layout positioning (vertical sequence)
- Control selection and highlighting
- Drag to reorder controls within sections
- Property display on control click
- Visual indicators for required fields
- Real-time control rendering with proper styling

#### 2.5.2 Canvas Interactions
- Section-based control organization
- Undo/Redo operations
- Copy/paste controls
- Delete selected controls
- Move up/down controls
- Section assignment
- Real-time property updates
- Drag handles for reordering

### 2.6 Section-Based Organization System

#### 2.6.1 Section Management
- **Section Properties**:
  - Name and description
  - Color coding with custom colors
  - Icon assignment from Lucide React library
  - Display order
  - Required field count
  - Validation rules
  - Completion status

#### 2.6.2 Design Mode Section Features
- Create new sections with comprehensive properties
- Assign controls to sections
- Reorder sections
- Configure section properties (color, icon, description)
- Visual section grouping with tabs
- Section templates
- Default section protection (cannot be deleted but can be renamed)
- Edit and rename sections including the default "General Information" section

#### 2.6.3 Preview Mode Interface
- **Tab-Based Navigation**:
  - Dynamic tab generation from sections
  - Tab headers with names and icons
  - Tab completion indicators:
    - Green checkmark (completed)
    - Yellow warning (partial)
    - Empty circle (not started)
  - Progress bar across tabs
  - Tab validation before proceeding

#### 2.6.4 Tab Navigation Rules
- Sequential navigation (if enabled)
- Free navigation between tabs
- Validation blocking for required sections
- Save progress between tabs
- Tab state memory

### 2.7 Theme System Requirements

#### 2.7.1 Light/Dark Theme Support
- **Automatic Detection**: Respect system preferences
- **Manual Toggle**: Easy switching with theme toggle button
- **Persistent Preferences**: Theme choice saved across sessions
- **Smooth Transitions**: Professional animations between themes
- **Comprehensive Coverage**: All components support both themes

#### 2.7.2 Theme Implementation
- **Theme Hook**: Custom React hook for theme management
- **Tailwind Integration**: Dark mode classes throughout
- **Component Updates**: All components with dark mode variants
- **Visual Feedback**: Clear indication of current theme
- **Accessibility**: Proper contrast ratios in both themes

### 2.8 Data Persistence Requirements

#### 2.8.1 SQLite Database Schema
- **Questionnaires Table**:
  - Metadata (name, description, purpose, category)
  - Status tracking (Draft, Active, Inactive)
  - Version control information
  - Analytics data (responses, completion rates)
  - Tier configuration

- **Sections Table**:
  - Section properties (name, description, color, icon)
  - Ordering and hierarchy
  - Validation rules
  - Foreign key to questionnaire

- **Controls Table**:
  - Control type and properties
  - Position and sizing information
  - Section assignment
  - JSON properties storage
  - Foreign keys to questionnaire and section

#### 2.8.2 Database Operations
- **CRUD Operations**: Full Create, Read, Update, Delete support
- **Transaction Support**: Atomic operations for data consistency
- **Foreign Key Constraints**: Proper relational data integrity
- **Indexing**: Optimized queries for performance
- **Error Handling**: Graceful database error management

### 2.9 JSON Generation System

#### 2.9.1 Three-Layer JSON Structure
1. **Layer 1**: Form Definition
   - Control configurations
   - Section definitions
   - Validation rules
   - Basic settings

2. **Layer 2**: Customer Tier Configuration
   - Layout options
   - User experience settings
   - Feature availability
   - Customization options

3. **Layer 3**: PDF Generation Configuration
   - Template selection
   - Styling options
   - Output formats
   - Tier-specific templates

### 2.10 Conditional Interface Requirements

#### 2.10.1 Context-Sensitive Controls
- **Dashboard Mode**: Show only logo, title, tabs, and theme toggle
- **Form Building Modes**: Show all controls (Import, Export, Save, Tier selection)
- **Theme Toggle**: Always visible across all modes
- **Professional Appearance**: Clean, focused interface for each mode

### 2.11 Advanced Control Features

#### 2.11.1 Control Dependencies
- **Conditional Logic**: Controls can depend on other control values
- **Dependency Types**: Equals, not equals, contains, greater than, less than, is empty, is not empty
- **Visual Indicators**: Clear indication of conditional controls
- **Real-time Updates**: Dependencies work immediately in preview mode
- **First Control Protection**: First control in each section is always visible

#### 2.11.2 Control Management
- **Delete Functionality**: Safe deletion with first-control protection
- **Required Field Indicators**: Red asterisk positioned before label text
- **Visual Feedback**: Hover states, selection indicators, and action buttons
- **Database Integration**: All changes persisted to SQLite database

### 2.12 Section Customization

#### 2.12.1 Default Section Management
- **Rename Capability**: Users can rename the "General Information" section
- **Protection**: Default section cannot be deleted but can be fully customized
- **Visual Indicators**: Clear distinction between default and custom sections
- **Customization Options**: Name, description, color, icon can all be modified

#### 2.12.2 Custom Section Features
- **Full CRUD Operations**: Create, read, update, delete for custom sections
- **Visual Customization**: Color coding, icon selection, and styling options
- **Ordering**: Drag and drop section reordering
- **Validation**: Section-level validation rules and requirements

## 3. Non-Functional Requirements

### 3.1 Performance Requirements
- Application startup time: < 3 seconds (including database initialization)
- Form loading time: < 2 seconds
- Drag operation response: < 100ms
- JSON generation: < 1 second
- Database query response: < 500ms
- Support for forms with 100+ controls
- Smooth animations and transitions
- Theme switching: < 200ms

### 3.2 Usability Requirements
- Intuitive drag-and-drop interface
- Minimal learning curve for basic operations
- Contextual help and tooltips
- Keyboard shortcuts for power users
- Responsive design for various screen sizes
- Accessibility compliance (WCAG 2.1 AA)
- Loading indicators for all async operations
- Professional visual design

### 3.3 Compatibility Requirements
- Modern web browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Desktop-first design with tablet support
- JavaScript enabled environments
- SQLite support via WebAssembly
- Local storage for temporary data
- Theme persistence across sessions

### 3.4 Security Requirements
- Client-side data validation
- XSS protection for custom HTML
- Safe JSON parsing and generation
- Local database encryption capabilities
- Input sanitization for all user inputs
- Secure handling of file uploads

### 3.5 Reliability Requirements
- **Data Persistence**: All data must survive browser refreshes
- **Error Recovery**: Graceful handling of database errors
- **Data Integrity**: ACID compliance for all database operations
- **Backup Capabilities**: Export/import functionality for data backup
- **Offline Support**: Basic functionality without network connectivity
- **Theme Reliability**: Consistent theme application across all components

## 4. Technical Requirements

### 4.1 Technology Stack
- **Frontend**: React 18+ with TypeScript
- **Styling**: Tailwind CSS with dark mode support
- **Icons**: Lucide React icon library (40+ icons)
- **Drag & Drop**: React DnD library
- **Database**: SQLite via @libsql/client
- **Build Tool**: Vite for development and production builds
- **State Management**: React hooks and context

### 4.2 Code Quality Requirements
- TypeScript strict mode
- ESLint configuration for code quality
- Component-based architecture
- Proper separation of concerns
- Modular and reusable components
- Comprehensive error handling
- Database abstraction layer
- Theme system integration

### 4.3 Data Management
- Immutable state management
- Efficient re-rendering strategies
- SQLite database for persistence
- JSON schema validation
- Export/import capabilities
- Real-time UI synchronization with database
- Theme state persistence

### 4.4 Database Requirements
- **SQLite Integration**: Full SQLite database support
- **Schema Management**: Proper table structure and relationships
- **Migration Support**: Database schema versioning
- **Performance Optimization**: Indexed queries and efficient operations
- **Data Validation**: Schema-level data validation
- **Backup/Restore**: Database export and import capabilities

## 5. Integration Requirements

### 5.1 Export Capabilities
- JSON configuration export
- PDF form generation (tier-dependent)
- Excel template export
- HTML form export
- Print-friendly formats
- Database backup export

### 5.2 Import Capabilities
- JSON configuration import
- Excel template import
- Form template library
- Drag-and-drop file imports
- Database restore import

## 6. Control-Specific Requirements

### 6.1 Core Input Controls
- Text validation and formatting
- Character limits and validation
- Placeholder text support
- Required field indicators
- Input masking for phone/date formats

### 6.2 Selection Controls
- Dynamic option management
- Search functionality for dropdowns
- Multi-selection limits
- Visual selection indicators
- Keyboard navigation support

### 6.3 Grid & Matrix Controls
- Dynamic row/column configuration
- Cell-level validation
- Export to spreadsheet formats
- Responsive grid layouts
- Accessibility for screen readers

### 6.4 File & Media Controls
- File type restrictions
- Size limitations
- Preview functionality
- Progress indicators
- Error handling for uploads

### 6.5 Address Controls
- International address formats
- Auto-complete functionality
- Validation by country
- Geocoding integration (future)
- Address standardization

## 7. Constraints & Assumptions

### 7.1 Technical Constraints
- Browser-based application (no native mobile apps)
- WebContainer environment limitations
- SQLite via JavaScript/WebAssembly only
- No real-time collaboration in MVP
- Limited offline functionality

### 7.2 Business Constraints
- Tier-based feature limitations
- Template availability by tier
- Customization depth by tier
- Export format restrictions by tier
- Control availability by tier

### 7.3 Assumptions
- Users have modern web browsers
- Basic familiarity with form building concepts
- Adequate screen size for development work
- Stable browser environment for SQLite operations
- Theme preferences are personal choices

## 8. Success Criteria

### 8.1 Functional Success
- All 40+ control types render correctly
- Drag-and-drop operations work smoothly
- Properties panel updates reflect in real-time
- JSON export produces valid configurations
- Tier-based features are properly restricted
- Section-based navigation functions correctly
- Database operations complete successfully
- Data persists across browser sessions
- Theme switching works seamlessly
- Control dependencies function properly
- Section renaming works for all sections including default

### 8.2 Performance Success
- Application loads within 3 seconds
- Database initialization completes within 2 seconds
- Smooth drag operations with minimal lag
- Responsive interface interactions
- Efficient memory usage for large forms
- Fast database query performance
- Smooth theme transitions

### 8.3 User Experience Success
- Intuitive interface requiring minimal training
- Professional visual design in both themes
- Consistent behavior across features
- Clear visual feedback for all actions
- Accessible to users with disabilities
- Reliable data persistence and recovery
- Context-appropriate interface controls
- Flexible section customization

### 8.4 Data Integrity Success
- No data loss during operations
- Consistent database state
- Proper foreign key relationships
- Successful backup and restore operations
- Error recovery without data corruption
- Theme preferences persist correctly

---

This requirements specification serves as the foundation for the Jumbo No-Code Builder application with SQLite integration, comprehensive control library, theme support, conditional interface controls, advanced control features, and section management capabilities, ensuring all stakeholders have a clear understanding of the system's capabilities, constraints, and success criteria including comprehensive data persistence and user experience requirements.