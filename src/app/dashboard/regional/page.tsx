'use client'

import {
    useDisclosure,
    useToast,
} from '@chakra-ui/react'
import { useState } from 'react'
import useSWR from 'swr'
import { fetchRegionais } from '@/lib/actions/regional/fetchRegional'
import { Regional } from '@/lib/definitions/models/Regional'
import RegionalForm from './RegionalForm'
import ModalWrapper from '@/lib/components/ModalWrapper'
import ConfirmDeleteDialog from '@/lib/components/ConfirmDeleteDialog'
import EntityLayout from '@/lib/components/EntityLayout'
import SearchAddRefreshBar from '@/lib/components/SearchAddRefreshBar'
import DataTable from '@/lib/components/DataTable'
import { deleteRegional } from '@/lib/actions/regional/deleteRegional'

export default function RegionalPage() {
    const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure()
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()
    const [editing, setEditing] = useState<Regional | null>(null)
    const [deleting, setDeleting] = useState<Regional | null>(null)
    const toast = useToast()

    const { data, error, isLoading, mutate } = useSWR<Regional[]>('/api/regionais', fetchRegionais)
    const [filtered, setFiltered] = useState<Regional[]>([])


    const handleDelete = async () => {
        const result = await deleteRegional({ success: true, message: '' }, deleting?.id || 0)
        if (result.success) {
            toast({ title: result.message, status: 'success' })
            onDeleteClose()
            mutate()
        } else {
            toast({ title: result.message, status: 'error' })
        }
    }

    return (
        <EntityLayout title="Regionais" isLoading={isLoading} error={error}>
            <SearchAddRefreshBar
                searchPlaceholder="Pesquisar regional"
                data={data || []}
                searchKey="nome"
                onFilter={setFiltered}
                onCreate={onCreateOpen}
                onRefresh={mutate}
                isRefreshing={isLoading}
            />
            <DataTable
                data={filtered.map(r => ({ ...r, id: r.id || 0 }))}
                columns={[
                    { key: 'nome', label: 'Nome' },
                    { key: 'empresa.nome', label: 'Empresa' },
                ]}
                onEdit={(item) => { setEditing(item); onEditOpen() }}
                onDelete={(item) => { setDeleting(item); onDeleteOpen() }}
            />

            <ModalWrapper isOpen={isCreateOpen} onClose={onCreateClose} title="Nova Regional">
                <RegionalForm onSuccess={() => { onCreateClose(); mutate() }} regional={null} />
            </ModalWrapper>

            <ModalWrapper isOpen={isEditOpen} onClose={onEditClose} title="Editar Regional">
                <RegionalForm onSuccess={() => { onEditClose(); setEditing(null); mutate() }} regional={editing} />
            </ModalWrapper>

            <ConfirmDeleteDialog
                isOpen={isDeleteOpen}
                onClose={onDeleteClose}
                onConfirm={handleDelete}
                entityName={deleting?.nome || ''}
            />
        </EntityLayout>
    )
}