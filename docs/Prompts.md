# Jumbo No-Code Form Builder - Development Prompts

This document contains comprehensive prompts for recreating the Jumbo No-Code Form Builder project from scratch. Each section provides specific prompts that can be used with AI development assistants to build individual features while maintaining architectural consistency.

## Important Guidelines

⚠️ **CRITICAL**: When using these prompts, always include this instruction:
> "Don't override any existing functionality when adding new features. Preserve all current components, hooks, and logic while extending the system."

## 1. Project Initialization Prompts

### 1.1 Basic Project Setup
```
Create a full-stack TypeScript React application with the following specifications:

ARCHITECTURE:
- Frontend: React 18+ with TypeScript, Vite build system
- Backend: Express.js with TypeScript
- Database: PostgreSQL with Drizzle ORM
- UI: Radix UI primitives with shadcn/ui components
- Styling: Tailwind CSS with dark mode support
- Build: Vite for frontend, esbuild for backend

PROJECT STRUCTURE:
- /client - React frontend application
- /server - Express backend with TypeScript
- /shared - Shared TypeScript types and schemas
- /docs - Documentation files

DEPENDENCIES:
- Core: React, TypeScript, Express, Drizzle ORM
- UI: @radix-ui/*, shadcn/ui, Tailwind CSS, Lucide React
- DnD: react-dnd, react-dnd-html5-backend
- Forms: react-hook-form, @hookform/resolvers, zod
- Utils: date-fns, nanoid, clsx, tailwind-merge

CONFIGURATION:
- TypeScript with strict mode
- ESLint and Prettier for code formatting
- Tailwind with dark mode class strategy
- Vite with React plugin and HMR
- PostCSS with autoprefixer

Set up the basic folder structure and configuration files.
```

### 1.2 Database Schema Setup
```
Create a comprehensive database schema using Drizzle ORM for a form builder application:

TABLES NEEDED:
1. questionnaires - Form metadata (id, name, description, purpose, category, status, tier)
2. sections - Form sections (id, questionnaire_id, name, description, color, icon, section_order, required)
3. controls - Form controls (id, questionnaire_id, section_id, type, name, properties, x, y, width, height)
4. users - User management (id, username, email, password_hash, created_at)

REQUIREMENTS:
- Use PostgreSQL dialect
- Include proper foreign key relationships
- Add Zod validation schemas for each table
- Create insert and select type definitions
- Export all schemas and types from shared/schema.ts

Include migration setup with drizzle-kit configuration.
```

## 2. Core Application Structure Prompts

### 2.1 Main Application Component
```
Create the main App.tsx component for a form builder application with these requirements:

FEATURES:
- Multi-tab interface: Dashboard Designer, Dashboard, Design, Preview, PDF Preview, JSON Export
- Customer tier system (Bronze, Silver, Gold, Platinum) with visual indicators
- Dark mode support with theme persistence
- Responsive design with mobile-first approach

TAB SYSTEM:
- Tab themes: Clean Minimal, Icon & Text, Card Selection, Underline Style
- Tab alignment: Top, Left, Right positioning options
- Smooth transitions between tabs
- Active tab highlighting

STATE MANAGEMENT:
- Current customer tier selection
- Active tab tracking
- Theme management (light/dark)
- Form data persistence

Don't override any existing functionality when adding this component.
```

### 2.2 Drag-and-Drop System
```
Implement a comprehensive drag-and-drop system for form building:

CORE FEATURES:
- Drag controls from library to design canvas
- Reorder existing controls within sections
- Visual feedback during drag operations
- Touch support for mobile devices

VISUAL FEEDBACK:
- Opacity changes during drag (30% for dragged item)
- Scale animation (105% scale)
- Border highlighting for drop zones
- Smooth transitions with cubic-bezier timing

COMPONENTS NEEDED:
- DragProvider wrapper with HTML5Backend
- Draggable control items with hover detection
- Drop zones with visual feedback
- Reorder logic with proper index handling

TECHNICAL REQUIREMENTS:
- Use react-dnd library
- Handle both mouse and touch events
- Implement proper error handling for invalid drops
- Maintain data consistency during reordering

Don't override existing drag functionality when implementing this system.
```

