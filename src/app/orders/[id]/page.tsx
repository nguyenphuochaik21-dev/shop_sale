'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import { formatPrice, formatDate, getOrderStatusLabel, getOrderStatusColor } from '@/lib/utils'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, Printer } from 'lucide-react'
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
  createdAt: string
  note: string | null
}

interface Order {
  id: string
  orderNumber: string
  status: string
  total: number
  subtotal: number
  shippingFee: number
  discount: number
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: string
  shippingCity: string
  notes: string | null
  createdAt: string
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

export default function OrderDetailPage() {
  const params = useParams()
  const { data: session } = useSession()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchOrder = useCallback(async () => {
    try {
      const response = await fetch(`/api/orders/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setOrder(data)
      }
    } catch (error) {
      console.error('Error fetching order:', error)
    } finally {
      setIsLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    if (session) {
      fetchOrder()
    }
  }, [session, fetchOrder])

  const handlePrint = () => {
    if (!order) return
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Hóa đơn #${order.orderNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background: #f5f5f5; }
            </style>
          </head>
          <body>
            <h1>Don hang #${order.orderNumber}</h1>
            <p><strong>Khach hang:</strong> ${order.customerName}</p>
            <p><strong>Email:</strong> ${order.customerEmail}</p>
            <p><strong>Dien thoai:</strong> ${order.customerPhone}</p>
            <p><strong>Dia chi:</strong> ${order.shippingAddress}, ${order.shippingCity}</p>
            <p><strong>Ngay dat:</strong> ${formatDate(order.createdAt)}</p>
            <table>
              <thead>
                <tr>
                  <th>San pham</th>
                  <th>So luong</th>
                  <th>Don gia</th>
                  <th>Tong</th>
                </tr>
              </thead>
              <tbody>
                ${order.items.map(item => `
                  <tr>
                    <td>${item.productName}</td>
                    <td>${item.quantity}</td>
                    <td>${formatPrice(item.price)}</td>
                    <td>${formatPrice(item.total)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div style="margin-top: 20px; text-align: right;">
              <p>Tam tinh: ${formatPrice(order.subtotal)}</p>
              <p>Phi van chuyen: ${formatPrice(order.shippingFee)}</p>
              <p style="font-size: 18px; font-weight: bold;">Tong: ${formatPrice(order.total)}</p>
            </div>
            <script>window.print();</script>
          </body>
        </html>
      `)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4">
            <Skeleton className="h-10 w-48 mb-8" />
            <Skeleton className="h-64 w-full" />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Không tìm thấy đơn hàng</h1>
            <Button asChild>
              <Link href="/orders">Quay lại</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const currentIndex = ORDER_STEPS.findIndex((s) => s.key === order.status)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/orders">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Link>
          </Button>

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Đơn hàng #{order.orderNumber}</h1>
              <p className="text-muted-foreground">Ngày đặt: {formatDate(order.createdAt)}</p>
            </div>
            <Badge className={`text-lg px-4 py-1 ${getOrderStatusColor(order.status)}`}>
              {getOrderStatusLabel(order.status)}
            </Badge>
          </div>

          {/* Timeline */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {ORDER_STEPS.map((step, index) => {
                  const isCompleted = index <= currentIndex
                  const isCurrent = index === currentIndex

                  return (
                    <div key={step.key} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                            isCompleted
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {isCompleted ? '✓' : index + 1}
                        </div>
                        <span
                          className={`text-sm mt-2 whitespace-nowrap ${
                            isCurrent ? 'font-medium text-primary' : 'text-muted-foreground'
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                      {index < ORDER_STEPS.length - 1 && (
                        <div
                          className={`h-0.5 w-12 mx-2 ${
                            index < currentIndex ? 'bg-primary' : 'bg-muted'
                          }`}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Sản phẩm đã đặt</span>
                    <Button variant="outline" size="sm" onClick={handlePrint}>
                      <Printer className="mr-2 h-4 w-4" />
                      In
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-white shrink-0">
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
                      <div className="text-right">
                        <p className="font-medium">{formatPrice(item.total)}</p>
                        <p className="text-sm text-muted-foreground">{formatPrice(item.price)} / cái</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Shipping Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin giao hàng</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Người nhận</p>
                      <p className="font-medium">{order.customerName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Số điện thoại</p>
                      <p className="font-medium">{order.customerPhone}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground mb-1">Địa chỉ giao hàng</p>
                      <p className="font-medium">{order.shippingAddress}</p>
                      <p className="font-medium">{order.shippingCity}</p>
                    </div>
                    {order.notes && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-muted-foreground mb-1">Ghi chú</p>
                        <p>{order.notes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Summary */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Tổng cộng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tạm tính</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Phí vận chuyển</span>
                    <span>{formatPrice(order.shippingFee)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Giảm giá</span>
                      <span>-{formatPrice(order.discount)}</span>
                    </div>
                  )}
                  <div className="border-t pt-3 flex justify-between font-bold text-lg">
                    <span>Tổng cộng</span>
                    <span className="text-primary">{formatPrice(order.total)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
