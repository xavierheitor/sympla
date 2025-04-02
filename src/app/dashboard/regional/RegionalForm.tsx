'use client'

import { fetchEmpresas } from '@/lib/actions/empresa/fetchEmpresas'
import { editRegional } from '@/lib/actions/regional/editRegional'
import { newRegional } from '@/lib/actions/regional/newRegional'
import InputField from '@/lib/components/InputField'
import { ActionResult } from '@/lib/definitions/default/ActionResult'
import { Empresa } from '@/lib/definitions/models/Empresa'
import { Regional } from '@/lib/definitions/models/Regional'
import {
    Box,
    Button,
    VStack,
    Alert,
    AlertIcon,
    useToast,
    FormControl,
    FormLabel,
    Select
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

interface RegionalFormProps {
    regional?: Regional | null
    onSuccess: () => void
}

export default function RegionalForm({ regional, onSuccess }: RegionalFormProps) {
    const toast = useToast()

    const [formData, setFormData] = useState<Partial<Regional>>({
        nome: '',
        empresaId: 0,
    })
    const [errors, setErrors] = useState<Record<string, string[]>>({})
    const [loading, setLoading] = useState(false)
    const [serverError, setServerError] = useState<string | null>(null)

    const { data: empresas, error, isLoading } = useSWR<Empresa[]>('/api/empresas', fetchEmpresas)

    useEffect(() => {
        if (regional) {
            setFormData({
                id: regional.id,
                nome: regional.nome,
                empresaId: regional.empresaId,
            })
        }
    }, [regional])

    const handleChange = (field: keyof Regional, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: field === 'empresaId' ? Number(value) : value
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
            form.append('empresaId', formData.empresaId?.toString() ?? '')

            const action = regional ? editRegional : newRegional
            const result: ActionResult = await action({ success: true, message: 'Dummy' }, form)

            if (result.success) {
                toast({
                    title: result.message,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
                onSuccess()
                if (!regional) setFormData({ nome: '', empresaId: 0 })
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
                    placeholder="Nome da regional"
                    value={formData.nome || ''}
                    error={errors.nome}
                    onChange={(e) => handleChange('nome', e.target.value)}
                />

                <FormControl isInvalid={!!errors.empresaId}>
                    <FormLabel>Empresa</FormLabel>
                    <Select
                        placeholder="Selecione uma empresa"
                        value={formData.empresaId?.toString() || ''}
                        onChange={(e) => handleChange('empresaId', e.target.value)}
                    >
                        {empresas?.map((empresa) => (
                            <option key={empresa.id} value={empresa.id}>
                                {empresa.nome}
                            </option>
                        ))}
                        {error && <option value="">Erro ao carregar empresas</option>}
                        {isLoading && <option value="">Carregando...</option>}
                    </Select>
                    {errors.empresaId && (
                        <Box mt={1} color="red.500" fontSize="sm">
                            {errors.empresaId.join(', ')}
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
                    {regional ? 'Atualizar Regional' : 'Criar Regional'}
                </Button>
            </VStack>
        </Box>
    )
}