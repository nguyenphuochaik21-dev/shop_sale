'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Minus, Plus, ShoppingCart, Heart } from 'lucide-react'
import { useCartStore } from '@/lib/store'

interface Product {
  id: string
  name: string
  slug: string
  price: string | number
  images: string[]
  stock: number
}

export function ProductActions({ product }: { product: Product }) {
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const { addItem } = useCartStore()

  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(prev + delta, product.stock)))
  }

  const handleAddToCart = () => {
    if (product.stock === 0) {
      toast({
        title: 'Hết hàng',
        description: 'Sản phẩm này hiện đang hết hàng',
        variant: 'destructive',
      })
      return
    }

    addItem({
      productId: product.id,
      name: product.name,
      price: price,
      image: product.images[0],
      quantity: quantity,
      stock: product.stock,
    })

    toast({
      title: 'Thành công',
      description: `Đã thêm ${quantity} sản phẩm vào giỏ hàng`,
    })
  }

  const handleBuyNow = () => {
    if (product.stock === 0) {
      toast({
        title: 'Hết hàng',
        description: 'Sản phẩm này hiện đang hết hàng',
        variant: 'destructive',
      })
      return
    }

    addItem({
      productId: product.id,
      name: product.name,
      price: price,
      image: product.images[0],
      quantity: quantity,
      stock: product.stock,
    })

    router.push('/checkout')
  }

  return (
    <div className="space-y-6">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="font-medium">Số lượng:</span>
        <div className="flex items-center border rounded-lg">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Math.min(parseInt(e.target.value) || 1, product.stock)))}
            className="w-16 text-center border-0"
            min={1}
            max={product.stock}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= product.stock}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-sm text-muted-foreground">
          (Còn {product.stock} sản phẩm)
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          size="lg"
          variant="outline"
          onClick={handleAddToCart}
          disabled={isAdding || product.stock === 0}
          className="flex-1"
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Thêm vào giỏ hàng
        </Button>
        <Button
          size="lg"
          onClick={handleBuyNow}
          disabled={product.stock === 0}
          className="flex-1"
        >
          Mua ngay
        </Button>
        <Button size="lg" variant="outline" className="px-4">
          <Heart className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
