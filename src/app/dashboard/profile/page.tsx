'use client'

import {
    Box,
    VStack,
    FormControl,
    FormLabel,
    Input,
    Button,
    Heading,
    Avatar,
    useToast,
    HStack,
} from '@chakra-ui/react'
import { useState } from 'react'

export default function ProfilePage() {
    const [name, setName] = useState('João Silva')
    const [email, setEmail] = useState('joao@exemplo.com')
    const [phone, setPhone] = useState('(11) 99999-9999')
    const toast = useToast()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        toast({
            title: 'Perfil atualizado!',
            status: 'success',
            duration: 3000,
            isClosable: true,
        })
    }

    return (
        <Box maxW="container.md" mx="auto">
            <Heading mb={8}>Meu Perfil</Heading>

            <Box bg="white" p={8} rounded="lg" shadow="base">
                <VStack spacing={6} align="stretch">
                    <HStack spacing={4}>
                        <Avatar size="xl" name={name} />
                        <Button variant="outline" size="sm">
                            Alterar Foto
                        </Button>
                    </HStack>

                    <form onSubmit={handleSubmit}>
                        <VStack spacing={4}>
                            <FormControl>
                                <FormLabel>Nome</FormLabel>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Seu nome"
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Email</FormLabel>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="seu@email.com"
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Telefone</FormLabel>
                                <Input
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="(00) 00000-0000"
                                />
                            </FormControl>

                            <Button type="submit" colorScheme="blue" width="full">
                                Salvar Alterações
                            </Button>
                        </VStack>
                    </form>
                </VStack>
            </Box>
        </Box>
    )
} 