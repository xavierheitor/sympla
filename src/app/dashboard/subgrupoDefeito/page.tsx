'use client'

import { deleteSubgrupoDefeito } from '@/lib/actions/subgrupoDefeito/deleteSubgrupoDefeito'
import { fetchSubgrupoDefeito } from '@/lib/actions/subgrupoDefeito/fetchSubgrupoDefeito'
import DataTable from '@/lib/components/DataTable'
import EntityLayout from '@/lib/components/EntityLayout'
import ModalWrapper from '@/lib/components/ModalWrapper'
import SearchAddRefreshBar from '@/lib/components/SearchAddRefreshBar'
import { SubGrupoDefeito } from '@/lib/definitions/models/SubGrupoDefeito'
import {
    useDisclosure,
    useToast,
} from '@chakra-ui/react'
import { useState } from 'react'
import useSWR from 'swr'
import SubgrupoDefeitoForm from './SubgrupoDefeitoForm'
import ConfirmDeleteDialog from '@/lib/components/ConfirmDeleteDialog'


export default function SubgrupoDefeitoPage() {
    const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure()
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()

    const [editing, setEditing] = useState<SubGrupoDefeito | null>(null)
    const [deleting, setDeleting] = useState<SubGrupoDefeito | null>(null)
    const toast = useToast()

    const { data, error, isLoading, mutate } = useSWR<SubGrupoDefeito[]>('/api/subgrupoDefeitos', fetchSubgrupoDefeito)
    const [filtered, setFiltered] = useState<SubGrupoDefeito[]>([])

    const handleDelete = async () => {
        const result = await deleteSubgrupoDefeito({ success: true, message: '' }, deleting?.id || 0)
        if (result.success) {
            toast({ title: result.message, status: 'success' })
            onDeleteClose()
            mutate()
        } else {
            toast({ title: result.message || 'Erro ao deletar subgrupo de defeito', status: 'error' })
        }
    }

    return (
        <EntityLayout title="Subgrupos de Defeito" isLoading={isLoading} error={error}>
            <SearchAddRefreshBar
                searchPlaceholder="Pesquisar subgrupo de defeito"
                data={data || []}
                searchKey="nome"
                onFilter={setFiltered}
                onCreate={onCreateOpen}
                onRefresh={mutate}
                isRefreshing={isLoading}
            />

            <DataTable
                data={filtered.map(s => ({ ...s, id: s.id || 0 }))}
                columns={[
                    { key: 'nome', label: 'Nome' },
                    { key: 'grupoDefeitoEquipamento.equipamento', label: 'Grupo de Defeito' },
                ]}
                onEdit={(item) => { setEditing(item); onEditOpen() }}
                onDelete={(item) => { setDeleting(item); onDeleteOpen() }}
            />

            <ModalWrapper isOpen={isCreateOpen} onClose={onCreateClose} title="Novo Subgrupo de Defeito">
                <SubgrupoDefeitoForm onSuccess={() => { onCreateClose(); mutate() }} subgrupoDefeito={null} />
            </ModalWrapper>

            <ModalWrapper isOpen={isEditOpen} onClose={onEditClose} title="Editar Subgrupo de Defeito">
                <SubgrupoDefeitoForm onSuccess={() => { onEditClose(); setEditing(null); mutate() }} subgrupoDefeito={editing} />
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