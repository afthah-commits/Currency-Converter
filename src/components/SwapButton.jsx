import React from 'react';
import { ArrowUpDown } from 'lucide-react';

const SwapButton = ({ onSwap }) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '-12px 0', position: 'relative', zIndex: 10 }}>
            <button
                onClick={onSwap}
                style={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    color: 'var(--color-text-muted)',
                    transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--color-text-main)';
                    e.currentTarget.style.borderColor = 'var(--color-text-muted)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--color-text-muted)';
                    e.currentTarget.style.borderColor = 'var(--color-border)';
                }}
            >
                <ArrowUpDown size={14} />
            </button>
        </div>
    );
};

export default SwapButton;
