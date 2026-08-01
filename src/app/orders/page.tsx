'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { prisma } from '@/lib/prisma'
import { formatPrice, formatDate, getOrderStatusLabel, getOrderStatusColor } from '@/lib/utils'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Package, ChevronRight, Clock } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface OrderItem {
  id: string
  productName: string
  productImage: string
  quantity: number
  price: number
  total: number
}

interface StatusHistory {
  status: string
  createdAt: Date
  note: string | null
}

interface Order {
  id: string
  orderNumber: string
  status: string
  total: number
  createdAt: Date
  items: OrderItem[]
  statusHistory: StatusHistory[]
}

const ORDER_STEPS = [
  { key: 'PENDING', label: 'Đặt hàng' },
  { key: 'CONFIRMED', label: 'Xác nhận' },
  { key: 'PACKING', label: 'Đóng gói' },
  { key: 'SHIPPING', label: 'Đang giao' },
  { key: 'COMPLETED', label: 'Hoàn thành' },
]

function OrderTimeline({ status, history }: { status: string; history: StatusHistory[] }) {
  const currentIndex = ORDER_STEPS.findIndex((s) => s.key === status)
  const isCancelled = status === 'CANCELLED'

  if (isCancelled) {
    return (
      <div className="flex items-center gap-2 text-destructive">
        <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center">
          <span className="text-xs font-bold">X</span>
        </div>
        <span className="font-medium">Đơn hàng đã bị hủy</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      {ORDER_STEPS.map((step, index) => {
        const isCompleted = index <= currentIndex
        const isCurrent = index === currentIndex
        const historyItem = history.find((h) => h.status === step.key)

        return (
          <div key={step.key} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  isCompleted
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {isCompleted ? '✓' : index + 1}
              </div>
              <span
                className={`text-xs mt-1 whitespace-nowrap ${
                  isCurrent ? 'font-medium text-primary' : 'text-muted-foreground'
                }`}
              >
                {step.label}
              </span>
              {historyItem && (
                <span className="text-xs text-muted-foreground">
                  {formatDate(historyItem.createdAt)}
                </span>
              )}
            </div>
            {index < ORDER_STEPS.length - 1 && (
              <div
                className={`h-0.5 w-8 mx-1 ${
                  index < currentIndex ? 'bg-primary' : 'bg-muted'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function OrdersPage() {
  const { data: session, status } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'authenticated') {
      fetchOrders()
    } else if (status === 'unauthenticated') {
      setIsLoading(false)
    }
  }, [status])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4">
            <Skeleton className="h-10 w-48 mb-8" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-48" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-muted flex items-center justify-center">
              <Package className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Vui lòng đăng nhập</h1>
            <p className="text-muted-foreground mb-8">
              Bạn cần đăng nhập để xem đơn hàng của mình
            </p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-8">Đơn hàng của tôi</h1>

          {orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Đơn hàng #{order.orderNumber}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Ngày đặt: {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <Badge className={getOrderStatusColor(order.status)}>
                      {getOrderStatusLabel(order.status)}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <OrderTimeline status={order.status} history={order.statusHistory} />
                    <div className="border-t pt-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex gap-4 py-2">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white shrink-0">
                            <Image
                              src={item.productImage || '/placeholder.png'}
                              alt={item.productName}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{item.productName}</p>
                            <p className="text-sm text-muted-foreground">x{item.quantity}</p>
                          </div>
                          <p className="font-medium">{formatPrice(item.total)}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {order.statusHistory[0]?.note || 'Đơn hàng đang xử lý'}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-lg">
                          Tổng: <span className="text-primary">{formatPrice(order.total)}</span>
                        </span>
                        <Link href={`/orders/${order.id}`}>
                          <Badge variant="outline" className="cursor-pointer">
                            Chi tiết
                            <ChevronRight className="ml-1 h-3 w-3" />
                          </Badge>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                <Package className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-bold mb-2">Chưa có đơn hàng nào</h2>
              <p className="text-muted-foreground mb-8">
                Bắt đầu mua sắm để tạo đơn hàng đầu tiên
              </p>
              <Link href="/products">
                <Badge variant="outline" className="cursor-pointer">
                  Xem sản phẩm
                </Badge>
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
