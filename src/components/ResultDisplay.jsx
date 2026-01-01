import React, { useEffect, useState } from 'react';
import { formatCurrency } from '../utils/formatCurrency';
import { motion, AnimatePresence } from 'framer-motion';

const ResultDisplay = ({ amount, fromCurrency, toCurrency, convertedAmount, rate }) => {
    if (!amount || isNaN(amount)) return null;

    return (
        <motion.div
            className="bento-card"
            style={{ marginTop: '1rem', textAlign: 'center', padding: '2rem 1rem' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                Current Exchange
            </p>

            <div style={{
                fontSize: '3rem',
                fontWeight: '700',
                background: 'linear-gradient(180deg, #fff, #a1a1aa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '0.5rem'
            }}>
                {/* Simple fade key change animation for the number */}
                <AnimatePresence mode="wait">
                    <motion.span
                        key={convertedAmount}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1, position: 'absolute' }}
                        transition={{ duration: 0.2 }}
                    >
                        {formatCurrency(convertedAmount, toCurrency)}
                    </motion.span>
                </AnimatePresence>
            </div>

            <div style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-muted)',
                border: '1px solid var(--color-border)',
                display: 'inline-block',
                padding: '0.25rem 0.75rem',
                borderRadius: '999px'
            }}>
                1 {fromCurrency} = {rate} {toCurrency}
            </div>
        </motion.div>
    );
};

export default ResultDisplay;
