import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-muted/50">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Đăng nhập thất bại</h1>
        <p className="text-muted-foreground mb-6">
          Đã xảy ra lỗi trong quá trình đăng nhập. Vui lòng thử lại.
        </p>
        <Button asChild>
          <Link href="/auth/login">Quay lại đăng nhập</Link>
        </Button>
      </div>
    </div>
  )
}
