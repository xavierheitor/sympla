/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
    HStack,
    IconButton,
    Spinner,
    Text,
    Box
} from '@chakra-ui/react'
import { FiEdit2, FiTrash } from 'react-icons/fi'

interface Column<T> {
    key: string;
    label: string;
    render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    onEdit: (item: T) => void;
    onDelete: (item: T) => void;
    isLoading?: boolean;
    error?: Error;
}

function getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, key) => acc?.[key], obj)
}

export default function DataTable<T extends { id: number }>({ data, columns, onEdit, onDelete, isLoading, error }: DataTableProps<T>) {
    if (isLoading) {
        return (
            <Box textAlign="center" my={10}>
                <Spinner size="xl" />
            </Box>
        )
    }

    if (error) {
        return (
            <Box textAlign="center" my={10}>
                <Text color="red.500">{error.message}</Text>
            </Box>
        )
    }

    return (
        <Table variant="simple">
            <Thead>
                <Tr>
                    {columns.map(col => (
                        <Th key={col.key}>{col.label}</Th>
                    ))}
                    <Th>Ações</Th>
                </Tr>
            </Thead>
            <Tbody>
                {data.map((item) => (
                    <Tr key={item.id}>
                        {columns.map((col) => (
                            <Td key={col.key}>
                                {col.render ? col.render(item) : getNestedValue(item, col.key)}
                            </Td>
                        ))}
                        <Td>
                            <HStack spacing={2}>
                                <IconButton aria-label="Editar" icon={<FiEdit2 />} size="sm" onClick={() => onEdit(item)} variant="ghost" />
                                <IconButton aria-label="Excluir" icon={<FiTrash />} size="sm" colorScheme="red" onClick={() => onDelete(item)} variant="ghost" />
                            </HStack>
                        </Td>
                    </Tr>
                ))}
            </Tbody>
        </Table>
    )
}