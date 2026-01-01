import { describe, it, expect, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import App from './App';

// Mock the hook to avoid Real API calls
vi.mock('./hooks/useCurrencyRates', () => ({
    useCurrencyRates: () => ({
        rates: { USD: 1, INR: 83, EUR: 0.92 },
        isLoading: false,
        error: null,
        lastUpdated: 'Just now',
        isOffline: false
    })
}));

// Mock the chart to avoid complex DOM resizing issues in jsdom
vi.mock('./components/CurrencyChart', () => ({
    default: () => <div data-testid="mock-chart">Chart</div>
}));

describe('App Integration', () => {
    it('renders the main title', () => {
        render(<App />);
        expect(screen.getByText(/Currency/i)).toBeInTheDocument();
        expect(screen.getByText(/Converter/i)).toBeInTheDocument();
    });

    it('renders input fields with default values', () => {
        render(<App />);
        // "From" input has 'USD'
        expect(screen.getByDisplayValue('USD')).toBeInTheDocument();
    });

    it('renders the result display', () => {
        render(<App />);
        // 1 USD * 83 = 83.00, formatted usually contains 83.00
        expect(screen.getByText(/83.00/)).toBeInTheDocument();
    });
});
