'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { formatDateTime, getStatusColor } from '@/lib/utils';
import { Lead, DashboardStats, User } from '@/types';
import {
  Users, TrendingUp, Download, Search, Eye,
  BarChart3, CheckCircle2, Clock, UserCheck, Phone,
  UserPlus, Upload, X, FileText, AlertCircle, CheckCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [telecallers, setTelecallers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [addForm, setAddForm] = useState({ first_name: '', last_name: '', email: '', phone: '', education_level: '', program_category_id: '', current_city: '', state: '', status: 'new', assigned_to_id: '', notes: '' });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkResult, setBulkResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchStats();
    fetchLeads();
    if (user?.role === 'admin') fetchTelecallers();
  }, [filterStatus]);

  const getAuthHeaders = (): Record<string, string> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    return token ? { Authorization: `Bearer ${token}` } : { 'Content-Type': 'application/json' };
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats', { headers: getAuthHeaders() });
      if (response.status === 401) { router.push('/crm/login'); return; }
      const data = await response.json();
      if (data.success) setStats(data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);
      const response = await fetch(`/api/leads?${params.toString()}`, { headers: getAuthHeaders() });
      if (response.status === 401) { router.push('/crm/login'); return; }
      const data = await response.json();
      if (data.success) setLeads(data.data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTelecallers = async () => {
    try {
      const response = await fetch('/api/users', { headers: getAuthHeaders() });
      const data = await response.json();
      if (data.success) {
        setTelecallers(data.data.filter((u: User) => u.role === 'telecaller' && u.is_active));
      }
    } catch (error) {
      console.error('Error fetching telecallers:', error);
    }
  };

  const assignLead = async (leadId: number, userId: number | null) => {
    try {
      await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ assigned_to_id: userId }),
      });
      fetchLeads();
    } catch (error) {
      console.error('Error assigning lead:', error);
    }
  };

  const exportLeads = () => {
    const csv = [
      ['Name', 'Email', 'Phone', 'Education', 'Field', 'Program', 'City', 'State', 'Status', 'Assigned To', 'Created Date'].join(','),
      ...leads.map(lead => [
        `${lead.first_name} ${lead.last_name}`,
        lead.email,
        lead.phone || '',
        lead.education_level || '',
        lead.category_name || '',
        lead.program_title || '',
        lead.current_city || '',
        lead.state || '',
        lead.status,
        lead.assigned_to_name || 'Unassigned',
        formatDateTime(lead.created_at),
      ].map(v => `"${v}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError('');
    try {
      const response = await fetch('/api/leads/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({
          ...addForm,
          program_category_id: addForm.program_category_id ? parseInt(addForm.program_category_id) : null,
          assigned_to_id: addForm.assigned_to_id ? parseInt(addForm.assigned_to_id) : null,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setShowAddModal(false);
        setAddForm({ first_name: '', last_name: '', email: '', phone: '', education_level: '', program_category_id: '', current_city: '', state: '', status: 'new', assigned_to_id: '', notes: '' });
        fetchLeads();
        fetchStats();
      } else {
        setAddError(data.error || 'Failed to add lead');
      }
    } catch {
      setAddError('Network error');
    } finally {
      setAddLoading(false);
    }
  };

  const handleBulkUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkFile) return;
    setBulkLoading(true);
    setBulkResult(null);
    try {
      const formData = new FormData();
      formData.append('file', bulkFile);
      const response = await fetch('/api/leads/bulk', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData,
      });
      const data = await response.json();
      setBulkResult(data);
      if (data.success) {
        fetchLeads();
        fetchStats();
      }
    } catch {
      setBulkResult({ success: false, error: 'Network error' });
    } finally {
      setBulkLoading(false);
    }
  };

  const downloadSampleCSV = () => {
    const csv = 'first_name,last_name,email,phone,education_level,current_city,state,status,notes\nJohn,Doe,john@example.com,9876543210,12th,Mumbai,Maharashtra,new,Interested in Engineering\nJane,Smith,jane@example.com,9876543211,Graduate,Delhi,Delhi,contacted,Looking for MBA';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-leads-template.csv';
    a.click();
  };

  const filteredLeads = leads.filter(lead =>
    `${lead.first_name} ${lead.last_name} ${lead.email} ${lead.phone}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!stats) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${user?.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
              {user?.role === 'admin' ? 'Admin' : 'Telecaller'}
            </span>
          </div>
          <p className="text-gray-600">Welcome back, {user?.name}</p>
          {user?.role === 'telecaller' && (
            <p className="text-xs text-gray-400 mt-0.5">Showing leads assigned to you and unassigned leads</p>
          )}
        </div>
        {user?.role === 'admin' && (
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => { setShowAddModal(true); setAddError(''); }}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Lead
            </button>
            <button
              onClick={() => { setShowBulkModal(true); setBulkResult(null); setBulkFile(null); }}
              className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
            >
              <Upload className="h-4 w-4 mr-2" />
              Bulk Upload
            </button>
            <button
              onClick={exportLeads}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </button>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalLeads}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">{stats.leadsThisMonth} this month</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">New Leads</p>
              <p className="text-2xl font-bold text-gray-900">{stats.newLeads}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Clock className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">{stats.leadsThisWeek} this week</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Qualified</p>
              <p className="text-2xl font-bold text-gray-900">{stats.qualifiedLeads}</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <UserCheck className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">{stats.contactedLeads} contacted</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Converted</p>
              <p className="text-2xl font-bold text-gray-900">{stats.convertedLeads}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">{stats.conversionRate}% rate</p>
        </div>

        {user?.role === 'admin' && (
          <div className="bg-white rounded-xl p-5 shadow-sm border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unassigned</p>
                <p className="text-2xl font-bold text-orange-600">{stats.unassignedLeads || 0}</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Phone className="h-5 w-5 text-orange-600" />
              </div>
            </div>
            <p className="text-xs text-orange-500 mt-1">Needs assignment</p>
          </div>
        )}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
            Top Programs
          </h3>
          <div className="space-y-3">
            {stats.topPrograms.slice(0, 5).map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 truncate mr-4">{item.program}</span>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(item.count / (stats.topPrograms[0]?.count || 1)) * 100}%` }} />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8 text-right">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
            Leads by Status
          </h3>
          <div className="space-y-3">
            {stats.leadsByStatus.map((item) => (
              <div key={item.status} className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
                <span className="text-sm font-medium text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">All Leads</h2>
            <div className="flex gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64 text-sm"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="converted">Converted</option>
                <option value="lost">Lost</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Program</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                {user?.role === 'admin' && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
                )}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-2 text-sm">Loading leads...</p>
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-500 text-sm">No leads found</td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {lead.first_name} {lead.last_name}
                      </div>
                      {lead.current_city && (
                        <div className="text-xs text-gray-500">{lead.current_city}{lead.state ? `, ${lead.state}` : ''}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.email}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {lead.phone || 'N/A'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-gray-900">{lead.program_title || 'Not specified'}</div>
                      {lead.education_level && (
                        <div className="text-xs text-gray-500">{lead.education_level}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    {user?.role === 'admin' && (
                      <td className="px-4 py-3 whitespace-nowrap">
                        <select
                          value={lead.assigned_to_id || ''}
                          onChange={(e) => assignLead(lead.id, e.target.value ? parseInt(e.target.value) : null)}
                          className="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
                        >
                          <option value="">Unassigned</option>
                          {telecallers.map((tc) => (
                            <option key={tc.id} value={tc.id}>{tc.name}</option>
                          ))}
                        </select>
                        {lead.assigned_at && (
                          <div className="text-[10px] text-gray-400 mt-1">
                            {formatDateTime(lead.assigned_at)}
                          </div>
                        )}
                      </td>
                    )}
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                      {formatDateTime(lead.created_at)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Link
                        href={`/crm/leads/${lead.id}`}
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-medium"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== ADD LEAD MODAL ===== */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Add New Lead</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleAddLead} className="p-5 space-y-4">
              {addError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg">{addError}</div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input type="text" required value={addForm.first_name} onChange={(e) => setAddForm({ ...addForm, first_name: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input type="text" required value={addForm.last_name} onChange={(e) => setAddForm({ ...addForm, last_name: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input type="email" required value={addForm.email} onChange={(e) => setAddForm({ ...addForm, email: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="tel" value={addForm.phone} onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Education Level</label>
                  <select value={addForm.education_level} onChange={(e) => setAddForm({ ...addForm, education_level: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm bg-white">
                    <option value="">Select</option>
                    <option value="10th">10th</option>
                    <option value="12th">12th</option>
                    <option value="Graduate">Graduate</option>
                    <option value="Postgraduate">Postgraduate</option>
                    <option value="Working Professional">Working Professional</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={addForm.status} onChange={(e) => setAddForm({ ...addForm, status: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm bg-white">
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="converted">Converted</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input type="text" value={addForm.current_city} onChange={(e) => setAddForm({ ...addForm, current_city: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input type="text" value={addForm.state} onChange={(e) => setAddForm({ ...addForm, state: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
                <select value={addForm.assigned_to_id} onChange={(e) => setAddForm({ ...addForm, assigned_to_id: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm bg-white">
                  <option value="">Leave Unassigned</option>
                  {telecallers.map((tc) => (
                    <option key={tc.id} value={tc.id}>{tc.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea value={addForm.notes} onChange={(e) => setAddForm({ ...addForm, notes: e.target.value })} rows={2} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Any additional notes..." />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={addLoading} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50">
                  {addLoading ? 'Adding...' : 'Add Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== BULK UPLOAD MODAL ===== */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Bulk Upload Leads</h2>
              <button onClick={() => setShowBulkModal(false)} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-5">
              {/* Sample CSV Download */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-5">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Download Sample CSV</p>
                    <p className="text-xs text-blue-700 mt-1">Use this template with the correct column headers</p>
                    <button onClick={downloadSampleCSV} className="mt-2 text-xs font-medium text-blue-700 hover:text-blue-900 underline">
                      Download sample-leads-template.csv
                    </button>
                  </div>
                </div>
                <div className="mt-3 bg-white rounded p-2 text-[10px] font-mono text-gray-600 overflow-x-auto">
                  first_name, last_name, email, phone, education_level, current_city, state, status, notes
                </div>
              </div>

              {!bulkResult ? (
                <form onSubmit={handleBulkUpload}>
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-orange-400 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files[0]) setBulkFile(e.dataTransfer.files[0]); }}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-700">
                      {bulkFile ? bulkFile.name : 'Click to select or drag & drop CSV file'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Max 500 rows per upload</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={(e) => setBulkFile(e.target.files?.[0] || null)}
                    />
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button type="button" onClick={() => setShowBulkModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                    <button type="submit" disabled={!bulkFile || bulkLoading} className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 disabled:opacity-50">
                      {bulkLoading ? 'Uploading...' : 'Upload Leads'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className={`rounded-lg p-5 ${bulkResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  {bulkResult.success ? (
                    <>
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <p className="text-sm font-semibold text-green-900">{bulkResult.message}</p>
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="bg-white rounded-lg p-3">
                          <p className="text-lg font-bold text-green-600">{bulkResult.data.inserted}</p>
                          <p className="text-xs text-gray-600">Added</p>
                        </div>
                        <div className="bg-white rounded-lg p-3">
                          <p className="text-lg font-bold text-yellow-600">{bulkResult.data.duplicates}</p>
                          <p className="text-xs text-gray-600">Duplicates</p>
                        </div>
                        <div className="bg-white rounded-lg p-3">
                          <p className="text-lg font-bold text-red-600">{bulkResult.data.failed}</p>
                          <p className="text-xs text-gray-600">Failed</p>
                        </div>
                      </div>
                      {bulkResult.data.failedRows && bulkResult.data.failedRows.length > 0 && (
                        <div className="mt-3 text-xs text-red-700 bg-white rounded p-2">
                          <p className="font-medium mb-1">Failed rows:</p>
                          {bulkResult.data.failedRows.map((r: string, i: number) => <p key={i}>{r}</p>)}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                      <p className="text-sm font-medium text-red-900">{bulkResult.error}</p>
                    </div>
                  )}
                  <button onClick={() => { setShowBulkModal(false); }} className="mt-4 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">Close</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}