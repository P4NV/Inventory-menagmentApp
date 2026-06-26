import {useEffect, useState} from 'react'

import {BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend} from 'recharts'


const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']


interface LowStockItem {

    id: number

    sku: string

    name: string

    stockQty: number

    reorderLevel: number

}


interface DashboardStats {

    totalProducts: number

    lowStockCount: number

    lowStockItems: LowStockItem[]

    stockByCategory: Record<string, number>

    countByCategory: Record<string, number>

    totalValue: number

}


interface StatCardProps {

    label: string

    value: string | number

    sub?: string

    accent?: string

}


function StatCard({label, value, sub, accent = '#111827'}: StatCardProps) {

    const textColor = accent === '#10b981' ? 'text-emerald-800 dark:text-emerald-400' :

        accent === '#f59e0b' ? 'text-amber-800 dark:text-amber-400' :

            accent === '#ef4444' ? 'text-red-800 dark:text-red-400' :

                accent === '#6366f1' ? 'text-indigo-800 dark:text-indigo-400' : 'text-gray-800 dark:text-slate-200';


    const subTextColor = accent === '#f59e0b' ? 'text-amber-500 dark:text-amber-400' :

        accent === '#ef4444' ? 'text-red-500 dark:text-red-400' :

            accent === '#10b981' ? 'text-emerald-500 dark:text-emerald-400' :

                accent === '#6366f1' ? 'text-indigo-500 dark:text-indigo-400' : 'text-gray-500 dark:text-slate-400';


    return (

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 flex-1
transition-colors duration-300 shadow-sm">

            <div
                className="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">{label}</div>

            <div className={`text-2xl font-bold ${textColor} leading-tight`}>{value}</div>

            {sub && <div className={`text-sm ${subTextColor} mt-1`}>{sub}</div>}

        </div>

    )

}


