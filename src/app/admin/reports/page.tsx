'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SalesChart } from '@/components/admin/sales-chart'
import { formatPrice } from '@/lib/utils'
import { Download, FileSpreadsheet, FileText } from 'lucide-react'
import { Label } from '@/components/ui/label'

export default function AdminReportsPage() {
  const [period, setPeriod] = useState<string>('month')
  const [reportType, setReportType] = useState<'sales' | 'orders' | 'products'>('sales')

  const handleExport = async (format: 'excel' | 'pdf') => {
    if (format === 'excel') {
      const ExcelJS = (await import('exceljs')).default
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Báo cáo')

      worksheet.columns = [
        { header: 'Ngày', key: 'date', width: 20 },
        { header: 'Doanh thu', key: 'revenue', width: 20 },
        { header: 'Số đơn hàng', key: 'orders', width: 15 },
      ]

      const data = [
        { date: '2024-01-01', revenue: 15000000, orders: 25 },
        { date: '2024-01-02', revenue: 18500000, orders: 30 },
        { date: '2024-01-03', revenue: 22000000, orders: 35 },
        { date: '2024-01-04', revenue: 16500000, orders: 28 },
        { date: '2024-01-05', revenue: 25000000, orders: 42 },
      ]

      data.forEach(row => {
        worksheet.addRow(row)
      })

      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `report-${new Date().toISOString().split('T')[0]}.xlsx`
      a.click()
      window.URL.revokeObjectURL(url)
    } else {
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF()

      doc.setFontSize(20)
      doc.text('Bao Cao Ban Hang', 14, 22)
      doc.setFontSize(10)
      doc.text(`Ngay xuat: ${new Date().toLocaleDateString('vi-VN')}`, 14, 30)

      doc.save(`report-${new Date().toISOString().split('T')[0]}.pdf`)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Báo cáo</h1>
          <p className="text-muted-foreground">Xem và xuất báo cáo doanh thu</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport('excel')}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Xuất Excel
          </Button>
          <Button variant="outline" onClick={() => handleExport('pdf')}>
            <FileText className="mr-2 h-4 w-4" />
            Xuất PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="space-y-2">
              <Label>Thời gian</Label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hôm nay</SelectItem>
                  <SelectItem value="week">7 ngày</SelectItem>
                  <SelectItem value="month">30 ngày</SelectItem>
                  <SelectItem value="year">Năm nay</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Loại báo cáo</Label>
              <Select value={reportType} onValueChange={(v) => setReportType(v as typeof reportType)}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Doanh thu</SelectItem>
                  <SelectItem value="orders">Đơn hàng</SelectItem>
                  <SelectItem value="products">Sản phẩm</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Doanh thu tháng này
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(125000000)}</div>
            <p className="text-xs text-green-600">+15% so với tháng trước</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Số đơn hàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-green-600">+8% so với tháng trước</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Khách hàng mới
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">56</div>
            <p className="text-xs text-green-600">+12% so với tháng trước</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sản phẩm đã bán
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,284</div>
            <p className="text-xs text-green-600">+10% so với tháng trước</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Biểu đồ doanh thu</CardTitle>
        </CardHeader>
        <CardContent>
          <SalesChart
            data={[
              { date: '2024-01-01', revenue: '15000000', orders: '25' },
              { date: '2024-01-02', revenue: '18500000', orders: '30' },
              { date: '2024-01-03', revenue: '22000000', orders: '35' },
              { date: '2024-01-04', revenue: '16500000', orders: '28' },
              { date: '2024-01-05', revenue: '25000000', orders: '42' },
              { date: '2024-01-06', revenue: '19000000', orders: '32' },
              { date: '2024-01-07', revenue: '23000000', orders: '38' },
            ]}
            type="day"
          />
        </CardContent>
      </Card>
    </div>
  )
}
