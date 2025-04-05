'use client'

import { deleteGrupoDefeitoEquipamento } from '@/lib/actions/grupoDefeitoEquipamento/deleteGrupoDefeitoEquipamento'
import DataTable from '@/lib/components/DataTable'
import EntityLayout from '@/lib/components/EntityLayout'
import ModalWrapper from '@/lib/components/ModalWrapper'
import SearchAddRefreshBar from '@/lib/components/SearchAddRefreshBar'
import { GrupoDefeitoEquipamento } from '@/lib/definitions/models/GrupoDefeitoEquipamento'
import {
    useDisclosure,
    useToast,
} from '@chakra-ui/react'
import { useState } from 'react'
import useSWR from 'swr'
import GrupoDefeitoEquipamentoForm from './GrupoDefeitoEquipamentoForm'
import ConfirmDeleteDialog from '@/lib/components/ConfirmDeleteDialog'
import { fetchGrupoDefeitoEquipamento } from '@/lib/actions/grupoDefeitoEquipamento/fetchGrupoDefeitoEquipamento'


export default function GrupoDefeitoEquipamentoPage() {
    const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure()
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()
    const [editing, setEditing] = useState<GrupoDefeitoEquipamento | null>(null)
    const [deleting, setDeleting] = useState<GrupoDefeitoEquipamento | null>(null)
    const toast = useToast()

    const { data, error, isLoading, mutate } = useSWR<GrupoDefeitoEquipamento[]>('/api/grupoDefeitoEquipamento', fetchGrupoDefeitoEquipamento)
    const [filtered, setFiltered] = useState<GrupoDefeitoEquipamento[]>([])

    const handleDelete = async () => {
        const result = await deleteGrupoDefeitoEquipamento({ success: true, message: '' }, deleting?.id || 0)
        if (result.success) {
            toast({ title: result.message, status: 'success' })
            onDeleteClose()
            mutate()
        } else {
            toast({ title: result.message, status: 'error' })
        }
    }

    return (
        <EntityLayout title="Grupos de Defeito x Equipamentos" isLoading={isLoading} error={error}>
            <SearchAddRefreshBar
                searchPlaceholder="Pesquisar Grupo de Defeito x Equipamento"
                data={data || []}
                searchKey="equipamento"
                onFilter={setFiltered}
                onCreate={onCreateOpen}
                onRefresh={mutate}
                isRefreshing={isLoading}
            />
            <DataTable
                data={filtered.map(g => ({ ...g, id: g.id || 0 }))}
                columns={[
                    { key: 'equipamento', label: 'Equipamento' },
                    { key: 'grupoDeDefeitos.nome', label: 'Grupo de Defeito' },
                ]}
                onEdit={(item) => { setEditing(item); onEditOpen() }}
                onDelete={(item) => { setDeleting(item); onDeleteOpen() }}
            />

            <ModalWrapper isOpen={isCreateOpen} onClose={onCreateClose} title="Novo Grupo de Defeito x Equipamento">
                <GrupoDefeitoEquipamentoForm onSuccess={() => { onCreateClose(); mutate() }} grupoDefeitoEquipamento={null} />
            </ModalWrapper>

            <ModalWrapper isOpen={isEditOpen} onClose={onEditClose} title="Editar Grupo de Defeito x Equipamento">
                <GrupoDefeitoEquipamentoForm onSuccess={() => { onEditClose(); mutate() }} grupoDefeitoEquipamento={editing} />
            </ModalWrapper>

            <ConfirmDeleteDialog
                isOpen={isDeleteOpen}
                onClose={onDeleteClose}
                onConfirm={handleDelete}
                entityName={deleting?.equipamento || ''}
            />
        </EntityLayout>
    )
}