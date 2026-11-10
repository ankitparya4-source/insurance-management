import React, { useState } from 'react';
import api from '../api/axios';
import { Check, X, AlertCircle, AlertTriangle, ShieldAlert, ArrowRight } from 'lucide-react';

const FileClaimModal = ({ userPolicy, onClose, onSuccess }) => {
  const [incidentDate, setIncidentDate] = useState('');
  const [claimAmount, setClaimAmount] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [filedClaim, setFiledClaim] = useState(null);

  const amountNum = Number(claimAmount);
  const isOverLimit = amountNum > userPolicy.remainingCoverage;
  const isZeroOrNegative = claimAmount !== '' && amountNum <= 0;

  const todayStr = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!incidentDate || !claimAmount || !reason.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (isOverLimit) {
      setError(`Claim amount cannot exceed remaining coverage of ₹${userPolicy.remainingCoverage.toLocaleString()}`);
      return;
    }

    if (isZeroOrNegative) {
      setError('Claim amount must be a positive number greater than zero.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const { data } = await api.post('/api/claims', {
        userPolicyId: userPolicy._id,
        incidentDate,
        claimAmount: amountNum,
        reason: reason.trim(),
      });

      setFiledClaim(data);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting claim. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-navy-950/75 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-cream-50 rounded-xl p-6 sm:p-7 w-full max-w-lg shadow-2xl border border-cream-300 max-h-[92vh] overflow-y-auto text-navy-950 font-sans">
        {filedClaim ? (
          /* Success Screen */
          <div className="text-left py-1">
            <div className="flex items-center space-x-2 text-emerald-800 pb-3 border-b border-cream-200 mb-4">
              <Check className="w-5 h-5 font-bold" />
              <h2 className="font-display text-lg font-bold text-navy-950">
                Claim Filed Successfully
              </h2>
            </div>

            <p className="text-xs text-navy-700 mb-5 leading-relaxed">
              Your incident report has been registered and placed in the administrative underwriting queue for assessment.
            </p>

            <div className="bg-cream-100 border border-cream-300 rounded-lg p-4 mb-6 space-y-2.5 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-cream-300">
                <span className="text-navy-700 font-semibold">Claim Tracking Code</span>
                <span className="font-mono font-bold text-navy-950 bg-cream-50 border border-cream-300 px-2 py-0.5 rounded">
                  {filedClaim.claimNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-navy-700">Policy Certificate:</span>
                <span className="font-mono font-bold text-navy-950">{userPolicy.policyNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-navy-700">Claim Amount:</span>
                <span className="font-display font-black text-navy-950 text-sm">
                  ₹{filedClaim.claimAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-navy-700">Incident Date:</span>
                <span className="font-mono text-navy-800">
                  {new Date(filedClaim.incidentDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-navy-700">Status:</span>
                <span className="font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                  Under Review
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-md bg-navy-950 hover:bg-navy-850 text-cream-50 font-display font-bold text-xs flex items-center justify-center space-x-2 transition-colors shadow-sm"
            >
              <span>Return to Portfolio</span>
              <ArrowRight className="w-3.5 h-3.5 text-cream-200" />
            </button>
          </div>
        ) : (
          /* Form Screen */
          <form onSubmit={handleSubmit}>
            <div className="flex justify-between items-center pb-3 border-b border-cream-200 mb-5">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-navy-700 block">
                  Incident Reporting & Loss Recovery
                </span>
                <h2 className="font-display text-lg font-black text-navy-950 mt-0.5">
                  File Insurance Claim
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-navy-500 hover:text-navy-950 p-1 rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-rose-800 bg-rose-50 border border-rose-200 text-xs p-3 rounded-md mb-4">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Target Policy Banner */}
            <div className="bg-cream-100 border border-cream-300 rounded-lg p-3.5 mb-5 text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono text-[10px] font-bold text-navy-600 uppercase tracking-wider block">
                    Claim Against Policy
                  </span>
                  <p className="font-display text-sm font-bold text-navy-950 mt-0.5">
                    {userPolicy.policyId?.title || 'Policy Plan'}
                  </p>
                  <span className="font-mono text-navy-700 block mt-0.5">
                    ID: {userPolicy.policyNumber}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono text-[10px] font-bold text-navy-600 uppercase tracking-wider block">
                    Remaining Ceiling
                  </span>
                  <span className="font-display text-base font-black text-navy-950 block mt-0.5">
                    ₹{userPolicy.remainingCoverage.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {/* Incident Date */}
              <div>
                <label className="block font-display text-xs font-bold text-navy-950 mb-1">
                  Incident Occurrence Date *
                </label>
                <input
                  type="date"
                  max={todayStr}
                  required
                  value={incidentDate}
                  onChange={(e) => setIncidentDate(e.target.value)}
                  className="w-full bg-cream-100 border border-cream-300 rounded-md px-3 py-2 text-xs font-medium text-navy-950 focus:outline-none focus:ring-2 focus:ring-navy-950 font-mono"
                />
              </div>

              {/* Claim Amount */}
              <div>
                <div className="flex justify-between items-baseline mb-1">
                  <label className="font-display text-xs font-bold text-navy-950">
                    Claim Sum Requested (₹) *
                  </label>
                  <span className="font-mono text-[10px] text-navy-600">
                    Max: ₹{userPolicy.remainingCoverage.toLocaleString()}
                  </span>
                </div>
                <input
                  type="number"
                  min="1"
                  max={userPolicy.remainingCoverage}
                  required
                  placeholder="e.g. 25000"
                  value={claimAmount}
                  onChange={(e) => setClaimAmount(e.target.value)}
                  className={`w-full bg-cream-100 border rounded-md px-3 py-2 text-xs font-mono font-bold text-navy-950 focus:outline-none focus:ring-2 ${
                    isOverLimit
                      ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/50'
                      : 'border-cream-300 focus:ring-navy-950'
                  }`}
                />

                {isOverLimit && (
                  <p className="flex items-center space-x-1 text-rose-700 text-[11px] font-bold mt-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>Amount exceeds remaining policy balance of ₹{userPolicy.remainingCoverage.toLocaleString()}</span>
                  </p>
                )}
              </div>

              {/* Reason / Incident Description */}
              <div>
                <label className="block font-display text-xs font-bold text-navy-950 mb-1">
                  Incident Description & Claim Justification *
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="Detail the circumstances of the hospital admission, vehicular collision, or property damage..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-cream-100 border border-cream-300 rounded-md p-3 text-xs font-medium text-navy-950 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-950 leading-relaxed"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3 pt-4 border-t border-cream-200">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-2.5 text-xs font-display font-bold border border-cream-300 hover:bg-cream-200 rounded-md text-navy-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || isOverLimit || isZeroOrNegative || !claimAmount}
                className="w-2/3 py-2.5 px-4 rounded-md bg-navy-950 hover:bg-navy-850 active:scale-98 text-cream-50 font-display font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShieldAlert className="w-4 h-4 text-cream-200" />
                <span>{submitting ? 'Submitting to Queue...' : 'File Claim for Review'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default FileClaimModal;
