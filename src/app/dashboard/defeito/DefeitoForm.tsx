'use client'

import { editDefeito } from "@/lib/actions/defeito/editDefeito"
import { newDefeito } from "@/lib/actions/defeito/newDefeito"
import { fetchGrupoDefeitoEquipamento } from "@/lib/actions/grupoDefeitoEquipamento/fetchGrupoDefeitoEquipamento"
import { fetchSubgrupoDefeito } from "@/lib/actions/subgrupoDefeito/fetchSubgrupoDefeito"
import InputField from "@/lib/components/InputField"
import { ActionResult } from "@/lib/definitions/default/ActionResult"
import { Defeito } from "@/lib/definitions/models/Defeito"
import { GrupoDefeitoEquipamento } from "@/lib/definitions/models/GrupoDefeitoEquipamento"
import { SubGrupoDefeito } from "@/lib/definitions/models/SubGrupoDefeito"
import { Alert, AlertIcon, Box, Button, FormControl, FormLabel, Select, SelectField, useToast, VStack } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import useSWR from "swr"

interface DefeitoFormProps {
    defeito?: Defeito | null
    onSuccess: () => void
}

export default function DefeitoForm({ defeito, onSuccess }: DefeitoFormProps) {
    const toast = useToast()

    const [formData, setFormData] = useState<Partial<Defeito>>({
        nome: '',
        descricao: '',
        codigoSAP: '',
        prioridade: 'A',
        subGrupoDefeitosId: 0,
        grupoDefeitosEquipamentoId: 0
    })
    const [errors, setErrors] = useState<Record<string, string[]>>({})
    const [loading, setLoading] = useState(false)
    const [serverError, setServerError] = useState<string | null>(null)

    const { data: subGrupoDefeitos, error, isLoading } = useSWR<SubGrupoDefeito[]>('/api/subGrupoDefeitos', fetchSubgrupoDefeito)
    const { data: grupoDefeitosEquipamento, error: grupoDefeitosEquipamentoError, isLoading: grupoDefeitosEquipamentoLoading } = useSWR<GrupoDefeitoEquipamento[]>('/api/grupoDefeitosEquipamento', fetchGrupoDefeitoEquipamento)
    useEffect(() => {
        if (defeito) {
            setFormData({
                id: defeito.id,
                nome: defeito.nome,
                descricao: defeito.descricao,
                codigoSAP: defeito.codigoSAP,
                prioridade: defeito.prioridade,
                subGrupoDefeitosId: defeito.subGrupoDefeitosId,
                grupoDefeitosEquipamentoId: defeito.grupoDefeitosEquipamentoId
            })
        }
    }, [defeito])

    const handleChange = (field: keyof Defeito, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: field === 'subGrupoDefeitosId' ? Number(value) : value
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
            form.append('codigoSAP', formData.codigoSAP ?? '')
            form.append('prioridade', formData.prioridade ?? '')
            form.append('subGrupoDefeitosId', formData.subGrupoDefeitosId?.toString() ?? '')
            form.append('grupoDefeitosEquipamentoId', formData.grupoDefeitosEquipamentoId?.toString() ?? '')

            const action = defeito ? editDefeito : newDefeito
            const result: ActionResult = await action({ success: true, message: 'Dummy' }, form)

            if (result.success) {
                toast({
                    title: 'Defeito salvo com sucesso',
                    description: result.message,
                    status: 'success',
                    duration: 3000,
                    isClosable: true
                })
                onSuccess()
            } else {
                toast({
                    title: 'Erro ao salvar defeito',
                    description: result.message,
                    status: 'error',
                    duration: 3000,
                    isClosable: true
                })
            }
        } catch (error) {
            setServerError('Erro ao salvar defeito')
            console.error('Erro ao salvar defeito:', error)
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
                    placeholder="Nome do defeito"
                    value={formData.nome ?? ''}
                    onChange={(e) => handleChange('nome', e.target.value)}
                    error={errors.nome}
                />

                <InputField
                    label="Descrição"
                    name="descricao"
                    placeholder="Descrição do defeito"
                    value={formData.descricao ?? ''}
                    onChange={(e) => handleChange('descricao', e.target.value)}
                    error={errors.descricao}
                />

                <InputField
                    label="Código SAP"
                    name="codigoSAP"
                    placeholder="Código SAP do defeito"
                    value={formData.codigoSAP ?? ''}
                    onChange={(e) => handleChange('codigoSAP', e.target.value)}
                    error={errors.codigoSAP}
                />

                <FormControl isInvalid={!!errors.prioridade}>
                    <FormLabel>Prioridade</FormLabel>
                    <Select
                        name="prioridade"
                        value={formData.prioridade ?? ''}
                        onChange={(e) => handleChange('prioridade', e.target.value)}
                    >
                        <option value="A">A</option>
                        <option value="P1">P1</option>
                        <option value="P2">P2</option>
                    </Select>
                    {errors.prioridade && (
                        <Box mt={1} color="red.500" fontSize="sm">
                            {errors.prioridade.join(', ')}
                        </Box>
                    )}
                </FormControl>

                <FormControl isInvalid={!!errors.subGrupoDefeitosId}>
                    <FormLabel>Subgrupo de Defeitos</FormLabel>
                    <Select
                        name="subGrupoDefeitosId"
                        value={formData.subGrupoDefeitosId?.toString() || ''}
                        onChange={(e) => handleChange('subGrupoDefeitosId', e.target.value)}
                    >
                        {subGrupoDefeitos?.map((subGrupoDefeito) => (
                            <option key={subGrupoDefeito.id} value={subGrupoDefeito.id}>
                                {subGrupoDefeito.nome}
                            </option>
                        ))}
                        {error && <option value="">Erro ao carregar subgrupos de defeitos</option>}
                        {isLoading && <option value="">Carregando...</option>}
                    </Select>
                    {errors.subGrupoDefeitosId && (
                        <Box mt={1} color="red.500" fontSize="sm">
                            {errors.subGrupoDefeitosId.join(', ')}
                        </Box>
                    )}
                </FormControl>

                <FormControl isInvalid={!!errors.grupoDefeitosEquipamentoId}>
                    <FormLabel>Grupo de Defeitos de Equipamento</FormLabel>
                    <Select
                        name="grupoDefeitosEquipamentoId"
                        value={formData.grupoDefeitosEquipamentoId?.toString() || ''}
                        onChange={(e) => handleChange('grupoDefeitosEquipamentoId', e.target.value)}
                    >
                        {grupoDefeitosEquipamento?.map((grupoDefeitosEquipamento) => (
                            <option key={grupoDefeitosEquipamento.id} value={grupoDefeitosEquipamento.id}>
                                {grupoDefeitosEquipamento.equipamento}
                            </option>
                        ))}
                    </Select>
                    {errors.grupoDefeitosEquipamentoId && (
                        <Box mt={1} color="red.500" fontSize="sm">
                            {errors.grupoDefeitosEquipamentoId.join(', ')}
                        </Box>
                    )}
                </FormControl>

                <Button
                    type="submit"
                    colorScheme="blue"
                    width="full"
                    isLoading={loading}
                >
                    {defeito ? 'Editar' : 'Criar'}
                </Button>
            </VStack>
        </Box>
    )
}