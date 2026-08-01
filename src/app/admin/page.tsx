import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DollarSign, ShoppingBag, Users, Package, TrendingUp, TrendingDown } from 'lucide-react'
import { RecentOrders } from '@/components/admin/recent-orders'
import { SalesChart } from '@/components/admin/sales-chart'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

async function getDashboardStats() {
  const today = new Date()
  const startOfToday = new Date(today.setHours(0, 0, 0, 0))
  const startOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const startOfThisYear = new Date(today.getFullYear(), 0, 1)

  const [
    totalRevenue,
    todayRevenue,
    monthRevenue,
    totalOrders,
    pendingOrders,
    totalCustomers,
    totalProducts,
    recentOrders,
    salesByDay,
    salesByMonth,
  ] = await Promise.all([
    prisma.order.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { total: true },
    }),
    prisma.order.aggregate({
      where: {
        status: 'COMPLETED',
        createdAt: { gte: startOfToday },
      },
      _sum: { total: true },
    }),
    prisma.order.aggregate({
      where: {
        status: 'COMPLETED',
        createdAt: { gte: startOfThisMonth },
      },
      _sum: { total: true },
    }),
    prisma.order.count(),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.user.count({ where: { role: 'USER' } }),
    prisma.product.count(),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
      },
    }),
    prisma.$queryRaw`
      SELECT DATE(createdAt) as date, SUM(total) as revenue, COUNT(*) as orders
      FROM orders
      WHERE status = 'COMPLETED' AND createdAt >= NOW() - INTERVAL '7 days'
      GROUP BY DATE(createdAt)
      ORDER BY date ASC
    `,
    prisma.$queryRaw`
      SELECT DATE_TRUNC('month', createdAt) as month, SUM(total) as revenue
      FROM orders
      WHERE status = 'COMPLETED' AND createdAt >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', createdAt)
      ORDER BY month ASC
    `,
  ])

  return {
    totalRevenue: totalRevenue._sum.total || 0,
    todayRevenue: todayRevenue._sum.total || 0,
    monthRevenue: monthRevenue._sum.total || 0,
    totalOrders,
    pendingOrders,
    totalCustomers,
    totalProducts,
    recentOrders,
    salesByDay: salesByDay as { date: string; revenue: string; orders: string }[],
    salesByMonth: salesByMonth as { month: string; revenue: string }[],
  }
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats()

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Tổng quan về cửa hàng của bạn</p>
        </div>
        <Button asChild>
          <Link href="/admin/orders">
            Xem đơn hàng
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
            <div className="h-4 w-4 rounded-full bg-green-500/10 p-2">
              <DollarSign className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(Number(stats.totalRevenue))}</div>
            <p className="text-xs text-muted-foreground">
              Tháng này: {formatPrice(Number(stats.monthRevenue))}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đơn hàng</CardTitle>
            <div className="h-4 w-4 rounded-full bg-blue-500/10 p-2">
              <ShoppingBag className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <div className="flex items-center gap-2">
              {stats.pendingOrders > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {stats.pendingOrders} chờ xử lý
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khách hàng</CardTitle>
            <div className="h-4 w-4 rounded-full bg-purple-500/10 p-2">
              <Users className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">Người dùng đã đăng ký</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sản phẩm</CardTitle>
            <div className="h-4 w-4 rounded-full bg-orange-500/10 p-2">
              <Package className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Sản phẩm trong cửa hàng</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Doanh thu 7 ngày gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <SalesChart data={stats.salesByDay} type="day" />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Đơn hàng gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentOrders orders={stats.recentOrders} />
          </CardContent>
        </Card>
      </div>

      {/* Monthly Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Doanh thu 12 tháng</CardTitle>
        </CardHeader>
        <CardContent>
          <SalesChart data={stats.salesByMonth} type="month" />
        </CardContent>
      </Card>
    </div>
  )
}
