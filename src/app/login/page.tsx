'use client'

import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack,
    Heading,
    Container,
    useToast,
} from '@chakra-ui/react';
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPage() {

    const { data: session } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);

    const toast = useToast();

    useEffect(() => {
        if (session) {
            router.push('/dashboard');
        }
    }, [session, router]);

    const onFinish = async (values: { username: string, password: string }) => {
        setLoading(true);

        try {
            const res = await signIn('credentials', {
                username: values.username,
                password: values.password,
                redirect: false,
            });

            setLoading(false);

            if (res?.error) {
                toast({
                    title: 'Erro ao fazer login',
                    description: `Erro ao fazer login: ${res.error}`,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
            } else {
                router.push('/dashboard');
            }
        } catch (error) {
            setLoading(false);
            toast({
                title: 'Erro ao fazer login',
                description: `Erro ao fazer login: ${error}`,
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        }
    }


    return (
        <Container maxW="container.sm" py={10}>
            <Box p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
                <VStack spacing={4} align="stretch">
                    <Heading textAlign="center">Login</Heading>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        onFinish({
                            username: formData.get('username') as string,
                            password: formData.get('password') as string
                        });
                    }}>
                        <VStack spacing={4}>
                            <FormControl isRequired>
                                <FormLabel>Email</FormLabel>
                                <Input
                                    type="text"
                                    name='username'
                                    placeholder='Digite seu usuário'
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Senha</FormLabel>
                                <Input
                                    type="password"
                                    name='password'
                                    placeholder='Digite sua senha'
                                />
                            </FormControl>
                            <Button type="submit" colorScheme="blue" width="full" isLoading={loading}>
                                Entrar
                            </Button>
                        </VStack>
                    </form>
                </VStack>
            </Box>
        </Container>
    )
}