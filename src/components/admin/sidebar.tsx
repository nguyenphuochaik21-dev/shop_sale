'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  FolderTree,
  BarChart3,
  Settings,
  ChevronLeft,
  ShoppingCart,
  FileText,
  Tag,
  Palette,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'

const navItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Đơn hàng',
    href: '/admin/orders',
    icon: ShoppingBag,
  },
  {
    title: 'Sản phẩm',
    href: '/admin/products',
    icon: Package,
  },
  {
    title: 'Danh mục',
    href: '/admin/categories',
    icon: FolderTree,
  },
  {
    title: 'Khách hàng',
    href: '/admin/customers',
    icon: Users,
  },
  {
    title: 'Báo cáo',
    href: '/admin/reports',
    icon: BarChart3,
  },
  {
    title: 'Hóa đơn',
    href: '/admin/invoices',
    icon: FileText,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r bg-background px-6 pb-4">
          {/* Logo */}
          <div className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <ShoppingCart className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">WebSale Admin</span>
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="space-y-1">
                  {navItems.map((item) => (
                    <li key={item.title}>
                      <Link
                        href={item.href}
                        className={cn(
                          'group flex gap-x-3 rounded-md p-2 text-sm font-medium transition-colors',
                          pathname === item.href
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        )}
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto space-y-1">
                <Link
                  href="/admin/settings"
                  className={cn(
                    'group flex gap-x-3 rounded-md p-2 text-sm font-medium transition-colors',
                    pathname === '/admin/settings'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  <Settings className="h-5 w-5 shrink-0" />
                  Cài đặt
                </Link>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-x-3 rounded-md p-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  <LogOut className="h-5 w-5 shrink-0" />
                  Đăng xuất
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-16 border-b bg-background flex items-center px-4 gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <ShoppingCart className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold">Admin</span>
        </div>
        <nav className="flex-1 flex items-center gap-2 overflow-x-auto">
          {navItems.slice(0, 4).map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className={cn(
                'flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors shrink-0',
                pathname === item.href
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}
