import { describe, it, expect } from 'vitest';
import { formatCurrency } from './formatCurrency';

describe('formatCurrency', () => {
    it('formats USD correctly', () => {
        expect(formatCurrency(100, 'USD')).toBe('$100.00');
    });

    it('formats INR correctly', () => {
        // Note: Intl format for INR might differ based on locale, but usually 'en-US' + INR = INR 100.00 or similar
        // Let's check what our implementation does: it uses 'en-US' locale with currency 'INR'
        // This usually outputs "INR 100.00" or symbol if supported.
        // We'll verify robustly.
        const result = formatCurrency(100, 'INR');
        expect(result).toMatch(/INR|₹/);
        expect(result).toContain('100.00');
    });

    it('handles zero', () => {
        expect(formatCurrency(0, 'USD')).toBe('$0.00');
    });

    it('handles strings by parsing or formatting', () => {
        // Our util is simple, let's see. 
        // It takes number. If we pass string "100", Intl might handle it or NaN.
        // Our implementation: if(isNaN(amount)) return '0.00';
        expect(formatCurrency('abc', 'USD')).toBe('0.00');
    });
});
