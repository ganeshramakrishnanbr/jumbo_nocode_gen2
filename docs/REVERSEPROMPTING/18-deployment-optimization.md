# 18 - Deployment and Performance Optimization

This prompt creates comprehensive deployment configuration and performance optimization for production-ready applications.

## Visual Design Requirements

### Performance Monitoring
- **Loading States**: Professional skeleton screens and progress indicators
- **Error Boundaries**: Graceful error handling with recovery options
- **Lazy Loading**: Smooth component loading with fade-in animations
- **Image Optimization**: WebP format with fallbacks and responsive sizing
- **Bundle Analysis**: Visual representation of bundle sizes and dependencies

### Deployment Interface
- **Build Status**: Real-time build progress with detailed logs
- **Environment Variables**: Secure configuration management interface
- **Performance Metrics**: Core Web Vitals dashboard with recommendations
- **Error Tracking**: Comprehensive error logging with user context
- **Monitoring Dashboard**: Real-time application health and usage analytics

## AI Prompt

```
Create comprehensive deployment and performance optimization using the following exact specifications:

VISUAL DESIGN STANDARDS:

Loading States:
- Skeleton screens: 200ms fade-in with shimmer animation
- Progress bars: Blue gradient (#3b82f6 to #1d4ed8) with percentage display
- Spinners: 1s rotation with ease-in-out timing
- Lazy loading: 300ms fade-in with slide-up animation (translateY: 20px to 0)

Performance Indicators:
- Core Web Vitals: Green (<2.5s), Amber (2.5-4s), Red (>4s) color coding
- Bundle size alerts: Warning at >250KB, error at >500KB per chunk
- Memory usage: Visual gauge with percentage and absolute values
- Network requests: Timeline view with request/response details

PERFORMANCE OPTIMIZATION (client/src/lib/performance.ts):
```typescript
import { lazy, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();
  private observer: PerformanceObserver | null = null;

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  init() {
    if (typeof window === 'undefined') return;

    // Core Web Vitals monitoring
    this.initCoreWebVitals();
    
    // Resource timing monitoring
    this.initResourceTiming();
    
    // Long task monitoring
    this.initLongTaskMonitoring();
  }

  private initCoreWebVitals() {
    // First Contentful Paint (FCP)
    new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          this.metrics.set('FCP', entry.startTime);
          this.reportMetric('FCP', entry.startTime);
        }
      });
    }).observe({ entryTypes: ['paint'] });

    // Largest Contentful Paint (LCP)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.set('LCP', lastEntry.startTime);
      this.reportMetric('LCP', lastEntry.startTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay (FID)
    new PerformanceObserver((list) => {
      list.getEntries().forEach((entry: any) => {
        this.metrics.set('FID', entry.processingStart - entry.startTime);
        this.reportMetric('FID', entry.processingStart - entry.startTime);
      });
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    new PerformanceObserver((list) => {
      list.getEntries().forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          this.metrics.set('CLS', clsValue);
          this.reportMetric('CLS', clsValue);
        }
      });
    }).observe({ entryTypes: ['layout-shift'] });
  }

  private initResourceTiming() {
    new PerformanceObserver((list) => {
      list.getEntries().forEach((entry: any) => {
        // Monitor large resources
        if (entry.transferSize > 100000) { // > 100KB
          console.warn(`Large resource detected: ${entry.name} (${entry.transferSize} bytes)`);
        }

        // Monitor slow requests
        if (entry.duration > 1000) { // > 1s
          console.warn(`Slow request detected: ${entry.name} (${entry.duration}ms)`);
        }
      });
    }).observe({ entryTypes: ['resource'] });
  }

  private initLongTaskMonitoring() {
    new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        console.warn(`Long task detected: ${entry.duration}ms`);
        this.reportMetric('LONG_TASK', entry.duration);
      });
    }).observe({ entryTypes: ['longtask'] });
  }

  private reportMetric(name: string, value: number) {
    // Send to analytics service
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', name, {
        event_category: 'Core Web Vitals',
        value: Math.round(value),
        non_interaction: true
      });
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`${name}: ${value.toFixed(2)}ms`);
    }
  }

  getMetrics() {
    return Object.fromEntries(this.metrics);
  }

  measureFunction<T>(name: string, fn: () => T): T {
    const start = performance.now();
    const result = fn();
    const duration = performance.now() - start;
    
    this.metrics.set(name, duration);
    this.reportMetric(name, duration);
    
    return result;
  }

  async measureAsyncFunction<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    const result = await fn();
    const duration = performance.now() - start;
    
    this.metrics.set(name, duration);
    this.reportMetric(name, duration);
    
    return result;
  }
}

