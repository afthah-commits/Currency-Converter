import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { currencyNames } from '../utils/currencyData';
import { ChevronDown, Search, Check, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFavorites } from '../hooks/useFavorites';

const CurrencySelect = ({ value, onChange, options }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRef = useRef(null);
    const listRef = useRef(null);
    const { favorites, toggleFavorite, isFavorite } = useFavorites();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
            setSearch('');
            setActiveIndex(0);
        }
    }, [isOpen]);

    const sortedOptions = useMemo(() => {
        const query = search.toLowerCase();

        const matches = options.filter(code => {
            const name = currencyNames[code] || '';
            return code.toLowerCase().includes(query) || name.toLowerCase().includes(query);
        });

        if (!search) {
            return matches.sort((a, b) => {
                const favA = isFavorite(a);
                const favB = isFavorite(b);
                if (favA && !favB) return -1;
                if (!favA && favB) return 1;
                return a.localeCompare(b);
            });
        }

        return matches;
    }, [options, search, favorites]);

    // Handle auto-scroll
    useEffect(() => {
        if (isOpen && listRef.current) {
            const activeElement = listRef.current.children[activeIndex];
            if (activeElement) {
                activeElement.scrollIntoView({ block: 'nearest' });
            }
        }
    }, [activeIndex, isOpen]);

    const handleKeyDown = (e) => {
        if (!isOpen) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex(prev => (prev + 1) % sortedOptions.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex(prev => (prev - 1 + sortedOptions.length) % sortedOptions.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (sortedOptions[activeIndex]) {
                onChange(sortedOptions[activeIndex]);
                setIsOpen(false);
            }
        } else if (e.key === 'Escape') {
            e.preventDefault();
            setIsOpen(false);
        }
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                style={{
                    appearance: 'none',
                    fontSize: '1rem',
                    fontWeight: '500',
                    padding: '0.5rem 2.25rem 0.5rem 1rem',
                    cursor: 'pointer',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    minWidth: '120px',
                    position: 'relative',
                }}
                className="hover:bg-zinc-800"
            >
                <span>{value}</span>
                <ChevronDown
                    size={14}
                    style={{
                        position: 'absolute',
                        right: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--color-text-muted)'
                    }}
                />
            </button>

            {createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <div style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 9999,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '1rem'
                        }}>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsOpen(false)}
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    backgroundColor: 'rgba(0,0,0,0.8)',
                                    backdropFilter: 'blur(4px)'
                                }}
                            />

                            <motion.div
                                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                                transition={{ type: "spring", duration: 0.3 }}
                                style={{
                                    width: '100%',
                                    maxWidth: '500px',
                                    maxHeight: '80vh',
                                    backgroundColor: '#18181b',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-lg)',
                                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                                    position: 'relative',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    overflow: 'hidden'
                                }}
                            >
                                <div style={{
                                    padding: '1.5rem',
                                    borderBottom: '1px solid var(--color-border)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem'
                                }}>
                                    <Search size={20} color="var(--color-text-muted)" />
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        placeholder="Type to search..."
                                        value={search}
                                        onChange={(e) => {
                                            setSearch(e.target.value);
                                            setActiveIndex(0);
                                        }}
                                        onKeyDown={handleKeyDown}
                                        style={{
                                            border: 'none',
                                            background: 'transparent',
                                            color: 'white',
                                            fontSize: '1.25rem',
                                            outline: 'none',
                                            width: '100%',
                                            fontWeight: '500'
                                        }}
                                    />
                                    <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                                        ESC
                                    </button>
                                </div>

                                <div ref={listRef} style={{ overflowY: 'auto', padding: '0.5rem' }}>
                                    {sortedOptions.length > 0 ? (
                                        sortedOptions.map((code, index) => {
                                            const name = currencyNames[code] || '';
                                            const isSelected = code === value;
                                            const isActive = index === activeIndex;
                                            const fav = isFavorite(code);

                                            const showDivider = !search && index > 0 &&
                                                isFavorite(sortedOptions[index - 1]) && !fav;

                                            return (
                                                <React.Fragment key={code}>
                                                    {showDivider && (
                                                        <div style={{
                                                            fontSize: '0.75rem',
                                                            color: 'var(--color-text-muted)',
                                                            padding: '0.5rem 1rem',
                                                            marginTop: '0.5rem',
                                                            borderTop: '1px solid var(--color-border)'
                                                        }} />
                                                    )}

                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            width: '100%',
                                                            padding: '0.5rem',
                                                            borderRadius: 'var(--radius-sm)',
                                                            // Combine Active (Keyboard) and Selected (Current) styles
                                                            background: isActive ? 'rgba(255,255,255,0.08)' : (isSelected ? 'rgba(59, 130, 246, 0.1)' : 'transparent'),
                                                            borderLeft: isSelected ? '2px solid #3b82f6' : '2px solid transparent',
                                                            marginBottom: '2px',
                                                            transition: 'background 0.1s'
                                                        }}
                                                        onMouseEnter={() => setActiveIndex(index)}
                                                    >
                                                        <button
                                                            onClick={() => {
                                                                onChange(code);
                                                                setIsOpen(false);
                                                            }}
                                                            style={{
                                                                flex: 1,
                                                                background: 'none',
                                                                border: 'none',
                                                                textAlign: 'left',
                                                                cursor: 'pointer',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'space-between'
                                                            }}
                                                        >
                                                            <div>
                                                                <div style={{ color: 'white', fontSize: '1rem', fontWeight: '600' }}>{code}</div>
                                                                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{name}</div>
                                                            </div>
                                                        </button>

                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleFavorite(code);
                                                            }}
                                                            style={{
                                                                background: 'none',
                                                                border: 'none',
                                                                cursor: 'pointer',
                                                                padding: '0.5rem',
                                                                color: fav ? '#eab308' : 'var(--color-text-muted)'
                                                            }}
                                                        >
                                                            <Star size={18} fill={fav ? "#eab308" : "none"} />
                                                        </button>
                                                    </div>
                                                </React.Fragment>
                                            );
                                        })
                                    ) : (
                                        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                            No results
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
};

export default CurrencySelect;
