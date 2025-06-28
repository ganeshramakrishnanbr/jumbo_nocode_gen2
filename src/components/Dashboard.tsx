import React, { useState, useEffect } from 'react';
import { Questionnaire, DashboardStats, CustomerTier } from '../types';
import { 
  Plus, Search, Filter, MoreVertical, Eye, Edit3, Copy, Trash2,
  BarChart3, Users, Clock, CheckCircle, AlertCircle, FileText,
  TrendingUp, Calendar, Activity
} from 'lucide-react';
import { 
  getQuestionnaires, 
  insertQuestionnaire, 
  deleteQuestionnaire as deleteQuestionnaireDB,
  initializeDatabase 
} from '../lib/db';

interface DashboardProps {
  currentTier: CustomerTier;
  onCreateQuestionnaire: () => void;
  onEditQuestionnaire: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  currentTier,
  onCreateQuestionnaire,
  onEditQuestionnaire
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive' | 'Draft'>('All');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalQuestionnaires: 0,
    activeQuestionnaires: 0,
    inactiveQuestionnaires: 0,
    draftQuestionnaires: 0,
    totalResponses: 0,
    averageCompletionRate: 0,
    recentActivity: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [newQuestionnaire, setNewQuestionnaire] = useState({
    name: '',
    description: '',
    purpose: '',
    category: 'General'
  });

