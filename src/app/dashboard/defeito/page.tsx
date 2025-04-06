'use client'

import { deleteDefeito } from '@/lib/actions/defeito/deleteDefeito'
import { fetchDefeitos } from '@/lib/actions/defeito/fetchDefeitos'
import DataTable from '@/lib/components/DataTable'
import EntityLayout from '@/lib/components/EntityLayout'
import ModalWrapper from '@/lib/components/ModalWrapper'
import SearchAddRefreshBar from '@/lib/components/SearchAddRefreshBar'
import { Defeito } from '@/lib/definitions/models/Defeito'
import {
    useDisclosure,
    useToast,
} from '@chakra-ui/react'
import { useState } from 'react'
import useSWR from 'swr'
import DefeitoForm from './DefeitoForm'
import ConfirmDeleteDialog from '@/lib/components/ConfirmDeleteDialog'


export default function DefeitoPage() {
    const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure()
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()
    const [editing, setEditing] = useState<Defeito | null>(null)
    const [deleting, setDeleting] = useState<Defeito | null>(null)
    const toast = useToast()

    const { data, error, isLoading, mutate } = useSWR<Defeito[]>('/api/defeitos', fetchDefeitos)
    const [filtered, setFiltered] = useState<Defeito[]>([])

    const handleDelete = async () => {
        const result = await deleteDefeito({ success: true, message: '' }, deleting?.id || 0)
        if (result.success) {
            toast({ title: result.message, status: 'success' })
            onDeleteClose()
            mutate()
        } else {
            toast({ title: result.message, status: 'error' })
        }
    }

    return (
        <EntityLayout title="Defeitos" isLoading={isLoading} error={error}>
            <SearchAddRefreshBar
                searchPlaceholder="Pesquisar Defeito"
                data={data || []}
                searchKey="nome"
                onFilter={setFiltered}
                onCreate={onCreateOpen}
                onRefresh={mutate}
                isRefreshing={isLoading}
            />

            <DataTable
                data={filtered.map(e => ({ ...e, id: e.id || 0 }))}
                columns={[
                    { key: 'nome', label: 'Nome' },
                    { key: 'prioridade', label: 'Prioridade' },
                    { key: 'codigoSAP', label: 'Código SAP' },
                    { key: 'grupoDefeitosEquipamento.equipamento', label: 'Grupo de Defeitos de Equipamento' },
                    { key: 'subGrupoDefeitos.nome', label: 'Subgrupo de Defeitos' },

                ]}
                onEdit={(item) => { setEditing(item); onEditOpen() }}
                onDelete={(item) => { setDeleting(item); onDeleteOpen() }}
            />

            <ModalWrapper isOpen={isCreateOpen} onClose={onCreateClose} title="Novo Defeito">
                <DefeitoForm onSuccess={() => { onCreateClose(); mutate() }} defeito={null} />
            </ModalWrapper>

            <ModalWrapper isOpen={isEditOpen} onClose={onEditClose} title="Editar Defeito">
                <DefeitoForm onSuccess={() => { onEditClose(); mutate() }} defeito={editing} />
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