import { useState, useEffect } from 'react';

const API_URL = 'https://open.er-api.com/v6/latest/';

export const useCurrencyRates = (baseCurrency) => {
    const [rates, setRates] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    useEffect(() => {
        const fetchRates = async () => {
            setIsLoading(true);
            setError(null);

            const cacheKey = `currency_rates_${baseCurrency}`;
            const cachedData = localStorage.getItem(cacheKey);

            // Optimistically load from cache first
            if (cachedData) {
                const { rates: cachedRates, timestamp } = JSON.parse(cachedData);
                setRates(cachedRates);
                setLastUpdated(new Date(timestamp).toLocaleString());

                // If offline, stop here and use cache
                if (!navigator.onLine) {
                    setIsLoading(false);
                    return;
                }
            }

            try {
                const response = await fetch(`${API_URL}${baseCurrency}`);
                if (!response.ok) throw new Error('Failed to fetch rates');

                const data = await response.json();
                setRates(data.rates);
                const now = new Date();
                setLastUpdated(now.toLocaleString());

                // Update cache
                localStorage.setItem(cacheKey, JSON.stringify({
                    rates: data.rates,
                    timestamp: now.getTime()
                }));

            } catch (err) {
                setError(err.message);
                // Fallback to cache if fetch fails and we haven't already loaded it? 
                // We already loaded cache above, so just keep using it.
                if (!cachedData) {
                    // Real error, no data available
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchRates();
    }, [baseCurrency, isOffline]); // Refetch when coming back online

    return { rates, isLoading, error, lastUpdated, isOffline };
};
