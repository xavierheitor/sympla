'use client'

import {
    useDisclosure,
    useToast,
} from '@chakra-ui/react'
import { useState } from 'react'
import useSWR from 'swr'
import { fetchTipoManutencao } from '@/lib/actions/tipoManutencao/fetchTipoManutencao'
import { TipoManutencao } from '@/lib/definitions/models/TipoManutencao'
import TipoManutencaoForm from './TipoManutencaoForm'
import { deleteTipoManutencao } from '@/lib/actions/tipoManutencao/deleteTipoManutencao'
import EntityLayout from '@/lib/components/EntityLayout'
import SearchAddRefreshBar from '@/lib/components/SearchAddRefreshBar'
import DataTable from '@/lib/components/DataTable'
import ModalWrapper from '@/lib/components/ModalWrapper'
import ConfirmDeleteDialog from '@/lib/components/ConfirmDeleteDialog'

export default function TipoManutencaoPage() {
    const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure()
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()

    const [editing, setEditing] = useState<TipoManutencao | null>(null)
    const [deleting, setDeleting] = useState<TipoManutencao | null>(null)
    const toast = useToast()

    const { data, error, isLoading, mutate } = useSWR<TipoManutencao[]>('/api/tipoManutencao', fetchTipoManutencao)
    const [filtered, setFiltered] = useState<TipoManutencao[]>([])


    const handleDelete = async () => {
        const result = await deleteTipoManutencao({ success: true, message: '' }, deleting?.id || 0)
        if (result.success) {
            toast({ title: result.message || 'Tipo de manutenção deletado com sucesso', status: 'success' })
            onDeleteClose()
            mutate()
        } else {
            toast({ title: result.message || 'Erro ao deletar tipo de manutenção', status: 'error' })
        }
    }

    return (
        <EntityLayout title="Tipos de Manutenção" isLoading={isLoading} error={error}>
            <SearchAddRefreshBar
                searchPlaceholder="Pesquisar tipo de manutenção"
                data={data || []}
                searchKey="nome"
                onFilter={setFiltered}
                onCreate={onCreateOpen}
                onRefresh={mutate}
                isRefreshing={isLoading}
            />

            <DataTable
                data={filtered}
                columns={[{ key: 'nome', label: 'Nome' }]}
                onEdit={(item) => { setEditing(item); onEditOpen() }}
                onDelete={(item) => { setDeleting(item); onDeleteOpen() }}
            />

            <ModalWrapper isOpen={isCreateOpen} onClose={onCreateClose} title="Novo Tipo de Manutenção">
                <TipoManutencaoForm
                    tipoManutencao={null}
                    onSuccess={() => { onCreateClose(); mutate() }}
                />
            </ModalWrapper>

            <ModalWrapper isOpen={isEditOpen} onClose={onEditClose} title="Editar Tipo de Manutenção">
                <TipoManutencaoForm
                    tipoManutencao={editing}
                    onSuccess={() => { onEditClose(); setEditing(null); mutate() }}
                />
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