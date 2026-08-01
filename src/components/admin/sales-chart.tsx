'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { formatPrice } from '@/lib/utils'

interface SalesData {
  date?: string
  month?: string
  revenue: string
  orders?: string
}

export function SalesChart({ data, type }: { data: SalesData[]; type: 'day' | 'month' }) {
  const chartData = data.map((item) => ({
    name: type === 'day'
      ? new Date(item.date!).toLocaleDateString('vi-VN', { day: '2-digit', month: '02-digit' })
      : new Date(item.month!).toLocaleDateString('vi-VN', { month: '02-digit', year: '2-digit' }),
    revenue: Number(item.revenue) || 0,
    orders: type === 'day' ? Number(item.orders) || 0 : undefined,
  }))

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string }[]; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-primary">
            Doanh thu: {formatPrice(payload[0]?.value || 0)}
          </p>
          {type === 'day' && payload[1] && (
            <p className="text-sm text-muted-foreground">
              Đơn hàng: {payload[1]?.value || 0}
            </p>
          )}
        </div>
      )
    }
    return null
  }

  if (chartData.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        Chưa có dữ liệu doanh thu
      </div>
    )
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            className="text-muted-foreground"
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
            className="text-muted-foreground"
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="revenue"
            fill="hsl(var(--primary))"
            radius={[4, 4, 0, 0]}
            name="Doanh thu"
          />
          {type === 'day' && (
            <Bar
              dataKey="orders"
              fill="hsl(var(--muted))"
              radius={[4, 4, 0, 0]}
              name="Đơn hàng"
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
