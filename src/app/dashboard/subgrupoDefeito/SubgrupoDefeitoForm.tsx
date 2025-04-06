'use client'

import { useEffect, useState } from 'react'
import { Box, Button, FormControl, FormLabel, Input, Select, useToast, VStack } from '@chakra-ui/react'
import useSWR from 'swr'
import { GrupoDefeitoEquipamento } from '@/lib/definitions/models/GrupoDefeitoEquipamento'
import { SubGrupoDefeito } from '@/lib/definitions/models/SubGrupoDefeito'
import { fetchGrupoDefeitoEquipamento } from '@/lib/actions/grupoDefeitoEquipamento/fetchGrupoDefeitoEquipamento'
import { editSubgrupoDefeito } from '@/lib/actions/subgrupoDefeito/editSubgrupoDefeito'
import { newSubgrupoDefeito } from '@/lib/actions/subgrupoDefeito/newSubgrupoDefeito'
import { ActionResult } from '@/lib/definitions/default/ActionResult'

interface SubgrupoDefeitoFormProps {
    subgrupoDefeito?: SubGrupoDefeito | null
    onSuccess: () => void
}

export default function SubgrupoDefeitoForm({ subgrupoDefeito, onSuccess }: SubgrupoDefeitoFormProps) {
    const toast = useToast()
    const { data: grupoDefeitoEquipamentos } = useSWR<GrupoDefeitoEquipamento[]>('/api/grupoDefeitoEquipamentos', fetchGrupoDefeitoEquipamento)
    const [formData, setFormData] = useState<Partial<SubGrupoDefeito>>({})
    const [errors, setErrors] = useState<Record<string, string[]>>({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (subgrupoDefeito) setFormData(subgrupoDefeito)
    }, [subgrupoDefeito])

    const handleChange = (field: keyof SubGrupoDefeito, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        setErrors(prev => ({ ...prev, [field]: [] }))
    }

    const handleSubmit = async () => {
        setLoading(true)
        setErrors({})

        const form = new FormData()
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                form.append(key, value.toString())
            }
        })

        const action = subgrupoDefeito ? editSubgrupoDefeito : newSubgrupoDefeito
        const result: ActionResult = await action({ success: true, message: '' }, form)

        if (result.success) {
            toast({ title: result.message, status: 'success', duration: 3000, isClosable: true })
            onSuccess()
        } else {
            setErrors(result.errors ?? {})
            toast({ title: result.message || 'Erro ao salvar', status: 'error', duration: 3000 })
        }
        setLoading(false)
    }

    return (
        <Box as="form" onSubmit={(e: { preventDefault: () => void }) => { e.preventDefault(); handleSubmit() }}>
            <VStack spacing={4} align="stretch">
                <FormControl key="nome" isInvalid={!!errors.nome}>
                    <FormLabel textTransform="capitalize">Nome</FormLabel>
                    <Input value={String(formData.nome || '')} onChange={e => handleChange('nome', e.target.value)} />
                </FormControl>

                <FormControl key="grupoDefeitoEquipamentoId" isInvalid={!!errors.grupoDefeitoEquipamentoId}>
                    <FormLabel textTransform="capitalize">Grupo de Defeito</FormLabel>
                    <Select placeholder="Selecione um grupo de defeito" value={String(formData.grupoDefeitoEquipamentoId || '')} onChange={e => handleChange('grupoDefeitoEquipamentoId', e.target.value)}>
                        {grupoDefeitoEquipamentos?.map(grupo => (
                            <option key={grupo.id} value={grupo.id}>{grupo.equipamento}</option>
                        ))}
                    </Select>
                </FormControl>

                <Button type="submit" colorScheme="blue" isLoading={loading}>
                    {subgrupoDefeito ? 'Atualizar Subgrupo de Defeito' : 'Criar Subgrupo de Defeito'}
                </Button>
            </VStack>
        </Box>
    )
}