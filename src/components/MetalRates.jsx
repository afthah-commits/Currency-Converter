import React, { useState } from 'react';
import { useCurrencyRates } from '../hooks/useCurrencyRates';
import { currencyNames } from '../utils/currencyData';
import { Search, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const MetalRates = ({ base, title, onBack }) => {
    // Always fetch USD rates as base since free API doesn't support XAU/XAG base
    const { rates: usdRates, isLoading, error, lastUpdated } = useCurrencyRates('USD');
    const [searchTerm, setSearchTerm] = useState('');

    // Calculate rates relative to the metal (base)
    // Rate(Metal -> Currency) = Rate(USD -> Currency) / Rate(USD -> Metal)
    const metalRateInUSD = usdRates[base]; // This is how much Metal 1 USD buys (e.g. 0.0005 XAU)

    // We want: 1 Unit of Metal = ??? Currency
    // So we need: Price of 1 Metal in USD = 1 / metalRateInUSD
    // Then convert that USD amount to target currency.
    // Equivalent to: targetCurrencyRate / metalRateInUSD

    const rates = {};
    if (metalRateInUSD) {
        Object.entries(usdRates).forEach(([currency, rate]) => {
            if (currency !== base) {
                rates[currency] = rate / metalRateInUSD;
            }
        });
    }

    const filteredRates = Object.entries(rates).filter(([currency]) => {
        const name = currencyNames[currency] || '';
        const searchLower = searchTerm.toLowerCase();
        return currency.toLowerCase().includes(searchLower) || name.toLowerCase().includes(searchLower);
    });

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{ width: '100%' }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <button onClick={onBack} className="btn-icon">
                    <ArrowLeft size={20} />
                </button>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', flex: 1 }}>{title} Rates</h2>
            </div>

            <div style={{ marginBottom: '1rem', position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                    type="text"
                    placeholder="Search region or currency..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '0.75rem 1rem 0.75rem 2.5rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-bg-card)',
                        color: 'var(--color-text-main)'
                    }}
                />
            </div>

            {isLoading ? (
                <div className="bento-card flex-center" style={{ height: '200px' }}>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Loading rates...</span>
                </div>
            ) : error ? (
                <div className="bento-card" style={{ color: 'red' }}>Error: {error}</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '400px', overflowY: 'auto' }}>
                    {filteredRates.length > 0 ? (
                        filteredRates.map(([currency, rate]) => (
                            <div key={currency} className="bento-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontWeight: '600' }}>{currency}</span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                                        {currencyNames[currency] || currency}
                                    </span>
                                </div>
                                <span style={{ fontWeight: '500' }}>{rate.toFixed(4)}</span>
                            </div>
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--color-text-muted)' }}>
                            No results found.
                        </div>
                    )}
                </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                Last updated: {lastUpdated}
            </div>
        </motion.div>
    );
};

export default MetalRates;
