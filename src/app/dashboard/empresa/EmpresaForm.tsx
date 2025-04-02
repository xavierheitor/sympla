// components/EmpresaForm.tsx
'use client'

import { Box, Button, VStack, Alert, AlertIcon, useToast } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { ActionResult } from '@/lib/definitions/default/ActionResult'
import { Empresa } from '@/lib/definitions/models/Empresa'
import { newEmpresa } from '@/lib/actions/empresa/newEmpresa'
import { editEmpresa } from '@/lib/actions/empresa/editEmpresa'
import InputField from '@/lib/components/InputField'

interface EmpresaFormProps {
    empresa?: Empresa | null
    onSuccess: () => void
}

export default function EmpresaForm({ empresa, onSuccess }: EmpresaFormProps) {
    const toast = useToast()

    const [formData, setFormData] = useState<Partial<Empresa>>({
        nome: '',
        cnpj: '',
    })
    const [errors, setErrors] = useState<Record<string, string[]>>({})
    const [loading, setLoading] = useState(false)
    const [serverError, setServerError] = useState<string | null>(null)

    useEffect(() => {
        if (empresa) {
            setFormData({
                id: empresa.id,
                nome: empresa.nome,
                cnpj: empresa.cnpj,
            })
        }
    }, [empresa])

    const handleChange = (field: keyof Empresa, value: string) => {
        setFormData({ ...formData, [field]: value })
        setErrors((prev) => ({ ...prev, [field]: [] }))
    }

    const handleSubmit = async () => {
        setLoading(true)
        setErrors({})
        setServerError(null)

        try {
            const form = new FormData()
            if (formData.id) form.append('id', formData.id.toString())
            // Observe que usamos "nome" para ficar consistente
            form.append('nome', formData.nome ?? '')
            form.append('cnpj', formData.cnpj ?? '')

            // Se houver empresa, chamamos editEmpresa; senão, newEmpresa.
            const action = empresa ? editEmpresa : newEmpresa
            const result: ActionResult = await action({ success: true, message: 'Dummy' }, form)

            if (result.success) {
                toast({
                    title: result.message,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
                onSuccess()
                if (!empresa) setFormData({ nome: '', cnpj: '' })
            } else {

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
                    placeholder="Nome da empresa"
                    value={formData.nome || ''}
                    error={errors.nome}
                    type="text"
                    onChange={(e) => handleChange('nome', e.target.value)}
                />

                <InputField
                    label="CNPJ"
                    name="cnpj"
                    placeholder="00.000.000/0000-00"
                    value={formData.cnpj || ''}
                    error={errors.cnpj}
                    onChange={(e) => handleChange('cnpj', e.target.value)}
                />

                <Button colorScheme="blue" type="submit" isLoading={loading} loadingText="Salvando...">
                    {empresa ? 'Atualizar Empresa' : 'Criar Empresa'}
                </Button>
            </VStack>
        </Box>
    )
}