// Initialize performance monitoring
if (typeof window !== 'undefined') {
  PerformanceMonitor.getInstance().init();
}

// Lazy loading utilities
export const createLazyComponent = <T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) => {
  const LazyComponent = lazy(importFn);
  
  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={fallback ? <fallback /> : <ComponentSkeleton />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

// Component skeleton for loading states
const ComponentSkeleton: React.FC = () => (
  <div className="animate-pulse">
    <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
    <div className="space-y-3">
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/6"></div>
    </div>
  </div>
);

// Image optimization component
interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  priority = false
}) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  // Generate WebP version if available
  const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 animate-pulse" />
      )}
      
      <picture>
        <source srcSet={webpSrc} type="image/webp" />
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
        />
      </picture>
      
      {hasError && (
        <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <span className="text-slate-500 text-sm">Failed to load image</span>
        </div>
      )}
    </div>
  );
};

// Code splitting for routes
export const LazyDashboard = createLazyComponent(
  () => import('../components/Dashboard')
);

export const LazyDesignCanvas = createLazyComponent(
  () => import('../components/DesignCanvas')
);

export const LazyPreviewMode = createLazyComponent(
  () => import('../components/PreviewMode')
);

export const LazyPDFPreview = createLazyComponent(
  () => import('../components/PDFPreview')
);

export const LazyJSONViewer = createLazyComponent(
  () => import('../components/JSONViewer')
);
```

ERROR BOUNDARY COMPONENTS (client/src/components/ErrorBoundary.tsx):
```typescript
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error to external service
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }

    // Send to error tracking service
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: false
      });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} retry={this.handleRetry} />;
      }

      return <DefaultErrorFallback error={this.state.error!} retry={this.handleRetry} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error;
  retry: () => void;
}

