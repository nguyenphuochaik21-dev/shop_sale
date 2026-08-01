'use client'

import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function CartPage() {
  const router = useRouter()
  const { items, updateQuantity, removeItem, getTotal } = useCartStore()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.title = 'Giỏ hàng - WebSale'
    }
  }, [])

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="mx-auto mb-6 h-24 w-24 rounded-full bg-muted flex items-center justify-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Giỏ hàng trống</h1>
            <p className="text-muted-foreground mb-8">Hãy thêm sản phẩm vào giỏ hàng của bạn</p>
            <Button asChild size="lg">
              <Link href="/products">Tiếp tục mua sắm</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-8">Giỏ hàng ({items.length} sản phẩm)</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <Link href={`/products/${item.productId}`} className="shrink-0">
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-white">
                          <Image
                            src={item.image || '/placeholder.png'}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link href={`/products/${item.productId}`}>
                          <h3 className="font-medium line-clamp-2 hover:text-primary">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="text-primary font-bold mt-1">
                          {formatPrice(item.price)}
                        </p>
                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex items-center border rounded-lg">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-10 text-center text-sm">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              disabled={item.quantity >= item.stock}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => removeItem(item.productId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Tổng cộng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tạm tính</span>
                    <span>{formatPrice(getTotal())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Giảm giá</span>
                    <span>{formatPrice(0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Phí vận chuyển</span>
                    <span>{getTotal() >= 500000 ? 'Miễn phí' : formatPrice(30000)}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex-col space-y-4">
                  <div className="flex justify-between w-full text-lg font-bold">
                    <span>Tổng cộng</span>
                    <span className="text-primary">
                      {formatPrice(getTotal() >= 500000 ? getTotal() : getTotal() + 30000)}
                    </span>
                  </div>
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() => router.push('/checkout')}
                  >
                    Thanh toán
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/products">Tiếp tục mua sắm</Link>
                  </Button>
                </CardFooter>
              </Card>

              {/* Shipping Info */}
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground text-center">
                  {getTotal() >= 500000 ? (
                    <span className="text-green-600 font-medium">✓ Bạn đã đủ điều kiện được miễn phí vận chuyển!</span>
                  ) : (
                    <>Mua thêm <strong>{formatPrice(500000 - getTotal())}</strong> để được miễn phí vận chuyển</>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
