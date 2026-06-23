import { useEffect, useState } from 'react'

interface Product {
    id: number
    sku: string
    name: string
    description: string
    category: string
    supplier: string
    unitPrice: number
    stockQty: number
    reorderLevel: number
    needsReorder: boolean
}

interface FormData {
    sku: string
    name: string
    description: string
    unitPrice: string
    stockQty: string
    reorderLevel: string
    categoryId: string
    supplierId: string
}

const EMPTY_FORM: FormData = {
    sku: '', name: '', description: '',
    unitPrice: '', stockQty: '', reorderLevel: '10',
    categoryId: '1', supplierId: '1'
}

const CATEGORIES = ['All', 'Electronics', 'Office Supplies', 'Furniture', 'Clothing', 'Tools & Hardware']

const CATEGORY_IDS: Record<string, string> = {
    'Electronics': '1', 'Office Supplies': '2',
    'Furniture': '3', 'Clothing': '4', 'Tools & Hardware': '5'
}

const SUPPLIER_IDS: Record<string, string> = {
    'TechSource Ltd': '1', 'OfficeWorld Inc': '2',
    'FurniturePro': '3', 'ApparelHub': '4', 'ToolMaster Supply': '5'
}

function StockBadge({ qty, needsReorder }: { qty: number; needsReorder: boolean }) {
    if (qty === 0) return <span className="px-3 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Out of stock</span>
    if (needsReorder) return <span className="px-3 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded-full">Low — {qty} left</span>
    return <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">{qty} in stock</span>
}

function Modal({ title, onClose, onSave, form, setForm, saving }: {
    title: string
    onClose: () => void
    onSave: () => void
    form: FormData
    setForm: (f: FormData) => void
    saving: boolean
}) {
    const field = (label: string, key: keyof FormData, type = 'text') => (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
                type={type}
                value={form[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
        </div>
    )

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-96 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-lg font-medium text-gray-900">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500 hover:text-gray-600">&times;</button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div>{field('SKU', 'sku')}</div>
                    <div>{field('Name', 'name')}</div>
                </div>
                {field('Description', 'description')}
                <div className="grid gap-4 md:grid-cols-3">
                    <div>{field('Price (€)', 'unitPrice', 'number')}</div>
                    <div>{field('Stock Qty', 'stockQty', 'number')}</div>
                    <div>{field('Reorder At', 'reorderLevel', 'number')}</div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        {Object.entries(CATEGORY_IDS).map(([name, id]) => <option key={id} value={id}>{name}</option>)}
                    </select>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                    <select value={form.supplierId} onChange={e => setForm({ ...form, supplierId: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        {Object.entries(SUPPLIER_IDS).map(([name, id]) => <option key={id} value={id}>{name}</option>)}
                    </select>
                </div>

                <div className="flex justify-end space-x-3">
                    <button onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Cancel
                    </button>
                    <button onClick={onSave} disabled={saving}
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                        {saving ? 'Saving…' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function Products() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('All')
    const [showModal, setShowModal] = useState(false)
    const [editProduct, setEditProduct] = useState<Product | null>(null)
    const [form, setForm] = useState<FormData>(EMPTY_FORM)
    const [saving, setSaving] = useState(false)
    const [deleteId, setDeleteId] = useState<number | null>(null)

    const load = (q = '') => {
        setLoading(true)
        const query = q ? `?search=${encodeURIComponent(q)}` : ''
        fetch(`/api/products${query}`)
            .then(r => r.json())
            .then(data => { setProducts(data); setLoading(false) })
    }

    useEffect(() => { load() }, [])
    useEffect(() => { const t = setTimeout(() => load(search), 300); return () => clearTimeout(t) }, [search])

    const openAdd = () => { setEditProduct(null); setForm(EMPTY_FORM); setShowModal(true) }

    const openEdit = (p: Product) => {
        setEditProduct(p)
        setForm({
            sku: p.sku, name: p.name, description: p.description || '',
            unitPrice: String(p.unitPrice), stockQty: String(p.stockQty),
            reorderLevel: String(p.reorderLevel),
            categoryId: CATEGORY_IDS[p.category] || '1',
            supplierId: SUPPLIER_IDS[p.supplier] || '1'
        })
        setShowModal(true)
    }

    const save = async () => {
        setSaving(true)
        const body = {
            sku: form.sku, name: form.name, description: form.description,
            unitPrice: parseFloat(form.unitPrice), stockQty: parseInt(form.stockQty),
            reorderLevel: parseInt(form.reorderLevel),
            categoryId: parseInt(form.categoryId), supplierId: parseInt(form.supplierId)
        }
        const url = editProduct ? `/api/products/${editProduct.id}` : '/api/products'
        const method = editProduct ? 'PUT' : 'POST'
        await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        setSaving(false)
        setShowModal(false)
        load(search)
    }

    const confirmDelete = async () => {
        if (!deleteId) return
        await fetch(`/api/products/${deleteId}`, { method: 'DELETE' })
        setDeleteId(null)
        load(search)
    }

    const filtered = category === 'All' ? products : products.filter(p => p.category === category)
    const lowStockCount = products.filter(p => p.needsReorder).length

    return (
        <div className="p-8">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Products</h1>
                    <p className="text-sm text-gray-500">
                        {products.length} products total
                        {lowStockCount > 0 && <span className="ml-2 text-amber-600 font-medium">⚠ {lowStockCount} need reordering</span>}
                    </p>
                </div>
                <button onClick={openAdd} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    + Add Product
                </button>
            </div>

            <div className="flex flex-wrap items-start mb-4 gap-4">
                <input type="text" placeholder="Search by name or SKU…" value={search}
                       onChange={e => setSearch(e.target.value)}
                       className="px-3 py-2 border border-gray-300 rounded-md shadow-sm w-64 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" />
                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => (
                        <button key={cat} onClick={() => setCategory(cat)} className={`px-3 py-1 text-sm rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${category === cat ? 'bg-indigo-600 text-white' : 'text-gray-700 bg-white'}`}>
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {loading && <div className="text-center py-12 text-gray-500">Loading…</div>}

            {!loading && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reorder at</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500">No products found</td>
                                </tr>
                            ) : filtered.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-mono text-sm font-medium text-indigo-600">{p.sku}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                                        {p.name}
                                        {p.description && <div className="text-sm text-gray-500 mt-1">{p.description}</div>}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{p.category ?? '—'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{p.supplier ?? '—'}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-800">€{p.unitPrice.toFixed(2)}</td>
                                    <td className="px-6 py-4"><StockBadge qty={p.stockQty} needsReorder={p.needsReorder} /></td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{p.reorderLevel}</td>
                                    <td className="px-6 py-4 text-sm font-medium space-x-2">
                                        <button onClick={() => openEdit(p)} className="px-3 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Edit</button>
                                        <button onClick={() => setDeleteId(p.id)} className="px-3 py-1 text-xs border border-red-300 text-red-600 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showModal && (
                <Modal
                    title={editProduct ? 'Edit Product' : 'Add Product'}
                    onClose={() => setShowModal(false)}
                    onSave={save}
                    form={form}
                    setForm={setForm}
                    saving={saving}
                />
            )}

            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Delete product?</h2>
                        <p className="text-gray-600 mb-6">This action cannot be undone.</p>
                        <div className="flex justify-end space-x-3">
                            <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Cancel
                            </button>
                            <button onClick={confirmDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}