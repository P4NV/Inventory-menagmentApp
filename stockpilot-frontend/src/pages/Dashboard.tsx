import { useEffect, useState } from 'react'
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts'

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

interface Stats {
    totalProducts: number
    lowStockCount: number
    totalValue: number
    stockByCategory: Record<string, number>
    countByCategory: Record<string, number>
    lowStockItems: { name: string; sku: string; stockQty: number; reorderLevel: number }[]
}

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color: string }) {
    return (
        <div style={{
            background: 'white', borderRadius: 12, padding: '20px 24px',
            border: '1px solid #e5e7eb', flex: 1, minWidth: 160
        }}>
            <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 6 }}>{label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color }}>{value}</div>
            {sub && <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>{sub}</div>}
        </div>
    )
}

export default function Dashboard() {
    const [stats, setStats] = useState<Stats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/dashboard/stats')
            .then(r => r.json())
            .then(data => { setStats(data); setLoading(false) })
            .catch(() => setLoading(false))
    }, [])

    if (loading) return <div style={{ padding: 40, color: '#9ca3af' }}>Loading dashboard…</div>
    if (!stats) return <div style={{ padding: 40, color: '#ef4444' }}>Failed to load dashboard.</div>

    const barData = Object.entries(stats.stockByCategory).map(([name, value]) => ({ name, value }))
    const pieData = Object.entries(stats.countByCategory).map(([name, value]) => ({ name, value }))

    return (
        <div style={{ padding: '32px 40px', fontFamily: 'inherit' }}>
            <h1 style={{ fontSize: 24, fontWeight: 600, margin: '0 0 24px' }}>Dashboard</h1>

            {/* Stat Cards */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
                <StatCard label="Total Products" value={stats.totalProducts} color="#111827" />
                <StatCard
                    label="Low Stock Items"
                    value={stats.lowStockCount}
                    sub="Need reordering"
                    color={stats.lowStockCount > 0 ? '#ef4444' : '#10b981'}
                />
                <StatCard
                    label="Total Inventory Value"
                    value={`€${Number(stats.totalValue).toLocaleString('en-IE', { minimumFractionDigits: 2 })}`}
                    color="#6366f1"
                />
                <StatCard label="Categories" value={Object.keys(stats.countByCategory).length} color="#f59e0b" />
            </div>

            {/* Charts row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>

                {/* Bar chart */}
                <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e5e7eb', padding: '20px 24px' }}>
                    <div style={{ fontWeight: 600, marginBottom: 16 }}>Stock Quantity by Category</div>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie chart */}
                <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e5e7eb', padding: '20px 24px' }}>
                    <div style={{ fontWeight: 600, marginBottom: 16 }}>Products by Category</div>
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                            </Pie>
                            <Legend />
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Low stock table */}
            {stats.lowStockItems.length > 0 && (
                <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                    <div style={{ padding: '16px 24px', borderBottom: '1px solid #f3f4f6', fontWeight: 600, color: '#ef4444' }}>
                        ⚠ Low Stock Alerts ({stats.lowStockItems.length})
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                        <thead>
                        <tr style={{ background: '#f9fafb' }}>
                            {['SKU', 'Product', 'In Stock', 'Reorder At'].map(h => (
                                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 500, color: '#6b7280', fontSize: 13 }}>{h}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {stats.lowStockItems.map((item, i) => (
                            <tr key={i} style={{ borderTop: '1px solid #f3f4f6' }}>
                                <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: 13, color: '#6b7280' }}>{item.sku}</td>
                                <td style={{ padding: '12px 16px', fontWeight: 500 }}>{item.name}</td>
                                <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: '#fee2e2', color: '#991b1b', padding: '2px 10px', borderRadius: 999, fontSize: 12, fontWeight: 500 }}>
                      {item.stockQty}
                    </span>
                                </td>
                                <td style={{ padding: '12px 16px', color: '#9ca3af' }}>{item.reorderLevel}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}