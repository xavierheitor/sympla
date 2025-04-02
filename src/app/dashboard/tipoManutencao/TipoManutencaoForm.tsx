'use client'

import { newTipoManutencao } from '@/lib/actions/tipoManutencao/newTipoManutencao'
import { editTipoManutencao } from '@/lib/actions/tipoManutencao/editTipoManutencao'
import { Alert, AlertIcon, Box, Button, useToast, VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { TipoManutencao } from '@/lib/definitions/models/TipoManutencao'
import { ActionResult } from '@/lib/definitions/default/ActionResult'
import InputField from '@/lib/components/InputField'



interface TipoManutencaoFormProps {
    tipoManutencao?: TipoManutencao | null
    onSuccess: () => void
}


export default function TipoManutencaoForm({ tipoManutencao, onSuccess }: TipoManutencaoFormProps) {
    const toast = useToast()

    const [formData, setFormData] = useState<Partial<TipoManutencao>>({
        nome: '',
    })
    const [errors, setErrors] = useState<Record<string, string[]>>({})
    const [loading, setLoading] = useState(false)
    const [serverError, setServerError] = useState<string | null>(null)

    useEffect(() => {
        if (tipoManutencao) {
            setFormData({
                id: tipoManutencao.id,
                nome: tipoManutencao.nome,
            })
        }
    }, [tipoManutencao])

    const handleChange = (field: keyof TipoManutencao, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleSubmit = async () => {
        setLoading(true)
        setErrors({})
        setServerError(null)

        try {
            const form = new FormData()
            if (formData.id) form.append('id', formData.id.toString())
            form.append('nome', formData.nome ?? '')

            const action = tipoManutencao ? editTipoManutencao : newTipoManutencao
            const result: ActionResult = await action({ success: true, message: 'Dummy' }, form)

            if (result.success) {
                toast({
                    title: result.message,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
                onSuccess()
            } else {
                setErrors(result.errors || {})
                setServerError(result.message || 'Erro ao processar ação')
            }
        } catch (error) {
            console.error(error)
            setServerError('Erro ao processar ação')
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
                    placeholder="Nome do tipo de manutenção"
                    value={formData.nome || ''}
                    error={errors.nome}
                    onChange={(e) => handleChange('nome', e.target.value)}
                />

                <Button type="submit" isLoading={loading} colorScheme="blue">
                    {tipoManutencao ? 'Editar' : 'Criar'}
                </Button>
            </VStack>
        </Box>
    )
}