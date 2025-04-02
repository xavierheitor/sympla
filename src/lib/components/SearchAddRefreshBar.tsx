// components/SearchAddRefreshBar.tsx
import { HStack, Input, IconButton } from '@chakra-ui/react'
import { FiPlus, FiRefreshCcw } from 'react-icons/fi'

interface Props {
    searchPlaceholder: string
    onSearchChange: (value: string) => void
    onCreate: () => void
    onRefresh: () => void
    isRefreshing?: boolean
}

export default function SearchAddRefreshBar({ searchPlaceholder, onSearchChange, onCreate, onRefresh, isRefreshing }: Props) {
    return (
        <HStack justify="space-between" mb={4}>
            <Input placeholder={searchPlaceholder} onChange={(e) => onSearchChange(e.target.value)} />
            <IconButton icon={<FiPlus />} aria-label="Criar" onClick={onCreate} colorScheme="blue" />
            <IconButton icon={<FiRefreshCcw />} aria-label="Recarregar" onClick={onRefresh} isLoading={isRefreshing} />
        </HStack>
    )
}