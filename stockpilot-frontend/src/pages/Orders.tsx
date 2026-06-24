import { useEffect, useState } from 'react'

interface Order {
    id: number
    orderNumber: string
    supplier: string
    status: string
    total: number
    itemCount: number
    expectedDate: string | null
}

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
    'Draft':      { bg: 'gray-100 dark:bg-gray-800', color: 'gray-500 dark:text-gray-400' },
    'Open':       { bg: 'blue-100 dark:bg-blue-900/30', color: 'blue-800 dark:text-blue-300' },
    'In Transit': { bg: 'amber-100 dark:bg-amber-900/30', color: 'amber-800 dark:text-amber-300' },
    'Received':   { bg: 'emerald-100 dark:bg-emerald-900/30', color: 'emerald-800 dark:text-emerald-300' },
}

export default function Orders() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/orders')
            .then(r => r.json())
            .then(d => { setOrders(d); setLoading(false) })
            .catch(() => setLoading(false))
    }, [])

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-6 transition-colors duration-300">Orders</h1>
            
            {loading ? (
                <div className="text-center py-12 text-gray-500 dark:text-slate-400">Loading…</div>
            ) : orders.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-12 text-center transition-colors duration-300">
                    <p className="text-gray-500 dark:text-slate-400 font-medium">No orders found</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden shadow-sm transition-colors duration-300">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700 transition-colors duration-300">
                            <thead className="bg-gray-50 dark:bg-slate-900/50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Order #</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Supplier</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Total</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Items</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Expected</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-slate-700 bg-white dark:bg-slate-800 transition-colors duration-300">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors duration-200">
                                        <td className="px-6 py-4 font-mono text-sm font-medium text-indigo-600 dark:text-indigo-400">{order.orderNumber}</td>
                                        <td className="px-6 py-4 text-sm text-gray-800 dark:text-slate-200">{order.supplier}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${STATUS_STYLE[order.status]?.bg || 'bg-gray-100'} ${STATUS_STYLE[order.status]?.color || 'text-gray-800'}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-slate-200">€{order.total.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-slate-400">{order.itemCount}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-slate-400">{order.expectedDate ? new Date(order.expectedDate).toLocaleDateString() : '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}
