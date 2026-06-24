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
                className="w-full px-3 py-2 border border-gray-