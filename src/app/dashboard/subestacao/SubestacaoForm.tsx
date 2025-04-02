// SubestacaoForm.tsx
'use client'

import {
    Box, Button, VStack, FormControl, FormLabel, Input, Select, useToast
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Subestacao } from '@/lib/definitions/models/Subestacao'
import { Regional } from '@/lib/definitions/models/Regional'
import useSWR from 'swr'
import { fetchRegionais } from '@/lib/actions/regional/fetchRegional'
import { newSubestacao } from '@/lib/actions/subestacao/newSubestacao'
import { editSubestacao } from '@/lib/actions/subestacao/editSubestacao'
import { ActionResult } from '@/lib/definitions/default/ActionResult'

interface SubestacaoFormProps {
    subestacao?: Subestacao | null
    onSuccess: () => void
}

export default function SubestacaoForm({ subestacao, onSuccess }: SubestacaoFormProps) {
    const toast = useToast()
    const { data: regionais } = useSWR<Regional[]>('/api/regionais', fetchRegionais)
    const [formData, setFormData] = useState<Partial<Subestacao>>({})
    const [errors, setErrors] = useState<Record<string, string[]>>({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (subestacao) setFormData(subestacao)
    }, [subestacao])

    const handleChange = (field: keyof Subestacao, value: string) => {
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

        const action = subestacao ? editSubestacao : newSubestacao
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
                {['nome', 'sigla', 'localSAP'].map(field => (
                    <FormControl key={field} isInvalid={!!errors[field]}>
                        <FormLabel textTransform="capitalize">{field}</FormLabel>
                        <Input value={String(formData[field as keyof Subestacao] || '')} onChange={e => handleChange(field as keyof Subestacao, e.target.value)} />
                    </FormControl>
                ))}

                {['propriedade', 'tipo', 'categoria', 'tensao', 'status'].map(field => (
                    <FormControl key={field} isInvalid={!!errors[field]}>
                        <FormLabel textTransform="capitalize">{field}</FormLabel>
                        <Select placeholder={`Selecione ${field}`} value={String(formData[field as keyof Subestacao] || '')} onChange={e => handleChange(field as keyof Subestacao, e.target.value)}>
                            {getEnumOptions(field).map(val => (
                                <option key={val} value={val}>{val}</option>
                            ))}
                        </Select>
                    </FormControl>
                ))}

                <FormControl isInvalid={!!errors.regionalId}>
                    <FormLabel>Regional</FormLabel>
                    <Select value={formData.regionalId?.toString() || ''} onChange={e => handleChange('regionalId', e.target.value)}>
                        <option value="">Selecione uma regional</option>
                        {regionais?.map(reg => (
                            <option key={reg.id} value={reg.id}>{reg.nome}</option>
                        ))}
                    </Select>
                </FormControl>

                <Button type="submit" colorScheme="blue" isLoading={loading}>
                    {subestacao ? 'Atualizar Subestação' : 'Criar Subestação'}
                </Button>
            </VStack>
        </Box>
    )
}

function getEnumOptions(field: string): string[] {
    const enums: Record<string, string[]> = {
        propriedade: ['PROPRIA', 'COMPARTILHADA'],
        tipo: ['MT', 'AT'],
        categoria: ['DISTRIBUICAO', 'SUBTRANSMISSAO', 'TRANSMISSAO'],
        tensao: ['KV_34', 'KV_69', 'KV_138', 'KV_230'],
        status: ['ATIVA', 'INATIVA', 'EM_MANUTENCAO']
    }
    return enums[field] || []
}
