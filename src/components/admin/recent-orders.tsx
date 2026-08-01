'use client'

import { formatPrice, formatDate, getOrderStatusLabel, getOrderStatusColor } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface OrderItem {
  productName: string
  quantity: number
}

interface Order {
  id: string
  orderNumber: string
  status: string
  total: string | number
  createdAt: Date
  items: OrderItem[]
}

export function RecentOrders({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        Chưa có đơn hàng nào
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">#{order.orderNumber}</p>
            <div className="flex items-center gap-2">
              <Badge className={`text-xs ${getOrderStatusColor(order.status)}`}>
                {getOrderStatusLabel(order.status)}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatDate(order.createdAt)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-medium">{formatPrice(Number(order.total))}</span>
            <Link href={`/admin/orders/${order.id}`}>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
