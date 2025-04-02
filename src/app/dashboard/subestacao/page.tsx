// pages/subestacao/page.tsx
'use client'

import {
    useDisclosure,
    useToast,
} from '@chakra-ui/react'
import { useState } from 'react'
import useSWR from 'swr'
import { fetchSubestacoes } from '@/lib/actions/subestacao/fetchSubestacao'
import { Subestacao } from '@/lib/definitions/models/Subestacao'
import SubestacaoForm from './SubestacaoForm'
import ModalWrapper from '@/lib/components/ModalWrapper'
import ConfirmDeleteDialog from '@/lib/components/ConfirmDeleteDialog'
import EntityLayout from '@/lib/components/EntityLayout'
import SearchAddRefreshBar from '@/lib/components/SearchAddRefreshBar'
import DataTable from '@/lib/components/DataTable'
import { deleteSubestacao } from '@/lib/actions/subestacao/deleteSubestacao'

export default function SubestacoesPage() {
    const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure()
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()

    const [editing, setEditing] = useState<Subestacao | null>(null)
    const [deleting, setDeleting] = useState<Subestacao | null>(null)
    const [search, setSearch] = useState('')
    const toast = useToast()

    const { data, error, isLoading, mutate } = useSWR<Subestacao[]>('/api/subestacoes', fetchSubestacoes)

    const filtered = data?.filter(s => s.nome.toLowerCase().includes(search.toLowerCase())) || []

    const handleDelete = async () => {
        const result = await deleteSubestacao({ success: true, message: '' }, deleting?.id || 0)
        if (result.success) {
            toast({ title: result.message, status: 'success' })
            onDeleteClose()
            mutate()
        } else {
            toast({ title: result.message || 'Erro ao deletar subestacao', status: 'error' })
        }
    }

    return (
        <EntityLayout title="Subestações" isLoading={isLoading} error={error}>
            <SearchAddRefreshBar
                searchPlaceholder="Pesquisar subestação"
                onSearchChange={setSearch}
                onCreate={onCreateOpen}
                onRefresh={mutate}
            />

            <DataTable
                data={filtered.map(s => ({ ...s, id: s.id || 0 }))}
                columns={[
                    { key: 'nome', label: 'Nome' },
                    { key: 'sigla', label: 'Sigla' },
                    { key: 'regional.nome', label: 'Regional' },
                ]}
                onEdit={(item) => { setEditing(item); onEditOpen() }}
                onDelete={(item) => { setDeleting(item); onDeleteOpen() }}
            />

            <ModalWrapper isOpen={isCreateOpen} onClose={onCreateClose} title="Nova Subestação">
                <SubestacaoForm onSuccess={() => { onCreateClose(); mutate() }} subestacao={null} />
            </ModalWrapper>

            <ModalWrapper isOpen={isEditOpen} onClose={onEditClose} title="Editar Subestação">
                <SubestacaoForm onSuccess={() => { onEditClose(); setEditing(null); mutate() }} subestacao={editing} />
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