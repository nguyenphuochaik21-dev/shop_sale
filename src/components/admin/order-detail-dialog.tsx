'use client'

import { formatPrice, formatDate, getOrderStatusLabel, getOrderStatusColor } from '@/lib/utils'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Printer, Download } from 'lucide-react'
import Image from 'next/image'

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
  notes: string | null
  createdAt: string
  items: OrderItem[]
}

interface OrderDetailDialogProps {
  order: Order | null
  onClose: () => void
  onStatusChange: (orderId: string, status: string) => void
}

export function OrderDetailDialog({ order, onClose, onStatusChange }: OrderDetailDialogProps) {
  if (!order) return null

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Hóa đơn #${order.orderNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              table { width: 100%; border-collapse: collapse; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background: #f5f5f5; }
              .total { font-weight: bold; font-size: 18px; }
            </style>
          </head>
          <body>
            <h1>Hóa đơn #${order.orderNumber}</h1>
            <p><strong>Khách hàng:</strong> ${order.customerName}</p>
            <p><strong>Email:</strong> ${order.customerEmail}</p>
            <p><strong>Điện thoại:</strong> ${order.customerPhone}</p>
            <p><strong>Địa chỉ:</strong> ${order.shippingAddress}, ${order.shippingCity}</p>
            <p><strong>Ngày đặt:</strong> ${formatDate(order.createdAt)}</p>
            <hr />
            <table>
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Đơn giá</th>
                  <th>Tổng</th>
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
              <p>Tạm tính: ${formatPrice(order.subtotal)}</p>
              <p>Phí vận chuyển: ${formatPrice(order.shippingFee)}</p>
              <p class="total">Tổng cộng: ${formatPrice(order.total)}</p>
            </div>
            <script>window.print();</script>
          </body>
        </html>
      `)
    }
  }

  return (
    <Dialog open={!!order} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Chi tiết đơn hàng #{order.orderNumber}</span>
            <Badge className={getOrderStatusColor(order.status)}>
              {getOrderStatusLabel(order.status)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Thông tin khách hàng</h3>
              <div className="text-sm space-y-1">
                <p><strong>Tên:</strong> {order.customerName}</p>
                <p><strong>Email:</strong> {order.customerEmail}</p>
                <p><strong>Điện thoại:</strong> {order.customerPhone}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Địa chỉ giao hàng</h3>
              <div className="text-sm">
                <p>{order.shippingAddress}</p>
                <p>{order.shippingCity}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Items */}
          <div>
            <h3 className="font-semibold mb-3">Sản phẩm</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
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
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(item.total)}</p>
                    <p className="text-sm text-muted-foreground">{formatPrice(item.price)} / cái</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Tạm tính</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển</span>
                <span>{formatPrice(order.shippingFee)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Giảm giá</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Tổng cộng</span>
                <span className="text-primary">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div>
              <h3 className="font-semibold mb-2">Ghi chú</h3>
              <p className="text-sm text-muted-foreground">{order.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex gap-2">
              {order.status === 'PENDING' && (
                <Button onClick={() => onStatusChange(order.id, 'CONFIRMED')}>
                  Xác nhận đơn hàng
                </Button>
              )}
              {order.status === 'CONFIRMED' && (
                <Button onClick={() => onStatusChange(order.id, 'PACKING')}>
                  Bắt đầu đóng gói
                </Button>
              )}
              {order.status === 'PACKING' && (
                <Button onClick={() => onStatusChange(order.id, 'SHIPPING')}>
                  Giao hàng
                </Button>
              )}
              {order.status === 'SHIPPING' && (
                <Button onClick={() => onStatusChange(order.id, 'COMPLETED')}>
                  Hoàn thành
                </Button>
              )}
            </div>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              In hóa đơn
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
