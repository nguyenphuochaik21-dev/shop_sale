'use client'

import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ChatWidget } from '@/components/chat-widget'

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <ChatWidget />
    </>
  )
}