## 3. Form Building System Prompts

### 3.1 Control Library
```
Create a comprehensive control library component with these specifications:

CONTROL CATEGORIES:
1. Core Input: Text Box, Multi-line Text, Numeric Control, Email Input, Password Input, URL Input
2. Date & Time: Date Picker, Time Picker, Date Range Picker, DateTime Picker
3. Selection Controls: Dropdown, Multi-Select, Radio Group, Checkbox Group, Button Group
4. Advanced: File Upload, Image Upload, Tag Input, Toggle Switch, Slider, Color Picker
5. Layout: Grid Matrix, Section Divider, HTML Content, Progress Indicator

FEATURES:
- Categorized control display with collapsible sections
- Search functionality to filter controls
- Drag source implementation for each control
- Visual control previews with icons
- Responsive grid layout

PROPERTIES:
- Each control type should have configurable properties
- Default values for new controls
- Validation rules and constraints
- Accessibility attributes

Don't override existing control types when adding new ones.
```

### 3.2 Design Canvas
```
Implement a design canvas component for form building:

LAYOUT:
- Three-panel design: Control Library (left), Canvas (center), Properties (right)
- Fixed 320px width for side panels, flexible center
- Scrollable canvas with custom scrollbar styling
- Section-based organization with visual tabs

FUNCTIONALITY:
- Drop zone for new controls from library
- Visual representation of form controls
- Control selection with highlighting
- In-place editing capabilities
- Section management and switching

VISUAL DESIGN:
- Clean, professional appearance
- Dark mode support
- Grid or list layout options
- Empty state with helpful guidance
- Loading states for async operations

TECHNICAL:
- Proper overflow handling
- Performance optimization for large forms
- Keyboard navigation support
- Screen reader compatibility

Don't override existing canvas functionality when implementing new features.
```

### 3.3 Properties Panel
```
Create a comprehensive properties panel for form control configuration:

PROPERTY CATEGORIES:
- Basic: Label, placeholder, default value, required status
- Validation: Pattern matching, min/max values, character limits
- Appearance: CSS classes, styling options, layout preferences
- Behavior: Conditional logic, show/hide rules, dependencies
- Accessibility: ARIA labels, descriptions, help text

INTERFACE:
- Tabbed or accordion-style organization
- Real-time preview of changes
- Form validation for property inputs
- Reset to defaults functionality
- Copy/paste properties between controls

CONDITIONAL LOGIC:
- Visual rule builder interface
- Support for multiple conditions
- AND/OR logic operators
- Preview of conditional behavior

RESPONSIVE DESIGN:
- Collapsible on mobile devices
- Touch-friendly controls
- Optimized for tablet use

Don't override existing property configurations when adding new property types.
```

## 4. Import/Export System Prompts

### 4.1 Excel Import System
```
Implement a robust Excel import system for form definitions:

FEATURES:
- Excel template generation and download
- File upload with drag-and-drop support
- Real-time validation during import
- Error reporting with detailed feedback
- Batch processing with progress indication

IMPORT PROCESS:
1. File validation (format, size, structure)
2. Data parsing and transformation
3. Control creation and validation
4. Section generation from imported data
5. Database persistence with error handling

EXCEL STRUCTURE:
- Control definitions in structured format
- Section information and grouping
- Property configurations per control
- Validation rules and constraints

ERROR HANDLING:
- Detailed error messages for invalid data
- Line-by-line error reporting
- Partial import capability with error summary
- Recovery suggestions for common issues

PERFORMANCE:
- Streaming parser for large files
- Chunked processing for better UX
- Memory-efficient handling
- Cancel/retry functionality

Don't override existing import functionality when enhancing the system.
```

