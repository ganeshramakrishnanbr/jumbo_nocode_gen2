# 16 - Dashboard Analytics and Metrics

This prompt creates comprehensive dashboard analytics with real-time metrics and visual data representation.

## Visual Design Requirements

### Analytics Dashboard Layout
- **Grid System**: 4-column responsive grid with card-based metrics
- **Chart Integration**: Professional charts using Recharts library
- **KPI Cards**: Large metric displays with trend indicators and growth percentages
- **Real-time Updates**: Live data updates with smooth animations
- **Interactive Elements**: Clickable charts with detailed tooltips and drill-down capability

### Data Visualization Standards
- **Color Palette**: Blue primary (#3b82f6), green success (#10b981), red alerts (#ef4444)
- **Chart Types**: Line charts for trends, bar charts for comparisons, pie charts for distributions
- **Animation Timing**: 300ms ease-in-out for chart transitions
- **Responsive Design**: Mobile-optimized chart sizing and touch-friendly interactions

## AI Prompt

```
Create comprehensive dashboard analytics with real-time metrics using the following exact specifications:

VISUAL DESIGN STANDARDS:

Dashboard Grid Layout:
- 4-column grid on desktop (repeat(4, 1fr))
- 2-column grid on tablet (repeat(2, 1fr))  
- 1-column stack on mobile (1fr)
- Card spacing: 24px gap between all cards
- Card padding: 24px internal padding with rounded corners

Chart Styling:
- Primary blue: #3b82f6 for main data series
- Success green: #10b981 for positive metrics
- Warning amber: #f59e0b for attention items
- Error red: #ef4444 for negative metrics
- Grid lines: #e2e8f0 (light) / #374151 (dark)
- Tooltips: Dark background with white text and rounded borders

DASHBOARD COMPONENT (client/src/components/Dashboard.tsx):
```typescript
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';

import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

import {
  FileText, Users, TrendingUp, TrendingDown, Eye, Download,
  Calendar, Clock, Target, Award, BarChart3, PieChart as PieChartIcon,
  Activity, Zap, CheckCircle2, AlertCircle
} from 'lucide-react';

import type { Questionnaire, CustomerTier } from '@shared/types';

interface DashboardProps {
  currentTier: CustomerTier;
  onCreateQuestionnaire: () => void;
  onEditQuestionnaire: (id: string) => void;
}

interface DashboardStats {
  totalForms: number;
  totalResponses: number;
  averageCompletionRate: number;
  totalViews: number;
  trendsData: Array<{
    date: string;
    forms: number;
    responses: number;
    views: number;
  }>;
  formsByType: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  recentActivity: Array<{
    id: string;
    type: 'created' | 'completed' | 'viewed';
    description: string;
    timestamp: Date;
    user?: string;
  }>;
}

const CHART_COLORS = {
  primary: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  purple: '#8b5cf6',
  cyan: '#06b6d4'
};

export const Dashboard: React.FC<DashboardProps> = ({
  currentTier,
  onCreateQuestionnaire,
  onEditQuestionnaire
}) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Generate mock dashboard data
  const dashboardStats = useMemo((): DashboardStats => {
    const generateTrendsData = () => {
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
      const data = [];
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        data.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          forms: Math.floor(Math.random() * 20) + 5,
          responses: Math.floor(Math.random() * 100) + 20,
          views: Math.floor(Math.random() * 500) + 100
        });
      }
      
      return data;
    };

    const formTypes = [
      { name: 'Contact Forms', value: 35, color: CHART_COLORS.primary },
      { name: 'Surveys', value: 25, color: CHART_COLORS.success },
      { name: 'Feedback', value: 20, color: CHART_COLORS.warning },
      { name: 'Registration', value: 15, color: CHART_COLORS.purple },
      { name: 'Others', value: 5, color: CHART_COLORS.cyan }
    ];

    const activities = [
      {
        id: '1',
        type: 'created' as const,
        description: 'New contact form created',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        user: 'John Doe'
      },
      {
        id: '2',
        type: 'completed' as const,
        description: '15 new responses received',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
      },
      {
        id: '3',
        type: 'viewed' as const,
        description: 'Customer survey viewed 47 times',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000)
      },
      {
        id: '4',
        type: 'created' as const,
        description: 'Feedback form published',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        user: 'Sarah Wilson'
      }
    ];

    return {
      totalForms: 24,
      totalResponses: 1247,
      averageCompletionRate: 78.5,
      totalViews: 3429,
      trendsData: generateTrendsData(),
      formsByType: formTypes,
      recentActivity: activities
    };
  }, [timeRange]);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'created': return <FileText className="h-4 w-4 text-blue-500" />;
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'viewed': return <Eye className="h-4 w-4 text-purple-500" />;
      default: return <Activity className="h-4 w-4 text-slate-500" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    trend = 'up' 
  }: { 
    title: string; 
    value: string | number; 
    change?: string; 
    icon: React.ComponentType<any>; 
    trend?: 'up' | 'down' | 'neutral' 
  }) => (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
          {title}
        </CardTitle>
        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
          <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
          {value}
        </div>
        {change && (
          <div className="flex items-center space-x-1 text-sm">
            {trend === 'up' ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : trend === 'down' ? (
              <TrendingDown className="h-3 w-3 text-red-500" />
            ) : null}
            <span className={`font-medium ${
              trend === 'up' ? 'text-green-600' : 
              trend === 'down' ? 'text-red-600' : 
              'text-slate-600'
            }`}>
              {change}
            </span>
            <span className="text-slate-500">vs last period</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-slate-50 dark:bg-slate-900">
      <div className="p-6 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Welcome back! Here's what's happening with your forms.
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            
            <Button onClick={onCreateQuestionnaire}>
              <FileText className="h-4 w-4 mr-2" />
              New Form
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Forms"
            value={dashboardStats.totalForms}
            change="+12%"
            icon={FileText}
            trend="up"
          />
          <StatCard
            title="Total Responses"
            value={dashboardStats.totalResponses.toLocaleString()}
            change="+23%"
            icon={Users}
            trend="up"
          />
          <StatCard
            title="Completion Rate"
            value={`${dashboardStats.averageCompletionRate}%`}
            change="+5.2%"
            icon={Target}
            trend="up"
          />
          <StatCard
            title="Total Views"
            value={dashboardStats.totalViews.toLocaleString()}
            change="+18%"
            icon={Eye}
            trend="up"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Trends Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <span>Form Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dashboardStats.trendsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    stroke="#64748b"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    stroke="#64748b"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#f8fafc'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="responses" 
                    stroke={CHART_COLORS.primary}
                    strokeWidth={3}
                    dot={{ fill: CHART_COLORS.primary, strokeWidth: 2, r: 4 }}
                    name="Responses"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="views" 
                    stroke={CHART_COLORS.success}
                    strokeWidth={3}
                    dot={{ fill: CHART_COLORS.success, strokeWidth: 2, r: 4 }}
                    name="Views"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Form Types Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChartIcon className="h-5 w-5 text-purple-600" />
                <span>Form Types</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dashboardStats.formsByType}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={40}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {dashboardStats.formsByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#f8fafc'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-emerald-600" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-4">
                  {dashboardStats.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <div className="flex-shrink-0 mt-0.5">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {activity.description}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          {activity.user && (
                            <span className="text-xs text-slate-600 dark:text-slate-400">
                              by {activity.user}
                            </span>
                          )}
                          <span className="text-xs text-slate-500">
                            {formatTimeAgo(activity.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-amber-600" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={onCreateQuestionnaire}
              >
                <FileText className="h-4 w-4 mr-2" />
                Create New Form
              </Button>
              
              <Button 
                className="w-full justify-start" 
                variant="outline"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              
              <Button 
                className="w-full justify-start" 
                variant="outline"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
              
              <Button 
                className="w-full justify-start" 
                variant="outline"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Report
              </Button>

              <div className="pt-4 border-t">
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  Current Plan: <Badge variant="outline">{currentTier}</Badge>
                </div>
                <Progress value={65} className="h-2 mb-2" />
                <p className="text-xs text-slate-500">
                  65% of monthly quota used
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
```

ANALYTICS HOOKS (client/src/hooks/useAnalytics.ts):
```typescript
import { useState, useEffect, useCallback } from 'react';

interface AnalyticsData {
  formViews: number;
  formSubmissions: number;
  completionRate: number;
  averageTime: number;
  bounceRate: number;
  topPerformingForms: Array<{
    id: string;
    name: string;
    views: number;
    submissions: number;
    conversionRate: number;
  }>;
  timeSeriesData: Array<{
    date: string;
    views: number;
    submissions: number;
  }>;
}

export const useAnalytics = (timeRange: string = '30d') => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock data based on time range
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const timeSeriesData = Array.from({ length: days }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (days - 1 - i));
        
        return {
          date: date.toISOString().split('T')[0],
          views: Math.floor(Math.random() * 500) + 100,
          submissions: Math.floor(Math.random() * 50) + 10
        };
      });

      const mockData: AnalyticsData = {
        formViews: timeSeriesData.reduce((sum, day) => sum + day.views, 0),
        formSubmissions: timeSeriesData.reduce((sum, day) => sum + day.submissions, 0),
        completionRate: 0.78,
        averageTime: 3.2,
        bounceRate: 0.23,
        topPerformingForms: [
          {
            id: '1',
            name: 'Contact Form',
            views: 1243,
            submissions: 189,
            conversionRate: 0.152
          },
          {
            id: '2',
            name: 'Newsletter Signup',
            views: 2156,
            submissions: 543,
            conversionRate: 0.252
          },
          {
            id: '3',
            name: 'Customer Feedback',
            views: 876,
            submissions: 124,
            conversionRate: 0.142
          }
        ],
        timeSeriesData
      };

      setData(mockData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
    } finally {
      setIsLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const refreshData = useCallback(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    data,
    isLoading,
    error,
    refresh: refreshData
  };
};

export const useRealTimeMetrics = () => {
  const [metrics, setMetrics] = useState({
    activeUsers: 0,
    formsViewed: 0,
    formsSubmitted: 0,
    lastUpdate: new Date()
  });

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates
      setMetrics(prev => ({
        activeUsers: Math.max(0, prev.activeUsers + (Math.random() - 0.5) * 5),
        formsViewed: prev.formsViewed + Math.floor(Math.random() * 3),
        formsSubmitted: prev.formsSubmitted + (Math.random() > 0.8 ? 1 : 0),
        lastUpdate: new Date()
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return metrics;
};
```

Create comprehensive dashboard analytics with real-time metrics, interactive charts, KPI cards, and actionable insights to help users understand their form performance and user engagement.
```