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
    if (qty === 0) return <span className="px-3 py-1 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full">Out of stock</span>
    if (needsReorder) return <span className="px-3 py-1 text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-full">Low — {qty} left</span>
    return <span className="px-3 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full">{qty} in stock</span>
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
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{label}</label>
            <input
                type={type}
                value={form[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            />
        </div>
    )

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md p-6 border border-gray-200 dark:border-slate-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-4">{title}</h2>
                {field('SKU', 'sku')}
                {field('Name', 'name')}
                {field('Description', 'description', 'textarea')}
                <div className="grid grid-cols-2 gap-4">
                    {field('Unit Price (€)', 'unitPrice', 'number')}
                    {field('Stock Qty', 'stockQty', 'number')}
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    {field('Reorder Level', 'reorderLevel', 'number')}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Category</label>
                        <select
                            value={form.categoryId}
                            onChange={e => setForm({ ...form, categoryId: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                        >
                            {CATEGORIES.filter(c => c !== 'All').map(cat => (
                                <option key={cat} value={CATEGORY_IDS[cat]}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md transition-colors duration-200">Cancel</button>
                    <button onClick={onSave} disabled={saving} className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50 transition-colors duration-200">{saving ? 'Saving...' : 'Save'}</button>
                </div>
            </div>
        </div>
    )
}

export default function Products() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('All')
    const [modalOpen, setModalOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [form, setForm] = useState<FormData>(EMPTY_FORM)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        fetch(`/api/products?search=${encodeURIComponent(search)}&category=${encodeURIComponent(categoryFilter)}`)
            .then(r => r.json())
            .then(d => { setProducts(d); setLoading(false) })
            .catch(() => setLoading(false))
    }, [search, categoryFilter])

    const openModal = (product?: Product) => {
        if (product) {
            setEditingProduct(product)
            setForm({
                sku: product.sku, name: product.name, description: product.description,
                unitPrice: String(product.unitPrice), stockQty: String(product.stockQty),
                reorderLevel: String(product.reorderLevel), categoryId: '1', supplierId: '1'
            })
        } else {
            setEditingProduct(null)
            setForm(EMPTY_FORM)
        }
        setModalOpen(true)
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products'
            const method = editingProduct ? 'PUT' : 'POST'
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            })
            if (res.ok) {
                setModalOpen(false)
                fetch(`/api/products?search=${encodeURIComponent(search)}&category=${encodeURIComponent(categoryFilter)}`)
                    .then(r => r.json())
                    .then(d => setProducts(d))
            }
        } catch (e) {
            console.error(e)
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this product?')) return
        await fetch(`/api/products/${id}`, { method: 'DELETE' })
        setProducts(products.filter(p => p.id !== id))
    }

    const filteredProducts = products.filter(p => {
        if (categoryFilter === 'All') return true
        return p.category?.toLowerCase().includes(categoryFilter.toLowerCase())
    })

    return (
        <div className="p-8">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-2 transition-colors duration-300">Inventory</h1>
                    <p className="text-sm text-gray-500 dark:text-slate-400 transition-colors duration-300">{products.length} products found</p>
                </div>
                <button onClick={() => openModal()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200">
                    + Add Product
                </button>
            </div>

            <div className="flex gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search by name or SKU..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                />
                <select
                    value={categoryFilter}
                    onChange={e => setCategoryFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100