### 4.2 JSON Export System
```
Create a comprehensive JSON export system:

EXPORT FEATURES:
- Complete form structure export
- Section-based partial exports
- Dashboard configuration export (separate)
- Tier-appropriate complexity levels
- Formatted output with proper indentation

JSON STRUCTURE:
- Form metadata and configuration
- Section definitions with properties
- Control specifications with all properties
- Validation rules and conditional logic
- Theme and styling information

EXPORT OPTIONS:
- Minified vs. formatted output
- Include/exclude certain data types
- Version information and compatibility
- Export history and timestamps

IMPORT CAPABILITY:
- JSON file import with validation
- Schema version compatibility checking
- Merge capabilities with existing forms
- Conflict resolution for duplicate elements

UI FEATURES:
- Expandable/collapsible JSON sections
- Syntax highlighting for better readability
- Copy to clipboard functionality
- Download as file option

Don't override existing export formats when adding new export options.
```

## 5. Preview and PDF Generation Prompts

### 5.1 Live Preview System
```
Implement a real-time form preview system:

CORE FEATURES:
- Live updates reflecting design changes
- Functional form controls for testing
- Theme application and switching
- Responsive design preview
- Form validation testing

PREVIEW MODES:
- Desktop, tablet, and mobile previews
- Different theme applications
- Print preview simulation
- Accessibility testing mode

FUNCTIONALITY:
- Working form controls with state management
- Real-time validation feedback
- Form submission simulation
- Progress tracking and completion status

TESTING FEATURES:
- Sample data population
- Form reset capabilities
- Validation error simulation
- User journey testing

PERFORMANCE:
- Efficient re-rendering on changes
- Debounced updates for smooth UX
- Memory optimization for large forms
- Fast theme switching

Don't override existing preview functionality when adding new preview modes.
```

### 5.2 PDF Generation System
```
Create a comprehensive PDF generation system using jsPDF:

PDF FEATURES:
- Real-time PDF preview with form data
- Multiple professional templates
- Custom branding with logo support
- Form value display in generated PDF
- Page break management

TEMPLATES:
- Professional: Clean business layout
- Detailed: Comprehensive form representation
- Compact: Space-efficient design
- Custom: User-configurable template

CUSTOMIZATION:
- Logo upload and positioning
- Custom footer text and formatting
- Color scheme selection
- Font and typography options
- Page orientation and size

GENERATION OPTIONS:
- Include/exclude empty fields
- Section-based page breaks
- Table of contents generation
- Digital signature placeholders

TECHNICAL:
- Efficient rendering for large forms
- High-quality output at 300 DPI
- Proper text encoding and fonts
- Memory management for large PDFs

Don't override existing PDF templates when adding new ones.
```

## 6. Dashboard Designer Prompts

### 6.1 Dashboard Template System
```
Create a comprehensive dashboard designer with template system:

TEMPLATE CATEGORIES:
- Grid Layout: Card-based responsive grid
- Sidebar Layout: Navigation sidebar with content area
- Card Layout: Floating card-based design
- Minimal Layout: Clean, minimal interface

CUSTOMIZATION OPTIONS:
- Template selection with live previews
- Color scheme customization (primary, secondary, accent)
- Light/dark mode per dashboard
- Layout configuration (sidebar, header, footer)
- Branding elements (logo, title, subtitle)

CONFIGURATION SYSTEM:
- Visual configuration interface
- Real-time preview updates
- Export/import dashboard configurations
- Template marketplace concept

RESPONSIVE DESIGN:
- Mobile-optimized templates
- Tablet-specific layouts
- Desktop-first design options
- Progressive enhancement

TECHNICAL:
- Separate JSON configuration system
- Template inheritance and overrides
- Performance-optimized rendering
- Theme consistency across components

Don't override existing dashboard templates when adding new layouts.
```

