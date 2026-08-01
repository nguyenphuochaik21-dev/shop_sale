'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User } from 'lucide-react'

export default function ProfilePage() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-16">
          <div className="container mx-auto px-4">
            <p>Đang tải...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!session) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold mb-8">Tài khoản của tôi</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <Card className="lg:col-span-1">
              <CardContent className="p-6 text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src={session.user?.image || undefined} />
                  <AvatarFallback className="text-2xl">
                    {session.user?.name?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <h2 className="font-semibold text-lg">{session.user?.name}</h2>
                <p className="text-muted-foreground text-sm">{session.user?.email}</p>
                <Separator className="my-4" />
                <div className="space-y-2 text-left text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vai trò:</span>
                    <span className="font-medium">
                      {session.user?.role === 'ADMIN' ? 'Quản trị' : 'Người dùng'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin cá nhân</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Họ và tên</Label>
                      <Input id="name" defaultValue={session.user?.name || ''} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue={session.user?.email || ''} disabled />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input id="phone" type="tel" placeholder="0912 345 678" />
                  </div>
                  <Button>Lưu thay đổi</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Đổi mật khẩu</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Mật khẩu mới</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                  <Button>Đổi mật khẩu</Button>
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
