import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/components/theme-provider'
import { Providers } from '@/components/layout/providers'

const inter = Inter({ subsets: ['latin', 'vietnamese'] })

export const metadata: Metadata = {
  title: 'Web Sale - Cửa hàng trực tuyến',
  description: 'Mua sắm trực tuyến với giá tốt nhất',
  keywords: ['mua sắm', 'thương mại điện tử', 'cửa hàng online'],
  authors: [{ name: 'Web Sale' }],
  openGraph: {
    title: 'Web Sale - Cửa hàng trực tuyến',
    description: 'Mua sắm trực tuyến với giá tốt nhất',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            {children}
          </Providers>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
