import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'

async function getCategories() {
  return prisma.category.findMany({
    where: { parentId: null },
    include: {
      _count: { select: { products: true } },
    },
    orderBy: { name: 'asc' },
  })
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Danh mục sản phẩm</h1>
            <p className="text-muted-foreground">
              Khám phá các danh mục sản phẩm của chúng tôi
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/products?category=${category.slug}`}>
                <Card className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg">
                  <div className="aspect-video relative">
                    <Image
                      src={category.image || '/placeholder.png'}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h2 className="text-2xl font-bold text-white">{category.name}</h2>
                      <p className="text-white/70">
                        {category._count.products} sản phẩm
                      </p>
                    </div>
                  </div>
                  {category.description && (
                    <CardContent className="p-4">
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {category.description}
                      </p>
                    </CardContent>
                  )}
                </Card>
              </Link>
            ))}
          </div>

          {categories.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">Chưa có danh mục nào</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
