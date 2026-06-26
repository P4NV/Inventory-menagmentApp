import { useState } from 'react'

interface Supplier {
    id: number
    name: string
    contactEmail: string
    phone: string
    country: string
}

interface OrderForm {
    supplierId: number | null
    productName: string
    quantity: number
    expectedDate: string
}

// Mock suppliers data (simulates PostgreSQL seed data)
const MOCK_SUPPLIERS: Supplier[] = [
    { id: 1, name: 'Acme Corp', contactEmail: 'sales@acme.com', phone: '+1-555-0101', country: 'USA' },
    { id: 2, name: 'Global Parts Ltd', contactEmail: 'orders@globalparts.co.uk', phone: '+44-20-7946-0958', country: 'UK' },
    { id: 3, name: 'Tokyo Electronics', contactEmail: 'supply@tokyoelec.jp', phone: '+81-3-1234-5678', country: 'Japan' },
]

export default function Suppliers() {
    const [suppliers] = useState<Supplier[]>(MOCK_SUPPLIERS)
    const [form, setForm] = useState<OrderForm>({ supplierId: null, productName: '', quantity: 1, expectedDate: '' })
    const [message, setMessage] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.supplierId || !form.productName || !form.expectedDate) {
            setMessage('Please fill all fields.')
            return
        }

        const supplier = suppliers.find(s => s.id === form.supplierId)!
        const newOrder = {
            id: Date.now(),
            orderNumber: `ORD-${Math.floor(Math.random() * 10000)}`,
            supplier: supplier.name,
            status: 'Pending',
            total: (form.quantity * 25.5).toFixed(2), // Mock unit price
            itemCount: form.quantity,
            expectedDate: form.expectedDate,
            productName: form.productName
        }

        // Persist to localStorage to simulate DB sync with Orders page
        const existingOrders = JSON.parse(localStorage.getItem('mock_orders') || '[]')
        localStorage.setItem('mock_orders', JSON.stringify([...existingOrders, newOrder]))

        setMessage('✅ Order placed successfully! It will appear in the Orders page.')
        setForm({ supplierId: null, productName: '', quantity: 1, expectedDate: '' })
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-6 transition-colors duration-300">Suppliers</h1>

            {message && (
                <div className="mb-4 p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 rounded-md border border-emerald-200 dark:border-emerald-800">
                    {message}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm transition-colors duration-300">
                    <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-slate-100">Place an Order</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Supplier</label>
                            <select
                                className="w-full p-2 border rounded-md bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
                                value={form.supplierId || ''}
                                onChange={e => setForm({...form, supplierId: Number(e.target.value)})}
                            >
                                <option value="">Select Supplier</option>
                                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Product Name</label>
                            <input
                                type="text"
                                placeholder="e.g., Widget A"
                                className="w-full p-2 border rounded-md bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
                                value={form.productName}
                                onChange={e => setForm({...form, productName: e.target.value})}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Quantity</label>
                                <input
                                    type="number"
                                    min="1"
                                    className="w-full p-2 border rounded-md bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={form.quantity}
                                    onChange={e => setForm({...form, quantity: Number(e.target.value)})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Expected Date</label>
                                <input
                                    type="date"
                                    className="w-full p-2 border rounded-md bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={form.expectedDate}
                                    onChange={e => setForm({...form, expectedDate: e.target.value})}
                                />
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 shadow-sm">
                            Place Order
                        </button>
                    </form>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm transition-colors duration-300">
                    <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-slate-100">Mock Suppliers Database</h2>
                    <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2">
                        {suppliers.map(s => (
                            <div key={s.id} className="p-3 bg-gray-50 dark:bg-slate-900/50 rounded-md border border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                                <p className="font-medium text-gray-900 dark:text-slate-100">{s.name}</p>
                                <p className="text-sm text-gray-600 dark:text-slate-400">{s.contactEmail} | {s.phone}</p>
                                <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">📍 {s.country}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
