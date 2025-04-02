'use client'

import { newEquipamento } from "@/lib/actions/equipamento/newEquipamento"
import { editEquipamento } from "@/lib/actions/equipamento/editEquipamento"
import { ActionResult } from "@/lib/definitions/default/ActionResult"
import { Equipamento } from "@/lib/definitions/models/Equipamento"
import { Subestacao } from "@/lib/definitions/models/Subestacao"
import { Alert, AlertIcon, Box, Button, FormControl, FormLabel, Select, useToast, VStack } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import useSWR from "swr"
import { fetchSubestacoes } from "@/lib/actions/subestacao/fetchSubestacao"
import InputField from "@/lib/components/InputField"


interface EquipamentoFormProps {
    equipamento?: Equipamento | null
    onSuccess: () => void
}

export default function EquipamentoForm({ equipamento, onSuccess }: EquipamentoFormProps) {
    const toast = useToast()

    const [formData, setFormData] = useState<Partial<Equipamento>>({
        nome: '',
        subestacaoId: 0
    })
    const [errors, setErrors] = useState<Record<string, string[]>>({})
    const [loading, setLoading] = useState(false)
    const [serverError, setServerError] = useState<string | null>(null)

    const { data: subestacoes, error, isLoading } = useSWR<Subestacao[]>('/api/subestacoes', fetchSubestacoes)

    useEffect(() => {
        if (equipamento) {
            setFormData({
                id: equipamento.id,
                nome: equipamento.nome,
                subestacaoId: equipamento.subestacaoId
            })
        }
    }, [equipamento])

    const handleChange = (field: keyof Equipamento, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: field === 'subestacaoId' ? Number(value) : value
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
            form.append('subestacaoId', formData.subestacaoId?.toString() ?? '')

            const action = equipamento ? editEquipamento : newEquipamento
            const result: ActionResult = await action({ success: true, message: 'Dummy' }, form)

            if (result.success) {
                toast({
                    title: result.message,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
                onSuccess()
                if (!equipamento) setFormData({ nome: '', subestacaoId: 0 })
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
                    placeholder="Nome do equipamento"
                    value={formData.nome || ''}
                    error={errors.nome}
                    onChange={(e) => handleChange('nome', e.target.value)}
                />

                <FormControl isInvalid={!!errors.subestacaoId}>
                    <FormLabel>Subestação</FormLabel>
                    <Select
                        placeholder="Selecione uma subestação"
                        value={formData.subestacaoId?.toString() || ''}
                        onChange={(e) => handleChange('subestacaoId', e.target.value)}
                    >
                        {subestacoes?.map((subestacao) => (
                            <option key={subestacao.id} value={subestacao.id}>
                                {subestacao.nome}
                            </option>
                        ))}
                        {error && <option value="">Erro ao carregar subestações</option>}
                        {isLoading && <option value="">Carregando...</option>}
                    </Select>
                    {errors.subestacaoId && (
                        <Box mt={1} color="red.500" fontSize="sm">
                            {errors.subestacaoId.join(', ')}
                        </Box>
                    )}
                </FormControl>

                <Button
                    type="submit"
                    colorScheme="blue"
                    width="full"
                    isLoading={loading}
                    loadingText="Salvando..."
                >
                    {equipamento ? 'Atualizar Equipamento' : 'Criar Equipamento'}
                </Button>
            </VStack>
        </Box>
    )
}
