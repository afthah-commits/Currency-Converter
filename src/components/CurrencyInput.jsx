import React from 'react';
import CurrencySelect from './CurrencySelect';

const CurrencyInput = ({
    label,
    amount,
    currency,
    onAmountChange,
    onCurrencyChange,
    currencyOptions = [],
    readOnly = false,
}) => {
    return (
        <div className="bento-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-muted)',
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
            }}>
                {label}
            </label>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => onAmountChange && onAmountChange(e.target.value)}
                    readOnly={readOnly}
                    placeholder="0.00"
                    style={{
                        fontSize: '1.75rem',
                        fontWeight: '600',
                        width: '100%',
                        color: readOnly ? 'var(--color-text-muted)' : 'var(--color-text-main)'
                    }}
                />

                <div style={{ position: 'relative' }}>
                    <CurrencySelect
                        value={currency}
                        onChange={onCurrencyChange}
                        options={currencyOptions}
                    />
                </div>
            </div>
        </div>
    );
};

export default CurrencyInput;
