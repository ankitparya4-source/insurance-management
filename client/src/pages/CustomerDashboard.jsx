import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import FileClaimModal from '../components/FileClaimModal';
import { Shield, FileText, Plus, AlertCircle, ArrowUpRight, CheckCircle2, Clock, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('policies'); // 'policies' | 'claims'
  const [policies, setPolicies] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPolicyForClaim, setSelectedPolicyForClaim] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const [policiesRes, claimsRes] = await Promise.all([
        api.get('/api/user-policies/my'),
        api.get('/api/claims/my'),
      ]);
      setPolicies(policiesRes.data);
      setClaims(claimsRes.data);
    } catch (err) {
      setError('Failed to fetch portfolio data. Please check connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const totalCoverage = policies.reduce((acc, p) => acc + (p.remainingCoverage || 0), 0);
  const totalInvested = policies.reduce((acc, p) => acc + (p.premiumPaid || 0), 0);
  const pendingClaimsCount = claims.filter((c) => c.status === 'Pending').length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
      case 'Approved':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-emerald-950/10 text-emerald-800 border border-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            <span>{status}</span>
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-amber-950/10 text-amber-800 border border-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
            <span>Under Review</span>
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-rose-950/10 text-rose-800 border border-rose-300">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
            <span>Rejected</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-bold bg-cream-200 text-navy-800 border border-cream-300">
            {status}
          </span>
        );
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
        
        {/* Level 1: Portfolio Header & Action */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between pb-6 mb-8 border-b border-cream-300 gap-4">
          <div>
            <span className="font-mono text-xs font-bold text-navy-700 uppercase tracking-wider block">
              Policyholder Account
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-navy-950 mt-1 tracking-tight">
              {user?.name || 'Ankit'}'s Insurance Portfolio
            </h1>
            <p className="text-xs sm:text-sm text-navy-700 mt-1">
              Active insurance certificates, real-time coverage balances, and claims adjudication history.
            </p>
          </div>

          <Link
            to="/policies"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-md bg-navy-950 hover:bg-navy-850 text-cream-50 font-display font-bold text-xs shadow-md transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-cream-200" />
            <span>Purchase New Policy</span>
          </Link>
        </div>

        {/* Level 2: 4 Institutional Metrics Rail */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-cream-50 border border-cream-300 rounded-lg p-5 shadow-card">
            <span className="text-[10px] font-bold text-navy-600 uppercase tracking-wider block font-mono">
              Active Policies
            </span>
            <p className="font-display text-2xl font-black text-navy-950 mt-1">{policies.length}</p>
            <span className="text-[11px] text-emerald-700 font-bold block mt-0.5">
              Verified active & valid
            </span>
          </div>

          <div className="bg-cream-50 border border-cream-300 rounded-lg p-5 shadow-card">
            <span className="text-[10px] font-bold text-navy-600 uppercase tracking-wider block font-mono">
              Available Coverage Limit
            </span>
            <p className="font-display text-2xl font-black text-navy-950 mt-1">₹{totalCoverage.toLocaleString()}</p>
            <span className="text-[11px] text-navy-600 font-medium block mt-0.5">
              Total remaining sum
            </span>
          </div>

          <div className="bg-cream-50 border border-cream-300 rounded-lg p-5 shadow-card">
            <span className="text-[10px] font-bold text-navy-600 uppercase tracking-wider block font-mono">
              Total Premium Invested
            </span>
            <p className="font-display text-2xl font-black text-navy-900 mt-1">₹{totalInvested.toLocaleString()}</p>
            <span className="text-[11px] text-navy-600 font-medium block mt-0.5">
              Annual cumulative debits
            </span>
          </div>

          <div className="bg-cream-50 border border-cream-300 rounded-lg p-5 shadow-card">
            <span className="text-[10px] font-bold text-navy-600 uppercase tracking-wider block font-mono">
              Claim Submissions
            </span>
            <p className="font-display text-2xl font-black text-navy-950 mt-1">{claims.length}</p>
            <span className="text-[11px] font-bold block mt-0.5 text-amber-700">
              {pendingClaimsCount > 0 ? `${pendingClaimsCount} Under Review` : 'All finalized'}
            </span>
          </div>
        </div>

        {/* Level 3: Segmented Section Toggle */}
        <div className="flex border-b border-cream-300 mb-6 space-x-6">
          <button
            onClick={() => setActiveTab('policies')}
            className={`pb-3 text-xs sm:text-sm font-display font-bold border-b-2 flex items-center space-x-2 transition-colors ${
              activeTab === 'policies'
                ? 'border-navy-950 text-navy-950'
                : 'border-transparent text-navy-600 hover:text-navy-950'
            }`}
          >
            <span>Active Policies</span>
            <span
              className={`font-mono text-[10px] px-1.5 py-0.2 rounded font-bold ${
                activeTab === 'policies' ? 'bg-navy-950 text-cream-50' : 'bg-cream-300 text-navy-800'
              }`}
            >
              {policies.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('claims')}
            className={`pb-3 text-xs sm:text-sm font-display font-bold border-b-2 flex items-center space-x-2 transition-colors ${
              activeTab === 'claims'
                ? 'border-navy-950 text-navy-950'
                : 'border-transparent text-navy-600 hover:text-navy-950'
            }`}
          >
            <span>Claims Filing History</span>
            <span
              className={`font-mono text-[10px] px-1.5 py-0.2 rounded font-bold ${
                activeTab === 'claims' ? 'bg-navy-950 text-cream-50' : 'bg-cream-300 text-navy-800'
              }`}
            >
              {claims.length}
            </span>
          </button>
        </div>

        {/* Loading / Error States */}
        {loading && (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-3 border-navy-950 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="font-display text-sm font-bold text-navy-900">Retrieving portfolio records...</p>
          </div>
        )}

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-lg flex items-center space-x-3 text-xs mb-8">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-bold">{error}</p>
              <button
                onClick={fetchDashboardData}
                className="underline mt-1 font-semibold text-rose-900"
              >
                Retry loading data
              </button>
            </div>
          </div>
        )}

        {/* Active Policies List */}
        {!loading && !error && activeTab === 'policies' && (
          <div>
            {policies.length === 0 ? (
              <div className="bg-cream-50 border border-cream-300 rounded-lg p-12 text-center max-w-md mx-auto">
                <Shield className="w-10 h-10 text-navy-400 mx-auto mb-3" />
                <h3 className="font-display text-lg font-bold text-navy-950">No Active Policies Enrolled</h3>
                <p className="text-xs text-navy-700 mt-1 mb-5 leading-relaxed">
                  You have not purchased an insurance policy yet. Browse our insurance lines to get covered in seconds.
                </p>
                <Link
                  to="/policies"
                  className="px-4 py-2.5 rounded-md bg-navy-950 text-cream-50 text-xs font-display font-bold hover:bg-navy-850 transition-colors inline-block"
                >
                  Explore Policy Catalog
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {policies.map((userPolicy) => {
                  const policyData = userPolicy.policyId || {};
                  const initialCoverage = policyData.coverageAmount
                    ? policyData.coverageAmount * (userPolicy.multiplier || 1)
                    : userPolicy.remainingCoverage;
                  const usedCoverage = initialCoverage - userPolicy.remainingCoverage;
                  const usagePercent =
                    initialCoverage > 0
                      ? Math.min(100, Math.round((usedCoverage / initialCoverage) * 100))
                      : 0;

                  return (
                    <div
                      key={userPolicy._id}
                      className="bg-cream-50 border border-cream-300 rounded-lg p-5 sm:p-6 hover:border-navy-400 hover:shadow-card transition-all"
                    >
                      {/* Top Bar: Title, Policy #, Status */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-cream-200 gap-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-display text-lg font-bold text-navy-950">
                              {policyData.title || 'Custom Policy'}
                            </span>
                            <span className="font-mono text-xs font-bold text-navy-800 bg-cream-200 border border-cream-300 px-2 py-0.5 rounded">
                              {policyData.category || 'General'}
                            </span>
                          </div>
                          <span className="font-mono text-xs text-navy-600 block mt-1">
                            Certificate ID: <strong className="text-navy-950">{userPolicy.policyNumber}</strong>
                          </span>
                        </div>

                        <div className="flex items-center space-x-3 self-start sm:self-auto">
                          {getStatusBadge(userPolicy.status)}
                          <button
                            onClick={() => setSelectedPolicyForClaim(userPolicy)}
                            disabled={userPolicy.status !== 'Active' || userPolicy.remainingCoverage <= 0}
                            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-navy-950 hover:bg-navy-850 active:scale-98 text-cream-50 text-xs font-display font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>File Incident Claim</span>
                          </button>
                        </div>
                      </div>

                      {/* Middle: Coverage Breakdown & Progress */}
                      <div className="py-4 border-b border-cream-200">
                        <div className="flex justify-between items-baseline text-xs mb-1.5">
                          <span className="font-mono font-bold text-navy-700">
                            COVERAGE STATUS & REMAINING BALANCE
                          </span>
                          <span className="font-mono font-bold text-navy-950">
                            ₹{userPolicy.remainingCoverage.toLocaleString()} remaining of ₹{initialCoverage.toLocaleString()}
                          </span>
                        </div>

                        {/* Coverage Progress Bar */}
                        <div className="w-full bg-cream-300 rounded-full h-2 overflow-hidden flex">
                          <div
                            className="bg-navy-950 h-full rounded-full transition-all duration-500"
                            style={{ width: `${100 - usagePercent}%` }}
                            title={`${100 - usagePercent}% remaining`}
                          />
                          <div
                            className="bg-amber-600 h-full transition-all duration-500"
                            style={{ width: `${usagePercent}%` }}
                            title={`${usagePercent}% claimed`}
                          />
                        </div>

                        <div className="flex justify-between text-[11px] font-mono text-navy-600 mt-1.5">
                          <span>Balance: {100 - usagePercent}% available</span>
                          <span>{usagePercent > 0 ? `₹${usedCoverage.toLocaleString()} Claimed to date` : 'No claims debited'}</span>
                        </div>
                      </div>

                      {/* Bottom Grid: Policy Details */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
                        <div>
                          <span className="text-[10px] font-bold text-navy-600 uppercase tracking-wider block font-mono">
                            Premium Paid
                          </span>
                          <span className="font-display text-sm font-bold text-navy-950 mt-0.5 block">
                            ₹{userPolicy.premiumPaid.toLocaleString()}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-navy-600 uppercase tracking-wider block font-mono">
                            Nominee Beneficiary
                          </span>
                          <span className="font-semibold text-navy-950 mt-0.5 block truncate">
                            {userPolicy.nominee?.name || 'Self'} ({userPolicy.nominee?.relation || 'Primary'})
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-navy-600 uppercase tracking-wider block font-mono">
                            Effective Start
                          </span>
                          <span className="font-mono text-navy-800 mt-0.5 block">
                            {formatDate(userPolicy.startDate)}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-navy-600 uppercase tracking-wider block font-mono">
                            Term Expiry
                          </span>
                          <span className="font-mono text-navy-800 mt-0.5 block">
                            {formatDate(userPolicy.endDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Claims History Tab */}
        {!loading && !error && activeTab === 'claims' && (
          <div>
            {claims.length === 0 ? (
              <div className="bg-cream-50 border border-cream-300 rounded-lg p-12 text-center max-w-md mx-auto">
                <FileText className="w-10 h-10 text-navy-400 mx-auto mb-3" />
                <h3 className="font-display text-lg font-bold text-navy-950">No Incident Claims Logged</h3>
                <p className="text-xs text-navy-700 mt-1 leading-relaxed">
                  You have not submitted any insurance claims. If you experience a covered incident, use the "File Incident Claim" button next to your active policy.
                </p>
              </div>
            ) : (
              <div className="bg-cream-50 border border-cream-300 rounded-lg overflow-hidden shadow-card">
                <div className="overflow-x-auto">
                  <table className="min-h-full w-full text-left text-xs">
                    <thead className="bg-cream-200 border-b border-cream-300 text-navy-800 font-mono text-[11px] uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4 font-bold">Claim Reference</th>
                        <th className="py-3 px-4 font-bold">Policy & Plan</th>
                        <th className="py-3 px-4 font-bold">Incident Date</th>
                        <th className="py-3 px-4 font-bold">Claimed Sum</th>
                        <th className="py-3 px-4 font-bold">Adjudication Status</th>
                        <th className="py-3 px-4 font-bold">Underwriter Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cream-200 font-sans">
                      {claims.map((claim) => (
                        <tr key={claim._id} className="hover:bg-cream-100/60 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-navy-950">
                            {claim.claimNumber}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-navy-950 block">
                              {claim.userPolicyId?.policyId?.title || 'Policy Plan'}
                            </span>
                            <span className="font-mono text-[11px] text-navy-600 block mt-0.5">
                              {claim.userPolicyId?.policyNumber}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-navy-800">
                            {formatDate(claim.incidentDate)}
                          </td>
                          <td className="py-3.5 px-4 font-display font-black text-navy-950 text-sm">
                            ₹{claim.claimAmount.toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4">
                            {getStatusBadge(claim.status)}
                          </td>
                          <td className="py-3.5 px-4 text-navy-700 max-w-xs">
                            <p className="truncate" title={claim.adminRemarks || claim.reason}>
                              {claim.adminRemarks ? (
                                <span className="font-medium text-navy-950">
                                  {claim.adminRemarks}
                                </span>
                              ) : (
                                <span className="italic text-navy-500">
                                  Reason: {claim.reason}
                                </span>
                              )}
                            </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* File Incident Claim Modal */}
        {selectedPolicyForClaim && (
          <FileClaimModal
            userPolicy={selectedPolicyForClaim}
            onClose={() => setSelectedPolicyForClaim(null)}
            onSuccess={() => {
              fetchDashboardData();
              setActiveTab('claims');
            }}
          />
        )}

      </div>
    </div>
  );
};

export default CustomerDashboard;
