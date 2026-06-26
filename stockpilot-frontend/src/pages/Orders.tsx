import {useEffect, useState} from 'react'


interface Order {

    id: number

    orderNumber: string

    supplier: string

    status: string

    total: number

    itemCount: number

    expectedDate: string | null

}


const STATUS_STYLES: Record<string, string> = {

    PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',

    SHIPPED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',

    DELIVERED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',

    CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',

}


export default function Orders() {

    const [orders, setOrders] = useState<Order[]>([])

    const [loading, setLoading] = useState(true)

    const [error, setError] = useState<string | null>(null)


    useEffect(() => {

        fetch('/api/orders')

            .then(res => {

                if (!res.ok) throw new Error('Failed to fetch orders')

                return res.json()

            })

            .then(data => setOrders(data))

            .catch(err => setError(err.message))

            .finally(() => setLoading(false))

    }, [])


    if (loading) return <div className="p-12 text-center text-gray-500 dark:text-slate-400">Loading orders...</div>

    if (error) return <div className="p-12 text-center text-red-500 dark:text-red-400">{error}</div>


    return (

        <div className="p-8">

            <div className="mb-8">

                <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-2">Orders</h1>

                <p className="text-sm text-gray-500 dark:text-slate-400">Manage and track all incoming orders.</p>

            </div>


            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden
shadow-sm transition-colors duration-300">

                <div className="overflow-x-auto">

                    <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700 text-sm">

                        <thead className="bg-gray-50 dark:bg-slate-900/50">

                        <tr>

                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase
tracking-wider">Order #
                            </th>

                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase
tracking-wider">Supplier
                            </th>

                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase
tracking-wider">Status
                            </th>

                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase
tracking-wider">Items
                            </th>

                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase
tracking-wider">Total
                            </th>

                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase
tracking-wider">Expected Date
                            </th>

                        </tr>

                        </thead>

                        <tbody className="divide-y divide-gray-200 dark:divide-slate-700 bg-white dark:bg-slate-800 transition-colors
duration-300">

                        {orders.map((order) => (

                            <tr key={order.id}
                                className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors duration-200">

                                <td className="px-6 py-4 font-mono text-sm font-medium text-indigo-600
dark:text-indigo-400">{order.orderNumber}</td>

                                <td className="px-6 py-4 font-medium text-gray-800 dark:text-slate-200">{order.supplier}</td>

                                <td className="px-6 py-4">
                                                                                                                          
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${STATUS_STYLES[order.status] ||
                    'bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-slate-300'}`}>
                                                                                                                          
                      {order.status}                                                                                      
                                                                                                                          
                    </span>

                                </td>

                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-slate-400">{order.itemCount}</td>

                                <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-slate-200">€{(order.total /
                                    100).toFixed(2)}</td>

                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-slate-400">{order.expectedDate ? new
                                Date(order.expectedDate).toLocaleDateString() : 'N/A'}</td>

                            </tr>

                        ))}

                        {orders.length === 0 && (

                            <tr>

                                <td colSpan={6}
                                    className="px-6 py-8 text-center text-sm text-gray-500 dark:text-slate-400">No
                                    orders
                                    found.
                                </td>

                            </tr>

                        )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    )

}