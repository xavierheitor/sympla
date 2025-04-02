// components/SearchAddRefreshBar.tsx
'use client'

import { HStack, Input, IconButton } from '@chakra-ui/react'
import { FiPlus, FiRefreshCcw } from 'react-icons/fi'
import { useState, useEffect } from 'react'

interface Props<T> {
    searchPlaceholder: string
    data: T[]
    searchKey: keyof T | string // Suporta campos aninhados tipo 'empresa.nome'
    onFilter: (filtered: T[]) => void
    onCreate: () => void
    onRefresh: () => void
    isRefreshing?: boolean
}

export default function SearchAddRefreshBar<T>({
    searchPlaceholder,
    data,
    searchKey,
    onFilter,
    onCreate,
    onRefresh,
    isRefreshing
}: Props<T>) {
    const [search, setSearch] = useState('')

    useEffect(() => {
        if (!Array.isArray(data)) return
        const filtered = data.filter((item) => {
            const keys = (searchKey as string).split('.')
            let value: unknown = item

            for (const key of keys) {
                value = (value as Record<string, unknown>)?.[key]
                if (value === undefined) break
            }

            return typeof value === 'string' && value.toLowerCase().includes(search.toLowerCase())
        })

        onFilter(filtered)
    }, [search, data, searchKey, onFilter])

    return (
        <HStack justify="space-between" mb={4}>
            <Input
                placeholder={searchPlaceholder}
                onChange={(e) => setSearch(e.target.value)}
                value={search}
            />
            <IconButton icon={<FiPlus />} aria-label="Criar" onClick={onCreate} colorScheme="blue" />
            <IconButton icon={<FiRefreshCcw />} aria-label="Recarregar" onClick={onRefresh} isLoading={isRefreshing} />
        </HStack>
    )
}