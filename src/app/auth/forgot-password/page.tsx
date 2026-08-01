'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/validations'
import { forgotPassword } from '@/actions/auth'
import { Loader2, ArrowLeft, Mail } from 'lucide-react'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('email', data.email)

      const result = await forgotPassword(formData)

      if (result?.error) {
        toast({
          title: 'Lỗi',
          description: result.error,
          variant: 'destructive',
        })
        return
      }

      setEmailSent(true)
      toast({
        title: 'Thành công',
        description: 'Đã gửi email đặt lại mật khẩu',
      })
    } catch {
      toast({
        title: 'Lỗi',
        description: 'Đã xảy ra lỗi',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-muted/50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Mail className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Kiểm tra email</CardTitle>
            <CardDescription>
              Chúng tôi đã gửi email hướng dẫn đặt lại mật khẩu đến email của bạn.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col space-y-4">
            <Button asChild className="w-full">
              <Link href="/auth/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại đăng nhập
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-muted/50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <Button variant="ghost" asChild className="w-fit px-2 mb-2">
            <Link href="/auth/login">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <CardTitle className="text-2xl font-bold text-center">Quên mật khẩu?</CardTitle>
          <CardDescription className="text-center">
            Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                {...register('email')}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Gửi email đặt lại
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-muted-foreground text-center">
            Nhớ mật khẩu?{' '}
            <Link href="/auth/login" className="text-primary hover:underline">
              Đăng nhập
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
