import { useState, useEffect } from 'react';

export const useFavorites = () => {
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('currency_favorites');
        return saved ? JSON.parse(saved) : ['USD', 'INR', 'EUR', 'GBP']; // Defaults
    });

    useEffect(() => {
        localStorage.setItem('currency_favorites', JSON.stringify(favorites));
    }, [favorites]);

    const toggleFavorite = (code) => {
        setFavorites(prev => {
            if (prev.includes(code)) {
                return prev.filter(c => c !== code);
            } else {
                return [...prev, code];
            }
        });
    };

    const isFavorite = (code) => favorites.includes(code);

    return { favorites, toggleFavorite, isFavorite };
};
