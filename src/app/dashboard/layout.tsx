'use client'

import {
    Box,
    Flex,
    VStack,
    HStack,
    Text,
    Icon,
    Link,
    useColorModeValue,
} from '@chakra-ui/react'
import { FiHome, FiUser, FiLogOut, FiBriefcase } from 'react-icons/fi'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const bgColor = useColorModeValue('white', 'gray.800')
    const borderColor = useColorModeValue('gray.200', 'gray.700')

    const menuItems = [
        { name: 'Dashboard', icon: FiHome, path: '/dashboard' },
        { name: 'Perfil', icon: FiUser, path: '/dashboard/profile' },
        { name: 'Empresas', icon: FiBriefcase, path: '/dashboard/empresa' },
        { name: 'Regionais', icon: FiBriefcase, path: '/dashboard/regional' },
        { name: 'Subestações', icon: FiBriefcase, path: '/dashboard/subestacao' },
        { name: 'Equipamentos', icon: FiBriefcase, path: '/dashboard/equipamento' },
        { name: 'Tipos de Manutenção', icon: FiBriefcase, path: '/dashboard/tipoManutencao' },
    ]

    return (
        <Flex h="100vh">
            {/* Sidebar */}
            <Box
                w="250px"
                bg={bgColor}
                borderRight="1px"
                borderColor={borderColor}
                py={5}
            >
                <VStack spacing={8} align="stretch">
                    <Box px={5}>
                        <Text fontSize="xl" fontWeight="bold">
                            Dashboard
                        </Text>
                    </Box>
                    <VStack spacing={1} align="stretch">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                as={NextLink}
                                href={item.path}
                                px={5}
                                py={3}
                                bg={pathname === item.path ? 'blue.50' : 'transparent'}
                                color={pathname === item.path ? 'blue.500' : 'gray.600'}
                                _hover={{
                                    bg: 'blue.50',
                                    color: 'blue.500',
                                }}
                            >
                                <HStack>
                                    <Icon as={item.icon} />
                                    <Text>{item.name}</Text>
                                </HStack>
                            </Link>
                        ))}
                    </VStack>
                    <Box px={5} mt="auto">
                        <Link
                            as={NextLink}
                            href='#'
                            onClick={() => signOut()}
                            px={5}
                            py={3}
                            display="flex"
                            alignItems="center"
                            color="red.500"
                            _hover={{
                                bg: 'red.50',
                            }}
                        >
                            <HStack>
                                <Icon as={FiLogOut} />
                                <Text>Sair</Text>
                            </HStack>
                        </Link>
                    </Box>
                </VStack>
            </Box>

            {/* Main Content */}
            <Box flex="1" p={8} overflowY="auto">
                {children}
            </Box>
        </Flex>
    )
}