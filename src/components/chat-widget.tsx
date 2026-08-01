'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Facebook, Zap, Send, Phone, Mail, MessageCircle } from 'lucide-react'

const chatOptions = [
  {
    icon: MessageCircle,
    label: 'Messenger',
    href: 'https://m.me/yourpage',
    color: 'bg-blue-500 hover:bg-blue-600',
  },
  {
    icon: Facebook,
    label: 'Facebook',
    href: 'https://facebook.com/yourpage',
    color: 'bg-blue-600 hover:bg-blue-700',
  },
  {
    icon: Zap,
    label: 'Zalo',
    href: 'https://zalo.me/yourzalo',
    color: 'bg-blue-400 hover:bg-blue-500',
  },
  {
    icon: Send,
    label: 'Telegram',
    href: 'https://t.me/yourtelegram',
    color: 'bg-sky-500 hover:bg-sky-600',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    href: 'https://wa.me/yourphone',
    color: 'bg-green-500 hover:bg-green-600',
  },
  {
    icon: Mail,
    label: 'Gmail',
    href: 'mailto:contact@websale.com',
    color: 'bg-red-500 hover:bg-red-600',
  },
  {
    icon: Phone,
    label: 'Gọi điện',
    href: 'tel:0912345678',
    color: 'bg-green-600 hover:bg-green-700',
  },
]

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Options */}
      <div
        className={`absolute bottom-16 right-0 mb-2 transition-all duration-300 ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <Card className="w-64 shadow-xl">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Liên hệ với chúng tôi</h3>
            <div className="space-y-2">
              {chatOptions.map((option) => (
                <a
                  key={option.label}
                  href={option.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 p-2 rounded-lg text-white transition-colors ${option.color}`}
                >
                  <option.icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{option.label}</span>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toggle Button */}
      <Button
        size="icon"
        className={`h-14 w-14 rounded-full shadow-lg transition-all duration-300 ${
          isOpen ? 'rotate-0 bg-muted-foreground' : 'animate-pulse-once'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <span className="text-2xl">×</span>
        ) : (
          <MessageCircle className="h-7 w-7" />
        )}
      </Button>

      {/* Animation Ring */}
      {!isOpen && (
        <div className="absolute inset-0 h-14 w-14 rounded-full border-2 border-primary/30 animate-ping" />
      )}
    </div>
  )
}