export default function Dashboard() {

    const [stats, setStats] = useState<DashboardStats | null>(null)

    const [loading, setLoading] = useState(true)

    const [error, setError] = useState<string | null>(null)


    useEffect(() => {

        fetch('/api/dashboard/stats')

            .then(res => {

                if (!res.ok) throw new Error('Failed to fetch dashboard stats')

                return res.json()

            })

            .then(data => setStats(data))

            .catch(err => setError(err.message))

            .finally(() => setLoading(false))

    }, [])


    if (loading) return <div className="p-12 text-center text-gray-500 dark:text-slate-400">Loading dashboard…</div>

    if (error) return <div className="p-12 text-center text-red-500 dark:text-red-400">{error}</div>

    if (!stats) return null


    const barData = Object.entries(stats.stockByCategory || {}).map(([name, value]) => ({
        name: name.split(' ')[0], value
    }))

    const pieData = Object.entries(stats.countByCategory || {}).map(([name, value]) => ({name, value}))

    const totalValue = Number(stats.totalValue || 0)


    return (

        <div className="p-8">

            <div className="mb-8">

                <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-2 transition-colors duration-300">Welcome
                    back</h1>

                <p className="text-sm text-gray-500 dark:text-slate-400 transition-colors duration-300">Here's what's
                    happening
                    across your inventory today.</p>

            </div>


            <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">

                <StatCard label="Total SKUs" value={stats.totalProducts} sub="+0% this month"/>

                <StatCard

                    label="Low Stock"

                    value={stats.lowStockCount}

                    sub="Requires action"

                    accent={stats.lowStockCount > 0 ? '#f59e0b' : '#10b981'}

                />

                <StatCard

                    label="Out of Stock"

                    value={stats.lowStockItems?.filter((i) => i.stockQty === 0).length || 0}

                    sub="Urgent"

                    accent="#ef4444"

                />

                <StatCard

                    label="Inventory Value"

                    value={`€${(totalValue / 1000).toFixed(1)}k`}

                    sub="Net assets"

                    accent="#6366f1"

                />

            </div>


            <div className="mb-8 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700
overflow-hidden shadow-sm transition-colors duration-300">

                <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center
transition-colors duration-300">

                    <div>

                        <div
                            className="font-semibold text-gray-800 dark:text-slate-100 transition-colors duration-300">Needs
                            attention
                        </div>

                        <div
                            className="text-sm text-gray-500 dark:text-slate-400 mt-1 transition-colors duration-300">Items
                            below
                            reorder point or out of stock
                        </div>

                    </div>

                </div>

                <div className="overflow-x-auto">

                    <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700 text-sm transition-colors
duration-300">

                        <thead className="bg-gray-50 dark:bg-slate-900/50">

                        <tr>

                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400
uppercase tracking-wider">SKU
                            </th>

                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400
uppercase tracking-wider">Product
                            </th>

                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400
uppercase tracking-wider">On Hand
                            </th>

                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400
uppercase tracking-wider">Reorder At
                            </th>

                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400
uppercase tracking-wider">Status
                            </th>

                        </tr>

                        </thead>

                        <tbody className="divide-y divide-gray-200 dark:divide-slate-700 bg-white dark:bg-slate-800 transition-colors
duration-300">

                        {(stats.lowStockItems || []).slice(0, 5).map((item) => (

                            <tr key={item.id}
                                className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors duration-200">

                                <td className="px-6 py-4 font-mono text-sm font-medium text-indigo-600
dark:text-indigo-400">{item.sku}</td>

                                <td className="px-6 py-4 font-medium text-gray-800 dark:text-slate-200">{item.name}</td>

                                <td className={`px-6 py-4 text-sm font-medium ${item.stockQty === 0 ? 'text-red-600 dark:text-red-400' :
                                    'text-amber-600 dark:text-amber-400'}`}>{item.stockQty}</td>

                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-slate-400">{item.reorderLevel}</td>

                                <td className="px-6 py-4">

                                    {item.stockQty === 0 ? (

                                        <span className="px-3 py-1 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800
dark:text-red-300 rounded-full">Out of Stock</span>

                                    ) : (

                                        <span className="px-3 py-1 text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800
dark:text-amber-300 rounded-full">Low Stock</span>

                                    )}

                                </td>

                            </tr>

                        ))}

                        {(!stats.lowStockItems || stats.lowStockItems.length === 0) && (

                            <tr>

                                <td colSpan={5}
                                    className="px-6 py-4 text-center text-sm text-gray-500 dark:text-slate-400">

                                    All products are well stocked ✓

                                </td>

                            </tr>

                        )}

                        </tbody>

                    </table>

                </div>

            </div>


            <div className="grid gap-6 lg:grid-cols-2">

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 shadow-sm
transition-colors duration-300">

                    <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-100 mb-4">Stock Levels by
                        Category</h3>

                    <ResponsiveContainer width="100%" height={280}>

                        <BarChart data={barData} margin={{top: 10, right: 10, left: -20, bottom: 0}}>

                            <defs>

                                <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">

                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>

                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.3}/>

                                </linearGradient>

                            </defs>

                            <XAxis dataKey="name" tick={{fontSize: 12, fill: '#9ca3af'}} axisLine={false}
                                   tickLine={false}/>

                            <YAxis tick={{fontSize: 12, fill: '#9ca3af'}} axisLine={false} tickLine={false}/>

                            <Tooltip

                                contentStyle={{
                                    borderRadius: 10, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                    backgroundColor: '#fff', color: '#1f2937'
                                }}

                                itemStyle={{color: '#1f2937'}}

                            />

                            <Bar dataKey="value" fill="url(#colorStock)" radius={[6, 6, 0, 0]} animationDuration={800}/>

                        </BarChart>

                    </ResponsiveContainer>

                </div>


                <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 shadow-sm
transition-colors duration-300">

                    <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-100 mb-4">Inventory
                        Distribution</h3>

                    <ResponsiveContainer width="100%" height={280}>

                        <PieChart>

                            <Pie

                                data={pieData}

                                dataKey="value"

                                nameKey="name"

                                cx="50%"

                                cy="50%"

                                outerRadius={90}

                                innerRadius={45}

                                label={({
                                            name,
                                            percent
                                        }) => `${String(name ?? '').split(' ')[0]} ${(percent * 100).toFixed(0)}%`}

                                labelLine={false}

                            >

                                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none"/>)}

                            </Pie>

                            <Legend

                                verticalAlign="bottom"

                                height={36}

                                iconType="circle"

                                formatter={(value) => <span
                                    className="text-sm text-gray-600 dark:text-slate-400">{value}</span>}

                            />

                            <Tooltip

                                contentStyle={{
                                    borderRadius: 10, border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                    backgroundColor: '#fff', color: '#1f2937'
                                }}

                                formatter={(value: number) => [`${value} items`, 'Count']}

                            />

                        </PieChart>

                    </ResponsiveContainer>

                </div>

            </div>

        </div>

    )

}
