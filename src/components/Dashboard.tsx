import React, { useState } from 'react';
import { Questionnaire, DashboardStats, CustomerTier } from '../types';
import { 
  Plus, Search, Filter, MoreVertical, Eye, Edit3, Copy, Trash2,
  BarChart3, Users, Clock, CheckCircle, AlertCircle, FileText,
  TrendingUp, Calendar, Activity
} from 'lucide-react';

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
  const [newQuestionnaire, setNewQuestionnaire] = useState({
    name: '',
    description: '',
    purpose: '',
    category: 'General'
  });

  // Mock data - in real app this would come from API/database
  const dashboardStats: DashboardStats = {
    totalQuestionnaires: 12,
    activeQuestionnaires: 8,
    inactiveQuestionnaires: 2,
    draftQuestionnaires: 2,
    totalResponses: 1247,
    averageCompletionRate: 78.5,
    recentActivity: [
      { id: '1', type: 'created', questionnaireName: 'Customer Feedback Survey', timestamp: '2 hours ago', user: 'John Doe' },
      { id: '2', type: 'updated', questionnaireName: 'Employee Onboarding', timestamp: '4 hours ago', user: 'Jane Smith' },
      { id: '3', type: 'published', questionnaireName: 'Product Review Form', timestamp: '1 day ago', user: 'Mike Johnson' }
    ]
  };

  const questionnaires: Questionnaire[] = [
    {
      id: '1',
      name: 'US State Demographics Survey',
      description: 'Comprehensive demographic survey for US states',
      purpose: 'Collect demographic data across different US states',
      category: 'Demographics',
      status: 'Active',
      version: '2.1.0',
      createdAt: '2025-01-15',
      updatedAt: '2025-01-25',
      createdBy: 'John Doe',
      tier: 'platinum',
      sections: [],
      controls: [],
      analytics: {
        totalResponses: 342,
        completionRate: 85.2,
        averageTime: 8.5,
        lastResponse: '2 hours ago'
      },
      versions: []
    },
    {
      id: '2',
      name: 'Customer Satisfaction Survey',
      description: 'Monthly customer satisfaction tracking',
      purpose: 'Track customer satisfaction metrics monthly',
      category: 'Customer Experience',
      status: 'Active',
      version: '1.3.0',
      createdAt: '2025-01-10',
      updatedAt: '2025-01-20',
      createdBy: 'Jane Smith',
      tier: 'gold',
      sections: [],
      controls: [],
      analytics: {
        totalResponses: 156,
        completionRate: 72.8,
        averageTime: 5.2,
        lastResponse: '1 hour ago'
      },
      versions: []
    },
    {
      id: '3',
      name: 'Employee Onboarding Form',
      description: 'New employee information collection',
      purpose: 'Streamline new employee onboarding process',
      category: 'HR',
      status: 'Draft',
      version: '1.0.0',
      createdAt: '2025-01-22',
      updatedAt: '2025-01-26',
      createdBy: 'Mike Johnson',
      tier: 'silver',
      sections: [],
      controls: [],
      analytics: {
        totalResponses: 0,
        completionRate: 0,
        averageTime: 0,
        lastResponse: 'Never'
      },
      versions: []
    }
  ];

  const filteredQuestionnaires = questionnaires.filter(q => {
    const matchesSearch = q.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         q.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateQuestionnaire = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, this would create the questionnaire and redirect to design mode
    console.log('Creating questionnaire:', newQuestionnaire);
    setShowCreateForm(false);
    onCreateQuestionnaire();
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
                {filteredQuestionnaires.map((questionnaire) => (
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
                        <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
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