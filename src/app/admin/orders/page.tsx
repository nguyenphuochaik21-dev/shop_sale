'use client'

import { useState, useEffect } from 'react'
import { formatPrice, formatDate, getOrderStatusLabel, getOrderStatusColor } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, Eye, FileDown, Printer, MoreHorizontal, CheckCircle } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { OrderDetailDialog } from '@/components/admin/order-detail-dialog'
import { ExportOrdersDialog } from '@/components/admin/export-orders-dialog'
import Link from 'next/link'

interface OrderItem {
  id: string
  productName: string
  productImage: string
  quantity: number
  price: number
  total: number
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
  createdAt: string
  items: OrderItem[]
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showExportDialog, setShowExportDialog] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders')
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

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        fetchOrders()
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý đơn hàng</h1>
          <p className="text-muted-foreground">Xem và cập nhật trạng thái đơn hàng</p>
        </div>
        <Button onClick={() => setShowExportDialog(true)}>
          <FileDown className="mr-2 h-4 w-4" />
          Xuất báo cáo
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm đơn hàng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="PENDING">Chờ xác nhận</SelectItem>
                <SelectItem value="CONFIRMED">Đã xác nhận</SelectItem>
                <SelectItem value="PACKING">Đang đóng gói</SelectItem>
                <SelectItem value="SHIPPING">Đang giao</SelectItem>
                <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
                <SelectItem value="CANCELLED">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Mã đơn</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Khách hàng</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Ngày đặt</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Tổng tiền</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Trạng thái</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b">
                    <td className="px-4 py-3 text-sm font-medium">#{order.orderNumber}</td>
                    <td className="px-4 py-3 text-sm">
                      <div>
                        <p>{order.customerName}</p>
                        <p className="text-xs text-muted-foreground">{order.customerPhone}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-3 text-sm font-medium">{formatPrice(order.total)}</td>
                    <td className="px-4 py-3">
                      <Badge className={getOrderStatusColor(order.status)}>
                        {getOrderStatusLabel(order.status)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {order.status === 'PENDING' && (
                              <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'CONFIRMED')}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Xác nhận đơn hàng
                              </DropdownMenuItem>
                            )}
                            {order.status === 'CONFIRMED' && (
                              <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'PACKING')}>
                                Xác nhận đóng gói
                              </DropdownMenuItem>
                            )}
                            {order.status === 'PACKING' && (
                              <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'SHIPPING')}>
                                Xác nhận giao hàng
                              </DropdownMenuItem>
                            )}
                            {order.status === 'SHIPPING' && (
                              <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'COMPLETED')}>
                                Xác nhận hoàn thành
                              </DropdownMenuItem>
                            )}
                            {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(order.id, 'CANCELLED')}
                                className="text-destructive"
                              >
                                Hủy đơn hàng
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Không tìm thấy đơn hàng nào</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <OrderDetailDialog
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onStatusChange={handleStatusChange}
      />

      {/* Export Dialog */}
      <ExportOrdersDialog
        open={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        orders={filteredOrders}
      />
    </div>
  )
}
