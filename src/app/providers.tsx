// src/app/providers.tsx
'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from './theme'
import { SessionProvider } from 'next-auth/react'
export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <CacheProvider>
            <SessionProvider>

                <ChakraProvider theme={theme}>{children}</ChakraProvider>
            </SessionProvider>
        </CacheProvider>
    )
}