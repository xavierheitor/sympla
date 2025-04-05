'use client'

import { GrupoDeDefeito } from "@/lib/definitions/models/GrupoDeDefeito";
import { useEffect, useState } from "react";
import { Alert, AlertIcon, Box, Button, useToast, VStack } from "@chakra-ui/react";
import { editGrupoDeDefeito } from "@/lib/actions/grupoDeDefeito/editGrupoDeDefeito";
import { newGrupoDeDefeito } from "@/lib/actions/grupoDeDefeito/newGrupoDeDefeito";
import InputField from "@/lib/components/InputField";
import { ActionResult } from "@/lib/definitions/default/ActionResult";

interface GrupoDeDefeitoFormProps {
    grupoDeDefeito?: GrupoDeDefeito | null
    onSuccess: () => void
}

export default function GrupoDeDefeitoForm({ grupoDeDefeito, onSuccess }: GrupoDeDefeitoFormProps) {
    const toast = useToast();

    const [formData, setFormData] = useState<Partial<GrupoDeDefeito>>({
        nome: ''
    })

    const [errors, setErrors] = useState<Record<string, string[]>>({})
    const [loading, setLoading] = useState(false)
    const [serverError, setServerError] = useState<string | null>(null)

    useEffect(() => {
        if (grupoDeDefeito) {
            setFormData({
                id: grupoDeDefeito.id,
                nome: grupoDeDefeito.nome
            })
        }
    }, [grupoDeDefeito])

    const handleChange = (field: keyof GrupoDeDefeito, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
        setErrors(prev => ({ ...prev, [field]: [] }))
    }

    const handleSubmit = async () => {
        setLoading(true)
        setErrors({})
        setServerError(null)

        try {
            const form = new FormData();
            form.append('id', formData.id?.toString() ?? '')
            form.append('nome', formData.nome ?? '')

            const action = grupoDeDefeito ? editGrupoDeDefeito : newGrupoDeDefeito
            const result: ActionResult = await action({ success: true, message: 'Dummy' }, form)

            if (result.success) {
                toast({
                    title: result.message,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
                onSuccess()
                if (!grupoDeDefeito) setFormData({ nome: '' })
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
                    placeholder="Nome do grupo de defeito"
                    value={formData.nome || ''}
                    error={errors.nome}
                    onChange={(e) => handleChange('nome', e.target.value)}
                />

                <Button type="submit" isLoading={loading} colorScheme="blue">
                    {grupoDeDefeito ? 'Salvar' : 'Criar'}
                </Button>
            </VStack>
        </Box>
    )
}