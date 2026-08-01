'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { createOrder } from '@/actions/order'
import { toast } from '@/components/ui/use-toast'
import { Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal, clearCart } = useCartStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState<{ orderNumber: string } | null>(null)

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    shippingCity: 'TP.HCM',
    notes: '',
  })

  const subtotal = getTotal()
  const shippingFee = subtotal >= 500000 ? 0 : 30000
  const discount = 0
  const total = subtotal + shippingFee - discount

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.customerName || !formData.customerEmail || !formData.customerPhone || !formData.shippingAddress || !formData.shippingCity) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng điền đầy đủ thông tin',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('customerName', formData.customerName)
      formDataToSend.append('customerEmail', formData.customerEmail)
      formDataToSend.append('customerPhone', formData.customerPhone)
      formDataToSend.append('shippingAddress', formData.shippingAddress)
      formDataToSend.append('shippingCity', formData.shippingCity)
      formDataToSend.append('notes', formData.notes)
      formDataToSend.append('items', JSON.stringify(items))
      formDataToSend.append('subtotal', subtotal.toString())
      formDataToSend.append('shippingFee', shippingFee.toString())
      formDataToSend.append('discount', discount.toString())

      const result = await createOrder(formDataToSend)

      if (result?.error) {
        toast({
          title: 'Lỗi',
          description: result.error,
          variant: 'destructive',
        })
        return
      }

      clearCart()
      setOrderSuccess({ orderNumber: result.orderNumber! })
      toast({
        title: 'Thành công',
        description: 'Đơn hàng đã được tạo thành công',
      })
    } catch {
      toast({
        title: 'Lỗi',
        description: 'Đã xảy ra lỗi',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-16">
          <div className="container mx-auto px-4 text-center max-w-md">
            <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-green-100 flex items-center justify-center animate-bounce-in">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Đặt hàng thành công!</h1>
            <p className="text-muted-foreground mb-2">
              Cảm ơn bạn đã đặt hàng
            </p>
            <p className="text-lg font-medium mb-8">
              Mã đơn hàng: <span className="text-primary">{orderSuccess.orderNumber}</span>
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Chúng tôi đã gửi email xác nhận đơn hàng đến <strong>{formData.customerEmail}</strong>.
              Bạn có thể theo dõi đơn hàng trong mục &quot;Đơn hàng của tôi&quot;.
            </p>
            <div className="flex flex-col gap-3">
              <Button onClick={() => router.push(`/orders?orderNumber=${orderSuccess.orderNumber}`)}>
                Xem chi tiết đơn hàng
              </Button>
              <Button variant="outline" onClick={() => router.push('/products')}>
                Tiếp tục mua sắm
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (items.length === 0) {
    router.push('/cart')
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" asChild>
              <Link href="/cart">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại giỏ hàng
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Thanh toán</h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Shipping Info */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin giao hàng</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="customerName">Họ và tên *</Label>
                        <Input
                          id="customerName"
                          name="customerName"
                          value={formData.customerName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customerPhone">Số điện thoại *</Label>
                        <Input
                          id="customerPhone"
                          name="customerPhone"
                          type="tel"
                          value={formData.customerPhone}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customerEmail">Email *</Label>
                      <Input
                        id="customerEmail"
                        name="customerEmail"
                        type="email"
                        value={formData.customerEmail}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shippingAddress">Địa chỉ giao hàng *</Label>
                      <Input
                        id="shippingAddress"
                        name="shippingAddress"
                        value={formData.shippingAddress}
                        onChange={handleChange}
                        placeholder="Số nhà, đường, phường/xã"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shippingCity">Tỉnh/Thành phố *</Label>
                      <Input
                        id="shippingCity"
                        name="shippingCity"
                        value={formData.shippingCity}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Ghi chú (tùy chọn)</Label>
                      <Input
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Ghi chú cho đơn hàng"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Phương thức thanh toán</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <input type="radio" name="payment" id="cod" defaultChecked className="h-4 w-4" />
                        <Label htmlFor="cod" className="cursor-pointer">
                          <span className="font-medium">Thanh toán khi nhận hàng (COD)</span>
                          <p className="text-sm text-muted-foreground">Trả tiền mặt khi nhận được hàng</p>
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div>
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Đơn hàng của bạn</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white shrink-0">
                          <Image
                            src={item.image || '/placeholder.png'}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-2">{item.name}</p>
                          <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                          <p className="text-sm font-medium text-primary">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter className="flex-col space-y-3">
                    <Separator />
                    <div className="flex justify-between w-full text-sm">
                      <span className="text-muted-foreground">Tạm tính</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between w-full text-sm">
                      <span className="text-muted-foreground">Phí vận chuyển</span>
                      <span>{shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between w-full font-bold text-lg">
                      <span>Tổng cộng</span>
                      <span className="text-primary">{formatPrice(total)}</span>
                    </div>
                    <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Đặt hàng
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}
