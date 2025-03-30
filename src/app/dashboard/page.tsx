'use client'

import {
    Box,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow,
    Heading,
    Text,
} from '@chakra-ui/react'

export default function DashboardPage() {
    return (
        <Box>
            <Heading mb={8}>Dashboard</Heading>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
                <Stat
                    px={4}
                    py={5}
                    bg="white"
                    shadow="base"
                    rounded="lg"
                >
                    <StatLabel>Total de Vendas</StatLabel>
                    <StatNumber>R$ 45.670</StatNumber>
                    <StatHelpText>
                        <StatArrow type="increase" />
                        23.36%
                    </StatHelpText>
                </Stat>

                <Stat
                    px={4}
                    py={5}
                    bg="white"
                    shadow="base"
                    rounded="lg"
                >
                    <StatLabel>Novos Clientes</StatLabel>
                    <StatNumber>2.100</StatNumber>
                    <StatHelpText>
                        <StatArrow type="increase" />
                        9.05%
                    </StatHelpText>
                </Stat>

                <Stat
                    px={4}
                    py={5}
                    bg="white"
                    shadow="base"
                    rounded="lg"
                >
                    <StatLabel>Taxa de Conversão</StatLabel>
                    <StatNumber>45.2%</StatNumber>
                    <StatHelpText>
                        <StatArrow type="decrease" />
                        2.36%
                    </StatHelpText>
                </Stat>

                <Stat
                    px={4}
                    py={5}
                    bg="white"
                    shadow="base"
                    rounded="lg"
                >
                    <StatLabel>Ticket Médio</StatLabel>
                    <StatNumber>R$ 245</StatNumber>
                    <StatHelpText>
                        <StatArrow type="increase" />
                        12.05%
                    </StatHelpText>
                </Stat>
            </SimpleGrid>

            <Box mt={8}>
                <Heading size="md" mb={4}>Atividade Recente</Heading>
                <Box bg="white" p={6} rounded="lg" shadow="base">
                    <Text>Nenhuma atividade recente para exibir.</Text>
                </Box>
            </Box>
        </Box>
    )
} 