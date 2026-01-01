import React from 'react';
import { History as HistoryIcon, X } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';

const History = ({ history, onClearHistory }) => {
    if (history.length === 0) return null;

    return (
        <div className="bento-card" style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <HistoryIcon size={14} color="var(--color-text-muted)" />
                    Recent
                </h3>
                <button
                    onClick={onClearHistory}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-text-muted)',
                        cursor: 'pointer',
                        padding: '2px',
                        borderRadius: '4px'
                    }}
                    className="hover:bg-zinc-800"
                >
                    <X size={14} />
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--color-border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                {history.map((item, index) => (
                    <div key={index} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.875rem',
                        padding: '0.75rem',
                        backgroundColor: 'var(--color-card)',
                    }}>
                        <span style={{ color: 'var(--color-text-muted)' }}>
                            {formatCurrency(item.amount, item.from)}
                        </span>
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>to</span>
                        <span style={{ fontWeight: '500', color: 'var(--color-text-main)' }}>
                            {formatCurrency(item.result, item.to)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default History;
