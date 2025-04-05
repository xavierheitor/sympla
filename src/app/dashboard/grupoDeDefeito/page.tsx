'use client'

import { deleteGrupoDeDefeito } from "@/lib/actions/grupoDeDefeito/deleteGrupoDeDefeito"
import { fetchGrupoDeDefeito } from "@/lib/actions/grupoDeDefeito/fetchGrupoDeDefeito"
import DataTable from "@/lib/components/DataTable"
import EntityLayout from "@/lib/components/EntityLayout"
import ModalWrapper from "@/lib/components/ModalWrapper"
import SearchAddRefreshBar from "@/lib/components/SearchAddRefreshBar"
import { GrupoDeDefeito } from "@/lib/definitions/models/GrupoDeDefeito"
import { useDisclosure, useToast } from "@chakra-ui/react"
import { useState } from "react"
import useSWR from "swr"
import GrupoDeDefeitoForm from "./GrupoDeDefeitoForm"
import ConfirmDeleteDialog from "@/lib/components/ConfirmDeleteDialog"

export default function GrupoDeDefeitoPage() {
    const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure()
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()
    const [editing, setEditing] = useState<GrupoDeDefeito | null>(null)
    const [deleting, setDeleting] = useState<GrupoDeDefeito | null>(null)
    const toast = useToast()

    const { data, error, isLoading, mutate } = useSWR<GrupoDeDefeito[]>('/api/grupoDeDefeitos', fetchGrupoDeDefeito)
    const [filtered, setFiltered] = useState<GrupoDeDefeito[]>([])

    const handleDelete = async () => {
        const result = await deleteGrupoDeDefeito({ success: true, message: '' }, deleting?.id || 0)
        if (result.success) {
            toast({ title: result.message, status: 'success' })
            onDeleteClose()
            mutate()
        } else {
            toast({ title: result.message, status: 'error' })
        }
    }


    return (
        <EntityLayout title="Grupo de Defeito" isLoading={isLoading} error={error}>
            <SearchAddRefreshBar
                searchPlaceholder="Pesquisar Grupo de Defeito"
                data={data || []}
                searchKey="nome"
                onFilter={setFiltered}
                onCreate={onCreateOpen}
                onRefresh={mutate}
                isRefreshing={isLoading}
            />

            <DataTable
                data={filtered.map(g => ({ ...g, id: g.id || 0 }))}
                columns={[
                    { key: 'nome', label: 'Nome' },
                ]}
                onEdit={(item) => { setEditing(item); onEditOpen() }}
                onDelete={(item) => { setDeleting(item); onDeleteOpen() }}
            />

            <ModalWrapper isOpen={isCreateOpen} onClose={onCreateClose} title="Novo Grupo de Defeito">
                <GrupoDeDefeitoForm onSuccess={() => { onCreateClose(); mutate() }} grupoDeDefeito={null} />
            </ModalWrapper>

            <ModalWrapper isOpen={isEditOpen} onClose={onEditClose} title="Editar Grupo de Defeito">
                <GrupoDeDefeitoForm onSuccess={() => { onEditClose(); setEditing(null); mutate() }} grupoDeDefeito={editing} />
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