### 6.2 Theme Customization System
```
Implement a comprehensive theme customization system:

COLOR MANAGEMENT:
- RGB/Hex color picker integration
- Predefined color palettes
- Color harmony suggestions
- Accessibility contrast checking

THEME COMPONENTS:
- Primary, secondary, accent color selection
- Background and surface colors
- Text and border color variants
- Interactive state colors (hover, active, disabled)

PREVIEW SYSTEM:
- Live theme preview on all components
- Before/after comparison view
- Mobile and desktop preview modes
- Export theme as CSS variables

ACCESSIBILITY:
- WCAG contrast ratio validation
- Color blind simulation
- High contrast mode support
- Focus indication customization

TECHNICAL:
- CSS custom property generation
- Theme persistence in local storage
- Dynamic theme switching
- Performance-optimized updates

Don't override existing color schemes when adding new theme options.
```

## 7. Customer Tier System Prompts

### 7.1 Tier Management System
```
Implement a comprehensive customer tier system:

TIER DEFINITIONS:
- Bronze: Basic features, 10 controls, 2 templates
- Silver: Enhanced features, 25 controls, 5 templates
- Gold: Advanced features, 50 controls, 10 templates
- Platinum: Full access, unlimited controls, all templates

FEATURE RESTRICTIONS:
- Control library filtering by tier
- Template access limitations
- Export complexity restrictions
- Advanced feature gating

VISUAL INDICATORS:
- Tier badges and labels
- Feature availability indicators
- Upgrade prompts and suggestions
- Progress bars for tier benefits

UPGRADE SYSTEM:
- Contextual upgrade suggestions
- Feature comparison tables
- Trial access to premium features
- Subscription management interface

TECHNICAL:
- Centralized tier configuration
- Dynamic feature enabling/disabling
- Tier validation throughout app
- Analytics for upgrade conversion

Don't override existing tier restrictions when modifying the tier system.
```

## 8. Mobile and Responsive Design Prompts

### 8.1 Mobile-First Responsive Design
```
Implement comprehensive mobile-first responsive design:

BREAKPOINT STRATEGY:
- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+
- Large Desktop: 1440px+

MOBILE OPTIMIZATIONS:
- Touch-friendly controls (44px minimum)
- Collapsible panels and navigation
- Swipe gestures for tab navigation
- Pull-to-refresh functionality

LAYOUT ADAPTATIONS:
- Single-column layouts on mobile
- Stacked panels instead of side-by-side
- Bottom navigation for mobile
- Floating action buttons

PERFORMANCE:
- Optimized images and assets
- Lazy loading for off-screen content
- Reduced animation complexity on mobile
- Battery-conscious interactions

ACCESSIBILITY:
- Large touch targets
- Clear focus indicators
- Voice navigation support
- Screen reader optimizations

Don't override existing responsive behaviors when adding new mobile features.
```

### 8.2 Touch and Gesture Support
```
Implement comprehensive touch and gesture support:

TOUCH INTERACTIONS:
- Tap, long press, swipe gestures
- Pinch-to-zoom for detailed views
- Multi-touch support where appropriate
- Haptic feedback integration

DRAG-AND-DROP:
- Touch-based drag operations
- Visual feedback during touch drag
- Auto-scroll during drag operations
- Precision control for fine positioning

MOBILE FORMS:
- Native input type utilization
- Date/time picker optimization
- File upload from camera/gallery
- Voice input support

PERFORMANCE:
- Smooth 60fps animations
- Optimized touch event handling
- Minimal touch delay (300ms elimination)
- Efficient gesture recognition

ACCESSIBILITY:
- Touch accessibility for motor impairments
- Voice control compatibility
- Switch navigation support
- Customizable touch sensitivity

Don't override existing touch interactions when adding new gesture support.
```

## 9. Performance Optimization Prompts

