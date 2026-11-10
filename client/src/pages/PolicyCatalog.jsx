import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import PolicyCard from '../components/PolicyCard';
import PurchaseModal from '../components/PurchaseModal';
import { Search, SlidersHorizontal, Shield, AlertCircle } from 'lucide-react';

const categoryTabs = [
  { id: 'All', label: 'All Categories' },
  { id: 'Health', label: 'Health' },
  { id: 'Auto', label: 'Auto' },
  { id: 'Life', label: 'Life' },
  { id: 'Home', label: 'Home' },
];

const PolicyCatalog = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPolicyForPurchase, setSelectedPolicyForPurchase] = useState(null);

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/api/policies');
      setPolicies(data);
    } catch (err) {
      setError('Unable to load insurance policies from API. Please verify server connection.');
    } finally {
      setLoading(false);
    }
  };

  const filteredPolicies = policies.filter((policy) => {
    const matchesCategory = selectedCategory === 'All' || policy.category === selectedCategory;
    const matchesSearch =
      policy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-cream-100 min-h-screen py-10 sm:py-12 text-navy-950 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header with Tabular Baseline */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 mb-8 border-b border-cream-300 gap-4">
          <div>
            <span className="font-mono text-xs font-bold text-navy-700 uppercase tracking-wider block">
              Active Inventory
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-navy-950 mt-1 tracking-tight">
              Insurance Policy Catalog
            </h1>
            <p className="text-xs sm:text-sm text-navy-700 mt-1 max-w-xl">
              Choose a policy below to launch the coverage multiplier calculator, customize term protection, and issue a digital policy.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 text-navy-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search policies by keyword..."
              className="w-full bg-cream-50 border border-cream-300 rounded-md pl-9 pr-8 py-2 text-xs font-medium text-navy-950 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-950 shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-xs text-navy-500 hover:text-navy-950 font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills (Navy & Cream) */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-cream-300">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center space-x-1.5 mr-2 text-xs font-bold text-navy-800">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Category:</span>
            </div>
            {categoryTabs.map((tab) => {
              const count =
                tab.id === 'All'
                  ? policies.length
                  : policies.filter((p) => p.category === tab.id).length;

              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3.5 py-1.5 rounded-md text-xs font-display font-bold transition-all flex items-center space-x-1.5 border ${
                    selectedCategory === tab.id
                      ? 'bg-navy-950 text-cream-50 border-navy-950 shadow-sm'
                      : 'bg-cream-200 text-navy-800 border-cream-300 hover:bg-cream-300'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.2 rounded font-bold ${
                      selectedCategory === tab.id
                        ? 'bg-navy-800 text-cream-100'
                        : 'bg-cream-300 text-navy-900'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="font-mono text-xs text-navy-600 bg-cream-200 px-2.5 py-1 rounded border border-cream-300">
            SHOWING {filteredPolicies.length} OF {policies.length} POLICIES
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-3 border-navy-950 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="font-display text-sm font-bold text-navy-900">Loading catalog policies...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-lg flex items-center space-x-3 text-xs mb-8">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-bold">{error}</p>
              <button
                onClick={fetchPolicies}
                className="underline mt-1 font-semibold text-rose-900"
              >
                Retry connection
              </button>
            </div>
          </div>
        )}

        {/* Policies Grid */}
        {!loading && !error && filteredPolicies.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPolicies.map((policy) => (
              <PolicyCard
                key={policy._id}
                policy={policy}
                onBuy={(pol) => setSelectedPolicyForPurchase(pol)}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredPolicies.length === 0 && (
          <div className="bg-cream-50 border border-cream-300 rounded-lg p-12 text-center max-w-md mx-auto">
            <Shield className="w-10 h-10 text-navy-400 mx-auto mb-3" />
            <h3 className="font-display text-lg font-bold text-navy-950">No Matching Policies</h3>
            <p className="text-xs text-navy-600 mt-1 mb-4 leading-relaxed">
              No policies match your search query or filter selection. Try adjusting your filter parameters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-md bg-navy-950 text-cream-50 text-xs font-display font-bold hover:bg-navy-850 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Purchase Policy Modal */}
        {selectedPolicyForPurchase && (
          <PurchaseModal
            policy={selectedPolicyForPurchase}
            onClose={() => setSelectedPolicyForPurchase(null)}
            onSuccess={() => {
              // Successfully purchased
            }}
          />
        )}

      </div>
    </div>
  );
};

export default PolicyCatalog;
