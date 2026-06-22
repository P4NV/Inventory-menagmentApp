import { useEffect, useState } from 'react'
import '../App.css'

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
    if (qty === 0) return <span style={badge('#fee2e2', '#991b1b')}>Out of stock</span>
    if (needsReorder) return <span style={badge('#fef3c7', '#92400e')}>Low — {qty} left</span>
    return <span style={badge('#dcfce7', '#166534')}>{qty} in stock</span>
}

function badge(bg: string, color: string): React.CSSProperties {
    return { background: bg, color, fontSize: 12, fontWeight: 500, padding: '3px 10px', borderRadius: 999, whiteSpace: 'nowrap' }
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
        <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 4 }}>{label}</label>
            <input
                type={type}
                value={form[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}
            />
        </div>
    )

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
            <div style={{ background: 'white', borderRadius: 16, padding: 28, width: 480, maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>{title}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#9ca3af' }}>×</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                    <div>{field('SKU', 'sku')}</div>
                    <div>{field('Name', 'name')}</div>
                </div>
                {field('Description', 'description')}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0 16px' }}>
                    <div>{field('Price (€)', 'unitPrice', 'number')}</div>
                    <div>{field('Stock Qty', 'stockQty', 'number')}</div>
                    <div>{field('Reorder At', 'reorderLevel', 'number')}</div>
                </div>

                <div style={{ marginBottom: 14 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 4 }}>Category</label>
                    <select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })}
                            style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14 }}>
                        {Object.entries(CATEGORY_IDS).map(([name, id]) => <option key={id} value={id}>{name}</option>)}
                    </select>
                </div>

                <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 4 }}>Supplier</label>
                    <select value={form.supplierId} onChange={e => setForm({ ...form, supplierId: e.target.value })}
                            style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14 }}>
                        {Object.entries(SUPPLIER_IDS).map(([name, id]) => <option key={id} value={id}>{name}</option>)}
                    </select>
                </div>

                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                    <button onClick={onClose} style={{ padding: '9px 18px', border: '1px solid #d1d5db', borderRadius: 8, background: 'white', cursor: 'pointer', fontSize: 14 }}>
                        Cancel
                    </button>
                    <button onClick={onSave} disabled={saving}
                            style={{ padding: '9px 18px', background: '#111827', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>
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
        <div style={{ padding: '32px 40px', fontFamily: 'inherit' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>Products</h1>
                    <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: 14 }}>
                        {products.length} products total
                        {lowStockCount > 0 && <span style={{ marginLeft: 12, color: '#b45309', fontWeight: 500 }}>⚠ {lowStockCount} need reordering</span>}
                    </p>
                </div>
                <button onClick={openAdd} style={{
                    background: '#111827', color: 'white', border: 'none', borderRadius: 8,
                    padding: '9px 18px', fontSize: 14, fontWeight: 500, cursor: 'pointer'
                }}>
                    + Add Product
                </button>
            </div>

            <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
                <input type="text" placeholder="Search by name or SKU…" value={search}
                       onChange={e => setSearch(e.target.value)}
                       style={{ padding: '8px 14px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, width: 260, outline: 'none' }} />
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {CATEGORIES.map(cat => (
                        <button key={cat} onClick={() => setCategory(cat)} style={{
                            padding: '7px 14px', borderRadius: 8, border: '1px solid',
                            fontSize: 13, cursor: 'pointer', fontWeight: category === cat ? 600 : 400,
                            background: category === cat ? '#111827' : 'white',
                            borderColor: category === cat ? '#111827' : '#d1d5db',
                            color: category === cat ? 'white' : '#374151'
                        }}>{cat}</button>
                    ))}
                </div>
            </div>

            {loading && <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af' }}>Loading…</div>}

            {!loading && (
                <div style={{ background: 'white', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                        <thead>
                        <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                            {['SKU', 'Name', 'Category', 'Supplier', 'Price', 'Stock', 'Reorder at', ''].map(h => (
                                <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontWeight: 500, color: '#6b7280', fontSize: 13 }}>{h}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.length === 0 ? (
                            <tr><td colSpan={8} style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>No products found</td></tr>
                        ) : filtered.map((p, i) => (
                            <tr key={p.id}
                                style={{ borderBottom: i < filtered.length - 1 ? '1px solid #f3f4f6' : 'none' }}
                                onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'white')}>
                                <td style={{ padding: '12px 16px', color: '#6b7280', fontFamily: 'monospace', fontSize: 13 }}>{p.sku}</td>
                                <td style={{ padding: '12px 16px', fontWeight: 500 }}>
                                    {p.name}
                                    {p.description && <div style={{ fontSize: 12, color: '#9ca3af', fontWeight: 400, marginTop: 2 }}>{p.description}</div>}
                                </td>
                                <td style={{ padding: '12px 16px', color: '#374151' }}>{p.category ?? '—'}</td>
                                <td style={{ padding: '12px 16px', color: '#374151' }}>{p.supplier ?? '—'}</td>
                                <td style={{ padding: '12px 16px', fontWeight: 500 }}>€{p.unitPrice.toFixed(2)}</td>
                                <td style={{ padding: '12px 16px' }}><StockBadge qty={p.stockQty} needsReorder={p.needsReorder} /></td>
                                <td style={{ padding: '12px 16px', color: '#9ca3af' }}>{p.reorderLevel}</td>
                                <td style={{ padding: '12px 16px' }}>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button onClick={() => openEdit(p)} style={{
                                            padding: '5px 12px', fontSize: 12, border: '1px solid #d1d5db',
                                            borderRadius: 6, background: 'white', cursor: 'pointer', color: '#374151'
                                        }}>Edit</button>
                                        <button onClick={() => setDeleteId(p.id)} style={{
                                            padding: '5px 12px', fontSize: 12, border: '1px solid #fca5a5',
                                            borderRadius: 6, background: 'white', cursor: 'pointer', color: '#ef4444'
                                        }}>Delete</button>
                                    </div>
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
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
                    <div style={{ background: 'white', borderRadius: 16, padding: 28, width: 360 }}>
                        <h2 style={{ margin: '0 0 10px', fontSize: 18 }}>Delete product?</h2>
                        <p style={{ color: '#6b7280', fontSize: 14, margin: '0 0 20px' }}>This action cannot be undone.</p>
                        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                            <button onClick={() => setDeleteId(null)} style={{ padding: '9px 18px', border: '1px solid #d1d5db', borderRadius: 8, background: 'white', cursor: 'pointer' }}>Cancel</button>
                            <button onClick={confirmDelete} style={{ padding: '9px 18px', background: '#ef4444', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 500 }}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}