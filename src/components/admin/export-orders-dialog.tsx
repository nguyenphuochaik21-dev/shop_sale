'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Download, FileSpreadsheet, FileText } from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'

interface OrderItem {
  id: string
  productName: string
  quantity: number
  price: number
  total: number
}

interface Order {
  id: string
  orderNumber: string
  status: string
  total: number
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: string
  shippingCity: string
  createdAt: string
  items: OrderItem[]
}

interface ExportOrdersDialogProps {
  open: boolean
  onClose: () => void
  orders: Order[]
}

export function ExportOrdersDialog({ open, onClose, orders }: ExportOrdersDialogProps) {
  const [period, setPeriod] = useState<string>('all')
  const [format, setFormat] = useState<'excel' | 'pdf'>('excel')
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)

    try {
      if (format === 'excel') {
        await exportToExcel(orders)
      } else {
        await exportToPDF(orders)
      }
    } catch (error) {
      console.error('Export error:', error)
    } finally {
      setIsExporting(false)
      onClose()
    }
  }

  const exportToExcel = async (orders: Order[]) => {
    const ExcelJS = (await import('exceljs')).default
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Đơn hàng')

    worksheet.columns = [
      { header: 'Mã đơn', key: 'orderNumber', width: 20 },
      { header: 'Khách hàng', key: 'customerName', width: 25 },
      { header: 'Email', key: 'customerEmail', width: 30 },
      { header: 'Điện thoại', key: 'customerPhone', width: 15 },
      { header: 'Địa chỉ', key: 'shippingAddress', width: 40 },
      { header: 'Thành phố', key: 'shippingCity', width: 20 },
      { header: 'Tổng tiền', key: 'total', width: 15 },
      { header: 'Trạng thái', key: 'status', width: 15 },
      { header: 'Ngày đặt', key: 'createdAt', width: 15 },
    ]

    orders.forEach(order => {
      worksheet.addRow({
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        shippingAddress: order.shippingAddress,
        shippingCity: order.shippingCity,
        total: formatPrice(order.total),
        status: order.status,
        createdAt: formatDate(order.createdAt),
      })
    })

    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `orders-${new Date().toISOString().split('T')[0]}.xlsx`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const exportToPDF = async (orders: Order[]) => {
    const { jsPDF } = await import('jspdf')
    const { default: autoTable } = await import('jspdf-autotable')

    const doc = new jsPDF()

    doc.setFontSize(20)
    doc.text('Bao Cao Don Hang', 14, 22)

    doc.setFontSize(10)
    doc.text(`Ngay xuat: ${formatDate(new Date())}`, 14, 30)
    doc.text(`Tong don: ${orders.length}`, 14, 36)

    const tableData = orders.map(order => [
      order.orderNumber,
      order.customerName,
      order.customerPhone,
      formatPrice(order.total),
      order.status,
      formatDate(order.createdAt),
    ])

    autoTable(doc, {
      head: [['Ma don', 'Khach hang', 'Dien thoai', 'Tong tien', 'Trang thai', 'Ngay dat']],
      body: tableData,
      startY: 45,
    })

    doc.save(`orders-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Xuất báo cáo đơn hàng</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Thời gian</Label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="today">Hôm nay</SelectItem>
                <SelectItem value="week">7 ngày qua</SelectItem>
                <SelectItem value="month">30 ngày qua</SelectItem>
                <SelectItem value="year">Năm nay</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Định dạng</Label>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={format === 'excel' ? 'default' : 'outline'}
                onClick={() => setFormat('excel')}
                className="h-20 flex flex-col gap-2"
              >
                <FileSpreadsheet className="h-6 w-6" />
                <span className="text-sm">Excel</span>
              </Button>
              <Button
                variant={format === 'pdf' ? 'default' : 'outline'}
                onClick={() => setFormat('pdf')}
                className="h-20 flex flex-col gap-2"
              >
                <FileText className="h-6 w-6" />
                <span className="text-sm">PDF</span>
              </Button>
            </div>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>{orders.length}</strong> đơn hàng sẽ được xuất
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            <Download className="mr-2 h-4 w-4" />
            {isExporting ? 'Đang xuất...' : 'Xuất báo cáo'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
