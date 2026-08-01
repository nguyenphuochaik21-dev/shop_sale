'use client'

import { useState, useEffect } from 'react'
import { formatPrice, formatDate } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, FileText, Download } from 'lucide-react'

interface Invoice {
  id: string
  invoiceNumber: string
  orderId: string
  issuedAt: string
  paidAt: string | null
  order: {
    orderNumber: string
    total: number
    customerName: string
  }
}

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/admin/invoices')
      if (response.ok) {
        const data = await response.json()
        setInvoices(data)
      }
    } catch (error) {
      console.error('Error fetching invoices:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredInvoices = invoices.filter((invoice) =>
    invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDownload = async (invoice: Invoice) => {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF()

    doc.setFontSize(20)
    doc.text('HOA DON', 14, 22)

    doc.setFontSize(12)
    doc.text(`So: ${invoice.invoiceNumber}`, 14, 35)
    doc.text(`Ngay: ${formatDate(invoice.issuedAt)}`, 14, 42)
    doc.text(`Ma don hang: ${invoice.order.orderNumber}`, 14, 49)

    doc.text('Khach hang:', 14, 65)
    doc.text(invoice.order.customerName, 14, 72)

    doc.text('Tong tien:', 14, 90)
    doc.setFontSize(16)
    doc.text(formatPrice(invoice.order.total), 14, 98)

    if (invoice.paidAt) {
      doc.setFontSize(10)
      doc.text(`Da thanh toan ngay: ${formatDate(invoice.paidAt)}`, 14, 110)
    }

    doc.save(`invoice-${invoice.invoiceNumber}.pdf`)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Hóa đơn</h1>
        <p className="text-muted-foreground">Quản lý hóa đơn và xuất file</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm hóa đơn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Số hóa đơn</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Đơn hàng</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Khách hàng</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Tổng tiền</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Ngày xuất</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Trạng thái</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b">
                    <td className="px-4 py-3 text-sm font-medium">
                      #{invoice.invoiceNumber}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      #{invoice.order.orderNumber}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {invoice.order.customerName}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">
                      {formatPrice(invoice.order.total)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {formatDate(invoice.issuedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={invoice.paidAt ? 'default' : 'secondary'}>
                        {invoice.paidAt ? 'Đã thanh toán' : 'Chưa thanh toán'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDownload(invoice)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredInvoices.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Không tìm thấy hóa đơn nào</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
