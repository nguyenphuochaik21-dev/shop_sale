import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, SlidersHorizontal, Star, Grid, List } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

type SearchParams = {
  search?: string
  category?: string
  sort?: string
  minPrice?: string
  maxPrice?: string
  page?: string
}

async function getProducts(searchParams: SearchParams) {
  const page = parseInt(searchParams.page || '1')
  const perPage = 12

  const where: Record<string, unknown> = {
    isActive: true,
  }

  if (searchParams.search) {
    where.OR = [
      { name: { contains: searchParams.search, mode: 'insensitive' } },
      { description: { contains: searchParams.search, mode: 'insensitive' } },
    ]
  }

  if (searchParams.category) {
    where.category = { slug: searchParams.category }
  }

  if (searchParams.minPrice || searchParams.maxPrice) {
    where.price = {}
    if (searchParams.minPrice) {
      (where.price as Record<string, number>).gte = parseFloat(searchParams.minPrice)
    }
    if (searchParams.maxPrice) {
      (where.price as Record<string, number>).lte = parseFloat(searchParams.maxPrice)
    }
  }

  let orderBy: Record<string, string> = { createdAt: 'desc' }
  if (searchParams.sort === 'price-asc') {
    orderBy = { price: 'asc' }
  } else if (searchParams.sort === 'price-desc') {
    orderBy = { price: 'desc' }
  } else if (searchParams.sort === 'name') {
    orderBy = { name: 'asc' }
  }

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * perPage,
      take: perPage,
      include: { category: true },
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({ where: { parentId: null } }),
  ])

  return {
    products,
    total,
    page,
    perPage,
    totalPages: Math.ceil(total / perPage),
    categories,
  }
}

async function getCategories() {
  return prisma.category.findMany({ where: { parentId: null } })
}

function ProductSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-square" />
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-6 w-1/3" />
      </CardContent>
    </Card>
  )
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { products, total, page, totalPages, categories } = await getProducts(searchParams)
  const allCategories = await getCategories()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm">
            <ol className="flex items-center gap-2 text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary">Trang chủ</Link>
              </li>
              <li>/</li>
              <li className="text-foreground">Sản phẩm</li>
              {searchParams.category && (
                <>
                  <li>/</li>
                  <li className="text-foreground">
                    {categories.find((c) => c.slug === searchParams.category)?.name}
                  </li>
                </>
              )}
            </ol>
          </nav>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:w-64 shrink-0">
              <div className="sticky top-24 space-y-6">
                <div>
                  <h3 className="font-semibold mb-4">Danh mục</h3>
                  <div className="space-y-2">
                    <Link
                      href="/products"
                      className={`block px-3 py-2 rounded-lg transition-colors ${
                        !searchParams.category
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      Tất cả sản phẩm
                    </Link>
                    {allCategories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/products?category=${category.slug}`}
                        className={`block px-3 py-2 rounded-lg transition-colors ${
                          searchParams.category === category.slug
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted'
                        }`}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Khoảng giá</h3>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Từ"
                        className="w-full"
                        defaultValue={searchParams.minPrice}
                      />
                      <Input
                        type="number"
                        placeholder="Đến"
                        className="w-full"
                        defaultValue={searchParams.maxPrice}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Search & Sort Bar */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <form>
                    <Input
                      type="search"
                      placeholder="Tìm kiếm sản phẩm..."
                      className="pl-10"
                      name="search"
                      defaultValue={searchParams.search}
                    />
                    {searchParams.category && (
                      <input type="hidden" name="category" value={searchParams.category} />
                    )}
                  </form>
                </div>
                <Select defaultValue={searchParams.sort || 'latest'}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Sắp xếp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">Mới nhất</SelectItem>
                    <SelectItem value="price-asc">Giá: Thấp đến cao</SelectItem>
                    <SelectItem value="price-desc">Giá: Cao đến thấp</SelectItem>
                    <SelectItem value="name">Tên A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Results Info */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">
                  Hiển thị {(page - 1) * 12 + 1} - {Math.min(page * 12, total)} của {total} sản phẩm
                </p>
              </div>

              {/* Products */}
              <Suspense fallback={
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <ProductSkeleton key={i} />
                  ))}
                </div>
              }>
                {products.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
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
                            {product.isFeatured && (
                              <Badge className="absolute top-2 right-2 bg-primary">
                                Nổi bật
                              </Badge>
                            )}
                          </div>
                          <CardContent className="p-4">
                            <p className="text-xs text-muted-foreground mb-1">
                              {product.category?.name}
                            </p>
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
                                <Star key={i} className="h-3 w-3 fill-current" />
                              ))}
                              <span className="text-xs text-muted-foreground ml-1">(0)</span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <p className="text-muted-foreground mb-4">Không tìm thấy sản phẩm nào</p>
                    <Button asChild variant="outline">
                      <Link href="/products">Xem tất cả sản phẩm</Link>
                    </Button>
                  </div>
                )}
              </Suspense>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  {page > 1 && (
                    <Button variant="outline" asChild>
                      <Link href={`/products?page=${page - 1}`}>Trước</Link>
                    </Button>
                  )}
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i}
                      variant={page === i + 1 ? 'default' : 'outline'}
                      asChild
                    >
                      <Link href={`/products?page=${i + 1}`}>{i + 1}</Link>
                    </Button>
                  ))}
                  {page < totalPages && (
                    <Button variant="outline" asChild>
                      <Link href={`/products?page=${page + 1}`}>Sau</Link>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
