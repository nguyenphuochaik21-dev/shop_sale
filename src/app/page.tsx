import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Star, Truck, Shield, CreditCard } from 'lucide-react'
import Image from 'next/image'

async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    where: { isFeatured: true, isActive: true },
    take: 8,
    orderBy: { createdAt: 'desc' },
  })
  return products
}

async function getCategories() {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    include: { _count: { select: { products: true } } },
    take: 6,
  })
  return categories
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts()
  const categories = await getCategories()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/10 via-background to-background py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Badge variant="secondary" className="px-4 py-1 text-sm">
                  Chào mừng đến với WebSale
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  Mua sắm thông minh,{' '}
                  <span className="text-primary">Tiết kiệm chi phí</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-md">
                  Khám phá hàng ngàn sản phẩm công nghệ chất lượng cao với giá cả hợp lý.
                  Giao hàng nhanh chóng, bảo hành uy tín.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button asChild size="lg">
                    <Link href="/products">
                      Mua sắm ngay
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/about">Tìm hiểu thêm</Link>
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-3xl blur-3xl" />
                <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-4 p-8">
                    {featuredProducts.slice(0, 4).map((product) => (
                      <div key={product.id} className="relative aspect-square rounded-xl overflow-hidden bg-background shadow-lg">
                        <Image
                          src={product.images[0] || '/placeholder.png'}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-12 border-y bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Miễn phí vận chuyển</p>
                  <p className="text-sm text-muted-foreground">Đơn hàng từ 500K</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Bảo hành 12 tháng</p>
                  <p className="text-sm text-muted-foreground">Chính hãng 100%</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Thanh toán an toàn</p>
                  <p className="text-sm text-muted-foreground">Nhiều hình thức</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Star className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Hỗ trợ 24/7</p>
                  <p className="text-sm text-muted-foreground">Luôn sẵn sàng</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">Danh mục sản phẩm</h2>
                <p className="text-muted-foreground mt-1">Tìm kiếm theo danh mục</p>
              </div>
              <Button variant="ghost" asChild>
                <Link href="/categories">
                  Xem tất cả
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <Link key={category.id} href={`/categories/${category.slug}`}>
                  <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg">
                    <div className="aspect-square relative overflow-hidden">
                      <Image
                        src={category.image || '/placeholder.png'}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="font-semibold text-white">{category.name}</h3>
                        <p className="text-xs text-white/70">
                          {category._count.products} sản phẩm
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">Sản phẩm nổi bật</h2>
                <p className="text-muted-foreground mt-1">Những sản phẩm được yêu thích nhất</p>
              </div>
              <Button variant="ghost" asChild>
                <Link href="/products?featured=true">
                  Xem tất cả
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Link key={product.id} href={`/products/${product.slug}`}>
                  <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg">
                    <div className="aspect-square relative overflow-hidden bg-white">
                      <Image
                        src={product.images[0] || '/placeholder.png'}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      {product.comparePrice && product.comparePrice > product.price && (
                        <Badge className="absolute top-2 left-2 bg-red-500">
                          -{Math.round((1 - Number(product.price) / Number(product.comparePrice)) * 100)}%
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium line-clamp-2 mb-2 min-h-[3rem]">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-bold text-primary">
                          {formatPrice(Number(product.price))}
                        </span>
                        {product.comparePrice && product.comparePrice > product.price && (
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(Number(product.comparePrice))}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                        <span className="text-xs text-muted-foreground ml-1">(0)</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="relative rounded-3xl bg-primary text-primary-foreground p-8 md:p-12 overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
              </div>
              <div className="relative grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">
                    Đăng ký nhận tin khuyến mãi
                  </h2>
                  <p className="opacity-90 mb-6">
                    Đăng ký ngay để nhận thông báo về các sản phẩm mới và khuyến mãi hấp dẫn.
                  </p>
                  <div className="flex gap-3">
                    <input
                      type="email"
                      placeholder="Nhập email của bạn"
                      className="flex-1 h-12 px-4 rounded-lg bg-white/10 border border-white/20 placeholder:text-white/50 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                    <Button size="lg" variant="secondary" className="h-12">
                      Đăng ký
                    </Button>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="text-6xl md:text-8xl font-bold opacity-20">
                    20%
                  </div>
                  <p className="text-xl font-medium">Giảm giá cho đơn hàng đầu tiên</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