### 9.1 Frontend Performance
```
Implement comprehensive frontend performance optimizations:

RENDERING OPTIMIZATION:
- Virtual scrolling for large lists
- React.memo for expensive components
- useMemo and useCallback for expensive calculations
- Lazy loading for off-screen components

BUNDLE OPTIMIZATION:
- Code splitting by routes and features
- Dynamic imports for heavy components
- Tree shaking unused code
- Optimized asset loading

STATE MANAGEMENT:
- Efficient state updates with minimal re-renders
- Proper dependency arrays in useEffect
- Debounced expensive operations
- Optimistic updates for better UX

ASSET OPTIMIZATION:
- Optimized images with proper formats
- SVG optimization and sprite sheets
- Font loading optimization
- CSS optimization and purging

MONITORING:
- Performance metrics collection
- Core Web Vitals tracking
- Bundle size monitoring
- Runtime performance profiling

Don't override existing performance optimizations when adding new features.
```

### 9.2 Database and Backend Performance
```
Optimize backend and database performance:

DATABASE OPTIMIZATION:
- Proper indexing for frequently queried fields
- Query optimization with explain analysis
- Connection pooling and management
- Database query caching

API OPTIMIZATION:
- Request/response caching
- Batch API endpoints for bulk operations
- Pagination for large datasets
- GraphQL-style selective field loading

MEMORY MANAGEMENT:
- Efficient data serialization
- Memory leak prevention
- Garbage collection optimization
- Resource cleanup

SCALABILITY:
- Horizontal scaling preparation
- Database sharding strategies
- CDN integration for static assets
- Load balancing considerations

MONITORING:
- Database performance metrics
- API response time tracking
- Memory usage monitoring
- Error rate tracking

Don't override existing database optimizations when implementing new features.
```

## 10. Testing and Quality Assurance Prompts

### 10.1 Comprehensive Testing Strategy
```
Implement a comprehensive testing strategy:

UNIT TESTING:
- Component testing with React Testing Library
- Hook testing with custom test utilities
- Utility function testing with Jest
- Snapshot testing for UI consistency

INTEGRATION TESTING:
- API endpoint testing
- Database integration testing
- Form workflow testing
- Import/export functionality testing

E2E TESTING:
- Critical user journey testing
- Cross-browser compatibility testing
- Mobile device testing
- Performance testing under load

ACCESSIBILITY TESTING:
- Screen reader compatibility
- Keyboard navigation testing
- Color contrast validation
- ARIA attribute verification

TESTING INFRASTRUCTURE:
- Automated test execution
- Test coverage reporting
- Visual regression testing
- Performance benchmark testing

Don't override existing test suites when adding new testing capabilities.
```

### 10.2 Error Handling and Monitoring
```
Implement comprehensive error handling and monitoring:

ERROR BOUNDARIES:
- React error boundaries for component failures
- Fallback UI for error states
- Error recovery mechanisms
- User-friendly error messages

ERROR TRACKING:
- Centralized error logging system
- Stack trace collection and analysis
- User session recording for debugging
- Performance impact monitoring

USER FEEDBACK:
- Error reporting interface for users
- Feedback collection system
- Bug report generation
- User satisfaction tracking

MONITORING SYSTEM:
- Real-time error alerting
- Performance degradation detection
- Uptime monitoring
- Resource usage tracking

RECOVERY MECHANISMS:
- Automatic retry for transient failures
- Graceful degradation of features
- Offline mode capabilities
- Data recovery procedures

Don't override existing error handling when implementing new monitoring features.
```

## 11. Security Implementation Prompts

### 11.1 Frontend Security
```
Implement comprehensive frontend security measures:

INPUT VALIDATION:
- XSS prevention through proper sanitization
- Input validation on all form fields
- File upload security and validation
- URL validation and sanitization

AUTHENTICATION:
- Secure token management
- Session timeout handling
- Multi-factor authentication support
- Password strength enforcement

DATA PROTECTION:
- Sensitive data encryption in transit
- Local storage security
- Cookie security configuration
- CSRF protection implementation

SECURITY HEADERS:
- Content Security Policy implementation
- Secure HTTP headers configuration
- HTTPS enforcement
- Frame options and clickjacking prevention

MONITORING:
- Security event logging
- Suspicious activity detection
- Failed authentication tracking
- Security audit trail

Don't override existing security measures when implementing new security features.
```

