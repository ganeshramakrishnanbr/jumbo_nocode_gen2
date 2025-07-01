# Reverse Engineering Prompts - Individual Implementation Files

This folder contains individual implementation prompts that can be used separately with AI coding assistants to recreate specific features of the Jumbo No-Code Form Builder application.

## Prompt Files Overview

### Core Setup
- **[01-project-setup.md](./01-project-setup.md)** - Complete project initialization and configuration
- **[02-database-backend.md](./02-database-backend.md)** - Database schema and Express backend setup
- **[03-frontend-core.md](./03-frontend-core.md)** - React application structure and core components

### Form Builder System
- **[04-drag-drop-interface.md](./04-drag-drop-interface.md)** - Three-panel drag-and-drop form builder
- **[05-control-system.md](./05-control-system.md)** - Complete form controls with 20+ types
- **[06-properties-validation.md](./06-properties-validation.md)** - Control properties and validation system

### Data Management
- **[07-preview-pdf.md](./07-preview-pdf.md)** - Preview mode and PDF generation with templates
- **[08-section-management.md](./08-section-management.md)** - Section creation and organization system
- **[09-json-export.md](./09-json-export.md)** - JSON export with configurable data options

### Advanced Features
- **[10-excel-import.md](./10-excel-import.md)** - Excel import with template generation
- **[11-customer-tiers.md](./11-customer-tiers.md)** - Customer tier system with feature gating
- **[12-responsive-design.md](./12-responsive-design.md)** - Mobile-first responsive implementation

### UI/UX Enhancement
- **[13-visual-design.md](./13-visual-design.md)** - Complete visual design system and styling
- **[14-dark-mode.md](./14-dark-mode.md)** - Dark mode implementation with theme switching
- **[15-animations.md](./15-animations.md)** - Animations and interactive elements

### Performance & Quality
- **[16-dashboard-analytics.md](./16-dashboard-analytics.md)** - Dashboard analytics with real-time metrics
- **[17-testing-validation.md](./17-testing-validation.md)** - Testing framework and form validation
- **[18-deployment-optimization.md](./18-deployment-optimization.md)** - Deployment and performance optimization

## Usage Instructions

1. **Sequential Implementation**: Use files in order (01-18) for complete application recreation
2. **Feature-Specific**: Use individual files for implementing specific features
3. **Copy-Paste Ready**: Each file contains complete, self-contained prompts
4. **Visual Consistency**: All prompts include detailed visual design specifications

## Visual Design System

All prompts include comprehensive visual design specifications covering:

### Color Scheme
- **Primary**: #3b82f6 (Blue 500) - Professional blue for primary actions
- **Secondary**: #64748b (Slate 500) - Neutral gray for secondary elements
- **Accent**: #06b6d4 (Cyan 500) - Bright cyan for highlights and CTAs
- **Success**: #10b981 (Emerald 500) - Green for success states
- **Warning**: #f59e0b (Amber 500) - Orange for warnings
- **Error**: #ef4444 (Red 500) - Red for errors and destructive actions

### Typography
- **Font Family**: Inter, system-ui, sans-serif for modern readability
- **Scale**: Harmonious type scale from 12px to 48px
- **Weight**: Light (300), Regular (400), Medium (500), Semibold (600), Bold (700)
- **Line Height**: 1.5 for body text, 1.2 for headings

### Layout Patterns
- **Grid System**: CSS Grid and Flexbox for responsive layouts
- **Spacing**: 4px base unit with consistent 8px, 16px, 24px, 32px spacing
- **Breakpoints**: Mobile (320px), Tablet (768px), Desktop (1024px), Large (1440px)
- **Container**: Max-width 1200px with responsive padding

### Component Styles
- **Buttons**: Rounded corners (6px), consistent padding, hover/focus states
- **Forms**: Clean inputs with proper focus indicators and validation states
- **Navigation**: Horizontal tabs with underline indicators and smooth transitions
- **Cards**: Subtle shadows, rounded corners, proper content hierarchy

### Animations
- **Duration**: 200ms for micro-interactions, 300ms for transitions
- **Easing**: cubic-bezier(0.4, 0.0, 0.2, 1) for smooth animations
- **Hover Effects**: Subtle scale and color transitions
- **Loading States**: Skeleton screens and spinners with smooth animations

## Implementation Guidelines

### Before Starting
1. Read the visual design specifications in each prompt
2. Ensure you have the required dependencies installed
3. Set up proper development environment with TypeScript support

### While Implementing
1. Follow the exact visual specifications provided
2. Maintain consistency across all components
3. Test responsiveness at all breakpoints
4. Verify dark mode compatibility

### After Implementation
1. Test all interactive elements and animations
2. Verify accessibility compliance (WCAG 2.1 AA)
3. Check performance metrics and optimize if needed
4. Document any customizations or deviations

## Notes

- Each prompt is designed to work independently while maintaining visual consistency
- All prompts include TypeScript interfaces and proper error handling
- Visual design system ensures cohesive user experience across all features
- Responsive design specifications are included in every relevant prompt