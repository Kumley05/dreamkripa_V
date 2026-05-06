'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Lead, FollowUp, User } from '@/types';
import { formatDateTime, getStatusColor } from '@/lib/utils';
import {
  ArrowLeft, Phone, Mail, MapPin, GraduationCap, Calendar,
  Clock, MessageSquare, User as UserIcon, Plus, CheckCircle2,
  AlertCircle, Send
} from 'lucide-react';

export default function LeadDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const leadId = params.id as string;

  const [lead, setLead] = useState<Lead | null>(null);
  const [followups, setFollowups] = useState<FollowUp[]>([]);
  const [telecallers, setTelecallers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFollowupForm, setShowFollowupForm] = useState(false);
  const [followupForm, setFollowupForm] = useState({
    status: 'contacted',
    remarks: '',
    next_followup_at: '',
  });

  const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  useEffect(() => {
    if (leadId) {
      fetchLead();
      fetchFollowups();
      if (user?.role === 'admin') fetchTelecallers();
    }
  }, [leadId]);

  const fetchLead = async () => {
    try {
      const response = await fetch(`/api/leads`, { headers: getAuthHeaders() });
      const data = await response.json();
      if (data.success) {
        const found = data.data.find((l: Lead) => l.id === parseInt(leadId));
        if (found) setLead(found);
      }
    } catch (error) {
      console.error('Error fetching lead:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFollowups = async () => {
    try {
      const response = await fetch(`/api/followups?leadId=${leadId}`, { headers: getAuthHeaders() });
      const data = await response.json();
      if (data.success) setFollowups(data.data);
    } catch (error) {
      console.error('Error fetching followups:', error);
    }
  };

  const fetchTelecallers = async () => {
    try {
      const response = await fetch('/api/users', { headers: getAuthHeaders() });
      const data = await response.json();
      if (data.success) setTelecallers(data.data.filter((u: User) => u.role === 'telecaller' && u.is_active));
    } catch (error) {
      console.error('Error fetching telecallers:', error);
    }
  };

  const assignLead = async (userId: number | null) => {
    try {
      await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ assigned_to_id: userId }),
      });
      fetchLead();
    } catch (error) {
      console.error('Error assigning lead:', error);
    }
  };

  const handleFollowupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/followups', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          lead_id: parseInt(leadId),
          status: followupForm.status,
          remarks: followupForm.remarks,
          next_followup_at: followupForm.next_followup_at || null,
        }),
      });

      if (response.ok) {
        setFollowupForm({ status: 'contacted', remarks: '', next_followup_at: '' });
        setShowFollowupForm(false);
        fetchFollowups();
        fetchLead();
      }
    } catch (error) {
      console.error('Error creating followup:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Lead not found.</p>
        <button onClick={() => router.push('/crm')} className="mt-4 text-blue-600 hover:underline">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.push('/crm')}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {lead.first_name} {lead.last_name}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(lead.status)}`}>
              {lead.status}
            </span>
            <span className="text-sm text-gray-500">Lead #{lead.id}</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Lead Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Info */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Email</div>
                  <div className="text-sm font-medium text-gray-900">{lead.email}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Phone</div>
                  <div className="text-sm font-medium text-gray-900">{lead.phone || 'N/A'}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Location</div>
                  <div className="text-sm font-medium text-gray-900">
                    {[lead.current_city, lead.state].filter(Boolean).join(', ') || 'Not provided'}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Preferred Intake</div>
                  <div className="text-sm font-medium text-gray-900">{lead.preferred_intake || 'Not specified'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Program Info */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Program Details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="h-4 w-4 text-indigo-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Program</div>
                  <div className="text-sm font-medium text-gray-900">{lead.program_title || 'Not specified'}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <UserIcon className="h-4 w-4 text-teal-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Education Level</div>
                  <div className="text-sm font-medium text-gray-900">{lead.education_level || 'Not specified'}</div>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:col-span-2">
                <div className="w-9 h-9 bg-pink-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="h-4 w-4 text-pink-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Field of Interest</div>
                  <div className="text-sm font-medium text-gray-900">{lead.category_name || 'Not specified'}</div>
                </div>
              </div>
            </div>
            {lead.message && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-start gap-3">
                  <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Message</div>
                    <div className="text-sm text-gray-700">{lead.message}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Follow-ups Timeline */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Follow-up History</h2>
              <button
                onClick={() => setShowFollowupForm(true)}
                className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Follow-up
              </button>
            </div>

            {/* Follow-up Form */}
            {showFollowupForm && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <form onSubmit={handleFollowupSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Update Status *</label>
                      <select
                        value={followupForm.status}
                        onChange={(e) => setFollowupForm({ ...followupForm, status: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="converted">Converted</option>
                        <option value="lost">Lost</option>
                        <option value="callback">Callback Requested</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Next Follow-up Date & Time</label>
                      <input
                        type="datetime-local"
                        value={followupForm.next_followup_at}
                        onChange={(e) => setFollowupForm({ ...followupForm, next_followup_at: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Remarks *</label>
                    <textarea
                      value={followupForm.remarks}
                      onChange={(e) => setFollowupForm({ ...followupForm, remarks: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="Add notes about the call, discussion points, outcome..."
                      required
                    />
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                      <Send className="h-4 w-4 mr-1" />
                      Save Follow-up
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowFollowupForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {followups.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                No follow-ups yet. Click "Add Follow-up" to start tracking.
              </div>
            ) : (
              <div className="space-y-4">
                {followups.map((fu) => (
                  <div key={fu.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        fu.status === 'converted' ? 'bg-green-100' :
                        fu.status === 'lost' ? 'bg-red-100' :
                        fu.status === 'qualified' ? 'bg-purple-100' :
                        'bg-blue-100'
                      }`}>
                        {fu.status === 'converted' ? <CheckCircle2 className="h-4 w-4 text-green-600" /> :
                         fu.status === 'lost' ? <AlertCircle className="h-4 w-4 text-red-600" /> :
                         <Clock className="h-4 w-4 text-blue-600" />}
                      </div>
                      <div className="w-px flex-1 bg-gray-200 mt-2"></div>
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(fu.status)}`}>
                          {fu.status}
                        </span>
                        <span className="text-xs text-gray-500">by {fu.user_name || 'Unknown'}</span>
                      </div>
                      {fu.remarks && (
                        <p className="text-sm text-gray-700 mb-2">{fu.remarks}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDateTime(fu.created_at)}
                        </span>
                        {fu.next_followup_at && (
                          <span className="flex items-center gap-1 text-orange-600">
                            <Calendar className="h-3 w-3" />
                            Next: {formatDateTime(fu.next_followup_at)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Lead Status */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Lead Status</h3>
            <div className="text-center py-3">
              <span className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold ${getStatusColor(lead.status)}`}>
                {lead.status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Assignment */}
          {user?.role === 'admin' && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Assign To</h3>
              <select
                value={lead.assigned_to_id || ''}
                onChange={(e) => assignLead(e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
              >
                <option value="">Unassigned</option>
                {telecallers.map((tc) => (
                  <option key={tc.id} value={tc.id}>{tc.name}</option>
                ))}
              </select>
              {lead.assigned_to_name && (
                <div className="mt-2 text-xs text-gray-500">
                  Currently assigned to: <span className="font-medium text-gray-700">{lead.assigned_to_name}</span>
                </div>
              )}
            </div>
          )}

          {/* Timestamps */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Timestamps</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <div className="text-xs text-gray-500">Created</div>
                  <div className="text-sm font-medium text-gray-900">{formatDateTime(lead.created_at)}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <div>
                  <div className="text-xs text-gray-500">Last Updated</div>
                  <div className="text-sm font-medium text-gray-900">{formatDateTime(lead.updated_at)}</div>
                </div>
              </div>
              {lead.source && (
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="text-xs text-gray-500">Source</div>
                    <div className="text-sm font-medium text-gray-900 capitalize">{lead.source}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Next Follow-up Reminder */}
          {followups.length > 0 && followups[0].next_followup_at && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-orange-800 mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Next Follow-up
              </h3>
              <p className="text-sm font-medium text-orange-900">
                {formatDateTime(followups[0].next_followup_at)}
              </p>
              {new Date(followups[0].next_followup_at) < new Date() && (
                <p className="text-xs text-orange-600 mt-1 font-medium">⚠ Overdue!</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}