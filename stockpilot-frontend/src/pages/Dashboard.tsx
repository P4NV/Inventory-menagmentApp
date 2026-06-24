import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,} from 'recharts'

const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6']

function StatCard({ label, value, sub, subColor = '#6b7280', accent = '#111827' }: any) {
    const textColor = accent === '#10b981' ? 'text-emerald-800 dark:text-emerald-400' :
                     accent === '#f59e0b' ? 'text-amber-800 dark:text-amber-400' :
                     accent === '#ef4444' ? 'text-red-800 dark:text-red-400' :
                     accent === '#6366f1' ? 'text-indigo-800 dark:text-indigo-400' : 'text-gray-800 dark:text-slate-200';

    const subTextColor = subColor === '#f59e0b' ? 'text-amber-500 dark:text-amber-400' :
                        subColor === '#ef4444' ? 'text-red-500 dark:text-red-400' :
                        subColor === '#10b981' ? 'text-emerald-500 dark:text-emerald-400' :
                        subColor === '#6366f1' ? 'text-indigo-500 dark:text-indigo-400' : 'text-gray-500 dark:text-slate-400';

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 flex-1 transition-colors duration-300">
            <div className="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">{label}</div>
            <div className={`text-2xl font-bold ${textColor} leading-tight`}>{value}</div>
            {sub && <div className={`text-sm ${subTextColor} mt-1`}>{sub}</div>}
        </div>
    )
}

export default function Dashboard() {
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/dashboard/stats')
            .then(r => r.json())
            .then(d => { setStats(d); setLoading(false) })
            .catch(() => setLoading(false))
    }, [])

    if (loading) return <div className="p-12 text-gray-500 dark:text-slate-400 text-center">Loading…</div>
    if (!stats) return <div className="p-12 text-red-500 dark:text-red-400 text-center">Failed to load</div>

    const barData = Object.entries(stats.stockByCategory || {}).map(([name, value]) => ({ name: name.split(' ')[0], value }))
    const pieData = Object.entries(stats.countByCategory || {}).map(([name, value]) => ({ name, value }))
    const totalValue = Number(stats.totalValue || 0)

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-2 transition-colors duration-300">Welcome back</h1>
                <p className="text-sm text-gray-500 dark:text-slate-400 transition-colors duration-300">Here's what's happening across your inventory today.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Total SKUs" value={stats.totalProducts} sub="+0% this month" />
                <StatCard
                    label="Low Stock"
                    value={stats.lowStockCount}
                    sub="Requires action"
                    accent={stats.lowStockCount > 0 ? '#f59e0b' : '#10b981'}
                    subColor={stats.lowStockCount > 0 ? '#f59e0b' : '#10b981'}
                />
                <StatCard
                    label="Out of Stock"
                    value={stats.lowStockItems?.filter((i: any) => i.stockQty === 0).length || 0}
                    sub="Urgent"
                    accent="#ef4444"
                    subColor="#ef4444"
                />
                <StatCard
                    label="Inventory Value"
                    value={`€${(totalValue / 1000).toFixed(1)}k`}
                    sub="Net assets"
                    accent="#6366f1"
                />
            </div>

            {/* Charts + Low Stock */}
            <div className="grid gap-6 mb-8">
                {/* Low stock table - full width on small screens */}
                <div className="col-span-1 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden transition-colors duration-300">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center transition-colors duration-300">
                        <div>
                            <div className="font-semibold text-gray-800 dark:text-slate-100 transition-colors duration-300">Needs attention</div>
                            <div className="text-sm text-gray-500 dark:text-slate-400 mt-1 transition-colors duration-300">Items below reorder point or out of stock</div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700 text-sm transition-colors duration-300">
                            <thead className="bg-gray-50 dark:bg-slate-900/50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">{/* SKU */}</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">{/* Product */}</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">{/* On Hand */}</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">{/* Reorder At */}</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">{/* Status */}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-slate-700 bg-white dark:bg-slate-800 transition-colors duration-300">
                                {(stats.lowStockItems || []).slice(0, 5).map((item: any, i: number) => (
                                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors duration-200">
                                        <td className="px-6 py-4 font-mono text-sm font-medium text-indigo-600 dark:text-indigo-400">{item.sku}</td>
                                        <td className="px-6 py-4 font-medium text-gray-800 dark:text-slate-200">{item.name}</td>
                                        <td className={`px-6 py-4 text-sm font-medium ${item.stockQty === 0 ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}`}>{item.stockQty}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-slate-400">{item.reorderLevel}</td>
                                        <td className="px-6 py-4">
                                            {item.stockQty === 0 ? (
                                                <span className="px-3 py-1 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full">{/* Out of Stock */}</span>
                                            ) : (
                                                <span className="px-3 py-1 text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-full">{/* Low Stock */}</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {!stats.lowStockItems || stats.lowStockItems.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-slate-400">
                                            All products are well stocked ✓
                                        </td>
                                    </tr>
                                ) : null}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Charts row - side by side on medium and up */}
                <div className="col-span-1 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 transition-colors duration-300">
                    <div className="font-semibold text-gray-800 dark:text-slate-100 mb-4 transition-colors duration-300">Stock by Category</div>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={barData} margin={{ left: -20 }}>
                            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13, backgroundColor: '#fff', color: '#0f172a' }} />
                            <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="col-span-1 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 transition-colors duration-300">
                    <div className="font-semibold text-gray-800 dark:text-slate-100 mb-4 transition-colors duration-300">Products by Category</div>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, percent }) => `${String(name ?? '').split(' ')[0]} ${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13, backgroundColor: '#fff', color: '#0f172a' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}
