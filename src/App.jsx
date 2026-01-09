import React, { useState } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import { useCurrencyRates } from './hooks/useCurrencyRates';
import CurrencyInput from './components/CurrencyInput';
import SwapButton from './components/SwapButton';
import ResultDisplay from './components/ResultDisplay';
import CurrencyChart from './components/CurrencyChart';
import MetalRates from './components/MetalRates';
import { WifiOff, Command, Coins } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

function App() {
    const [view, setView] = useState('converter'); // 'converter', 'gold', 'silver'
    const [amount, setAmount] = useState(1);
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('INR');
    const { rates, isLoading, error, lastUpdated, isOffline } = useCurrencyRates(fromCurrency);

    const currencyOptions = Object.keys(rates);
    const exchangeRate = rates[toCurrency] || 0;
    const convertedAmount = amount * exchangeRate;

    const handleSwap = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
    };

    return (
    return (
        <ErrorBoundary>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{ width: '100%', maxWidth: '440px', display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
                {/* ... existing content ... */}
                {/* Offline Banner */}
                {isOffline && (
                    <motion.div variants={itemVariants} style={{
                        backgroundColor: '#450a0a',
                        color: '#fca5a5',
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.875rem',
                        border: '1px solid #7f1d1d'
                    }}>
                        <WifiOff size={14} />
                        <span>Offline Mode</span>
                    </motion.div>
                )}

                {/* Header */}
                <motion.div variants={itemVariants} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '6px',
                            background: 'linear-gradient(135deg, #fff 0%, #a1a1aa 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Command size={14} color="#000" />
                        </div>
                        <h1 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--color-text-main)' }}>Currency</h1>
                        <span style={{ fontSize: '1rem', color: 'var(--color-border)' }}>/</span>
                        <span style={{ fontSize: '1rem', color: 'var(--color-text-muted)' }}>Converter</span>
                    </div>
                </motion.div>

                <AnimatePresence mode="wait">
                    {view === 'converter' ? (
                        <motion.div
                            key="converter"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                        >
                            {isLoading && Object.keys(rates).length === 0 ? (
                                <div className="bento-card flex-center" style={{ height: '300px' }}>
                                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Loading env...</span>
                                </div>
                            ) : error && Object.keys(rates).length === 0 ? (
                                <div className="bento-card" style={{ color: 'red' }}>Error: {error}</div>
                            ) : (
                                <>
                                    {/* Input Group */}
                                    <motion.div variants={itemVariants} style={{ display: 'flex', flexDirection: 'column' }}>
                                        <CurrencyInput
                                            label="From"
                                            amount={amount}
                                            currency={fromCurrency}
                                            onAmountChange={setAmount}
                                            onCurrencyChange={setFromCurrency}
                                            currencyOptions={currencyOptions}
                                        />

                                        <SwapButton onSwap={handleSwap} />

                                        <CurrencyInput
                                            label="To"
                                            amount={convertedAmount.toFixed(2)}
                                            currency={toCurrency}
                                            onCurrencyChange={setToCurrency}
                                            currencyOptions={currencyOptions}
                                            readOnly={true}
                                        />
                                    </motion.div>

                                    <ResultDisplay
                                        amount={amount}
                                        fromCurrency={fromCurrency}
                                        toCurrency={toCurrency}
                                        convertedAmount={convertedAmount}
                                        rate={exchangeRate}
                                    />

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                        <motion.button
                                            variants={itemVariants}
                                            onClick={() => setView('gold')}
                                            className="btn-linear"
                                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Coins size={16} />
                                            Gold Rate
                                        </motion.button>
                                        <motion.button
                                            variants={itemVariants}
                                            onClick={() => setView('silver')}
                                            className="btn-linear"
                                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Coins size={16} />
                                            Silver Rate
                                        </motion.button>
                                    </div>

                                    <CurrencyChart
                                        base={fromCurrency}
                                        target={toCurrency}
                                        rate={exchangeRate}
                                    />
                                </>
                            )}
                        </motion.div>
                    ) : view === 'gold' ? (
                        <MetalRates key="gold" base="XAU" title="Gold" onBack={() => setView('converter')} />
                    ) : (
                        <MetalRates key="silver" base="XAG" title="Silver" onBack={() => setView('converter')} />
                    )}
                </AnimatePresence>

                <motion.div variants={itemVariants} style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                    Last updated: {lastUpdated}
                </motion.div>

            </motion.div>
        </ErrorBoundary>
    );
}

export default App;
