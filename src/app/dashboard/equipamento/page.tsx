// app/dashboard/equipamento/page.tsx
'use client'

import {
    useDisclosure,
    useToast,
} from '@chakra-ui/react'
import { useState } from 'react'
import useSWR from 'swr'
import { fetchEquipamentos } from '@/lib/actions/equipamento/fetchEquipamentos'
import { deleteEquipamento } from '@/lib/actions/equipamento/deleteEquipamento'
import { Equipamento } from '@/lib/definitions/models/Equipamento'
import ModalWrapper from '@/lib/components/ModalWrapper'
import ConfirmDeleteDialog from '@/lib/components/ConfirmDeleteDialog'
import EntityLayout from '@/lib/components/EntityLayout'
import SearchAddRefreshBar from '@/lib/components/SearchAddRefreshBar'
import DataTable from '@/lib/components/DataTable'
import EquipamentoForm from './EquipamentoForm'

export default function EquipamentoPage() {
    const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure()
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()
    const [editing, setEditing] = useState<Equipamento | null>(null)
    const [deleting, setDeleting] = useState<Equipamento | null>(null)
    const [search, setSearch] = useState('')
    const toast = useToast()

    const { data, error, isLoading, mutate } = useSWR<Equipamento[]>('/api/equipamentos', fetchEquipamentos)

    const filtered = data?.filter((item) =>
        item.nome.toLowerCase().includes(search.toLowerCase())
    ) || []

    const handleDelete = async () => {
        const result = await deleteEquipamento({ success: true, message: '' }, deleting?.id || 0)
        if (result.success) {
            toast({ title: result.message, status: 'success' })
            onDeleteClose()
            mutate()
        } else {
            toast({ title: result.message, status: 'error' })
        }
    }

    return (
        <EntityLayout title="Equipamentos" isLoading={isLoading} error={error}>
            <SearchAddRefreshBar
                searchPlaceholder="Pesquisar equipamento"
                onSearchChange={setSearch}
                onCreate={onCreateOpen}
                onRefresh={mutate}
            />

            <DataTable
                data={filtered}
                columns={[
                    { key: 'nome', label: 'Nome' },
                    { key: 'subestacao.nome', label: 'Subestação' },
                ]}
                onEdit={(item) => { setEditing(item); onEditOpen() }}
                onDelete={(item) => { setDeleting(item); onDeleteOpen() }}
            />

            <ModalWrapper isOpen={isCreateOpen} onClose={onCreateClose} title="Novo Equipamento">
                <EquipamentoForm onSuccess={() => { onCreateClose(); mutate() }} equipamento={null} />
            </ModalWrapper>

            <ModalWrapper isOpen={isEditOpen} onClose={onEditClose} title="Editar Equipamento">
                <EquipamentoForm onSuccess={() => { onEditClose(); setEditing(null); mutate() }} equipamento={editing} />
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
