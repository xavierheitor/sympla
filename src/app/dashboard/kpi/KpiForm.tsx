'use client'

import { editKpi } from "@/lib/actions/kpi/editKpi"
import { newKpi } from "@/lib/actions/kpi/newKpi"
import { fetchTipoManutencao } from "@/lib/actions/tipoManutencao/fetchTipoManutencao"
import InputField from "@/lib/components/InputField"
import { ActionResult } from "@/lib/definitions/default/ActionResult"
import { Kpi } from "@/lib/definitions/models/Kpi"
import { TipoManutencao } from "@/lib/definitions/models/TipoManutencao"
import { Alert, AlertIcon, Box, Button, FormControl, FormLabel, Select, useToast, VStack } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import useSWR from "swr"



interface KpiFormProps {
    kpi?: Kpi | null
    onSuccess: () => void
}

export default function KpiForm({ kpi, onSuccess }: KpiFormProps) {
    const toast = useToast()

    const [formData, setFormData] = useState<Partial<Kpi>>({
        nome: '',
        descricao: '',
        tipoManutencaoId: 0,
    })
    const [errors, setErrors] = useState<Record<string, string[]>>({})
    const [loading, setLoading] = useState(false)
    const [serverError, setServerError] = useState<string | null>(null)

    const { data: tipoManutencao, error, isLoading } = useSWR<TipoManutencao[]>('/api/tipoManutencao', fetchTipoManutencao)

    useEffect(() => {
        if (kpi) {
            setFormData({
                id: kpi.id,
                nome: kpi.nome,
                descricao: kpi.descricao,
                tipoManutencaoId: kpi.tipoManutencaoId,
            })
        }
    }, [kpi])

    const handleChange = (field: keyof Kpi, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: field === 'tipoManutencaoId' ? Number(value) : value
        }))
        setErrors(prev => ({ ...prev, [field]: [] }))
    }

    const handleSubmit = async () => {
        setLoading(true)
        setErrors({})
        setServerError(null)

        try {
            const form = new FormData()
            if (formData.id) form.append('id', formData.id.toString())
            form.append('nome', formData.nome ?? '')
            form.append('descricao', formData.descricao ?? '')
            form.append('tipoManutencaoId', formData.tipoManutencaoId?.toString() ?? '')

            const action = kpi ? editKpi : newKpi
            const result: ActionResult = await action({ success: true, message: 'Dummy' }, form)

            if (result.success) {
                toast({
                    title: result.message,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
                onSuccess()
                if (!kpi) setFormData({ nome: '', descricao: '', tipoManutencaoId: 0 })
            } else {
                setErrors(result.errors ?? {})
                toast({
                    title: result.message || 'Erro ao salvar',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
            }
        } catch (err) {
            console.error(err)
            setServerError('Erro inesperado. Tente novamente.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box as="form" onSubmit={(e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); handleSubmit() }}>
            <VStack spacing={4} align="stretch">
                {serverError && (
                    <Alert status="error">
                        <AlertIcon />
                        {serverError}
                    </Alert>
                )}

                <InputField
                    label="Nome"
                    name="nome"
                    placeholder="Nome do KPI"
                    value={formData.nome || ''}
                    error={errors.nome}
                    onChange={(e) => handleChange('nome', e.target.value)}
                />

                <InputField
                    label="Descrição"
                    name="descricao"
                    placeholder="Descrição do KPI"
                    value={formData.descricao || ''}
                    error={errors.descricao}
                    onChange={(e) => handleChange('descricao', e.target.value)}
                />

                <FormControl isInvalid={!!errors.tipoManutencaoId}>
                    <FormLabel>Tipo de Manutenção</FormLabel>
                    <Select
                        placeholder="Selecione um tipo de manutenção"
                        value={formData.tipoManutencaoId?.toString() || ''}
                        onChange={(e) => handleChange('tipoManutencaoId', e.target.value)}
                    >
                        {tipoManutencao?.map((tipoManutencao) => (
                            <option key={tipoManutencao.id} value={tipoManutencao.id}>
                                {tipoManutencao.nome}
                            </option>
                        ))}
                        {error && <option value="">Erro ao carregar tipos de manutenção</option>}
                        {isLoading && <option value="">Carregando...</option>}
                    </Select>
                    {errors.tipoManutencaoId && (
                        <Box mt={1} color="red.500" fontSize="sm">
                            {errors.tipoManutencaoId.join(', ')}
                        </Box>
                    )}
                </FormControl>

                <Button type="submit" colorScheme="blue" width="full" isLoading={loading} loadingText="Salvando...">
                    {kpi ? 'Atualizar KPI' : 'Criar KPI'}
                </Button>
            </VStack>
        </Box>
    )
}