### 11.2 Backend Security
```
Implement comprehensive backend security measures:

API SECURITY:
- Input validation and sanitization
- SQL injection prevention
- Rate limiting and throttling
- API authentication and authorization

DATA SECURITY:
- Database encryption at rest
- Secure password hashing
- Sensitive data tokenization
- Data backup encryption

SESSION MANAGEMENT:
- Secure session configuration
- Session hijacking prevention
- Proper session invalidation
- Cross-site request forgery protection

INFRASTRUCTURE:
- Environment variable security
- Dependency vulnerability scanning
- Security patch management
- Access control and permissions

COMPLIANCE:
- GDPR compliance measures
- Data retention policies
- Privacy protection implementation
- Audit trail maintenance

Don't override existing security implementations when adding new security features.
```

## 12. Feature Extension Prompts

### 12.1 Adding New Form Controls
```
Add a new form control type to the existing system:

IMPLEMENTATION REQUIREMENTS:
- Create control definition in controls.ts
- Add visual representation in DroppedControlComponent
- Implement properties configuration in PropertiesPanel
- Add drag source in ControlLibrary
- Include in preview rendering

CONTROL SPECIFICATION:
- Define control type and category
- Specify default properties and values
- Configure validation rules
- Set accessibility attributes
- Design responsive behavior

INTEGRATION:
- Ensure tier-based availability
- Add to import/export schemas
- Include in PDF generation
- Test in all preview modes

BEST PRACTICES:
- Follow existing naming conventions
- Maintain consistency with existing controls
- Implement proper error handling
- Add comprehensive documentation

Don't override existing control implementations when adding new control types.
```

### 12.2 Adding New Export Formats
```
Add a new export format to the existing system:

EXPORT IMPLEMENTATION:
- Create new export function
- Add UI controls for new format
- Implement format-specific validation
- Add error handling and feedback

FORMAT REQUIREMENTS:
- Define schema structure
- Implement proper data transformation
- Add format validation
- Include metadata and versioning

USER INTERFACE:
- Add export option to existing UI
- Implement format selection
- Add download functionality
- Include format documentation

INTEGRATION:
- Maintain compatibility with existing exports
- Add to tier-based restrictions
- Include in testing suites
- Document format specifications

TECHNICAL:
- Optimize for performance
- Handle large form exports
- Implement proper error recovery
- Add progress indication

Don't override existing export formats when implementing new export capabilities.
```

## Usage Instructions

1. **Start with Project Initialization**: Use prompts 1.1 and 1.2 to set up the basic project structure
2. **Build Core Components**: Use prompts 2.1 and 2.2 to create the main application framework
3. **Implement Form Building**: Use prompts 3.1-3.3 to create the form building interface
4. **Add Import/Export**: Use prompts 4.1-4.2 to implement data import/export functionality
5. **Create Preview System**: Use prompts 5.1-5.2 to add preview and PDF generation
6. **Build Dashboard Designer**: Use prompts 6.1-6.2 to implement the dashboard system
7. **Implement Tier System**: Use prompt 7.1 to add customer tier management
8. **Add Mobile Support**: Use prompts 8.1-8.2 to implement responsive design
9. **Optimize Performance**: Use prompts 9.1-9.2 to add performance optimizations
10. **Add Testing**: Use prompts 10.1-10.2 to implement testing and monitoring
11. **Implement Security**: Use prompts 11.1-11.2 to add security measures
12. **Extend Features**: Use prompts 12.1-12.2 to add new functionality

## Notes

- Each prompt is designed to work independently while maintaining system coherence
- Always include the preservation instruction to avoid overriding existing functionality
- Test thoroughly after implementing each feature set
- Follow the existing code patterns and conventions
- Maintain documentation as you build each feature