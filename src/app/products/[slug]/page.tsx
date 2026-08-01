import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Star, Minus, Plus, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { ProductActions } from './product-actions'

async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      category: true,
      reviews: {
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: true },
      },
    },
  })
  return product
}

async function getRelatedProducts(categoryId: string, productId: string) {
  return prisma.product.findMany({
    where: {
      categoryId,
      isActive: true,
      id: { not: productId },
    },
    take: 4,
  })
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product.categoryId || '', product.id)

  const averageRating = product.reviews.length > 0
    ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
    : 0

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm">
            <ol className="flex items-center gap-2 text-muted-foreground">
              <li><Link href="/" className="hover:text-primary">Trang chủ</Link></li>
              <li>/</li>
              <li><Link href="/products" className="hover:text-primary">Sản phẩm</Link></li>
              <li>/</li>
              {product.category && (
                <>
                  <li>
                    <Link href={`/products?category=${product.category.slug}`} className="hover:text-primary">
                      {product.category.name}
                    </Link>
                  </li>
                  <li>/</li>
                </>
              )}
              <li className="text-foreground truncate max-w-[200px]">{product.name}</li>
            </ol>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square relative rounded-xl overflow-hidden bg-white border">
                <Image
                  src={product.images[0] || '/placeholder.png'}
                  alt={product.name}
                  fill
                  className="object-contain"
                  priority
                />
                {product.comparePrice && product.comparePrice > product.price && (
                  <Badge className="absolute top-4 left-4 bg-red-500 text-lg px-3 py-1">
                    -{Math.round((1 - Number(product.price) / Number(product.comparePrice)) * 100)}%
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className="aspect-square relative rounded-lg overflow-hidden border bg-white"
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {product.category && (
                    <Badge variant="secondary">{product.category.name}</Badge>
                  )}
                  {product.isFeatured && <Badge>Hot</Badge>}
                </div>
                <h1 className="text-3xl font-bold">{product.name}</h1>
                {product.sku && (
                  <p className="text-sm text-muted-foreground mt-1">SKU: {product.sku}</p>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < Math.round(averageRating) ? 'fill-current' : 'text-muted'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  ({product.reviews.length} đánh giá)
                </span>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-bold text-primary">
                    {formatPrice(Number(product.price))}
                  </span>
                  {product.comparePrice && product.comparePrice > product.price && (
                    <span className="text-xl text-muted-foreground line-through">
                      {formatPrice(Number(product.comparePrice))}
                    </span>
                  )}
                </div>
                {product.comparePrice && product.comparePrice > product.price && (
                  <p className="text-sm text-green-600 font-medium">
                    Tiết kiệm {formatPrice(Number(product.comparePrice) - Number(product.price))}
                  </p>
                )}
              </div>

              {/* Stock */}
              <div className="flex items-center gap-2">
                {product.stock > 0 ? (
                  <>
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm text-green-600 font-medium">Còn hàng ({product.stock})</span>
                  </>
                ) : (
                  <>
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                    <span className="text-sm text-red-600 font-medium">Hết hàng</span>
                  </>
                )}
              </div>

              <Separator />

              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2">Mô tả sản phẩm</h3>
                <p className="text-muted-foreground whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              <Separator />

              {/* Actions */}
              <ProductActions product={product} />

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <Truck className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Miễn phí vận chuyển</p>
                </div>
                <div className="text-center">
                  <Shield className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Bảo hành 12 tháng</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Đổi trả 7 ngày</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Đánh giá sản phẩm</h2>
            {product.reviews.length > 0 ? (
              <div className="grid gap-4">
                {product.reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                            {review.user.name?.[0] || 'U'}
                          </div>
                          <div>
                            <p className="font-medium">{review.user.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-yellow-500">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'text-muted'}`} />
                          ))}
                        </div>
                      </div>
                      {review.title && <h4 className="font-medium mb-1">{review.title}</h4>}
                      {review.content && <p className="text-muted-foreground">{review.content}</p>}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này!
              </p>
            )}
          </section>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts.map((p) => (
                  <Link key={p.id} href={`/products/${p.slug}`}>
                    <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg">
                      <div className="aspect-square relative overflow-hidden bg-white">
                        <Image
                          src={p.images[0] || '/placeholder.png'}
                          alt={p.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium line-clamp-2 mb-2 min-h-[3rem]">{p.name}</h3>
                        <span className="text-lg font-bold text-primary">
                          {formatPrice(Number(p.price))}
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
