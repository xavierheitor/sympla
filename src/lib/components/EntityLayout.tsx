// components/EntityLayout.tsx
import { Box, Heading, Spinner, Text } from '@chakra-ui/react'
import { ReactNode } from 'react'

interface Props {
    title: string
    children: ReactNode
    isLoading?: boolean
    error?: Error
}

export default function EntityLayout({ title, children, isLoading, error }: Props) {
    return (
        <Box>
            <Heading mb={4}>{title}</Heading>
            <Box bg="white" p={6} rounded="lg" shadow="base">
                {isLoading ? (
                    <Box textAlign="center" my={10}>
                        <Spinner size="xl" />
                    </Box>
                ) : error ? (
                    <Box textAlign="center" my={10}>
                        <Text color="red.500">{error.message}</Text>
                    </Box>
                ) : (
                    children
                )}
            </Box>
        </Box>
    )
}