  // Load questionnaires from database
  useEffect(() => {
    const loadQuestionnaires = async () => {
      try {
        setIsLoading(true);
        
        // Ensure database is initialized
        await initializeDatabase();
        
        // Fetch questionnaires
        const fetchedQuestionnaires = await getQuestionnaires();
        setQuestionnaires(fetchedQuestionnaires);
        
        // Calculate dashboard stats
        const stats = calculateDashboardStats(fetchedQuestionnaires);
        setDashboardStats(stats);
      } catch (error) {
        console.error('Failed to load questionnaires:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestionnaires();
  }, []);

  const calculateDashboardStats = (questionnaires: Questionnaire[]): DashboardStats => {
    const totalQuestionnaires = questionnaires.length;
    const activeQuestionnaires = questionnaires.filter(q => q.status === 'Active').length;
    const inactiveQuestionnaires = questionnaires.filter(q => q.status === 'Inactive').length;
    const draftQuestionnaires = questionnaires.filter(q => q.status === 'Draft').length;
    
    const totalResponses = questionnaires.reduce((sum, q) => sum + q.analytics.totalResponses, 0);
    const averageCompletionRate = questionnaires.length > 0 
      ? questionnaires.reduce((sum, q) => sum + q.analytics.completionRate, 0) / questionnaires.length 
      : 0;

    // Generate recent activity from questionnaires
    const recentActivity = questionnaires
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5)
      .map((q, index) => ({
        id: `activity-${index}`,
        type: q.status === 'Draft' ? 'created' as const : 'updated' as const,
        questionnaireName: q.name,
        timestamp: getRelativeTime(q.updatedAt),
        user: q.createdBy
      }));

    return {
      totalQuestionnaires,
      activeQuestionnaires,
      inactiveQuestionnaires,
      draftQuestionnaires,
      totalResponses,
      averageCompletionRate: Math.round(averageCompletionRate * 10) / 10,
      recentActivity
    };
  };

  const getRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Less than an hour ago';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

  const filteredQuestionnaires = questionnaires.filter(q => {
    const matchesSearch = q.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         q.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateQuestionnaire = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const newQuestionnaireData: Omit<Questionnaire, 'sections' | 'controls' | 'versions'> = {
        id: `questionnaire-${Date.now()}`,
        name: newQuestionnaire.name,
        description: newQuestionnaire.description,
        purpose: newQuestionnaire.purpose,
        category: newQuestionnaire.category,
        status: 'Draft',
        version: '1.0.0',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'Current User',
        tier: currentTier,
        analytics: {
          totalResponses: 0,
          completionRate: 0,
          averageTime: 0,
          lastResponse: 'Never'
        }
      };

      // Insert into database
      await insertQuestionnaire(newQuestionnaireData);
      
      // Reload questionnaires
      const updatedQuestionnaires = await getQuestionnaires();
      setQuestionnaires(updatedQuestionnaires);
      
      // Update stats
      const stats = calculateDashboardStats(updatedQuestionnaires);
      setDashboardStats(stats);
      
      // Reset form and close modal
      setNewQuestionnaire({
        name: '',
        description: '',
        purpose: '',
        category: 'General'
      });
      setShowCreateForm(false);
      
      // Navigate to design mode
      onCreateQuestionnaire();
    } catch (error) {
      console.error('Failed to create questionnaire:', error);
    }
  };

  const handleDeleteQuestionnaire = async (id: string) => {
    if (!confirm('Are you sure you want to delete this questionnaire? This action cannot be undone.')) {
      return;
    }

    try {
      // Delete from database
      await deleteQuestionnaireDB(id);
      
      // Reload questionnaires
      const updatedQuestionnaires = await getQuestionnaires();
      setQuestionnaires(updatedQuestionnaires);
      
      // Update stats
      const stats = calculateDashboardStats(updatedQuestionnaires);
      setDashboardStats(stats);
    } catch (error) {
      console.error('Failed to delete questionnaire:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300';
      case 'Inactive': return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300';
      case 'Draft': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  const getTierColor = (tier: CustomerTier) => {
    switch (tier) {
      case 'platinum': return 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300';
      case 'gold': return 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300';
      case 'silver': return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
      case 'bronze': return 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300';
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 bg-gray-50 dark:bg-gray-800 flex items-center justify-center transition-colors">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 transition-colors">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-800 overflow-auto transition-colors">
      {/* Dashboard Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-6 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1 transition-colors">Manage your questionnaires and track analytics</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Create Questionnaire</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors">Total Questionnaires</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">{dashboardStats.totalQuestionnaires}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-300" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors">Active</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400 transition-colors">{dashboardStats.activeQuestionnaires}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-300" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors">Total Responses</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 transition-colors">{dashboardStats.totalResponses}</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-300" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors">Avg. Completion</p>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400 transition-colors">{dashboardStats.averageCompletionRate}%</p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Questionnaires List */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors">Questionnaires</h2>
                  <div className="flex items-center space-x-2">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                    >
                      <option value="All">All Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </div>
                </div>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search questionnaires..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                  />
                </div>
              </div>

              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredQuestionnaires.length === 0 ? (
                  <div className="p-8 text-center">
                    <FileText className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2 transition-colors">
                      {questionnaires.length === 0 ? 'No Questionnaires Yet' : 'No Matching Questionnaires'}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 transition-colors">
                      {questionnaires.length === 0 
                        ? 'Create your first questionnaire to get started.'
                        : 'Try adjusting your search or filter criteria.'
                      }
                    </p>
                  </div>
                ) : (
                  filteredQuestionnaires.map((questionnaire) => (
                    <div key={questionnaire.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white transition-colors">{questionnaire.name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(questionnaire.status)} transition-colors`}>
                              {questionnaire.status}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTierColor(questionnaire.tier)} transition-colors`}>
                              {questionnaire.tier}
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 mb-3 transition-colors">{questionnaire.description}</p>
                          <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400 transition-colors">
                            <span className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>{questionnaire.analytics.totalResponses} responses</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <BarChart3 className="w-4 h-4" />
                              <span>{questionnaire.analytics.completionRate}% completion</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{questionnaire.analytics.averageTime}m avg time</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>v{questionnaire.version}</span>
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => onEditQuestionnaire(questionnaire.id)}
                            className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900 rounded-lg transition-colors" title="Preview">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900 rounded-lg transition-colors" title="Duplicate">
                            <Copy className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteQuestionnaire(questionnaire.id)}
                            className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors" 
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center transition-colors">
                <Activity className="w-5 h-5 mr-2" />
                Recent Activity
              </h2>
            </div>
            <div className="p-6">
              {dashboardStats.recentActivity.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors">No recent activity</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {dashboardStats.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${
                        activity.type === 'created' ? 'bg-green-100 dark:bg-green-900' :
                        activity.type === 'updated' ? 'bg-blue-100 dark:bg-blue-900' :
                        activity.type === 'published' ? 'bg-purple-100 dark:bg-purple-900' :
                        'bg-gray-100 dark:bg-gray-700'
                      } transition-colors`}>
                        {activity.type === 'created' && <Plus className="w-4 h-4 text-green-600 dark:text-green-300" />}
                        {activity.type === 'updated' && <Edit3 className="w-4 h-4 text-blue-600 dark:text-blue-300" />}
                        {activity.type === 'published' && <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-300" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 dark:text-white transition-colors">
                          <span className="font-medium">{activity.user}</span> {activity.type} 
                          <span className="font-medium"> {activity.questionnaireName}</span>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Questionnaire Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full mx-4 transition-colors">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors">Create New Questionnaire</h3>
            </div>
            <form onSubmit={handleCreateQuestionnaire} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                  Questionnaire Name *
                </label>
                <input
                  type="text"
                  value={newQuestionnaire.name}
                  onChange={(e) => setNewQuestionnaire({ ...newQuestionnaire, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                  placeholder="e.g., Customer Feedback Survey"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                  Purpose/Description *
                </label>
                <textarea
                  value={newQuestionnaire.description}
                  onChange={(e) => setNewQuestionnaire({ ...newQuestionnaire, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                  rows={3}
                  placeholder="Describe what this questionnaire is for..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                  Category
                </label>
                <select
                  value={newQuestionnaire.category}
                  onChange={(e) => setNewQuestionnaire({ ...newQuestionnaire, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                >
                  <option value="General">General</option>
                  <option value="Demographics">Demographics</option>
                  <option value="Customer Experience">Customer Experience</option>
                  <option value="HR">Human Resources</option>
                  <option value="Market Research">Market Research</option>
                  <option value="Education">Education</option>
                  <option value="Healthcare">Healthcare</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                >
                  Create & Design
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};