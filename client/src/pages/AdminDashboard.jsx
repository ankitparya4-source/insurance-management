import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Check, X, AlertCircle, AlertTriangle, Shield, Clock, FileCheck, Layers } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    policiesSold: 0,
    totalRevenue: 0,
    pendingClaims: 0,
  });

  const [activeTab, setActiveTab] = useState('claims'); // Default to claims queue as it requires underwriting action!
  const [policies, setPolicies] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Policy Modal state
  const [policyModalOpen, setPolicyModalOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [policyForm, setPolicyForm] = useState({
    title: '',
    category: 'Health',
    description: '',
    basePremium: '',
    coverageAmount: '',
    durationInMonths: '12',
    features: '',
    isActive: true,
  });
  const [policySubmitting, setPolicySubmitting] = useState(false);
  const [policyError, setPolicyError] = useState('');

  // Claim Resolution Modal state
  const [claimActionModalOpen, setClaimActionModalOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [claimActionType, setClaimActionType] = useState('Approved');
  const [adminRemarks, setAdminRemarks] = useState('');
  const [claimSubmitting, setClaimSubmitting] = useState(false);
  const [claimError, setClaimError] = useState('');

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const loadAllAdminData = async () => {
    setLoading(true);
    setError('');
    try {
      const [statsRes, policiesRes, claimsRes] = await Promise.all([
        api.get('/api/admin/stats'),
        api.get('/api/policies?includeInactive=true'),
        api.get('/api/claims/all'),
      ]);
      setStats(statsRes.data);
      setPolicies(policiesRes.data);
      setClaims(claimsRes.data);
    } catch (err) {
      setError('Error loading administrative data. Please verify your admin session.');
    } finally {
      setLoading(false);
    }
  };

  // Policy Actions
  const openAddPolicyModal = () => {
    setEditingPolicy(null);
    setPolicyForm({
      title: '',
      category: 'Health',
      description: '',
      basePremium: '',
      coverageAmount: '',
      durationInMonths: '12',
      features: '',
      isActive: true,
    });
    setPolicyError('');
    setPolicyModalOpen(true);
  };

  const openEditPolicyModal = (policy) => {
    setEditingPolicy(policy);
    setPolicyForm({
      title: policy.title,
      category: policy.category,
      description: policy.description || '',
      basePremium: policy.basePremium.toString(),
      coverageAmount: policy.coverageAmount.toString(),
      durationInMonths: policy.durationInMonths.toString(),
      features: policy.features ? policy.features.join(', ') : '',
      isActive: policy.isActive,
    });
    setPolicyError('');
    setPolicyModalOpen(true);
  };

  const handlePolicyFormSubmit = async (e) => {
    e.preventDefault();
    setPolicyError('');
    setPolicySubmitting(true);

    const payload = {
      title: policyForm.title.trim(),
      category: policyForm.category,
      description: policyForm.description.trim(),
      basePremium: Number(policyForm.basePremium),
      coverageAmount: Number(policyForm.coverageAmount),
      durationInMonths: Number(policyForm.durationInMonths),
      features: policyForm.features
        .split(',')
        .map((f) => f.trim())
        .filter(Boolean),
      isActive: policyForm.isActive,
    };

    try {
      if (editingPolicy) {
        await api.put(`/api/policies/${editingPolicy._id}`, payload);
      } else {
        await api.post('/api/policies', payload);
      }
      setPolicyModalOpen(false);
      loadAllAdminData();
    } catch (err) {
      setPolicyError(err.response?.data?.message || 'Error saving policy configuration');
    } finally {
      setPolicySubmitting(false);
    }
  };

  const handleDeactivatePolicy = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this policy? Customers will no longer be able to purchase it, but existing customer policies will remain active.')) {
      return;
    }
    try {
      await api.delete(`/api/policies/${id}`);
      loadAllAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deactivating policy');
    }
  };

  // Claim Actions
  const openClaimActionModal = (claim, actionType) => {
    setSelectedClaim(claim);
    setClaimActionType(actionType);
    setAdminRemarks('');
    setClaimError('');
    setClaimActionModalOpen(true);
  };

  const handleClaimResolutionSubmit = async (e) => {
    e.preventDefault();
    setClaimError('');
    setClaimSubmitting(true);

    try {
      await api.put(`/api/claims/${selectedClaim._id}/status`, {
        status: claimActionType,
        adminRemarks: adminRemarks.trim(),
      });
      setClaimActionModalOpen(false);
      loadAllAdminData();
    } catch (err) {
      setClaimError(err.response?.data?.message || 'Error updating claim status');
    } finally {
      setClaimSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-cream-100 min-h-screen py-10 sm:py-12 text-navy-950 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Primary Action */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between pb-6 mb-8 border-b border-cream-300 gap-4">
          <div>
            <span className="font-mono text-xs font-bold text-navy-700 uppercase tracking-wider block">
              Administrative Console
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-navy-950 mt-1 tracking-tight">
              Underwriting & Policy Management
            </h1>
            <p className="text-xs sm:text-sm text-navy-700 mt-1">
              Adjudicate customer incident claims, trigger automated coverage decrements, and manage insurance offerings.
            </p>
          </div>

          <button
            onClick={openAddPolicyModal}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-md bg-navy-950 hover:bg-navy-850 text-cream-50 font-display font-bold text-xs shadow-md transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-cream-200" />
            <span>Create New Policy Plan</span>
          </button>
        </div>

        {/* 4 Core KPIs Rail */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-cream-50 border border-cream-300 rounded-lg p-5 shadow-card">
            <span className="text-[10px] font-bold text-navy-600 uppercase tracking-wider block font-mono">
              Platform Gross Revenue
            </span>
            <p className="font-display text-2xl font-black text-navy-950 mt-1">
              ₹{stats.totalRevenue.toLocaleString()}
            </p>
            <span className="text-[11px] text-emerald-700 font-bold block mt-0.5">
              Live collected premiums
            </span>
          </div>

          <div className="bg-cream-50 border border-cream-300 rounded-lg p-5 shadow-card">
            <span className="text-[10px] font-bold text-navy-600 uppercase tracking-wider block font-mono">
              Policies Issued
            </span>
            <p className="font-display text-2xl font-black text-navy-950 mt-1">
              {stats.policiesSold}
            </p>
            <span className="text-[11px] text-navy-600 font-medium block mt-0.5">
              Across all categories
            </span>
          </div>

          <div className="bg-cream-50 border border-cream-300 rounded-lg p-5 shadow-card">
            <span className="text-[10px] font-bold text-navy-600 uppercase tracking-wider block font-mono">
              Pending Adjudications
            </span>
            <p className="font-display text-2xl font-black text-navy-950 mt-1">
              {stats.pendingClaims}
            </p>
            <span className="text-[11px] font-bold block mt-0.5 text-amber-700">
              {stats.pendingClaims > 0 ? 'Requires Underwriting' : 'Queue cleared'}
            </span>
          </div>

          <div className="bg-cream-50 border border-cream-300 rounded-lg p-5 shadow-card">
            <span className="text-[10px] font-bold text-navy-600 uppercase tracking-wider block font-mono">
              Registered Policyholders
            </span>
            <p className="font-display text-2xl font-black text-navy-950 mt-1">
              {stats.totalUsers}
            </p>
            <span className="text-[11px] text-navy-600 font-medium block mt-0.5">
              Verified accounts
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-cream-300 mb-6 space-x-6">
          <button
            onClick={() => setActiveTab('claims')}
            className={`pb-3 text-xs sm:text-sm font-display font-bold border-b-2 flex items-center space-x-2 transition-colors ${
              activeTab === 'claims'
                ? 'border-navy-950 text-navy-950'
                : 'border-transparent text-navy-600 hover:text-navy-950'
            }`}
          >
            <span>Claims Underwriting Queue</span>
            <span
              className={`font-mono text-[10px] px-1.5 py-0.2 rounded font-bold ${
                activeTab === 'claims' ? 'bg-navy-950 text-cream-50' : 'bg-cream-300 text-navy-800'
              }`}
            >
              {claims.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('policies')}
            className={`pb-3 text-xs sm:text-sm font-display font-bold border-b-2 flex items-center space-x-2 transition-colors ${
              activeTab === 'policies'
                ? 'border-navy-950 text-navy-950'
                : 'border-transparent text-navy-600 hover:text-navy-950'
            }`}
          >
            <span>Insurance Catalog Management</span>
            <span
              className={`font-mono text-[10px] px-1.5 py-0.2 rounded font-bold ${
                activeTab === 'policies' ? 'bg-navy-950 text-cream-50' : 'bg-cream-300 text-navy-800'
              }`}
            >
              {policies.length}
            </span>
          </button>
        </div>

        {/* Loading / Error Messages */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-3 border-navy-950 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="font-display text-sm font-bold text-navy-900">Loading administrative records...</p>
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-200 p-6 rounded-lg text-center max-w-md mx-auto">
            <p className="text-xs font-bold text-rose-800">{error}</p>
          </div>
        ) : activeTab === 'claims' ? (
          /* Claims Underwriting Queue */
          <div className="bg-cream-50 border border-cream-300 rounded-lg overflow-hidden shadow-card">
            {claims.length === 0 ? (
              <p className="text-center text-navy-600 py-14 text-xs font-sans">
                No incident claims registered in the platform yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-cream-200 border-b border-cream-300 text-navy-800 font-mono text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-3.5 font-bold">Claim Code</th>
                      <th className="px-5 py-3.5 font-bold">Customer Persona</th>
                      <th className="px-5 py-3.5 font-bold">Policy Plan</th>
                      <th className="px-5 py-3.5 font-bold">Requested Sum</th>
                      <th className="px-5 py-3.5 font-bold">Incident Date</th>
                      <th className="px-5 py-3.5 font-bold">Status</th>
                      <th className="px-5 py-3.5 font-bold">Reason & Justification</th>
                      <th className="px-5 py-3.5 font-bold text-right">Adjudication Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200 font-sans">
                    {claims.map((c) => {
                      const isPending = c.status === 'Pending';
                      return (
                        <tr key={c._id} className="hover:bg-cream-100/60 transition-colors">
                          <td className="px-5 py-3.5 font-mono font-bold text-navy-950">
                            {c.claimNumber}
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="font-bold text-navy-950 block">{c.user?.name || 'Customer'}</span>
                            <span className="text-[11px] text-navy-600 font-mono">{c.user?.email}</span>
                          </td>
                          <td className="px-5 py-3.5 text-navy-900 font-medium">
                            <span className="block font-bold">{c.userPolicy?.policy?.title || 'Policy Plan'}</span>
                            <span className="font-mono text-[10px] text-navy-600 block">{c.userPolicy?.policyNumber}</span>
                          </td>
                          <td className="px-5 py-3.5 font-display font-black text-navy-950 text-sm">
                            ₹{c.claimAmount.toLocaleString()}
                          </td>
                          <td className="px-5 py-3.5 font-mono text-navy-800">
                            {formatDate(c.incidentDate)}
                          </td>
                          <td className="px-5 py-3.5">
                            <span
                              className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold ${
                                c.status === 'Approved'
                                  ? 'bg-emerald-950/10 text-emerald-800 border border-emerald-300'
                                  : c.status === 'Pending'
                                  ? 'bg-amber-950/10 text-amber-800 border border-amber-300'
                                  : 'bg-rose-950/10 text-rose-800 border border-rose-300'
                              }`}
                            >
                              {c.status === 'Pending' ? '● Under Review' : c.status}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 max-w-xs text-navy-800">
                            <p className="italic truncate" title={c.reason}>"{c.reason}"</p>
                            {c.adminRemarks && (
                              <p className="text-[11px] text-navy-950 font-semibold mt-0.5">Remark: {c.adminRemarks}</p>
                            )}
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            {isPending ? (
                              <div className="flex justify-end space-x-1.5">
                                <button
                                  onClick={() => openClaimActionModal(c, 'Approved')}
                                  className="bg-emerald-800 hover:bg-emerald-900 text-cream-50 px-3 py-1.5 rounded text-xs font-display font-bold transition-colors shadow-2xs"
                                >
                                  Approve & Decrement
                                </button>
                                <button
                                  onClick={() => openClaimActionModal(c, 'Rejected')}
                                  className="bg-rose-800 hover:bg-rose-900 text-cream-50 px-2.5 py-1.5 rounded text-xs font-display font-bold transition-colors shadow-2xs"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span className="text-navy-400 font-mono text-[11px] font-bold">LOCKED & SETTLED</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          /* Policies Table */
          <div className="bg-cream-50 border border-cream-300 rounded-lg overflow-hidden shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-cream-200 border-b border-cream-300 text-navy-800 font-mono text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5 font-bold">Policy Title</th>
                    <th className="px-5 py-3.5 font-bold">Sector</th>
                    <th className="px-5 py-3.5 font-bold">Base Premium</th>
                    <th className="px-5 py-3.5 font-bold">Coverage Sum</th>
                    <th className="px-5 py-3.5 font-bold">Duration</th>
                    <th className="px-5 py-3.5 font-bold">Status</th>
                    <th className="px-5 py-3.5 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-200 font-sans">
                  {policies.map((p) => (
                    <tr key={p._id} className="hover:bg-cream-100/60 transition-colors">
                      <td className="px-5 py-3.5 font-display font-bold text-navy-950 text-sm">{p.title}</td>
                      <td className="px-5 py-3.5 font-mono text-navy-800 font-bold">{p.category}</td>
                      <td className="px-5 py-3.5 font-display font-black text-navy-950 text-sm">₹{p.basePremium.toLocaleString()}</td>
                      <td className="px-5 py-3.5 font-display font-black text-navy-900 text-sm">₹{p.coverageAmount.toLocaleString()}</td>
                      <td className="px-5 py-3.5 text-navy-800 font-mono">{p.durationInMonths} Mo</td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold ${
                            p.isActive
                              ? 'bg-emerald-950/10 text-emerald-800 border border-emerald-300'
                              : 'bg-cream-300 text-navy-500'
                          }`}
                        >
                          {p.isActive ? '● Active' : 'Deactivated'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right space-x-2">
                        <button
                          onClick={() => openEditPolicyModal(p)}
                          className="border border-cream-300 px-3 py-1 rounded text-xs font-display font-bold text-navy-900 hover:bg-cream-200 transition-colors"
                        >
                          Edit
                        </button>
                        {p.isActive && (
                          <button
                            onClick={() => handleDeactivatePolicy(p._id)}
                            className="border border-rose-300 text-rose-800 hover:bg-rose-50 px-2.5 py-1 rounded text-xs font-display font-bold transition-colors"
                          >
                            Deactivate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- ADD / EDIT POLICY MODAL --- */}
        {policyModalOpen && (
          <div className="fixed inset-0 bg-navy-950/75 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-cream-50 rounded-xl p-6 sm:p-7 w-full max-w-lg shadow-2xl border border-cream-300 max-h-[92vh] overflow-y-auto text-navy-950 font-sans">
              <div className="flex items-center justify-between pb-3 border-b border-cream-200 mb-5">
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-navy-700 block">
                    Product Configuration
                  </span>
                  <h2 className="font-display text-lg font-black text-navy-950 mt-0.5">
                    {editingPolicy ? 'Edit Insurance Offering' : 'Create New Insurance Offering'}
                  </h2>
                </div>
                <button
                  onClick={() => setPolicyModalOpen(false)}
                  className="text-navy-500 hover:text-navy-950 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {policyError && (
                <p className="text-rose-800 text-xs mb-4 bg-rose-50 p-3 rounded-md border border-rose-200 font-medium">
                  {policyError}
                </p>
              )}

              <form onSubmit={handlePolicyFormSubmit} className="space-y-3.5">
                <div>
                  <label className="block font-display text-xs font-bold text-navy-950 mb-1">Policy Title *</label>
                  <input
                    type="text"
                    required
                    value={policyForm.title}
                    onChange={(e) => setPolicyForm({ ...policyForm, title: e.target.value })}
                    placeholder="e.g. Platinum Health Shield Plus"
                    className="bg-cream-100 border border-cream-300 rounded-md px-3 py-2 w-full text-xs font-medium text-navy-950 focus:outline-none focus:ring-2 focus:ring-navy-950"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-display text-xs font-bold text-navy-950 mb-1">Category Sector *</label>
                    <select
                      value={policyForm.category}
                      onChange={(e) => setPolicyForm({ ...policyForm, category: e.target.value })}
                      className="bg-cream-100 border border-cream-300 rounded-md px-3 py-2 w-full text-xs font-medium text-navy-950 focus:outline-none focus:ring-2 focus:ring-navy-950"
                    >
                      <option value="Health">Health</option>
                      <option value="Auto">Auto</option>
                      <option value="Life">Life</option>
                      <option value="Home">Home</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-display text-xs font-bold text-navy-950 mb-1">Duration (Months) *</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={policyForm.durationInMonths}
                      onChange={(e) => setPolicyForm({ ...policyForm, durationInMonths: e.target.value })}
                      className="bg-cream-100 border border-cream-300 rounded-md px-3 py-2 w-full text-xs font-mono font-bold text-navy-950 focus:outline-none focus:ring-2 focus:ring-navy-950"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-display text-xs font-bold text-navy-950 mb-1">Base Premium (₹) *</label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={policyForm.basePremium}
                      onChange={(e) => setPolicyForm({ ...policyForm, basePremium: e.target.value })}
                      className="bg-cream-100 border border-cream-300 rounded-md px-3 py-2 w-full text-xs font-mono font-bold text-navy-950 focus:outline-none focus:ring-2 focus:ring-navy-950"
                    />
                  </div>

                  <div>
                    <label className="block font-display text-xs font-bold text-navy-950 mb-1">Coverage Amount (₹) *</label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={policyForm.coverageAmount}
                      onChange={(e) => setPolicyForm({ ...policyForm, coverageAmount: e.target.value })}
                      className="bg-cream-100 border border-cream-300 rounded-md px-3 py-2 w-full text-xs font-mono font-bold text-navy-950 focus:outline-none focus:ring-2 focus:ring-navy-950"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-display text-xs font-bold text-navy-950 mb-1">Description</label>
                  <textarea
                    rows="2"
                    value={policyForm.description}
                    onChange={(e) => setPolicyForm({ ...policyForm, description: e.target.value })}
                    placeholder="Brief description of coverage..."
                    className="bg-cream-100 border border-cream-300 rounded-md px-3 py-2 w-full text-xs font-medium text-navy-950 focus:outline-none focus:ring-2 focus:ring-navy-950"
                  />
                </div>

                <div>
                  <label className="block font-display text-xs font-bold text-navy-950 mb-1">Features (comma-separated)</label>
                  <input
                    type="text"
                    value={policyForm.features}
                    onChange={(e) => setPolicyForm({ ...policyForm, features: e.target.value })}
                    placeholder="e.g. Cashless, 24x7 Roadside, Zero Dep"
                    className="bg-cream-100 border border-cream-300 rounded-md px-3 py-2 w-full text-xs font-medium text-navy-950 focus:outline-none focus:ring-2 focus:ring-navy-950"
                  />
                </div>

                {editingPolicy && (
                  <div className="flex items-center space-x-2 pt-1">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={policyForm.isActive}
                      onChange={(e) => setPolicyForm({ ...policyForm, isActive: e.target.checked })}
                      className="rounded accent-navy-950"
                    />
                    <label htmlFor="isActive" className="text-xs font-display font-bold text-navy-950">
                      Policy is Active (visible to customers in catalog)
                    </label>
                  </div>
                )}

                <div className="pt-4 border-t border-cream-200 flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setPolicyModalOpen(false)}
                    className="w-1/3 py-2.5 text-xs font-display font-bold border border-cream-300 hover:bg-cream-200 rounded-md text-navy-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={policySubmitting}
                    className="w-2/3 py-2.5 px-4 rounded-md text-xs font-display font-bold text-cream-50 bg-navy-950 hover:bg-navy-850 active:scale-98 transition-all shadow-md disabled:opacity-50"
                  >
                    {policySubmitting ? 'Saving...' : editingPolicy ? 'Save Policy Changes' : 'Publish Policy'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- APPROVE / REJECT CLAIM MODAL --- */}
        {claimActionModalOpen && selectedClaim && (
          <div className="fixed inset-0 bg-navy-950/75 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-cream-50 rounded-xl p-6 sm:p-7 w-full max-w-md shadow-2xl border border-cream-300 text-navy-950 font-sans">
              <h2 className="font-display text-lg font-black text-navy-950 mb-1">
                {claimActionType === 'Approved' ? 'Approve Insurance Claim' : 'Reject Insurance Claim'}
              </h2>
              <p className="text-xs text-navy-700 mb-3 leading-relaxed">
                Confirm status adjudication for claim <strong className="font-mono text-navy-950">{selectedClaim.claimNumber}</strong> filed by <strong className="text-navy-950">{selectedClaim.user?.name}</strong>.
              </p>

              {claimActionType === 'Approved' && (
                <div className="bg-emerald-950/10 border border-emerald-300 p-3 rounded-lg text-xs text-emerald-900 mb-4 leading-relaxed">
                  ⚠️ <strong>Automated Coverage Decrement:</strong> Approving will immediately reduce <strong>₹{selectedClaim.claimAmount.toLocaleString()}</strong> from the customer's remaining policy coverage balance.
                </div>
              )}

              {claimError && (
                <p className="text-rose-800 text-xs mb-4 bg-rose-50 p-2.5 rounded border border-rose-200 font-medium">
                  {claimError}
                </p>
              )}

              <form onSubmit={handleClaimResolutionSubmit} className="space-y-3.5">
                <div>
                  <label className="block font-display text-xs font-bold text-navy-950 mb-1">
                    Underwriter Assessment Remarks
                  </label>
                  <textarea
                    rows="2"
                    value={adminRemarks}
                    onChange={(e) => setAdminRemarks(e.target.value)}
                    placeholder="e.g. Hospital invoice verified with network partner, settlement approved."
                    className="bg-cream-100 border border-cream-300 rounded-md p-3 w-full text-xs font-medium text-navy-950 focus:outline-none focus:ring-2 focus:ring-navy-950 leading-relaxed"
                  />
                </div>

                <div className="flex space-x-3 pt-3 border-t border-cream-200">
                  <button
                    type="button"
                    onClick={() => setClaimActionModalOpen(false)}
                    className="w-1/3 py-2.5 text-xs font-display font-bold border border-cream-300 hover:bg-cream-200 rounded-md text-navy-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={claimSubmitting}
                    className={`w-2/3 py-2.5 px-4 rounded-md text-xs font-display font-bold text-cream-50 transition-all shadow-md active:scale-98 ${
                      claimActionType === 'Approved'
                        ? 'bg-emerald-800 hover:bg-emerald-900'
                        : 'bg-rose-800 hover:bg-rose-900'
                    }`}
                  >
                    {claimSubmitting ? 'Processing...' : `Confirm ${claimActionType}`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
