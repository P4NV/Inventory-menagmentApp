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
    'Received':   { bg: 'emerald-100 dark:bg-emerald-900/30', color: 'emerald-800 dark:text-em