const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({ error, retry }) => {
  const [showDetails, setShowDetails] = React.useState(false);

  const handleReportError = () => {
    const body = `Error: ${error.message}\n\nStack: ${error.stack}`;
    const subject = `Error Report: ${error.name}`;
    window.open(`mailto:support@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-red-600 dark:text-red-400">
            Something went wrong
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-slate-600 dark:text-slate-400 text-center">
            We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={retry} className="flex items-center space-x-2">
              <RefreshCw className="h-4 w-4" />
              <span>Try Again</span>
            </Button>
            
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </div>

          <div className="pt-4 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="w-full text-slate-500 hover:text-slate-700"
            >
              <Bug className="h-4 w-4 mr-2" />
              {showDetails ? 'Hide' : 'Show'} Error Details
            </Button>

            {showDetails && (
              <div className="mt-3 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
                  Error: {error.name}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  {error.message}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReportError}
                  className="w-full"
                >
                  Report this Error
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// HOC for wrapping components with error boundaries
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<ErrorFallbackProps>
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
};
```

BUILD OPTIMIZATION (vite.config.ts):
```typescript
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      react({
        // Enable Fast Refresh
        fastRefresh: true,
        // Optimize React builds
        babel: {
          plugins: [
            // Remove console.log in production
            ...(mode === 'production' ? [['babel-plugin-transform-remove-console']] : [])
          ]
        }
      })
    ],
    
    resolve: {
      alias: {
        '@': resolve(__dirname, './client/src'),
        '@shared': resolve(__dirname, './shared'),
        '@assets': resolve(__dirname, './client/src/assets')
      }
    },

    // Build optimization
    build: {
      // Enable source maps for debugging in production
      sourcemap: mode === 'development',
      
      // Optimize bundle size
      rollupOptions: {
        output: {
          // Manual chunk splitting for better caching
          manualChunks: {
            // Vendor chunk for third-party libraries
            vendor: ['react', 'react-dom'],
            
            // UI components chunk
            ui: ['@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-tabs'],
            
            // Charts and visualization
            charts: ['recharts'],
            
            // Form utilities
            forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
            
            // DnD functionality
            dnd: ['react-dnd', 'react-dnd-html5-backend'],
            
            // PDF and Excel utilities
            office: ['jspdf', 'html2canvas', 'xlsx']
          },
          
          // Optimize chunk naming
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId
              ? chunkInfo.facadeModuleId.split('/').pop()?.replace('.tsx', '').replace('.ts', '')
              : 'chunk';
            return `js/${facadeModuleId}-[hash].js`;
          },
          
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name?.split('.') || [];
            const extType = info[info.length - 1];
            
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
              return `img/[name]-[hash][extname]`;
            }
            if (/woff2?|eot|ttf|otf/i.test(extType)) {
              return `fonts/[name]-[hash][extname]`;
            }
            return `assets/[name]-[hash][extname]`;
          }
        }
      },
      
      // Target modern browsers for better optimization
      target: 'es2020',
      
      // Minification settings
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production'
        }
      },

      // Bundle size limits
      chunkSizeWarningLimit: 1000
    },

    // Development server optimization
    server: {
      // Enable HTTP/2
      http2: true,
      
      // Optimize HMR
      hmr: {
        overlay: true
      }
    },

    // Dependency optimization
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-dnd',
        'react-dnd-html5-backend',
        'recharts',
        'date-fns',
        'zod'
      ],
      exclude: ['@vite/client', '@vite/env']
    },

    // Environment variables
    define: {
      __APP_VERSION__: JSON.stringify(env.npm_package_version || '1.0.0'),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString())
    }
  };
});
```

DEPLOYMENT CONFIGURATION (.github/workflows/deploy.yml):
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Run linting
        run: npm run lint
        
      - name: Type checking
        run: npm run type-check
        
      - name: Bundle analysis
        run: npm run build -- --analyze
        
  lighthouse:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build application
        run: npm run build
        
      - name: Start server
        run: npm start &
        
      - name: Wait for server
        run: npx wait-on http://localhost:3000
        
      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli@0.12.x
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}

  deploy:
    runs-on: ubuntu-latest
    needs: [test, lighthouse]
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build for production
        run: npm run build
        env:
          NODE_ENV: production
          VITE_APP_VERSION: ${{ github.sha }}
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-args: '--prod'
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

PERFORMANCE MONITORING COMPONENT (client/src/components/PerformanceMonitor.tsx):
```typescript
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { PerformanceMonitor } from '@/lib/performance';

import { Activity, Clock, Zap, AlertTriangle } from 'lucide-react';

export const PerformancePanel: React.FC = () => {
  const [metrics, setMetrics] = useState<Record<string, number>>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const monitor = PerformanceMonitor.getInstance();
    
    const updateMetrics = () => {
      setMetrics(monitor.getMetrics());
    };

    // Update metrics every 5 seconds
    const interval = setInterval(updateMetrics, 5000);
    updateMetrics();

    return () => clearInterval(interval);
  }, []);

  const getMetricStatus = (name: string, value: number) => {
    const thresholds = {
      FCP: { good: 1800, poor: 3000 },
      LCP: { good: 2500, poor: 4000 },
      FID: { good: 100, poor: 300 },
      CLS: { good: 0.1, poor: 0.25 }
    };

    const threshold = thresholds[name as keyof typeof thresholds];
    if (!threshold) return 'neutral';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'poor';
    return 'bad';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'poor': return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30';
      case 'bad': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      default: return 'text-slate-600 bg-slate-100 dark:bg-slate-800';
    }
  };

  if (process.env.NODE_ENV !== 'development' && !isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
      >
        <Activity className="h-6 w-6 mx-auto" />
      </button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 shadow-xl z-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>Performance Monitor</span>
          </CardTitle>
          <button
            onClick={() => setIsVisible(false)}
            className="text-slate-400 hover:text-slate-600"
          >
            ×
          </button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {Object.entries(metrics).map(([name, value]) => {
          const status = getMetricStatus(name, value);
          const colorClass = getStatusColor(status);
          
          return (
            <div key={name} className="flex items-center justify-between">
              <span className="text-sm font-medium">{name}</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-600">
                  {name === 'CLS' ? value.toFixed(3) : `${Math.round(value)}ms`}
                </span>
                <Badge className={`text-xs ${colorClass}`}>
                  {status}
                </Badge>
              </div>
            </div>
          );
        })}
        
        {Object.keys(metrics).length === 0 && (
          <div className="text-center text-slate-500 py-4">
            <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Collecting metrics...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
```

Create comprehensive deployment and performance optimization with monitoring, error boundaries, lazy loading, image optimization, and production-ready build configuration for scalable applications.
```