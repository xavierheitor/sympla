'use client'

import { deleteKpi } from '@/lib/actions/kpi/deleteKpi'
import { fetchKpis } from '@/lib/actions/kpi/fetchKpis'
import ConfirmDeleteDialog from '@/lib/components/ConfirmDeleteDialog'
import DataTable from '@/lib/components/DataTable'
import EntityLayout from '@/lib/components/EntityLayout'
import ModalWrapper from '@/lib/components/ModalWrapper'
import SearchAddRefreshBar from '@/lib/components/SearchAddRefreshBar'
import {
    useDisclosure,
    useToast,
} from '@chakra-ui/react'
import { useState } from 'react'
import useSWR from 'swr'
import KpiForm from './KpiForm'
import { Kpi } from '@/lib/definitions/models/Kpi'


export default function KpiPage() {
    const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure()
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()
    const [editing, setEditing] = useState<Kpi | null>(null)
    const [deleting, setDeleting] = useState<Kpi | null>(null)
    const toast = useToast()

    const { data = [], error, isLoading, mutate } = useSWR<Kpi[]>('/api/kpi', fetchKpis)
    const [filtered, setFiltered] = useState<Kpi[]>([])

    const handleDelete = async () => {
        const result = await deleteKpi({ success: true, message: '' }, deleting?.id || 0)
        if (result.success) {
            toast({ title: result.message, status: 'success' })
            onDeleteClose()
            mutate()
        } else {
            toast({ title: result.message, status: 'error' })
        }
    }

    return (
        <EntityLayout title="KPI" isLoading={isLoading} error={error}>
            <SearchAddRefreshBar
                searchPlaceholder="Pesquisar KPI"
                data={data}
                searchKey="nome"
                onFilter={setFiltered}
                onCreate={onCreateOpen}
                onRefresh={mutate}
                isRefreshing={isLoading}
            />
            <DataTable
                data={filtered.map(kpi => ({ ...kpi, id: kpi.id || 0 }))}
                columns={[
                    { key: 'nome', label: 'Nome' },
                    { key: 'descricao', label: 'Descrição' },
                    { key: 'tipoManutencao.nome', label: 'Tipo de Manutenção' },
                ]}
                onEdit={(item) => { setEditing(item); onEditOpen() }}
                onDelete={(item) => { setDeleting(item); onDeleteOpen() }}
            />

            <ModalWrapper isOpen={isCreateOpen} onClose={onCreateClose} title="Novo KPI">
                <KpiForm onSuccess={() => { onCreateClose(); mutate() }} kpi={null} />
            </ModalWrapper>

            <ModalWrapper isOpen={isEditOpen} onClose={onEditClose} title="Editar KPI">
                <KpiForm onSuccess={() => { onEditClose(); setEditing(null); mutate() }} kpi={editing} />
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