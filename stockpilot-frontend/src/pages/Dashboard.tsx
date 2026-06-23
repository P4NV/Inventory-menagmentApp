import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,} from 'recharts'

const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6']

function StatCard({ label, value, sub, subColor = '#6b7280', accent = '#111827' }: any) {
    // const bgColor = accent === '#10b981' ? 'bg-emerald-100' :
    //                accent === '#f59e0b' ? 'bg-amber-100' :
    //                accent === '#ef4444' ? 'bg-red-100' :
    //                accent === '#6366f1' ? 'bg-indigo-100' : 'bg-gray-100';

    const textColor = accent === '#10b981' ? 'text-emerald-800' :
                     accent === '#f59e0b' ? 'text-amber-800' :
                     accent === '#ef4444' ? 'text-red-800' :
                     accent === '#6366f1' ? 'text-indigo-800' : 'text-gray-800';

    const subTextColor = subColor === '#f59e0b' ? 'text-amber-500' :
                        subColor === '#ef4444' ? 'text-red-500' :
                        subColor === '#10b981' ? 'text-emerald-500' :
                        subColor === '#6366f1' ? 'text-indigo-500' : 'text-gray-500';

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 flex-1">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">{label}</div>
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

    if (loading) return <div className="p-12 text-gray-500 text-center">Loading…</div>
    if (!stats) return <div className="p-12 text-red-500 text-center">Failed to load</div>

    const barData = Object.entries(stats.stockByCategory || {}).map(([name, value]) => ({ name: name.split(' ')[0], value }))
    const pieData = Object.entries(stats.countByCategory || {}).map(([name, value]) => ({ name, value }))
    const totalValue = Number(stats.totalValue || 0)

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome back</h1>
                <p className="text-sm text-gray-500">Here's what's happening across your inventory today.</p>
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
                <div className="col-span-1 bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <div>
                            <div className="font-semibold text-gray-800">Needs attention</div>
                            <div className="text-sm text-gray-500 mt-1">Items below reorder point or out of stock</div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">On Hand</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reorder At</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {(stats.lowStockItems || []).slice(0, 5).map((item: any, i: number) => (
                                    <tr key={i} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-mono text-sm font-medium text-indigo-600">{item.sku}</td>
                                        <td className="px-6 py-4 font-medium text-gray-800">{item.name}</td>
                                        <td className={`px-6 py-4 text-sm font-medium ${item.stockQty === 0 ? 'text-red-600' : 'text-amber-600'}`}>{item.stockQty}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{item.reorderLevel}</td>
                                        <td className="px-6 py-4">
                                            {item.stockQty === 0 ? (
                                                <span className="px-3 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Out of Stock</span>
                                            ) : (
                                                <span className="px-3 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded-full">Low Stock</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {!stats.lowStockItems || stats.lowStockItems.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                            All products are well stocked ✓
                                        </td>
                                    </tr>
                                ) : null}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Charts row - side by side on medium and up */}
                <div className="col-span-1 bg-white rounded-lg border border-gray-200 p-6">
                    <div className="font-semibold text-gray-800 mb-4">Stock by Category</div>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={barData} margin={{ left: -20 }}>
                            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13 }} />
                            <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="col-span-1 bg-white rounded-lg border border-gray-200 p-6">
                    <div className="font-semibold text-gray-800 mb-4">Products by Category</div>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, percent }) => `${String(name ?? '').split(' ')[0]} ${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13 }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}