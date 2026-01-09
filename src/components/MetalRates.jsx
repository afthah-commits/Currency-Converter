import React, { useState } from 'react';
import { useCurrencyRates } from '../hooks/useCurrencyRates';
import { currencyNames } from '../utils/currencyData';
import { formatCurrency } from '../utils/formatCurrency';
import { Search, ArrowLeft, Coins } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MetalRates = ({ base, title, onBack }) => {
    // Always fetch USD rates as base since free API doesn't support XAU/XAG base
    const { rates: usdRates, isLoading, error, lastUpdated } = useCurrencyRates('USD');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCurrency, setSelectedCurrency] = useState(null);

    // Default to 'INR' or 'USD' if available for initial quick view?
    // User requested "Search suggestions", so list view first is better.

    // Calculate rates relative to the metal (base)
    // Rate(Metal -> Currency) = Rate(USD -> Currency) / Rate(USD -> Metal)

    // Fallback if API doesn't have XAU/XAG (Open Exchange Rates free tier might not)
    // Mock rates for fallback: 1 XAU ~ 2600 USD, 1 XAG ~ 31 USD (approximate)
    // USD -> XAU = 1/2600 = 0.00038
    // USD -> XAG = 1/31 = 0.032
    const fallbackRates = {
        'XAU': 0.00038,
        'XAG': 0.032
    };

    const metalRateInUSD = usdRates[base] || fallbackRates[base];

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

    const OUNCE_TO_GRAM = 31.1035;

    const handleBack = () => {
        if (selectedCurrency) {
            setSelectedCurrency(null);
        } else {
            onBack();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{ width: '100%', display: 'flex', flexDirection: 'column' }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <button
                    onClick={handleBack}
                    className="btn-icon"
                >
                    <ArrowLeft size={20} />
                </button>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', flex: 1 }}>
                    {selectedCurrency ? `${title} in ${selectedCurrency}` : `${title} Rates`}
                </h2>
            </div>

            <AnimatePresence mode="wait">
                {selectedCurrency ? (
                    <motion.div
                        key="detail"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bento-card"
                        style={{ padding: '2rem 1rem', textAlign: 'center', flex: 1 }}
                    >
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #fff 0%, #a1a1aa 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 1.5rem auto',
                            boxShadow: '0 4px 12px rgba(255,255,255,0.1)'
                        }}>
                            <Coins size={24} color="#000" />
                        </div>

                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
                            1 Gram
                        </p>
                        <div style={{
                            fontSize: '2.5rem',
                            fontWeight: '700',
                            background: 'linear-gradient(180deg, #fff, #a1a1aa)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent', // Note: browser support checks might be needed, but usually safe in modern web
                            color: '#fff', // fallback
                            marginBottom: '1.5rem'
                        }}>
                            {formatCurrency(rates[selectedCurrency] / OUNCE_TO_GRAM, selectedCurrency)}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                            <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>8 Grams (1 Pavan)</p>
                                <p style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                                    {formatCurrency((rates[selectedCurrency] / OUNCE_TO_GRAM) * 8, selectedCurrency)}
                                </p>
                            </div>
                            <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>1 Ounce</p>
                                <p style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                                    {formatCurrency(rates[selectedCurrency], selectedCurrency)}
                                </p>
                            </div>
                        </div>

                        <div style={{ marginTop: '2rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                            1 Ounce = 31.1035 Grams
                        </div>

                    </motion.div>
                ) : (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ display: 'flex', flexDirection: 'column' }}
                    >
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
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {filteredRates.length > 0 ? (
                                    filteredRates.map(([currency, rate]) => (
                                        <motion.div
                                            key={currency}
                                            className="bento-card"
                                            onClick={() => setSelectedCurrency(currency)}
                                            whileTap={{ scale: 0.98 }}
                                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', cursor: 'pointer' }}
                                        >
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontWeight: '600', fontSize: '1rem' }}>{currency}</span>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                                                    {currencyNames[currency] || currency}
                                                </span>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <span style={{ fontWeight: '600', display: 'block' }}>{formatCurrency(rate, currency)}</span>
                                                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>per oz</span>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--color-text-muted)' }}>
                                        No results found.
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <div style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                Last updated: {lastUpdated}
            </div>
        </motion.div>
    );
};

export default MetalRates;
