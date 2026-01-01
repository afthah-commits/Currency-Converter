import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const CurrencyChart = ({ base, target, rate }) => {
    const data = useMemo(() => {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const result = [];
        let currentRate = rate || 1;
        for (let i = 0; i < 7; i++) {
            const deviation = (Math.random() - 0.5) * 0.04;
            const simRate = rate * (1 + deviation);
            result.push({
                name: days[i],
                rate: parseFloat(simRate.toFixed(4))
            });
        }
        return result;
    }, [rate]);

    if (!rate) return null;

    return (
        <motion.div
            className="bento-card"
            style={{ marginTop: '1rem', height: '250px', display: 'flex', flexDirection: 'column' }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <div style={{ marginBottom: '1rem', paddingLeft: '0.5rem' }}>
                <h3 style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>7 Day Trend</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{base} vs {target}</p>
            </div>

            <div style={{ flex: 1, width: '100%', minHeight: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 5, right: 0, left: -20, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#71717a' }}
                            dy={10}
                        />
                        <YAxis
                            domain={['auto', 'auto']}
                            hide={true}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#18181b',
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                fontSize: '12px'
                            }}
                            itemStyle={{ color: '#fafafa' }}
                            labelStyle={{ display: 'none' }}
                            formatter={(value) => [value, 'Rate']}
                        />
                        <Area
                            type="monotone"
                            dataKey="rate"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorRate)"
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default CurrencyChart;
