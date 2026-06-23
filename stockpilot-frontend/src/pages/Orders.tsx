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
    'Draft':      { bg: 'gray-100', color: 'gray-500' },
    'Open':       { bg: 'blue-100', color: 'blue-800' },
    'In Transit': { bg: 'amber-100', color: 'amber-800' },
    'Received':   { bg: 'emerald-100', color: 'emerald-800' },
    'Cancelled':  { bg: 'red-100', color: 'red-800' },
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

    const pending = orders.filter(o => ['Open', 'In Transit'].includes(o.status))
    const pendingTotal = pending.reduce((s, o) => s + Number(o.total), 0)

    return (
        <div className="p-8">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Purchase orders</h1>
                    <p className="text-sm text-gray-500">
                        {orders.length} orders • €{pendingTotal.toLocaleString()} pending
                    </p>
                </div>
                <button className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                    + New purchase order
                </button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PO #</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {loading ? (
                                <tr className="hover:bg-gray-50">
                                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">Loading…</td>
                                </tr>
                            ) : orders.map((o, i) => {
                                const statusConfig = STATUS_STYLE[o.status] || STATUS_STYLE['Draft']
                                return (
                                    <tr
                                        key={o.id}
                                        className={`hover:bg-gray-50 ${i % 2 === 1 ? 'bg-gray-50' : 'bg-white'}`}
                                    >
                                        <td className="px-6 py-4 font-mono text-sm font-medium text-indigo-600">{o.orderNumber}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-800">{o.supplier}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{o.itemCount}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-800">€{Number(o.total).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{o.expectedDate ?? '—'}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span
                                                className={`px-3 py-1 text-xs font-medium ${statusConfig.bg} ${statusConfig.color} rounded-full`}
                                            >
                                                {o.status}
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}