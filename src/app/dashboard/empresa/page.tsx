// pages/empresa/page.tsx
'use client'

import {
    useDisclosure,
    useToast,
} from '@chakra-ui/react'
import { useState } from 'react'
import useSWR from 'swr'
import { fetchEmpresas } from '@/lib/actions/empresa/fetchEmpresas'
import { Empresa } from '@/lib/definitions/models/Empresa'
import EmpresaForm from './EmpresaForm'
import ModalWrapper from '@/lib/components/ModalWrapper'
import ConfirmDeleteDialog from '@/lib/components/ConfirmDeleteDialog'
import EntityLayout from '@/lib/components/EntityLayout'
import SearchAddRefreshBar from '@/lib/components/SearchAddRefreshBar'
import DataTable from '@/lib/components/DataTable'
import { deleteEmpresa } from '@/lib/actions/empresa/deleteEmpresa'

export default function EmpresaPage() {
    const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure()
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()
    const [editing, setEditing] = useState<Empresa | null>(null)
    const [deleting, setDeleting] = useState<Empresa | null>(null)
    const [search, setSearch] = useState('')
    const toast = useToast()

    const { data, error, isLoading, mutate } = useSWR<Empresa[]>('/api/empresas', fetchEmpresas)

    const filtered = data?.filter(e => e.nome.toLowerCase().includes(search.toLowerCase())) || []

    const handleDelete = async () => {
        const result = await deleteEmpresa({ success: true, message: '' }, deleting?.id || 0)
        if (result.success) {
            toast({ title: result.message, status: 'success' })
            onDeleteClose()
            mutate()
        } else {
            toast({ title: result.message, status: 'error' })
        }
    }

    return (
        <EntityLayout title="Empresas" isLoading={isLoading} error={error}>
            <SearchAddRefreshBar
                searchPlaceholder="Pesquisar empresa"
                onSearchChange={setSearch}
                onCreate={onCreateOpen}
                onRefresh={mutate}
            />

            <DataTable
                data={filtered.map(e => ({ ...e, id: e.id || 0 }))}
                columns={[
                    { key: 'nome', label: 'Nome' },
                    { key: 'cnpj', label: 'CNPJ' },
                ]}
                onEdit={(item) => { setEditing(item); onEditOpen() }}
                onDelete={(item) => { setDeleting(item); onDeleteOpen() }}
            />

            <ModalWrapper isOpen={isCreateOpen} onClose={onCreateClose} title="Nova Empresa">
                <EmpresaForm onSuccess={() => { onCreateClose(); mutate() }} empresa={null} />
            </ModalWrapper>

            <ModalWrapper isOpen={isEditOpen} onClose={onEditClose} title="Editar Empresa">
                <EmpresaForm onSuccess={() => { onEditClose(); setEditing(null); mutate() }} empresa={editing} />
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