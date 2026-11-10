import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Check, X, AlertCircle, ArrowRight, ShieldCheck, User } from 'lucide-react';

const PurchaseModal = ({ policy, onClose, onSuccess }) => {
  const [multiplier, setMultiplier] = useState(1);
  const [nomineeName, setNomineeName] = useState('');
  const [nomineeRelation, setNomineeRelation] = useState('Spouse');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [purchasedPolicy, setPurchasedPolicy] = useState(null);

  const navigate = useNavigate();

  const calculatedPremium = Math.round(policy.basePremium * multiplier);
  const calculatedCoverage = Math.round(policy.coverageAmount * multiplier);

  const handleConfirmPurchase = async (e) => {
    e.preventDefault();
    if (!nomineeName.trim()) {
      setError('Please provide a legal nominee name for insurance certificate records.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const { data } = await api.post('/api/user-policies/purchase', {
        policyId: policy._id,
        nomineeName: nomineeName.trim(),
        nomineeRelation,
        multiplier,
      });

      setPurchasedPolicy(data);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Payment simulation failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-navy-950/75 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-cream-50 rounded-xl p-6 sm:p-7 w-full max-w-lg shadow-2xl border border-cream-300 max-h-[92vh] overflow-y-auto text-navy-950 font-sans">
        {purchasedPolicy ? (
          /* Confirmation Screen */
          <div className="text-left py-1">
            <div className="flex items-center space-x-2 text-emerald-800 pb-3 border-b border-cream-200 mb-4">
              <Check className="w-5 h-5 font-bold" />
              <h2 className="font-display text-lg font-bold text-navy-950">
                Digital Policy Issued Successfully
              </h2>
            </div>

            <p className="text-xs text-navy-700 mb-5 leading-relaxed">
              Your digital policy certificate has been minted, initialized, and placed into active status.
            </p>

            {/* Issued Policy Details */}
            <div className="bg-cream-100 border border-cream-300 rounded-lg p-4 mb-6 space-y-2.5 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-cream-300">
                <span className="text-navy-700 font-semibold">Policy Identification</span>
                <span className="font-mono font-bold text-navy-950 bg-cream-50 border border-cream-300 px-2 py-0.5 rounded">
                  {purchasedPolicy.policyNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-navy-700">Insurance Plan:</span>
                <span className="font-bold text-navy-950">{policy.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-navy-700">Coverage Sanctioned:</span>
                <span className="font-display font-black text-navy-950 text-sm">
                  ₹{purchasedPolicy.remainingCoverage.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-navy-700">Premium Debited:</span>
                <span className="font-display font-black text-navy-900 text-sm">
                  ₹{purchasedPolicy.premiumPaid.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-navy-700">Beneficiary Nominee:</span>
                <span className="font-semibold text-navy-950">
                  {purchasedPolicy.nominee?.name} ({purchasedPolicy.nominee?.relation})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-navy-700">Effective Date:</span>
                <span className="font-mono text-navy-800">
                  {new Date(purchasedPolicy.startDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  onClose();
                  navigate('/dashboard');
                }}
                className="w-full py-2.5 px-4 rounded-md bg-navy-950 hover:bg-navy-850 text-cream-50 font-display font-bold text-xs flex items-center justify-center space-x-2 shadow-sm transition-colors"
              >
                <span>Go to Customer Portfolio</span>
                <ArrowRight className="w-3.5 h-3.5 text-cream-200" />
              </button>
            </div>
          </div>
        ) : (
          /* Customization & Purchase Screen */
          <form onSubmit={handleConfirmPurchase}>
            <div className="flex justify-between items-center pb-3 border-b border-cream-200 mb-5">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-navy-700 block">
                  Simulated Underwriting & Purchase
                </span>
                <h2 className="font-display text-lg font-black text-navy-950 mt-0.5">
                  Customize Policy Parameters
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

            {/* Policy Title Banner */}
            <div className="bg-cream-100 border border-cream-300 rounded-lg p-3.5 mb-5">
              <span className="font-mono text-[10px] font-bold text-navy-600 uppercase tracking-wider block">
                Selected Product
              </span>
              <p className="font-display text-base font-bold text-navy-950 mt-0.5">{policy.title}</p>
              <span className="text-xs text-navy-700 font-mono mt-0.5 block">
                {policy.category} Sector • {policy.durationInMonths} Months Term
              </span>
            </div>

            {/* Coverage Multiplier Slider */}
            <div className="mb-6 bg-cream-100/70 border border-cream-300 rounded-lg p-4">
              <div className="flex justify-between items-baseline mb-2">
                <label className="font-display text-xs font-bold text-navy-950">
                  Coverage Sum Assured Multiplier
                </label>
                <span className="font-mono text-xs font-extrabold text-navy-950 bg-cream-50 border border-cream-300 px-2 py-0.5 rounded">
                  {multiplier}x Coverage Level
                </span>
              </div>

              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={multiplier}
                onChange={(e) => setMultiplier(Number(e.target.value))}
                className="w-full accent-navy-950 cursor-pointer h-2 bg-cream-300 rounded-lg"
              />

              <div className="flex justify-between text-[10px] font-mono text-navy-600 mt-1.5 px-0.5">
                <span>1x (Base)</span>
                <span>2x</span>
                <span>3x</span>
                <span>4x</span>
                <span>5x (Max)</span>
              </div>

              {/* Dynamic Calculation Output */}
              <div className="grid grid-cols-2 gap-3 pt-3 mt-3 border-t border-cream-300">
                <div>
                  <span className="text-[10px] font-bold text-navy-600 uppercase tracking-wider block font-mono">
                    Total Coverage
                  </span>
                  <span className="font-display text-base font-black text-navy-950 tracking-tight block mt-0.5">
                    ₹{calculatedCoverage.toLocaleString()}
                  </span>
                </div>
                <div className="border-l border-cream-300 pl-3">
                  <span className="text-[10px] font-bold text-navy-600 uppercase tracking-wider block font-mono">
                    Adjusted Premium
                  </span>
                  <span className="font-display text-base font-black text-navy-900 tracking-tight block mt-0.5">
                    ₹{calculatedPremium.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Nominee Details Form */}
            <div className="space-y-3.5 mb-6">
              <div>
                <label className="block font-display text-xs font-bold text-navy-950 mb-1">
                  Beneficiary Nominee Full Legal Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={nomineeName}
                  onChange={(e) => setNomineeName(e.target.value)}
                  className="w-full bg-cream-100 border border-cream-300 rounded-md px-3 py-2 text-xs font-medium text-navy-950 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-950"
                />
              </div>

              <div>
                <label className="block font-display text-xs font-bold text-navy-950 mb-1">
                  Nominee Relationship to Policyholder *
                </label>
                <select
                  value={nomineeRelation}
                  onChange={(e) => setNomineeRelation(e.target.value)}
                  className="w-full bg-cream-100 border border-cream-300 rounded-md px-3 py-2 text-xs font-medium text-navy-950 focus:outline-none focus:ring-2 focus:ring-navy-950"
                >
                  <option value="Spouse">Spouse</option>
                  <option value="Child">Child</option>
                  <option value="Parent">Parent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Other">Other Legal Dependent</option>
                </select>
              </div>
            </div>

            {/* Footer Buttons */}
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
                disabled={submitting}
                className="w-2/3 py-2.5 px-4 rounded-md bg-navy-950 hover:bg-navy-850 active:scale-98 text-cream-50 font-display font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4 text-cream-200" />
                <span>{submitting ? 'Processing Debit...' : `Authorize & Pay ₹${calculatedPremium.toLocaleString()}`}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PurchaseModal;
