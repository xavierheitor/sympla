'use client'

import { fetchGrupoDeDefeito } from "@/lib/actions/grupoDeDefeito/fetchGrupoDeDefeito";
import { editGrupoDefeitoEquipamento } from "@/lib/actions/grupoDefeitoEquipamento/editGrupoDefeitoEquipamento";
import { fetchGrupoDefeitoEquipamento } from "@/lib/actions/grupoDefeitoEquipamento/fetchGrupoDefeitoEquipamento";
import { newGrupoDefeitoEquipamento } from "@/lib/actions/grupoDefeitoEquipamento/newGrupoDefeitoEquipamento";
import InputField from "@/lib/components/InputField";
import { ActionResult } from "@/lib/definitions/default/ActionResult";
import { GrupoDeDefeito } from "@/lib/definitions/models/GrupoDeDefeito";
import { GrupoDefeitoEquipamento } from "@/lib/definitions/models/GrupoDefeitoEquipamento";
import { Alert, AlertIcon, Box, Button, FormControl, FormLabel, Select, useToast, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useSWR from "swr";

interface GrupoDefeitoEquipamentoFormProps {
    grupoDefeitoEquipamento?: GrupoDefeitoEquipamento | null
    onSuccess: () => void
}

export default function GrupoDefeitoEquipamentoForm({ grupoDefeitoEquipamento, onSuccess }: GrupoDefeitoEquipamentoFormProps) {
    const toast = useToast()

    const [formData, setFormData] = useState<Partial<GrupoDefeitoEquipamento>>({
        equipamento: '',
        grupoDeDefeitosId: 0,
    })
    const [errors, setErrors] = useState<Record<string, string[]>>({})
    const [loading, setLoading] = useState(false)
    const [serverError, setServerError] = useState<string | null>(null)

    const { data: gruposDeDefeito, error, isLoading } = useSWR<GrupoDeDefeito[]>('/api/grupoDefeitoEquipamento', fetchGrupoDeDefeito)

    useEffect(() => {
        if (grupoDefeitoEquipamento) {
            setFormData({
                equipamento: grupoDefeitoEquipamento.equipamento,
                grupoDeDefeitosId: grupoDefeitoEquipamento.grupoDeDefeitosId,
            })
        }
    }, [grupoDefeitoEquipamento]);

    const handleChange = (field: keyof GrupoDefeitoEquipamento, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: field === 'grupoDeDefeitosId' ? Number(value) : value
        }))
        setErrors(prev => ({ ...prev, [field]: [] }))
    }

    const handleSubmit = async () => {
        setLoading(true)
        setErrors({})
        setServerError(null)

        try {
            const form = new FormData()
            if (grupoDefeitoEquipamento?.id) form.append('id', grupoDefeitoEquipamento.id.toString())
            form.append('equipamento', formData.equipamento ?? '')
            form.append('grupoDeDefeitosId', formData.grupoDeDefeitosId?.toString() ?? '')

            const action = grupoDefeitoEquipamento ? editGrupoDefeitoEquipamento : newGrupoDefeitoEquipamento
            const result: ActionResult = await action({ success: true, message: 'Dummy' }, form)

            if (result.success) {
                toast({
                    title: result.message,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
                onSuccess()
                if (!grupoDefeitoEquipamento) setFormData({ equipamento: '', grupoDeDefeitosId: 0 })
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
                    label="Equipamento"
                    name="equipamento"
                    placeholder="Nome do equipamento"
                    value={formData.equipamento || ''}
                    error={errors.equipamento}
                    onChange={(e) => handleChange('equipamento', e.target.value)}
                />

                <FormControl isInvalid={!!errors.grupoDeDefeitosId}>
                    <FormLabel>Grupo de Defeito</FormLabel>
                    <Select
                        placeholder="Selecione um grupo de defeito"
                        value={formData.grupoDeDefeitosId?.toString() || ''}
                        onChange={(e) => handleChange('grupoDeDefeitosId', e.target.value)}
                    >
                        {gruposDeDefeito?.map((grupoDeDefeito) => (
                            <option key={grupoDeDefeito.id} value={grupoDeDefeito.id}>
                                {grupoDeDefeito.nome}
                            </option>
                        ))}
                        {error && <option value="">Erro ao carregar grupos de defeito</option>}
                        {isLoading && <option value="">Carregando...</option>}
                    </Select>
                    {errors.grupoDeDefeitosId && (
                        <Box mt={1} color="red.500" fontSize="sm">
                            {errors.grupoDeDefeitosId.join(', ')}
                        </Box>
                    )}
                </FormControl>

                <Button
                    type="submit"
                    colorScheme="blue"
                    width="full"
                    isLoading={loading}
                >
                    {grupoDefeitoEquipamento ? 'Atualizar' : 'Criar'}
                </Button>

            </VStack>
        </Box>
    )
}