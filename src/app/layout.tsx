// app/layout.tsx
import type { Metadata } from 'next'
import { fonts } from './fonts'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Dashboard com Chakra UI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={fonts.rubik.variable}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}