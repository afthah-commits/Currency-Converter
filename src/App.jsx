import React, { useState, useEffect } from 'react';
import { useCurrencyRates } from './hooks/useCurrencyRates';
import CurrencyInput from './components/CurrencyInput';
import SwapButton from './components/SwapButton';
import ResultDisplay from './components/ResultDisplay';
import History from './components/History';
import CurrencyChart from './components/CurrencyChart';
import { WifiOff, Command } from 'lucide-react';
import { motion } from 'framer-motion';

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
    const [amount, setAmount] = useState(1);
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('INR');
    const [history, setHistory] = useState(() => {
        const saved = localStorage.getItem('conversion_history');
        return saved ? JSON.parse(saved) : [];
    });

    const { rates, isLoading, error, lastUpdated, isOffline } = useCurrencyRates(fromCurrency);

    const currencyOptions = Object.keys(rates);
    const exchangeRate = rates[toCurrency] || 0;
    const convertedAmount = amount * exchangeRate;

    const handleSwap = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
    };

    const addToHistory = () => {
        const newItem = {
            amount,
            from: fromCurrency,
            to: toCurrency,
            result: convertedAmount,
            date: new Date().toISOString()
        };

        const newHistory = [newItem, ...history].slice(0, 5);
        setHistory(newHistory);
        localStorage.setItem('conversion_history', JSON.stringify(newHistory));
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem('conversion_history');
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ width: '100%', maxWidth: '440px', display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >

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
            <motion.div variants={itemVariants} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 0.5rem' }}>
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
            </motion.div>

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

                    {/* Action */}
                    <motion.button
                        variants={itemVariants}
                        onClick={addToHistory}
                        className="btn-linear"
                        style={{ width: '100%', marginTop: '0.5rem' }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Save to History
                    </motion.button>

                    <ResultDisplay
                        amount={amount}
                        fromCurrency={fromCurrency}
                        toCurrency={toCurrency}
                        convertedAmount={convertedAmount}
                        rate={exchangeRate}
                    />

                    <CurrencyChart
                        base={fromCurrency}
                        target={toCurrency}
                        rate={exchangeRate}
                    />
                </>
            )}

            <motion.div variants={itemVariants}>
                <History history={history} onClearHistory={clearHistory} />
            </motion.div>

            <motion.div variants={itemVariants} style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                Last updated: {lastUpdated}
            </motion.div>

        </motion.div>
    );
}

export default App;
